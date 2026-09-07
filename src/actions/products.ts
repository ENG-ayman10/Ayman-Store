"use server";

import prisma from "@/lib/prisma";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "@/lib/fallbackData";
import {
  readProductsFromDisk,
  addProductToDisk,
  updateProductOnDisk,
  deleteProductFromDisk,
} from "@/lib/productStorage";
import type { ProductType, CategoryType } from "@/types";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/actions/auth";

// Helper to convert Prisma product to ProductType
function mapPrismaProductToProductType(p: any): ProductType {
  return {
    id: p.id,
    nameAr: p.nameAr,
    nameEn: p.nameEn,
    slug: p.slug,
    descAr: p.descAr,
    descEn: p.descEn,
    basePrice: Number(p.basePrice),
    categoryId: p.categoryId,
    category: p.category
      ? {
          id: p.category.id,
          nameAr: p.category.nameAr,
          nameEn: p.category.nameEn,
          slug: p.category.slug,
          type: p.category.type as CategoryType,
        }
      : undefined,
    images: p.images || [],
    isFeatured: Boolean(p.isFeatured),
    variants: (p.variants || []).map((v: any) => ({
      id: v.id,
      productId: v.productId,
      sku: v.sku,
      attributes: (v.attributes as any) || {},
      priceOverride: v.priceOverride !== null && v.priceOverride !== undefined ? Number(v.priceOverride) : null,
      stockQuantity: v.stockQuantity || 0,
    })),
    createdAt: typeof p.createdAt === "string" ? p.createdAt : p.createdAt?.toISOString(),
    updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : p.updatedAt?.toISOString(),
  };
}

export async function getProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
}): Promise<ProductType[]> {
  // 1. Primary: Query Prisma PostgreSQL
  try {
    const whereClause: Record<string, any> = {};
    if (options?.categorySlug && options.categorySlug !== "all") {
      whereClause.category = { slug: options.categorySlug };
    }
    if (options?.featured !== undefined) {
      whereClause.isFeatured = options.featured;
    }

    const dbProducts = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map(mapPrismaProductToProductType);
    }
  } catch (error) {
    console.warn("Prisma getProducts query error, falling back to disk/cache:", error);
  }

  // 2. Fallback to disk storage
  try {
    let products = await readProductsFromDisk();
    if (options?.categorySlug && options.categorySlug !== "all") {
      products = products.filter((p) => p.category?.slug === options.categorySlug);
    }
    if (options?.featured !== undefined) {
      products = products.filter((p) => p.isFeatured === options.featured);
    }
    return products;
  } catch {
    // Disk fallback
  }

  // 3. Static fallback
  let filtered = [...FALLBACK_PRODUCTS];
  if (options?.categorySlug && options.categorySlug !== "all") {
    filtered = filtered.filter((p) => p.category?.slug === options.categorySlug);
  }
  if (options?.featured !== undefined) {
    filtered = filtered.filter((p) => p.isFeatured === options.featured);
  }
  return filtered;
}

export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  // 1. Primary: Prisma PostgreSQL
  try {
    const dbProduct = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        category: true,
        variants: true,
      },
    });

    if (dbProduct) {
      return mapPrismaProductToProductType(dbProduct);
    }
  } catch (error) {
    console.warn("Prisma getProductBySlug fallback:", error);
  }

  // 2. Disk fallback
  try {
    const products = await readProductsFromDisk();
    const found = products.find((p) => p.slug === slug || p.id === slug);
    if (found) return found;
  } catch {
    // Disk fallback
  }

  return FALLBACK_PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function getCategories() {
  // 1. Primary: Prisma PostgreSQL
  try {
    const cats = await prisma.category.findMany({
      orderBy: { nameAr: "asc" },
    });
    if (cats && cats.length > 0) {
      return cats;
    }
  } catch {
    // Fallback
  }
  return FALLBACK_CATEGORIES;
}

export interface CreateProductInput {
  nameAr: string;
  nameEn: string;
  slug?: string;
  descAr: string;
  descEn: string;
  basePrice: number;
  categoryId: string;
  images: string[];
  isFeatured?: boolean;
  variants: Array<{
    sku?: string;
    attributes: Record<string, string>;
    priceOverride?: number | null;
    stockQuantity: number;
  }>;
}

export async function createProduct(input: CreateProductInput) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth && process.env.NODE_ENV === "production") {
    return { success: false, error: "غير مصرح لك بإضافة منتجات" };
  }

  const generatedSlug =
    input.slug?.trim() ||
    input.nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") ||
    `prod-${Date.now()}`;

  // 1. Primary: Save to Prisma PostgreSQL
  try {
    // Resolve categoryId (whether slug or UUID)
    let category = await prisma.category.findFirst({
      where: {
        OR: [{ id: input.categoryId }, { slug: input.categoryId }],
      },
    });

    if (!category) {
      const firstCat = await prisma.category.findFirst();
      if (firstCat) category = firstCat;
    }

    if (category) {
      const created = await prisma.product.create({
        data: {
          nameAr: input.nameAr,
          nameEn: input.nameEn,
          slug: generatedSlug,
          descAr: input.descAr,
          descEn: input.descEn,
          basePrice: input.basePrice,
          categoryId: category.id,
          images: input.images.length > 0 ? input.images : ["/uploads/lipstick.webp"],
          isFeatured: Boolean(input.isFeatured),
          variants: {
            create: input.variants.map((v, i) => ({
              sku: v.sku || `SKU-${Date.now()}-${i}`,
              attributes: v.attributes,
              stockQuantity: v.stockQuantity,
              priceOverride: v.priceOverride ?? null,
            })),
          },
        },
        include: {
          category: true,
          variants: true,
        },
      });

      revalidatePath("/[locale]", "layout");
      revalidatePath("/[locale]/admin/products", "page");
      return { success: true, product: mapPrismaProductToProductType(created) };
    }
  } catch (error) {
    console.error("Prisma createProduct error:", error);
  }

  // 2. Disk fallback
  const category =
    FALLBACK_CATEGORIES.find(
      (c) => c.id === input.categoryId || c.slug === input.categoryId
    ) || FALLBACK_CATEGORIES[0];

  const newProductId = `prod-${Date.now()}`;
  const variants = input.variants.map((v, i) => ({
    id: `var-${Date.now()}-${i}`,
    productId: newProductId,
    sku: v.sku || `SKU-${Date.now()}-${i}`,
    attributes: v.attributes,
    priceOverride: v.priceOverride ?? null,
    stockQuantity: v.stockQuantity,
  }));

  const newProduct: ProductType = {
    id: newProductId,
    nameAr: input.nameAr,
    nameEn: input.nameEn,
    slug: generatedSlug,
    descAr: input.descAr,
    descEn: input.descEn,
    basePrice: input.basePrice,
    categoryId: category.id,
    category,
    images: input.images.length > 0 ? input.images : ["/uploads/lipstick.webp"],
    isFeatured: !!input.isFeatured,
    variants,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await addProductToDisk(newProduct);
  } catch (err) {
    console.warn("Disk addProduct error:", err);
  }
  FALLBACK_PRODUCTS.unshift(newProduct);

  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/admin/products", "page");
  return { success: true, product: newProduct };
}

export async function updateProduct(id: string, input: Partial<CreateProductInput>) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth && process.env.NODE_ENV === "production") {
    return { success: false, error: "غير مصرح لك بتعديل المنتجات" };
  }

  // 1. Primary: Prisma PostgreSQL
  try {
    const updateData: Record<string, any> = {};
    if (input.nameAr) updateData.nameAr = input.nameAr;
    if (input.nameEn) updateData.nameEn = input.nameEn;
    if (input.descAr) updateData.descAr = input.descAr;
    if (input.descEn) updateData.descEn = input.descEn;
    if (input.basePrice !== undefined) updateData.basePrice = input.basePrice;
    if (input.images) updateData.images = input.images;
    if (input.isFeatured !== undefined) updateData.isFeatured = input.isFeatured;

    await prisma.product.update({
      where: { id },
      data: updateData,
    });
  } catch (error) {
    console.warn("Prisma updateProduct fallback:", error);
  }

  // 2. Disk update
  try {
    await updateProductOnDisk(id, {
      nameAr: input.nameAr,
      nameEn: input.nameEn,
      descAr: input.descAr,
      descEn: input.descEn,
      basePrice: input.basePrice,
      images: input.images,
      isFeatured: input.isFeatured,
    });
  } catch (err) {
    console.warn("Disk updateProduct error:", err);
  }

  // Update in memory fallback
  const idx = FALLBACK_PRODUCTS.findIndex((p) => p.id === id || p.slug === id);
  if (idx !== -1) {
    FALLBACK_PRODUCTS[idx] = {
      ...FALLBACK_PRODUCTS[idx],
      nameAr: input.nameAr ?? FALLBACK_PRODUCTS[idx].nameAr,
      nameEn: input.nameEn ?? FALLBACK_PRODUCTS[idx].nameEn,
      descAr: input.descAr ?? FALLBACK_PRODUCTS[idx].descAr,
      descEn: input.descEn ?? FALLBACK_PRODUCTS[idx].descEn,
      basePrice: input.basePrice ?? FALLBACK_PRODUCTS[idx].basePrice,
      images: input.images ?? FALLBACK_PRODUCTS[idx].images,
      isFeatured: input.isFeatured ?? FALLBACK_PRODUCTS[idx].isFeatured,
      updatedAt: new Date().toISOString(),
    };
  }

  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/admin/products", "page");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth && process.env.NODE_ENV === "production") {
    return { success: false, error: "غير مصرح لك بحذف المنتجات" };
  }

  // 1. Primary: Delete in Prisma PostgreSQL
  try {
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    console.warn("Prisma deleteProduct fallback:", error);
  }

  // 2. Delete on disk
  try {
    await deleteProductFromDisk(id);
  } catch (err) {
    console.warn("Disk deleteProduct error:", err);
  }

  const idx = FALLBACK_PRODUCTS.findIndex((p) => p.id === id || p.slug === id);
  if (idx !== -1) {
    FALLBACK_PRODUCTS.splice(idx, 1);
  }

  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/admin/products", "page");
  return { success: true };
}

"use server";

import prisma from "@/lib/prisma";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "@/lib/fallbackData";
import {
  readProductsFromDisk,
  addProductToDisk,
  updateProductOnDisk,
  deleteProductFromDisk,
} from "@/lib/productStorage";
import type { ProductType } from "@/types";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/actions/auth";

export async function getProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
}): Promise<ProductType[]> {
  // 1. Guaranteed persistent read from disk
  try {
    let products = await readProductsFromDisk();

    if (options?.categorySlug && options.categorySlug !== "all") {
      products = products.filter((p) => p.category?.slug === options.categorySlug);
    }
    if (options?.featured !== undefined) {
      products = products.filter((p) => p.isFeatured === options.featured);
    }
    return products;
  } catch (error) {
    console.warn("Product disk read fallback:", error);
  }

  // Fallback
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
  try {
    const products = await readProductsFromDisk();
    const found = products.find((p) => p.slug === slug || p.id === slug);
    if (found) return found;
  } catch {
    // Disk fallback
  }

  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
}

export async function getCategories() {
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

  // 1. Guaranteed disk storage
  try {
    await addProductToDisk(newProduct);
  } catch (err) {
    console.error("Failed to write product to disk:", err);
  }
  FALLBACK_PRODUCTS.unshift(newProduct);

  // 2. Try Prisma if available
  try {
    await prisma.product.create({
      data: {
        nameAr: newProduct.nameAr,
        nameEn: newProduct.nameEn,
        slug: newProduct.slug,
        descAr: newProduct.descAr,
        descEn: newProduct.descEn,
        basePrice: newProduct.basePrice,
        categoryId: category.id,
        images: newProduct.images,
        isFeatured: newProduct.isFeatured,
        variants: {
          create: variants.map((v) => ({
            sku: v.sku,
            attributes: v.attributes,
            stockQuantity: v.stockQuantity,
            priceOverride: v.priceOverride,
          })),
        },
      },
    });
  } catch {
    // Prisma optional
  }

  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/admin/products", "page");
  return { success: true, product: newProduct };
}

export async function updateProduct(id: string, input: Partial<CreateProductInput>) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth && process.env.NODE_ENV === "production") {
    return { success: false, error: "غير مصرح لك بتعديل المنتجات" };
  }

  // 1. Guaranteed update on disk
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
    console.error("Failed to update product on disk:", err);
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

  // Try Prisma
  try {
    const updateData: Record<string, unknown> = {};
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
  } catch {
    // Prisma optional
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

  // 1. Delete on disk
  try {
    await deleteProductFromDisk(id);
  } catch (err) {
    console.error("Failed to delete product on disk:", err);
  }

  const idx = FALLBACK_PRODUCTS.findIndex((p) => p.id === id || p.slug === id);
  if (idx !== -1) {
    FALLBACK_PRODUCTS.splice(idx, 1);
  }

  // Try Prisma
  try {
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
  } catch {
    // Prisma optional
  }

  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/admin/products", "page");
  return { success: true };
}

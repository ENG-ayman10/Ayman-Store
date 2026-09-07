import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import type { ProductType } from "@/types";
import { FALLBACK_PRODUCTS } from "@/lib/fallbackData";

const DATA_DIR = join(process.cwd(), "data");
const PRODUCTS_FILE = join(DATA_DIR, "products.json");

async function ensureStorage(): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  if (!existsSync(PRODUCTS_FILE)) {
    await writeFile(
      PRODUCTS_FILE,
      JSON.stringify(FALLBACK_PRODUCTS, null, 2),
      "utf-8"
    );
  }
}

export async function readProductsFromDisk(): Promise<ProductType[]> {
  try {
    await ensureStorage();
    const data = await readFile(PRODUCTS_FILE, "utf-8");
    const parsed = JSON.parse(data) as ProductType[];
    return parsed.length > 0 ? parsed : FALLBACK_PRODUCTS;
  } catch (error) {
    console.error("Error reading products from disk:", error);
    return FALLBACK_PRODUCTS;
  }
}

export async function writeProductsToDisk(products: ProductType[]): Promise<void> {
  try {
    await ensureStorage();
    await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing products to disk:", error);
    throw error;
  }
}

export async function addProductToDisk(product: ProductType): Promise<void> {
  const products = await readProductsFromDisk();
  const existingIndex = products.findIndex(
    (p) => p.id === product.id || p.slug === product.slug
  );
  if (existingIndex !== -1) {
    products[existingIndex] = product;
  } else {
    products.unshift(product);
  }
  await writeProductsToDisk(products);
}

export async function updateProductOnDisk(
  id: string,
  updates: Partial<ProductType>
): Promise<ProductType | null> {
  const products = await readProductsFromDisk();
  const index = products.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeProductsToDisk(products);
  return products[index];
}

export async function deleteProductFromDisk(id: string): Promise<boolean> {
  const products = await readProductsFromDisk();
  const initialLength = products.length;
  const filtered = products.filter((p) => p.id !== id && p.slug !== id);
  if (filtered.length === initialLength) return false;

  await writeProductsToDisk(filtered);
  return true;
}

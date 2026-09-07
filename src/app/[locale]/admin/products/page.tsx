import React from "react";
import { getProducts } from "@/actions/products";
import { AdminProductsClient } from "./AdminProductsClient";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "إدارة المنتجات | متجر أيمن",
  description: "لوحة إضافة وتعديل وحذف المنتجات وضبط الأسعار والمخزون في متجر أيمن.",
};

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminProductsPage({ params }: ProductsPageProps) {
  await cookies();
  const { locale } = await params;
  const isAr = locale === "ar";
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
          {isAr ? "إدارة المنتجات والمخزون" : "Products & Inventory Management"}
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          {isAr
            ? "يمكنك إضافة منتجات جديدة، تعديل الأسعار والأوصاف، ضبط كميات المخزون، أو حذف المنتجات."
            : "Add new luxury products, update prices and descriptions, control stock levels, or remove items."}
        </p>
      </div>

      <AdminProductsClient initialProducts={products} locale={locale as "ar" | "en"} />
    </div>
  );
}

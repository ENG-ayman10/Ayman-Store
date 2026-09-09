import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/products";
import { getProductReviews } from "@/actions/reviews";
import { ProductDetailClient } from "./ProductDetailClient";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "المنتج غير متوفر | متجر أيمن" };
  }
  const isAr = locale === "ar";
  return {
    title: `${isAr ? product.nameAr : product.nameEn} | متجر أيمن`,
    description: isAr ? product.descAr : product.descEn,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const isAr = locale === "ar";
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = await getProductReviews(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/" className="hover:text-gold-600 transition flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>{isAr ? "الرئيسية" : "Home"}</span>
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/#${product.category.slug}`}
              className="hover:text-gold-600 transition"
            >
              {isAr ? product.category.nameAr : product.category.nameEn}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-semibold text-neutral-900 dark:text-white line-clamp-1">
          {isAr ? product.nameAr : product.nameEn}
        </span>
      </nav>

      {/* Main product presentation */}
      <ProductDetailClient
        product={product}
        initialReviews={reviews}
        locale={locale as "ar" | "en"}
      />
    </div>
  );
}

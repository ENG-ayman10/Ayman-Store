"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { ProductType } from "@/types";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Eye, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: ProductType;
  locale: "ar" | "en";
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const isAr = locale === "ar";
  const name = isAr ? product.nameAr : product.nameEn;
  const desc = isAr ? product.descAr : product.descEn;
  const categoryName = product.category
    ? isAr
      ? product.category.nameAr
      : product.category.nameEn
    : isAr
      ? "المختارات الفاخرة"
      : "Luxury Selections";

  const { addItem } = useCartStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = product.variants[0];
    if (!defaultVariant) return;

    const attrs = defaultVariant.attributes;
    const variantAr =
      attrs.shadeAr || `${attrs.colorAr || ""} ${attrs.size || ""}`.trim() || "قياسي";
    const variantEn =
      attrs.shadeEn || `${attrs.colorEn || ""} ${attrs.size || ""}`.trim() || "Standard";

    addItem({
      id: `${product.id}-${defaultVariant.id}`,
      productId: product.id,
      variantId: defaultVariant.id,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      variantAr,
      variantEn,
      price: Number(defaultVariant.priceOverride ?? product.basePrice),
      image: product.images[0] || "/uploads/lipstick.webp",
      quantity: 1,
      maxStock: defaultVariant.stockQuantity,
    });
  };

  const variantCount = product.variants.length;

  return (
    <div className="group relative rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs hover:shadow-luxury transition-all duration-300 flex flex-col">
      {/* Image container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800"
      >
        <Image
          src={product.images[0] || "/uploads/lipstick.webp"}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category Pill */}
        <div className="absolute top-3 start-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 backdrop-blur-md shadow-xs border border-neutral-200/50 dark:border-neutral-700/50">
            {product.isFeatured && <Sparkles className="w-2.5 h-2.5 text-gold-500" />}
            {categoryName}
          </span>
        </div>

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="p-3 rounded-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-lg hover:scale-110 transition-transform"
            title={isAr ? "إضافة سريعة إلى السلة" : "Quick Add to Cart"}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <span
            className="p-3 rounded-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-lg hover:scale-110 transition-transform"
            title={isAr ? "عرض التفاصيل" : "View Details"}
          >
            <Eye className="w-4 h-4" />
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
            <span>
              {variantCount > 1
                ? isAr
                  ? `${variantCount} خيارات متاحة`
                  : `${variantCount} options available`
                : isAr
                  ? "إصدار حصري"
                  : "Exclusive Edition"}
            </span>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 line-clamp-1 hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
              {name}
            </h3>
          </Link>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Pricing & Add */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 block">
              {isAr ? "السعر يبدأ من" : "Starting from"}
            </span>
            <CurrencyBadge
              amount={product.basePrice}
              locale={locale}
              size="md"
              className="text-neutral-900 dark:text-white"
            />
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-gold-500 hover:text-white dark:hover:bg-gold-500 dark:hover:text-neutral-950 text-neutral-700 dark:text-neutral-300 transition-colors shadow-2xs"
          >
            {isAr ? "التفاصيل" : "Details"}
          </Link>
        </div>
      </div>
    </div>
  );
}

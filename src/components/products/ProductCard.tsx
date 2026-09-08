"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { ProductType, ProductVariantType } from "@/types";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { ShoppingBag, Eye, Sparkles, Check, Star, Zap, Heart, Flame } from "lucide-react";

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

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantType>(
    product.variants[0] || ({} as ProductVariantType)
  );
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isFavorite = isInWishlist(product.id);

  const currentPrice = Number(selectedVariant?.priceOverride ?? product.basePrice);
  const originalPrice = Math.round(currentPrice * 1.18); // Luxury promotional benchmark price
  const variantCount = product.variants?.length || 0;

  // Extract variants that have color codes for quick swatches
  const colorVariants = (product.variants || []).filter(
    (v) => (v.attributes as any)?.colorCode
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const targetVariant = selectedVariant?.id ? selectedVariant : product.variants[0];
    if (!targetVariant) return;

    const attrs = targetVariant.attributes || {};
    const variantAr =
      attrs.shadeAr || `${attrs.colorAr || ""} ${attrs.size || ""}`.trim() || "قياسي";
    const variantEn =
      attrs.shadeEn || `${attrs.colorEn || ""} ${attrs.size || ""}`.trim() || "Standard";

    addItem({
      id: `${product.id}-${targetVariant.id}`,
      productId: product.id,
      variantId: targetVariant.id,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      variantAr,
      variantEn,
      price: currentPrice,
      image: product.images[0] || "/uploads/lipstick.webp",
      quantity: 1,
      maxStock: targetVariant.stockQuantity || 20,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      openCart();
    }, 450);
  };

  return (
    <div className="group relative rounded-2xl sm:rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/90 overflow-hidden shadow-xs hover:shadow-luxury transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Product Top Image Box */}
      <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800/50">
        <Link
          href={`/products/${product.slug}`}
          prefetch={true}
          className="block w-full h-full relative"
        >
          <Image
            src={product.images[0] || "/uploads/lipstick.webp"}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            priority={product.isFeatured}
          />
        </Link>

        {/* Wishlist Heart Floating Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2.5 end-2.5 sm:top-3 sm:end-3 z-20 p-2 sm:p-2.5 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-600 dark:text-neutral-300 hover:text-red-500 shadow-md backdrop-blur-md transition-all active:scale-75"
          title={isAr ? (isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة") : (isFavorite ? "Remove from Wishlist" : "Add to Wishlist")}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-200 ${
              isFavorite ? "fill-red-500 text-red-500 scale-110" : "hover:text-red-500"
            }`}
          />
        </button>

        {/* Floating Badges */}
        <div className="absolute top-2.5 start-2.5 sm:top-3 sm:start-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-neutral-950/85 text-amber-300 backdrop-blur-md border border-amber-500/40 shadow-sm">
              <Flame className="w-2.5 h-2.5 text-amber-400 fill-amber-400 shrink-0" />
              <span>{isAr ? "الأكثر طلباً 🔥" : "Best Seller"}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 backdrop-blur-md shadow-xs border border-neutral-200/60 dark:border-neutral-700/60">
            {categoryName}
          </span>
        </div>

        {/* Quick Add To Cart Floating Button */}
        <div className="absolute bottom-2.5 end-2.5 sm:bottom-3 sm:end-3 z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-md transition-all duration-200 flex items-center justify-center active:scale-90 ${
              isAdded
                ? "bg-emerald-600 text-white scale-110"
                : "bg-white/95 dark:bg-neutral-900/95 text-neutral-900 dark:text-gold-400 hover:bg-gold-500 hover:text-neutral-950 border border-neutral-200/60 dark:border-neutral-700/60"
            }`}
            title={isAr ? "إضافة سريعة إلى السلة" : "Quick Add to Cart"}
          >
            {isAdded ? (
              <Check className="w-4 h-4 animate-bounce" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div className="space-y-1.5">
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-black text-neutral-800 dark:text-neutral-200">4.9</span>
              <span className="text-neutral-400 text-[10px]">(48)</span>
            </div>

            <span className="text-[10px] text-neutral-400">
              {variantCount > 1
                ? isAr
                  ? `${variantCount} خيارات`
                  : `${variantCount} styles`
                : isAr
                  ? "متوفر الآن"
                  : "In Stock"}
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} prefetch={true} className="block group/title">
            <h3 className="font-black text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover/title:text-gold-600 dark:group-hover/title:text-gold-400 transition-colors leading-snug">
              {name}
            </h3>
          </Link>

          {/* Subtitle / Description */}
          <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 sm:line-clamp-2 leading-relaxed">
            {desc}
          </p>

          {/* Color Swatch Dots if available */}
          {colorVariants.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {colorVariants.slice(0, 4).map((v) => {
                const colorHex = (v.attributes as any)?.colorCode || "#000000";
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedVariant(v);
                    }}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all ${
                      isSelected
                        ? "ring-2 ring-gold-500 scale-110 border-white dark:border-neutral-900"
                        : "border-neutral-300 dark:border-neutral-700 hover:scale-105"
                    }`}
                    style={{ backgroundColor: colorHex }}
                    title={isAr ? (v.attributes as any)?.colorAr : (v.attributes as any)?.colorEn}
                  />
                );
              })}
              {colorVariants.length > 4 && (
                <span className="text-[9px] text-neutral-400 font-mono">
                  +{colorVariants.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Details Action */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-end justify-between gap-1">
          <div>
            <span className="text-[9px] sm:text-[10px] text-neutral-400 line-through block font-mono">
              {originalPrice.toLocaleString()} {isAr ? "ر.ي" : "YER"}
            </span>
            <CurrencyBadge
              amount={currentPrice}
              locale={locale}
              size="md"
              className="text-neutral-950 dark:text-white font-black"
            />
          </div>

          <Link
            href={`/products/${product.slug}`}
            prefetch={true}
            className="inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold bg-neutral-100 dark:bg-neutral-800/80 hover:bg-gold-500 hover:text-neutral-950 dark:hover:bg-gold-500 dark:hover:text-neutral-950 text-neutral-800 dark:text-neutral-200 transition-all duration-200 shadow-2xs shrink-0"
          >
            {isAr ? "عرض" : "View"}
          </Link>
        </div>
      </div>
    </div>
  );
}

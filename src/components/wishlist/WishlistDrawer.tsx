"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";
import { Link } from "@/i18n/routing";
import { STORE_CONFIG } from "@/config/payment";
import type { ProductType } from "@/types";
import {
  X,
  Heart,
  ShoppingBag,
  Trash2,
  Share2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface WishlistDrawerProps {
  locale: "ar" | "en";
}

export function WishlistDrawer({ locale }: WishlistDrawerProps) {
  const { items, isOpen, closeWishlist, removeItem, clearWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();
  const isAr = locale === "ar";
  const count = items.length;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWishlist();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeWishlist]);

  if (!isOpen) return null;

  const handleMoveToCart = (product: ProductType) => {
    const defaultVariant = product.variants[0];
    if (!defaultVariant) return;

    const attrs = defaultVariant.attributes || {};
    const variantAr =
      (attrs as any).shadeAr ||
      `${(attrs as any).colorAr || ""} ${(attrs as any).size || ""}`.trim() ||
      "قياسي";
    const variantEn =
      (attrs as any).shadeEn ||
      `${(attrs as any).colorEn || ""} ${(attrs as any).size || ""}`.trim() ||
      "Standard";

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
      maxStock: defaultVariant.stockQuantity || 20,
    });

    removeItem(product.id);
    closeWishlist();
    openCart();
  };

  // Generate WhatsApp Share Message
  const shareWishlistUrl = () => {
    const itemsList = items
      .map((p, i) => `${i + 1}. ${isAr ? p.nameAr : p.nameEn} (${p.basePrice} ر.ي)`)
      .join("\n");
    const text = isAr
      ? `مرحباً! هذه قائمة أمنياتي المختارة من متجر أيمن الفاخر:\n\n${itemsList}\n\nتصفحي المتجر: https://ayman-store.vercel.app`
      : `Hello! Here is my curated wishlist from Ayman Luxury Store:\n\n${itemsList}\n\nExplore: https://ayman-store.vercel.app`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeWishlist}
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 end-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col h-full border-s border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-end duration-300">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/60 dark:bg-neutral-950/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              </div>
              <div>
                <h3 className="font-black text-sm text-neutral-900 dark:text-white">
                  {isAr ? "قائمة أمنياتي المفضلة" : "My Luxury Wishlist"}
                </h3>
                <p className="text-[11px] text-neutral-500 font-semibold">
                  {isAr ? `${count} منتجات محفوظة` : `${count} saved items`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeWishlist}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title={isAr ? "إغلاق" : "Close"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {count === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center">
                  <Heart className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-base text-neutral-900 dark:text-white">
                    {isAr ? "قائمة أمنياتكِ فارغة حالياً" : "Your wishlist is empty"}
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                    {isAr
                      ? "انقري على علامة القلب ❤️ على أي عباية أو عطر أو مستحضر لحفظه في قائمتكِ والرجوع إليه في أي وقت."
                      : "Tap the heart icon on any product to save it here for later."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeWishlist}
                  className="px-6 py-3 rounded-2xl bg-neutral-900 dark:bg-gold-500 text-white dark:text-neutral-950 font-black text-xs hover:bg-neutral-800 dark:hover:bg-gold-600 transition shadow-md"
                >
                  {isAr ? "تصفحي المنتجات الفاخرة" : "Explore Collections"}
                </button>
              </div>
            ) : (
              items.map((product) => (
                <div key={product.id} className="py-3.5 flex items-center gap-3 group">
                  {/* Thumbnail */}
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={closeWishlist}
                    className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 shrink-0"
                  >
                    <Image
                      src={product.images[0] || "/uploads/lipstick.webp"}
                      alt={isAr ? product.nameAr : product.nameEn}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={closeWishlist}
                      className="font-bold text-xs text-neutral-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-400 truncate block transition"
                    >
                      {isAr ? product.nameAr : product.nameEn}
                    </Link>
                    <CurrencyBadge
                      amount={product.basePrice}
                      locale={locale}
                      size="sm"
                      className="text-gold-600 dark:text-gold-400 font-black"
                    />

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(product)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-900 dark:bg-gold-500 text-white dark:text-neutral-950 text-[11px] font-bold hover:bg-neutral-800 dark:hover:bg-gold-600 transition active:scale-95 shadow-2xs"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>{isAr ? "نقل للسلة" : "Move to Cart"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-red-600 transition"
                        title={isAr ? "حذف" : "Remove"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Share Action */}
          {count > 0 && (
            <div className="p-4 border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/60 space-y-2.5">
              <a
                href={shareWishlistUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 transition shadow-md active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>{isAr ? "مشاركة قائمتي عبر واتساب" : "Share Wishlist on WhatsApp"}</span>
              </a>

              <button
                type="button"
                onClick={clearWishlist}
                className="w-full py-2 text-center text-[11px] font-bold text-neutral-400 hover:text-red-500 transition"
              >
                {isAr ? "إفراغ قائمة المفضلة" : "Clear Wishlist"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

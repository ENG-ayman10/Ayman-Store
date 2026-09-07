"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { ProductType, ProductVariantType } from "@/types";
import { VariantSelector } from "@/components/products/VariantSelector";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";
import { useCartStore } from "@/store/useCartStore";
import { STORE_CONFIG } from "@/config/payment";
import {
  ShoppingBag,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  MessageCircle,
  Sparkles,
  Check,
} from "lucide-react";

interface ProductDetailClientProps {
  product: ProductType;
  locale: "ar" | "en";
}

export function ProductDetailClient({ product, locale }: ProductDetailClientProps) {
  const isAr = locale === "ar";
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantType>(
    product.variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addItem, openCart } = useCartStore();

  const currentPrice = selectedVariant?.priceOverride ?? product.basePrice;
  const maxStock = selectedVariant?.stockQuantity ?? 10;
  const isOutOfStock = maxStock <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;

    const attrs = selectedVariant.attributes;
    const variantAr =
      attrs.shadeAr || `${attrs.colorAr || ""} ${attrs.size || ""}`.trim() || "قياسي";
    const variantEn =
      attrs.shadeEn || `${attrs.colorEn || ""} ${attrs.size || ""}`.trim() || "Standard";

    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      variantAr,
      variantEn,
      price: Number(currentPrice),
      image: product.images[0] || "/uploads/lipstick.webp",
      quantity,
      maxStock,
    });

    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      openCart();
    }, 400);
  };

  const productWhatsAppQuestion = isAr
    ? `مرحباً متجر أيمن، أود الاستفسار بخصوص منتج: ${product.nameAr}`
    : `Hello Ayman Store, I want to inquire about: ${product.nameEn}`;

  const whatsappInquiryUrl = `https://wa.me/${STORE_CONFIG.whatsapp.internationalNumber}?text=${encodeURIComponent(productWhatsAppQuestion)}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Product Gallery */}
      <div className="lg:col-span-6 space-y-4">
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-md">
          <Image
            src={product.images[0] || "/uploads/lipstick.webp"}
            alt={isAr ? product.nameAr : product.nameEn}
            fill
            priority
            className="object-cover"
          />

          {product.isFeatured && (
            <div className="absolute top-4 start-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-900/90 text-gold-400 backdrop-blur-md border border-gold-500/30">
                <Sparkles className="w-3 h-3 text-gold-400" />
                <span>{isAr ? "مختارات فاخرة" : "Luxury Pick"}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Product Details & Purchase Form */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          <span className="text-xs font-bold text-gold-600 dark:text-gold-400 uppercase tracking-wider block mb-1">
            {product.category
              ? isAr
                ? product.category.nameAr
                : product.category.nameEn
              : isAr
                ? "المختارات الفاخرة"
                : "Luxury Essentials"}
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white leading-tight">
            {isAr ? product.nameAr : product.nameEn}
          </h1>

          <div className="mt-3 flex items-baseline gap-3">
            <CurrencyBadge
              amount={currentPrice}
              locale={locale}
              size="xl"
              className="text-neutral-900 dark:text-white"
            />
            {selectedVariant?.stockQuantity && selectedVariant.stockQuantity > 0 ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                {isAr ? "متوفر للشحن الفوري" : "In Stock - Express Delivery"}
              </span>
            ) : (
              <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/50 px-2.5 py-1 rounded-full">
                {isAr ? "نفدت الكمية" : "Out of Stock"}
              </span>
            )}
          </div>
        </div>

        {/* Variant Selector */}
        {product.variants.length > 0 && (
          <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60">
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={(v) => {
                setSelectedVariant(v);
                setQuantity(1);
              }}
              locale={locale}
            />
          </div>
        )}

        {/* Quantity and Add to Cart */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-40 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-mono font-bold text-sm text-neutral-900 dark:text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                disabled={quantity >= maxStock || isOutOfStock}
                className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-40 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                addedAnimation
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-900 dark:bg-gold-500 hover:bg-neutral-800 dark:hover:bg-gold-600 text-white dark:text-neutral-950"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-5 h-5 animate-bounce" />
                  <span>{isAr ? "تمت الإضافة للسلة!" : "Added to Cart!"}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>{isAr ? "إضافة إلى سلة المشتريات" : "Add to Shopping Cart"}</span>
                </>
              )}
            </button>
          </div>

          {/* Direct WhatsApp Consultation on this item */}
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-2xs"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>
              {isAr
                ? "استفسر عن هذا المنتج مباشرة عبر واتساب"
                : "Inquire about this product on WhatsApp"}
            </span>
          </a>
        </div>

        {/* Description Section */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
          <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            {isAr ? "المواصفات والتفاصيل:" : "Product Details:"}
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {isAr ? product.descAr : product.descEn}
          </p>
        </div>

        {/* Guarantees */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/70 border border-neutral-200/50 dark:border-neutral-800 flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
            <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0" />
            <span>{isAr ? "أصلي 100% ومضمون" : "100% Genuine Quality"}</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/70 border border-neutral-200/50 dark:border-neutral-800 flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
            <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{isAr ? "شحن لجميع المحافظات" : "Fast Nationwide Shipping"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

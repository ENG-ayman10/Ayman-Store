"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { ProductType, ProductVariantType, ReviewType } from "@/types";
import { VariantSelector } from "@/components/products/VariantSelector";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
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
  Star,
  Share2,
  Building2,
  ArrowRight,
  ArrowLeft,
  Heart,
  UserCheck,
} from "lucide-react";

interface ProductDetailClientProps {
  product: ProductType;
  initialReviews?: ReviewType[];
  locale: "ar" | "en";
}

export function ProductDetailClient({
  product,
  initialReviews = [],
  locale,
}: ProductDetailClientProps) {
  const isAr = locale === "ar";
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantType>(
    product.variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isFavorite = isInWishlist(product.id);

  const currentPrice = Number(selectedVariant?.priceOverride ?? product.basePrice);
  const originalPrice = Math.round(currentPrice * 1.18);
  const maxStock = selectedVariant?.stockQuantity ?? 15;
  const isOutOfStock = maxStock <= 0;

  const reviews = initialReviews || [];
  const hasReviews = reviews.length > 0;
  const avgRating = hasReviews
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;

    const attrs = selectedVariant.attributes || {};
    const variantAr =
      (attrs as any).shadeAr ||
      `${(attrs as any).colorAr || ""} ${(attrs as any).size || ""}`.trim() ||
      "قياسي";
    const variantEn =
      (attrs as any).shadeEn ||
      `${(attrs as any).colorEn || ""} ${(attrs as any).size || ""}`.trim() ||
      "Standard";

    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      variantAr,
      variantEn,
      price: currentPrice,
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
    <div className="space-y-8 pb-20">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition">
          {isAr ? "الرئيسية" : "Home"}
        </Link>
        <span>/</span>
        <span className="text-neutral-700 dark:text-neutral-300 font-semibold">
          {product.category ? (isAr ? product.category.nameAr : product.category.nameEn) : (isAr ? "المختارات" : "Catalog")}
        </span>
        <span>/</span>
        <span className="text-neutral-900 dark:text-white font-bold truncate max-w-[180px] sm:max-w-none">
          {isAr ? product.nameAr : product.nameEn}
        </span>
      </nav>

      {/* Main Product Display: 2 Columns on Desktop/iPad, Stacked on Phone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery / Image Box */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-md">
            <Image
              src={product.images[0] || "/uploads/lipstick.webp"}
              alt={isAr ? product.nameAr : product.nameEn}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            {product.isFeatured && (
              <div className="absolute top-4 start-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-neutral-950/90 text-gold-400 backdrop-blur-md border border-gold-500/40 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>{isAr ? "مختارات حصرية 2026" : "Exclusive Luxury"}</span>
                </span>
              </div>
            )}

            {/* Wishlist Heart Button on Image */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-label={isAr ? "حفظ في المفضلة" : "Save to Wishlist"}
              className={`absolute top-4 end-4 p-3 rounded-full backdrop-blur-md shadow-md transition-all active:scale-90 z-10 ${
                isFavorite
                  ? "bg-rose-500 text-white shadow-rose-500/30"
                  : "bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-200 hover:text-rose-500 hover:bg-white"
              }`}
              title={isAr ? "حفظ في المفضلة" : "Save to Wishlist"}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-white" : ""}`} />
            </button>
          </div>
        </div>

        {/* Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            {/* Category and Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gold-600 dark:text-gold-400 uppercase tracking-widest">
                {product.category
                  ? isAr
                    ? product.category.nameAr
                    : product.category.nameEn
                  : isAr
                    ? "المختارات الفاخرة"
                    : "Luxury Essentials"}
              </span>

              {hasReviews ? (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{avgRating}</span>
                  <span className="text-neutral-500 text-[11px]">
                    ({reviews.length} {isAr ? "تقييم مشتريات موثّق" : "verified reviews"})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gold-600 dark:text-gold-400 text-xs font-bold bg-gold-50 dark:bg-gold-950/40 px-2.5 py-1 rounded-full border border-gold-200 dark:border-gold-800/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                  <span>{isAr ? "أصلي 100% • تقييمات موثقة بعد الشراء" : "100% Authentic • Verified Buyers"}</span>
                </div>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white leading-tight">
              {isAr ? product.nameAr : product.nameEn}
            </h1>

            {/* Price block */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-sm sm:text-base text-neutral-400 line-through font-mono">
                {originalPrice.toLocaleString()} {isAr ? "ر.ي" : "YER"}
              </span>
              <CurrencyBadge
                amount={currentPrice}
                locale={locale}
                size="xl"
                className="text-neutral-950 dark:text-white font-black"
              />
              {maxStock > 0 ? (
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {isAr ? "متوفر للشحن الفوري ⚡" : "In Stock - Fast Delivery"}
                </span>
              ) : (
                <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/50 px-3 py-1 rounded-full">
                  {isAr ? "نفدت الكمية مؤقتاً" : "Out of Stock"}
                </span>
              )}
            </div>
          </div>

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80">
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

          {/* Quantity and Add to Cart Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-40 transition active:scale-90"
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
                  className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-40 transition active:scale-90"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Main CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 ${
                  addedAnimation
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-950 dark:bg-gold-500 hover:bg-neutral-800 dark:hover:bg-gold-600 text-white dark:text-neutral-950 shadow-luxury"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5 animate-bounce" />
                    <span>{isAr ? "تمت الإضافة للسلة بنجاح!" : "Added to Cart!"}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>{isAr ? "إضافة إلى سلة المشتريات" : "Add to Shopping Cart"}</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={isAr ? "حفظ في المفضلة" : "Save to Wishlist"}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center shrink-0 active:scale-90 ${
                  isFavorite
                    ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:text-rose-500 hover:border-rose-200 shadow-sm"
                }`}
                title={isAr ? "حفظ في المفضلة والرغبات" : "Add to Wishlist"}
              >
                <Heart className={`w-5 h-5 transition-transform ${isFavorite ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
              </button>
            </div>

            {/* Direct WhatsApp Concierge Question */}
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-2xs active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>
                {isAr
                  ? "استفسري عن هذا المنتج مباشرة عبر واتساب"
                  : "Inquire about this product on WhatsApp"}
              </span>
            </a>
          </div>

          {/* Description Section */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
            <h3 className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-wider">
              {isAr ? "المواصفات والتفاصيل الملكية:" : "Royal Product Details:"}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {isAr ? product.descAr : product.descEn}
            </p>
          </div>

          {/* Guarantees & Payment Trust Card */}
          <div className="p-4 rounded-2xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 space-y-3 text-xs text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-2.5 font-bold text-neutral-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0" />
              <span>{isAr ? "ضمان متجر أيمن الأصلي" : "Authentic Ayman Store Guarantee"}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {isAr
                ? "يتم تأكيد الطلب فوراً برقم حساب بنك الكريمي (3056058264) ومحفظة جيب (779881824) مع شحن وتوصيل فوري لجميع محافظات اليمن."
                : "Instant bank confirmation via Kuraimi (3056058264) & Jeeb Wallet (779881824) with nationwide Yemen express shipping."}
            </p>
          </div>
        </div>
      </div>

      {/* Real Customer Reviews Section */}
      <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-gold-600 dark:text-gold-400 uppercase tracking-widest">
                {isAr ? "شفافية ومصداقية تامة" : "100% Transparent Reviews"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2 mt-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{isAr ? "تقييمات وآراء العميلات بعد الطلب" : "Customer Reviews & Experiences"}</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {isAr
                ? "تقييمات حقيقية من مشتريات مؤكدة تم تسليمها في مختلف محافظات اليمن."
                : "Real verified feedback from actual delivered orders across Yemen."}
            </p>
          </div>

          {hasReviews && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 shrink-0">
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {avgRating}
              </div>
              <div className="text-start">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(Number(avgRating))
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-300 dark:text-neutral-700"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  {reviews.length} {isAr ? "تقييم عملاء موثق" : "verified reviews"}
                </div>
              </div>
            </div>
          )}
        </div>

        {hasReviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-neutral-50/90 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800/80 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <span>{rev.customerName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium">
                          {isAr ? "مشتري موثّق ✓" : "Verified Buyer ✓"}
                        </span>
                      </div>
                      {rev.city && (
                        <span className="text-[10px] text-neutral-400 block mt-0.5">
                          {rev.city}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-300 dark:text-neutral-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {rev.comment && (
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed bg-white dark:bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800/80">
                    "{rev.comment}"
                  </p>
                )}

                <div className="text-[10px] text-neutral-400 text-left">
                  {new Date(rev.createdAt).toLocaleDateString(isAr ? "ar-YE" : "en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 rounded-3xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-dashed border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-950/60 text-gold-600 dark:text-gold-400 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
              {isAr ? "لا توجد تقييمات لهذا المنتج بعد" : "No reviews for this product yet"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
              {isAr
                ? "نحن نعتمد نظام تقييمات حقيقية 100% يظهر فقط بعد استلام العميل لطلبه. عند طلبك لهذا المنتج، سيظهر لك خيار إضافة رأيك وتقييمك مباشرة ليظهر هنا."
                : "We exclusively show genuine reviews submitted after real purchases. When you order this product, you'll be able to leave your verified feedback!"}
            </p>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Floating Purchase Bar (Always Visible on Mobile) */}
      <div className="fixed bottom-0 inset-x-0 z-30 sm:hidden bg-white/95 dark:bg-neutral-950/95 border-t border-neutral-200 dark:border-neutral-800 p-3 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-neutral-400 block font-bold">
            {isAr ? "السعر الإجمالي" : "Total Price"}
          </span>
          <CurrencyBadge
            amount={currentPrice * quantity}
            locale={locale}
            size="md"
            className="text-neutral-900 dark:text-white font-black"
          />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label={isAr ? "حفظ في المفضلة" : "Save to Wishlist"}
            className={`p-3 rounded-xl border shrink-0 transition active:scale-90 ${
              isFavorite
                ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600"
                : "border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 py-3 px-5 rounded-xl bg-neutral-950 dark:bg-gold-500 text-white dark:text-neutral-950 font-black text-xs flex items-center justify-center gap-2 active:scale-95 shadow-lg"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isAr ? "إضافة إلى السلة" : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

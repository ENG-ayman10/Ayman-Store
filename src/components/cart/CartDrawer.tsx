"use client";

import React, { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { CartItemRow } from "./CartItemRow";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";
import { STORE_CONFIG } from "@/config/payment";
import { Link } from "@/i18n/routing";
import { X, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

interface CartDrawerProps {
  locale: "ar" | "en";
}

export function CartDrawer({ locale }: CartDrawerProps) {
  const { items, isOpen, closeCart, getSubtotal, getTotalCount } = useCartStore();
  const isAr = locale === "ar";
  const subtotal = getSubtotal();
  const shippingFee = STORE_CONFIG.shippingFee;
  const total = subtotal + (items.length > 0 ? shippingFee : 0);
  const count = getTotalCount();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
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
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 end-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col h-full border-s border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-end duration-300">
          
          {/* Header */}
          <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gold-100 dark:bg-gold-950 text-gold-700 dark:text-gold-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  {isAr ? "سلة المشتريات" : "Shopping Cart"}
                </h3>
                <p className="text-[11px] text-neutral-500">
                  {isAr ? `${count} منتجات مضافة` : `${count} items in bag`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title={isAr ? "إغلاق" : "Close"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                    {isAr ? "سلة المشتريات فارغة" : "Your cart is empty"}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    {isAr
                      ? "لم تقم بإضافة أي منتج حتى الآن. تصفح تشكيلتنا المميزة من مستحضرات التجميل والأزياء الراقية!"
                      : "You haven't added any products yet. Browse our curated collection of luxury beauty & fashion!"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="px-4 py-2 text-xs font-semibold text-white bg-gold-600 hover:bg-gold-700 rounded-xl transition shadow-xs"
                >
                  {isAr ? "ابدأ التسوق الآن" : "Start Shopping Now"}
                </button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {items.map((item) => (
                  <CartItemRow key={item.variantId} item={item} locale={locale} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/70 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                  <CurrencyBadge amount={subtotal} locale={locale} size="sm" />
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>{isAr ? "رسوم الشحن الثابتة" : "Flat Delivery Fee"}</span>
                  <CurrencyBadge amount={shippingFee} locale={locale} size="sm" />
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span>{isAr ? "الإجمالي الكلي" : "Grand Total"}</span>
                  <CurrencyBadge
                    amount={total}
                    locale={locale}
                    size="md"
                    className="text-gold-600 dark:text-gold-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isAr
                    ? "تأكيد فوري ودفع آمن عبر بنك الكريمي أو محفظة جيب"
                    : "Direct order with verified local transfer (Kuraimi & Jeeb)"}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3 px-4 rounded-xl bg-neutral-900 dark:bg-gold-500 hover:bg-neutral-800 dark:hover:bg-gold-600 text-white dark:text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>{isAr ? "متابعة إتمام الطلب" : "Proceed to Checkout"}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useMobileMenuStore } from "@/store/useMobileMenuStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { STORE_CONFIG } from "@/config/payment";
import {
  X,
  Home,
  Flame,
  Sparkles,
  ShoppingBag,
  Heart,
  Truck,
  Sliders,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface MobileMenuDrawerProps {
  locale: "ar" | "en";
}

export function MobileMenuDrawer({ locale }: MobileMenuDrawerProps) {
  const { isOpen, closeMenu } = useMobileMenuStore();
  const { openWishlist, getTotalCount: getWishlistCount } = useWishlistStore();
  const { openCart, getTotalCount: getCartCount } = useCartStore();

  const isAr = locale === "ar";
  const wishlistCount = getWishlistCount();
  const cartCount = getCartCount();

  // Close on Escape key and prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
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
  }, [isOpen, closeMenu]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Semi-transparent backdrop with click-to-close */}
      <div
        onClick={closeMenu}
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* Off-canvas Side Drawer Container: Right in Arabic (RTL), Left in English (LTR) */}
      <div
        className={`fixed inset-y-0 ${
          isAr ? "right-0" : "left-0"
        } max-w-full flex z-50 pointer-events-none`}
      >
        <div
          className={`pointer-events-auto w-[85vw] max-w-[340px] bg-white dark:bg-neutral-950 shadow-2xl flex flex-col h-full ${
            isAr
              ? "border-s border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300"
              : "border-e border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-left duration-300"
          }`}
        >
          {/* Drawer Top Header */}
          <div className="shrink-0 p-4 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/90 dark:bg-neutral-900/90">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-2.5"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 flex items-center justify-center text-white shadow-md">
                <span className="font-extrabold text-base font-serif">A</span>
              </div>
              <div>
                <span className="text-sm font-black text-neutral-900 dark:text-white leading-tight block">
                  {isAr ? STORE_CONFIG.name.ar : STORE_CONFIG.name.en}
                </span>
                <span className="text-[10px] font-bold text-gold-600 dark:text-gold-400 block">
                  {isAr ? "الجمال والأزياء الراقية" : "Haute Beauty & Fashion"}
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={closeMenu}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition active:scale-90"
              aria-label={isAr ? "إغلاق القائمة" : "Close Menu"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Micro Announcement Banner */}
          <div className="shrink-0 px-4 py-2 bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-transparent border-b border-neutral-200/50 dark:border-neutral-800/50 flex items-center gap-2 text-[11px] text-gold-800 dark:text-gold-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-gold-500 shrink-0" />
            <span>{isAr ? "توصيل سريع لكافة المحافظات اليمنية ⚡" : "Fast Delivery Across Yemen ⚡"}</span>
          </div>

          {/* Scrollable Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 pb-1 block">
              {isAr ? "أقسام المتجر الرئيسية" : "Store Navigation"}
            </span>

            {/* Home Link */}
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                  <Home className="w-4 h-4" />
                </div>
                <span>{isAr ? "الصفحة الرئيسية" : "Home Page"}</span>
              </div>
              {isAr ? <ChevronLeft className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
            </Link>

            {/* Best Sellers */}
            <Link
              href="/#bestsellers"
              onClick={closeMenu}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-amber-50/70 dark:hover:bg-amber-950/30 text-neutral-900 dark:text-white font-bold text-xs transition group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Flame className="w-4 h-4" />
                </div>
                <span>{isAr ? "المنتجات الأكثر طلباً" : "Best Sellers"}</span>
              </div>
              <span className="text-[10px] font-black bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full shadow-xs">
                {isAr ? "الأعلى طلباً 🔥" : "Hot 🔥"}
              </span>
            </Link>

            {/* Beauty & Cosmetics */}
            <Link
              href="/#beauty"
              onClick={closeMenu}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>{isAr ? "مستحضرات التجميل والعناية" : "Beauty & Cosmetics"}</span>
              </div>
              {isAr ? <ChevronLeft className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
            </Link>

            {/* Fashion & Abayas */}
            <Link
              href="/#fashion"
              onClick={closeMenu}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span>{isAr ? "الملابس والعبايات الراقية" : "Fashion & Abayas"}</span>
              </div>
              {isAr ? <ChevronLeft className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
            </Link>

            {/* Wishlist Link with Live Counter */}
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openWishlist();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-red-50/60 dark:hover:bg-red-950/30 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition group text-start active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <Heart className="w-4 h-4 fill-red-500" />
                </div>
                <span>{isAr ? "قائمة رغباتي ومفضلتي" : "My Wishlist"}</span>
              </div>
              {wishlistCount > 0 ? (
                <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full font-mono shadow-xs">
                  {wishlistCount}
                </span>
              ) : (
                <span className="text-[10px] text-neutral-400 font-semibold">
                  {isAr ? "فارغة" : "Empty"}
                </span>
              )}
            </button>

            {/* Shopping Cart Trigger */}
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openCart();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gold-50/60 dark:hover:bg-gold-950/30 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition group text-start active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gold-100 dark:bg-gold-950/50 flex items-center justify-center text-gold-600 dark:text-gold-400 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span>{isAr ? "سلة المشتريات" : "Shopping Bag"}</span>
              </div>
              {cartCount > 0 && (
                <span className="text-[10px] font-bold bg-gold-600 text-white px-2 py-0.5 rounded-full font-mono shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Track Order */}
            <Link
              href="/track"
              onClick={closeMenu}
              className="flex items-center justify-between p-3 rounded-2xl bg-gold-50/70 dark:bg-gold-950/40 text-gold-900 dark:text-gold-200 font-black text-xs transition border border-gold-200/60 dark:border-gold-800/60 group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gold-500 text-white flex items-center justify-center shadow-xs">
                  <Truck className="w-4 h-4" />
                </div>
                <span>{isAr ? "تتبع حالة شحنتك فوراً" : "Track Order Status"}</span>
              </div>
              <span className="text-[10px] font-black bg-gold-500 text-neutral-950 px-2 py-0.5 rounded-full shadow-xs">
                {isAr ? "مباشر ⚡" : "Live ⚡"}
              </span>
            </Link>

            {/* Admin Dashboard */}
            <Link
              href="/admin"
              onClick={closeMenu}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-400 font-medium text-xs transition group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <span>{isAr ? "لوحة الإدارة والمسؤول" : "Admin Dashboard"}</span>
              </div>
              {isAr ? <ChevronLeft className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
            </Link>
          </div>

          {/* Bottom Card: WhatsApp Concierge & Payment Trust */}
          <div className="shrink-0 p-4 border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-900/90 space-y-3">
            <a
              href={`https://wa.me/${STORE_CONFIG.whatsapp.internationalNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isAr ? "استفسري مباشرة عبر واتساب" : "Chat on WhatsApp"}</span>
            </a>

            <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500 shrink-0" />
              <span>{isAr ? "معتمد عبر بنك الكريمي ومحفظة جيب" : "Verified Kuraimi Bank & Jeeb"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

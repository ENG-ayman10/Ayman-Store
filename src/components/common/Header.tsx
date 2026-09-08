"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { STORE_CONFIG } from "@/config/payment";
import {
  ShoppingBag,
  Heart,
  Sparkles,
  Search,
  Menu,
  X,
  ShieldCheck,
  MessageCircle,
  Truck,
  Sliders,
  Home,
  Flame,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface HeaderProps {
  locale: "ar" | "en";
}

export function Header({ locale }: HeaderProps) {
  const isAr = locale === "ar";
  const { openCart, getTotalCount } = useCartStore();
  const count = getTotalCount();
  const { openWishlist, getTotalCount: getWishlistCount } = useWishlistStore();
  const wishlistCount = getWishlistCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
      {/* Top micro announcement bar */}
      <div className="bg-neutral-900 text-gold-200 dark:bg-black text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" />
        <span>
          {isAr
            ? "متجر أيمن | شحن لجميع المدن اليمنية والدفع المعتمد عبر بنك الكريمي ومحفظة جيب"
            : "Ayman Store | Nationwide Delivery across Yemen & Verified Payments via Kuraimi & Jeeb"}
        </span>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 flex items-center justify-center text-white shadow-luxury group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-base font-serif">A</span>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-neutral-900 dark:text-white block leading-tight">
                {isAr ? STORE_CONFIG.name.ar : STORE_CONFIG.name.en}
              </span>
              <span className="text-[10px] font-semibold text-gold-600 dark:text-gold-400 tracking-wider uppercase block">
                {isAr ? "الجمال والأزياء الراقية" : "Haute Beauty & Fashion"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ps-4 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <Link
              href="/#beauty"
              className="px-3 py-1.5 rounded-lg hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              {isAr ? "مستحضرات التجميل" : "Beauty & Cosmetics"}
            </Link>
            <Link
              href="/#fashion"
              className="px-3 py-1.5 rounded-lg hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              {isAr ? "الملابس والعبايات" : "Fashion & Abayas"}
            </Link>
            <Link
              href="/track"
              className="px-3 py-1.5 rounded-lg hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex items-center gap-1 text-gold-700 dark:text-gold-400"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{isAr ? "تتبع طلبك" : "Track Order"}</span>
            </Link>
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2.5">
          {/* Direct WhatsApp Concierge Button */}
          <a
            href={`https://wa.me/${STORE_CONFIG.whatsapp.internationalNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition shadow-2xs"
            title={isAr ? "استشارة فورية عبر واتساب" : "WhatsApp Concierge"}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden lg:inline">{isAr ? "استشارة واتساب" : "WhatsApp"}</span>
          </a>

          {/* Admin link */}
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            title={isAr ? "لوحة الإدارة" : "Admin Dashboard"}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isAr ? "الإدارة" : "Admin"}</span>
          </Link>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Wishlist Trigger */}
          <button
            type="button"
            onClick={openWishlist}
            className="relative p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white transition shadow-2xs border border-neutral-200/50 dark:border-neutral-800"
            title={isAr ? "قائمة أمنياتي المفضلة" : "My Wishlist"}
          >
            <Heart className={`w-4 h-4 transition-colors ${wishlistCount > 0 ? "fill-red-500 text-red-500" : "text-neutral-700 dark:text-neutral-300"}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={openCart}
            className="relative p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white transition shadow-2xs border border-neutral-200/50 dark:border-neutral-800"
            title={isAr ? "سلة المشتريات" : "Shopping Bag"}
          >
            <ShoppingBag className="w-4 h-4" />
            {count > 0 && (
              <span className="absolute -top-1.5 -end-1.5 min-w-5 h-5 px-1 rounded-full bg-gold-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in">
                {count}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label={isAr ? "فتح القائمة الرئيسية" : "Open Main Menu"}
            className="md:hidden p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition shadow-2xs border border-neutral-200/60 dark:border-neutral-800 active:scale-90"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Luxury Mobile Side Drawer Menu (Opens from Right in Arabic, Left in English) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
          {/* Blur Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            aria-hidden="true"
          />

          {/* Side Drawer Panel */}
          <div
            className={`fixed inset-y-0 ${
              isAr ? "right-0 animate-in slide-in-from-right" : "left-0 animate-in slide-in-from-left"
            } w-[84vw] max-w-[340px] bg-white dark:bg-neutral-950 shadow-2xl flex flex-col h-full ${
              isAr
                ? "border-s border-neutral-200 dark:border-neutral-800"
                : "border-e border-neutral-200 dark:border-neutral-800"
            } duration-300 z-50`}
          >
            {/* Drawer Top Brand Header */}
            <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-md">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 flex items-center justify-center text-white shadow-md">
                  <span className="font-extrabold text-sm font-serif">A</span>
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
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition active:scale-90"
                aria-label={isAr ? "إغلاق القائمة" : "Close Menu"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Announcement Banner */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-transparent border-b border-neutral-200/50 dark:border-neutral-800/50 flex items-center gap-2 text-[11px] text-gold-800 dark:text-gold-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-gold-500 shrink-0" />
              <span>{isAr ? "توصيل سريع لكافة المحافظات اليمنية ⚡" : "Fast Delivery Across Yemen ⚡"}</span>
            </div>

            {/* Navigation Links with Icons & Badges */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 pb-1 block">
                {isAr ? "أقسام المتجر الرئيسية" : "Store Navigation"}
              </span>

              {/* Home */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
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
                onClick={() => setMobileMenuOpen(false)}
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
                onClick={() => setMobileMenuOpen(false)}
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
                onClick={() => setMobileMenuOpen(false)}
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

              {/* Wishlist Button inside Drawer */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
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

              {/* Track Order */}
              <Link
                href="/track"
                onClick={() => setMobileMenuOpen(false)}
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

              {/* Admin Portal */}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
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

            {/* Bottom Support & Guarantee Card */}
            <div className="p-4 border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-900/90 space-y-3">
              {/* WhatsApp Concierge Button */}
              <a
                href={`https://wa.me/${STORE_CONFIG.whatsapp.internationalNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? "استفسري مباشرة عبر واتساب" : "Chat on WhatsApp"}</span>
              </a>

              {/* Payment Guarantee Note */}
              <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span>{isAr ? "معتمد عبر بنك الكريمي ومحفظة جيب" : "Verified Kuraimi Bank & Jeeb"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

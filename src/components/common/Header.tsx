"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useMobileMenuStore } from "@/store/useMobileMenuStore";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { STORE_CONFIG } from "@/config/payment";
import {
  ShoppingBag,
  Heart,
  Sparkles,
  Menu,
  MessageCircle,
  Truck,
  Sliders,
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
  const { openMenu } = useMobileMenuStore();

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
            onClick={openMenu}
            aria-label={isAr ? "فتح القائمة الرئيسية" : "Open Main Menu"}
            className="md:hidden p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition shadow-2xs border border-neutral-200/60 dark:border-neutral-800 active:scale-90"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

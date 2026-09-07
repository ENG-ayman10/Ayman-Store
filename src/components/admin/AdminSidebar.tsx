"use client";

import React, { useTransition } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { STORE_CONFIG } from "@/config/payment";
import { logoutAdmin } from "@/actions/auth";
import {
  LayoutDashboard,
  ArrowLeft,
  ArrowRight,
  Package,
  Layers,
  LogOut,
  Loader2,
  ShieldCheck,
} from "lucide-react";

interface AdminSidebarProps {
  locale: "ar" | "en";
}

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const isAr = locale === "ar";
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, startTransition] = useTransition();

  // If on login page, hide sidebar
  if (pathname.endsWith("/login")) {
    return null;
  }

  const links = [
    {
      href: "/admin",
      label: isAr ? "نظرة عامة" : "Overview",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/products",
      label: isAr ? "إدارة المنتجات" : "Products Management",
      icon: Package,
      active: pathname === "/admin/products",
    },
    {
      href: "/admin/orders",
      label: isAr ? "إدارة الطلبات" : "Orders Management",
      icon: Layers,
      active: pathname === "/admin/orders",
    },
  ];

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdmin();
      router.replace("/admin/login");
    });
  };

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-e border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 flex flex-col justify-between shadow-xs">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-serif font-bold text-xs shadow-xs">
            A
          </div>
          <div>
            <span className="font-extrabold text-sm text-neutral-900 dark:text-white block leading-none">
              {isAr ? STORE_CONFIG.name.ar : STORE_CONFIG.name.en}
            </span>
            <span className="text-[10px] text-gold-600 dark:text-gold-400 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>{isAr ? "منطقة الإدارة الآمنة" : "Secure Admin"}</span>
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  link.active
                    ? "bg-neutral-900 text-white dark:bg-gold-500 dark:text-neutral-950 shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls: Back to store & Logout */}
      <div className="pt-4 mt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          <span>{isAr ? "الرجوع إلى المتجر" : "Back to Store"}</span>
          {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </Link>

        <button
          type="button"
          disabled={isLoggingOut}
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5" />
            <span>{isAr ? "تسجيل الخروج" : "Sign Out"}</span>
          </div>
          {isLoggingOut && <Loader2 className="w-3 h-3 animate-spin" />}
        </button>
      </div>
    </aside>
  );
}

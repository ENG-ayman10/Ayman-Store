"use client";

import React from "react";
import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import type { CartItem } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";

interface CartItemRowProps {
  item: CartItem;
  locale: "ar" | "en";
}

export function CartItemRow({ item, locale }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const isAr = locale === "ar";
  const name = isAr ? item.nameAr : item.nameEn;
  const variant = isAr ? item.variantAr : item.variantEn;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200/50 dark:border-neutral-800">
        <Image
          src={item.image || "/uploads/lipstick.webp"}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Item info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
          {name}
        </h4>
        <p className="text-[11px] text-gold-700 dark:text-gold-400 font-medium mt-0.5 truncate">
          {variant}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <CurrencyBadge
            amount={item.price * item.quantity}
            locale={locale}
            size="sm"
            className="text-neutral-900 dark:text-white"
          />

          {/* Stepper controls */}
          <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5 border border-neutral-200/60 dark:border-neutral-700/60">
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="p-1 rounded text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 transition"
              title={isAr ? "تقليل الكمية" : "Decrease quantity"}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-mono font-bold px-1 min-w-5 text-center text-neutral-800 dark:text-neutral-200">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              disabled={item.quantity >= item.maxStock}
              className="p-1 rounded text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 transition disabled:opacity-30"
              title={isAr ? "زيادة الكمية" : "Increase quantity"}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => removeItem(item.variantId)}
        className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
        title={isAr ? "حذف" : "Remove"}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

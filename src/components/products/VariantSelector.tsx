"use client";

import React from "react";
import type { ProductVariantType } from "@/types";
import { Check, AlertCircle } from "lucide-react";

interface VariantSelectorProps {
  variants: ProductVariantType[];
  selectedVariant: ProductVariantType | null;
  onSelectVariant: (variant: ProductVariantType) => void;
  locale: "ar" | "en";
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
  locale,
}: VariantSelectorProps) {
  const isAr = locale === "ar";

  if (!variants || variants.length === 0) {
    return null;
  }

  // Detect whether beauty shade swatches or apparel sizes
  const isShadeVariant = variants.some((v) => v.attributes.shadeAr || v.attributes.shadeEn);
  const isSizeVariant = variants.some((v) => v.attributes.size);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
          {isShadeVariant
            ? isAr
              ? "اختر الدرجة أو الحجم:"
              : "Select Shade / Size:"
            : isAr
              ? "اختر المقاس واللون:"
              : "Select Size & Color:"}
        </span>
        {selectedVariant && (
          <span className="text-[11px] font-medium text-gold-600 dark:text-gold-400">
            {isAr
              ? selectedVariant.attributes.shadeAr ||
                `${selectedVariant.attributes.colorAr || ""} ${selectedVariant.attributes.size || ""}`.trim()
              : selectedVariant.attributes.shadeEn ||
                `${selectedVariant.attributes.colorEn || ""} ${selectedVariant.attributes.size || ""}`.trim()}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {variants.map((v) => {
          const isSelected = selectedVariant?.id === v.id;
          const isOutOfStock = v.stockQuantity <= 0;
          const colorCode = v.attributes.colorCode;
          const label = isAr
            ? v.attributes.shadeAr ||
              `${v.attributes.size ? `${v.attributes.size}` : ""} ${v.attributes.colorAr || ""}`.trim()
            : v.attributes.shadeEn ||
              `${v.attributes.size ? `${v.attributes.size}` : ""} ${v.attributes.colorEn || ""}`.trim();

          return (
            <button
              key={v.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectVariant(v)}
              className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                isSelected
                  ? "border-gold-500 bg-gold-50/60 dark:bg-gold-950/40 text-neutral-900 dark:text-white shadow-xs ring-1 ring-gold-500"
                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700"
              } ${isOutOfStock ? "opacity-40 cursor-not-allowed line-through" : ""}`}
            >
              {/* Color swatch dot */}
              {colorCode && (
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs flex items-center justify-center"
                  style={{ backgroundColor: colorCode }}
                >
                  {isSelected && (
                    <Check
                      className={`w-2.5 h-2.5 ${
                        colorCode.toLowerCase() === "#ffffff" || colorCode.toLowerCase() === "#f5f5f0"
                          ? "text-black"
                          : "text-white"
                      }`}
                    />
                  )}
                </span>
              )}

              <span>{label}</span>

              {/* Low stock indicator */}
              {v.stockQuantity > 0 && v.stockQuantity <= 5 && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                  ({isAr ? `متبقي ${v.stockQuantity}` : `${v.stockQuantity} left`})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Stock warning if applicable */}
      {selectedVariant && selectedVariant.stockQuantity <= 0 && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{isAr ? "عذراً، هذه الدرجة غير متوفرة حالياً." : "Sorry, this variant is out of stock."}</span>
        </div>
      )}
    </div>
  );
}

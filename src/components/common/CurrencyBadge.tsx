import React from "react";
import { formatPrice } from "@/lib/utils";
import { STORE_CONFIG } from "@/config/payment";

interface CurrencyBadgeProps {
  amount: number | string;
  locale?: "ar" | "en";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function CurrencyBadge({
  amount,
  locale = "ar",
  className = "",
  size = "md",
}: CurrencyBadgeProps) {
  const currencySymbol = locale === "ar" ? STORE_CONFIG.currency.ar : STORE_CONFIG.currency.en;
  const formatted = formatPrice(amount, locale);

  const sizeClasses = {
    sm: "text-xs font-semibold",
    md: "text-sm font-bold",
    lg: "text-lg font-extrabold",
    xl: "text-2xl font-black",
  };

  return (
    <span
      className={`inline-flex items-baseline gap-1 font-mono ${sizeClasses[size]} ${className}`}
    >
      <span>{formatted}</span>
      <span className="text-[0.75em] font-sans font-medium text-neutral-500 dark:text-neutral-400">
        {currencySymbol}
      </span>
    </span>
  );
}

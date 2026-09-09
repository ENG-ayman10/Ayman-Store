import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | string, locale: "ar" | "en" = "ar"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat(locale === "ar" ? "ar-YE" : "en-US", {
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatFullDateTime(
  dateInput?: string | Date | null,
  locale: "ar" | "en" = "ar"
): { dateStr: string; timeStr: string; fullStr: string } {
  if (!dateInput) return { dateStr: "", timeStr: "", fullStr: "" };
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return { dateStr: "", timeStr: "", fullStr: "" };

  const isAr = locale === "ar";
  const timeZone = "Asia/Aden";

  // Date format: YYYY/MM/DD
  const dateStr = d.toLocaleDateString(isAr ? "ar-YE" : "en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Time format with Hour, Minute, Second, AM/PM
  const timeStr = d.toLocaleTimeString(isAr ? "ar-YE" : "en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const fullStr = `${dateStr} - ${timeStr}`;

  return { dateStr, timeStr, fullStr };
}


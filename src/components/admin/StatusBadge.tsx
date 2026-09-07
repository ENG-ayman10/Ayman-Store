import React from "react";
import type { OrderStatus } from "@/types";
import { Clock, CheckCircle2, PackageCheck, Truck, CheckCheck, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: OrderStatus;
  locale?: "ar" | "en";
  className?: string;
}

export function StatusBadge({ status, locale = "ar", className = "" }: StatusBadgeProps) {
  const isAr = locale === "ar";

  const statusConfig = {
    PENDING_PAYMENT: {
      ar: "بانتظار التحويل",
      en: "Pending Payment",
      color: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300/80 dark:border-amber-800",
      icon: Clock,
    },
    PAYMENT_CONFIRMED: {
      ar: "تم تأكيد الدفع",
      en: "Payment Confirmed",
      color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-800",
      icon: CheckCircle2,
    },
    PROCESSING: {
      ar: "قيد التجهيز",
      en: "Processing",
      color: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300/80 dark:border-sky-800",
      icon: PackageCheck,
    },
    SHIPPED: {
      ar: "تم الشحن",
      en: "Shipped",
      color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300/80 dark:border-indigo-800",
      icon: Truck,
    },
    DELIVERED: {
      ar: "تم التسليم",
      en: "Delivered",
      color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-800",
      icon: CheckCheck,
    },
    CANCELLED: {
      ar: "ملغي",
      en: "Cancelled",
      color: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-300/80 dark:border-red-800",
      icon: XCircle,
    },
  };

  const current = statusConfig[status] || statusConfig.PENDING_PAYMENT;
  const Icon = current.icon;
  const label = isAr ? current.ar : current.en;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${current.color} ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
    </span>
  );
}

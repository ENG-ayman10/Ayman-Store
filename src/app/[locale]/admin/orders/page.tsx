import React from "react";
import { getAdminOrders } from "@/actions/orders";
import { AdminOrdersClient } from "./AdminOrdersClient";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "إدارة الطلبات | متجر أيمن",
  description: "جدول إدارة ومتابعة الطلبات، تحديث الحالات، ومطابقة سندات الدفع.",
};

interface OrdersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OrdersPage({ params }: OrdersPageProps) {
  await cookies(); // Force dynamic server evaluation
  const { locale } = await params;
  const isAr = locale === "ar";
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
          {isAr ? "إدارة وتتبع كافة الطلبات" : "Orders Management"}
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          {isAr
            ? "عرض سجل الطلبات المحدث لحظياً، تصفيتها بحسب حالة الدفع والتجهيز، ومراسلة العملاء عبر الواتساب."
            : "Review real-time order logs, filter by fulfillment status, and directly converse with customers."}
        </p>
      </div>

      <AdminOrdersClient initialOrders={orders} locale={locale as "ar" | "en"} />
    </div>
  );
}

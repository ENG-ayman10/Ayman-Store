import React from "react";
import { getAdminOrders, getOrderStats } from "@/actions/orders";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderRowActions } from "@/components/admin/OrderRowActions";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";
import { Link } from "@/i18n/routing";
import { STORE_CONFIG } from "@/config/payment";
import { cookies } from "next/headers";
import {
  Package,
  CircleDollarSign,
  Clock,
  Truck,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Star,
} from "lucide-react";
import { getAdminReviews } from "@/actions/reviews";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  await cookies();
  const { locale } = await params;
  const isAr = locale === "ar";
  const stats = await getOrderStats();
  const allOrders = await getAdminOrders();
  const reviews = await getAdminReviews();
  const recentOrders = allOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
            {isAr ? "لوحة تحكم المتجر" : "Store Dashboard"}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {isAr
              ? "متابعة الطلبات المسجلة، التحقق من الحوالات، وتحديث مسار الشحنات."
              : "Monitor registered orders, verify incoming payments, and dispatch shipments."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${STORE_CONFIG.whatsapp.internationalNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isAr ? "واتساب المتجر" : "Store WhatsApp"}</span>
          </a>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition shadow-2xs"
          >
            <span>{isAr ? "كافة الطلبات" : "All Orders"}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500">
              {isAr ? "إجمالي الطلبات" : "Total Orders"}
            </span>
            <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-neutral-900 dark:text-white">
            {stats.totalOrders}
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500">
              {isAr ? "إجمالي المبيعات" : "Total Revenue"}
            </span>
            <div className="p-2 rounded-xl bg-gold-100 dark:bg-gold-950 text-gold-700 dark:text-gold-300">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <CurrencyBadge
            amount={stats.totalRevenue}
            locale={locale as "ar" | "en"}
            size="lg"
            className="text-gold-600 dark:text-gold-400"
          />
        </div>

        {/* Pending Payment */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {isAr ? "بانتظار تأكيد الدفع" : "Pending Payment"}
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {stats.pendingPayment}
          </div>
        </div>

        {/* Shipped */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {isAr ? "طلبات جاري شحنها" : "In Transit / Shipped"}
            </span>
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
            {stats.shipped}
          </div>
        </div>

        {/* Customer Reviews Metric */}
        <Link
          href="/admin/reviews"
          className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-2 hover:border-gold-500/50 transition block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:underline">
              {isAr ? "تقييمات العملاء" : "Customer Ratings"}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-neutral-900 dark:text-white flex items-center gap-1.5">
            <span>
              {reviews.length > 0
                ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
                : "0.0"}
            </span>
            <span className="text-xs font-normal text-neutral-400 font-sans">
              ({reviews.length} {isAr ? "تقييم" : "revs"})
            </span>
          </div>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              {isAr ? "أحدث الطلبات المسجلة" : "Recent Orders"}
            </h3>
            <p className="text-[11px] text-neutral-400">
              {isAr
                ? "يمكنك تغيير حالة الطلب مباشرة ومحادثة العميل عبر الواتساب"
                : "Update status directly or message the customer on WhatsApp"}
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-bold text-gold-600 dark:text-gold-400 hover:underline flex items-center gap-1"
          >
            <span>{isAr ? "عرض كل الطلبات" : "View All"}</span>
            {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-neutral-400 text-xs">
            {isAr ? "لا توجد طلبات مسجلة حالياً." : "No orders registered yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400">
                  <th className="py-2.5 px-3 text-start font-semibold">
                    {isAr ? "رمز الطلب" : "Order Code"}
                  </th>
                  <th className="py-2.5 px-3 text-start font-semibold">
                    {isAr ? "العميل" : "Customer"}
                  </th>
                  <th className="py-2.5 px-3 text-start font-semibold">
                    {isAr ? "المدينة" : "City"}
                  </th>
                  <th className="py-2.5 px-3 text-start font-semibold">
                    {isAr ? "الأصناف" : "Items"}
                  </th>
                  <th className="py-2.5 px-3 text-start font-semibold">
                    {isAr ? "الإجمالي" : "Total"}
                  </th>
                  <th className="py-2.5 px-3 text-start font-semibold">
                    {isAr ? "الحالة" : "Status"}
                  </th>
                  <th className="py-2.5 px-3 text-start font-semibold">
                    {isAr ? "إجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-white">
                      {order.orderCode}
                    </td>
                    <td className="py-3 px-3 font-medium text-neutral-800 dark:text-neutral-200">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-3 text-neutral-500">{order.city}</td>
                    <td className="py-3 px-3 text-neutral-500">
                      {order.items.length} {isAr ? "أصناف" : "items"}
                    </td>
                    <td className="py-3 px-3">
                      <CurrencyBadge amount={order.totalAmount} locale={locale as "ar" | "en"} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={order.status} locale={locale as "ar" | "en"} />
                    </td>
                    <td className="py-3 px-3">
                      <OrderRowActions order={order} locale={locale as "ar" | "en"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

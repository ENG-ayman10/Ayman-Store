"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import type { OrderType, OrderStatus } from "@/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderRowActions } from "@/components/admin/OrderRowActions";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";
import { Search, Package, RefreshCw, CheckCircle2, MapPin, Clock } from "lucide-react";
import { formatFullDateTime } from "@/lib/utils";

interface AdminOrdersClientProps {
  initialOrders: OrderType[];
  locale: "ar" | "en";
}

export function AdminOrdersClient({ initialOrders, locale }: AdminOrdersClientProps) {
  const isAr = locale === "ar";
  const [orders, setOrders] = useState<OrderType[]>(initialOrders);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>("");

  const filterTabs = [
    { id: "ALL", labelAr: "كافة الطلبات", labelEn: "All Orders" },
    { id: "PENDING_PAYMENT", labelAr: "بانتظار التحويل", labelEn: "Pending Payment" },
    { id: "PAYMENT_CONFIRMED", labelAr: "تم تأكيد الدفع", labelEn: "Payment Verified" },
    { id: "PROCESSING", labelAr: "قيد التجهيز", labelEn: "Processing" },
    { id: "SHIPPED", labelAr: "تم الشحن", labelEn: "Shipped" },
    { id: "DELIVERED", labelAr: "تم التسليم", labelEn: "Delivered" },
    { id: "CANCELLED", labelAr: "ملغي", labelEn: "Cancelled" },
  ];

  // Fetch latest orders from API with shallow equality check to prevent unnecessary re-renders
  const refreshOrders = useCallback(async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders((prev) => {
            if (prev.length !== data.orders.length) return data.orders;
            const isIdentical = prev.every((oldO, i) => {
              const newO = data.orders[i];
              return newO && oldO.id === newO.id && oldO.status === newO.status && oldO.updatedAt === newO.updatedAt;
            });
            return isIdentical ? prev : data.orders;
          });
          setLastRefreshedAt(
            new Date().toLocaleTimeString(isAr ? "ar-YE" : "en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          );
        }
      }
    } catch (err) {
      console.error("Failed to refresh orders:", err);
    } finally {
      if (showLoading) setIsRefreshing(false);
    }
  }, [isAr]);

  // Sync initialOrders if props change
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // Real-time live polling every 4 seconds to sync orders across devices automatically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders(false);
    }, 4000);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
          : o
      )
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = filterStatus === "ALL" || order.status === filterStatus;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        order.orderCode.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.phone.includes(q) ||
        order.city.toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [orders, filterStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Controls: Filter Pills, Search & Refresh */}
      <div className="flex flex-col gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {filterTabs.map((tab) => {
              const active = filterStatus === tab.id;
              const count =
                tab.id === "ALL"
                  ? orders.length
                  : orders.filter((o) => o.status === tab.id).length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                    active
                      ? "bg-neutral-900 text-white dark:bg-gold-500 dark:text-neutral-950 shadow-xs"
                      : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      active
                        ? "bg-white/20 text-white dark:bg-neutral-950/30 dark:text-neutral-950"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Refresh Actions */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder={
                  isAr
                    ? "بحث بالرمز، العميل، الهاتف..."
                    : "Search code, customer, phone..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-9 pe-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute top-3 start-3" />
            </div>

            <button
              type="button"
              onClick={() => refreshOrders(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold shadow-2xs transition disabled:opacity-50 shrink-0"
              title={isAr ? "تحديث جدول الطلبات فوراً" : "Refresh Orders"}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-gold-500" : ""}`} />
              <span className="hidden sm:inline">{isAr ? "تحديث فوري" : "Live Sync"}</span>
            </button>
          </div>
        </div>

        {/* Live sync indicator */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{isAr ? "مزامنة تلقائية فورية مفعلة" : "Real-time sync active"}</span>
          </div>
          {lastRefreshedAt && (
            <span>
              {isAr ? `آخر مزامنة: ${lastRefreshedAt}` : `Last synced: ${lastRefreshedAt}`}
            </span>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
              {isAr ? "لا توجد طلبات تطابق هذا التصنيف" : "No orders found"}
            </h4>
            <p className="text-xs text-neutral-500">
              {isAr
                ? "يمكنك تعديل معايير البحث أو اختيار حالة طلبات أخرى."
                : "Try adjusting your search query or selecting a different status filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/70 text-neutral-500">
                  <th className="py-3 px-4 text-start font-semibold">
                    {isAr ? "رمز الطلب" : "Order Code"}
                  </th>
                  <th className="py-3 px-4 text-start font-semibold">
                    {isAr ? "العميل" : "Customer"}
                  </th>
                  <th className="py-3 px-4 text-start font-semibold">
                    {isAr ? "الهاتف" : "Phone"}
                  </th>
                  <th className="py-3 px-4 text-start font-semibold">
                    {isAr ? "العنوان" : "Address"}
                  </th>
                  <th className="py-3 px-4 text-start font-semibold">
                    {isAr ? "الأصناف" : "Items"}
                  </th>
                  <th className="py-3 px-4 text-start font-semibold">
                    {isAr ? "الإجمالي" : "Total"}
                  </th>
                  <th className="py-3 px-4 text-start font-semibold">
                    {isAr ? "الحالة" : "Status"}
                  </th>
                  <th className="py-3 px-4 text-start font-semibold">
                    {isAr ? "تحديث وإجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-neutral-900 dark:text-white">
                        {order.orderCode}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1 mt-0.5 whitespace-nowrap">
                        <Clock className="w-2.5 h-2.5 text-gold-500 shrink-0" />
                        <span>{formatFullDateTime(order.createdAt, locale).fullStr}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-800 dark:text-neutral-200">
                      {order.customerName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600 dark:text-neutral-400">
                      {order.phone}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 max-w-xs">
                      <div className="truncate font-medium text-neutral-800 dark:text-neutral-200">
                        {order.city} - {order.address.split("[📍")[0]}
                      </div>
                      {(order.locationUrl || order.address.includes("google.com/maps")) && (
                        <a
                          href={
                            order.locationUrl ||
                            order.address.match(/https:\/\/www\.google\.com\/maps[^\s\]]+/)?.[0] ||
                            "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-black text-rose-600 dark:text-rose-400 hover:underline"
                        >
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span>{isAr ? "موقع الخريطة (GPS) ↗" : "View Map ↗"}</span>
                        </a>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {order.items.length}
                      </span>{" "}
                      {isAr ? "أصناف" : "items"}
                    </td>
                    <td className="py-3.5 px-4">
                      <CurrencyBadge amount={order.totalAmount} locale={locale} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={order.status} locale={locale} />
                    </td>
                    <td className="py-3.5 px-4">
                      <OrderRowActions
                        order={order}
                        locale={locale}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteOrder}
                      />
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

"use client";

import React, { useState, useTransition } from "react";
import type { OrderType, OrderStatus } from "@/types";
import { updateOrderStatus, deleteOrder } from "@/actions/orders";
import { MessageCircle, Loader2, Eye, X, Trash2, AlertCircle } from "lucide-react";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";

interface OrderRowActionsProps {
  order: OrderType;
  locale: "ar" | "en";
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  onDelete?: (orderId: string) => void;
}

export function OrderRowActions({ order, locale, onStatusChange, onDelete }: OrderRowActionsProps) {
  const isAr = locale === "ar";
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statuses: Array<{ value: OrderStatus; labelAr: string; labelEn: string }> = [
    { value: "PENDING_PAYMENT", labelAr: "بانتظار التحويل", labelEn: "Pending Payment" },
    { value: "PAYMENT_CONFIRMED", labelAr: "تم تأكيد الدفع", labelEn: "Payment Confirmed" },
    { value: "PROCESSING", labelAr: "قيد التجهيز", labelEn: "Processing" },
    { value: "SHIPPED", labelAr: "تم الشحن", labelEn: "Shipped" },
    { value: "DELIVERED", labelAr: "تم التسليم", labelEn: "Delivered" },
    { value: "CANCELLED", labelAr: "ملغي", labelEn: "Cancelled" },
  ];

  const handleStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    onStatusChange?.(order.id, newStatus);
    startTransition(async () => {
      await updateOrderStatus(order.id, newStatus);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteOrder(order.id);
      onDelete?.(order.id);
      setShowDeleteConfirm(false);
    });
  };

  const rawPhone = order.phone.replace(/[^0-9]/g, "");
  // Prepend Yemen 967 if local 9-digit
  const internationalPhone = rawPhone.startsWith("967")
    ? rawPhone
    : `967${rawPhone.startsWith("0") ? rawPhone.slice(1) : rawPhone}`;

  const customerMessage = isAr
    ? `مرحباً ${order.customerName}، نتواصل معك من إدارة متجر أيمن بخصوص طلبك رقم (${order.orderCode}).`
    : `Hello ${order.customerName}, contacting you from Ayman Store regarding your order (${order.orderCode}).`;

  const whatsappCustomerUrl = `https://wa.me/${internationalPhone}?text=${encodeURIComponent(customerMessage)}`;

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={currentStatus}
            disabled={isPending}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            className="text-[11px] font-semibold py-1.5 ps-2.5 pe-6 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-gold-500 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {isAr ? s.labelAr : s.labelEn}
              </option>
            ))}
          </select>
          {isPending && (
            <Loader2 className="w-3 h-3 animate-spin absolute end-2 top-2.5 text-gold-600" />
          )}
        </div>

        {/* WhatsApp Customer Action */}
        <a
          href={whatsappCustomerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition shadow-2xs"
          title={isAr ? "محادثة العميل عبر الواتساب" : "Chat with Customer on WhatsApp"}
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        {/* View Details Modal Trigger */}
        <button
          type="button"
          onClick={() => setShowDetailsModal(true)}
          className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition shadow-2xs"
          title={isAr ? "عرض تفاصيل الطلب" : "View Order Details"}
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Delete Order Trigger */}
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition shadow-2xs"
          title={isAr ? "حذف الطلب" : "Delete Order"}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              {isAr ? `حذف الطلب ${order.orderCode}؟` : `Delete Order ${order.orderCode}?`}
            </h3>
            <p className="text-xs text-neutral-500">
              {isAr
                ? "سيتم حذف هذا الطلب نهائياً ولن يظهر في السجلات."
                : "This order will be permanently removed from records."}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 shadow-md transition disabled:opacity-50"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isAr ? "نعم، احذف" : "Yes, Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  {isAr ? `تفاصيل الطلب: ${order.orderCode}` : `Order Details: ${order.orderCode}`}
                </h3>
                <p className="text-[11px] text-neutral-500">
                  {new Date(order.createdAt).toLocaleString(isAr ? "ar-YE" : "en-US")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl">
              <div>
                <span className="text-neutral-400 block text-[10px]">
                  {isAr ? "العميل" : "Customer"}
                </span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                  {order.customerName}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">
                  {isAr ? "الهاتف" : "Phone"}
                </span>
                <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                  {order.phone}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-400 block text-[10px]">
                  {isAr ? "العنوان" : "Address"}
                </span>
                <span className="text-neutral-700 dark:text-neutral-300">
                  {order.city} - {order.address}
                </span>
              </div>
              {order.notes && (
                <div className="col-span-2">
                  <span className="text-neutral-400 block text-[10px]">
                    {isAr ? "ملاحظات" : "Notes"}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400 italic">
                    {order.notes}
                  </span>
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                {isAr ? "الأصناف المطلوبة" : "Ordered Items"}
              </h4>
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-48 overflow-y-auto">
                {order.items.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {isAr ? item.nameAr : item.nameEn}
                      </span>
                      <span className="text-gold-600 dark:text-gold-400 text-[11px] block">
                        [{isAr ? item.variantAr : item.variantEn}] × {item.quantity}
                      </span>
                    </div>
                    <CurrencyBadge amount={item.itemTotal} locale={locale} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-900 dark:text-white">
                {isAr ? "المبلغ الإجمالي:" : "Grand Total:"}
              </span>
              <CurrencyBadge
                amount={order.totalAmount}
                locale={locale}
                size="md"
                className="text-gold-600 dark:text-gold-400"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

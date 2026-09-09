"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { trackOrder } from "@/actions/orders";
import { useCustomerOrdersStore } from "@/store/useCustomerOrdersStore";
import type { OrderType, OrderStatus } from "@/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";
import { STORE_CONFIG } from "@/config/payment";
import { formatFullDateTime } from "@/lib/utils";
import {
  Search,
  Loader2,
  Package,
  Calendar,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  CheckCircle2,
  Truck,
  CheckCheck,
  AlertCircle,
  RotateCcw,
  BookmarkPlus,
  BookmarkCheck,
} from "lucide-react";

interface TrackOrderClientProps {
  locale: "ar" | "en";
}

export function TrackOrderClient({ locale }: TrackOrderClientProps) {
  const router = useRouter();
  const isAr = locale === "ar";
  const { savedOrderCodes, addOrderCode, reorder } = useCustomerOrdersStore();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<OrderType | null>(null);
  const [reordering, setReordering] = useState(false);

  const isSaved = order ? savedOrderCodes.includes(order.orderCode.toUpperCase()) : false;

  const handleReorder = () => {
    if (!order) return;
    setReordering(true);
    setTimeout(() => {
      reorder(order, () => {
        router.push("/checkout");
      });
      setReordering(false);
    }, 250);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await trackOrder(query.trim());
      setOrder(res);
    } catch (err) {
      console.error(err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const steps: Array<{ status: OrderStatus; labelAr: string; labelEn: string; icon: any }> = [
    { status: "PENDING_PAYMENT", labelAr: "بانتظار التحويل", labelEn: "Pending Payment", icon: Clock },
    { status: "PAYMENT_CONFIRMED", labelAr: "تم تأكيد الدفع", labelEn: "Payment Verified", icon: CheckCircle2 },
    { status: "PROCESSING", labelAr: "قيد التجهيز", labelEn: "Processing", icon: Package },
    { status: "SHIPPED", labelAr: "تم تسليم الشحنة", labelEn: "Shipped", icon: Truck },
    { status: "DELIVERED", labelAr: "تم التسليم", labelEn: "Delivered", icon: CheckCheck },
  ];

  const getStepStatus = (stepStatus: OrderStatus) => {
    if (!order) return "upcoming";
    const statusOrder: OrderStatus[] = [
      "PENDING_PAYMENT",
      "PAYMENT_CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
    ];
    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (order.status === "CANCELLED") return "cancelled";
    if (currentIndex > stepIndex) return "completed";
    if (currentIndex === stepIndex) return "active";
    return "upcoming";
  };

  const supportMessage = order
    ? isAr
      ? `مرحباً متجر أيمن، أود الاستفسار بخصوص طلبي ذو الرمز: ${order.orderCode}`
      : `Hello Ayman Store, I would like to inquire about my order code: ${order.orderCode}`
    : isAr
      ? "مرحباً متجر أيمن، أحتاج مساعدة في تتبع طلبي."
      : "Hello Ayman Store, I need assistance tracking my order.";

  const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsapp.internationalNumber}?text=${encodeURIComponent(supportMessage)}`;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="p-3 sm:p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <input
            type="text"
            required
            placeholder={
              isAr
                ? "أدخل رمز الطلب (مثل: AYMAN-782419) أو رقم الهاتف..."
                : "Enter order code (e.g. AYMAN-782419) or phone number..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full ps-10 pe-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-2xs"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute top-4 start-3.5" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-xs sm:text-sm shadow-luxury flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>{isAr ? "استعلام عن الطلب" : "Track Order"}</span>
            </>
          )}
        </button>
      </form>

      {/* Results */}
      {searched && !order && !loading && (
        <div className="p-8 text-center rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
            {isAr ? "لم يتم العثور على أي طلب مسجل" : "No order found"}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {isAr
              ? "يرجى التأكد من كتابة رمز الطلب بشكل صحيح (مثال: AYMAN-782419) أو رقم هاتفك المسجل أثناء الطلب."
              : "Please make sure your order code or phone number was typed correctly."}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isAr ? "تواصل مع خدمة العملاء للمساعدة" : "Contact Customer Support"}</span>
          </a>
        </div>
      )}

      {order && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-8 animate-in fade-in duration-300">
          {/* Top Order Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-lg text-neutral-900 dark:text-white">
                  {order.orderCode}
                </span>
                <StatusBadge status={order.status} locale={locale} />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-gold-500" />
                  <span>{formatFullDateTime(order.createdAt, locale).dateStr}</span>
                </span>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <span className="flex items-center gap-1 font-mono font-bold text-neutral-700 dark:text-neutral-300">
                  <Clock className="w-3.5 h-3.5 text-gold-500" />
                  <span>{formatFullDateTime(order.createdAt, locale).timeStr}</span>
                </span>
              </div>
            </div>

            <div className="text-start sm:text-end">
              <span className="text-[10px] text-neutral-400 block">
                {isAr ? "المبلغ الإجمالي" : "Total Amount"}
              </span>
              <CurrencyBadge
                amount={order.totalAmount}
                locale={locale}
                size="lg"
                className="text-gold-600 dark:text-gold-400"
              />
            </div>
          </div>

          {/* Timeline / Progress Stepper */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              {isAr ? "مراحل الشحنة:" : "Delivery Progress:"}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {steps.map((step, idx) => {
                const state = getStepStatus(step.status);
                const Icon = step.icon;

                return (
                  <div
                    key={step.status}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2 transition-all ${
                      state === "completed"
                        ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                        : state === "active"
                          ? "border-gold-500 bg-gold-50/70 dark:border-gold-600 dark:bg-gold-950/40 text-gold-700 dark:text-gold-300 ring-2 ring-gold-500/30 font-bold"
                          : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        state === "completed"
                          ? "bg-emerald-600 text-white"
                          : state === "active"
                            ? "bg-gold-500 text-neutral-950 animate-pulse"
                            : "bg-neutral-200 dark:bg-neutral-700 text-neutral-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] leading-tight">
                      {isAr ? step.labelAr : step.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 text-xs">
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 block text-[10px]">
                  {isAr ? "اسم العميل ورقم الهاتف" : "Customer & Phone"}
                </span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                  {order.customerName} - {order.phone}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 block text-[10px]">
                  {isAr ? "العنوان المحدد" : "Delivery Destination"}
                </span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                  {order.city} - {order.address}
                </span>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              {isAr ? "الأصناف المحجوزة:" : "Order Items:"}
            </h4>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      {isAr ? item.nameAr : item.nameEn}
                    </span>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">
                      {isAr ? item.variantAr : item.variantEn} × {item.quantity}
                    </span>
                  </div>
                  <CurrencyBadge amount={item.itemTotal} locale={locale} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Re-Order & Save Section */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-transparent border border-gold-500/25 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-start">
              <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                {isAr ? "هل أعجبك هذا الطلب وتريد تكراره؟" : "Loved this order and want to repeat it?"}
              </span>
              <span className="text-[11px] text-neutral-500 block">
                {isAr
                  ? "كرري الطلب بضغطة واحدة مع إمكانية تعديل الكميات، المنتجات، أو العنوان بالكامل."
                  : "Re-order in 1-click with full ability to modify quantities, items, or address."}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              {!isSaved && (
                <button
                  type="button"
                  onClick={() => {
                    addOrderCode(order.orderCode);
                  }}
                  className="flex-1 sm:flex-initial py-2.5 px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                  title={isAr ? "حفظ هذا الطلب في سجلي" : "Save to my orders"}
                >
                  <BookmarkPlus className="w-4 h-4 text-gold-600" />
                  <span>{isAr ? "حفظ في طلباتي" : "Save Order"}</span>
                </button>
              )}
              {isSaved && (
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? "محفوظ في طلباتك" : "Saved"}</span>
                </div>
              )}

              <button
                type="button"
                disabled={reordering}
                onClick={handleReorder}
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-gold-600/20 transition disabled:opacity-50"
              >
                {reordering ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4" />
                )}
                <span>{isAr ? "تكرار وتعديل الطلب 🔁" : "Re-order & Customize 🔁"}</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Support Callout */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-neutral-500 text-center sm:text-start">
              {isAr
                ? "هل تريد الاستفسار عن موعد وصول الشحنة أو إرسال إشعار تحويل إضافي؟"
                : "Need an update on estimated courier arrival or submitting another receipt?"}
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isAr ? "تواصل مع الإدارة عبر الواتساب" : "Chat on WhatsApp"}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

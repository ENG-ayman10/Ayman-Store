"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { useCustomerOrdersStore } from "@/store/useCustomerOrdersStore";
import { getCustomerOrders } from "@/actions/orders";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";
import { formatFullDateTime } from "@/lib/utils";
import type { OrderType } from "@/types";
import {
  X,
  RotateCcw,
  Package,
  Calendar,
  MapPin,
  Phone,
  Search,
  Loader2,
  Trash2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  ShoppingBag,
  Clock,
} from "lucide-react";

interface CustomerOrdersDrawerProps {
  locale: "ar" | "en";
}

export function CustomerOrdersDrawer({ locale }: CustomerOrdersDrawerProps) {
  const router = useRouter();
  const isAr = locale === "ar";

  const {
    savedOrderCodes,
    isOpen,
    closeOrders,
    removeOrderCode,
    addOrderCode,
    clearAllOrders,
    reorder,
  } = useCustomerOrdersStore();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  // Close on Escape key and prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOrders();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeOrders]);

  // Fetch orders whenever drawer is opened or savedOrderCodes change
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchOrders = async () => {
      if (savedOrderCodes.length === 0) {
        setOrders([]);
        return;
      }
      setLoading(true);
      try {
        const data = await getCustomerOrders(savedOrderCodes);
        if (isMounted) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to load customer orders:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [isOpen, savedOrderCodes]);

  // Search by Phone or Order Code
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setSearchLoading(true);
    try {
      // If looks like phone (all numbers or +), query by phone, otherwise code
      const isPhone = /^[\d+]{5,}$/.test(query);
      const res = await getCustomerOrders(isPhone ? [] : [query], isPhone ? query : undefined);

      if (res && res.length > 0) {
        // Add new order codes to saved list
        res.forEach((o) => addOrderCode(o.orderCode));
        // Merge with existing list
        setOrders((prev) => {
          const map = new Map<string, OrderType>();
          res.forEach((o) => map.set(o.orderCode, o));
          prev.forEach((o) => {
            if (!map.has(o.orderCode)) map.set(o.orderCode, o);
          });
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setSearchQuery("");
      } else {
        alert(
          isAr
            ? "لم يتم العثور على طلبات مطابقة لهذا الرقم. تأكد من إدخال رقم هاتف الطلب أو رمزه بشكل صحيح."
            : "No matching orders found. Please verify your phone number or order code."
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleReorder = (order: OrderType) => {
    setReorderingId(order.id);
    setTimeout(() => {
      reorder(order, () => {
        router.push("/checkout");
      });
      setReorderingId(null);
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Semi-transparent backdrop with click-to-close */}
      <div
        onClick={closeOrders}
        className="fixed inset-0 bg-neutral-950/65 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* Off-canvas Side Drawer Container: Right in Arabic (RTL), Left in English (LTR) */}
      <div
        className={`fixed inset-y-0 ${
          isAr ? "right-0" : "left-0"
        } max-w-full flex z-50 pointer-events-none`}
      >
        <div
          className={`pointer-events-auto w-screen max-w-lg bg-white dark:bg-neutral-950 shadow-2xl flex flex-col h-full ${
            isAr
              ? "border-s border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300"
              : "border-e border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-left duration-300"
          }`}
        >
          {/* Top Header */}
          <div className="shrink-0 p-5 border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-900/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 flex items-center justify-center text-white shadow-md">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-neutral-900 dark:text-white">
                    {isAr ? "طلباتي السابقة وتكرار الطلب" : "My Orders & Quick Re-order"}
                  </h2>
                  {orders.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-gold-100 dark:bg-gold-950/80 text-gold-700 dark:text-gold-300 text-[11px] font-bold">
                      {orders.length}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500">
                  {isAr
                    ? "كرري أي طلب سابق بضغطة زر مع إمكانية تعديل أي تفاصيل"
                    : "Repeat any past order in 1-click and customize any details"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeOrders}
              aria-label={isAr ? "إغلاق" : "Close"}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Lookup Bar (Phone or Order Code) */}
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-800/80 bg-gold-50/30 dark:bg-gold-950/15">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder={
                    isAr
                      ? "ابحثي برقم هاتفك أو رمز الطلب لاسترجاعه..."
                      : "Search by phone or order code to retrieve..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ps-9 pe-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-2xs"
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading || !searchQuery.trim()}
                className="px-3.5 py-2 rounded-xl bg-gold-600 hover:bg-gold-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs shrink-0"
              >
                {searchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{isAr ? "استرجاع" : "Find"}</span>
                )}
              </button>
            </form>
          </div>

          {/* Orders Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-400">
                <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
                <span className="text-xs font-semibold">
                  {isAr ? "جاري تحميل سجل طلباتك السابقة..." : "Loading order history..."}
                </span>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 border border-neutral-200 dark:border-neutral-800 shadow-inner">
                  <ShoppingBag className="w-8 h-8 text-neutral-400" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {isAr ? "لا توجد طلبات محفوظة بعد" : "No Saved Orders Found"}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {isAr
                      ? "عند قيامك بأي طلب في المتجر، سيتم حفظه تلقائياً هنا لتتمكني من تكراره في أي وقت بضغطة واحدة وتعديل العنوان أو المنتجات."
                      : "When you place an order, it will automatically appear here so you can repeat it anytime with 1-click and full customization."}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={closeOrders}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-bold text-xs shadow-md transition"
                  >
                    <span>{isAr ? "تصفح واقتناء المنتجات الآن" : "Start Shopping Now"}</span>
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              orders.map((order) => {
                const isReordering = reorderingId === order.id;
                const timeInfo = formatFullDateTime(order.createdAt, locale);

                // Clean address if it had GPS tag
                const mapRegex = /\[📍 موقع الخريطة:\s*(https?:\/\/[^\s\]]+)\]/;
                const match = order.address?.match(mapRegex);
                const displayAddress = order.address
                  ? order.address.replace(mapRegex, "").trim()
                  : "";
                const mapLink = order.locationUrl || (match ? match[1] : null);

                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:shadow-md transition-all space-y-3.5 relative overflow-hidden group"
                  >
                    {/* Top Order Code & Status Row */}
                    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-neutral-900 dark:text-white tracking-wide">
                            {order.orderCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(order.orderCode)}
                            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
                            title={isAr ? "نسخ رمز الطلب" : "Copy order code"}
                          >
                            {copiedCode === order.orderCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3 h-3 text-gold-500" />
                            <span>{timeInfo.dateStr}</span>
                          </span>
                          <span className="text-neutral-300 dark:text-neutral-700">•</span>
                          <span className="flex items-center gap-1 font-mono font-bold text-neutral-700 dark:text-neutral-300">
                            <Clock className="w-3 h-3 text-gold-500" />
                            <span>{timeInfo.timeStr}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.status} locale={locale} />
                        <button
                          type="button"
                          onClick={() => removeOrderCode(order.orderCode)}
                          className="p-1 text-neutral-400 hover:text-red-500 transition rounded-md"
                          title={isAr ? "إزالة من سجلي" : "Remove from my list"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                        <span>{isAr ? "محتويات الطلب:" : "Order Items:"}</span>
                        <span>{order.items.length} {isAr ? "أصناف" : "items"}</span>
                      </div>

                      <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80 max-h-48 overflow-y-auto pe-1">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="py-1.5 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden relative border border-neutral-200/50 dark:border-neutral-700">
                                <Image
                                  src={item.image || "/uploads/lipstick.webp"}
                                  alt={isAr ? item.nameAr : item.nameEn}
                                  fill
                                  sizes="32px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-neutral-800 dark:text-neutral-200 truncate text-[11px]">
                                  {isAr ? item.nameAr : item.nameEn}
                                </p>
                                <p className="text-[10px] text-neutral-400">
                                  {isAr ? item.variantAr : item.variantEn} × {item.quantity}
                                </p>
                              </div>
                            </div>

                            <CurrencyBadge
                              amount={item.itemTotal}
                              locale={locale}
                              size="sm"
                              className="text-neutral-900 dark:text-white shrink-0 font-bold"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery summary snippet */}
                    <div className="bg-neutral-50 dark:bg-neutral-900/60 p-2.5 rounded-xl text-[11px] space-y-1 border border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gold-500" />
                          <span className="font-semibold">{order.city}</span>
                          <span className="text-neutral-400">- {displayAddress}</span>
                        </span>
                        {mapLink && (
                          <a
                            href={mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-0.5 shrink-0"
                          >
                            <span>{isAr ? "الخريطة" : "Map"}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-neutral-500 text-[10px]">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        <span>{order.phone}</span>
                        <span className="mx-1">•</span>
                        <span>{order.customerName}</span>
                      </div>
                    </div>

                    {/* Grand Total Row */}
                    <div className="flex items-center justify-between pt-1 text-xs font-bold border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {isAr ? "الإجمالي الكلي:" : "Grand Total:"}
                      </span>
                      <CurrencyBadge
                        amount={order.totalAmount}
                        locale={locale}
                        size="sm"
                        className="text-gold-600 dark:text-gold-400 font-black text-sm"
                      />
                    </div>

                    {/* LUXURY RE-ORDER ACTION BUTTON */}
                    <div className="pt-2">
                      <button
                        type="button"
                        disabled={isReordering}
                        onClick={() => handleReorder(order)}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 hover:from-gold-600 hover:to-gold-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-gold-600/20 hover:shadow-lg transition-all disabled:opacity-50 active:scale-[0.99]"
                      >
                        {isReordering ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{isAr ? "جاري تجهيز السلة والطلب..." : "Preparing re-order..."}</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-4 h-4" />
                            <span>
                              {isAr
                                ? "تكرار هذا الطلب مع إمكانية التعديل 🔁"
                                : "Re-order with full customization 🔁"}
                            </span>
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-center text-neutral-400 mt-1.5">
                        {isAr
                          ? "💡 يمكنك بعد الضغط تعديل الكميات أو حذف وإضافة منتجات وتغيير العنوان بالكامل"
                          : "💡 You can modify quantities, change delivery address, or add new items at checkout"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note & Clear history button */}
          {orders.length > 0 && (
            <div className="p-3.5 border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60 flex items-center justify-between text-xs text-neutral-500">
              <span className="text-[11px]">
                {isAr ? "محفوظ على هذا الجهاز" : "Saved on this device"}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      isAr
                        ? "هل تريد بالتأكيد مسح كافة سجلات الطلبات المحفوظة على هذا الجهاز؟"
                        : "Clear all saved order history from this device?"
                    )
                  ) {
                    clearAllOrders();
                    setOrders([]);
                  }
                }}
                className="text-[10px] text-red-500 hover:underline font-semibold"
              >
                {isAr ? "مسح السجل بالكامل" : "Clear All History"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

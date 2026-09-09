"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useCustomerOrdersStore } from "@/store/useCustomerOrdersStore";
import { processOrderCheckout } from "@/actions/checkout";
import { BankTransferCard } from "./BankTransferCard";
import { LocationPickerMap } from "./LocationPickerMap";
import {
  MessageCircle,
  Loader2,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Sparkles,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { YEMEN_GOVERNORATES } from "@/config/yemenGovernorates";
import { STORE_CONFIG } from "@/config/payment";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";
import { Link } from "@/i18n/routing";

export function CheckoutForm({ locale }: { locale: "ar" | "en" }) {
  const { items, getSubtotal, clearCart, updateQuantity, removeItem } = useCartStore();
  const { addOrderCode } = useCustomerOrdersStore();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reorderBanner, setReorderBanner] = useState<{ fromOrderCode?: string } | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });
  const [locationUrl, setLocationUrl] = useState<string | null>(null);
  const [selectedGovCoords, setSelectedGovCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Load prefill details if coming from re-order
  useEffect(() => {
    try {
      const prefillRaw = localStorage.getItem("ayman-store-reorder-prefill");
      if (prefillRaw) {
        const parsed = JSON.parse(prefillRaw);
        if (parsed) {
          setFormData({
            customerName: parsed.customerName || "",
            phone: parsed.phone || "",
            city: parsed.city || "",
            address: parsed.address || "",
            notes: parsed.notes || "",
          });
          if (parsed.locationUrl) {
            setLocationUrl(parsed.locationUrl);
          }
          if (parsed.city) {
            const found = YEMEN_GOVERNORATES.find(
              (g) => g.nameAr === parsed.city || g.nameEn === parsed.city
            );
            if (found) {
              setSelectedGovCoords({ lat: found.lat, lng: found.lng });
            }
          }
          setReorderBanner({ fromOrderCode: parsed.fromOrderCode });
        }
      }
    } catch (err) {
      console.error("Failed to parse reorder prefill", err);
    }
  }, []);

  const handleClearReorderPrefill = () => {
    try {
      localStorage.removeItem("ayman-store-reorder-prefill");
    } catch {}
    setReorderBanner(null);
    setFormData({
      customerName: "",
      phone: "",
      city: "",
      address: "",
      notes: "",
    });
    setLocationUrl(null);
    setSelectedGovCoords(null);
  };

  const handleGovernorateChange = (govName: string) => {
    setFormData((prev) => ({ ...prev, city: govName }));
    const found = YEMEN_GOVERNORATES.find(
      (g) => g.nameAr === govName || g.nameEn === govName
    );
    if (found) {
      setSelectedGovCoords({ lat: found.lat, lng: found.lng });
    }
  };

  const isAr = locale === "ar";
  const subtotal = getSubtotal();
  const shippingFee = STORE_CONFIG.shippingFee;
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await processOrderCheckout({
        customerName: formData.customerName,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        notes: formData.notes,
        locationUrl: locationUrl || undefined,
        locale,
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });

      if (res.success && res.whatsappUrl) {
        if (res.orderCode) {
          addOrderCode(res.orderCode);
        }
        try {
          localStorage.removeItem("ayman-store-reorder-prefill");
        } catch {}
        clearCart();
        // Redirect to WhatsApp URL
        window.location.href = res.whatsappUrl;
      } else {
        setErrorMessage(res.error || (isAr ? "تعذر تسجيل الطلب، يرجى المحاولة ثانية." : "Failed to register order. Please try again."));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(isAr ? "حدث خطأ أثناء الاتصال بالخادم." : "Server communication error.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
          {isAr ? "سلة المشتريات فارغة" : "Your Cart is Empty"}
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          {isAr
            ? "لا يمكنك إتمام الطلب وسلتك فارغة. أضف بعض المنتجات الراقية أولاً!"
            : "You cannot proceed to checkout with an empty cart. Please add some luxury items first!"}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <span>{isAr ? "تصفح المنتجات الآن" : "Browse Products Now"}</span>
          {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 py-6">
      {/* Form Details */}
      <div className="md:col-span-7 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Re-order Alert Banner */}
          {reorderBanner && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-gold-500/15 via-gold-500/10 to-amber-500/5 border border-gold-500/30 text-neutral-900 dark:text-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gold-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {isAr ? "تم استرجاع تفاصيل طلبك السابق بنجاح!" : "Past order details loaded!"}
                    </h4>
                    {reorderBanner.fromOrderCode && (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-gold-200/80 dark:bg-gold-950 text-gold-900 dark:text-gold-200">
                        {reorderBanner.fromOrderCode}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-0.5 leading-relaxed">
                    {isAr
                      ? "يمكنك الآن تعديل العنوان أو رقم الهاتف أو الكميات من ملخص الطلب بحرية تامة قبل التأكيد."
                      : "You can customize your delivery address, phone, or quantities freely before checkout."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleClearReorderPrefill}
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800 text-[11px] font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition shadow-2xs"
                >
                  {isAr ? "تفريغ الحقول والبدء من جديد" : "Clear & Start Fresh"}
                </button>
                <button
                  type="button"
                  onClick={() => setReorderBanner(null)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition"
                  title={isAr ? "إخفاء التنبيه" : "Dismiss"}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {isAr ? "بيانات استلام الطلب والشحن" : "Delivery & Shipping Details"}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isAr
                ? "يرجى تعبئة العنوان بدقة لضمان سرعة التوصيل."
                : "Please fill out the delivery details accurately for swift delivery."}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              {isAr ? "الاسم الكامل" : "Full Name"} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={isAr ? "مثال: أيمن أحمد لطف" : "e.g. Ayman Ahmed Lotf"}
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-2xs transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                {isAr ? "رقم الهاتف (واتساب)" : "Phone Number (WhatsApp)"} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="77XXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-2xs transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                {isAr ? "المحافظة" : "Governorate"} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.city}
                  onChange={(e) => handleGovernorateChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-2xs transition appearance-none cursor-pointer font-bold"
                >
                  <option value="" disabled>
                    {isAr ? "-- اختاري المحافظة (جميع المحافظات الـ 22) --" : "-- Select Yemeni Governorate --"}
                  </option>
                  {YEMEN_GOVERNORATES.map((gov) => (
                    <option key={gov.id} value={isAr ? gov.nameAr : gov.nameEn}>
                      {isAr ? gov.nameAr : gov.nameEn}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none text-neutral-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              {isAr ? "العنوان بالتفصيل" : "Detailed Street Address"} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={isAr ? "اسم الحي، الشارع، بجوار معلم معروف، رقم العمارة..." : "District, Street, Landmark, House / Flat..."}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-2xs transition"
            />

            {/* Interactive GPS Map Picker */}
            <LocationPickerMap
              onLocationChange={(url) => setLocationUrl(url)}
              targetCoords={selectedGovCoords}
              locale={locale}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              {isAr ? "ملاحظات إضافية للتوصيل (اختياري)" : "Delivery Notes (Optional)"}
            </label>
            <textarea
              rows={2}
              placeholder={isAr ? "مثال: يرجى الاتصال قبل الوصول بنصف ساعة..." : "e.g. Please call 30 mins before arrival..."}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-2xs transition"
            />
          </div>

          {/* Payment transfer card */}
          <BankTransferCard locale={locale} />

          {/* Submit action */}
          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="w-full py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isAr ? "جاري تسجيل الطلب وتجهيز الواتساب..." : "Registering Order & Loading WhatsApp..."}</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                <span>{isAr ? "إتمام الطلب وتأكيده عبر الواتساب" : "Confirm Order via WhatsApp"}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Sticky Order Summary */}
      <div className="md:col-span-5">
        <div className="sticky top-24 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              {isAr ? "ملخص طلبك" : "Order Summary"}
            </h3>
            <span className="text-xs text-gold-600 dark:text-gold-400 font-bold">
              {items.length} {isAr ? "منتجات" : "items"}
            </span>
          </div>

          <div className="divide-y divide-neutral-200/80 dark:border-neutral-800 max-h-72 overflow-y-auto space-y-2 pe-1">
            {items.map((item) => (
              <div key={item.variantId} className="py-2 flex items-center justify-between text-xs gap-2">
                <div className="pe-1 min-w-0 flex-1">
                  <p className="font-bold text-neutral-800 dark:text-neutral-200 truncate text-[11px]">
                    {isAr ? item.nameAr : item.nameEn}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {isAr ? item.variantAr : item.variantEn}
                  </p>
                </div>

                {/* Quick Quantity Control in Checkout */}
                <div className="flex items-center gap-1 shrink-0 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-1 py-0.5 rounded-lg shadow-2xs">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                    title={isAr ? "إنقاص الكمية" : "Decrease quantity"}
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="w-4 text-center font-bold text-xs font-mono">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                    title={isAr ? "زيادة الكمية" : "Increase quantity"}
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>

                <CurrencyBadge
                  amount={item.price * item.quantity}
                  locale={locale}
                  size="sm"
                  className="text-neutral-900 dark:text-white shrink-0 font-bold"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-neutral-200 dark:border-neutral-800 pt-3 text-xs">
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
              <CurrencyBadge amount={subtotal} locale={locale} size="sm" />
            </div>
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>{isAr ? "رسوم الشحن الثابتة" : "Delivery Fee"}</span>
              <CurrencyBadge amount={shippingFee} locale={locale} size="sm" />
            </div>
            <div className="flex justify-between font-bold text-sm text-neutral-900 dark:text-white pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
              <span>{isAr ? "الإجمالي الكلي" : "Grand Total"}</span>
              <CurrencyBadge
                amount={grandTotal}
                locale={locale}
                size="md"
                className="text-gold-600 dark:text-gold-400"
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] leading-relaxed">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>
                {isAr
                  ? "تسجيل مباشر في قاعدة البيانات. بعد الضغط على الزر، سيتم نقلك مباشرة إلى واتساب المتجر لتأكيد الطلب وإرفاق صورة الإشعار."
                  : "Instant database order. You will be redirected to WhatsApp to attach your payment receipt and finalize shipping."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

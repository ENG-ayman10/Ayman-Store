"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { processOrderCheckout } from "@/actions/checkout";
import { BankTransferCard } from "./BankTransferCard";
import { MessageCircle, Loader2, ShieldCheck, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { STORE_CONFIG } from "@/config/payment";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";
import { Link } from "@/i18n/routing";

export function CheckoutForm({ locale }: { locale: "ar" | "en" }) {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });

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
        locale,
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });

      if (res.success && res.whatsappUrl) {
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
                {isAr ? "المدينة / المحافظة" : "City / Governorate"} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={isAr ? "صنعاء، عدن، تعز، إب..." : "Sana'a, Aden, Taiz, Ibb..."}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-2xs transition"
              />
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
              <div key={item.variantId} className="pt-2 flex items-center justify-between text-xs">
                <div className="pe-2">
                  <p className="font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1">
                    {isAr ? item.nameAr : item.nameEn}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {isAr ? item.variantAr : item.variantEn} × {item.quantity}
                  </p>
                </div>
                <CurrencyBadge
                  amount={item.price * item.quantity}
                  locale={locale}
                  size="sm"
                  className="text-neutral-900 dark:text-white shrink-0"
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

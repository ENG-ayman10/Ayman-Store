import React from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إتمام الطلب والدفع | متجر أيمن",
  description: "أدخل عنوان الاستلام لتأكيد طلبك مباشرة عبر الواتساب مع خيارات التحويل المعتمدة.",
};

interface CheckoutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
          {isAr ? "إتمام الطلب وتأكيد الشراء" : "Complete Your Order"}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          {isAr
            ? "سجل بياناتك وسيتم توجيهك إلى الواتساب مباشرة لإرفاق إشعار التحويل لبدء الشحن الفوري."
            : "Enter your delivery details to register your order and open WhatsApp with transfer details."}
        </p>
      </div>

      <CheckoutForm locale={locale as "ar" | "en"} />
    </div>
  );
}

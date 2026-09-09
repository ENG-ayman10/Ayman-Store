import React, { Suspense } from "react";
import { TrackOrderClient } from "./TrackOrderClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "تتبع حالة طلبك | متجر أيمن",
  description: "استعلم عن مسار شحنتك وحالة التجهيز والتوصيل باستخدام رمز الطلب أو رقم الهاتف.",
};

interface TrackPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
          {isAr ? "تتبع حالة شحنتك وطلبك" : "Track Your Order"}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          {isAr
            ? "أدخل رمز طلبك (AYMAN-XXXX) أو رقم هاتفك المسجل لمعرفة المرحلة الحالية لطلبك مباشرة."
            : "Enter your unique Order Code (AYMAN-XXXX) or phone number to view live fulfillment status."}
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-12 text-xs text-neutral-400">...</div>}>
        <TrackOrderClient locale={locale as "ar" | "en"} />
      </Suspense>
    </div>
  );
}

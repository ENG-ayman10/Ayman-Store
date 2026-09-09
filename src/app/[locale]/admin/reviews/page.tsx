import React from "react";
import { getAdminReviews } from "@/actions/reviews";
import { AdminReviewsClient } from "./AdminReviewsClient";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "إدارة تقييمات العملاء | متجر أيمن",
  description: "مراجعة واعتماد أو إخفاء تقييمات المشترين الحقيقية والتحكم في ظهورها.",
};

interface ReviewsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminReviewsPage({ params }: ReviewsPageProps) {
  await cookies(); // Force dynamic server evaluation
  const { locale } = await params;
  const isAr = locale === "ar";
  const reviews = await getAdminReviews();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
          {isAr ? "إدارة تقييمات وآراء المشترين" : "Customer Reviews Management"}
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          {isAr
            ? "استعراض تقييمات العملاء الحقيقية الواردة بعد إتمام الطلبات، مع إمكانية اعتمادها أو إخفائها أو حذفها."
            : "Review authentic customer ratings received after orders, with options to approve, hide, or delete them."}
        </p>
      </div>

      <AdminReviewsClient initialReviews={reviews} locale={locale as "ar" | "en"} />
    </div>
  );
}

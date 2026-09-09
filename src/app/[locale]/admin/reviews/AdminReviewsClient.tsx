"use client";

import React, { useState } from "react";
import type { ReviewType } from "@/types";
import { toggleReviewStatus, deleteReview } from "@/actions/reviews";
import {
  Star,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Search,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Loader2,
  Filter,
} from "lucide-react";

interface AdminReviewsClientProps {
  initialReviews: ReviewType[];
  locale: "ar" | "en";
}

export function AdminReviewsClient({
  initialReviews,
  locale,
}: AdminReviewsClientProps) {
  const isAr = locale === "ar";
  const [reviews, setReviews] = useState<ReviewType[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "APPROVED" | "PENDING">("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Stats
  const totalCount = reviews.length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;
  const pendingCount = totalCount - approvedCount;
  const avgRating =
    totalCount > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
      : "0.0";

  // Filtered list
  const filteredReviews = reviews.filter((r) => {
    if (filterStatus === "APPROVED" && !r.isApproved) return false;
    if (filterStatus === "PENDING" && r.isApproved) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.customerName.toLowerCase().includes(q);
      const matchOrder = r.orderCode?.toLowerCase().includes(q);
      const matchCity = r.city?.toLowerCase().includes(q);
      const matchComment = r.comment?.toLowerCase().includes(q);
      return matchName || matchOrder || matchCity || matchComment;
    }

    return true;
  });

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setActionLoadingId(id);
    try {
      const res = await toggleReviewStatus(id, !currentStatus);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, isApproved: res.isApproved ?? !currentStatus } : r
          )
        );
      } else {
        alert(isAr ? "تعذر تعديل حالة التقييم" : "Could not toggle status");
      }
    } catch (err) {
      console.error(err);
      alert(isAr ? "حدث خطأ أثناء تعديل الحالة" : "Error toggling status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        isAr
          ? "هل أنت متأكد من رغبتك في حذف هذا التقييم نهائياً؟"
          : "Are you sure you want to permanently delete this review?"
      )
    ) {
      return;
    }

    setActionLoadingId(id);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert(isAr ? "حدث خطأ أثناء حذف التقييم" : "Error deleting review");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Header Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">
            {isAr ? "إجمالي التقييمات" : "Total Reviews"}
          </span>
          <div className="text-2xl font-black text-neutral-900 dark:text-white font-mono">
            {totalCount}
          </div>
          <span className="text-[10px] text-neutral-500 block">
            {isAr ? "تقييمات واردة من المشترين" : "Received customer reviews"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider">
            {isAr ? "التقييمات المعتمدة" : "Approved Reviews"}
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {approvedCount}
          </div>
          <span className="text-[10px] text-neutral-500 block">
            {isAr ? "ظاهرة حالياً في المتجر" : "Currently visible on store"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-amber-500 block uppercase tracking-wider">
            {isAr ? "متوسط التقييم العام" : "Average Rating"}
          </span>
          <div className="text-2xl font-black text-amber-500 font-mono flex items-center gap-1.5">
            <span>{avgRating}</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
          </div>
          <span className="text-[10px] text-neutral-500 block">
            {isAr ? "من أصل 5.0 نجوم" : "Out of 5.0 stars"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-neutral-400 block uppercase tracking-wider">
            {isAr ? "المخفية / قيد المراجعة" : "Hidden / In Review"}
          </span>
          <div className="text-2xl font-black text-neutral-700 dark:text-neutral-300 font-mono">
            {pendingCount}
          </div>
          <span className="text-[10px] text-neutral-500 block">
            {isAr ? "محجوبة عن الواجهة" : "Hidden from customers"}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterStatus("ALL")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterStatus === "ALL"
                ? "bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {isAr ? `الكل (${totalCount})` : `All (${totalCount})`}
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("APPROVED")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterStatus === "APPROVED"
                ? "bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {isAr ? `معتمدة (${approvedCount})` : `Approved (${approvedCount})`}
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("PENDING")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterStatus === "PENDING"
                ? "bg-white dark:bg-neutral-900 text-amber-600 dark:text-amber-400 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {isAr ? `مخفية (${pendingCount})` : `Hidden (${pendingCount})`}
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? "بحث بالاسم، رقم الطلب، المدينة..." : "Search name, order, city..."}
            className="w-full ps-9 pe-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          />
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-950/60 text-gold-600 dark:text-gold-400 mx-auto flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
            {isAr ? "لا توجد تقييمات مطابقة" : "No reviews match your filters"}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {isAr
              ? "يتم تسجيل التقييمات تلقائياً عند قيام العميلات بإتمام طلباتهن وتقييم الخدمة."
              : "Customer reviews will appear here automatically when clients submit ratings after ordering."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((rev) => {
            const isLoading = actionLoadingId === rev.id;

            return (
              <div
                key={rev.id}
                className={`p-5 rounded-2xl bg-white dark:bg-neutral-900 border transition-all shadow-2xs space-y-3.5 ${
                  rev.isApproved
                    ? "border-neutral-200/90 dark:border-neutral-800"
                    : "border-amber-300/80 dark:border-amber-800/60 bg-amber-50/20"
                }`}
              >
                {/* Header: Customer info & stars */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-white font-black text-sm flex items-center justify-center shadow-2xs">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                          {rev.customerName}
                        </span>
                        {rev.isApproved ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>{isAr ? "معتمد" : "Approved"}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                            <EyeOff className="w-3 h-3" />
                            <span>{isAr ? "مخفي" : "Hidden"}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5 font-mono">
                        {rev.orderCode && (
                          <span className="text-gold-600 dark:text-gold-400 font-bold">
                            #{rev.orderCode}
                          </span>
                        )}
                        {rev.city && <span>• {rev.city}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 shrink-0 bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 rounded-xl">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-300 dark:text-neutral-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                {rev.comment ? (
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    "{rev.comment}"
                  </p>
                ) : (
                  <span className="text-[11px] text-neutral-400 italic block">
                    {isAr ? "تقييم بالنجوم فقط بدون تعليق نصي." : "Star rating only without comment."}
                  </span>
                )}

                {/* Footer Controls: Status toggle & delete */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-neutral-400">
                    {new Date(rev.createdAt).toLocaleString(isAr ? "ar-YE" : "en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleToggle(rev.id, rev.isApproved)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 ${
                        rev.isApproved
                          ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : rev.isApproved ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {rev.isApproved
                          ? isAr
                            ? "إخفاء التقييم"
                            : "Hide"
                          : isAr
                            ? "اعتماد وظهور"
                            : "Approve"}
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 transition active:scale-95 disabled:opacity-50"
                      title={isAr ? "حذف التقييم نهائياً" : "Delete review"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

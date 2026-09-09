"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { submitCustomerReview } from "@/actions/reviews";
import {
  Sparkles,
  Star,
  MessageCircle,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  X,
  Clock,
  ExternalLink,
} from "lucide-react";

interface OrderSuccessReviewModalProps {
  orderCode: string;
  whatsappUrl: string;
  customerName: string;
  city?: string;
  locale: "ar" | "en";
  onClose?: () => void;
}

export function OrderSuccessReviewModal({
  orderCode,
  whatsappUrl,
  customerName,
  city,
  locale,
  onClose,
}: OrderSuccessReviewModalProps) {
  const isAr = locale === "ar";

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Trigger luxury confetti celebration on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#10B981", "#F59E0B", "#F43F5E", "#8B5CF6"],
      });
    } catch {
      // Ignore if canvas not supported
    }
  }, []);

  const handleCopyOrderCode = () => {
    navigator.clipboard.writeText(orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const starLabelsAr = ["", "بحاجة لتحسين", "مقبول", "جيد", "رائع جداً", "ممتاز وفاخر ⭐"];
  const starLabelsEn = ["", "Needs Improvement", "Fair", "Good", "Very Good", "Excellent & Luxury ⭐"];

  const handleSubmitAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      if (comment.trim()) {
        await submitCustomerReview({
          customerName,
          orderCode,
          city,
          rating,
          comment: comment.trim(),
        });
      }
      setSubmittedSuccess(true);
      setTimeout(() => {
        window.location.href = whatsappUrl;
      }, 700);
    } catch (err) {
      console.error(err);
      // Even on error, proceed to WhatsApp so user doesn't get blocked
      window.location.href = whatsappUrl;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipDirectly = () => {
    window.location.href = whatsappUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl border border-neutral-200/90 dark:border-neutral-800 p-6 sm:p-8 space-y-5 relative overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Top Gold Ambient Glow */}
        <div className="absolute -top-24 -end-24 w-48 h-48 bg-gold-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header with celebration badge */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>{isAr ? "تم تسجيل طلبك بنجاح!" : "Order Registered Successfully!"}</span>
            </span>

            <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white">
              {isAr ? `شكراً لكِ، ${customerName}` : `Thank you, ${customerName}!`}
            </h3>

            <div className="flex items-center justify-center gap-2 pt-0.5">
              <span className="text-xs text-neutral-500">{isAr ? "رمز الطلب:" : "Order Code:"}</span>
              <span className="font-mono font-black text-xs text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-200/80 dark:border-neutral-700">
                {orderCode}
              </span>
              <button
                type="button"
                onClick={handleCopyOrderCode}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
                title={isAr ? "نسخ رمز الطلب" : "Copy code"}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Real Review Form */}
        <form onSubmit={handleSubmitAndProceed} className="space-y-4 pt-1 border-t border-neutral-100 dark:border-neutral-800">
          <div className="text-center space-y-1.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
              {isAr ? "ما هو تقييمك لتجربتك في متجرنا؟" : "How was your shopping experience?"}
            </h4>
            <p className="text-[11px] text-neutral-500">
              {isAr
                ? "تقييمك الحقيقي يظهر مباشرة في المتجر ويساعدنا في تطوير خدماتنا دائماً"
                : "Your genuine rating is published to help other shoppers and improve our service"}
            </p>
          </div>

          {/* Interactive Star Rating Picker */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(rating)}
                    className="p-1 transition-transform hover:scale-125 active:scale-95 focus:outline-none"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        active
                          ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                          : "text-neutral-300 dark:text-neutral-700"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {isAr ? starLabelsAr[hoverRating || rating] : starLabelsEn[hoverRating || rating]}
            </span>
          </div>

          {/* Comment Textarea */}
          <div>
            <textarea
              rows={3}
              placeholder={
                isAr
                  ? "اكتبي رأيك أو ملاحظاتك بكل صدق (مثال: سرعة الاستجابة، سهولة الطلب، التغليف الفاخر...)"
                  : "Write your honest feedback (e.g. responsiveness, product quality, packaging...)"
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 text-xs rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/60 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-2xs transition"
            />
          </div>

          {/* Actions: Submit & Go to WhatsApp, or Skip */}
          <div className="space-y-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 active:scale-98"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isAr ? "جاري حفظ التقييم والانتقال للواتساب..." : "Saving & opening WhatsApp..."}</span>
                </>
              ) : submittedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isAr ? "تم حفظ التقييم! جاري فتح الواتساب..." : "Review saved! Opening WhatsApp..."}</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {comment.trim()
                      ? isAr
                        ? "إرسال التقييم ومتابعة إلى واتساب 🚀"
                        : "Submit Review & Proceed to WhatsApp 🚀"
                      : isAr
                        ? "تأكيد ومتابعة إلى واتساب 🚀"
                        : "Confirm & Proceed to WhatsApp 🚀"}
                  </span>
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleSkipDirectly}
                className="text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 underline transition"
              >
                {isAr ? "تخطي والذهاب إلى واتساب مباشرة ↗" : "Skip directly to WhatsApp ↗"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

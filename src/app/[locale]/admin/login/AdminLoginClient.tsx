"use client";

import React, { useState } from "react";
import { loginAdmin } from "@/actions/auth";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Lock, User, Eye, EyeOff, Loader2, ShieldCheck, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { STORE_CONFIG } from "@/config/payment";

interface AdminLoginClientProps {
  locale: "ar" | "en";
}

export function AdminLoginClient({ locale }: AdminLoginClientProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("password", formData.password);

      const res = await loginAdmin(null, data);
      if (res.success) {
        window.location.href = `/${locale}/admin`;
      } else {
        setError(res.error || (isAr ? "بيانات الدخول غير صحيحة" : "Invalid login credentials"));
      }
    } catch {
      setError(isAr ? "حدث خطأ أثناء الاتصال بالخادم" : "Server communication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      {/* Decorative luxury glow */}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-amber-600/20 blur-xl opacity-75 pointer-events-none" />

        <div className="relative rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 flex items-center justify-center text-white shadow-luxury">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-neutral-900 dark:text-white">
              {isAr ? "بوابة إدارة متجر أيمن" : "Ayman Store Admin Portal"}
            </h1>
            <p className="text-xs text-neutral-500">
              {isAr
                ? "منطقة إدارية محمية ومشفرة لمتابعة الطلبات وتأكيد الحوالات"
                : "Protected, encrypted management area for order dispatch & accounting"}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold text-center animate-in fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                {isAr ? "اسم المستخدم" : "Admin Username"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder={isAr ? "admin" : "admin"}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition shadow-2xs"
                />
                <User className="w-4 h-4 text-neutral-400 absolute top-3 start-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                {isAr ? "كلمة المرور الإدارية" : "Admin Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full ps-10 pe-10 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition shadow-2xs font-mono"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute top-3 start-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 absolute top-2.5 end-3"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-xs shadow-luxury transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isAr ? "جاري التحقق والاعتماد..." : "Authenticating..."}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAr ? "تسجيل الدخول الآمن" : "Secure Sign In"}</span>
                </>
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className="pt-2 text-center border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
            <Link
              href="/"
              className="hover:text-neutral-900 dark:hover:text-white transition flex items-center gap-1"
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isAr ? "الرجوع للمتجر" : "Back to Store"}</span>
            </Link>

            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{isAr ? "مشفر بـ HMAC-SHA256" : "HMAC-SHA256 Protected"}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "@/i18n/routing";
import { STORE_CONFIG } from "@/config/payment";
import { MessageCircle, ShieldCheck, Building2, Wallet, Sparkles, MapPin } from "lucide-react";

export function Footer({ locale }: { locale: "ar" | "en" }) {
  const isAr = locale === "ar";

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-neutral-300 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-serif font-bold text-sm">
                A
              </div>
              <span className="font-extrabold text-white text-base">
                {isAr ? STORE_CONFIG.name.ar : STORE_CONFIG.name.en}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {isAr
                ? "وجهتكم الأولى في اليمن للجمال والأناقة الراقية. نوفر أرقى مستحضرات التجميل الأصلية والعبايات والقفاطين مع خدمة الدفع المحلي المباشر والتوصيل السريع."
                : "Your premier luxury boutique in Yemen for authentic cosmetics, skincare, and couture abayas with direct verified local payment and swift nationwide shipping."}
            </p>
            <div className="flex items-center gap-2 text-xs text-gold-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? "منتجات أصلية 100% مضمونة" : "100% Authentic Products"}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/" className="hover:text-gold-400 transition-colors">
                  {isAr ? "الصفحة الرئيسية" : "Home"}
                </Link>
              </li>
              <li>
                <Link href="/#beauty" className="hover:text-gold-400 transition-colors">
                  {isAr ? "مستحضرات التجميل والعناية" : "Beauty & Cosmetics"}
                </Link>
              </li>
              <li>
                <Link href="/#fashion" className="hover:text-gold-400 transition-colors">
                  {isAr ? "الملابس والعبايات الفاخرة" : "Fashion & Luxury Abayas"}
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-gold-400 transition-colors">
                  {isAr ? "تتبع حالة شحنتك" : "Track Your Order"}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold-400 transition-colors">
                  {isAr ? "لوحة الإدارة" : "Admin Panel"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment & Banking Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? "الحسابات المعتمدة للدفع" : "Verified Payment Accounts"}
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <div className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-neutral-200">
                    {isAr ? STORE_CONFIG.accounts[0].nameAr : STORE_CONFIG.accounts[0].nameEn}
                  </div>
                  <div className="font-mono text-gold-400 font-semibold text-xs mt-0.5">
                    {STORE_CONFIG.accounts[0].accountNumber}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {isAr ? STORE_CONFIG.accounts[0].beneficiaryAr : STORE_CONFIG.accounts[0].beneficiaryEn}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-start gap-2.5">
                <Wallet className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-neutral-200">
                    {isAr ? STORE_CONFIG.accounts[1].nameAr : STORE_CONFIG.accounts[1].nameEn}
                  </div>
                  <div className="font-mono text-emerald-400 font-semibold text-xs mt-0.5">
                    {STORE_CONFIG.accounts[1].accountNumber}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {isAr ? STORE_CONFIG.accounts[1].beneficiaryAr : STORE_CONFIG.accounts[1].beneficiaryEn}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direct WhatsApp Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? "التواصل والطلبات المباشرة" : "Direct WhatsApp Support"}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {isAr
                ? "فريقنا متواجد عبر الواتساب لتلقي سندات التحويل، تأكيد الشحن، وتقديم الاستشارات الفورية."
                : "Our dedicated team is ready on WhatsApp for transfer receipt verification and order tracking."}
            </p>
            <a
              href={`https://wa.me/${STORE_CONFIG.whatsapp.internationalNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors w-full justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{STORE_CONFIG.whatsapp.display}</span>
            </a>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{isAr ? "الجمهورية اليمنية - صنعاء" : "Republic of Yemen - Sana'a"}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <p>
            {isAr
              ? `جميع الحقوق محفوظة © ${new Date().getFullYear()} متجر أيمن (Ayman Store)`
              : `All Rights Reserved © ${new Date().getFullYear()} Ayman Store`}
          </p>
          <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isAr ? "نظام دفع محلي آمن وموثوق" : "Secure Verified Local Transactions"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

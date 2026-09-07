import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getProducts } from "@/actions/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { STORE_CONFIG } from "@/config/payment";
import {
  Sparkles,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  Building2,
  Clock,
  ArrowDown,
} from "lucide-react";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const products = await getProducts();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Collection Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold backdrop-blur-md shadow-luxury">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isAr
                ? "مجموعة 2026 الحصرية متوفرة الآن في اليمن"
                : "Exclusive 2026 Collection Available Across Yemen"}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {isAr ? "فخامة تليق بكِ في عالم" : "Exquisite Elegance in"}{" "}
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 bg-clip-text text-transparent">
              {isAr ? "الجمال والأزياء الراقية" : "Haute Beauty & Fashion"}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            {isAr
              ? "نقدم لك أرقى تشكيلات مستحضرات التجميل العالمية والعناية الفائقة، بالإضافة إلى العبايات والقفاطين المصممة بأعلى معايير الإتقان مع أسرع خدمة توصيل محلي."
              : "Discover curated global cosmetics, opulent skincare, and handcrafted abayas and kaftans tailored to perfection with direct verified local payments."}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href="#catalog"
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-xs sm:text-sm shadow-luxury hover:scale-105 transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isAr ? "تصفح التشكيلة الفاخرة" : "Explore Collection"}</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/${STORE_CONFIG.whatsapp.internationalNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-white font-semibold text-xs sm:text-sm backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? "استشارة مجانية عبر واتساب" : "WhatsApp Consultation"}</span>
            </a>
          </div>

          {/* Features Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-neutral-300 border-t border-neutral-800/80 mt-12">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{isAr ? "أصلية 100% ومضمونة" : "100% Genuine Quality"}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{isAr ? "توصيل سريع لجميع المحافظات" : "Fast Yemen Delivery"}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{isAr ? "دفع بالكريمي ومحفظة جيب" : "Kuraimi & Jeeb Transfers"}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{isAr ? "دعم مباشر على مدار الساعة" : "24/7 VIP Concierge"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Spotlight Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Beauty Banner */}
          <div
            id="beauty"
            className="group relative h-64 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 p-8 flex flex-col justify-end shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent z-10" />
            <div className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-700 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/30 via-neutral-900 to-black" />
            <div className="relative z-20 space-y-2">
              <span className="text-[11px] font-bold tracking-widest text-gold-400 uppercase">
                {isAr ? "قسم العناية والجمال" : "Beauty & Cosmetics"}
              </span>
              <h3 className="text-xl font-extrabold text-white">
                {isAr ? "مستحضرات التجميل والعطور الملكية" : "Royal Perfumes & Luxe Makeup"}
              </h3>
              <p className="text-xs text-neutral-300 max-w-sm">
                {isAr
                  ? "أحمر شفاه مخملي، سيرومات نضارة، ودهن عود أصيل بتركيبات استثنائية."
                  : "Velvet lipsticks, glowing serums, and rare aged oud fragrances."}
              </p>
            </div>
          </div>

          {/* Fashion Banner */}
          <div
            id="fashion"
            className="group relative h-64 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 p-8 flex flex-col justify-end shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent z-10" />
            <div className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-700 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-neutral-900 to-black" />
            <div className="relative z-20 space-y-2">
              <span className="text-[11px] font-bold tracking-widest text-gold-400 uppercase">
                {isAr ? "قسم الأزياء الراقية" : "Haute Fashion & Couture"}
              </span>
              <h3 className="text-xl font-extrabold text-white">
                {isAr ? "العبايات الكلاسيكية والقفاطين المطرزة" : "Classic Abayas & Silk Kaftans"}
              </h3>
              <p className="text-xs text-neutral-300 max-w-sm">
                {isAr
                  ? "أقمشة كورية فاخرة، وتطريزات قصب أنيقة تناسب جميع مناسباتك الراقية."
                  : "Authentic premium fabrics with artisanal threadwork for refined occasions."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-gold-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">
              {isAr ? "التشكيلة المتكاملة" : "Full Catalog"}
            </span>
          </div>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
            {isAr ? "المختارات الفاخرة لمتجر أيمن" : "Curated Luxury Selections"}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? "اختر ما يناسبك وسيتم تسجيل طلبك فورا وإرساله إلى الواتساب الرسمي لإتمام الشحن."
              : "Select your favorites. Order is registered and sent directly to WhatsApp for rapid dispatch."}
          </p>
        </div>

        {/* Product Grid with filters */}
        <ProductGrid products={products} locale={locale as "ar" | "en"} />
      </section>

      {/* Why Choose Ayman Store */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 text-white border border-neutral-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              {isAr ? "لماذا متجر أيمن؟" : "Why Choose Ayman Store?"}
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              {isAr ? "تجربة تسوق آمنة، مريحة وموثوقة محلياً" : "A Seamless, Trusted Local Shopping Journey"}
            </h3>
            <p className="text-xs text-neutral-400">
              {isAr
                ? "صممنا متجرنا ليلائم طبيعة التعامل المالي في اليمن، مع تأكيد فوري ومباشر دون تعقيدات."
                : "Optimized specifically for Yemen's local banking with instant confirmation and zero hassle."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-neutral-100">
                {isAr ? "حسابات بنكية ومحافظ رقمية معتمدة" : "Verified Local Accounts"}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isAr
                  ? "تحويل مباشر إلى بنك الكريمي (حساب: 3056058264) أو محفظة جيب (رقم: 779881824) باسم أيمن لطف."
                  : "Direct transfer to Kuraimi Bank (3056058264) or Jeeb Wallet (779881824) under Ayman Lotf."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-neutral-100">
                {isAr ? "توجيه آلي مباشر للواتساب" : "Instant WhatsApp Dispatch"}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isAr
                  ? "بمجرد إدخال عنوانك، ينشئ المتجر رسالة منظمة متضمنة تفاصيل الأصناف لترسلها مباشرة مع سند التحويل."
                  : "Once delivery details are entered, your structured order summary opens in WhatsApp ready for receipt upload."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-neutral-100">
                {isAr ? "تتبع فوري للشحنة" : "Live Order Tracking"}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isAr
                  ? "تحصل على رمز طلب فريد (مثل AYMAN-XXXX) يمكنك من متابعة مرحلة تجهيز وشحن طلبك في أي لحظة."
                  : "Receive a unique code (e.g. AYMAN-XXXX) to track your packaging and courier handover in real-time."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

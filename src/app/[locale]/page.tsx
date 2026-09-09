import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getProducts } from "@/actions/products";
import { getStoreReviews } from "@/actions/reviews";
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
  Star,
  Flame,
  CheckCircle2,
  HeartHandshake,
  Gift,
} from "lucide-react";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const products = await getProducts();
  const realReviews = await getStoreReviews(6);

  // Luxury Category Story Circles
  const storyCategories = [
    {
      titleAr: "مكياج وشفايف",
      titleEn: "Cosmetics",
      image: "/uploads/lipstick.webp",
      tag: "beauty",
    },
    {
      titleAr: "عبايات ملكية",
      titleEn: "Royal Abayas",
      image: "/uploads/abaya.webp",
      tag: "fashion",
    },
    {
      titleAr: "عطور العود",
      titleEn: "Oud Parfums",
      image: "/uploads/perfume.webp",
      tag: "beauty",
    },
    {
      titleAr: "سيروم النضارة",
      titleEn: "Skincare",
      image: "/uploads/serum.webp",
      tag: "beauty",
    },
    {
      titleAr: "قفاطين حرير",
      titleEn: "Silk Kaftans",
      image: "/uploads/dress.webp",
      tag: "fashion",
    },
    {
      titleAr: "طرح وشيلان",
      titleEn: "Scarves",
      image: "/uploads/scarf.webp",
      tag: "fashion",
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. Hero Banner with Modern Luxury Glow */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[300px] bg-gold-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Top Collection Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-[11px] sm:text-xs font-bold backdrop-blur-md shadow-luxury">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span>
              {isAr
                ? "المجموعة الملكية الحصرية 2026 | متوفرة للشحن الفوري في اليمن"
                : "Exclusive 2026 Haute Collection | Fast Nationwide Shipping"}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
            {isAr ? "فخامة وأناقة تليق بكِ في" : "Refined Elegance Tailored in"}{" "}
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 bg-clip-text text-transparent block sm:inline">
              {isAr ? "متجر أيمن الراقي" : "Ayman Luxury Store"}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed font-normal px-2">
            {isAr
              ? "ننتقي لكِ أجود مستحضرات التجميل الأصلية، العطور الملكية الفواحة، والعبايات والقفاطين المصممة بأعلى معايير الإتقان مع دفع معتمد عبر الكريمي وجيب."
              : "Curated genuine cosmetics, private oud parfum, and mastercrafted abayas with verified direct payments across Yemen."}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-3">
            <a
              href="#catalog"
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-black text-xs sm:text-sm shadow-luxury hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isAr ? "تسوقي التشكيلة الفاخرة" : "Explore Collection"}</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/${STORE_CONFIG.whatsapp.internationalNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs sm:text-sm backdrop-blur-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? "استشارة فورية عبر واتساب" : "WhatsApp Concierge"}</span>
            </a>
          </div>

          {/* Value Pillars Strip */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] sm:text-xs text-neutral-300 border-t border-neutral-800/80 mt-8">
            <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-neutral-900/50 border border-neutral-800/50">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span className="font-bold">{isAr ? "أصلية ومضمونة 100%" : "100% Genuine Quality"}</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-neutral-900/50 border border-neutral-800/50">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold">{isAr ? "شحن سريع لكافة المدن" : "Fast Yemen Delivery"}</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-neutral-900/50 border border-neutral-800/50">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold">{isAr ? "دفع بالكريمي ومحفظة جيب" : "Kuraimi & Jeeb Transfers"}</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-neutral-900/50 border border-neutral-800/50">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="font-bold">{isAr ? "خدمة عملاء راقية 24/7" : "24/7 VIP Concierge"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Instagram-Style Luxury Category Story Circles (Responsive Swipeable on Mobile) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-gold-500" />
            <h2 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white">
              {isAr ? "أقسام وتشكيلات المتجر السريعة" : "Featured Categories"}
            </h2>
          </div>
          <span className="text-[11px] text-neutral-400">
            {isAr ? "اسحب للاستكشاف" : "Swipe to explore"}
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {storyCategories.map((item, idx) => (
            <a
              key={idx}
              href="#catalog"
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-gold-400 via-amber-500 to-gold-600 shadow-md group-hover:scale-105 transition-transform">
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-800">
                  <Image
                    src={item.image}
                    alt={isAr ? item.titleAr : item.titleEn}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors text-center whitespace-nowrap">
                {isAr ? item.titleAr : item.titleEn}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 3. Limited-Time Luxury Promotional Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-gold-500 to-amber-700 text-neutral-950 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-start">
              <div className="w-12 h-12 rounded-2xl bg-black/15 flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6 text-neutral-950" />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-black text-gold-300 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  {isAr ? "ميزة خاصة لعميلاتنا" : "Special Client Privilege"}
                </span>
                <h3 className="text-base sm:text-xl font-black text-neutral-950">
                  {isAr
                    ? "شحن مخفض + هدية تجميلية فاخرة مع أي طلب فوق 30,000 ر.ي"
                    : "Discounted Delivery & Luxury Gift with Orders over 30,000 YER"}
                </h3>
              </div>
            </div>

            <a
              href="#catalog"
              className="px-6 py-3 rounded-xl bg-neutral-950 text-gold-400 font-black text-xs hover:bg-neutral-900 transition-all shadow-md active:scale-95 shrink-0"
            >
              {isAr ? "اطلبي الآن واستفيدي" : "Claim Privilege"}
            </a>
          </div>
        </div>
      </section>

      {/* 4. Main Catalog Grid (The Core Product Experience) */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-gold-600 dark:text-gold-400">
              {isAr ? "التشكيلة المتكاملة" : "Full Luxury Catalog"}
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-neutral-900 dark:text-white">
            {isAr ? "المختارات الفاخرة لمتجر أيمن" : "Curated Haute Selections"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
            {isAr
              ? "اختاري ما يناسبكِ وسيتم تسجيل طلبكِ في السحابة فوراً مع تجهيز رسالة الواتساب والسند لضمان أسرع تسليم."
              : "Choose your favorites. Your order is registered immediately on cloud with WhatsApp receipt routing."}
          </p>
        </div>

        {/* Product Grid with responsive 2-column mobile, 3-col tablet, 4-col laptop */}
        <ProductGrid products={products} locale={locale as "ar" | "en"} />
      </section>

      {/* 5. Real Customer Reviews & Social Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-neutral-900 text-white border border-neutral-800 space-y-8 shadow-xl">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>{isAr ? "تقييمات موثقة من عميلاتنا الفعليات" : "Verified Customer Feedback"}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isAr ? "آراء عميلاتنا في مختلف المحافظات اليمنية" : "What Our Clients Say Across Yemen"}
            </h3>
            <p className="text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed">
              {isAr
                ? "شفافية مطلقة ومصداقية كاملة: جميع التقييمات المعروضة هنا واردة من عميلات حقيقيات بعد إتمام طلباتهن واستلامها."
                : "Complete transparency: All displayed reviews are from real customers after receiving their orders."}
            </p>
          </div>

          {realReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {realReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-700/40 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-white">{rev.customerName}</h4>
                      {rev.city && (
                        <span className="text-[10px] text-neutral-400">{rev.city}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAr ? "عميل موثق" : "Verified"}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-neutral-800/40 border border-neutral-800 text-center space-y-3 max-w-md mx-auto">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gold-500/20 flex items-center justify-center text-gold-400">
                <Star className="w-6 h-6 fill-gold-400/40 text-gold-400" />
              </div>
              <h4 className="font-bold text-sm text-white">
                {isAr ? "نظام تقييم حقيقي 100% بدون أي تزييف" : "100% Genuine Customer Reviews"}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isAr
                  ? "نحن نؤمن بالشفافية الكاملة، لذلك يتم نشر آراء العملاء الحقيقيين فقط بعد إتمام كل طلب. شاركينا رأيك عند طلبك القادم!"
                  : "We believe in authentic experiences. Reviews are collected exclusively from real buyers after placing orders."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 6. Payment & Delivery Trust Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-neutral-800 dark:text-neutral-200">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-600 dark:text-gold-400 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-sm">
                {isAr ? "حسابات بنكية ومحافظ رقمية معتمدة" : "Verified Local Accounts"}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {isAr
                  ? "بنك الكريمي (حساب: 3056058264) ومحفظة جيب (رقم: 779881824) باسم أيمن لطف."
                  : "Kuraimi Bank (3056058264) & Jeeb Wallet (779881824) under Ayman Lotf."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-sm">
                {isAr ? "متابعة فورية وتأكيد عبر واتساب" : "Instant WhatsApp Confirmation"}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {isAr
                  ? "بمجرد تأكيد الطلب، تُفتح محادثة الواتساب جاهزة ببياناتك وسندك لبدء تجهيز الشحنة."
                  : "Your order details open directly in WhatsApp ready to confirm and dispatch."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-sm">
                {isAr ? "تتبع فوري بالكود AYMAN-XXXX" : "Live Code Tracking"}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {isAr
                  ? "كود فريد يمكنك من تتبع شحنتك خطوة بخطوة من التجهيز حتى الاستلام."
                  : "Unique tracking code for real-time parcel transit visibility."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Quick Consultation Button on Mobile */}
      <div className="fixed bottom-5 start-5 z-40 sm:hidden">
        <a
          href={`https://wa.me/${STORE_CONFIG.whatsapp.internationalNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all ring-4 ring-emerald-500/20"
          title={isAr ? "محادثة فورية واتساب" : "WhatsApp Concierge"}
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}

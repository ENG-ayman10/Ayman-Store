import type { Metadata } from "next";
import { Cairo, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistDrawer } from "@/components/wishlist/WishlistDrawer";
import { MobileMenuDrawer } from "@/components/common/MobileMenuDrawer";
import "@/app/globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "متجر أيمن | Ayman Store - الفخامة في الجمال والأزياء",
  description:
    "الوجهة الفاخرة لاقتناء أرقى مستحضرات التجميل الأصلية والعبايات والقفاطين مع خدمة الدفع المحلي المباشر والتوصيل السريع لجميع المدن اليمنية.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const activeFont = isAr ? cairo.className : jakarta.className;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cairo.variable} ${jakarta.variable} ${activeFont} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased selection:bg-gold-500 selection:text-white">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header locale={locale as "ar" | "en"} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale as "ar" | "en"} />
          <CartDrawer locale={locale as "ar" | "en"} />
          <WishlistDrawer locale={locale as "ar" | "en"} />
          <MobileMenuDrawer locale={locale as "ar" | "en"} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

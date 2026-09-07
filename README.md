# 🛍️ متجر أيمن الإلكتروني الفاخر | Ayman Luxury E-Commerce

منصة متجر إلكتروني عصرية وفاخرة متخصصة في مستحضرات التجميل والأزياء الراقية، مبنية بأحدث تقنيات الويب **Next.js 15 App Router** و **Prisma ORM** مع دعم كامل للغتين (العربية والإنجليزية) ولوحة تحكم متكاملة لإدارة الطلبات والمنتجات.

---

## ✨ المميزات الرئيسية (Key Features)

- 🌐 **دعم كامل للغتين (العربية والانجليزية / RTL & LTR)**: تجربة مستخدم سلسة ومتوافقة مع الهوية العربية والإنجليزية باستخدام `next-intl`.
- 🎨 **واجهة وتصميم فاخر (Luxury UI/UX)**: مظهر داكن/فاتح فاخر، أنيميشن سلس، وتناسق لوني مميز باستخدام Tailwind CSS.
- 📱 **متجاوب 100% (Fully Responsive)**: متوافق بشكل كامل مع مختلف مقاسات الشاشات والهواتف الذكية والأجهزة اللوحية.
- 🛒 **سلة تسوق وتجربة دفع سلسة (Cart & Checkout)**: إدارة فورية للسلة، خيارات دفع متعددة (سندات بنكية، تحويلات، دفع عند الاستلام)، ورفع إيصال الدفع.
- 📦 **نظام تتبع فوري للطلبات (Order Tracking)**: تتبع تفصيلي لمراحل معالجة وشحن وتوصيل الطلب برقم كود فريد لكل طلب.
- 🛡️ **لوحة إدارة متكاملة ومحمية (Admin Dashboard)**:
  - إدارة وحالة الطلبات مع إمكانية التواصل الفوري عبر الواتساب بنقرة زر.
  - إدارة المنتجات، التصنيفات، الأسعار، والمتغيرات (الألوان، المقاسات، الأحجام).
  - مصادقة آمنة عبر جلسات HttpOnly مشفرة.
- ⚡ **أداء فائق وسرعة تحميل**: توليد صفحات سريعة واستعلامات محسنة عبر Prisma Client.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Form & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)

---

## 🚀 خطوات التشغيل محلياً (Local Development)

### 1. تثبيت الحزم (Install Dependencies)
```bash
npm install
```

### 2. إعداد المتغيرات البيئية (Environment Variables)
قم بنسخ ملف `.env.example` إلى `.env` وتعبئة بيانات قاعدة البيانات وبيانات الدخول للوحة التحكم:
```bash
cp .env.example .env
```

### 3. إعداد قاعدة البيانات (Database Setup)
```bash
# توليد Prisma Client
npm run db:generate

# دفع بنية الجداول لقاعدة البيانات
npm run db:push

# زرع البيانات الأولية للمنتجات والتصنيفات
npm run db:seed
```

### 4. تشغيل خادم التطوير (Run Dev Server)
```bash
npm run dev
```
افتح المتصفح على [http://localhost:3000](http://localhost:3000).

---

## 🌐 النشر والاستضافة السحابية (Deployment)

تم تهيئة المشروع بالكامل ليعمل بسلاسة على منصات الاستضافة السحابية مثل **[Vercel](https://vercel.com)** مع ربطه بقاعدة بيانات سحابية مجانية عبر **[Neon.tech](https://neon.tech)** أو **[Supabase](https://supabase.com)**.

### المتغيرات المطلوبة في Vercel:
- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_APP_URL`

---

## 📄 الترخيص (License)
هذا المشروع مخصص لمتجر أيمن الإلكتروني - جميع الحقوق محفوظة © 2026.

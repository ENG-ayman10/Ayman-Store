import { PrismaClient, CategoryType } from "@prisma/client";

const prisma = new PrismaClient();

export const INITIAL_PRODUCTS = [
  {
    categorySlug: "beauty",
    nameAr: "أحمر شفاه مات مخملي",
    nameEn: "Velvet Matte Lipstick",
    slug: "velvet-matte-lipstick",
    descAr: "تركيبة غنية تدوم طويلاً بلمسة مخملية ناعمة تحافظ على ترطيب الشفاه طوال اليوم مع صبغات نقية وفاخرة.",
    descEn: "Long-lasting rich formula with a smooth matte velvet touch that keeps lips hydrated all day.",
    basePrice: 4500,
    images: ["/uploads/lipstick.webp"],
    isFeatured: true,
    variants: [
      {
        sku: "LIP-01-RED",
        attributes: { shadeAr: "01 قرمزي ملكي", shadeEn: "01 Royal Crimson", colorCode: "#990000" },
        stockQuantity: 15,
        priceOverride: 4500,
      },
      {
        sku: "LIP-02-NUDE",
        attributes: { shadeAr: "02 بيج طبيعي", shadeEn: "02 Soft Nude", colorCode: "#C49A84" },
        stockQuantity: 20,
        priceOverride: 4500,
      },
      {
        sku: "LIP-03-PLUM",
        attributes: { shadeAr: "03 توتي مخملي", shadeEn: "03 Velvet Plum", colorCode: "#6B2D5C" },
        stockQuantity: 12,
        priceOverride: 4800,
      },
    ],
  },
  {
    categorySlug: "fashion",
    nameAr: "عباية كلاسيكية فاخرة",
    nameEn: "Luxury Classic Abaya",
    slug: "luxury-classic-abaya",
    descAr: "قماش كوري أصلي خفيف وناعم بتصميم انسيابي راقٍ يناسب مختلف المناسبات الرسمية واليومية مع تطريز يدوي دقيق.",
    descEn: "Authentic premium Korean fabric with a sleek fluid cut suitable for all occasions with delicate embroidery.",
    basePrice: 18000,
    images: ["/uploads/abaya.webp"],
    isFeatured: true,
    variants: [
      {
        sku: "ABY-52-BLK",
        attributes: { size: "52", colorAr: "أسود داكن", colorEn: "Deep Black", colorCode: "#111111" },
        stockQuantity: 8,
        priceOverride: 18000,
      },
      {
        sku: "ABY-54-BLK",
        attributes: { size: "54", colorAr: "أسود داكن", colorEn: "Deep Black", colorCode: "#111111" },
        stockQuantity: 10,
        priceOverride: 18000,
      },
      {
        sku: "ABY-56-BLK",
        attributes: { size: "56", colorAr: "أسود داكن", colorEn: "Deep Black", colorCode: "#111111" },
        stockQuantity: 6,
        priceOverride: 18000,
      },
    ],
  },
  {
    categorySlug: "beauty",
    nameAr: "عطر العود الملكي الخاص",
    nameEn: "Royal Oud Private Parfum",
    slug: "royal-oud-private-parfum",
    descAr: "توليفة شرقية آسرة تجمع بين دهن العود الكمبودي المعتق والورد الدمشقي والعنبر الذهبي لفوحان لا ينسى.",
    descEn: "Captivating oriental blend combining aged Cambodian Oud, Damascene Rose, and golden amber.",
    basePrice: 24000,
    images: ["/uploads/perfume.webp"],
    isFeatured: true,
    variants: [
      {
        sku: "OUD-50ML",
        attributes: { shadeAr: "حجم 50 مل", shadeEn: "50ml Flacon", colorCode: "#B8860B" },
        stockQuantity: 14,
        priceOverride: 24000,
      },
      {
        sku: "OUD-100ML",
        attributes: { shadeAr: "حجم 100 مل", shadeEn: "100ml Flacon", colorCode: "#B8860B" },
        stockQuantity: 9,
        priceOverride: 38000,
      },
    ],
  },
  {
    categorySlug: "beauty",
    nameAr: "سيروم النضارة بالفيتامين سي الذهبي",
    nameEn: "Radiant Golden Vitamin C Serum",
    slug: "radiant-vitamin-c-serum",
    descAr: "سيروم مركز معزز بمضادات الأكسدة وحمض الهيالورونيك لتفتيح البشرة وتجديد شبابها ونضارتها الطبيعية.",
    descEn: "Concentrated antioxidant serum enriched with hyaluronic acid for bright, rejuvenated glowing skin.",
    basePrice: 7500,
    images: ["/uploads/serum.webp"],
    isFeatured: true,
    variants: [
      {
        sku: "SER-30ML",
        attributes: { shadeAr: "30 مل قطارة دقيقة", shadeEn: "30ml Dropper", colorCode: "#FFA500" },
        stockQuantity: 25,
        priceOverride: 7500,
      },
      {
        sku: "SER-50ML",
        attributes: { shadeAr: "50 مل عبوة اقتصادية", shadeEn: "50ml Value Size", colorCode: "#FFA500" },
        stockQuantity: 18,
        priceOverride: 11000,
      },
    ],
  },
  {
    categorySlug: "fashion",
    nameAr: "قفطان حريري ملكي مطرز",
    nameEn: "Royal Embroidered Silk Kaftan",
    slug: "royal-embroidered-silk-kaftan",
    descAr: "تصميم ملكي فاخر من حرير التوليب الخالص مع حزام خصر منسوج بخيوط القصب الذهبية وأكمام واسعة أنيقة.",
    descEn: "Regal pure silk kaftan featuring handwoven gold thread belt and gracefully draped wide sleeves.",
    basePrice: 28000,
    images: ["/uploads/dress.webp"],
    isFeatured: true,
    variants: [
      {
        sku: "KFT-M-GRN",
        attributes: { size: "M", colorAr: "أخضر زمردي", colorEn: "Emerald Green", colorCode: "#0f52ba" },
        stockQuantity: 5,
        priceOverride: 28000,
      },
      {
        sku: "KFT-L-GRN",
        attributes: { size: "L", colorAr: "أخضر زمردي", colorEn: "Emerald Green", colorCode: "#0f52ba" },
        stockQuantity: 7,
        priceOverride: 28000,
      },
      {
        sku: "KFT-M-NVY",
        attributes: { size: "M", colorAr: "كحلي ملكي", colorEn: "Royal Navy", colorCode: "#000080" },
        stockQuantity: 4,
        priceOverride: 28000,
      },
    ],
  },
  {
    categorySlug: "fashion",
    nameAr: "طرحة شيفون حريري فاخرة",
    nameEn: "Luxury Silk Chiffon Scarf",
    slug: "luxury-silk-chiffon-scarf",
    descAr: "شيفون فائق النعومة غير قابل للانزلاق بأطراف محاكة بإتقان وملمس بارد ومريح طوال اليوم.",
    descEn: "Ultra-soft, non-slip chiffon with tailored edges and an all-day breathable feel.",
    basePrice: 3200,
    images: ["/uploads/scarf.webp"],
    isFeatured: false,
    variants: [
      {
        sku: "SCF-WHT",
        attributes: { size: "قياسي", colorAr: "أبيض لؤلؤي", colorEn: "Pearl White", colorCode: "#F5F5F0" },
        stockQuantity: 30,
        priceOverride: 3200,
      },
      {
        sku: "SCF-BLK",
        attributes: { size: "قياسي", colorAr: "أسود فحمي", colorEn: "Onyx Black", colorCode: "#1A1A1A" },
        stockQuantity: 40,
        priceOverride: 3200,
      },
      {
        sku: "SCF-BGE",
        attributes: { size: "قياسي", colorAr: "بيج دافئ", colorEn: "Warm Beige", colorCode: "#D2B48C" },
        stockQuantity: 25,
        priceOverride: 3200,
      },
    ],
  },
];

async function main() {
  console.log("Seeding Ayman Store database...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const beautyCat = await prisma.category.create({
    data: {
      nameAr: "مستحضرات التجميل والعناية",
      nameEn: "Beauty & Cosmetics",
      slug: "beauty",
      type: CategoryType.BEAUTY,
    },
  });

  const fashionCat = await prisma.category.create({
    data: {
      nameAr: "الملابس والأزياء الراقية",
      nameEn: "Fashion & Apparel",
      slug: "fashion",
      type: CategoryType.CLOTHING,
    },
  });

  const catMap = {
    beauty: beautyCat.id,
    fashion: fashionCat.id,
  };

  for (const p of INITIAL_PRODUCTS) {
    await prisma.product.create({
      data: {
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        slug: p.slug,
        descAr: p.descAr,
        descEn: p.descEn,
        basePrice: p.basePrice,
        categoryId: catMap[p.categorySlug as keyof typeof catMap],
        images: p.images,
        isFeatured: p.isFeatured,
        variants: {
          create: p.variants.map((v) => ({
            sku: v.sku,
            attributes: v.attributes,
            stockQuantity: v.stockQuantity,
            priceOverride: v.priceOverride,
          })),
        },
      },
    });
  }

  // Seed a sample order for demonstration in admin and tracking
  const sampleOrder = await prisma.order.create({
    data: {
      orderCode: "AYMAN-782419",
      locale: "ar",
      customerName: "فاطمة أحمد الكبسي",
      phone: "777123456",
      city: "صنعاء",
      address: "شارع حدة - بجوار فندق البستان",
      notes: "يرجى الاتصال قبل الوصول للتسليم",
      subtotal: 22500,
      shippingFee: 1500,
      totalAmount: 24000,
      status: "PENDING_PAYMENT",
      items: {
        create: [
          {
            nameAr: "عباية كلاسيكية فاخرة",
            nameEn: "Luxury Classic Abaya",
            variantAr: "أسود داكن 54",
            variantEn: "Deep Black 54",
            unitPrice: 18000,
            quantity: 1,
            itemTotal: 18000,
            productId: (await prisma.product.findFirst({ where: { slug: "luxury-classic-abaya" } }))?.id || "",
          },
          {
            nameAr: "أحمر شفاه مات مخملي",
            nameEn: "Velvet Matte Lipstick",
            variantAr: "01 قرمزي ملكي",
            variantEn: "01 Royal Crimson",
            unitPrice: 4500,
            quantity: 1,
            itemTotal: 4500,
            productId: (await prisma.product.findFirst({ where: { slug: "velvet-matte-lipstick" } }))?.id || "",
          },
        ],
      },
    },
  });

  console.log(`Seeding finished successfully. Created sample order: ${sampleOrder.orderCode}`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

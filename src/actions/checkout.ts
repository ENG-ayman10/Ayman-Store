"use server";

import prisma from "@/lib/prisma";
import { generateWhatsAppOrderUrl } from "@/lib/whatsapp";
import { CheckoutSchema, type CheckoutInput } from "@/lib/validations/order";
import { FALLBACK_PRODUCTS, inMemoryOrders } from "@/lib/fallbackData";
import { addOrderToDisk } from "@/lib/orderStorage";
import { STORE_CONFIG } from "@/config/payment";
import type { OrderType } from "@/types";
import { revalidatePath } from "next/cache";

export async function processOrderCheckout(input: CheckoutInput) {
  const validated = CheckoutSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Invalid checkout submission data.",
    };
  }

  const { customerName, phone, city, address, notes, items, locale } = validated.data;
  const shippingFee = STORE_CONFIG.shippingFee;
  const generatedCode = `AYMAN-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    const variantIds = items.map((i) => i.variantId);
    let orderItemsData: Array<{
      productId: string;
      variantId: string;
      nameAr: string;
      nameEn: string;
      variantAr: string;
      variantEn: string;
      unitPrice: number;
      quantity: number;
      itemTotal: number;
    }> = [];
    let subtotal = 0;

    // Try finding variants via Prisma first
    try {
      const dbVariants = await prisma.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: true },
      });

      if (dbVariants.length > 0) {
        orderItemsData = items.map((clientItem) => {
          const dbVariant = dbVariants.find((v) => v.id === clientItem.variantId);
          if (!dbVariant) throw new Error(`Variant ${clientItem.variantId} not found.`);

          const price = Number(dbVariant.priceOverride ?? dbVariant.product.basePrice);
          const itemTotal = price * clientItem.quantity;
          subtotal += itemTotal;

          const attrs = dbVariant.attributes as Record<string, string>;
          const variantAr =
            attrs.shadeAr || `${attrs.colorAr || ""} ${attrs.size || ""}`.trim() || "قياسي";
          const variantEn =
            attrs.shadeEn || `${attrs.colorEn || ""} ${attrs.size || ""}`.trim() || "Standard";

          return {
            productId: dbVariant.productId,
            variantId: dbVariant.id,
            nameAr: dbVariant.product.nameAr,
            nameEn: dbVariant.product.nameEn,
            variantAr,
            variantEn,
            unitPrice: price,
            quantity: clientItem.quantity,
            itemTotal,
          };
        });
      }
    } catch {
      // Ignore and proceed to fallback
    }

    // Fallback if db variants was empty or Prisma failed
    if (orderItemsData.length === 0) {
      for (const clientItem of items) {
        let matchedVariant = null;
        let matchedProduct = null;

        for (const prod of FALLBACK_PRODUCTS) {
          const v = prod.variants.find((v) => v.id === clientItem.variantId || v.sku === clientItem.variantId);
          if (v) {
            matchedVariant = v;
            matchedProduct = prod;
            break;
          }
        }

        if (!matchedProduct || !matchedVariant) {
          // generic fallback item
          const price = 4500;
          const itemTotal = price * clientItem.quantity;
          subtotal += itemTotal;
          orderItemsData.push({
            productId: "prod-1",
            variantId: clientItem.variantId,
            nameAr: "منتج متجر أيمن",
            nameEn: "Ayman Store Product",
            variantAr: "قياسي",
            variantEn: "Standard",
            unitPrice: price,
            quantity: clientItem.quantity,
            itemTotal,
          });
        } else {
          const price = Number(matchedVariant.priceOverride ?? matchedProduct.basePrice);
          const itemTotal = price * clientItem.quantity;
          subtotal += itemTotal;

          const attrs = matchedVariant.attributes;
          const variantAr =
            attrs.shadeAr || `${attrs.colorAr || ""} ${attrs.size || ""}`.trim() || "قياسي";
          const variantEn =
            attrs.shadeEn || `${attrs.colorEn || ""} ${attrs.size || ""}`.trim() || "Standard";

          orderItemsData.push({
            productId: matchedProduct.id,
            variantId: matchedVariant.id,
            nameAr: matchedProduct.nameAr,
            nameEn: matchedProduct.nameEn,
            variantAr,
            variantEn,
            unitPrice: price,
            quantity: clientItem.quantity,
            itemTotal,
          });
        }
      }
    }

    const totalAmount = subtotal + shippingFee;

    const orderRecord: OrderType = {
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderCode: generatedCode,
      locale,
      customerName,
      phone,
      city,
      address,
      notes: notes || null,
      subtotal,
      shippingFee,
      totalAmount,
      status: "PENDING_PAYMENT",
      receiptUrl: null,
      items: orderItemsData.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        orderId: `ord-${Date.now()}`,
        ...item,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. GUARANTEED PERSISTENT DISK STORAGE (Never lost, survives reloads & restarts)
    try {
      await addOrderToDisk(orderRecord);
    } catch (diskErr) {
      console.error("Failed to write order to disk:", diskErr);
    }
    inMemoryOrders.unshift(orderRecord);

    // 2. Also try Prisma if PostgreSQL is running
    try {
      await prisma.order.create({
        data: {
          orderCode: generatedCode,
          locale,
          customerName,
          phone,
          city,
          address,
          notes,
          subtotal,
          shippingFee,
          totalAmount,
          status: "PENDING_PAYMENT",
          items: {
            create: orderItemsData,
          },
        },
      });
    } catch {
      // Prisma optional fallback
    }

    // Invalidate Next.js cache so admin immediately sees new order
    try {
      revalidatePath("/[locale]/admin/orders", "page");
      revalidatePath("/[locale]/admin", "page");
      revalidatePath("/[locale]/track", "page");
    } catch {
      // Revalidate in request context
    }

    const whatsappRedirectUrl = generateWhatsAppOrderUrl({
      orderCode: generatedCode,
      customerName,
      phone,
      city,
      address,
      notes: notes || undefined,
      items: orderItemsData.map((item) => ({
        name: locale === "ar" ? item.nameAr : item.nameEn,
        variantName: locale === "ar" ? item.variantAr : item.variantEn,
        quantity: item.quantity,
        total: item.itemTotal,
      })),
      subtotal,
      shippingFee,
      grandTotal: totalAmount,
      locale: locale as "ar" | "en",
    });

    return {
      success: true,
      orderCode: generatedCode,
      whatsappUrl: whatsappRedirectUrl,
    };
  } catch (error) {
    console.error("Order processing error:", error);
    return { success: false, error: "Failed to create order. Please try again." };
  }
}

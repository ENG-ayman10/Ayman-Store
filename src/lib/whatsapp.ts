import { STORE_CONFIG } from "@/config/payment";

export interface WhatsAppOrderMessagePayload {
  orderCode: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: Array<{
    name: string;
    variantName: string;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  locale: "ar" | "en";
}

export function generateWhatsAppOrderUrl(payload: WhatsAppOrderMessagePayload): string {
  const isAr = payload.locale === "ar";
  const currency = isAr ? STORE_CONFIG.currency.ar : STORE_CONFIG.currency.en;

  const itemsList = payload.items
    .map(
      (item) =>
        `▫️ *${item.name}* [${item.variantName}]\n   └─ ${item.quantity} × ${item.total.toLocaleString()} ${currency}`
    )
    .join("\n");

  const message = isAr
    ? `🛍️ *طلب جديد: ${payload.orderCode}*
--------------------------------------------
*بيانات العميل:*
👤 *الاسم:* ${payload.customerName}
📱 *رقم التواصل:* ${payload.phone}
📍 *العنوان:* ${payload.city} - ${payload.address}
${payload.notes ? `📝 *ملاحظات:* ${payload.notes}\n` : ""}--------------------------------------------
📦 *قائمة المنتجات:*
${itemsList}

🚚 *رسوم التوصيل:* ${payload.shippingFee.toLocaleString()} ${currency}
💰 *الإجمالي النهائي:* ${payload.grandTotal.toLocaleString()} ${currency}
--------------------------------------------
💳 *الحسابات المعتمدة للتحويل:*
• ${STORE_CONFIG.accounts[0].nameAr}: ${STORE_CONFIG.accounts[0].accountNumber} (${STORE_CONFIG.accounts[0].beneficiaryAr})
• ${STORE_CONFIG.accounts[1].nameAr}: ${STORE_CONFIG.accounts[1].accountNumber} (${STORE_CONFIG.accounts[1].beneficiaryAr})
--------------------------------------------
📎 *مرفق لكم إشعار التحويل لتأكيد الطلب وبدء الشحن.*`
    : `🛍️ *New Order: ${payload.orderCode}*
--------------------------------------------
*Customer Information:*
👤 *Name:* ${payload.customerName}
📱 *Phone:* ${payload.phone}
📍 *Address:* ${payload.city} - ${payload.address}
${payload.notes ? `📝 *Notes:* ${payload.notes}\n` : ""}--------------------------------------------
📦 *Order Items:*
${itemsList}

🚚 *Delivery Fee:* ${payload.shippingFee.toLocaleString()} ${currency}
💰 *Grand Total:* ${payload.grandTotal.toLocaleString()} ${currency}
--------------------------------------------
💳 *Payment Transfer Accounts:*
• ${STORE_CONFIG.accounts[0].nameEn}: ${STORE_CONFIG.accounts[0].accountNumber} (${STORE_CONFIG.accounts[0].beneficiaryEn})
• ${STORE_CONFIG.accounts[1].nameEn}: ${STORE_CONFIG.accounts[1].accountNumber} (${STORE_CONFIG.accounts[1].beneficiaryEn})
--------------------------------------------
📎 *Note: Please reply with payment receipt image to confirm order.*`;

  return `https://wa.me/${STORE_CONFIG.whatsapp.internationalNumber}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppSupportUrl(locale: "ar" | "en" = "ar", orderCode?: string): string {
  const isAr = locale === "ar";
  const message = orderCode
    ? isAr
      ? `مرحباً متجر أيمن، أود الاستفسار بخصوص طلبي ذو الرمز: ${orderCode}`
      : `Hello Ayman Store, I would like to inquire about my order code: ${orderCode}`
    : isAr
      ? `مرحباً متجر أيمن، أود الاستفسار عن منتجاتكم وخدمة التوصيل.`
      : `Hello Ayman Store, I would like to inquire about your products and services.`;

  return `https://wa.me/${STORE_CONFIG.whatsapp.internationalNumber}?text=${encodeURIComponent(message)}`;
}

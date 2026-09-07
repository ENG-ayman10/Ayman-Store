export async function sendTelegramOrderNotification(order: {
  orderCode: string;
  customerName: string;
  phone: string;
  city: string;
  totalAmount: number;
  itemsCount: number;
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return; // Telegram not configured, silent return
  }

  try {
    const text = `🛍️ *طلب جديد في متجر أيمن!*\n\n` +
      `🔢 *رمز الطلب:* \`${order.orderCode}\`\n` +
      `👤 *العميل:* ${order.customerName}\n` +
      `📱 *الهاتف:* ${order.phone}\n` +
      `📍 *المدينة:* ${order.city}\n` +
      `📦 *عدد الأصناف:* ${order.itemsCount}\n` +
      `💰 *المبلغ الإجمالي:* *${order.totalAmount.toLocaleString()} ر.ي*\n\n` +
      `🔗 [فتح لوحة الإدارة](https://ayman-store.vercel.app/ar/admin/orders)`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });
  } catch (error) {
    console.warn("Telegram notification error:", error);
  }
}

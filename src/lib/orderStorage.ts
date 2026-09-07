import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import type { OrderType, OrderStatus } from "@/types";

const DATA_DIR = join(process.cwd(), "data");
const ORDERS_FILE = join(DATA_DIR, "orders.json");

const INITIAL_ORDERS: OrderType[] = [
  {
    id: "ord-sample-1",
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
    receiptUrl: null,
    items: [
      {
        id: "item-1",
        orderId: "ord-sample-1",
        productId: "prod-2",
        variantId: "var-aby-2",
        nameAr: "عباية كلاسيكية فاخرة",
        nameEn: "Luxury Classic Abaya",
        variantAr: "أسود داكن 54",
        variantEn: "Deep Black 54",
        unitPrice: 18000,
        quantity: 1,
        itemTotal: 18000,
      },
      {
        id: "item-2",
        orderId: "ord-sample-1",
        productId: "prod-1",
        variantId: "var-lip-1",
        nameAr: "أحمر شفاه مات مخملي",
        nameEn: "Velvet Matte Lipstick",
        variantAr: "01 قرمزي ملكي",
        variantEn: "01 Royal Crimson",
        unitPrice: 4500,
        quantity: 1,
        itemTotal: 4500,
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

async function ensureStorage(): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  if (!existsSync(ORDERS_FILE)) {
    await writeFile(ORDERS_FILE, JSON.stringify(INITIAL_ORDERS, null, 2), "utf-8");
  }
}

export async function readOrdersFromDisk(): Promise<OrderType[]> {
  try {
    await ensureStorage();
    const data = await readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(data) as OrderType[];
  } catch (error) {
    console.error("Error reading orders from disk:", error);
    return INITIAL_ORDERS;
  }
}

export async function writeOrdersToDisk(orders: OrderType[]): Promise<void> {
  try {
    await ensureStorage();
    await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing orders to disk:", error);
    throw error;
  }
}

export async function addOrderToDisk(order: OrderType): Promise<void> {
  const orders = await readOrdersFromDisk();
  // Ensure no duplicate orderCode
  const existingIndex = orders.findIndex((o) => o.orderCode === order.orderCode);
  if (existingIndex !== -1) {
    orders[existingIndex] = order;
  } else {
    orders.unshift(order);
  }
  await writeOrdersToDisk(orders);
}

export async function updateOrderOnDisk(
  orderIdOrCode: string,
  newStatus: OrderStatus
): Promise<boolean> {
  const orders = await readOrdersFromDisk();
  const index = orders.findIndex(
    (o) => o.id === orderIdOrCode || o.orderCode === orderIdOrCode
  );

  if (index === -1) {
    return false;
  }

  orders[index].status = newStatus;
  orders[index].updatedAt = new Date().toISOString();
  await writeOrdersToDisk(orders);
  return true;
}

export async function deleteOrderFromDisk(orderIdOrCode: string): Promise<boolean> {
  const orders = await readOrdersFromDisk();
  const initialCount = orders.length;
  const filtered = orders.filter(
    (o) => o.id !== orderIdOrCode && o.orderCode !== orderIdOrCode
  );

  if (filtered.length === initialCount) {
    return false;
  }

  await writeOrdersToDisk(filtered);
  return true;
}

export async function findOrderOnDisk(query: string): Promise<OrderType | null> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return null;

  const orders = await readOrdersFromDisk();
  return (
    orders.find(
      (o) =>
        o.orderCode.toLowerCase() === trimmed ||
        o.phone.replace(/[^0-9]/g, "").includes(trimmed.replace(/[^0-9]/g, ""))
    ) || null
  );
}

"use server";

import prisma from "@/lib/prisma";
import {
  readOrdersFromDisk,
  updateOrderOnDisk,
  deleteOrderFromDisk,
  findOrderOnDisk,
} from "@/lib/orderStorage";
import type { OrderType, OrderStatus } from "@/types";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/actions/auth";

export async function trackOrder(query: string): Promise<OrderType | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  // 1. Try disk storage first (fast, guaranteed persistent)
  const diskOrder = await findOrderOnDisk(trimmed);
  if (diskOrder) {
    return diskOrder;
  }

  // 2. Try Prisma if available
  try {
    const dbOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { orderCode: { equals: trimmed, mode: "insensitive" } },
          { phone: { contains: trimmed } },
        ],
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbOrder) {
      return {
        id: dbOrder.id,
        orderCode: dbOrder.orderCode,
        locale: dbOrder.locale,
        customerName: dbOrder.customerName,
        phone: dbOrder.phone,
        city: dbOrder.city,
        address: dbOrder.address,
        notes: dbOrder.notes,
        subtotal: Number(dbOrder.subtotal),
        shippingFee: Number(dbOrder.shippingFee),
        totalAmount: Number(dbOrder.totalAmount),
        status: dbOrder.status as OrderStatus,
        receiptUrl: dbOrder.receiptUrl,
        items: dbOrder.items.map((i) => ({
          id: i.id,
          orderId: i.orderId,
          productId: i.productId,
          variantId: i.variantId,
          nameAr: i.nameAr,
          nameEn: i.nameEn,
          variantAr: i.variantAr,
          variantEn: i.variantEn,
          unitPrice: Number(i.unitPrice),
          quantity: i.quantity,
          itemTotal: Number(i.itemTotal),
        })),
        createdAt: dbOrder.createdAt.toISOString(),
        updatedAt: dbOrder.updatedAt.toISOString(),
      };
    }
  } catch {
    // Prisma optional
  }

  return null;
}

export async function getAdminOrders(filterStatus?: OrderStatus | "ALL"): Promise<OrderType[]> {
  // Guaranteed persistent read from disk
  const allOrders = await readOrdersFromDisk();

  // Sort descending by creation date
  allOrders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (filterStatus && filterStatus !== "ALL") {
    return allOrders.filter((o) => o.status === filterStatus);
  }

  return allOrders;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Guaranteed update on disk
    const updated = await updateOrderOnDisk(orderId, status);

    // 2. Also try Prisma if running
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });
    } catch {
      // Prisma optional
    }

    revalidatePath("/[locale]/admin/orders", "page");
    revalidatePath("/[locale]/admin", "page");
    revalidatePath("/[locale]/track", "page");

    return { success: updated };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "حدث خطأ أثناء تحديث حالة الطلب" };
  }
}

export async function deleteOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth && process.env.NODE_ENV === "production") {
    return { success: false, error: "غير مصرح لك بحذف الطلبات" };
  }

  try {
    const deleted = await deleteOrderFromDisk(orderId);

    try {
      await prisma.order.delete({
        where: { id: orderId },
      });
    } catch {
      // Prisma optional
    }

    revalidatePath("/[locale]/admin/orders", "page");
    revalidatePath("/[locale]/admin", "page");

    return { success: deleted };
  } catch (error) {
    console.error("Failed to delete order:", error);
    return { success: false, error: "حدث خطأ أثناء حذف الطلب" };
  }
}

export async function getOrderStats() {
  const orders = await getAdminOrders();
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.status !== "CANCELLED" ? o.totalAmount : 0),
    0
  );
  const pendingPayment = orders.filter((o) => o.status === "PENDING_PAYMENT").length;
  const processing = orders.filter(
    (o) => o.status === "PROCESSING" || o.status === "PAYMENT_CONFIRMED"
  ).length;
  const shipped = orders.filter((o) => o.status === "SHIPPED").length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;

  return {
    totalOrders: orders.length,
    totalRevenue,
    pendingPayment,
    processing,
    shipped,
    delivered,
  };
}

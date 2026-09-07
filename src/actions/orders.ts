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

// Helper to convert Prisma Order to OrderType
function mapPrismaOrderToOrderType(dbOrder: any): OrderType {
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
    items: (dbOrder.items || []).map((i: any) => ({
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
    createdAt: typeof dbOrder.createdAt === "string" ? dbOrder.createdAt : dbOrder.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: typeof dbOrder.updatedAt === "string" ? dbOrder.updatedAt : dbOrder.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

export async function trackOrder(query: string): Promise<OrderType | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  // 1. Primary: Try Prisma PostgreSQL
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
      return mapPrismaOrderToOrderType(dbOrder);
    }
  } catch (error) {
    console.warn("Prisma trackOrder fallback:", error);
  }

  // 2. Fallback: Try disk storage
  const diskOrder = await findOrderOnDisk(trimmed);
  if (diskOrder) {
    return diskOrder;
  }

  return null;
}

export async function getAdminOrders(filterStatus?: OrderStatus | "ALL"): Promise<OrderType[]> {
  // 1. Primary: Try Prisma PostgreSQL (Production Serverless database)
  try {
    const whereClause: Record<string, any> = {};
    if (filterStatus && filterStatus !== "ALL") {
      whereClause.status = filterStatus;
    }

    const dbOrders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbOrders && dbOrders.length > 0) {
      return dbOrders.map(mapPrismaOrderToOrderType);
    }
  } catch (error) {
    console.warn("Prisma getAdminOrders query error, falling back to disk/cache:", error);
  }

  // 2. Fallback to disk storage if database has no orders or is unreachable
  const allOrders = await readOrdersFromDisk();
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
    let updated = false;

    // 1. Primary: Update in Prisma PostgreSQL
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });
      updated = true;
    } catch {
      // Try by orderCode if id didn't match directly
      try {
        await prisma.order.update({
          where: { orderCode: orderId },
          data: { status },
        });
        updated = true;
      } catch (prismaErr) {
        console.warn("Prisma order update fallback:", prismaErr);
      }
    }

    // 2. Also update on disk for local dev consistency
    try {
      const diskUpdated = await updateOrderOnDisk(orderId, status);
      if (diskUpdated) updated = true;
    } catch (diskErr) {
      console.warn("Disk update order error:", diskErr);
    }

    revalidatePath("/[locale]/admin/orders", "page");
    revalidatePath("/[locale]/admin", "page");
    revalidatePath("/[locale]/track", "page");
    revalidatePath("/api/orders", "page");

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
    let deleted = false;

    // 1. Primary: Delete in Prisma PostgreSQL
    try {
      await prisma.orderItem.deleteMany({
        where: { orderId },
      });
      await prisma.order.delete({
        where: { id: orderId },
      });
      deleted = true;
    } catch {
      try {
        const found = await prisma.order.findUnique({ where: { orderCode: orderId } });
        if (found) {
          await prisma.orderItem.deleteMany({ where: { orderId: found.id } });
          await prisma.order.delete({ where: { id: found.id } });
          deleted = true;
        }
      } catch (prismaErr) {
        console.warn("Prisma delete fallback:", prismaErr);
      }
    }

    // 2. Also delete on disk
    try {
      const diskDeleted = await deleteOrderFromDisk(orderId);
      if (diskDeleted) deleted = true;
    } catch (diskErr) {
      console.warn("Disk delete order error:", diskErr);
    }

    revalidatePath("/[locale]/admin/orders", "page");
    revalidatePath("/[locale]/admin", "page");
    revalidatePath("/[locale]/track", "page");
    revalidatePath("/api/orders", "page");

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

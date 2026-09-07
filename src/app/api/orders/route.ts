import { NextResponse } from "next/server";
import { getAdminOrders } from "@/actions/orders";
import { processOrderCheckout } from "@/actions/checkout";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const orders = await getAdminOrders((status as any) || "ALL");
  return NextResponse.json({ success: true, count: orders.length, orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await processOrderCheckout(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

import { APIOrderService } from "@/services/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { orderIds } = await request.json();
  try {
    const orders = await APIOrderService.markAsDelivered(orderIds);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
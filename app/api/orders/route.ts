import { getUserAuth } from "@/lib/auth/utils";
import { NextRequest, NextResponse } from "next/server";
import { createOrderSchema } from "@/dto/order/create-order.dto";
import { CreateOrderDTO, GetOrdersParams } from "@/types";
import { APIOrderService } from "@/services/api";
import { formatZodError } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });
  if (!session.user.selectedCompany) return new Response("Error", { status: 400 });
  
  const searchParams = request.nextUrl.searchParams

  const page = Number(searchParams.get('page') || 0);
  const per_page = Number(searchParams.get('per_page') || 10);
  const status = searchParams.get('status') as GetOrdersParams["status"] || "ALL";
  const forToday = searchParams.get('forToday') === "true";
  const keyword = searchParams.get('keyword') || "";
  const timezone = searchParams.get('timezone') || "America/Argentina/Buenos_Aires";
  const isConfirmed = searchParams.get('isConfirmed') === "true" || searchParams.get('isConfirmed') === "false" || undefined;

  const { orders, ordersCount } = await APIOrderService.getAllOrders(session.user.selectedCompany.id, { page, per_page, status, forToday, keyword, isConfirmed }, timezone);

  return NextResponse.json({ orders, ordersCount });
}

export async function POST(request: Request) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const body = (await request.json()) as CreateOrderDTO;

  const newOrderDTO = createOrderSchema.safeParse({
    ...body,
    toDeliverAt: body.toDeliverAt ? new Date(body.toDeliverAt) : undefined
  });

  if (!newOrderDTO.success) {
    return NextResponse.json(formatZodError(newOrderDTO.error), { status: 422 });
  }

  try {
    const newOrder = await APIOrderService.createOrder({
      createOrderDto: newOrderDTO.data,
      companyId: session.user.selectedCompany.id,
      userId: session.user.id,
      isStockSystemEnabled: session.user.selectedCompany.useStockSystem
    });
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}

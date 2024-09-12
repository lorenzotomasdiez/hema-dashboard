import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { OrderStatus } from "@prisma/client"
import { createOrderSchema, CreateOrderType } from "./types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const searchParams = request.nextUrl.searchParams

  const page = Number(searchParams.get('page') || 0);
  const per_page = Number(searchParams.get('per_page') || 10);
  const status = searchParams.get('status') || "ALL";

  const orders = await db.order.findMany({
    skip: page * per_page,
    take: per_page,
    ...(status !== "ALL" && { where: { status: OrderStatus[status as OrderStatus] } }),
    orderBy: [
      {
        createdAt: "desc"
      }
    ]
  });

  return new Response(JSON.stringify(orders));
}

export async function POST(request: Request) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const body = (await request.json()) as CreateOrderType;

  const newOrderDTO = createOrderSchema.safeParse(body);

  if (!newOrderDTO.success) {
    return new Response(JSON.stringify(newOrderDTO.error), { status: 422 });
  }

  const { quantity, status, type, clientId, deliveredAt } = newOrderDTO.data;

  const order = await db.order.create({
    data: {
      quantity,
      type,
      clientId,
      userId: session.user.id,
      status,
      deliveredAt
    }
  });

  return new Response(JSON.stringify(order), { status: 201 });
}

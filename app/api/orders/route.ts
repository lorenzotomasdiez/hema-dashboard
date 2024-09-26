import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { OrderStatus } from "@prisma/client"
import { NextRequest } from "next/server";
import { createOrderSchema } from "@/dto/order/create-order.dto";
import { CreateOrderType } from "@/types";

export async function GET(request: NextRequest) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const searchParams = request.nextUrl.searchParams

  const page = Number(searchParams.get('page') || 0);
  const per_page = Number(searchParams.get('per_page') || 10);
  const status = searchParams.get('status') || "ALL";
  const forToday = searchParams.get('forToday') === "true";
  const keyword = searchParams.get('keyword') || "";
  const timezone = searchParams.get('timezone') || "America/Argentina/Buenos_Aires";

  const orders = await db.order.findMany({
    skip: page * per_page,
    take: per_page,
    where: {
      ...(status !== "ALL" && { status: OrderStatus[status as OrderStatus] }),
      ...(forToday && {
        deliveredAt: {
          gte: new Date(new Date(new Date().toLocaleString("en-US", { timeZone: timezone })).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(new Date().toLocaleString("en-US", { timeZone: timezone })).setHours(23, 59, 59, 999))
        }
      }),
      ...(keyword && { client: { name: { contains: keyword, mode: 'insensitive' } } }),
    },
    orderBy: [
      {
        createdAt: "desc"
      }
    ],
    include: {
      products: true,
    },
  });

  const ordersCount = await db.order.count({
    where: {
      ...(status !== "ALL" && { status: OrderStatus[status as OrderStatus] }),
      ...(forToday && { deliveredAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)), lte: new Date(new Date().setHours(23, 59, 59, 999)) } }),
      ...(keyword && { client: { name: { contains: keyword, mode: 'insensitive' } } }),
    }
  });

  return new Response(JSON.stringify({ orders, ordersCount }));
}

export async function POST(request: Request) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const body = (await request.json()) as CreateOrderType;

  const newOrderDTO = createOrderSchema.safeParse({
    ...body,
    deliveredAt: body.deliveredAt ? new Date(body.deliveredAt) : undefined
  });

  if (!newOrderDTO.success) {
    return new Response(JSON.stringify(newOrderDTO.error), { status: 422 });
  }

  const { status, products, clientId, deliveredAt } = newOrderDTO.data;

  const order = await db.order.create({
    data: {
      clientId,
      userId: session.user.id,
      status,
      deliveredAt,
      products: {
        create: products.map(product => ({
          product: { connect: { id: product.productId } },
          quantity: product.quantity
        }))
      }
    },
    include: {
      products: true
    }
  });

  return new Response(JSON.stringify(order), { status: 201 });
}

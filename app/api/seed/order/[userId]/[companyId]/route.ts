import { db } from "@/lib/db/index";
import { CreateOrderDTO } from "@/types/order";
import { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { userId: string, companyId: string } }) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
  const userId = params.userId;
  const companyId = params.companyId;
  if (!userId || !companyId) {
    return NextResponse.json({ error: "Params are required" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { id: userId }
  });

  const company = await db.company.findUnique({
    where: { id: companyId }
  });

  if (!user || !company) {
    console.error("User or company not found", { user, company });
    return NextResponse.json({ error: "User or company not found" }, { status: 404 });
  }

  try {

    const clients = await db.client.findMany();
    const products = await db.product.findMany();
    const orderStatus = ["PENDING", "SHIPPED", "DELIVERED"];

    const orders: CreateOrderDTO[] = [];

    for (let i = 0; i < 10; i++) {
      const client = clients[Math.floor(Math.random() * clients.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const status = orderStatus[Math.floor(Math.random() * orderStatus.length)];
      const order: CreateOrderDTO = {
        clientId: client.id,
        products: [{ productId: product.id, quantity: Math.floor(Math.random() * 10) + 1 }],
        status: status as OrderStatus,
        toDeliverAt: new Date()
      };
      orders.push(order);
    }

    for (const order of orders) {
      await db.order.create({
        data: {
          clientId: order.clientId,
          userId: userId,
          status: order.status,
          deliveredAt: order.toDeliverAt,
          products: {
            create: order.products.map(product => ({
              product: { connect: { id: product.productId } },
              quantity: product.quantity
            }))
          },
          companyId: companyId
        },
        include: {
          products: true
        }
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("Error creating orders:", error);
    return new Response("Error creating orders", { status: 500 });
  }
}
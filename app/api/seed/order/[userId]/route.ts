import { db } from "@/lib/db/index";
import { CreateOrderType } from "@/types/order";
import { OrderStatus } from "@prisma/client";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Error not allowed", { status: 403 });
  }
  const userId = params.userId;

  if (!userId) {
    return new Response("User id is required", { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  try {

    const clients = await db.client.findMany();
    const products = await db.product.findMany();
    const orderStatus = ["PENDING", "SHIPPED", "DELIVERED"];

    const orders: CreateOrderType[] = [];

    for (let i = 0; i < 10; i++) {
      const client = clients[Math.floor(Math.random() * clients.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const status = orderStatus[Math.floor(Math.random() * orderStatus.length)];
      const order: CreateOrderType = {
        clientId: client.id,
        products: [{ productId: product.id, quantity: Math.floor(Math.random() * 10) + 1 }],
        status: status as OrderStatus,
        deliveredAt: status === "DELIVERED" ? new Date() : undefined
      };
      orders.push(order);
    }

    for (const order of orders) {
      await db.order.create({
        data: {
          clientId: order.clientId,
          userId: userId,
          status: order.status,
          deliveredAt: order.deliveredAt,
          products: {
            create: order.products.map(product => ({
              product: { connect: { id: product.productId } },
              quantity: product.quantity
            }))
          }
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
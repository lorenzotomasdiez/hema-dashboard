import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { CompleteOrder } from "@/prisma/zod";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const id = Number(params.id);

  const orderData = await db.order.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          product: true
        }
      }
    }
  });

  if (orderData) {
    const total = orderData.products.reduce((sum, orderProduct) => {
      return sum + (orderProduct.quantity * orderProduct.product.price);
    }, 0);

    const order = {
      ...orderData,
      total
    };

    return Response.json(order, { status: 200 });
  }

  return Response.json(null, { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const id = Number(params.id);

  const body = (await request.json()) as Partial<CompleteOrder>;

  delete body.id;

  const { client, user, ...updateData } = body;

  const orderProducts = body.products;

  const order = await db.order.update({
    where: { id },
    data: {
      ...updateData,
      updatedAt: new Date().toISOString(),
      products: {
        deleteMany: {
          orderId: id,
          productId: {
            notIn: orderProducts?.map(p => p.productId) ?? []
          }
        },
        upsert: orderProducts?.map((product) => ({
          where: {
            orderId_productId: {
              orderId: id,
              productId: product.productId
            }
          },
          create: {
            productId: product.productId,
            quantity: product.quantity
          },
          update: {
            quantity: product.quantity
          }
        })) ?? []
      },
    },
    include: {
      products: true
    }
  });

  return Response.json(order, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 401 });

  const id = Number(params.id);

  // Primero, eliminamos los registros relacionados en OrderProduct
  await db.orderProduct.deleteMany({
    where: { orderId: id }
  });

  // Luego, eliminamos la orden
  await db.order.delete({
    where: { id }
  });

  return Response.json({ success: true }, { status: 200 });
}
import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { CompleteOrder } from "@/prisma/zod";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const id = Number(params.id);

  const orderData = await db.order.findUnique({
    where: { id, companyId: session.user.selectedCompany.id },
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

    return NextResponse.json(order, { status: 200 });
  }

  return NextResponse.json(null, { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const id = Number(params.id);

  const body = (await request.json()) as Partial<CompleteOrder>;

  delete body.id;

  const { client, user, company, deliveredAt, status, ...updateData } = body;

  const orderProducts = body.products;

  const order = await db.order.update({
    where: { id, companyId: session.user.selectedCompany.id },
    data: {
      ...updateData,
      deliveredAt: status === "DELIVERED" ? (deliveredAt ? new Date(deliveredAt) : new Date()) : undefined,
      status,
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

  return NextResponse.json(order, { status: 200 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const id = Number(params.id);

  await db.orderProduct.deleteMany({
    where: { orderId: id, order: { companyId: session.user.selectedCompany.id } }
  });

  await db.order.delete({
    where: { id }
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
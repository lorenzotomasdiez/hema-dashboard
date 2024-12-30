import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { CompleteOrder } from "@/prisma/zod";
import { APIOrderService } from "@/services/api";
import { UpdateOrderDTO } from "@/types";
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

  try {
    const id = Number(params.id);
    const body = (await request.json()) as UpdateOrderDTO;
    const order = await APIOrderService.updateOrder({
      id,
      updateOrderDto: body,
      companyId: session.user.selectedCompany.id,
      isStockSystemEnabled: session.user.selectedCompany.useStockSystem
    });
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }

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
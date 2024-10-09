import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { Product, ProductWithCostComponents } from "@/types/product";
import { Decimal } from "decimal.js";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  try {
    const id = Number(params.id);
    const body = (await request.json()) as Partial<ProductWithCostComponents>;
    const { id: _, costComponents, ...updatedData } = body;

    const product = await db.product.update({
      where: { id, companyId: session.user.selectedCompany.id },
      data: {
        ...updatedData,
        costComponents: {
          deleteMany: {
            productId: id
          },
          create: costComponents?.map(component => ({
            name: component.name,
            cost: new Decimal(component.cost),
          })) || []
        }
      },
      include: {
        costComponents: true
      }
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  try {
    const id = Number(params.id);
    await db.orderProduct.deleteMany({
      where: {
        productId: id,
        order: {
          companyId: session.user.selectedCompany.id
        }
      }
    });

    await db.product.delete({
      where: { id, companyId: session.user.selectedCompany.id },
      include: {
        costComponents: true,
        productions: true,
        stockMovements: true
      }
    });

    return NextResponse.json({ message: "Producto eliminado correctamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }
}
import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { Product } from "@/types/product";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const id = Number(params.id);

  const body = (await request.json()) as Partial<Product>;

  const { id: _, ...updatedData } = body;


  const product = await db.product.update({
    where: { id, companyId: session.user.selectedCompany.id },
    data: {
      ...updatedData,
    }
  });


  return NextResponse.json(product, { status: 200 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

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
  });

  return NextResponse.json({ message: "Producto eliminado correctamente" }, { status: 200 });
}
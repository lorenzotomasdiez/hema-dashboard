import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { Product } from "@/types/product";
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const id = Number(params.id);

  const body = (await request.json()) as Partial<Product>;

  const {id: _, ...updatedData} = body;


  const product = await db.product.update({
    where: { id },
    data: {
      ...updatedData,
    }
  });   


  return Response.json(product, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const id = Number(params.id);

  await db.orderProduct.deleteMany({
    where: {
      productId: id
    }
  });

  await db.product.delete({
    where: { id },
  });

  return Response.json({ message: "Producto eliminado correctamente" }, { status: 200 });
}
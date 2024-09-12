import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { Order } from "../types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const id = Number(params.id);

  const order = await db.order.findUnique({
    where: { id }
  })

  return Response.json(order, { status: 200 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const id = Number(params.id);

  const body = (await request.json()) as Partial<Order>;

  delete body.id;

  const order = await db.order.update({
    where: { id },
    data: {
      ...body
    }
  });

  return Response.json(order, { status: 200 });
}
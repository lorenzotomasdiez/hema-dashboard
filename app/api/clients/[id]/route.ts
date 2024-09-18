import { getUserAuth } from "@/lib/auth/utils";
import { Client } from "@/types";
import { db } from "@/lib/db/index";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const id = params.id;

  const body = (await request.json()) as Partial<Client & {ordersTotal: number}>;

  const {id: _, ordersTotal, ...updatedData} = body;


  const client = await db.client.update({
    where: { id },
    data: {
      ...updatedData,
    }
  });   


  return Response.json(client, { status: 200 });
}
import { createClientSchema } from "@/dto/client/create-client.dto";
import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { CreateClientType } from "@/types";


export async function GET() {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const clients = await db.client.findMany();
  return new Response(JSON.stringify(clients), { status: 200 })
}

export async function POST(req: Request) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const body = (await req.json()) as CreateClientType;

  const newClientDTO = createClientSchema.safeParse(body);

  if (!newClientDTO.success) {
    return new Response(JSON.stringify(newClientDTO.error), { status: 422 });
  }

  const client = await db.client.create({
    data: body
  });

  return new Response(JSON.stringify(client), { status: 201 });
}
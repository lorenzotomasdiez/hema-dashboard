import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";


export async function GET() {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const clients = await db.client.findMany();
  return new Response(JSON.stringify(clients), { status: 200 })
}
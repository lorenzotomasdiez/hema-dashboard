import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";


export async function GET() {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });
  const names = ["Alice Lorem", "Yusbo Lorem", "Ruffo Lorem"];
  for (let i in names) {
    await db.client.create({
      data: {
        name: names[i]
      }
    })
  }
  return new Response(JSON.stringify({ sucess: true }), { status: 201 })
}
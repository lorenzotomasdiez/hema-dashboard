import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";


export async function GET() {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const clientsData = await db.client.findMany({
    select: {
      id: true,
      name: true,
      phone: true,
      address: true,
      _count: {
        select: {
          Order: true
        }
      }
    },
    orderBy: {
      Order: {
        _count: "desc"
      }
    }
  });

  const clients = clientsData.map(client => ({
    ...client,
    ordersTotal: client._count.Order,
    _count: undefined
  }));
  return new Response(JSON.stringify(clients), { status: 200 })
}
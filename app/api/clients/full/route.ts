import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { NextResponse } from "next/server";


export async function GET() {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });
  if (!session.user.selectedCompany) return new Response("No company selected", { status: 400 });

  try {
    const clientsData = await db.client.findMany({
      where: {
        companyId: session.user.selectedCompany.id
      },
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: {
        orders: {
          _count: "desc"
        }
      }
    });

    const clients = clientsData.map(client => ({
      ...client,
      ordersTotal: client._count.orders,
      _count: undefined
    }));

    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching clients" }, { status: 500 });
  }
}

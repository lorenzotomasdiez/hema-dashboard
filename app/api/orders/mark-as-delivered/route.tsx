import { getUserAuth } from "@/lib/auth/utils";
import { APIOrderService } from "@/services/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });
  try {
    const { orders } = await request.json();
    const result = await APIOrderService.markAsDelivered({
      orders,
      companyId: session.user.selectedCompany.id,
      isStockSystemEnabled: session.user.selectedCompany.useStockSystem
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
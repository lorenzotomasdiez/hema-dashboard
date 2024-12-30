import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { getUserAuth } from "@/lib/auth/utils";
import { APIOrderService } from "@/services/api";


export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const id = Number(params.id);
  const body = await request.json();
  const status = body.status as OrderStatus;

  try {
    await APIOrderService.changeStatus(id, status, session.user.selectedCompany.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error instanceof Error ? error.message : "Internal server error", { status: 500 });
  }
}
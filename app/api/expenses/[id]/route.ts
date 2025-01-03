import { getUserAuth } from "@/lib/auth/utils";
import { APIExpenseService } from "@/services/api";
import { UpdateCompanyExpenseDTO } from "@/types";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const id = Number(params.id);
  const body = await request.json() as UpdateCompanyExpenseDTO;
  try {
    await APIExpenseService.update(id, body);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error instanceof Error ? error.message : "Internal server error", { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const id = Number(params.id);
  try {
    await APIExpenseService.delete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error instanceof Error ? error.message : "Internal server error", { status: 500 });
  }
}
import { getUserAuth } from "@/lib/auth/utils";
import APICostComponentService from "@/services/api/cost-component";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const id = Number(params.id);
  try {
    await APICostComponentService.disableCostComponent(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error instanceof Error ? error.message : "Internal server error", { status: 500 });
  }
}
import { getUserAuth } from "@/lib/auth/utils";
import { APIDashboardService } from "@/services/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { session } = await getUserAuth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

    const summary = await APIDashboardService.getDashboardData(session.user.selectedCompany.id);
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(error instanceof Error ? error.message : "Internal server error", { status: 500 });
  }
}
import { getUserAuth } from "@/lib/auth/utils";
import { APICompanyService } from "@/services/api";
import { CompanyConfig } from "@/types/company";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  try {
    const body = (await req.json()) as CompanyConfig;
    const res = await APICompanyService.updateCompanyConfig(session.user.selectedCompany.id, body);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
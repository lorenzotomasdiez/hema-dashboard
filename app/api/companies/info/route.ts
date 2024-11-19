import { getUserAuth } from "@/lib/auth/utils";
import { APICompanyService } from "@/services/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { session } = await getUserAuth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const companyId = session.user.selectedCompany?.id as string;

  const companyWithUsers = await APICompanyService.getCompanyInfo(companyId);

  return NextResponse.json(companyWithUsers, { status: 200 });
}

import { getUserAuth } from "@/lib/auth/utils";
import { APICompanyService } from "@/services/api";
import { NextResponse } from "next/server";

export async function GET() {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const companies = await APICompanyService.findCompaniesByUserId(session.user.id);
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
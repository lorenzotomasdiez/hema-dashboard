import { validateCompanyAccess } from "@/guard";
import { getUserAuth } from "@/lib/auth/utils";
import { APIClientService } from "@/services/api";
import { ClientsPaginatedResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getUserAuth();
  const { isValid, companyId } = await validateCompanyAccess(session);
  if (!isValid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  const page = Number(searchParams.get('page') || 0);
  const per_page = Number(searchParams.get('per_page') || 10);
  const keyword = searchParams.get('keyword') || "";
  try {
    const result = await APIClientService.getAll(companyId as string, { page, per_page, keyword });
    const response: ClientsPaginatedResponse = {
      clients: result.clients.map(e => ({
        ...e,
        ordersTotal: e._count.orders,
        _count: undefined
      })),
      total: result.total,
      page,
      per_page
    }
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
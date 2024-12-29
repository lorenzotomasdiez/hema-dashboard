import { getUserAuth } from "@/lib/auth/utils";
import { APIStockService } from "@/services/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, {params}: {params: {id: string}}) {
  const {session} = await getUserAuth();
  if(!session) return NextResponse.json({error: "Unauthorized"}, {status: 401});
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });
  try {
    const id = parseInt(params.id);
    const {stock, description} = await request.json();
    const adjustStock = await APIStockService.adjustStockProduct(id, session.user.selectedCompany.id, stock, description, session.user.id); 
    return NextResponse.json(adjustStock, {status: 200});
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
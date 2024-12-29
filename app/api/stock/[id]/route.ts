import { getUserAuth } from "@/lib/auth/utils";
import { APIStockService } from "@/services/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const {session} = await getUserAuth();
  if(!session) return NextResponse.json({error: "Unauthorized"}, {status: 401});
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  try {
    const id = parseInt(params.id);
    const product = await APIStockService.findProductAndStock(id, session.user.selectedCompany.id);

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
} 
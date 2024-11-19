import { getUserAuth } from "@/lib/auth/utils";
import APIProductService from "@/services/api/product";
import { ProductComplete } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const slug = params.slug;

  const product = await APIProductService.findCompleteBySlug(slug, session.user.selectedCompany.id);

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  
  const productCompleteDTO:ProductComplete = {
    ...product,
    costComponents: product?.costComponents?.map(cost => ({
      name: cost.costComponent.name,
      id: cost.costComponent.id,
      cost: Number(cost.costComponent.cost)
    })) || []
  }
  return NextResponse.json(productCompleteDTO, { status: 200 });
}

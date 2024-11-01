import { getUserAuth } from "@/lib/auth/utils";
import ProductService from "@/services/api/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const slug = params.slug;

  const product = await ProductService.findBySlug(slug, session.user.selectedCompany.id);

  const productWithCostComponentDTO = {
    ...product,
    costComponents: product?.costComponents?.map(cost => ({
      name: cost.costComponent.name,
      id: cost.costComponent.id,
      cost: cost.costComponent.cost
    }))
  }

  return NextResponse.json(productWithCostComponentDTO, { status: 200 });
}

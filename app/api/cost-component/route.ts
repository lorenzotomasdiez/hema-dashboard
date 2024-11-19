import { createCostComponentSchema } from "@/dto/cost-component/create-cost-component";
import { getUserAuth } from "@/lib/auth/utils";
import APICostComponentService from "@/services/api/cost-component";
import { CreateCostComponentType } from "@/types/cost-component";
import { NextResponse } from "next/server";

export async function GET() {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });
  try {
    const costComponents = await APICostComponentService.findAllByCompanyId(session.user.selectedCompany.id);
    return NextResponse.json(costComponents);
  } catch (error) {
    return NextResponse.json(error instanceof Error ? error.message : "Internal server error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const body = (await req.json()) as CreateCostComponentType;
  const safeCostComponent = createCostComponentSchema.parse(body);
  try {
    const costComponent = await APICostComponentService.create(safeCostComponent);
    return NextResponse.json(costComponent);
  } catch (error) {
    return NextResponse.json(error instanceof Error ? error.message : "Internal server error", { status: 500 });
  }
}

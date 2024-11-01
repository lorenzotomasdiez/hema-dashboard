import { getUserAuth } from "@/lib/auth/utils";
import { NextRequest, NextResponse } from "next/server";
import { createProductSchema } from "@/dto/product/create-product.dto";
import { CreateProductType } from "@/types";
import { formatZodError } from "@/lib/utils";
import ProductService from "@/services/api/product";

export async function GET(request: NextRequest) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const products = await ProductService.findAllByCompanyId(session.user.selectedCompany.id);

  return NextResponse.json(products, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });
  const body = (await request.json()) as CreateProductType;
  try {
    const newProductDTO = createProductSchema.safeParse(body);

    if (!newProductDTO.success) {
      return NextResponse.json(formatZodError(newProductDTO.error), { status: 422 });
    }

    const product = await ProductService.create(newProductDTO.data, session.user.selectedCompany.id);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }
}

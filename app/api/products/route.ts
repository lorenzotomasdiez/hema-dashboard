import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { NextRequest, NextResponse } from "next/server";
import { createProductSchema } from "@/dto/product/create-product.dto";
import { CreateProductType } from "@/types";
import { generateSlug } from "@/lib/api/routes";
import Decimal from "decimal.js";
import { formatZodError } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const products = await db.product.findMany({
    where: {
      companyId: session.user.selectedCompany.id
    },
    orderBy: [
      {
        slug: "desc"
      }
    ]
  });

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

    const { name, description, price, slug, stock, costComponents } = newProductDTO.data;

    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        slug: slug || generateSlug(name),
        stock,
        companyId: session.user.selectedCompany.id,
        costComponents: {
          create: costComponents.map(component => ({
            name: component.name,
            cost: new Decimal(component.cost),
          }))
        }
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }
}

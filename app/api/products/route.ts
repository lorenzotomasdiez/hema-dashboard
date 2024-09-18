import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { NextRequest } from "next/server";
import { createProductSchema } from "@/dto/product/create-product.dto";
import { CreateProductType } from "@/types";
import { generateSlug } from "@/lib/api/routes";

export async function GET(request: NextRequest) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const searchParams = request.nextUrl.searchParams

  const page = Number(searchParams.get('page') || 0);
  const per_page = Number(searchParams.get('per_page') || 10);

  const products = await db.product.findMany({
    skip: page * per_page,
    take: per_page,
    orderBy: [
      {
        slug: "desc"
      }
    ]
  });

  return new Response(JSON.stringify(products));
}

export async function POST(request: Request) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const body = (await request.json()) as CreateProductType;

  const newProductDTO = createProductSchema.safeParse(body);

  if (!newProductDTO.success) {
    return new Response(JSON.stringify(newProductDTO.error), { status: 422 });
  }

  const { name, description, price, slug, stock } = newProductDTO.data;

  const product = await db.product.create({
    data: {
      name,
      description,
      price,
      slug: slug || generateSlug(name),
      stock
    }
  });

  return new Response(JSON.stringify(product), { status: 201 });
}

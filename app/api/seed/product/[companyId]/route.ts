import { generateSlug } from "@/lib/api/routes";
import { db } from "@/lib/db/index";
import { faker } from "@faker-js/faker";
import { Product } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { companyId: string } }) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Error not allowed", { status: 403 });
  }
  if (!params.companyId) {
    return new NextResponse("Company id is required", { status: 400 });
  }
  const companyId = params.companyId;
  try {
    const numberOfProducts = 15;
    const products: Product[] = [];
    for (let i = 0; i < numberOfProducts; i++) {
      products.push({
        id: i,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 0, max: 100 }),
        stock: faker.number.int({ min: 0, max: 100 }),
        slug: faker.string.uuid(),
        companyId: companyId,
        deletedAt: null,
      });
    }
    await db.product.createMany({
      data: products.map(({ id, ...product }) => ({
        ...product,
        slug: generateSlug(product.name),
      })),
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating products:", error);
    return NextResponse.json({ error: "Error creating products" }, { status: 500 });
  }
}
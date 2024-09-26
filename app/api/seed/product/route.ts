import { generateSlug } from "@/lib/api/routes";
import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { faker } from "@faker-js/faker";
import { Product } from "@prisma/client";


export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Error not allowed", { status: 403 });
  }
  try{
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
      });
    }
    await db.product.createMany({
      data: products.map(({id, ...product}) => ({
        ...product,
        slug: generateSlug(product.name),
      })),
    });
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  }catch(error){
    console.error("Error creating products:", error);
    return new Response("Error creating products", { status: 500 });
  }
}
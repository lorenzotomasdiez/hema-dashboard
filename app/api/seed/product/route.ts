import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";


export async function GET() {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });
  const products = [
    {
      name: "Bolsa de Hielo 3KG",
    price: 300,
    stock: 10,
    slug: "bolsa-de-hielo-3kg",
    },
    {
      name: "Bolsa de Hielo 5KG",
      price: 450,
      stock: 10,
      slug: "bolsa-de-hielo-5kg",
    },
    {
      name: "Bolsa de Hielo 10KG",
      price: 900,
      stock: 10,
      slug: "bolsa-de-hielo-10kg",
    },
  ];
  for (let i in products) {
    await db.product.create({
      data: {
        name: products[i].name,
        price: products[i].price,
        stock: products[i].stock,
        slug: products[i].slug,
      }
    })
  }
  return new Response(JSON.stringify({ sucess: true }), { status: 201 })
}
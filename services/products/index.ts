import { API_ROUTES } from "@/lib/api/routes";
import { CreateProductType, Product } from "@/types";

export async function getProducts() {
  const res = await fetch(API_ROUTES.products.root);
  const data = await res.json();
  return data;
}

export async function createProduct(product: CreateProductType) {
  const res = await fetch(API_ROUTES.products.root, {
    method: "POST",
    body: JSON.stringify(product),
  });
  const data = await res.json();
  return data;
}

export async function updateProduct(id: number, product: Partial<Product>) {
  const res = await fetch(`${API_ROUTES.products.root}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(product),
  });
  const data = await res.json();
  return data;
}
import { API_ROUTES } from "@/lib/api/routes";
import { CreateProductType, Product } from "@/types";
import { responseHandler } from "../request";

export async function getProducts() {
  const res = await fetch(API_ROUTES.products.root);
  return await responseHandler(res);
}

export async function createProduct(product: CreateProductType) {
  const res = await fetch(API_ROUTES.products.root, {
    method: "POST",
    body: JSON.stringify(product),
  });
  return await responseHandler(res);
}

export async function updateProduct(id: number, product: Partial<Product>) {
  const res = await fetch(API_ROUTES.products.id(id), {
    method: "PATCH",
    body: JSON.stringify(product),
  });
  return await responseHandler(res);
}

export async function deleteProduct(id: number) {
  const res = await fetch(API_ROUTES.products.id(id), {
    method: "DELETE",
  });
  return await responseHandler(res);
}

export async function getProductBySlug(slug: string) {
  const res = await fetch(API_ROUTES.products.slug(slug));
  return await responseHandler(res);
}

export async function getProductCompleteBySlug(slug: string) {
  const res = await fetch(API_ROUTES.products.slug(slug) + "/complete");
  return await responseHandler(res);
}

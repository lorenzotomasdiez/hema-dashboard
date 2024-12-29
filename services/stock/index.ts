import { API_ROUTES } from "@/lib/api/routes";
import { responseHandler } from "../request";

export async function getStockProduct(productId:number){
  const res = await fetch(API_ROUTES.stock.product(productId));
  return await responseHandler(res);
}

export async function adjustStockProduct(productId:number, stock:number, description:string){
  const res = await fetch(API_ROUTES.stock.adjust(productId), {
    method: "POST",
    body: JSON.stringify({stock, description})
  });
  return await responseHandler(res);
}
import { CreateOrderType, GetOrdersParams, Order } from "@/app/api/orders/types";
import { API_ROUTES } from "@/lib/api/routes";

export const getOrders = async (params?: GetOrdersParams) => {
  const { page, per_page, status } = {
    page: params?.page || 0,
    per_page: params?.per_page || 10,
    status: params?.status || "ALL"
  };
  const res = await fetch(API_ROUTES.orders.root + `?page=${page}` + `&per_page=${per_page}` + `&status=${status}`);
  const data = await res.json();
  return data;
}


export const createOrder = async (dto: CreateOrderType) => {
  const res = await fetch(API_ROUTES.orders.root, {
    "method": "POST",
    body: JSON.stringify(dto)
  })
  const data = await res.json();
  return { success: res.ok, ...data };
}

export const updateOrder = async (id: number, body: Partial<Order>) => {
  const res = await fetch(API_ROUTES.orders.id(id), {
    "method": "PATCH",
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return { success: res.ok, ...data };
}

export const getOrderById = async (id: number) => {
  const res = await fetch(API_ROUTES.orders.id(id));
  const data = await res.json();
  return { success: res.ok, ...data };
}
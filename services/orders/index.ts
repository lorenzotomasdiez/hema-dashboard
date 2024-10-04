import { CreateOrderType, GetOrdersParams, Order } from "@/types";
import { API_ROUTES } from "@/lib/api/routes";
import { responseHandler } from "../request";
export const getOrders = async (params?: GetOrdersParams) => {
  const { page, per_page, status, forToday, keyword } = {
    page: params?.page || 0,
    per_page: params?.per_page || 10,
    status: params?.status || "ALL",
    forToday: params?.forToday || false,
    keyword: params?.keyword || ""
  };
  const res = await fetch(
    API_ROUTES.orders.root + `?page=${page}` + `&per_page=${per_page}` + `&status=${status}` + `&forToday=${forToday.toString()}` + `&keyword=${keyword}`
  );
  return await responseHandler(res);
}


export const createOrder = async (dto: CreateOrderType) => {
  const res = await fetch(API_ROUTES.orders.root, {
    "method": "POST",
    body: JSON.stringify(dto)
  })
  return await responseHandler(res);
}

export const updateOrder = async (id: number, body: Partial<Order>) => {
  const res = await fetch(API_ROUTES.orders.id(id), {
    "method": "PATCH",
    body: JSON.stringify(body)
  });
  return await responseHandler(res);
}

export const getOrderById = async (id: number) => {
  const res = await fetch(API_ROUTES.orders.id(id));
  return await responseHandler(res);
}

export const deleteOrder = async (id: number) => {
  const res = await fetch(API_ROUTES.orders.id(id), {
    method: "DELETE",
  });
  return await responseHandler(res);
}
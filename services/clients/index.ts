import { API_ROUTES } from "@/lib/api/routes";
import { Client, CreateClientType } from "@/types";
import { responseHandler } from "../request";

export const getClients = async () => {
  const res = await fetch(API_ROUTES.clients.root);
  return await responseHandler(res);
}

export const getClientsFull = async () => {
  const res = await fetch(API_ROUTES.clients.full);
  return await responseHandler(res);
}

export const createClient = async (clientData: CreateClientType) => {
  const res = await fetch(API_ROUTES.clients.root, {
    method: "POST",
    body: JSON.stringify(clientData)
  });
  return await responseHandler(res);
}

export const updateClient = async (id: string, clientData: Partial<Client>) => {
  const res = await fetch(API_ROUTES.clients.root + "/" + id, {
    method: "PATCH",
    body: JSON.stringify(clientData)
  });
  return await responseHandler(res);
}
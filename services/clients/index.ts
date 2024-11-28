import { API_ROUTES } from "@/lib/api/routes";
import { Client, CreateClientType, GetClientsParams } from "@/types";
import { responseHandler } from "../request";

export const getClients = async () => {
  const res = await fetch(API_ROUTES.clients.root);
  return await responseHandler(res);
}

export const getClientsFull = async () => {
  const res = await fetch(API_ROUTES.clients.full);
  return await responseHandler(res);
}

export const getClientsPaginated = async (params: GetClientsParams) => {
  const res = await fetch(API_ROUTES.clients.paginated(params));
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

export const deleteClient = async (id:string) => {
  const res = await fetch(API_ROUTES.clients.delete(id), {
    method: "DELETE"
  });
  return await responseHandler(res);
}
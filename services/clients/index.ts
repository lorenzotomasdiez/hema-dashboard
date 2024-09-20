import { API_ROUTES } from "@/lib/api/routes";
import { Client, CreateClientType } from "@/types";

export const getClients = async () => {
  const res = await fetch(API_ROUTES.clients.root);
  const data = await res.json();
  return data;
}

export const getClientsFull = async () => {
  const res = await fetch(API_ROUTES.clients.full);
  const data = await res.json();
  return data;
}

export const createClient = async (clientData: CreateClientType) => {
  const res = await fetch(API_ROUTES.clients.root, {
    method: "POST",
    body: JSON.stringify(clientData)
  });
  const data = await res.json();
  return data;
}

export const updateClient = async (id: string, clientData: Partial<Client>) => {
  const res = await fetch(API_ROUTES.clients.root + "/" + id, {
    method: "PATCH",
    body: JSON.stringify(clientData)
  });
  const data = await res.json();
  return data;
}

export const deleteClient = async (id: string) => {
  const res = await fetch(API_ROUTES.clients.id(id), {
    method: "DELETE"
  });
  const data = await res.json();
  return data;
}
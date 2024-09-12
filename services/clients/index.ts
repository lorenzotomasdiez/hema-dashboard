import { API_ROUTES } from "@/lib/api/routes";

export const getClients = async () => {
  const res = await fetch(API_ROUTES.clients.root);
  const data = await res.json();
  return data;
}
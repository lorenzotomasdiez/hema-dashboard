import { createClientSchema } from "@/dto/client/create-client.dto";
import { clientSchema } from "@/prisma/zod";
import { z } from "zod";

export type Client = z.infer<typeof clientSchema>;

export type CreateClientType = z.infer<typeof createClientSchema>;

export type ClientWithOrdersTotal = Client & { ordersTotal: number };

export type GetClientsParams = {
  page: number;
  per_page: number;
  keyword: string;
}

export type ClientsPaginatedResponse = {
  clients: ClientWithOrdersTotal[];
  total: number;
  page: number;
  per_page: number;
}
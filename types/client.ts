import { createClientSchema } from "@/dto/client/create-client.dto";
import { clientSchema } from "@/prisma/zod";
import { z } from "zod";

export type Client = z.infer<typeof clientSchema>;
export type CreateClientType = z.infer<typeof createClientSchema>;

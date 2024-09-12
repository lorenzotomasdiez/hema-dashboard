import { clientSchema } from "@/prisma/zod";
import { z } from "zod";

export type Client = z.infer<typeof clientSchema>;
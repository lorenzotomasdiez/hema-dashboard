import { costComponentSchema } from "@/prisma/zod";
import { z } from "zod";

const createProductCostComponentSchema = costComponentSchema.omit({ createdAt: true, updatedAt: true });

export const clientPriceSchema = z.object({
  clientId: z.string(),
  price: z.number().nonnegative("Price must be positive"),
});


export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullish(),
  slug: z.string().min(1, "Slug is required").optional(),
  price: z.number().nonnegative("Price must be positive"),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
  costComponents: z.array(createProductCostComponentSchema).optional(),
  clientPrices: z.array(clientPriceSchema).optional(),
});

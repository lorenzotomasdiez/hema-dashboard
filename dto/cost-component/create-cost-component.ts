import { z } from "zod";

export const createCostComponentSchema = z.object({
  name: z.string().min(1),
  cost: z.number().positive(),
  companyId: z.string().cuid()
});


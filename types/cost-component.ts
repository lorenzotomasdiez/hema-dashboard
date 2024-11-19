import { z } from "zod";
import { createCostComponentSchema } from "@/dto/cost-component/create-cost-component";

export type CreateCostComponentType = z.infer<typeof createCostComponentSchema>;
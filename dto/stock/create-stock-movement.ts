import { z } from "zod";

export const createAdjustStockMovementSchema = z.object({
  description: z.string(),
  stock: z.number(),
  confirmationText: z.enum(["AJUSTAR"]),
})

export type CreateAdjustStockMovement = z.infer<typeof createAdjustStockMovementSchema>;
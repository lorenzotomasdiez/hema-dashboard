import { z } from "zod";

export const createAdjustStockMovementSchema = z.object({
  description: z.string(),
  stock: z.number(),
  confirmationText: z.enum(["AJUSTAR"]),
})

export type CreateAdjustStockMovement = z.infer<typeof createAdjustStockMovementSchema>;

export const createAddStockMovementSchema = z.object({
  description: z.string(),
  stock: z.number().positive(),
  confirmationText: z.enum(["INGRESAR"]),
})

export type CreateAddStockMovement = z.infer<typeof createAddStockMovementSchema>;

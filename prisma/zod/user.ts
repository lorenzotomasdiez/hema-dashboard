import * as z from "zod"
import { CompleteAccount, relatedAccountSchema, CompleteSession, relatedSessionSchema, CompleteOrder, relatedOrderSchema, CompleteUserCompany, relatedUserCompanySchema, CompleteStockMovement, relatedStockMovementSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
  deletedAt: z.date().nullish(),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
  orders: CompleteOrder[]
  userCompanies: CompleteUserCompany[]
  stockMovements: CompleteStockMovement[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  accounts: relatedAccountSchema.array(),
  sessions: relatedSessionSchema.array(),
  orders: relatedOrderSchema.array(),
  userCompanies: relatedUserCompanySchema.array(),
  stockMovements: relatedStockMovementSchema.array(),
}))

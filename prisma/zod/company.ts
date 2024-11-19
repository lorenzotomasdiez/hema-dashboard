import * as z from "zod"
import { CompleteOrder, relatedOrderSchema, CompleteClient, relatedClientSchema, CompleteUserCompany, relatedUserCompanySchema, CompleteProduct, relatedProductSchema, CompleteCompanyExpense, relatedCompanyExpenseSchema, CompleteProduction, relatedProductionSchema, CompleteStockMovement, relatedStockMovementSchema, CompleteCostComponent, relatedCostComponentSchema, CompleteInvitation, relatedInvitationSchema } from "./index"

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullish(),
  useStockSystem: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
})

export interface CompleteCompany extends z.infer<typeof companySchema> {
  orders: CompleteOrder[]
  clients: CompleteClient[]
  userCompanies: CompleteUserCompany[]
  products: CompleteProduct[]
  CompanyExpense: CompleteCompanyExpense[]
  productions: CompleteProduction[]
  stockMovements: CompleteStockMovement[]
  costComponents: CompleteCostComponent[]
  invitations: CompleteInvitation[]
}

/**
 * relatedCompanySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCompanySchema: z.ZodSchema<CompleteCompany> = z.lazy(() => companySchema.extend({
  orders: relatedOrderSchema.array(),
  clients: relatedClientSchema.array(),
  userCompanies: relatedUserCompanySchema.array(),
  products: relatedProductSchema.array(),
  CompanyExpense: relatedCompanyExpenseSchema.array(),
  productions: relatedProductionSchema.array(),
  stockMovements: relatedStockMovementSchema.array(),
  costComponents: relatedCostComponentSchema.array(),
  invitations: relatedInvitationSchema.array(),
}))

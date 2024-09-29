import * as z from "zod"
import { UserRole } from "@prisma/client"
import { CompleteUser, relatedUserSchema, CompleteCompany, relatedCompanySchema } from "./index"

export const userCompanySchema = z.object({
  id: z.number().int(),
  userId: z.string(),
  companyId: z.string(),
  role: z.nativeEnum(UserRole),
  isEnabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteUserCompany extends z.infer<typeof userCompanySchema> {
  user: CompleteUser
  company: CompleteCompany
}

/**
 * relatedUserCompanySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserCompanySchema: z.ZodSchema<CompleteUserCompany> = z.lazy(() => userCompanySchema.extend({
  user: relatedUserSchema,
  company: relatedCompanySchema,
}))

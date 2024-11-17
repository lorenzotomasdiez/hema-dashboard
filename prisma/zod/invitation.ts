import * as z from "zod"
import { UserRole, InviteStatus } from "@prisma/client"
import { CompleteCompany, relatedCompanySchema } from "./index"

export const invitationSchema = z.object({
  id: z.string(),
  email: z.string(),
  companyId: z.string(),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(InviteStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteInvitation extends z.infer<typeof invitationSchema> {
  company: CompleteCompany
}

/**
 * relatedInvitationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedInvitationSchema: z.ZodSchema<CompleteInvitation> = z.lazy(() => invitationSchema.extend({
  company: relatedCompanySchema,
}))

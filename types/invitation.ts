import { Company, Invitation, UserRole } from "@prisma/client";

export type CreateInvitationDTO = {
  email: string;
  companyId: string;
  role: UserRole;
}

export type InvitationWithCompanies = Invitation & {
  company: Company;
}
  
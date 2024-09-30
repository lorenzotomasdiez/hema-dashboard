import { Company, User, UserCompany } from "@prisma/client";
import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(1),
})

export type CreateCompanyDTO = z.infer<typeof createCompanySchema>;

export type CompanyWithUserCompanies = Company & { userCompanies: UserCompany[] };


export interface CompanyInfo {
  id: string;
  name: string;
  image: null;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  userCompanies: UserCompanyWithUser[];
}

export interface UserCompanyWithUser {
  id: number;
  userId: string;
  companyId: string;
  role: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
}
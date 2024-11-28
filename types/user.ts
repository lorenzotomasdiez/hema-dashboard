import { UserCompany } from "@prisma/client";

import { User } from "@prisma/client";

export type UserWithCompanies = User & {
  userCompanies: UserCompany[];
}

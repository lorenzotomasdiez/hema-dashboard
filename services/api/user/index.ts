import UserRepository from "@/repositories/user.repository";
import { UserWithCompanies } from "@/types";
import { UserRole } from "@prisma/client";

export default class APIUserService {
  static async addUserToCompany(userId: string, companyId: string, role?: UserRole) {
    const user = await UserRepository.addUserToCompany(userId, companyId, role);
    return user;
  }

  static async getUser(userId: string): Promise<UserWithCompanies> {
    const user = await UserRepository.getUser(userId) as UserWithCompanies;
    return user;
  }
}

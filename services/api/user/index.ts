import UserRepository from "@/repositories/user.repository";
import { UserRole } from "@prisma/client";

export default class APIUserService {
  static async addUserToCompany(userId: string, companyId: string, role?: UserRole) {
    const user = await UserRepository.addUserToCompany(userId, companyId, role);
    return user;
  }
}

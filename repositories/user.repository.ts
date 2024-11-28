import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export default class UserRepository {
  static async addUserToCompany(userId: string, companyId: string, role?: UserRole) {
    return await db.userCompany.create({
      data: {
        userId,
        companyId,
        role: role || UserRole.COMPANY_WORKER,
        isEnabled: true,
      },
    });
  }

  static async getUser(userId: string) {
    return await db.user.findUnique({
      where: { id: userId },
      include: {
        userCompanies: true
      }
    });
  }
}

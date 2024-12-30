import { db } from "@/lib/db";
import { CompanyConfig } from "@/types/company";

export default class CompanyRepository {
  static async updateCompanyConfig(companyId: string, config: CompanyConfig) {
    return db.company.update({
      where: { id: companyId },
      data: config,
    });
  }

  static async getCompanyInfo(companyId: string) {
    return db.company.findUnique({
      where: { id: companyId },
    });
  }
}
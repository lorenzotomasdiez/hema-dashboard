import { db } from "@/lib/db";
import { CompanyRepository } from "@/repositories";
import { CompanyConfig } from "@/types/company";
import { UserRole } from "@prisma/client";

export default class APICompanyService {
  static async findCompanyByNameAndEmail(name: string, email: string) {
    const company = await db.company.findFirst({
      where: {
        name,
        userCompanies: {
          some: {
            user: {
              email: {
                equals: email,
              },
            },
          },
        },
      },
    })

    return company
  }

  static async findCompanyById(id: string) {
    const company = await db.company.findUnique({
      where: {
        id,
      },
    })
    return company
  }

  static async findCompaniesByUserId(userId: string) {
    const companies = await db.company.findMany({
      where: {
        userCompanies: {
          some: {
            user: {
              id: userId
            },
          },
        },
      },
      include: {
        userCompanies: true
      }
    })
    return companies
  }

  static async createCompany(name: string, userId: string) {
    const company = await db.company.create({
      data: {
        name,
        userCompanies: {
          create: {
            user: {
              connect: {
                id: userId
              }
            },
            role: UserRole.COMPANY_OWNER
          }
        }
      }
    })
    return company
  }

  static async getCompanyInfo(companyId: string) {
    const company = await db.company.findUnique({
      where: {
        id: companyId,
      },
      include: {
        userCompanies: {
          include: {
            user: true
          }
        }
      }
    })

    return company
  }

  static async updateCompanyConfig(companyId: string, config: CompanyConfig) {
    await CompanyRepository.updateCompanyConfig(companyId, config);
    return {
      message: "Company config updated successfully",
    };
  }
}
import { db } from "@/lib/db";
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

  static async findMyCompanies(userId: string) {
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
    })
    return companies
  }
  


  static async ownerCreateCompany(name: string, userId: string) {
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
}
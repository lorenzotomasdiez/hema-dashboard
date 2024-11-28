import { AuthSession } from "@/lib/auth/utils";
import { APIUserService } from "@/services/api";
import { UserRole } from "@prisma/client";

export async function validateCompanyAccess(session: AuthSession | null): Promise<{
  isValid: boolean;
  companyId?: string;
  userId?: string;
  isAdmin?: boolean;
  error?: string;
}> {
  if (!session) {
    return { isValid: false, error: "Unauthorized" };
  }
  
  if (!session.session?.user.selectedCompany) {
    return { isValid: false, error: "No company selected" };
  }

  const userId = session.session.user.id;
  const companyId = session.session.user.selectedCompany.id;

  try {
    const user = await APIUserService.getUser(userId);
    const userCompany = user.userCompanies.find(
      (userCompany) => userCompany.companyId === companyId
    );

    if (!userCompany) {
      return { isValid: false, error: "User does not belong to selected company" };
    }

    return { 
      isValid: true, 
      companyId: companyId as string,
      userId,
      isAdmin: userCompany.role === UserRole.ADMIN || userCompany.role === UserRole.COMPANY_OWNER || userCompany.role === UserRole.COMPANY_ADMIN
    };
  } catch (error) {
    console.error('Error validating company access:', error);
    return { isValid: false, error: "Error validating access" };
  }
}
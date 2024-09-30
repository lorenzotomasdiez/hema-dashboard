import { APP_PATH } from "@/config/path";
import { getUserAuth } from "@/lib/auth/utils";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const withRoleAccess = async (
  rolesAllowed: UserRole[] = [
    UserRole.ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.COMPANY_OWNER
  ]
) => {

  const { session } = await getUserAuth();
  if (!session) {
    redirect(APP_PATH.public.signin);
  }

  if (!rolesAllowed.includes(session.user.selectedCompany?.role as UserRole)) {
    redirect(APP_PATH.protected.notAllowed);
  }

  return session;
}
import { DashboardMain } from "@/components/sections";
import DeliveryDashboard from "@/components/sections/dashboard/delivery-dashboard";
import { authOptions } from "@/lib/auth/utils";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.selectedCompany?.role as UserRole;
  
  if([UserRole.ADMIN, UserRole.COMPANY_OWNER, UserRole.COMPANY_ADMIN].includes(userRole as "ADMIN")) {
    return <DashboardMain />
  }
  return (
    <DeliveryDashboard />
  )
}

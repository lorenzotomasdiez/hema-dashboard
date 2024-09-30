import { DashboardMain } from "@/components/sections";
import { withRoleAccess } from "@/guard";

export default async function DashboardPage() {
  await withRoleAccess();
  return (
    <DashboardMain />
  )
}

import { DashboardMain } from "@/components/sections";
import { getUserAuth } from "@/lib/auth/utils";

export default async function DashboardPage() {
  const { session } = await getUserAuth();
  return (
    // <DashboardMain />
    <div>
      {
        session && JSON.stringify(session)
      }
    </div>
  )
}
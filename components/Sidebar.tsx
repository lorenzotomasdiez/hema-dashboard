import Link from "next/link";

import SidebarItems from "./SidebarItems";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AuthSession, getUserAuth, SelectedCompany } from "@/lib/auth/utils";
import { APP_PATH } from "@/config/path";
import { SignOut } from "./signout";
import { ChooseCompanySelection } from "./choose-company-selection";

const Sidebar = async () => {
  const session = await getUserAuth();
  if (session.session === null) return null;

  const selectedCompany = session.session.user.selectedCompany as SelectedCompany;

  return (
    <aside className="h-screen bg-muted hidden md:block p-4 pt-8 border-r border-border shadow-inner">
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-4">
          <Link href={APP_PATH.protected.dashboard.root}>
            <div className="flex justify-start items-center gap-2">
              <div className="flex items-center justify-center">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedCompany?.image ?? ""} />
                  <AvatarFallback className="border-border border-2 text-muted-foreground">
                    {selectedCompany?.name?.split(" ").map((name) => name.charAt(0)).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <p className="text-center text-lg font-bold">{selectedCompany.name}</p>
            </div>
          </Link>
          <div className="h-px w-full bg-border" />
          <SidebarItems />
        </div>
        <div className="flex flex-col gap-2">
          <UserDetails session={session} />
          <ChooseCompanySelection />
          <SignOut />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

const UserDetails = ({ session }: { session: AuthSession }) => {
  if (session.session === null) return null;
  const { user } = session.session;

  if (!user?.name || user.name.length == 0) return null;

  return (
    <Link href="/account">
      <div className="flex items-center justify-between w-full border-t border-border pt-4 px-2">
        <div className="text-muted-foreground">
          <p className="text-xs">{user.name ?? "John Doe"}</p>
          <p className="text-xs font-light pr-4">
            {user.email ?? "john@doe.com"}
          </p>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.image ?? ""} />
          <AvatarFallback className="border-border border-2 text-muted-foreground">
            {user.name?.split(" ").map((name) => name.charAt(0)).join("")}
          </AvatarFallback>
        </Avatar>
      </div>
    </Link>
  );
};

"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AuthSession } from "@/lib/auth/utils";
import AppSidebarHeader from "./sidebar-header";
import AppSidebarFooter from "./sidebar-footer";
import AppSidebarItem from "./sidebar-item";

import { UserRole } from "@prisma/client";
import { APP_PATH } from "@/config/path";
import { Building, Cog, DollarSign, Inbox, LayoutList, LucideIcon, Package, Truck, UserSearch } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export const defaultLinks: SidebarLink[] = [
  {
    href: APP_PATH.protected.dashboard.root,
    title: "Dashboard",
    icon: LayoutList,
    roles: [
      UserRole.ADMIN,
      UserRole.COMPANY_OWNER,
      UserRole.COMPANY_ADMIN,
      UserRole.COMPANY_WORKER,
    ]
  },
  {
    href: APP_PATH.protected.orders.root,
    title: "Pedidos",
    icon: Inbox,
    roles: [
      UserRole.ADMIN,
      UserRole.COMPANY_OWNER,
      UserRole.COMPANY_ADMIN,
    ]
  },
  {
    href: APP_PATH.protected.clients,
    title: "Clientes",
    icon: UserSearch,
    roles: [
      UserRole.ADMIN,
      UserRole.COMPANY_OWNER,
      UserRole.COMPANY_ADMIN,
    ]
  },
  {
    href: APP_PATH.protected.products.root,
    title: "Productos",
    icon: Package,
    roles: [
      UserRole.ADMIN,
      UserRole.COMPANY_OWNER,
      UserRole.COMPANY_ADMIN,
    ]
  },
  {
    href: APP_PATH.protected.costs.root,
    title: "Costos",
    icon: DollarSign,
    roles: [
      UserRole.ADMIN,
      UserRole.COMPANY_OWNER,
      UserRole.COMPANY_ADMIN,
    ]
  },
  {
    href: APP_PATH.protected.organization,
    title: "Organizacion",
    icon: Building,
    roles: [
      UserRole.ADMIN,
      UserRole.COMPANY_OWNER,
      UserRole.COMPANY_ADMIN,
    ]
  },
  {
    href: APP_PATH.protected.delivery,
    title: "Repartidor",
    icon: Truck,
    roles: [
      UserRole.ADMIN,
      UserRole.COMPANY_OWNER,
      UserRole.COMPANY_ADMIN,
      UserRole.COMPANY_WORKER,
    ]
  },
  {
    href: APP_PATH.protected.settings,
    title: "Configuracion",
    icon: Cog,
    roles: [
      UserRole.ADMIN,
      UserRole.COMPANY_OWNER,
      UserRole.COMPANY_ADMIN,
      UserRole.COMPANY_WORKER,
    ]
  },
];

export const additionalLinks: AdditionalLinks[] = [];


const AppSidebar = async () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userRole = session?.user?.selectedCompany?.role as UserRole;
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {defaultLinks.map((link) => (
                (userRole && link.roles.includes(userRole)) && (
                  <AppSidebarItem key={link.title} link={link} isActive={pathname.startsWith(link.href)} />
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AppSidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;

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

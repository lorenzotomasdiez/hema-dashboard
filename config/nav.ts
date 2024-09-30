import { Cog, User, LayoutList, UserSearch, Package, Inbox, Building } from "lucide-react";
import { SidebarLink } from "@/components/SidebarItems";
import { prefetchClientsData, prefetchClientsFullData, prefetchDashboardSummaryData, prefetchOrdersData, prefetchProductsData } from "@/lib/tanstack";
import { UserRole } from "@prisma/client";
import { APP_PATH } from "./path";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  {
    href: APP_PATH.protected.dashboard.root,
    title: "Dashboard",
    icon: LayoutList,
    prefetchData: [prefetchDashboardSummaryData],
    roles: [
      UserRole.ADMIN,
      UserRole.COMPANY_OWNER,
      UserRole.COMPANY_ADMIN,
    ]
  },
  {
    href: APP_PATH.protected.orders,
    title: "Pedidos",
    icon: Inbox,
    prefetchData: [prefetchOrdersData, prefetchClientsData],
    roles: [
      UserRole.ADMIN,
      UserRole.COMPANY_OWNER,
      UserRole.COMPANY_ADMIN,
      UserRole.COMPANY_WORKER,
    ]
  },
  {
    href: APP_PATH.protected.clients,
    title: "Clientes",
    icon: UserSearch,
    prefetchData: [prefetchClientsFullData],
    roles: [
      UserRole.ADMIN,
      UserRole.COMPANY_OWNER,
      UserRole.COMPANY_ADMIN,
    ]
  },
  {
    href: APP_PATH.protected.products,
    title: "Productos",
    icon: Package,
    prefetchData: [prefetchProductsData],
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

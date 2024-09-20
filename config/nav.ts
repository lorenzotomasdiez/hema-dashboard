import { Cog, User, LayoutList, UserSearch, Package, Inbox } from "lucide-react";
import { SidebarLink } from "@/components/SidebarItems";
import { prefetchClientsData, prefetchClientsFullData, prefetchDashboardSummaryData, prefetchOrdersData, prefetchProductsData } from "@/lib/tanstack";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Dashboard", icon: LayoutList, prefetchData: [prefetchDashboardSummaryData] },
  { href: "/orders", title: "Pedidos", icon: Inbox, prefetchData: [prefetchOrdersData, prefetchClientsData] },
  { href: "/clients", title: "Clientes", icon: UserSearch, prefetchData: [prefetchClientsFullData] },
  { href: "/products", title: "Productos", icon: Package, prefetchData: [prefetchProductsData] },
  { href: "/account", title: "Mi Cuenta", icon: User },
  { href: "/settings", title: "Configuracion", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [];

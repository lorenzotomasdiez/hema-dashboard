import { Cog, User, LayoutList, UserSearch, Package, Inbox } from "lucide-react";
import { SidebarLink } from "@/components/SidebarItems";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Dashboard", icon: LayoutList },
  { href: "/orders", title: "Pedidos", icon: Inbox },
  { href: "/clients", title: "Clientes", icon: UserSearch },
  { href: "/products", title: "Productos", icon: Package },
  { href: "/account", title: "Mi Cuenta", icon: User },
  { href: "/settings", title: "Configuracion", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [];

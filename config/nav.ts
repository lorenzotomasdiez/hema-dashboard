import { Cog, User, LayoutList, UserSearch } from "lucide-react";
import { SidebarLink } from "@/components/SidebarItems";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Pedidos", icon: LayoutList },
  { href: "/clients", title: "Clientes", icon: UserSearch },
  { href: "/account", title: "Mi Cuenta", icon: User },
  { href: "/settings", title: "Configuracion", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [];

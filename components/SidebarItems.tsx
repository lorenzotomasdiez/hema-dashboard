"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { defaultLinks, additionalLinks } from "@/config/nav";
import { useQueryClient } from "@tanstack/react-query";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { AuthSession } from "@/lib/auth/utils";

export interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
  prefetchData?: {
    queryKey: readonly unknown[];
    queryFn: () => Promise<any>;
    staleTime: number;
  }[];
  roles: UserRole[];
}

const SidebarItems = () => {
  const { data: session } = useSession();
  return (
    <>
      <SidebarLinkGroup links={defaultLinks} session={session as AuthSession["session"]} />
      {additionalLinks.length > 0
        ? additionalLinks.map((l) => (
          <SidebarLinkGroup
            links={l.links}
            title={l.title}
            border
            key={l.title}
            session={session as AuthSession["session"]}
          />
        ))
        : null}
    </>
  );
};
export default SidebarItems;

const SidebarLinkGroup = ({
  links,
  title,
  border,
  session
}: {
  links: SidebarLink[];
  title?: string;
  border?: boolean;
  session: AuthSession["session"];
}) => {
  const fullPathname = usePathname();
  const pathname = "/" + fullPathname.split("/")[1];

  return (
    <div className={border ? "border-border border-t my-8 pt-4" : ""}>
      {title ? (
        <h4 className="px-2 mb-2 text-xs uppercase text-muted-foreground tracking-wider">
          {title}
        </h4>
      ) : null}
      <ul>
        {links.map((link) => (
          link.roles.includes(session?.user.selectedCompany?.role as UserRole) && (
            <li key={link.title}>
              <SidebarLink link={link} active={pathname === link.href} />
            </li>
          )))}
      </ul>
    </div>
  );
};
const SidebarLink = ({ link, active }: { link: SidebarLink; active: boolean }) => {
  const queryClient = useQueryClient();
  const prefetchQuery = async () => {
    if (link.prefetchData && link.prefetchData.length > 0) {
      link.prefetchData.forEach(prefetch => {
        queryClient.prefetchQuery({
          queryKey: prefetch.queryKey,
          queryFn: prefetch.queryFn,
          staleTime: prefetch.staleTime,
        });
      });
    }
  };
  return (
    <Link
      href={link.href}
      className={`group transition-colors p-2 inline-block hover:bg-popover hover:text-primary text-muted-foreground text-xs hover:shadow rounded-md w-full${active ? " text-primary font-semibold" : ""
        }`}
      onMouseEnter={prefetchQuery}
    >
      <div className="flex items-center">
        <div
          className={cn(
            "opacity-0 left-0 h-6 w-[4px] absolute rounded-r-lg bg-primary",
            active ? "opacity-100" : "",
          )}
        />
        <link.icon className="h-3.5 mr-1" />
        <span>{link.title}</span>
      </div>
    </Link>
  );
};

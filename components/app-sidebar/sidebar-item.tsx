"use client";

import Link from "next/link";
import { SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";
import { SidebarLink } from ".";
import { cn } from "@/lib/utils";


export default function AppSidebarItem({ link, isActive }: { link: SidebarLink, isActive: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className={cn("text-sm", isActive && "text-primary")}>
        <Link href={link.href}>
          <link.icon className="w-4 h-4" />
          <span>{link.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
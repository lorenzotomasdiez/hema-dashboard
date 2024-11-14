"use client";

import { LogOut } from "lucide-react";
import { Bell } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { BadgeCheck, ChevronsUpDown, CreditCard, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";

{/* <div className="flex flex-col gap-2">
<UserDetails session={session} />
<ChooseCompanySelection />
<SignOut />
</div> */}


export default function AppSidebarFooter() {
  const { data: session } = useSession();
  return (
    <SidebarFooter>
      <SidebarMenu>
        {
          session ? (
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user.name}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {session.user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={session.user.image}
                          alt={session.user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          {session.user.name?.split(" ").map((name) => name.charAt(0).toUpperCase()).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {session.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {session.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="flex items-center gap-2" disabled>
                      <Sparkles size={14}/>
                      Upgrade to Pro
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="flex items-center gap-2" disabled>
                      <BadgeCheck size={14}/>
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2" disabled>
                      <CreditCard size={14}/>
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2" disabled>
                      <Bell size={14}/>
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2" onClick={() => signOut()}>
                    <LogOut size={14} />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ) : (
            <Skeleton className="w-full h-[48px]" />
          )
        }
      </SidebarMenu>
    </SidebarFooter>
  )
}
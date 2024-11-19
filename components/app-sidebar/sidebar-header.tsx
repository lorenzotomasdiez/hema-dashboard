"use client";
import { AudioWaveform, ChevronsUpDown, Command, GalleryVerticalEnd, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { useSession } from "next-auth/react";
import { useCompaniesQuery } from "@/lib/tanstack";
import { Skeleton } from "../ui/skeleton";
import { SelectedCompany } from "@/lib/auth/utils";
import { CompanyWithUserCompanies } from "@/types/company";
import { APP_PATH } from "@/config/path";


export default function AppSidebarHeader() {
  const { data: session, update } = useSession();
  const companies = useCompaniesQuery();
  const companySelected = session?.user.selectedCompany as SelectedCompany;

  const handleChangeCompany = async (company: CompanyWithUserCompanies) => {
    if (!session) return;
    const roleInCompany = company.userCompanies.find((userCompany) => userCompany.userId === session.user.id)?.role;
    if (!roleInCompany) return;
    const newValue = {
      ...session,
      user: {
        ...session.user,
        selectedCompany: {
          id: company.id,
          name: company.name,
          image: company.image,
          role: roleInCompany
        }
      }
    }
    await update(newValue);
    window.location.replace(APP_PATH.protected.dashboard.root);
  }

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          {
            companies.isLoading && !companies.data && (
              <Skeleton className="w-full h-[48px]" />
            )
          }
          {
            !companies.isLoading && companies.data && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/80 text-sidebar-primary-foreground">
                      {companySelected?.name?.split(" ").map((name) => name.charAt(0).toUpperCase()).join("")}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {companySelected?.name}
                      </span>
                      <span className="truncate text-xs">
                        Free tier
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Teams
                  </DropdownMenuLabel>
                  {companies.data?.map((company, index) => (
                    <DropdownMenuItem
                      key={company.name}
                      onClick={() => handleChangeCompany(company)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        {company.name?.split(" ").map((name) => name.charAt(0).toUpperCase()).join("")}
                      </div>
                      {company.name}
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                  {/* <DropdownMenuSeparator /> */}
                  {/* <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Add team
                    </div>
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
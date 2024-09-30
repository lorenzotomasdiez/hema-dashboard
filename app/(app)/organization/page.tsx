import { CompanyInfo } from "@/components/sections";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { withRoleAccess } from "@/guard";
import { SelectedCompany } from "@/lib/auth/utils";
import { Building, Mail, Phone } from "lucide-react";

export default async function OrganizationPage() {
  const session = await withRoleAccess();
  const company = session.user.selectedCompany as SelectedCompany;
  return (
    <div className="container mx-auto p-4 space-y-6 max-w-screen-sm">
      <Card className="bg-white dark:bg-neutral-800">
        <CardHeader className="flex flex-row gap-2 items-center justify-start">
          <Avatar>
            <AvatarImage src={company.image} />
            <AvatarFallback>
              <span>{company.name.charAt(0)}</span>
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-black dark:text-white">{company.name}</CardTitle>
            <CardDescription className="text-muted-foreground dark:text-muted-foreground">Informacion de la organizacion</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 opacity-70 text-black dark:text-white" />
            <span className="text-sm text-black dark:text-white">{company.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 opacity-70 text-black dark:text-white" />
            <span className="text-sm text-black dark:text-white">placeholder@mail.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 opacity-70 text-black dark:text-white" />
            <span className="text-sm text-black dark:text-white">+56 9 12345678</span>
          </div>
        </CardContent>
      </Card>
      <CompanyInfo />
    </div>
  )
}
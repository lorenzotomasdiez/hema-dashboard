"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompanyInfoQuery } from "@/lib/tanstack";
import { UserRoleTranslator } from "@/lib/utils";
import { UserRole } from "@prisma/client";
import { useState } from "react";
import { CompanyInviteUser } from "./company-invite-user";
import { LoaderCircle } from "lucide-react";

export function CompanyInfo() {
  const companyInfo = useCompanyInfoQuery()
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  return (
    <Card className="bg-white dark:bg-neutral-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-black dark:text-white">Usuarios</CardTitle>
          <CardDescription className="text-muted-foreground dark:text-muted-foreground">Controla los usuarios de la organizacion</CardDescription>
        </div>
        <div className="flex justify-end items-center gap-3">
          {
            companyInfo.isLoading && <LoaderCircle className="animate-spin" />
          }
          <CompanyInviteUser
            isInviteModalOpen={isInviteModalOpen}
            setIsInviteModalOpen={setIsInviteModalOpen}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {companyInfo.data?.userCompanies?.map(userCompany => (
            <div key={userCompany.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={userCompany.user.image ?? ''} alt={userCompany.user.name ?? ''} />
                  <AvatarFallback>{userCompany.user.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-black dark:text-white">{userCompany.user.name}</p>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">{userCompany.user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-black dark:text-white">{UserRoleTranslator(userCompany.role as UserRole)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
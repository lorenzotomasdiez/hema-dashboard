"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthSessionCompanies } from "@/lib/auth/utils";
import { useSession } from "next-auth/react";
import AddNewCompanyForm from "./add-new-company-form";

export const ChooseCompanySection = () => {
  const { data: session, update } = useSession();
  const updateCompanyValue = () => {
    if (!session) return;
    const newValue = {
      ...session,
      user: {
        ...session.user,
        selectedCompanyId: "company-1"
      }
    }
    update(newValue);
  }
  return (
    <Card className="p-4 flex flex-col gap-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Elegi tu organización</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {
            session?.user.companies
              && session?.user.companies.length > 0
              ? session?.user.companies.map((company: AuthSessionCompanies) => (
                <div onClick={updateCompanyValue} className="border rounded-md p-2 cursor-pointer">
                  <Avatar>
                    <AvatarImage src={company.companyLogo} />
                    <AvatarFallback>
                      {company.companyName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ))
              : (
                <div className="flex justify-center items-center">
                  <p>No se encontraron organizaciones</p>
                </div>
              )
          }
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <AddNewCompanyForm />
      </CardFooter>
    </Card>
  );
}


"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import AddNewCompanyForm from "./add-new-company-form";
import { useCompaniesQuery } from "@/lib/tanstack";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { APP_PATH } from "@/config/path";
import AppLogo from "@/components/AppLogo";
import { CompanyWithUserCompanies } from "@/types/company";

const companyLogoUrlPlaceholder = "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg";

export const ChooseCompanySection = () => {

  const { data: session, update } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const companies = useCompaniesQuery();

  const updateCompanyValue = async (company: CompanyWithUserCompanies) => {
    if (!session) return;
    setIsRedirecting(true);
    const roleInCompany = company.userCompanies.find((userCompany) => userCompany.userId === session.user.id)?.role;
    if (!roleInCompany) return;
    const newValue = {
      ...session,
      user: {
        ...session.user,
        selectedCompany: {
          id: company.id,
          name: company.name,
          image: company.image || companyLogoUrlPlaceholder,
          role: roleInCompany
        }
      }
    }
    await update(newValue);
    window.location.replace(APP_PATH.protected.dashboard.root);
  }

  return (
    <Card className="p-4 flex flex-col gap-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Elegi tu organización</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {
            companies.isLoading && <div className="flex justify-center items-center">
              <p>Buscando organizaciones...</p>
              <Loader2 className="animate-spin" />
            </div>
          }
          {
            !companies.isLoading && (
              companies.data && companies.data.length > 0 ? companies.data.map((company) => (
                <div
                  key={company.id}
                  onClick={() => updateCompanyValue(company)}
                  className="flex items-center gap-2 border rounded-md p-2 cursor-pointer"
                >
                  <Avatar>
                    <AvatarImage
                      src={companyLogoUrlPlaceholder}
                    />
                    <AvatarFallback>
                      {company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <p>{company.name}</p>
                </div>
              )) : (
                <div className="flex justify-center items-center">
                  <p>No se encontraron organizaciones</p>
                </div>
              )
            )
          }
        </div>
        {
          isRedirecting && (<AppLogo />)
        }
      </CardContent>
      <CardFooter className="flex justify-center">
        <AddNewCompanyForm disabled={companies.isLoading} />
      </CardFooter>
    </Card>
  );
}


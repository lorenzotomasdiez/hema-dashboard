"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import AddNewCompanyForm from "./add-new-company-form";
import { useCompaniesQuery } from "@/lib/tanstack";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { APP_PATH } from "@/config/path";
import AppLogoLoader from "@/components/AppLogoLoader";
import { CompanyWithUserCompanies } from "@/types/company";
import { useRouter } from "next/navigation";

export default function ChooseCompanySection() {

  const { data: session, update } = useSession();
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const router = useRouter();

  const companies = useCompaniesQuery();

  const updateCompanyValue = async (company: CompanyWithUserCompanies) => {
    if (!session) return;
    setIsRedirecting(true);
    const roleInCompany = company.userCompanies.find((userCompany) => userCompany.userId === session.user.id)?.role;
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
  }

  useEffect(() => {
    if (session?.user?.selectedCompany) {
      router.replace(APP_PATH.protected.dashboard.root);
    }
  }, [session?.user?.selectedCompany, router]);

  if (!session) {
    return <AppLogoLoader />;
  }

  return (
    <Card className="w-full flex flex-col gap-4 border-none shadow-none p-6">
      <CardTitle>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Selecciona tu organización
        </h1>
      </CardTitle>
      <CardContent>
        <div className="flex flex-col gap-2">
          {companies.isLoading && (
            <div className="flex justify-center items-center gap-2">
              <p>Buscando organizaciones...</p>
              <Loader2 className="animate-spin" />
            </div>
          )}
          {!companies.isLoading && companies.data && (
            <>
              {companies.data.length > 0 ? (
                companies.data.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => updateCompanyValue(company)}
                    className="flex items-center gap-2 border rounded-md p-2 cursor-pointer"
                  >
                    <Avatar>
                      <AvatarImage
                        src={company.image || ""}
                      />
                      <AvatarFallback>
                        {company.name?.split(" ").map((name) => name.charAt(0)).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <p>{company.name}</p>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center">
                  <p>No se encontraron organizaciones</p>
                </div>
              )}
            </>
          )}
        </div>
        {isRedirecting && <AppLogoLoader />}
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 text-xs font-medium">
            Próximamente
          </span>
        </div>
        <AddNewCompanyForm disabled={true} />
      </CardFooter>
    </Card>
  );
}


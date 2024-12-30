"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import { CompanyConfig } from "@/types/company";
import { useEffect, useState } from "react";
import { updateCompanyConfig } from "@/services/companies";
import { debounce } from "lodash";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export function CompanySettings({ companyConfig }: { companyConfig: CompanyConfig }) {
  const { data: session, update } = useSession();
  const [useStockSystem, setUseStockSystem] = useState(companyConfig.useStockSystem);

  useEffect(() => {
    debouncedUpdateCompanyConfig({ useStockSystem });
  }, [useStockSystem]);

  const debouncedUpdateCompanyConfig = debounce(async(...args: Parameters<typeof updateCompanyConfig>) => {
    const res = await updateCompanyConfig(...args);
    if(res.message){
      toast.success("Configuración actualizada correctamente");
      updateSession();
    }
  }, 1000);

  const updateSession = async () => {
    if (!session) return;
    const newValue = {
      ...session,
      user: {
        ...session.user,
        selectedCompany: {
          ...session.user.selectedCompany,
          useStockSystem
        }
      }
    }
    await update(newValue);
  }

  return (
    <Card className="bg-white dark:bg-neutral-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-black dark:text-white">Configuraciones</CardTitle>
          <CardDescription className="text-muted-foreground dark:text-muted-foreground">Habilita o deshabilita el uso de diferentes herramientas</CardDescription>
        </div>
      </CardHeader>
      <CardContent>

        <div className="space-y-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="group relative">
              <Switch checked={useStockSystem} onCheckedChange={setUseStockSystem} />
            </div>
            <span className="text-sm text-neutral-600 dark:text-white">
              {!useStockSystem ? "Habilitar uso de stock" : "Deshabilitar uso de stock"}
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 opacity-70 text-black dark:text-white" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Esta sección estará disponible pronto</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
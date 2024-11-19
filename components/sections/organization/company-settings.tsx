import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";

export function CompanySettings() {
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
              <Switch disabled={true} />
            </div>
            <span className="text-sm text-neutral-400 dark:text-white line-through">Habilitar uso de stock</span>
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
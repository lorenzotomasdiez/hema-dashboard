"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { moneyMask } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { CreateProductType } from "@/types";
import { useCostComponentsQuery } from "@/lib/tanstack";
import { CostComponent } from "@prisma/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Trash } from 'lucide-react';
import Link from "next/link";
import Decimal from "decimal.js";
import { APP_PATH } from "@/config/path";
import { Button } from "@/components/ui/button";

export default function ProductCostsSection() {

  const { watch, setValue } = useFormContext<CreateProductType>();

  const { data: costs } = useCostComponentsQuery();

  const productCostComponents = watch('costComponents');
  const price = watch('price');

  const costsToShow = costs?.filter(cost => !productCostComponents?.some(component => component.id === cost.id));

  const calculateProfitMargin = () => {
    const totalCost = productCostComponents?.reduce((acc, component) => acc.plus(component.cost), new Decimal(0)) || new Decimal(0);
    return price - Number(totalCost);
  }

  const profitMargin = calculateProfitMargin();


  const handleAddCostComponent = (cost: CostComponent) => {
    const newCost = {
      ...cost,
      cost: typeof cost.cost === 'number' ? cost.cost : Number(cost.cost)
    };
    setValue('costComponents', [...(productCostComponents || []), newCost], { shouldValidate: true, shouldDirty: true });
  }

  const handleDeleteCostComponent = (index: number) => {
    setValue('costComponents', productCostComponents?.filter((_, i) => i !== index) || [], { shouldValidate: true, shouldDirty: true });
  }
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="py-4">
          <div className="flex items-center justify-between w-full">
            <Label className="text-lg font-semibold text-black dark:text-white">
              Costos del Producto
            </Label>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-2 pb-4">
          {productCostComponents && productCostComponents.length > 0 ? (
            <div className="space-y-4">
              {productCostComponents?.map((component, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {component?.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 dark:text-gray-400">
                      {moneyMask(component?.cost)}
                    </span>
                    <Button
                      onClick={() => handleDeleteCostComponent(index)}
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Link href={APP_PATH.protected.costs.root} className="block hover:opacity-90">
              <Alert className="cursor-pointer">
                <Info className="h-5 w-5" />
                <AlertTitle className="font-semibold">No hay costos de producción agregados</AlertTitle>
                <AlertDescription className="text-sm text-gray-600 dark:text-gray-400">
                  Para agregar costos, primero debes crearlos desde la sección de costos
                </AlertDescription>
              </Alert>
            </Link>
          )}

          {costsToShow && costsToShow.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label 
                  htmlFor="costComponents" 
                  className="text-right text-black dark:text-white col-span-1 font-medium"
                >
                  Costo
                </Label>
                <Select
                  value="0"
                  onValueChange={(value) => {
                    const cost = costsToShow?.find(cost => cost.id.toString() === value);
                    if (cost) handleAddCostComponent(cost);
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un costo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">Selecciona un costo</SelectItem>
                      {costsToShow?.map(cost => (
                        <SelectItem key={cost.id} value={cost.id.toString()}>
                          {cost.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700" />
            </div>
          )}

          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Label className="text-black dark:text-white font-medium">
              Margen de Ganancia Precio Base
            </Label>
            <span className={cn(
              "text-md font-semibold",
              profitMargin > 0 ? "text-green-500" : "text-red-500"
            )}>
              {moneyMask(profitMargin)}
            </span>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClientsQuery } from "@/lib/tanstack";
import { moneyMask } from "@/lib/utils";
import { CreateProductType } from "@/types";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";

export default function CustomPricesSection() {
  const { watch, setValue } = useFormContext<CreateProductType>();
  const { data: clients } = useClientsQuery();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const clientPrices = watch('clientPrices') || [];

  const handleAddClientPrice = (clientId: string, price: number) => {
    const existingPriceIndex = clientPrices.findIndex(cp => cp.clientId === clientId);

    if (existingPriceIndex >= 0) {
      const updatedPrices = [...clientPrices];
      updatedPrices[existingPriceIndex].price = price;
      setValue('clientPrices', updatedPrices, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue('clientPrices', [...clientPrices, { clientId, price }], {
        shouldValidate: true,
        shouldDirty: true
      });
    }
  };
  const handleRemoveClientPrice = (clientId: string) => {
    setValue(
      'clientPrices',
      clientPrices.filter(cp => cp.clientId !== clientId),
      { shouldValidate: true, shouldDirty: true }
    );
  };
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold text-black dark:text-white">
              Precios Personalizados
            </Label>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-6 py-4">
            {clientPrices.length > 0 && (
              <div className="space-y-2 mb-4">
                {clientPrices.map((cp) => (
                  <div
                    key={cp.clientId}
                    className="flex justify-between items-center p-2 border border-gray-300 rounded-lg shadow-sm"
                  >
                    <span className="font-medium text-gray-800 dark:text-white">
                      {clients?.find(c => c.id === cp.clientId)?.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {editingId === cp.clientId ? (
                        <input
                          type="text"
                          defaultValue={cp.price}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const value = (e.target as HTMLInputElement).value
                                .replace(/[^\d.,]/g, '')
                                .replace(',', '.');
                              const numericValue = parseFloat(value) || 0;
                              handleAddClientPrice(cp.clientId, numericValue);
                              setEditingId(null);
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value
                              .replace(/[^\d.,]/g, '')
                              .replace(',', '.');
                            const numericValue = parseFloat(value) || 0;
                            handleAddClientPrice(cp.clientId, numericValue);
                            setEditingId(null);
                          }}
                          className="w-24 px-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <span 
                          onClick={() => setEditingId(cp.clientId)}
                          className="cursor-pointer w-24 px-2 py-1 text-right hover:bg-gray-100 rounded"
                        >
                          {moneyMask(cp.price)}
                        </span>
                      )}
                      <Button
                        onClick={() => handleRemoveClientPrice(cp.clientId)}
                        type="button"
                        size="sm"
                        variant="ghost"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {clients && clients.length > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-black dark:text-white">
                  Cliente
                </Label>
                <Select
                  value="0"
                  onValueChange={(clientId) => {
                    if (clientId !== "0") {
                      const basePrice = Number(watch('price'));
                      handleAddClientPrice(clientId, basePrice);
                    }
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">Seleccionar cliente</SelectItem>
                      {clients
                        .filter(client => !clientPrices.some(cp => cp.clientId === client.id))
                        .map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
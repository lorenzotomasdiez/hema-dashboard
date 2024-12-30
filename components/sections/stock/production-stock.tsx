"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductWithStock } from "@/types/stock";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddStockMutation } from "@/lib/tanstack/useStock";
import { useQueryClient } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { createAddStockMovementSchema, CreateAddStockMovement } from "@/dto/stock/create-stock-movement";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFInput } from "@/components/rhf/rhf-input";
import { Label } from "@/components/ui/label";
import { RHFInputNumber } from "@/components/rhf";

interface ProductionStockProps {
  product: ProductWithStock;
}

export default function ProductionStock({ product }: ProductionStockProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const addStockMutation = AddStockMutation({ queryClient });

  const form = useForm<CreateAddStockMovement>({
    resolver: zodResolver(createAddStockMovementSchema),
    defaultValues: {
      description: "",
      stock: 0,
      confirmationText: undefined,
    }
  });

  const { formState: { isDirty }, watch } = form;

  const confirmationText = watch("confirmationText");

  const onSubmit = (data: CreateAddStockMovement) => {
    addStockMutation.mutate({productId: product.id, stock: data.stock, description: data.description})
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full max-w-xs">
          Ingresar Producción
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Ingresar Producción de <span className="font-bold text-green-500">{product.name}</span>
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Ingrese la cantidad de productos producidos.
        </p>
        <Form {...form}>
          <form
            className="py-2 grid grid-cols-2 gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="col-span-2 flex flex-row items-center gap-2">
              <Label className="whitespace-nowrap">Cantidad producida</Label>
              <RHFInputNumber
                name="stock"
                placeholder="Cantidad producida"
              />
            </div>

            <div className="col-span-2 flex flex-row items-center gap-2">
              <Label className="whitespace-nowrap">Descripción</Label>
              <RHFInput
                name="description"
                placeholder="Descripción"
                className="col-span-2"
              />
            </div>

            <div className="col-span-2 flex flex-row items-center gap-2">
              <RHFInput
                name="confirmationText"
                placeholder="Ingresar 'INGRESAR' para ingresar la producción"
              />
              <Button className="col-span-2" type="submit" disabled={!isDirty || confirmationText !== "INGRESAR"}>
                Confirmar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
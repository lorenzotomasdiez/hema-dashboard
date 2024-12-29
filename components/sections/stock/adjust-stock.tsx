"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductWithStock } from "@/types/stock";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdjustStockMutation } from "@/lib/tanstack/useStock";
import { useQueryClient } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { CreateAdjustStockMovement, createAdjustStockMovementSchema } from "@/dto/stock/create-stock-movement";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFInput } from "@/components/rhf/rhf-input";
import { Label } from "@/components/ui/label";
import { RHFInputNumber } from "@/components/rhf";

interface AdjustStockProps {
  product: ProductWithStock;
}

export default function AdjustStock({ product }: AdjustStockProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const addStockMutation = AdjustStockMutation({ queryClient });

  const form = useForm<CreateAdjustStockMovement>({
    resolver: zodResolver(createAdjustStockMovementSchema),
    defaultValues: {
      description: "",
      stock: product.stock,
      confirmationText: undefined,
    }
  });

  const { formState: { isDirty }, watch } = form;

  const confirmationText = watch("confirmationText");

  const newStock = watch("stock");

  const onSubmit = (data: CreateAdjustStockMovement) => {
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
          Ajustar Stock
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Ajustar Stock de <span className="font-bold text-green-500">{product.name}</span>
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          El ajuste se realizará en base al stock existente.
        </p>
        <Form {...form}>
          <form
            className="py-2 grid grid-cols-2 gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="col-span-2 flex flex-row items-center gap-2">
              <Label className="whitespace-nowrap">Stock actual</Label>
              <RHFInputNumber
                name="stock"
                placeholder="Stock corregido"
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
                placeholder="Ingresar 'AJUSTAR' para ajustar el stock"
              />
              <Button className="col-span-2" type="submit" disabled={!isDirty || confirmationText !== "AJUSTAR" || newStock === product.stock}>
                Confirmar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
"use client"

import { useEffect } from "react";
import { Plus } from "lucide-react";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RHFInput } from "@/components/rhf/rhf-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { AddCostComponentMutation } from "@/lib/tanstack";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCostComponentsQuery } from "@/lib/tanstack";
import { createCostComponentSchema } from "@/dto/cost-component/create-cost-component";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCostComponentType } from "@/types";
import { moneyMask } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DeleteCostModal from "./delete-cost-modal";

export default function CostComponentsSection() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: costs, isLoading } = useCostComponentsQuery();

  const addCostComponentMutation = AddCostComponentMutation(queryClient);

  const form = useForm<CreateCostComponentType>({
    resolver: zodResolver(createCostComponentSchema),
    defaultValues: {
      name: "",
      cost: 0,
      companyId: session?.user.selectedCompany?.id,
    },
  });

  const { handleSubmit, setValue, formState: { errors } } = form;

  const onSubmit = async (data: CreateCostComponentType) => {
    addCostComponentMutation.mutate({
      ...data,
      cost: Number(data.cost),
    })
    form.reset();
  };

  useEffect(() => {
    if (session?.user.selectedCompany?.id) {
      setValue("companyId", session.user.selectedCompany.id);
    }
  }, [session?.user.selectedCompany?.id]);
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
      <Card className="h-full w-full shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-neutral-800 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Costos de los Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productCostName" className="text-sm font-medium text-gray-700 dark:text-gray-200">Nombre del Costo del Producto</Label>
                <RHFInput
                  name="name"
                  placeholder="Ej: Bolsa"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productCostAmount" className="text-sm font-medium text-gray-700 dark:text-gray-200">Monto del Costo</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <RHFInput
                    name="cost"
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100"
                    onChange={(e) => setValue("cost", Number(e.target.value))}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                <Plus className="mr-2 h-4 w-4" /> Agregar Costo del Producto
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="h-full w-full shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-neutral-800 dark:border-neutral-700">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Lista de Costos del Producto</CardTitle>
          </div>
        </CardHeader>
        {isLoading ? (
          <CostComponentSkeleton />
        ) : (
          costs?.length === 0 ? (
            <CostComponentEmptyList />
          ) : (
            <CardContent>
              <Table>
                <TableHeader>
                <TableRow>
                  <TableHead className="text-left dark:text-gray-200">Nombre del Costo</TableHead>
                  <TableHead className="text-right dark:text-gray-200">Monto</TableHead>
                  <TableHead className="text-right dark:text-gray-200">Acciones</TableHead>
                </TableRow>
              </TableHeader >
              <TableBody>
                {costs?.map((cost, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <TableCell className="font-medium dark:text-gray-200">{cost.name}</TableCell>
                    <TableCell className="text-right dark:text-gray-200">${moneyMask(Number(cost.cost))}</TableCell>
                    <TableCell className="text-right">
                      <DeleteCostModal costComponentId={cost.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table >
            </CardContent >
          )
        )}
      </Card >
    </div >
  )
}

const CostComponentSkeleton = () => {
  return (
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left dark:text-gray-200">Nombre del Costo</TableHead>
            <TableHead className="text-right dark:text-gray-200">Monto</TableHead>
            <TableHead className="text-right dark:text-gray-200">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map((_, index) => (
            <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
              <TableCell className="font-medium">
                <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse" />
              </TableCell>
              <TableCell className="text-right">
                <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <div className="h-8 w-8 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  )
}

const CostComponentEmptyList = () => {
  return (
    <CardContent>
      <p className="text-left text-gray-500 dark:text-gray-400">No hay costos registrados</p>
    </CardContent>
  )
}
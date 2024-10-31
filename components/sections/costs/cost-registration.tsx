"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, DollarSign, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddCostComponentMutation, useCostComponentsQuery } from "@/lib/tanstack"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { CreateCostComponentType } from "@/types/cost-component"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCostComponentSchema } from "@/dto/cost-component/create-cost-component"
import { Form } from "@/components/ui/form"
import { RHFInput } from "@/components/rhf/rhf-input"
import { moneyMask } from '@/lib/utils';

export function CostRegistration() {
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

  const onSubmit = (data: CreateCostComponentType) => {
    addCostComponentMutation.mutate({
      ...data,
      cost: Number(data.cost),
    });
  };

  useEffect(() => {
    if (session?.user.selectedCompany?.id) {
      setValue("companyId", session.user.selectedCompany.id);
    }
  }, [session?.user.selectedCompany?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">Registro de Costos</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-700">Costos del Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="productCostName" className="text-sm font-medium text-gray-700">Nombre del Costo del Producto</Label>
                    <RHFInput
                      name="name"
                      placeholder="Ej: Bolsa"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productCostAmount" className="text-sm font-medium text-gray-700">Monto del Costo</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <RHFInput
                        name="cost"
                        type="number"
                        placeholder="0.00"
                        className="w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-800"
                        onChange={(e) => setValue("cost", Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                    <Plus className="mr-2 h-4 w-4" /> Agregar Costo del Producto
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-12">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center">
                {isLoading ? (
                  <span className="text-gray-500">Cargando...</span>
                ) : (
                  <CardTitle className="text-2xl font-semibold text-gray-700">Lista de Costos del Producto</CardTitle>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Nombre del Costo</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costs?.map((cost, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{cost.name}</TableCell>
                      <TableCell className="text-right">${moneyMask(Number(cost.cost))}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
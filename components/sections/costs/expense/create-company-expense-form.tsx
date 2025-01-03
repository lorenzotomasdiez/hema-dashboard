import { RHFInput } from "@/components/rhf";
import { RHFSwitch } from "@/components/rhf/rhf-switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCompanyExpenseSchema } from "@/dto/expense/create-company-expense";
import { AddCompanyExpenseMutation } from "@/lib/tanstack";
import { expenseCategoryTranslator } from "@/lib/utils";
import { CreateCompanyExpenseDTO } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseCategory } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { DollarSign, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function CreateCompanyExpenseForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const addCompanyExpenseMutation = AddCompanyExpenseMutation(queryClient);

  const form = useForm<CreateCompanyExpenseDTO>({
    resolver: zodResolver(createCompanyExpenseSchema),
    defaultValues: {
      name: "",
      companyId: session?.user.selectedCompany?.id,
      amount: 0,
      description: "",
      category: null,
      isMonthly: false,
    },
  });

  const { handleSubmit, setValue, formState: { errors }, watch } = form;

  useEffect(() => {
    if (session?.user.selectedCompany?.id) {
      setValue("companyId", session.user.selectedCompany.id);
    }
  }, [session?.user.selectedCompany?.id]);

  const onSubmit = async (data: CreateCompanyExpenseDTO) => {
    addCompanyExpenseMutation.mutate({
      ...data,
      amount: Number(data.amount),
    })
    form.reset();
  }
  return (
    <Card className="h-full w-full shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-neutral-800 dark:border-neutral-700">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Costos Generales</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productCostName" className="text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</Label>
              <RHFInput
                name="name"
                placeholder="Ej: Alquiler de oficina"
                className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCostDescription" className="text-sm font-medium text-gray-700 dark:text-gray-200">Descripción</Label>
              <RHFInput
                name="description"
                placeholder="Ej: Oficina en la calle 123"
                className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCostAmount" className="text-sm font-medium text-gray-700 dark:text-gray-200">Monto</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <RHFInput
                  name="amount"
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100"
                  onChange={(e) => setValue("amount", Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCostCategory" className="text-sm font-medium text-gray-700 dark:text-gray-200">Categoría</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ExpenseCategory).map((category) => (
                    <SelectItem key={category} value={category}>{expenseCategoryTranslator(category)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex items-center justify-between">
              <Label htmlFor="productCostIsMonthly" className="text-sm font-medium text-gray-700 dark:text-gray-200">¿Es mensual?</Label>
              <RHFSwitch name="isMonthly" />
            </div>
            <Button type="submit" className="w-full text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">
              <Plus className="mr-2 h-4 w-4" /> Agregar Costo
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
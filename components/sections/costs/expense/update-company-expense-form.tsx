import { RHFInput } from "@/components/rhf";
import { RHFSwitch } from "@/components/rhf/rhf-switch";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCompanyExpenseSchema } from "@/dto/expense/update-company-expense";
import { UpdateCompanyExpenseMutation } from "@/lib/tanstack";
import { expenseCategoryTranslator } from "@/lib/utils";
import { CompanyExpenseComplete, UpdateCompanyExpenseDTO } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseCategory } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { DollarSign, Edit, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function UpdateCompanyExpenseForm({ expense }: { expense: CompanyExpenseComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const updateCompanyExpenseMutation = UpdateCompanyExpenseMutation(queryClient);

  const currentPrice = expense.histories?.find(history => history.validTo === null);

  const form = useForm<UpdateCompanyExpenseDTO>({
    resolver: zodResolver(updateCompanyExpenseSchema),
    defaultValues: {
      id: expense.id,
      name: expense.name,
      companyId: session?.user.selectedCompany?.id,
      amount: currentPrice ? Number(currentPrice.amount) : 0,
      description: expense.description,
      category: expense.category,
      isMonthly: expense.isMonthly,
    },
  });

  const { handleSubmit, setValue, formState: { errors }, watch } = form;

  useEffect(() => {
    if (session?.user.selectedCompany?.id) {
      setValue("companyId", session.user.selectedCompany.id);
    }
  }, [session?.user.selectedCompany?.id]);

  const onSubmit = async (data: UpdateCompanyExpenseDTO) => {
    updateCompanyExpenseMutation.mutate({
      ...data,
      amount: Number(data.amount),
    })
    form.reset();
    setIsOpen(false);
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="dark:hover:bg-neutral-700"
        >
          <Edit className="w-4 h-4 dark:text-gray-200" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Actualizar Costo</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productCostName" className="text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</Label>
                <RHFInput
                  name="name"
                  placeholder="Ej: Alquiler de oficina"
                  className="w-full px-3 py-2 border text-black border-neutral-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100"
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
                <Plus className="mr-2 h-4 w-4" /> Actualizar Costo
              </Button>
            </form>
          </Form>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  )
}
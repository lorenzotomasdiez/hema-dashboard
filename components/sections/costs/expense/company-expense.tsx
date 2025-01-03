"use client"

import { useCompanyExpensesQuery } from "@/lib/tanstack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { moneyMask } from "@/lib/utils";
import DeleteExpenseModal from "./delete-expense-modal";
import CompanyExpenseSkeleton from "./skeleton";
import CompanyExpenseEmptyList from "./empty";
import CreateCompanyExpenseForm from "./create-company-expense-form";
import UpdateCompanyExpenseForm from "./update-company-expense-form";

export default function CompanyExpenseSection() {
  const { data: companyExpenses, isLoading } = useCompanyExpensesQuery();
  return (
    <div className="w-full flex flex-col gap-12 container mx-auto">
      <CreateCompanyExpenseForm />
      <Card className="shadow-lg dark:bg-neutral-800 dark:border-neutral-700">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Lista de Costos Generales</CardTitle>
          </div>
        </CardHeader>
        {isLoading ? (
          <CompanyExpenseSkeleton />
        ) : (
          companyExpenses?.length === 0 ? (
            <CompanyExpenseEmptyList />
          ) : (
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left dark:text-gray-200">Nombre</TableHead>
                    <TableHead className="text-left dark:text-gray-200">¿Es mensual?</TableHead>
                    <TableHead className="text-left dark:text-gray-200">Fecha de creación</TableHead>
                    <TableHead className="text-left dark:text-gray-200">Fecha de finalización</TableHead>
                    <TableHead className="text-right dark:text-gray-200">Monto</TableHead>
                    <TableHead className="text-right dark:text-gray-200">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyExpenses?.map((expense, index) => {
                    const currentPrice = expense.histories?.find(history => history.validTo === null);
                    return (
                      <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                        <TableCell className="font-medium dark:text-gray-200">{expense.name}</TableCell>
                        <TableCell className="text-left dark:text-gray-200">
                          {expense.isMonthly ? "Sí" : "No"}
                        </TableCell>
                        <TableCell className="text-left dark:text-gray-200">
                          {
                            currentPrice?.validFrom ? new Date(currentPrice.validFrom).toLocaleDateString() : " - "
                          }
                        </TableCell>
                        <TableCell className="text-left dark:text-gray-200">
                          {
                            currentPrice?.validTo ? new Date(currentPrice.validTo).toLocaleDateString() : "N/A"
                          }
                        </TableCell>
                        <TableCell className="text-right dark:text-gray-200">
                          {
                            currentPrice ? (
                              `${moneyMask(Number(currentPrice?.amount))} (Actual)`
                            ):
                            <span className="text-red-500">No hay precio actual</span>
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <UpdateCompanyExpenseForm expense={expense} />
                          <DeleteExpenseModal expenseId={expense.id} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          )
        )}
      </Card>
    </div>
  )
}
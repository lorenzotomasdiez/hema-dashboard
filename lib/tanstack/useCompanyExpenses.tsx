import { toast } from "sonner"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "./queryKeys"
import { addCompanyExpense, deleteCompanyExpense, disableCompanyExpense, getCompanyExpenses } from "@/services/expenses"
import { CompanyExpense } from "@prisma/client"
import { CreateCompanyExpenseDTO } from "@/types/expense"

export const useCompanyExpensesQuery = () => {
  return useQuery<CompanyExpense[]>({
    queryKey: QUERY_KEYS.expenses.root,
    queryFn: getCompanyExpenses,
    staleTime: 1000 * 60
  })
}

export const AddCompanyExpenseMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["addCompanyExpense"],
    mutationFn: (expense: CreateCompanyExpenseDTO) => addCompanyExpense(expense),
    onMutate: async (expense: CreateCompanyExpenseDTO) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.expenses.root });
      const previousExpenses = queryClient.getQueryData<CompanyExpense[]>(QUERY_KEYS.expenses.root);
      queryClient.setQueryData(QUERY_KEYS.expenses.root, [{
        ...expense,
        date: new Date(),
        id: new Date().getTime().toString()
      }, ...(previousExpenses || [])]);
      return { previousExpenses };
    },
    onSuccess: () => {
      toast.success("Costo creado correctamente!")
    },
    onError: (err, _client, context) => {
      queryClient.setQueryData(QUERY_KEYS.expenses.root, context?.previousExpenses)
      toast.error("Error al crear el costo", {
        description: err.message
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses.root });
    }
  })
}

export const DisableCompanyExpenseMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["disableCompanyExpense"],
    mutationFn: (expenseId: number) => disableCompanyExpense(expenseId),
    onMutate: async (expenseId: number) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.expenses.root });
      const previousExpenses = queryClient.getQueryData<CompanyExpense[]>(QUERY_KEYS.expenses.root);
      queryClient.setQueryData(QUERY_KEYS.expenses.root, previousExpenses?.filter(expense => expense.id !== expenseId));
      return { previousExpenses };
    },
    onSuccess: () => {
      toast.success("Costo deshabilitado correctamente!")
    },
    onError: (err, _client, context) => {
      queryClient.setQueryData(QUERY_KEYS.expenses.root, context?.previousExpenses)
      toast.error("Error al deshabilitar el costo", {
        description: err.message
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses.root });
    }
  })
}

export const DeleteCompanyExpenseMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["deleteCompanyExpense"],
    mutationFn: (expenseId: number) => deleteCompanyExpense(expenseId),
    onMutate: async (expenseId: number) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.expenses.root });
      const previousExpenses = queryClient.getQueryData<CompanyExpense[]>(QUERY_KEYS.expenses.root);
      queryClient.setQueryData(QUERY_KEYS.expenses.root, previousExpenses?.filter(expense => expense.id !== expenseId));
      return { previousExpenses };
    },
    onSuccess: () => {
      toast.success("Costo eliminado correctamente!")
    },
    onError: (err, _client, context) => {
      queryClient.setQueryData(QUERY_KEYS.expenses.root, context?.previousExpenses)
      toast.error("Error al eliminar el costo", {
        description: err.message
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses.root });
    }
  })
}


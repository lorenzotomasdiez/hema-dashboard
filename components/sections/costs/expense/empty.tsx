import { CardContent } from "@/components/ui/card";

export default function CompanyExpenseEmptyList() {
  return (
    <CardContent>
      <p className="text-left text-gray-500 dark:text-gray-400">No hay costos registrados</p>
    </CardContent>
  )
}
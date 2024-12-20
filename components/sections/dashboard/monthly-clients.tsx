import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

export default function MonthlyClients() {
  return (
    <Card className="dark:bg-neutral-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium dark:text-gray-100">Top clientes este mes</CardTitle>
        <Users className="h-4 w-4 text-primary dark:text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Proximamente...
        </p>
      </CardContent>
    </Card>
  )
}
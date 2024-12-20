"use client"

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as TooltipJS,
  Legend,
} from "chart.js"
import { useDashboardQuery } from "@/lib/tanstack"
import MonthlyComparisonCard from "./monthly-comparison-card"
import { BarChart3, CircleAlert, TruckIcon, Users } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import MonthlySmallCard from "./monthly-small-card"
import { cn } from "@/lib/utils";
import MonthlyCosts from "./monthly-costs";
import MonthlyExpenses from "./monthly-expenses";
import MonthlyClients from "./monthly-clients";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  TooltipJS,
  Legend
)


export function DashboardMain() {
  const { data } = useDashboardQuery()

  return (
    <div className="bg-gray-100 dark:bg-neutral-900 min-h-screen p-2 md:p-8">
      <div className="flex justify-center items-center mb-6 md:justify-start">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">Resumen</h1>
      </div>
      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2">
        <MonthlyComparisonCard
          data={data?.totalIncome}
          title="Facturacion del mes"
          icon={<BarChart3 className="h-4 w-4 text-green-500 dark:text-green-400" />}
          isMoney
        />
        <MonthlySmallCard
          data={data?.totalEarnings?.currentMonth}
          title="Ganancias del mes"
          icon={<BarChart3 className="h-4 w-4 text-green-500 dark:text-green-400" />}
          isMoney
          leyend="Ganancias"
          textClassName="text-green-500 dark:text-green-400"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <MonthlyComparisonCard
          data={data?.newOrders}
          title="Total de pedidos este mes"
          icon={<TruckIcon className="h-4 w-4 text-primary dark:text-primary" />}
        />
        <MonthlySmallCard
          data={data?.orderStatus.pending}
          title="Total pendientes"
          icon={
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CircleAlert
                    className={cn(
                      "h-4 w-4 text-yellow-500 dark:text-yellow-400",
                      data?.orderStatus.pending && data.orderStatus.pending < 1 && "text-green-500 dark:text-green-400"
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Los pendientes incluyen pendientes de 
                    <br/>meses anteriores hasta la fecha actual.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          }
          leyend="Pedidos pendientes a la fecha"
          textClassName={cn(
            "text-yellow-500 dark:text-yellow-400",
            data?.orderStatus.pending && data.orderStatus.pending < 1 && "text-green-500 dark:text-green-400"
          )}
        />
        <MonthlyComparisonCard
          data={data?.totalActiveClients}
          title="Total de clientes este mes"
          icon={<Users className="h-4 w-4 text-primary dark:text-primary" />}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2">
        <MonthlyCosts />
        <MonthlyExpenses />
      </div>
      <MonthlyClients />
    </div>
  )
}
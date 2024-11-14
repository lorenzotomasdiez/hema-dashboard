"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, ShoppingCart, Users } from "lucide-react"
import { OrderStatus } from "@prisma/client"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { generateDashboardPalette, moneyMask, statusToSpanish } from "@/lib/utils"
import { OrdersTable } from "../orders"
import AppLogoLoader from "@/components/AppLogoLoader"
import { useDashboardQuery } from "@/lib/tanstack"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)


export function DashboardMain() {
  const { data, isLoading } = useDashboardQuery()

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "category" as const,
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear" as const,
        beginAtZero: true,
        afterDataLimits: (scale: any) => {
          scale.max = Math.ceil(scale.max * 1.1)
        }
      },
    },
    elements: {
      bar: {
        borderRadius: 16,
        borderSkipped: false,
      },
    },
    barPercentage: 0.5,
    categoryPercentage: 0.8,
    maintainAspectRatio: false,
  }

  const orderStatusData = {
    labels: Object.keys(data?.orderStatus || {}).map(key => statusToSpanish(key.toUpperCase() as OrderStatus)),
    datasets: [
      {
        label: "Número de Pedidos",
        data: Object.values(data?.orderStatus || {}),
        backgroundColor: generateDashboardPalette(Object.keys(data?.orderStatus || {}).length),
        borderColor: generateDashboardPalette(Object.keys(data?.orderStatus || {}).length),
        borderWidth: 1,
      },
    ],
  }

  const topProductsData = {
    labels: data?.topProducts?.map(product => product.name) || [],
    datasets: [
      {
        label: "Unidades Vendidas",
        data: data?.topProducts?.map(product => product.sales) || [],
        backgroundColor: generateDashboardPalette(data?.topProducts?.length ? data.topProducts.length + 1 : 0),
        borderColor: generateDashboardPalette(data?.topProducts?.length ? data.topProducts.length + 1 : 0),
        borderWidth: 1,
      },
    ],
  }
  if (isLoading || !data) return <AppLogoLoader />
  return (
    <div className="bg-gray-100 dark:bg-neutral-900 min-h-screen p-2 md:p-8">
      <div className="flex justify-center items-center mb-6 md:justify-start">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">Resumen</h1>
      </div>
      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="dark:bg-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-100">Ingresos Totales</CardTitle>
            <BarChart3 className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{moneyMask(data?.totalIncome?.currentMonth || 0)}</div>
            <p className="text-xs">
              <span className={`${data?.totalIncome?.previousMonth !== 0
                ? ((data?.totalIncome?.currentMonth - data?.totalIncome?.previousMonth) / data?.totalIncome?.previousMonth * 100) < 0
                  ? 'text-red-500'
                  : 'text-green-500'
                : data?.totalIncome?.currentMonth > 0
                  ? 'text-green-500'
                  : 'text-neutral-500 dark:text-neutral-400'
                }`}>
                {data?.totalIncome?.previousMonth !== 0
                  ? `${((data?.totalIncome?.currentMonth - data?.totalIncome?.previousMonth) / data?.totalIncome?.previousMonth * 100).toFixed(2)}%`
                  : data?.totalIncome?.currentMonth > 0
                    ? '+100%'
                    : '0%'
                }
              </span>
              {' '}respecto al mes anterior
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-100">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{data?.newOrders?.currentMonth} pedidos</div>
            <p className="text-xs">
              <span className={`${data?.newOrders?.previousMonth !== 0
                ? ((data?.newOrders?.currentMonth - data?.newOrders?.previousMonth) / data?.newOrders?.previousMonth * 100) < 0
                  ? 'text-red-500'
                  : 'text-green-500'
                : data?.newOrders?.currentMonth > 0
                  ? 'text-green-500'
                  : 'text-neutral-500 dark:text-neutral-400'
                }`}>
                {data?.newOrders?.previousMonth !== 0
                  ? `${((data?.newOrders?.currentMonth - data?.newOrders?.previousMonth) / data?.newOrders?.previousMonth * 100).toFixed(2)}%`
                  : data?.newOrders?.currentMonth > 0
                    ? '+100%'
                    : '0%'
                }
              </span>
              {' '}respecto al mes anterior
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-100">Total de Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-gray-100">{data?.totalActiveClients?.currentMonth}</div>
            <p className="text-xs">
              <span className={`${data?.totalActiveClients?.previousMonth !== 0
                ? ((data?.totalActiveClients?.currentMonth - data?.totalActiveClients?.previousMonth) / data?.totalActiveClients?.previousMonth * 100) < 0
                  ? 'text-red-500'
                  : 'text-green-500'
                : data?.totalActiveClients?.currentMonth > 0
                  ? 'text-green-500'
                  : 'text-neutral-500 dark:text-neutral-400'
                }`}>
                {data?.totalActiveClients?.previousMonth !== 0
                  ? `${((data?.totalActiveClients?.currentMonth - data?.totalActiveClients?.previousMonth) / data?.totalActiveClients?.previousMonth * 100).toFixed(2)}%`
                  : data?.totalActiveClients?.currentMonth > 0
                    ? '+100%'
                    : '0%'
                }
              </span>
              {' '}respecto al mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        <Card className="dark:bg-neutral-800">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Estado de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={orderStatusData} options={chartOptions} />
          </CardContent>
        </Card>
        <Card className="dark:bg-neutral-800">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Productos Más Demandados</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={topProductsData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>

      <OrdersTable />
    </div>
  )
}
"use client"

import { useState } from "react"
import { Plus, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FixedCost {
  name: string
  amount: number
}

interface ProductCost {
  costName: string
  amount: number
}

export function CostRegistrationStripe() {
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([])
  const [productCosts, setProductCosts] = useState<ProductCost[]>([])
  const [fixedCostName, setFixedCostName] = useState("''")
  const [fixedCostAmount, setFixedCostAmount] = useState("''")
  const [productCostName, setProductCostName] = useState("''")
  const [productCostAmount, setProductCostAmount] = useState("''")

  const addFixedCost = (e: React.FormEvent) => {
    e.preventDefault()
    if (fixedCostName && fixedCostAmount) {
      setFixedCosts([...fixedCosts, { name: fixedCostName, amount: parseFloat(fixedCostAmount) }])
      setFixedCostName("''")
      setFixedCostAmount("''")
    }
  }

  const addProductCost = (e: React.FormEvent) => {
    e.preventDefault()
    if (productCostName && productCostAmount) {
      setProductCosts([...productCosts, { costName: productCostName, amount: parseFloat(productCostAmount) }])
      setProductCostName("''")
      setProductCostAmount("''")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">Registro de Costos</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-700">Costos Fijos de la Compañía</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addFixedCost} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fixedCostName" className="text-sm font-medium text-gray-700">Nombre del Costo Fijo</Label>
                  <Input
                    id="fixedCostName"
                    value={fixedCostName}
                    onChange={(e) => setFixedCostName(e.target.value)}
                    placeholder="Ej: Alquiler"
                    className="w-full px-3 py-2 border border-neutral-200 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fixedCostAmount" className="text-sm font-medium text-gray-700">Monto</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="fixedCostAmount"
                      type="number"
                      value={fixedCostAmount}
                      onChange={(e) => setFixedCostAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-3 py-2 border border-neutral-200 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-800"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                  <Plus className="mr-2 h-4 w-4" /> Agregar Costo Fijo
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-700">Costos del Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addProductCost} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="productCostName" className="text-sm font-medium text-gray-700">Nombre del Costo del Producto</Label>
                  <Input
                    id="productCostName"
                    value={productCostName}
                    onChange={(e) => setProductCostName(e.target.value)}
                    placeholder="Ej: Bolsa"
                    className="w-full px-3 py-2 border border-neutral-200 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productCostAmount" className="text-sm font-medium text-gray-700">Monto del Costo</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="productCostAmount"
                      type="number"
                      value={productCostAmount}
                      onChange={(e) => setProductCostAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-3 py-2 border border-neutral-200 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-800"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                  <Plus className="mr-2 h-4 w-4" /> Agregar Costo del Producto
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-12">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-700">Lista de Costos Fijos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Nombre</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fixedCosts.map((cost, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{cost.name}</TableCell>
                      <TableCell className="text-right">${cost.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-700">Lista de Costos del Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Nombre del Costo</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productCosts.map((cost, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{cost.costName}</TableCell>
                      <TableCell className="text-right">${cost.amount.toFixed(2)}</TableCell>
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
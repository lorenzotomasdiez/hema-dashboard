"use client"

import CompanyExpenseSection from "./company-expense"
import CostComponentsSection from "./cost-components"

export function CostRegistration() {


  return (
    <div className="min-h-screen dark:bg-neutral-900">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-12 text-center">Registro de Costos</h1>
        <div className="grid lg:grid-cols-2 gap-12">
          <CostComponentsSection />
          <CompanyExpenseSection />
        </div>
      </div>
    </div>
  )
}
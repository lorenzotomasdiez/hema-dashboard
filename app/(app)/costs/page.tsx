import CompanyExpenseSection from "@/components/sections/costs/company-expense";
import CostComponentsSection from "@/components/sections/costs/cost-components";

export default function CostsPage() {
  return (
    <div className="dark:bg-neutral-900">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-12 text-center">Costos</h1>
        <div className="grid lg:grid-cols-2 gap-12">
          <CostComponentsSection />
          <CompanyExpenseSection />
        </div>
      </div>
    </div>
  )
}

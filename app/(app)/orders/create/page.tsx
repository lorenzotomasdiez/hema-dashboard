import { CreateOrderForm } from "@/components/sections";

export default function CreateOrderPage() {
  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 md:py-10 px-4 sm:px-6">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Crear Nuevo Pedido</h1>
        <CreateOrderForm />
      </div>
    </div>
  )
}

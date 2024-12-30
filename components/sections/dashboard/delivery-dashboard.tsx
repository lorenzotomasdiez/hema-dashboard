import Link from 'next/link'
import { APP_PATH } from '@/config/path'

export default function DeliveryDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">
        Panel de Entregas en Construcción
      </h2>
      <p className="text-gray-600 mb-6">
        Estamos trabajando para traerte la mejor experiencia de gestión de entregas.
      </p>
      <Link 
        href={APP_PATH.protected.orders.confirmed}
        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Ir a Entregas
      </Link>
    </div>
  )
}

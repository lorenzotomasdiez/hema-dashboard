import Link from 'next/link'
import { BarChart, Package, DollarSign, Layers, ShoppingCart, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from '@/components/ui/ThemeToggle'
import { APP_PATH } from '@/config/path'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">PymePro</div>
          <div className="flex items-center gap-2">
            <Link href={APP_PATH.protected.dashboard.root}>Go to dashboard</Link>
            <ModeToggle />
          </div>
        </nav>
      </header>
      <main>
        {/* Sección Hero */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
              Gestiona Tu Negocio con Facilidad
            </h1>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
              Registra tu empresa, gestiona productos, rastrea pedidos y analiza tus ganancias, todo en un solo lugar.
            </p>
            <Button size="lg" className="animate-bounce">
              Comenzar
            </Button>
          </div>
        </section>

        {/* Sección de Características */}
        <section className="py-20 bg-gray-200 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Características Principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Package className="h-12 w-12 mb-4 text-primary dark:text-primary-dark" />}
                title="Gestión de Productos"
                description="Añade, edita y gestiona tu catálogo de productos con información detallada y precios."
              />
              <FeatureCard
                icon={<ShoppingCart className="h-12 w-12 mb-4 text-primary dark:text-primary-dark" />}
                title="Procesamiento de Pedidos"
                description="Optimiza tu proceso de gestión de pedidos desde la colocación hasta el cumplimiento."
              />
              <FeatureCard
                icon={<DollarSign className="h-12 w-12 mb-4 text-primary dark:text-primary-dark" />}
                title="Seguimiento de Costos"
                description="Mantén un registro de los costos de productos y gastos de la empresa para optimizar tu estrategia de precios."
              />
              <FeatureCard
                icon={<TrendingUp className="h-12 w-12 mb-4 text-primary dark:text-primary-dark" />}
                title="Análisis de Ganancias"
                description="Obtén información sobre tus ganancias reales con informes financieros completos."
              />
              <FeatureCard
                icon={<Layers className="h-12 w-12 mb-4 text-primary dark:text-primary-dark" />}
                title="Gestión de Inventario"
                description="Administra eficientemente los niveles de stock de tus productos y recibe alertas de bajo stock."
              />
              <FeatureCard
                icon={<BarChart className="h-12 w-12 mb-4 text-primary dark:text-primary-dark" />}
                title="Métricas de Rendimiento"
                description="Accede a indicadores clave de rendimiento para tomar decisiones empresariales basadas en datos."
              />
            </div>
          </div>
        </section>

        {/* Sección de Beneficios */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">¿Por qué elegir BusinessPro?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gray-100 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Operaciones Optimizadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">Simplifica tus procesos empresariales y aumenta la eficiencia con nuestra solución de gestión todo en uno.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-100 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Información Basada en Datos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">Toma decisiones informadas basadas en datos en tiempo real y análisis completos.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-100 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Rentable</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">Reduce los costos operativos centralizando la gestión de tu negocio en una plataforma potente.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-100 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Solución Escalable</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">Haz crecer tu negocio con un sistema flexible que se adapta a tus necesidades cambiantes.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Llamada a la Acción */}
        <section className="py-20 bg-primary dark:bg-primary-dark text-white text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">¿Listo para Transformar tu Negocio?</h2>
            <p className="text-xl mb-8">Únete a miles de empresas que ya utilizan BusinessPro para optimizar sus operaciones.</p>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
              Comienza tu Prueba Gratuita
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2023 BusinessPro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-white dark:bg-gray-800 transition-transform duration-300 hover:scale-105">
      <CardHeader>
        <CardTitle className="flex flex-col items-center text-gray-900 dark:text-white">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600 dark:text-gray-300">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
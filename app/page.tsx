import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { APP_PATH } from "@/config/path"
import { Snowflake, ThermometerSnowflake, Clock, Droplet } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Snowflake className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-gray-900">HemaIce</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href={APP_PATH.protected.dashboard.root}>
            <Button>
              Open dashboard
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-blue-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Mantén tus Bebidas Frías con HemaIce
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  Bolsas de hielo de alta calidad para mantener tus bebidas perfectamente frías en cualquier ocasión.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Comprar Ahora</Button>
                <Button variant="outline">Ver Tamaños</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">¿Por qué elegir HemaIce?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: ThermometerSnowflake, title: "Enfriamiento Duradero", description: "Nuestro hielo se derrite lentamente, manteniendo tus bebidas frías por más tiempo." },
                { icon: Clock, title: "Congelación Rápida", description: "Listo para usar en menos tiempo que el hielo tradicional." },
                { icon: Droplet, title: "Hielo Puro", description: "Fabricado con agua purificada para un sabor limpio y cristalino." },
                { icon: Snowflake, title: "Varios Tamaños", description: "Disponible en 2kg, 10kg y 15kg para adaptarse a tus necesidades." },
              ].map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-blue-600 mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="products" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Nuestros Productos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Bolsa de Hielo 2kg", description: "Ideal para pequeñas reuniones o enfriadores personales.", image: "/placeholder.svg?height=200&width=300" },
                { title: "Bolsa de Hielo 10kg", description: "Perfecta para fiestas medianas o eventos.", image: "/placeholder.svg?height=200&width=300" },
                { title: "Bolsa de Hielo 15kg", description: "La mejor opción para grandes eventos o uso comercial.", image: "/placeholder.svg?height=200&width=300" },
              ].map((product, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img src={product.image} alt={product.title} className="w-full h-48 object-cover mb-4 rounded-md" />
                    <CardDescription>{product.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  ¿Listo para Enfriar tus Bebidas?
                </h2>
                <p className="mx-auto max-w-[600px] text-blue-100 md:text-xl">
                  Contáctanos para pedidos al por mayor, entregas regulares o cualquier pregunta sobre nuestros productos.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">Contáctanos</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2023 HemaIce S.L. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Términos de Servicio
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  )
}
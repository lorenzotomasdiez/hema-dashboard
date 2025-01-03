import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_PATH } from "@/config/path";
import Link from "next/link";

export default function CostsPage() {
  return (
    <div className="dark:bg-neutral-900">
      <div className="max-w-screen-lg mx-auto p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-12 text-center lg:text-left">Costos</h1>
        <div className="flex flex-col gap-12">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-12 text-center lg:text-left">
              Costos por producto
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Link href={APP_PATH.protected.costs.products}>
                    <Button className="mt-4">
                      Ver los costos de los productos
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-12 text-center lg:text-left">
              Costos Generales
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>
                  Listado de los 5 costos más importantes de la empresa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Listado de los 5 costos más importantes de la empresa
                </p>
                <Link href={APP_PATH.protected.costs.general}>
                  <Button className="mt-4">
                    Ver todos los costos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

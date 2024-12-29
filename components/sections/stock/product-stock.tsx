"use client";

import Link from "next/link";
import AdjustStock from "./adjust-stock";
import { APP_PATH } from "@/config/path";
import { Button } from "@/components/ui/button";
import { useStockProduct } from "@/lib/tanstack/useStock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { StockMovementTypeSpanish } from "@/types/stock";

interface Props {
  productId: number;
}

export default function ProductStockSection({ productId }: Props) {
  const { data: product, isLoading } = useStockProduct({ productId })
  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>No data</div>;

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Detalles de Stock: <span className="text-green-500">{product.name}</span></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-center items-center gap-2">
            <p className="text-md font-medium text-center whitespace-nowrap">
              Stock Actual:
              {" "} 
              <span className="font-bold">{product.stock}</span>
              {" "}
              unidades
            </p>
          </div>
          {
            product.stockMovements && product.stockMovements.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo de Movimiento</TableHead>
                    <TableHead>Ajuste</TableHead>
                    <TableHead>Stock Actualizado</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Descripción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.stockMovements?.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{format(new Date(movement.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}</TableCell>
                      <TableCell>{StockMovementTypeSpanish[movement.movementType]}</TableCell>
                      <TableCell
                        className={movement.quantity > 0 ? "text-green-600" : "text-red-600"}
                      >
                        {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
                      </TableCell>
                      <TableCell>{movement.finalStock ?? "-"}</TableCell>
                      <TableCell>{movement.user?.name ?? "-"}</TableCell>
                      <TableCell>{movement.description ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex justify-center items-center py-5 w-full">
                <p className="text-lg font-semibold text-center text-gray-500">
                  No hay movimientos de stock
                </p>
              </div>
            )
          }
          <div className="my-6 grid grid-cols-1 gap-2 md:grid-cols-3">
            <AdjustStock product={product} />
          </div>
          <div className="my-6 flex justify-center items-center">
            <Link href={APP_PATH.protected.products.update(product.slug)} className="w-full max-w-xs">
              <Button variant="default" className="w-full max-w-xs">
                Volver a los detalles del producto
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

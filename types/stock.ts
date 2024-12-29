import { StockMovement } from "@prisma/client";
import { Product } from "./product";

export interface ProductWithStock extends Product {
  stockMovements: StockMovement[];
}

export enum StockMovementTypeSpanish {
  ADJUSTMENT = "Ajuste Manual",
  PRODUCTION = "Producción",
  PURCHASE = "Venta",
  RETURN = "Devolución",
}
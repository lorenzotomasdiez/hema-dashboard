import { StockMovement, StockMovementType } from "@prisma/client";
import { Product } from "./product";

export interface StockMovementWithUser extends StockMovement {
  user: {
    name: string;
  }
}

export interface ProductWithStock extends Product {
  stockMovements: StockMovementWithUser[];
}

export enum StockMovementTypeSpanish {
  ADJUSTMENT = "Ajuste Manual",
  PRODUCTION = "Producción",
  PURCHASE = "Venta",
  RETURN = "Devolución",
}

export interface CreateStockMovementProps {
  productId: number;
  companyId: string;
  movementValue: number;
  movementType: StockMovementType;
  description: string;
  userId: string;
  finalStock: number;
}
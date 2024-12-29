import { createProductSchema } from "@/dto/product/create-product.dto";
import { productSchema } from "@/prisma/zod";
import { CostComponent } from "@prisma/client";
import { z } from "zod";

export type CreateProductType = z.infer<typeof createProductSchema>;

export type Product = z.infer<typeof productSchema>;

export type ProductWithCostComponents = Product & {
  costComponents: CostComponent[];
};

export type ClientPrice = {
  clientId: string;
  price: number;
};

export type ProductCostComponent = {
  name: string;
  id: number;
  cost: number;
}

export type ProductComplete = Product & {
  costComponents: ProductCostComponent[];
  clientPrices: ClientPrice[];
};

export type UpdatedProductWithCostComponents = Product & {
  costComponents?: {
    name: string;
    id: number;
    cost: number;
  }[] | undefined;
};

import { createProductSchema } from "@/dto/product/create-product.dto";
import { productSchema } from "@/prisma/zod";
import { ProductCostComponent } from "@prisma/client";
import { z } from "zod";

export type CreateProductType = z.infer<typeof createProductSchema>;

export type Product = z.infer<typeof productSchema>;

export type ProductWithCostComponents = Product & {
  costComponents: ProductCostComponent[];
};

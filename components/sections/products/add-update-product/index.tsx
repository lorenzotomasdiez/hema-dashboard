"use client";
import { useQueryClient } from "@tanstack/react-query";
import { AddProductMutation, UpdateProductMutation, useProductBySlugQuery } from "@/lib/tanstack/useProducts";
import AddUpdateProductForm from "./form";

interface AddUpdateProductProps {
  slug?: string;
}

export default function AddUpdateProduct({
  slug,
}: AddUpdateProductProps) {

  const queryClient = useQueryClient();

  const { data: product, isLoading } = useProductBySlugQuery(slug || "");

  const addProductMutation = AddProductMutation(queryClient);

  const updateProductMutation = UpdateProductMutation(queryClient);

  if (slug && isLoading) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-4 max-w-screen-sm">
      <h1 className="text-2xl font-bold mb-4">
        {slug ? "Actualizar Producto" : "Agregar Producto"}
      </h1>
      {
        slug && product && (
          <AddUpdateProductForm
            product={product}
            addProductMutation={addProductMutation}
            updateProductMutation={updateProductMutation}
          />
        )
      }
      {
        slug && !product && (
          <div>No se encontró el producto</div>
        )
      }
      {
        !slug && (
          <AddUpdateProductForm
            addProductMutation={addProductMutation}
            updateProductMutation={updateProductMutation}
          />
        )
      }
    </div>
  )
}

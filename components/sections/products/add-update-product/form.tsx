"use client";
import { useEffect } from "react";
import { Decimal } from "decimal.js";
import { useForm } from "react-hook-form";

import { UseMutationResult } from "@tanstack/react-query";
import { RHFInput } from "@/components/rhf/rhf-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { CreateProductType, ProductComplete, UpdatedProductWithCostComponents } from "@/types";
import { generateSlug } from "@/lib/api/routes";

import { useRouter } from "next/navigation";
import { APP_PATH } from "@/config/path";
import CustomPricesSection from "./custom-prices";
import ProductCostsSection from "./product-costs";

interface AddUpdateProductFormProps {
  product?: ProductComplete;
  addProductMutation: UseMutationResult<any, unknown, CreateProductType, unknown>;
  updateProductMutation: UseMutationResult<any, unknown, UpdatedProductWithCostComponents, unknown>;
}

export default function AddUpdateProductForm({
  product,
  addProductMutation: addClientMutation,
  updateProductMutation: updateClientMutation
}: AddUpdateProductFormProps) {

  const router = useRouter();


  const form = useForm<CreateProductType>({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      stock: product?.stock || 0,
      slug: product?.slug || "",
      price: product?.price || 0,
      costComponents: product?.costComponents.map(e => ({
        ...e,
        cost: Number(e.cost)
      })) || [],
      clientPrices: product?.clientPrices || []
    }
  })

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
    reset,
    watch,
    setValue,
  } = form;

  useEffect(() => {
    setValue('slug', generateSlug(watch('name')));
  }, [watch('name'), setValue]);


  const onSubmit = async (data: CreateProductType) => {
    if (product) {
      const updatedProduct = {
        ...product,
        ...data,
        costComponents: data.costComponents?.map(component => ({
          ...component
        })) || []
      };
      updateClientMutation.mutateAsync(updatedProduct);
    } else {
      addClientMutation.mutateAsync(data);
      reset();
    }
    router.push(APP_PATH.protected.products.root);
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-black dark:text-white">
              Nombre
            </Label>
            <RHFInput
              name="name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-black dark:text-white">
              Descripción
            </Label>
            <RHFInput
              name="description"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right text-black dark:text-white">
              Stock
            </Label>
            <RHFInput
              name="stock"
              type="number"
              className="col-span-3"
              disabled={!!product}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right text-black dark:text-white">
              Precio
            </Label>
            <RHFInput
              name="price"
              type="number"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="text-right text-black dark:text-white">
              Slug
            </Label>
            <RHFInput
              name="slug"
              className="col-span-3"
            />
          </div>
        </div>
        <div className="border-t border-gray-300 my-4" />

        <ProductCostsSection />


        <CustomPricesSection />

        <div className="grid grid-cols-1 mt-10">
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="dark:bg-neutral-700 dark:text-white"
          >
            {product ? "Actualizar Producto" : "Agregar Producto"}
          </Button>
        </div>
        {
          errors && Object.values(errors).map(error => (
            <div className="text-red-500 text-sm" key={error.message}>
              {error.message}
            </div>
          ))
        }
      </form>
    </Form>
  )
}

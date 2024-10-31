"use client";
import { useEffect } from "react";
import { Decimal } from "decimal.js";
import { useForm } from "react-hook-form";
import { CostComponent, ProductCostComponent } from "@prisma/client";
import { UseMutationResult } from "@tanstack/react-query";
import { RHFInput } from "@/components/rhf/rhf-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { CreateProductType, ProductWithCostComponents } from "@/types";
import { generateSlug } from "@/lib/api/routes";
import { cn, moneyMask } from "@/lib/utils";
import { Trash } from 'lucide-react';
import { useRouter } from "next/navigation";
import { APP_PATH } from "@/config/path";

interface AddUpdateProductFormProps {
  product?: ProductWithCostComponents;
  addProductMutation: UseMutationResult<any, unknown, CreateProductType, unknown>;
  updateProductMutation: UseMutationResult<any, unknown, ProductWithCostComponents, unknown>;
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
    }
  })


  const {
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
    reset,
    watch,
    setValue,
  } = form;


  const costComponents = watch('costComponents');

  const price = watch('price');

  useEffect(() => {
    setValue('slug', generateSlug(watch('name')));
  }, [watch('name'), setValue]);

  const handleAddCostComponent = (cost: CostComponent) => {
    const newCost = {
      ...cost,
      cost: typeof cost.cost === 'number' ? cost.cost : Number(cost.cost)
    };
    setValue('costComponents', [...(costComponents || []), newCost], { shouldValidate: true, shouldDirty: true });
  }

  const handleDeleteCostComponent = (index: number) => {
    setValue('costComponents', costComponents?.filter((_, i) => i !== index) || [], { shouldValidate: true, shouldDirty: true });
  }


  const onSubmit = async (data: CreateProductType) => {
    if (product) {
      const updatedProduct = {
        ...product,
        ...data,
        costComponents: data.costComponents?.map(component => ({
          ...component,
          cost: new Decimal(component.cost)
        })) || []
      };
      updateClientMutation.mutateAsync(updatedProduct);
    } else {
      addClientMutation.mutateAsync(data);
      reset();
    }
    router.push(APP_PATH.protected.products.root);
  }

  const calculateProfitMargin = () => {
    const totalCost = costComponents?.reduce((acc, component) => acc.plus(component.cost), new Decimal(0)) || new Decimal(0);
    return price - Number(totalCost);
  }

  const profitMargin = calculateProfitMargin();

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
        {
          costComponents && costComponents.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="costComponents" className="text-center text-black dark:text-white col-span-4 text-lg font-medium">
                Costos de Produccion
              </Label>
              <div className="col-span-4">
                <div className="flex flex-col gap-4">
                  {
                    costComponents?.map((component, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border border-gray-300 rounded-lg shadow-sm">
                        <span className="font-medium text-gray-800 dark:text-white">{component?.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 dark:text-gray-400">{moneyMask(component?.cost)}</span>
                          <Button
                            onClick={() => handleDeleteCostComponent(index)}
                            type="button"
                            size="sm"
                            variant="ghost"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )
        }
        {/* // here the costs component selector will be added */}

        <div className="border-t border-gray-300 my-4" />
        <div className="flex justify-between items-center border border-gray-300 rounded-lg shadow-sm p-4">
          <Label htmlFor="profitMargin" className="text-right text-black dark:text-white">
            Margen de Ganancia
          </Label>
          <span className={cn(
            "text-md font-medium",
            profitMargin > 0 ? "text-green-500" : "text-red-500"
          )}
          >
            {moneyMask(profitMargin)}
          </span>
        </div>
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
            <div className="text-red-500 text-sm">
              {error.message}
            </div>
          ))
        }
      </form>
    </Form>
  )
}

"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, CreateProductType } from "@/types/product";
import { createProduct, updateProduct } from "@/services/products";
import { Input } from "@/components/ui/input";
import { generateSlug } from "@/lib/api/routes";
import { useEffect } from "react";
import { QUERY_KEYS } from "@/lib/tanstack";

interface AddUpdateClientProps {
  product?: Product;
  queryKey: readonly string[];
  open: boolean;
  setOpen: (open: number | null) => void;
}

export default function AddUpdateProduct({ product, queryKey, open, setOpen }: AddUpdateClientProps) {
  const queryClient = useQueryClient();

  const addClientMutation = useMutation({
    mutationKey: ["addClient"],
    mutationFn: (productData: CreateProductType) => createProduct({
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
    }),
    onMutate: async (productData: CreateProductType) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previousProducts = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: CreateProductType[]) => [{ ...productData, ordersTotal: 0, id: new Date().getTime() }, ...old]);
      return { previousProducts }
    },
    onSuccess: () => {
      toast.success("Producto creado correctamente!");
    },
    onError: (err, _client, context) => {
      queryClient.setQueryData(queryKey, context?.previousProducts)
      toast.error("Error al agregar el producto");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.root });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.summary });
    }
  })

  const updateClientMutation = useMutation({
    mutationKey: ["updateClient"],
    mutationFn: (product: Product) => updateProduct(product.id, {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
    }),
    onMutate: async (productData: Product) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previousProducts = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Product[]) => old.map(o => o.id === productData.id ? productData : o));
      return { previousProducts }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Producto actualizado correctamente!");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Error al actualizar el producto");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.root });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.summary });
    }
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<CreateProductType>({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      stock: product?.stock || 0,
      slug: product?.slug || "",
      price: product?.price || 0,
    }
  })

  useEffect(() => {
    setValue('slug', generateSlug(watch('name')));
  }, [watch('name'), setValue]);

  const onSubmit = async (data: CreateProductType) => {
    setOpen(null);
    if (product) {
      updateClientMutation.mutateAsync({ ...product, ...data }).then(() => {
      });
    } else {
      addClientMutation.mutateAsync(data).then((res) => {
        if (!res.success) {
          console.error(res);
          return;
        }
        toast.success("Producto creado correctamente!");
      });
    }
    reset();
  }

  return (
    <Dialog open={!!open} onOpenChange={(e) => setOpen(!!e ? (product?.id || 0) : null)}>
      <DialogTrigger hidden={!!product}>
        <Button className="dark:bg-neutral-700 dark:text-white">Agregar Producto</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-neutral-900">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">{product ? "Actualizar Producto" : "Agregar Producto"}</DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-muted-foreground">
              {product
                ? "Actualiza los detalles del producto. Click en 'Actualizar' cuando hayas terminado."
                : "Completa los detalles para el nuevo producto. Click en 'Agregar' cuando hayas terminado."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-black dark:text-white">
                Nombre
              </Label>
              <Input
                id="name"
                {...register('name')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-black dark:text-white">
                Descripción
              </Label>
              <Input
                id="description"
                {...register('description')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right text-black dark:text-white">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                {...register('stock')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right text-black dark:text-white">
                Precio
              </Label>
              <Input
                id="price"
                type="number"
                {...register('price')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right text-black dark:text-white">
                Slug
              </Label>
              <Input
                id="slug"
                {...register('slug')}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 mt-10">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="dark:bg-neutral-700 dark:text-white"
            >
              {product ? "Actualizar Producto" : "Agregar Producto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
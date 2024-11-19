import { useMutation, useQuery, QueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "./queryKeys";
import { createProduct, getProductBySlug, getProductCompleteBySlug, getProducts, updateProduct } from "@/services/products";
import { CreateProductType, ProductComplete, ProductWithCostComponents, UpdatedProductWithCostComponents } from "@/types";
import { toast } from "sonner";

export const useProductBySlugQuery = (slug: string) => {
  return useQuery<ProductWithCostComponents>({
    queryKey: [QUERY_KEYS.products.bySlug, slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60
  });
}

export const useProductCompleteBySlugQuery = (slug: string) => {
  return useQuery<ProductComplete>({
    queryKey: [QUERY_KEYS.products.completeBySlug, slug],
    queryFn: () => getProductCompleteBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60
  });
}

export const prefetchProductBySlug = (slug: string, queryClient: QueryClient) => {
  return queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.products.bySlug, slug],
    queryFn: () => getProductBySlug(slug),
    staleTime: 1000 * 60
  });
}

export const useProductsQuery = () => {
  return useQuery<ProductWithCostComponents[]>({
    queryKey: QUERY_KEYS.products.root,
    queryFn: getProducts,
    staleTime: 1000 * 60
  })
}

export const AddProductMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["addProduct"],
    mutationFn: (productData: CreateProductType) => createProduct({
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
    }),
    onMutate: async (productData: CreateProductType) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.products.root });
      const previousProducts = queryClient.getQueryData(QUERY_KEYS.products.root);
      queryClient.setQueryData(
        QUERY_KEYS.products.root,
        (old: CreateProductType[]) => old
          ? [{ ...productData, ordersTotal: 0, id: new Date().getTime() }, ...old]
          : [{ ...productData, ordersTotal: 0, id: new Date().getTime() }]
      );
      return { previousProducts }
    },
    onSuccess: () => {
      toast.success("Producto creado correctamente!");
    },
    onError: (err, _client, context) => {
      queryClient.setQueryData(QUERY_KEYS.products.root, context?.previousProducts)
      toast.error("Error al agregar el producto", {
        description: err.message
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.root });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.summary });
    }
  })
}

export const UpdateProductMutation = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: (product: UpdatedProductWithCostComponents) => updateProduct(product.id, {
      ...product,
      price: Number(product.price),
    }),
    onMutate: async (productData: UpdatedProductWithCostComponents) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.products.root });
      const previousProducts = queryClient.getQueryData(QUERY_KEYS.products.root);
      queryClient.setQueryData(QUERY_KEYS.products.root,
        (old: UpdatedProductWithCostComponents[]) => old?.map(o => o.id === productData.id ? productData : o)
      );
      return { previousProducts }
    },
    onSuccess: () => {
      toast.success("Producto actualizado correctamente!");
    },
    onError: (err, _client, context) => {
      queryClient.setQueryData(QUERY_KEYS.products.root, context?.previousProducts)
      toast.error("Error al actualizar el producto", {
        description: err.message
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.root });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.summary });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.bySlug(variables.slug) });
    }
  })
}
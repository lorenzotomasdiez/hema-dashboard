import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/services/products";
import { useState } from "react";
import { Product } from "@/types";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  productId: number | null;
  setOpen: (open: number | null) => void;
  queryKey: QueryKey;
}

export default function ProductsDeleteConfirmation({ productId, setOpen, queryKey }: Props) {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState("");
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previousProducts = queryClient.getQueryData<Product[]>(queryKey);
      queryClient.setQueryData(queryKey, previousProducts?.filter((product) => product.id !== id));
      return { previousProducts };
    },
    onSuccess: () => {
      toast.success("Producto eliminado correctamente");
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousProducts);
      toast.error("Error al eliminar el producto");
    }
  })

  const handleDelete = () => {
    deleteProductMutation.mutate(Number(productId));
    setOpen(null);
    setInputValue("");
  }

  return (
    <Dialog open={!!productId} onOpenChange={() => setOpen(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Producto</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el producto de cualqueir pedido.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">Para confirmar, escriba <span className="font-bold text-destructive">&quot;OK&quot;</span> en el campo de abajo</p>
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escriba 'OK' para confirmar"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(null)}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} disabled={inputValue !== "OK"}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
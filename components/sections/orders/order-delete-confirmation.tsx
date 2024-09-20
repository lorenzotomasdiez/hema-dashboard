import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CompleteOrderProduct } from "@/prisma/zod";
import { deleteOrder } from "@/services/orders";
import { Order } from "@/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface OrderDeleteConfirmationProps {
    orderId: number | null;
    setOpen: (open: number | null) => void;
    queryKey: QueryKey;
}

export default function OrderDeleteConfirmation({ orderId, setOpen, queryKey }: OrderDeleteConfirmationProps) {
  const [inputValue, setInputValue] = useState("");
  const queryClient = useQueryClient();
  const deleteOrderMutation = useMutation({
    mutationKey: ['delete-order'],
    mutationFn: (id: number) => deleteOrder(id),
    onMutate: async (id: number) => {
        await queryClient.cancelQueries({ queryKey });
        const previousOrders = queryClient.getQueryData<(Order & {products: CompleteOrderProduct[]})[]>(queryKey);
        queryClient.setQueryData(queryKey, previousOrders?.filter((order) => order.id !== id));
        return { previousOrders };
    },
    onSuccess: () => {
        toast.success("Pedido eliminado correctamente");
    },
    onError: (error, variables, context) => {
        queryClient.setQueryData(queryKey, context?.previousOrders);
        toast.error("Error al eliminar el pedido");
    },

  });

  const handleDelete = () => {
    deleteOrderMutation.mutate(orderId as number);
    setOpen(null);
    setInputValue("");
  }

  return (
    <Dialog open={!!orderId} onOpenChange={() => setOpen(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Eliminar Pedido</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Esta acción no se puede deshacer. Esto eliminará permanentemente el pedido y todos los datos asociados.
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
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={inputValue !== "OK"}
          >
            Eliminar Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
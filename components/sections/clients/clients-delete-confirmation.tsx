import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteClient } from "@/services/clients";
import { Client } from "@/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface ClientsDeleteConfirmationProps {
  clientId: string | null;
  setOpen: (open: string | null) => void;
  queryKey: QueryKey;
}

export default function ClientsDeleteConfirmation({ clientId, setOpen, queryKey }: ClientsDeleteConfirmationProps) {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState("");
  const deleteClientMutation = useMutation({
    mutationKey: ['delete-client'],
    mutationFn: (id: string) => deleteClient(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previousClients = queryClient.getQueryData<(Client & { ordersTotal: number })[]>(queryKey);
      queryClient.setQueryData(queryKey, previousClients?.filter((client) => client.id !== id));
      return { previousClients };
    },
    onSuccess: () => {
      toast.success("Cliente eliminado correctamente");
    },
    onError: (_, __, context) => {
      toast.error("Error al eliminar el cliente");
      queryClient.setQueryData(queryKey, context?.previousClients);
    }
  });

  const handleDelete = () => {
    deleteClientMutation.mutate(clientId as string);
    setOpen(null);
    setInputValue("");
  }

  return (
    <Dialog open={!!clientId} onOpenChange={() => setOpen(null)}>
      <DialogContent className="sm:max-w-[425px] dark:bg-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Eliminar Cliente</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente y todos los
            {" "}
            <span className="font-bold text-destructive dark:text-red-500">pedidos</span>
            {" "}
            asociados.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">Para confirmar, escriba <span className="font-bold text-destructive dark:text-red-500">&quot;OK&quot;</span> en el campo de abajo</p>
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
          <Button
            variant="outline"
            onClick={() => setOpen(null)}
            className="dark:bg-neutral-700 dark:text-white"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={inputValue.toLowerCase() !== "ok"}
            className="dark:bg-red-500 dark:text-white"
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
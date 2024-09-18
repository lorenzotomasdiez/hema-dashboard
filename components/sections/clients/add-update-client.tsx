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
import { Client, CreateClientType } from "@/types/client";
import { createClient, updateClient } from "@/services/clients";
import { Input } from "@/components/ui/input";

interface AddUpdateClientProps {
  client?: Client & { ordersTotal: number };
  queryKey: (string | number)[];
  open: boolean;
  setOpen: (open: string | null) => void;
}

export default function AddUpdateClient({ client, queryKey, open, setOpen }: AddUpdateClientProps) {
  const queryClient = useQueryClient();

  const addClientMutation = useMutation({
    mutationKey: ["addClient"],
    mutationFn: (clientData: CreateClientType) => createClient(clientData),
    onMutate: async (clientData: CreateClientType) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previousClients = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: CreateClientType[]) => [{ ...clientData, ordersTotal: 0}, ...old]);
      return { previousClients }
    },
    onSuccess: () => {
      toast.success("Cliente creado correctamente!");
    },
    onError: (err, _client, context) => {
      queryClient.setQueryData(queryKey, context?.previousClients)
      toast.error("Error al agregar el cliente");
    }
  })

  const updateClientMutation = useMutation({
    mutationKey: ["updateClient"],
    mutationFn: (clientData: Client) => updateClient(clientData.id, {
      ...clientData,
    }),
    onMutate: async (clientData: Client) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previousClients = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Client[]) => old.map(o => o.id === clientData.id ? clientData : o));
      return { previousClients }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success("Cliente actualizado correctamente!");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Error al actualizar el cliente");
    }
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateClientType>({
    defaultValues: {
      name: client?.name || "",
      phone: client?.phone || "",
      address: client?.address || "",
    }
  })

  const onSubmit = async (data: CreateClientType) => {
    setOpen(null);
    if (client) {
      updateClientMutation.mutateAsync({ ...client, ...data }).then(() => {
      });
    } else {
      addClientMutation.mutateAsync(data).then((res) => {
        if (!res.success) {
          console.error(res);
          return;
        }
        toast.success("Cliente creado correctamente!");
        reset();
      });
    }
  }

  return (
    <Dialog open={!!open} onOpenChange={(e) => setOpen(!!e ? (client?.id || "new") : null)}>
      <DialogTrigger hidden={!!client}>
        <Button>Agregar Cliente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{client ? "Actualizar Cliente" : "Agregar Cliente"}</DialogTitle>
            <DialogDescription>
              {client
                ? "Actualiza los detalles del cliente. Click en 'Actualizar' cuando hayas terminado."
                : "Completa los detalles para el nuevo cliente. Click en 'Agregar' cuando hayas terminado."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                {...register('name')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Teléfono
              </Label>
              <Input
                id="phone"
                {...register('phone')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Dirección
              </Label>
              <Input
                id="address"
                {...register('address')}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 mt-10">
            <Button type="submit" disabled={isSubmitting}>
              {client ? "Actualizar Cliente" : "Agregar Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
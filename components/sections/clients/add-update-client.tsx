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
import { Client, CreateClientType } from "@/types/client";
import { Input } from "@/components/ui/input";
import { AddClientMutation, UpdateClientMutation } from "@/lib/tanstack/useClients";
import { useQueryClient } from "@tanstack/react-query";

interface AddUpdateClientProps {
  client?: Client & { ordersTotal: number };
  queryKey: readonly string[];
  open: boolean;
  setOpen: (open: string | null) => void;
}

export default function AddUpdateClient({ client, queryKey, open, setOpen }: AddUpdateClientProps) {
  const queryClient = useQueryClient();
  const addClient = AddClientMutation(queryKey, queryClient);
  const updateClient = UpdateClientMutation(queryKey, queryClient);

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
      updateClient.mutate({ ...client, ...data })
    } else {
      addClient.mutateAsync(data).then((res) => {
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
      <DialogContent className="sm:max-w-[425px] dark:bg-neutral-900">
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="dark:bg-neutral-700 dark:text-white"
            >
              {client ? "Actualizar Cliente" : "Agregar Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
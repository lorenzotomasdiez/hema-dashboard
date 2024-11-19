"use client";

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
import { AddClientMutation, UpdateClientMutation } from "@/lib/tanstack/useClients";
import { useQueryClient } from "@tanstack/react-query";
import { RHFInput } from "@/components/rhf/rhf-input";
import { Form } from "@/components/ui/form";
import { replaceEmptyStringsWithUndefined } from "@/lib/utils";

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

  const form = useForm<CreateClientType>({
    defaultValues: {
      name: client?.name ?? "",
      phone: client?.phone ?? "",
      email: client?.email ?? "",
      address: client?.address ?? "",
      city: client?.city ?? "",
    }
  })

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
    reset,
    watch
  } = form;

  const isNameEmpty = watch("name") === "";

  const onSubmit = async (data: CreateClientType) => {
    setOpen(null);
    if (client) {
      updateClient.mutate(replaceEmptyStringsWithUndefined({ ...client, ...data }))
    } else {
      addClient.mutate(replaceEmptyStringsWithUndefined(data))
    }
    reset();
  }

  return (
    <Dialog open={!!open} onOpenChange={(e) => setOpen(!!e ? (client?.id || "new") : null)}>
      <DialogTrigger hidden={!!client} asChild>
        <Button>Agregar Cliente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-neutral-900">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{client ? "Actualizar Cliente" : "Agregar Cliente"}</DialogTitle>
              <DialogDescription>
                {client
                  ? "Actualiza los detalles del cliente. Click en 'Actualizar' cuando hayas terminado."
                  : "Completa los detalles para el nuevo cliente. Click en 'Agregar' cuando hayas terminado."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 pt-4 pb-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <RHFInput
                  name="name"
                  className="col-span-3"
                  placeholder="Nombre del cliente"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Teléfono
                </Label>
                <RHFInput
                  name="phone"
                  className="col-span-3"
                  placeholder="Teléfono"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <RHFInput
                  name="email"
                  className="col-span-3"
                  placeholder="Email"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  Ciudad
                </Label>
                <RHFInput
                  name="city"
                  className="col-span-3"
                  placeholder="Ciudad"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Dirección
                </Label>
                <RHFInput
                  name="address"
                  className="col-span-3"
                  placeholder="Dirección"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 mt-5">
              <Button
                type="submit"
                disabled={isSubmitting || isNameEmpty || !isDirty}
                className="dark:bg-neutral-700 dark:text-white"
              >
                {client ? "Actualizar Cliente" : "Agregar Cliente"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
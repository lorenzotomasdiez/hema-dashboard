"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { CreateCompanyDTO, createCompanySchema } from "@/types/company"
import { zodResolver } from "@hookform/resolvers/zod"
import { RHFInput } from "@/components/rhf/rhf-input"
import { Form } from "@/components/ui/form"
import { CompanyAddMutation } from "@/lib/tanstack"
import { useQueryClient } from "@tanstack/react-query"

export default function AddNewCompanyForm({ disabled }: { disabled: boolean }) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const form = useForm<CreateCompanyDTO>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
    }
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  const companyMutation = CompanyAddMutation({
    queryClient: queryClient,
    onSuccess: () => {
      form.reset()
      setOpen(false)
    },
    onError: (error) => {
      setOpen(false)
    }
  })

  const onSubmit = async (data: CreateCompanyDTO) => {
    await companyMutation.mutateAsync(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full max-w-xs" disabled={disabled}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar nueva organización
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar nueva organización</DialogTitle>
          <DialogDescription>
            Ingresa los detalles de la nueva organización aquí. Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right col-span-1">
                  Nombre
                </Label>
                <RHFInput name="name" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Crear organización
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
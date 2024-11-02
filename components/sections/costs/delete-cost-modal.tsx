import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { DeleteCostComponentMutation, DisableCostComponentMutation } from "@/lib/tanstack";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react"
import { useState } from "react";


export default function DeleteCostModal({ costComponentId }: { costComponentId: number }) {
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();
  const deleteCostComponentMutation = DeleteCostComponentMutation(queryClient);
  const disableCostComponentMutation = DisableCostComponentMutation(queryClient);
  const handleDeleteCost = () => {
    deleteCostComponentMutation.mutate(costComponentId);
    setInput("");
  }
  const handleDisableCost = () => {
    disableCostComponentMutation.mutate(costComponentId);
    setInput("");
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="dark:hover:bg-neutral-700"
        >
          <Trash className="w-4 h-4 dark:text-gray-200" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Este proceso es irreversible</AlertDialogTitle>
          <AlertDialogDescription>
            Si desea deshabilitar el costo ingrese {" "}
            <span className="text-red-500">
              "Deshabilitar"
            </span>
            <br />
            El costo sera tenido en cuenta en las operaciones anteriores pero no en las futuras.
            <br />
            <br />
            Si desea eliminar el costo para futuras operaciones, ingrese {" "}
            <span className="text-red-500">
              "Eliminar"
            </span>
            <br />
            El costo sera eliminado permanentemente y no sera tenido en cuenta en las anteriores y futuras operaciones.
            <br />
            <br />
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Eliminar / Deshabilitar"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="space-y-2 sm:space-y-0">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteCost} disabled={input.toLowerCase() !== "eliminar"}>Eliminar</AlertDialogAction>
          <AlertDialogAction onClick={handleDisableCost} disabled={input.toLowerCase() !== "deshabilitar"}>Deshabilitar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
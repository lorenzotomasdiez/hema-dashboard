import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
interface Props {
  isInviteModalOpen: boolean;
  setIsInviteModalOpen: (isOpen: boolean) => void;
}
export function CompanyInviteUser({ isInviteModalOpen, setIsInviteModalOpen }: Props) {
  return (
    <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen} >
      <DialogTrigger asChild disabled>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Invitar Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invitar Usuario</DialogTitle>
          <DialogDescription>
            Ingresa el email del usuario que deseas invitar a la organizacion.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit">Enviar Invitacion</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
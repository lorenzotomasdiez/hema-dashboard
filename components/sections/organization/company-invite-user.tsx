"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { inviteUser } from "@/services/invitations";
import { UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
interface Props {
  isInviteModalOpen: boolean;
  setIsInviteModalOpen: (isOpen: boolean) => void;
}
export function CompanyInviteUser({ isInviteModalOpen, setIsInviteModalOpen }: Props) {
  const [email, setEmail] = useState('');
  const handleInvite = async () => {
    const res = await inviteUser(email, "COMPANY_WORKER");
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Invitacion enviada correctamente");
    }
    setIsInviteModalOpen(false);
  }

  useEffect(() => {
    return () => {
      setEmail('');
    }
  }, []);
  
  return (
    <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen} >
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Invitar Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invitar Usuario</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-2">
              <p>Ingresa el email del usuario que deseas invitar a la organizacion.</p>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={handleInvite}>Enviar Invitacion</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
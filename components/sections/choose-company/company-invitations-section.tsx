"use client";

import { useInvitations } from "@/lib/tanstack/useInvitations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Check, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AppLogoLoader from "@/components/AppLogoLoader";
import { acceptInvitation } from "@/services/invitations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function CompanyInvitationsSection() {
  const queryClient = useQueryClient();
  const [isAcceptingInvitation, setIsAcceptingInvitation] = useState(false);  
  const { data, isLoading, error } = useInvitations();
  
  const handleAcceptInvitation = async (invitationId: string) => {
    const res = await acceptInvitation(invitationId);
    if(!res.success){
      toast.error(res.error);
      setIsAcceptingInvitation(false);
      return;
    }
    toast.success(res.message);
    await queryClient.invalidateQueries({ queryKey: ["invitations"] });
    await queryClient.invalidateQueries({ queryKey: ["companies"] });
    setIsAcceptingInvitation(false);
  }

  if(isAcceptingInvitation){
    return <AppLogoLoader />
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">
            <Skeleton className="h-8 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Ha ocurrido un error al cargar las invitaciones. Por favor, intenta nuevamente.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data?.length) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No tienes invitaciones pendientes</h3>
          <p className="text-sm text-muted-foreground">
            Cuando recibas una invitación para unirte a una empresa, aparecerá aquí.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Invitaciones pendientes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((invitation) => (
          <Card key={invitation.id} className="hover:bg-accent/50 transition-colors">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h4 className="font-medium">{invitation.company.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Rol: {invitation.role}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleAcceptInvitation(invitation.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Aceptar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

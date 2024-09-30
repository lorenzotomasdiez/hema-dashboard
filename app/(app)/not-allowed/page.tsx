"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { APP_PATH } from "@/config/path";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NotAllowedPage() {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()
  const handleGoBack = () => {
    setIsRedirecting(true)
    router.push(APP_PATH.protected.orders)
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            No tienes los permisos necesarios para acceder a este dashboard.
          </AlertDescription>
        </Alert>
        <Button className="w-full" variant="outline" onClick={handleGoBack} disabled={isRedirecting}>
          {
            isRedirecting ? "Redireccionando..." : "Volver"
          }
        </Button>
      </div>
    </div>
  )
}
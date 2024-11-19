"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NotAllowedPage() {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()
  
  const handleGoBack = () => {
    setIsRedirecting(true)
    router.back()
  }
  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CardHeader>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <Alert variant="destructive" className="border-red-500/50">
            <AlertTitle className="text-lg font-semibold">
              Acceso Denegado
            </AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              No tienes los permisos necesarios para acceder a esta Pagina.
              Por favor, contacta al administrador si crees que esto es un error.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            variant="outline"
            onClick={handleGoBack}
            disabled={isRedirecting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isRedirecting ? "Redireccionando..." : "Volver"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
"use client"

import { signOut } from "next-auth/react";
import { APP_PATH } from "@/config/path";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export const SignOut = () => {
  return (
    <Button
      variant="ghost"
      onClick={() => signOut({ callbackUrl: APP_PATH.public.landing })}
      className="p-2 border bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-600 grid grid-cols-6 gap-1"
    >
      <LogOut className="col-span-1" size={15} />
      <span className="col-span-5 text-left text-sm">Cerrar sesión</span>
    </Button>
  )
}
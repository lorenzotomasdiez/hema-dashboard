"use client"

import { Building } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { APP_PATH } from "@/config/path";
import { useSession } from "next-auth/react";

export const ChooseCompanySelection = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const handleRemoveSelectedCompany = async () => {
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        selectedCompany: null
      }
    }
    await update(newSession);
    router.push(APP_PATH.protected.chooseCompany);
  }
  return (
    <Button
      variant="ghost"
      className="p-2 border bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-600 grid grid-cols-6 gap-1"
      onClick={handleRemoveSelectedCompany}
    >
      <Building className="col-span-1" size={15} />
      <span className="col-span-5 text-left text-sm">Cambiar organización</span>
    </Button>
  )
};
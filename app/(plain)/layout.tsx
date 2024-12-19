import { checkAuth } from "@/lib/auth/utils";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/lib/auth/Provider";
import TanstackProvider from "@/lib/tanstack-provider";
import { Viewport } from "next";
import { SignOut } from "@/components/signout";
import { HorizontalLogoPymePro } from "@/components/ui/logo";

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
  viewportFit: 'cover',
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();

  return (
    <main>
      <NextAuthProvider>
        <TanstackProvider>
          <div className="flex flex-col h-screen">
            <header className="grid grid-cols-3 items-center p-4">
              <div className="col-span-1" />
              <div className="col-span-1 flex flex-row items-center justify-center">
                <HorizontalLogoPymePro />
              </div>
              <div className="col-span-1 flex flex-row items-center justify-end">
                <SignOut />
              </div>
            </header>
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </TanstackProvider>
      </NextAuthProvider>
      <Toaster richColors />
    </main>
  )
}
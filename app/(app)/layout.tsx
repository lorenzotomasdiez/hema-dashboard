import { checkAuth } from "@/lib/auth/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import NextAuthProvider from "@/lib/auth/Provider";
import TanstackProvider from "@/lib/tanstack-provider";
import { Viewport } from "next";

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
          <div className="flex min-h-screen h-full">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <Navbar />
              {children}
            </main>
          </div>
        </TanstackProvider>
      </NextAuthProvider>
      <Toaster richColors />
    </main>
  )
}
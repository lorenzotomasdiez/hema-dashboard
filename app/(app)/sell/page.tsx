import { SellForm } from "@/components/sections/sell";
import { getUserAuth } from "@/lib/auth/utils";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SellPage() {
  const { session } = await getUserAuth();
  if(!session || !session.user.selectedCompany) throw new Error("Not authenticated");
  const selectedCompany = session?.user.selectedCompany;
  return (
    <main className="min-h-screen">
      <div className="w-full max-w-xl rounded-lg border border-foreground/10 py-4 px-6 mx-auto lg:mt-10 lg:py-10">
        <h1 className="text-3xl font-bold mb-3 text-center text-gray-800">
          {selectedCompany.name}
        </h1>
        <SellForm />
      </div>
    </main>
  );
}
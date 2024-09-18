
import { ClientsTable } from "@/components/sections";

export default async function Home() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <ClientsTable />
    </div>
  );
}
import { OrdersTable } from "@/components/sections";

export default async function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <OrdersTable />
    </div>
  );
}

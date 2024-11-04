import UpdateOrderForm from "@/components/sections/orders/update-order-form";
import { getUserAuth } from "@/lib/auth/utils";
import { APIOrderService } from "@/services/api";
import { notFound } from "next/navigation";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { session } = await getUserAuth();
  if (!session?.user) return notFound();
  if (!session.user.selectedCompany) return notFound();

  const orderId = Number(params.id);
  // TO DO: Determinate user role to show the details or the update form

  const order = await APIOrderService.getOrderById(orderId, session.user.selectedCompany?.id);

  if (!order) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 md:py-10 px-4 sm:px-6">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Pedido #{orderId}</h1>
        <UpdateOrderForm order={order} />
      </div>
    </div>
  )
}

import UpdateOrderForm from "@/components/sections/orders/update-order-form";
import { OrderDetailsView } from "@/components/sections/orders/order-details-view";
import { getUserAuth } from "@/lib/auth/utils";
import { APIOrderService } from "@/services/api";
import { notFound } from "next/navigation";
import { UserRole } from "@prisma/client";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { session } = await getUserAuth();
  if (!session?.user) return notFound();
  if (!session.user.selectedCompany) return notFound();

  const selectedCompany = session.user.selectedCompany;

  const orderId = Number(params.id);
  const adminRoles = [UserRole.ADMIN, UserRole.COMPANY_ADMIN, UserRole.COMPANY_OWNER] as const;
  const isAdmin = adminRoles.includes(selectedCompany.role as typeof adminRoles[number]);

  const order = await APIOrderService.getOrderById(orderId, session.user.selectedCompany?.id);

  if (!order) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 md:py-10 px-4 sm:px-6">
      <div className="bg-white dark:bg-muted rounded-lg shadow dark:shadow-muted/10 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 dark:text-foreground">
          Pedido #{orderId}
        </h1>
        {isAdmin ? (
          <UpdateOrderForm order={order} />
        ) : (
          <OrderDetailsView order={order} />
        )}
      </div>
    </div>
  );
}

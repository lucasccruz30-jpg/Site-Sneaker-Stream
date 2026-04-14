import { OrderStatusInlineForm } from "@/components/admin/admin-client";
import { formatCurrency, formatDateBR, orderStatusLabel, paymentMethodLabel, paymentStatusLabel } from "@/lib/format";
import { getAdminOrders } from "@/server/queries/admin";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <article key={order.id} className="surface-panel space-y-5 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">{order.orderNumber}</p>
              <h2 className="mt-2 font-heading text-4xl text-white">{orderStatusLabel(order.status)}</h2>
              <p className="mt-2 text-sm text-brand-light-gray">
                {formatDateBR(order.createdAt)} • {paymentMethodLabel(order.paymentMethod)} • {paymentStatusLabel(order.paymentStatus)}
              </p>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-sm text-brand-light-gray">Total</p>
              <p className="text-2xl font-semibold text-white">{formatCurrency(order.totalCents)}</p>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid gap-3 md:grid-cols-2">
              {order.items.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] border border-white/8 bg-black/15 p-4">
                  <p className="font-medium text-white">{item.productName}</p>
                  <p className="text-sm text-brand-light-gray">
                    Tam. {item.sizeLabel} • Qtd. {item.quantity}
                  </p>
                </div>
              ))}
            </div>
            <OrderStatusInlineForm
              orderId={order.id}
              defaultStatus={order.status}
              defaultTrackingCode={order.trackingCode}
            />
          </div>
        </article>
      ))}
    </div>
  );
}

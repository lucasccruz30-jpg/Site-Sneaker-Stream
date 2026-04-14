import Link from "next/link";

import { RevenueChart } from "@/components/admin/admin-client";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateBR, orderStatusLabel } from "@/lib/format";
import { getAdminDashboardData } from "@/server/queries/admin";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <div key={metric.label} className="surface-panel p-5">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">{metric.label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
            {metric.hint ? <p className="mt-2 text-sm text-brand-light-gray">{metric.hint}</p> : null}
          </div>
        ))}
      </div>

      <RevenueChart data={data.revenueByMonth} />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="surface-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Pedidos recentes</p>
              <h2 className="mt-3 font-heading text-3xl text-white">Operação em movimento</h2>
            </div>
            <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Link href="/admin/pedidos">Ver todos</Link>
            </Button>
          </div>
          <div className="mt-6 space-y-3">
            {data.recentOrders.map((order) => (
              <div key={order.id} className="rounded-[1.5rem] border border-white/8 bg-black/15 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-white">{order.orderNumber}</p>
                    <p className="text-sm text-brand-light-gray">{formatDateBR(order.placedAt)}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-white">{formatCurrency(order.totalCents)}</p>
                    <p className="text-sm text-brand-light-gray">{orderStatusLabel(order.status)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-panel p-6">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Top produtos</p>
          <h2 className="mt-3 font-heading text-3xl text-white">Mais vendidos</h2>
          <div className="mt-6 space-y-3">
            {data.topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-[1.5rem] border border-white/8 bg-black/15 p-4">
                <div>
                  <p className="font-medium text-white">{product.name}</p>
                  <p className="text-sm text-brand-light-gray">{product.quantity} unidades</p>
                </div>
                <p className="text-sm text-white">{formatCurrency(product.revenueCents)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="surface-panel p-6">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Pouco estoque</p>
          <h2 className="mt-3 font-heading text-3xl text-white">Atenção comercial</h2>
          <div className="mt-6 space-y-3">
            {data.lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-[1.5rem] border border-white/8 bg-black/15 p-4">
                <div>
                  <p className="font-medium text-white">{product.name}</p>
                  <p className="text-sm text-brand-light-gray">{product.brand}</p>
                </div>
                <p className="text-sm text-white">{product.stock} unidades</p>
              </div>
            ))}
          </div>
        </div>
        <div className="surface-panel p-6">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Clientes recentes</p>
          <h2 className="mt-3 font-heading text-3xl text-white">Base ativa</h2>
          <div className="mt-6 space-y-3">
            {data.recentCustomers.map((customer) => (
              <div key={customer.id} className="rounded-[1.5rem] border border-white/8 bg-black/15 p-4">
                <p className="font-medium text-white">{customer.name}</p>
                <p className="text-sm text-brand-light-gray">{customer.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

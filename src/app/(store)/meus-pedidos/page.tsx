import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateBR, orderStatusLabel, paymentMethodLabel, paymentStatusLabel } from "@/lib/format";
import { getUserOrders } from "@/server/queries/storefront";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <>
      <PageHero
        eyebrow="Meus pedidos"
        title="Acompanhe o status de cada compra"
        description="Transparência total para reforçar confiança no pós-venda e reduzir contato desnecessário."
      />
      <section className="section-spacing">
        <Container className="space-y-5">
          {orders.length ? (
            orders.map((order) => (
              <article key={order.id} className="surface-panel space-y-5 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Pedido {order.orderNumber}</p>
                    <h2 className="mt-3 font-heading text-4xl text-white">{orderStatusLabel(order.status)}</h2>
                    <p className="mt-2 text-sm text-brand-light-gray">
                      {formatDateBR(order.placedAt)} • {paymentMethodLabel(order.paymentMethod)} • {paymentStatusLabel(order.paymentStatus)}
                    </p>
                  </div>
                  <div className="text-left lg:text-right">
                    <p className="text-sm text-brand-light-gray">Total</p>
                    <p className="text-2xl font-semibold text-white">{formatCurrency(order.totalCents)}</p>
                    {order.trackingCode ? <p className="mt-2 text-sm text-brand-light-gray">Rastreio: {order.trackingCode}</p> : null}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="rounded-[1.5rem] border border-white/8 bg-black/15 p-4">
                      <p className="font-medium text-white">{item.productName}</p>
                      <p className="mt-2 text-sm text-brand-light-gray">
                        Tam. {item.sizeLabel} • Quantidade {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <EmptyState
              title="Você ainda não tem pedidos"
              description="Seu histórico vai aparecer aqui assim que a primeira compra for concluída."
              actionLabel="Ir para o shop"
              actionHref="/shop"
            />
          )}
          <div className="flex justify-center">
            <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Link href="/shop">Continuar comprando</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

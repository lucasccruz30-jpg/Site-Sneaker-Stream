import Link from "next/link";

import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const orderNumber = Array.isArray(params.order) ? params.order[0] : params.order;
  const pixCode = Array.isArray(params.pix) ? params.pix[0] : params.pix;

  return (
    <>
      <PageHero
        eyebrow="Pedido confirmado"
        title="Seu pedido foi criado com sucesso"
        description="A Sneaker Stream ja registrou a compra. Agora e so acompanhar os proximos passos com tranquilidade."
      />
      <section className="section-spacing">
        <Container className="max-w-3xl">
          <div className="store-panel space-y-6 p-8 text-center">
            <div className="space-y-3">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Numero do pedido</p>
              <h2 className="font-heading text-5xl text-brand-black">{orderNumber ?? "SS-EM-PROCESSAMENTO"}</h2>
            </div>
            {pixCode ? (
              <div className="rounded-lg border border-brand-black/10 bg-white/70 p-5 text-left">
                <p className="text-sm font-medium text-brand-black">Codigo PIX gerado</p>
                <p className="mt-2 break-all text-sm leading-7 text-brand-charcoal">{pixCode}</p>
              </div>
            ) : (
              <p className="text-sm leading-7 text-brand-charcoal">
                Pagamento preparado para integracao com gateway real. O fluxo esta pronto para Stripe ou provedor brasileiro.
              </p>
            )}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="rounded-lg bg-brand-black text-white hover:bg-brand-charcoal">
                <Link href="/meus-pedidos">Ver meus pedidos</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-lg border-brand-black/10 bg-white/70 text-brand-black hover:bg-white">
                <Link href="/shop">Voltar ao shop</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

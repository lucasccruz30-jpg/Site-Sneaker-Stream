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
        description="A Sneaker Stream já registrou a compra. Agora é só acompanhar os próximos passos com tranquilidade."
      />
      <section className="section-spacing">
        <Container className="max-w-3xl">
          <div className="surface-panel space-y-6 p-8 text-center">
            <div className="space-y-3">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Número do pedido</p>
              <h2 className="font-heading text-5xl text-white">{orderNumber ?? "SS-EM-PROCESSAMENTO"}</h2>
            </div>
            {pixCode ? (
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 text-left">
                <p className="text-sm font-medium text-white">Código PIX gerado</p>
                <p className="mt-2 break-all text-sm leading-7 text-brand-light-gray">{pixCode}</p>
              </div>
            ) : (
              <p className="text-sm leading-7 text-brand-light-gray">
                Pagamento preparado para integração com gateway real. O fluxo está pronto para Stripe ou provedor brasileiro.
              </p>
            )}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="rounded-full bg-brand-wine text-white hover:bg-brand-wine/90">
                <Link href="/meus-pedidos">Ver meus pedidos</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Link href="/shop">Voltar ao shop</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

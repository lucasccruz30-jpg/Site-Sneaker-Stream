import { Suspense } from "react";
import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { CheckoutView } from "@/components/store/storefront-shopping";
import { getSiteSettings } from "@/server/queries/storefront";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Resumo do pedido, endereco, pagamento e confirmacao em um fluxo mais direto e premium.",
};

function CheckoutFallback() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="store-panel space-y-5 p-6">
            <div className="h-3 w-28 animate-pulse rounded-full bg-brand-black/8" />
            <div className="h-10 w-48 animate-pulse rounded-full bg-brand-black/10" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-12 animate-pulse rounded-xl bg-brand-black/8" />
              <div className="h-12 animate-pulse rounded-xl bg-brand-black/8" />
              <div className="h-12 animate-pulse rounded-xl bg-brand-black/8 md:col-span-2" />
            </div>
          </div>
        ))}
      </div>
      <aside className="store-panel h-fit space-y-4 p-6">
        <div className="h-3 w-32 animate-pulse rounded-full bg-brand-black/8" />
        <div className="h-8 w-40 animate-pulse rounded-full bg-brand-black/10" />
        <div className="space-y-3 pt-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-brand-black/8" />
          ))}
        </div>
      </aside>
    </div>
  );
}

export default async function CheckoutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Compra simples, segura e preparada para converter"
        description="Endereco, frete, PIX e resumo do pedido organizados para uma jornada premium no mobile e no desktop."
      />
      <section className="section-spacing">
        <Container>
          <Suspense fallback={<CheckoutFallback />}>
            <CheckoutView settings={settings} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { CheckoutView } from "@/components/store/storefront-shopping";
import { getSiteSettings } from "@/server/queries/storefront";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Resumo do pedido, endereco, pagamento e confirmacao em um fluxo mais direto e premium.",
};

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
          <CheckoutView settings={settings} />
        </Container>
      </section>
    </>
  );
}

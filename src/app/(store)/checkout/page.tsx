import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { CheckoutView } from "@/components/store/storefront-shopping";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Resumo do pedido, endereço, pagamento e confirmação em um fluxo de compra premium.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Compra simples, segura e pronta para converter"
        description="Resumo do pedido, frete, cupom e pagamento preparados para uma jornada premium no mobile e no desktop."
      />
      <section className="section-spacing">
        <Container>
          <CheckoutView />
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { CartView } from "@/components/store/storefront-shopping";

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Revise os produtos selecionados, ajuste quantidades e siga para o checkout premium.",
};

export default function CartPage() {
  return (
    <>
      <PageHero
        eyebrow="Carrinho"
        title="Revise sua seleção antes de finalizar"
        description="Fluxo enxuto, visual limpo e foco em conversão para reduzir atrito até o checkout."
      />
      <section className="section-spacing">
        <Container>
          <CartView />
        </Container>
      </section>
    </>
  );
}

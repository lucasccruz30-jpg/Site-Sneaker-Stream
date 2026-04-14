import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { WishlistView } from "@/components/store/storefront-shopping";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Salve seus sneakers favoritos e retorne no melhor momento para comprar.",
};

export default function WishlistPage() {
  return (
    <>
      <PageHero
        eyebrow="Wishlist"
        title="Guarde os pares que valem um segundo olhar"
        description="Uma área pensada para desejo contínuo, comparação e retorno à compra com mais intenção."
      />
      <section className="section-spacing">
        <Container>
          <WishlistView />
        </Container>
      </section>
    </>
  );
}

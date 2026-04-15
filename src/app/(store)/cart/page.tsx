import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { CartView } from "@/components/store/storefront-shopping";
import { getRecommendedProducts, getSiteSettings } from "@/server/queries/storefront";

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Revise os produtos selecionados, ajuste quantidades e siga para um checkout mais claro e confiavel.",
};

export default async function CartPage() {
  const [recommendedProducts, settings] = await Promise.all([getRecommendedProducts(4), getSiteSettings()]);

  return (
    <>
      <PageHero
        eyebrow="Carrinho"
        title="Revise sua selecao com clareza antes de finalizar a compra"
        description="Resumo visivel, frete estimado, destaque para PIX e uma leitura mais organizada para reduzir abandono no meio da jornada."
      />
      <section className="section-spacing">
        <Container>
          <CartView recommendedProducts={recommendedProducts} settings={settings} />
        </Container>
      </section>
    </>
  );
}

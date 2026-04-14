import { getHomePageData } from "@/server/queries/storefront";

import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { ShowcaseSection } from "@/components/store/home-sections";

export default async function DropsPage() {
  const data = await getHomePageData();

  return (
    <>
      <PageHero
        eyebrow="Drops"
        title="Lançamentos, edições limitadas e oportunidades que não param muito tempo"
        description="Página desenhada para capturar desejo imediato com escassez elegante, curadoria premium e foco em velocidade de decisão."
      />
      <div className="section-spacing pt-12">
        <Container className="space-y-10">
          <ShowcaseSection
            eyebrow="Lançamentos"
            title="Modelos recém-chegados"
            description="Silhuetas novas e produtos com forte momento comercial."
            products={data.launchProducts}
            href="/shop?highlight=new"
          />
          <ShowcaseSection
            eyebrow="Exclusivos"
            title="Baixo estoque e alta percepção de valor"
            description="Pares selecionados para quem compra pela raridade e pelo posicionamento."
            products={data.exclusiveProducts}
            href="/shop?highlight=exclusive"
          />
          <ShowcaseSection
            eyebrow="Ofertas"
            title="Condições especiais da semana"
            description="Modelos com desconto estratégico e forte apelo visual."
            products={data.offers}
            href="/shop?highlight=sale"
          />
        </Container>
      </div>
    </>
  );
}

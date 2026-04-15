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
        title="Lancamentos, edicoes limitadas e oportunidades que nao ficam muito tempo no ar"
        description="Pagina desenhada para capturar desejo imediato com escassez elegante, curadoria premium e foco em velocidade de decisao."
      />
      <div className="section-spacing pt-12">
        <Container className="space-y-10">
          <ShowcaseSection
            eyebrow="Lancamentos"
            title="Modelos recem-chegados com forte momento comercial"
            description="Silhuetas novas e pares que ajudam a puxar clique, recorrencia e desejo logo no primeiro contato."
            products={data.launchProducts}
            href="/shop?highlight=new"
          />
          <ShowcaseSection
            eyebrow="Exclusivos"
            title="Baixo estoque e alta percepcao de valor"
            description="Produtos selecionados para quem compra pela raridade, pela historia do modelo e pelo status visual."
            products={data.exclusiveProducts}
            href="/shop?highlight=exclusive"
          />
          <ShowcaseSection
            eyebrow="Ofertas"
            title="Condicoes especiais da semana"
            description="Modelos com desconto estrategico e apresentacao premium, sem diluir o valor percebido da loja."
            products={data.offers}
            href="/shop?highlight=sale"
          />
        </Container>
      </div>
    </>
  );
}

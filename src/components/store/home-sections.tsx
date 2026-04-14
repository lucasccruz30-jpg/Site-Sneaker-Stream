import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductGrid } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { instagramHighlights, testimonials, trustPillars } from "@/lib/site";
import type { BannerData, HomePageData } from "@/types";

function HeroBanner({ banner }: { banner: BannerData }) {
  return (
    <section className="section-spacing pb-10">
      <Container>
        <div className="store-panel-dark grid overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-between gap-10 p-8 sm:p-10 lg:p-14">
            <div className="space-y-6">
              <span className="inline-flex w-fit rounded-md border border-white/10 bg-white/8 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brand-light-gray">
                {banner.eyebrow ?? "Sneaker Stream"}
              </span>
              <div className="space-y-4">
                <h1 className="max-w-2xl font-heading text-5xl leading-none text-white sm:text-6xl lg:text-7xl">
                  {banner.title}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-brand-light-gray sm:text-lg">
                  {banner.subtitle ??
                    "Sneakers importados com curadoria precisa, compra segura e apresentacao mais alinhada ao valor do produto."}
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="grid gap-4 border-t border-white/10 pt-6 text-sm text-brand-light-gray sm:grid-cols-3">
                <div className="space-y-1 border-l border-white/10 pl-4 first:border-l-0 first:pl-0">
                  <p className="text-xs uppercase tracking-[0.22em] text-brand-light-gray">Selecao</p>
                  <p className="text-2xl font-semibold text-white">Curadoria premium</p>
                </div>
                <div className="space-y-1 border-l border-white/10 pl-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-brand-light-gray">Disponibilidade</p>
                  <p className="text-2xl font-semibold text-white">Drops limitados</p>
                </div>
                <div className="space-y-1 border-l border-white/10 pl-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-brand-light-gray">Compra</p>
                  <p className="text-2xl font-semibold text-white">PIX e checkout agil</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-lg bg-brand-wine px-7 text-white hover:bg-brand-wine/90">
                  <Link href={banner.ctaHref ?? "/shop"} className="inline-flex items-center gap-2">
                    {banner.ctaLabel ?? "Explorar catalogo"}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-lg border-white/12 bg-white/6 px-7 text-white hover:bg-white/10"
                >
                  <Link href="/autenticidade">Ver garantia</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden border-t border-white/10 lg:border-l lg:border-t-0">
            <Image
              src={banner.imageUrl ?? "/images/placeholder-product.svg"}
              alt={banner.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-brand-wine/18" />
            <div className="absolute bottom-6 left-6 right-6 hidden border border-white/10 bg-black/25 p-5 backdrop-blur lg:block">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-brand-light-gray">Edicao selecionada</p>
              <p className="mt-3 max-w-sm text-sm leading-7 text-white/88">
                Visual limpo, foto grande e informacao direta para valorizar produto e facilitar decisao.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ShowcaseSection({
  eyebrow,
  title,
  description,
  products,
  href,
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: HomePageData["launchProducts"];
  href: string;
}) {
  return (
    <section className="section-spacing">
      <Container className="space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <Button asChild variant="outline" className="w-fit rounded-lg border-brand-black/10 bg-white/70 text-brand-black hover:bg-white">
            <Link href={href}>Ver mais</Link>
          </Button>
        </div>
        <ProductGrid products={products} />
      </Container>
    </section>
  );
}

export function HomePageSections({ data }: { data: HomePageData }) {
  const hero = data.heroBanners[0];

  return (
    <>
      {hero ? <HeroBanner banner={hero} /> : null}

      <section className="pb-10">
        <Container className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Autenticidade garantida", text: "Conferencia interna em todos os pares antes do envio." },
            { icon: Truck, title: "Envio seguro", text: "Rastreio, atendimento ativo e operacao com leitura profissional." },
            { icon: CheckCircle2, title: "Compra facilitada", text: "Checkout mais direto, com menos distrações e melhor hierarquia." },
            { icon: Sparkles, title: "Curadoria premium", text: "Modelos com criterio visual, comercial e valor de marca." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="store-panel flex items-start gap-4 p-6">
                <div className="inline-flex size-12 items-center justify-center rounded-lg bg-brand-wine/10 text-brand-wine">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-black">{item.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-brand-charcoal">{item.text}</p>
                </div>
              </div>
            );
          })}
        </Container>
      </section>

      <ShowcaseSection
        eyebrow="Lancamentos"
        title="Novidades com apresentacao mais sobria e comercial"
        description="Silhuetas recentes organizadas em uma vitrine mais limpa, com foco no produto e no valor percebido."
        products={data.launchProducts}
        href="/drops"
      />

      <ShowcaseSection
        eyebrow="Mais vendidos"
        title="Os pares que ja provaram conversao e desejo"
        description="Selecao baseada em procura, aderencia visual e decisao de compra mais rapida."
        products={data.bestSellers}
        href="/shop?sort=bestsellers"
      />

      <ShowcaseSection
        eyebrow="Ofertas"
        title="Condicoes especiais com aparencia premium"
        description="Promocoes apresentadas com criterio, sem diluir a percepcao de marca da loja."
        products={data.offers}
        href="/shop?highlight=sale"
      />

      <section className="section-spacing">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Marcas em destaque"
            title="Marcas fortes, curadoria mais organizada"
            description="Um bloco mais editorial e menos carregado, destacando o peso cultural de cada nome."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {data.featuredBrands.map((brand) => (
              <div key={brand.id} className="store-panel p-6">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-warm-gray">Marca</p>
                <h3 className="mt-4 font-heading text-3xl text-brand-black">{brand.name}</h3>
                <p className="mt-3 text-sm leading-7 text-brand-charcoal">{brand.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="store-section-band section-spacing">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Categorias"
            title="Navegacao mais objetiva para o catalogo"
            description="Blocos mais retos, leitura mais limpa e caminho mais claro ate o clique."
          />
          <div className="grid gap-4 lg:grid-cols-4">
            {data.featuredCategories.map((category, index) => (
              <Link key={category.id} href={`/shop?category=${category.slug}`} className="store-panel group relative overflow-hidden p-7 transition hover:-translate-y-1">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(85,13,26,0.12),transparent_30%)] opacity-70 transition group-hover:opacity-100" />
                <div className="relative">
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-warm-gray">
                    Categoria {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-5 font-heading text-4xl text-brand-black">{category.name}</h3>
                  <p className="mt-4 text-sm leading-7 text-brand-charcoal">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <ShowcaseSection
        eyebrow="Destaques da semana"
        title="Selecao editorial para acelerar decisao"
        description="Produtos com leitura mais profissional, espaco de respiro e foco no que realmente vende."
        products={data.weekHighlights}
        href="/shop"
      />

      <ShowcaseSection
        eyebrow="Sneakers exclusivos"
        title="Escassez elegante, sem poluicao visual"
        description="Pares com baixa disponibilidade apresentados de forma mais premium e confiavel."
        products={data.exclusiveProducts}
        href="/shop?highlight=exclusive"
      />

      <section className="section-spacing">
        <Container className="grid gap-5 lg:grid-cols-4">
          {trustPillars.map((pillar) => (
            <div key={pillar.title} className="store-panel p-6">
              <h3 className="text-xl font-semibold text-brand-black">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-brand-charcoal">{pillar.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="store-section-band section-spacing">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Depoimentos"
            title="Credibilidade com apresentacao mais sofisticada"
            description="Prova social em um formato mais sobrio, com menos exagero e mais clareza."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="store-panel-muted p-7">
                <div className="space-y-5">
                  <p className="text-base leading-8 text-brand-charcoal">&quot;{testimonial.quote}&quot;</p>
                  <div>
                    <p className="font-semibold text-brand-black">{testimonial.name}</p>
                    <p className="text-sm text-brand-warm-gray">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-spacing">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Instagram / lifestyle"
            title="Visual mais premium, menos pesado"
            description="Conteudo de contexto para reforcar estilo, desejo e autenticidade sem sobrecarregar a interface."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {instagramHighlights.map((highlight) => (
              <div key={highlight.title} className="store-panel group overflow-hidden">
                <div className="relative aspect-[4/4.8] overflow-hidden bg-[#ece6e1]">
                  <Image
                    src={highlight.image}
                    alt={highlight.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-3xl text-brand-black">{highlight.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-brand-charcoal">{highlight.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-spacing pt-0">
        <Container>
          <div className="store-panel-dark grid gap-8 overflow-hidden px-8 py-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-brand-light-gray">Lista VIP</p>
              <h2 className="mt-4 font-heading text-4xl text-white sm:text-5xl">
                Receba drops, ofertas e edicoes limitadas com antecedencia.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-brand-light-gray sm:text-base">
                Uma faixa final mais limpa para captacao, sem excesso de brilho e com CTA mais objetivo.
              </p>
            </div>
            <Button asChild size="lg" className="h-12 rounded-lg bg-white px-7 text-brand-black hover:bg-brand-off-white">
              <Link href="/contato">Quero receber os drops</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

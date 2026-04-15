import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { NewsletterForm } from "@/components/store/storefront-forms";
import { ProductGrid } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { instagramHighlights, testimonials, trustPillars } from "@/lib/site";
import type { BannerData, HomePageData, ProductCardData, SiteSettingsData } from "@/types";

const heroHighlights = [
  { label: "Curadoria", value: "Modelos selecionados para gerar desejo e decisao mais rapida." },
  { label: "Autenticidade", value: "Conferencia interna antes do envio, com leitura de origem e condicao." },
  { label: "Compra", value: "Checkout direto, PIX com destaque e suporte consultivo quando necessario." },
];

const commerceSignals = [
  { icon: ShieldCheck, title: "Autenticidade garantida", text: "Cada par passa por conferencia interna antes do despacho." },
  { icon: Truck, title: "Entrega com rastreio", text: "Operacao segura e acompanhamento claro ate a entrega." },
  { icon: CheckCircle2, title: "Troca com politica clara", text: "Informacao objetiva para reduzir duvida e aumentar confianca." },
  { icon: Sparkles, title: "Curadoria premium", text: "Mix orientado a desejo, escassez e valor percebido." },
];

function HeroBanner({ banner, settings }: { banner: BannerData; settings: SiteSettingsData }) {
  const freeShippingThreshold = settings.freeShippingThresholdCents
    ? formatCurrency(settings.freeShippingThresholdCents)
    : null;

  return (
    <section className="section-spacing pb-12">
      <Container>
        <div className="store-panel-dark grid overflow-hidden xl:grid-cols-[minmax(0,1.02fr)_minmax(500px,0.98fr)]">
          <div className="flex flex-col justify-between gap-12 p-8 sm:p-10 xl:p-14">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex w-fit rounded-md border border-white/10 bg-white/8 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brand-light-gray">
                  {banner.eyebrow ?? "Sneaker Stream"}
                </span>
                <span className="inline-flex rounded-md border border-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand-light-gray">
                  5% OFF no PIX
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-[11ch] font-heading text-[3.5rem] leading-[0.88] text-white sm:text-[4.5rem] lg:text-[5rem] xl:text-[5.6rem]">
                  {banner.title}
                </h1>
                <p className="max-w-xl text-base leading-8 text-brand-light-gray sm:text-lg">
                  {banner.subtitle ??
                    "Curadoria de sneakers importados para quem compra exclusividade, autenticidade e presenca visual sem abrir mao de uma jornada de compra profissional."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-light-gray">Compra segura</p>
                  <p className="mt-3 text-sm leading-7 text-white/88">{settings.authenticityMessage}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-light-gray">Entrega e condicoes</p>
                  <p className="mt-3 text-sm leading-7 text-white/88">
                    {freeShippingThreshold
                      ? `Frete gratis acima de ${freeShippingThreshold} e despacho com rastreio seguro.`
                      : settings.shippingLeadText}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 border-t border-white/10 pt-6">
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
                  <Link href="/autenticidade">Ver garantia de autenticidade</Link>
                </Button>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {heroHighlights.map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-brand-light-gray">{item.label}</p>
                    <p className="mt-3 text-sm leading-7 text-white/88">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden border-t border-white/10 xl:border-l xl:border-t-0">
            <Image
              src={banner.imageUrl ?? "/images/placeholder-product.svg"}
              alt={banner.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 46vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/15 via-transparent to-brand-wine/20" />

            <div className="absolute left-6 top-6 rounded-xl border border-white/12 bg-black/35 px-4 py-3 backdrop-blur">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-brand-light-gray">Drop selecionado</p>
              <p className="mt-2 text-sm font-medium text-white">Visual forte, leitura limpa e foco total no produto.</p>
            </div>

            <div className="absolute inset-x-6 bottom-6 hidden xl:block">
              <div className="rounded-[1.6rem] border border-white/12 bg-[linear-gradient(180deg,rgba(16,16,16,0.46),rgba(16,16,16,0.3))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr_0.85fr]">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-brand-light-gray">Experiencia premium</p>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-white/88">
                      Navegacao mais objetiva, fotos maiores e uma hierarquia pensada para valorizar produto e facilitar a compra.
                    </p>
                  </div>
                  <div className="border-l border-white/10 pl-5">
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-brand-light-gray">Atendimento consultivo</p>
                    <p className="mt-3 text-sm leading-7 text-white/88">
                      Suporte rapido para numeracao, pagamento e autenticidade antes da decisao.
                    </p>
                  </div>
                  <div className="border-l border-white/10 pl-5">
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-brand-light-gray">Compra sem atrito</p>
                    <p className="mt-3 text-sm leading-7 text-white/88">
                      Checkout mais limpo, PIX destacado e menos friccao no mobile e no desktop.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function CommerceStrip() {
  return (
    <section className="pb-10">
      <Container className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {commerceSignals.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="store-panel flex items-start gap-4 p-6">
              <div className="inline-flex size-12 items-center justify-center rounded-lg bg-brand-wine/10 text-brand-wine">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-brand-charcoal">{item.text}</p>
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}

function CuratedFeatureCards({
  launches,
  exclusives,
}: {
  launches: ProductCardData[];
  exclusives: ProductCardData[];
}) {
  const launchProduct = launches[0];
  const exclusiveProduct = exclusives[0];

  if (!launchProduct || !exclusiveProduct) {
    return null;
  }

  return (
    <section className="section-spacing pt-0">
      <Container className="grid gap-5 lg:grid-cols-2">
        {[launchProduct, exclusiveProduct].map((product, index) => (
          <Link
            key={product.id}
            href={`/shop/${product.slug}`}
            className="store-panel group relative overflow-hidden p-0"
          >
            <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="flex flex-col justify-between p-7 sm:p-8">
                <div className="space-y-4">
                  <span className="eyebrow-chip">
                    {index === 0 ? "Lancamento em destaque" : "Exclusividade da semana"}
                  </span>
                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-brand-warm-gray">
                      {product.brand} / {product.category}
                    </p>
                    <h3 className="mt-4 font-heading text-4xl leading-none text-brand-black sm:text-5xl">
                      {product.name}
                    </h3>
                    <p className="mt-4 max-w-lg text-sm leading-7 text-brand-charcoal">
                      {index === 0
                        ? "Drop com alta procura, narrativa visual forte e leitura pensada para clique e conversao."
                        : "Par com distribuicao mais limitada, posicionado para colecionadores e clientes de maior valor percebido."}
                    </p>
                  </div>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-black">
                  Ver produto
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </div>
              </div>

              <div className="relative min-h-[240px] overflow-hidden bg-[#e8e1db]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 220px"
                />
              </div>
            </div>
          </Link>
        ))}
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
  products: ProductCardData[];
  href: string;
}) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="section-spacing">
      <Container className="space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <Button asChild variant="outline" className="w-fit rounded-lg border-brand-black/10 bg-white/80 text-brand-black hover:bg-white">
            <Link href={href}>Explorar vitrine</Link>
          </Button>
        </div>
        <ProductGrid products={products.slice(0, 4)} />
      </Container>
    </section>
  );
}

function BrandAndCategorySection({ data }: { data: HomePageData }) {
  return (
    <section className="store-section-band section-spacing">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Marcas, categorias e estilo"
          title="Uma vitrine com leitura de marca, desejo e navegacao mais rapida"
          description="Organizamos a descoberta de produto por universos que realmente ajudam o cliente a chegar mais perto da compra."
        />

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {data.featuredBrands.map((brand) => (
              <div key={brand.id} className="store-panel p-6">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-warm-gray">Marca em destaque</p>
                <h3 className="mt-4 font-heading text-4xl text-brand-black">{brand.name}</h3>
                <p className="mt-3 text-sm leading-7 text-brand-charcoal">
                  {brand.description ?? "Presenca cultural forte, silhuetas desejadas e leitura premium dentro da curadoria da loja."}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-4">
            {data.featuredCategories.slice(0, 4).map((category, index) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="store-panel group relative overflow-hidden p-6 transition hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(85,13,26,0.12),transparent_32%)] opacity-80 transition group-hover:opacity-100" />
                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-warm-gray">
                      Categoria {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-heading text-3xl text-brand-black">{category.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-brand-charcoal">
                      {category.description ?? "Selecao refinada para acelerar a descoberta de produto."}
                    </p>
                  </div>
                  <ArrowRight className="size-5 text-brand-wine transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function TrustBand({ settings }: { settings: SiteSettingsData }) {
  const freeShippingThreshold = settings.freeShippingThresholdCents
    ? formatCurrency(settings.freeShippingThresholdCents)
    : null;

  return (
    <section className="section-spacing">
      <Container>
        <div className="store-panel-dark grid gap-8 overflow-hidden px-8 py-10 lg:grid-cols-[1fr_1.1fr] lg:px-12">
          <div className="space-y-5">
            <span className="inline-flex w-fit rounded-md border border-white/10 bg-white/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand-light-gray">
              Confianca e credibilidade
            </span>
            <h2 className="max-w-[11ch] font-heading text-4xl leading-[0.92] text-white sm:text-5xl">
              Mais seguranca para comprar um produto de alto desejo.
            </h2>
            <p className="max-w-xl text-sm leading-8 text-brand-light-gray sm:text-base">
              {settings.authenticityMessage} {freeShippingThreshold ? `Frete gratis acima de ${freeShippingThreshold}.` : ""}
            </p>
            <Button asChild size="lg" className="h-12 rounded-lg bg-white px-7 text-brand-black hover:bg-brand-off-white">
              <Link href="/autenticidade">Entender como garantimos autenticidade</Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {trustPillars.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                <p className="text-lg font-semibold text-white">{pillar.title}</p>
                <p className="mt-3 text-sm leading-7 text-brand-light-gray">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function SocialProofSection({ data }: { data: HomePageData }) {
  return (
    <section className="section-spacing">
      <Container className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Prova social"
            title="Clientes compram com mais seguranca quando a marca parece real, clara e confiavel"
            description="Depoimentos, produto em destaque e estrutura institucional ajudam a sustentar a decisao sem exagero visual."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="store-panel-muted p-7">
                <div className="flex items-center gap-1 text-brand-wine">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={`${testimonial.name}-${index}`} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 text-base leading-8 text-brand-charcoal">&quot;{testimonial.quote}&quot;</p>
                <div className="mt-5">
                  <p className="font-semibold text-brand-black">{testimonial.name}</p>
                  <p className="text-sm text-brand-warm-gray">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="store-panel p-6">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-warm-gray">Mais comentados</p>
            <div className="mt-5 space-y-4">
              {data.testimonialProducts.map((product) => (
                <Link key={product.id} href={`/shop/${product.slug}`} className="flex items-center gap-4 rounded-xl border border-brand-black/8 bg-white/75 p-3 transition hover:border-brand-wine/20">
                  <div className="relative size-16 overflow-hidden rounded-lg bg-[#ece6e1]">
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-brand-black">{product.name}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-brand-warm-gray">{product.brand}</p>
                    <p className="mt-1 text-sm text-brand-charcoal">{product.reviewCount} avaliacoes</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="store-panel p-6">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-warm-gray">Atendimento rapido</p>
            <h3 className="mt-4 font-heading text-3xl text-brand-black">Duvida de numeracao, entrega ou autenticidade?</h3>
            <p className="mt-3 text-sm leading-7 text-brand-charcoal">
              O contato fica visivel na jornada para reduzir hesitacao e ajudar a fechar a compra com mais confianca.
            </p>
            <Button asChild className="mt-5 h-11 rounded-lg bg-brand-black text-white hover:bg-brand-charcoal">
              <Link href="/contato">Falar com a equipe</Link>
            </Button>
          </div>
        </aside>
      </Container>
    </section>
  );
}

function LifestyleSection() {
  return (
    <section className="store-section-band section-spacing">
      <Container className="space-y-8">
        <SectionHeading
          eyebrow="Instagram / lifestyle"
          title="Visual de marca para sustentar desejo, autenticidade e repertorio"
          description="O produto precisa vender, mas o contexto tambem. Esta faixa reforca estilo e posicionamento sem poluir a interface."
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
  );
}

function NewsletterSection({ settings }: { settings: SiteSettingsData }) {
  return (
    <section className="section-spacing pt-0">
      <Container>
        <div className="store-panel-dark grid gap-8 overflow-hidden px-8 py-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-brand-light-gray">Lista VIP</p>
            <h2 className="mt-4 max-w-[13ch] font-heading text-4xl text-white sm:text-5xl">
              Receba drops, reposicoes e condicoes que elevam a chance de compra.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-brand-light-gray sm:text-base">
              Capte clientes que ainda nao estavam prontos para comprar agora, mas querem acompanhar os pares mais desejados da curadoria.
            </p>
          </div>
          <div className="w-full max-w-2xl space-y-4">
            <NewsletterForm />
            <p className="text-xs uppercase tracking-[0.18em] text-brand-light-gray">
              {settings.pixDiscountPercentage}% OFF no PIX, atendimento rapido e notificacoes seletivas.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function HomePageSections({ data }: { data: HomePageData }) {
  const hero = data.heroBanners[0];

  return (
    <>
      {hero ? <HeroBanner banner={hero} settings={data.settings} /> : null}

      <CommerceStrip />
      <CuratedFeatureCards launches={data.launchProducts} exclusives={data.exclusiveProducts} />

      <ShowcaseSection
        eyebrow="Lancamentos"
        title="Os pares novos que puxam clique, desejo e urgencia logo no primeiro contato"
        description="Uma vitrine comercial para destacar o que chegou agora, com leitura limpa e foco total no produto."
        products={data.launchProducts}
        href="/drops"
      />

      <ShowcaseSection
        eyebrow="Mais vendidos"
        title="Os sneakers que ja provaram desejo, consistencia e decisao de compra"
        description="Produtos com boa resposta comercial apresentados de forma mais premium e objetiva."
        products={data.bestSellers}
        href="/shop?sort=bestsellers"
      />

      <BrandAndCategorySection data={data} />

      <ShowcaseSection
        eyebrow="Ofertas"
        title="Condicoes especiais sem diluir a percepcao premium da marca"
        description="Promocoes com leitura mais elegante, badges mais uteis e narrativa comercial mais controlada."
        products={data.offers}
        href="/shop?highlight=sale"
      />

      <ShowcaseSection
        eyebrow="Destaques da semana"
        title="Uma selecao para acelerar a descoberta e aproximar o cliente da compra"
        description="Curadoria semanal que combina modelos com boa conversao, forte leitura visual e contexto de marca."
        products={data.weekHighlights}
        href="/shop"
      />

      <TrustBand settings={data.settings} />

      <ShowcaseSection
        eyebrow="Sneakers exclusivos"
        title="Escassez elegante para colecionadores e clientes de maior valor percebido"
        description="Pares mais raros apresentados com mais contexto de autenticidade, disponibilidade e exclusividade."
        products={data.exclusiveProducts}
        href="/shop?highlight=exclusive"
      />

      <SocialProofSection data={data} />
      <LifestyleSection />
      <NewsletterSection settings={data.settings} />
    </>
  );
}

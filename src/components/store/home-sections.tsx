import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { NewsletterForm } from "@/components/store/storefront-forms";
import { ProductGrid } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { formatCurrency, getInstallmentText } from "@/lib/format";
import { instagramHighlights, testimonials, trustPillars } from "@/lib/site";
import type { BannerData, HomePageData, ProductCardData, SiteSettingsData } from "@/types";

const heroSignals = [
  {
    title: "Curadoria premium",
    text: "Selecao orientada a desejo, disponibilidade e valor percebido.",
  },
  {
    title: "Autenticidade verificada",
    text: "Conferencia interna em cada par antes do envio.",
  },
  {
    title: "Compra sem atrito",
    text: "Checkout direto, PIX com destaque e suporte rapido.",
  },
];

const commerceSignals = [
  { icon: ShieldCheck, title: "Autenticidade garantida", text: "Cada par passa por conferencia interna antes do despacho." },
  { icon: Truck, title: "Envio com rastreio", text: "Operacao organizada e acompanhamento claro ate a entrega." },
  { icon: Headphones, title: "Atendimento consultivo", text: "Ajuda rapida para numeracao, pagamento e autenticidade." },
  { icon: Sparkles, title: "Curadoria premium", text: "Mix pensado para vender melhor e elevar a percepcao da marca." },
];

function HeroBanner({ banner, settings }: { banner: BannerData; settings: SiteSettingsData }) {
  const freeShippingThreshold = settings.freeShippingThresholdCents
    ? formatCurrency(settings.freeShippingThresholdCents)
    : null;

  return (
    <section className="section-spacing pb-10">
      <Container>
        <div className="store-panel-dark overflow-hidden">
          <div className="grid xl:grid-cols-[1.02fr_0.98fr]">
            <div className="flex flex-col justify-between gap-10 p-8 sm:p-10 xl:p-14">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex w-fit rounded-md border border-white/10 bg-white/8 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brand-light-gray">
                    {banner.eyebrow ?? "Sneaker Stream"}
                  </span>
                  <span className="inline-flex rounded-md border border-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand-light-gray">
                    {settings.pixDiscountPercentage}% OFF no PIX
                  </span>
                </div>

                <div className="space-y-5">
                  <h1 className="max-w-[10ch] font-heading text-[3.35rem] leading-[0.88] text-white sm:text-[4.5rem] lg:text-[5rem] xl:text-[5.5rem]">
                    {banner.title}
                  </h1>
                  <p className="max-w-xl text-base leading-8 text-brand-light-gray sm:text-lg">
                    {banner.subtitle ??
                      "Sneakers importados para quem compra autenticidade, exclusividade e presenca visual com uma experiencia de compra mais profissional."}
                  </p>
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
                    <Link href="/autenticidade">Ver autenticidade</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
                {heroSignals.map((item) => (
                  <div key={item.title} className="space-y-3">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-light-gray">{item.title}</p>
                    <p className="text-sm leading-7 text-white/88">{item.text}</p>
                  </div>
                ))}
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
              <div className="absolute inset-0 bg-gradient-to-br from-black/8 via-transparent to-brand-wine/20" />

              <div className="absolute left-6 top-6 rounded-xl border border-white/12 bg-black/30 px-4 py-3 backdrop-blur">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-brand-light-gray">Drop selecionado</p>
                <p className="mt-2 text-sm font-medium text-white">Produto valorizado por foto grande e leitura limpa.</p>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/28 to-transparent px-6 pb-6 pt-16">
                <div className="max-w-lg space-y-3">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-brand-light-gray">Compra premium</p>
                  <p className="text-sm leading-7 text-white/88">
                    {freeShippingThreshold
                      ? `Frete gratis acima de ${freeShippingThreshold}, despacho com rastreio e suporte rapido para destravar a compra.`
                      : settings.shippingLeadText}
                  </p>
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

function EditorialSpotlight({
  featuredProduct,
  supportProducts,
}: {
  featuredProduct?: ProductCardData;
  supportProducts: ProductCardData[];
}) {
  if (!featuredProduct) {
    return null;
  }

  return (
    <section className="section-spacing pt-0">
      <Container className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="store-panel overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative min-h-[320px] overflow-hidden bg-[#e7dfd8]">
              <Image
                src={featuredProduct.image}
                alt={featuredProduct.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
            <div className="flex flex-col justify-between gap-8 p-7 sm:p-8">
              <div className="space-y-4">
                <span className="eyebrow-chip">Destaque editorial</span>
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-brand-warm-gray">
                    {featuredProduct.brand} / {featuredProduct.category}
                  </p>
                  <h3 className="mt-4 font-heading text-4xl leading-none text-brand-black sm:text-5xl">
                    {featuredProduct.name}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-8 text-brand-charcoal">
                    Um bloco principal para valorizar o produto de forma mais editorial, com mais respiro, mais imagem e uma copy que conduz para a compra.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-semibold text-brand-black">
                    {formatCurrency(featuredProduct.salePriceInCents ?? featuredProduct.basePriceInCents)}
                  </p>
                  <p className="mt-1 text-sm text-brand-charcoal">
                    {getInstallmentText(featuredProduct.salePriceInCents ?? featuredProduct.basePriceInCents)}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="h-11 rounded-lg bg-brand-black text-white hover:bg-brand-charcoal">
                    <Link href={`/shop/${featuredProduct.slug}`}>Ver produto</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-lg border-brand-black/10 bg-white/80 text-brand-black hover:bg-white"
                  >
                    <Link href="/shop?highlight=new">Ver lancamentos</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {supportProducts.slice(0, 2).map((product, index) => (
            <Link key={product.id} href={`/shop/${product.slug}`} className="store-panel group overflow-hidden">
              <div className="grid gap-0 sm:grid-cols-[148px_1fr]">
                <div className="relative min-h-[180px] overflow-hidden bg-[#ece4de]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="148px"
                  />
                </div>
                <div className="flex flex-col justify-between p-6">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-warm-gray">
                      {index === 0 ? "Mais desejado" : "Selecao limitada"}
                    </p>
                    <h3 className="mt-3 font-heading text-3xl leading-none text-brand-black">{product.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-brand-charcoal">
                      {index === 0
                        ? "Pares com procura consistente e boa resposta comercial."
                        : "Produtos com escassez mais elegante e maior valor percebido."}
                    </p>
                  </div>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-black">
                    Descobrir
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
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

function SplitMerchandising({
  bestSellers,
  offers,
}: {
  bestSellers: ProductCardData[];
  offers: ProductCardData[];
}) {
  const sections = [
    {
      eyebrow: "Mais vendidos",
      title: "Os pares que ja provaram desejo",
      description: "Produtos com boa aderencia visual e resposta comercial mais forte.",
      products: bestSellers,
      href: "/shop?sort=bestsellers",
    },
    {
      eyebrow: "Ofertas",
      title: "Condicoes especiais com apresentacao premium",
      description: "Desconto e valor percebido trabalhando juntos, sem cara de liquidação generica.",
      products: offers,
      href: "/shop?highlight=sale",
    },
  ];

  return (
    <section className="store-section-band section-spacing">
      <Container className="grid gap-5 xl:grid-cols-2">
        {sections.map((section) => (
          <div key={section.eyebrow} className="store-panel p-6 sm:p-7">
            <div className="flex items-end justify-between gap-4">
              <SectionHeading
                eyebrow={section.eyebrow}
                title={section.title}
                description={section.description}
              />
              <Button
                asChild
                variant="outline"
                className="hidden rounded-lg border-brand-black/10 bg-white/80 text-brand-black hover:bg-white md:inline-flex"
              >
                <Link href={section.href}>Ver mais</Link>
              </Button>
            </div>

            <div className="mt-8 space-y-4">
              {section.products.slice(0, 3).map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-brand-black/8 bg-white/72 p-4 transition hover:border-brand-wine/20"
                >
                  <div className="relative size-24 overflow-hidden rounded-xl bg-[#e9e0d9]">
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.68rem] uppercase tracking-[0.16em] text-brand-warm-gray">{product.brand}</p>
                    <h3 className="mt-2 truncate font-heading text-3xl leading-none text-brand-black">{product.name}</h3>
                    <p className="mt-2 text-sm text-brand-charcoal">
                      {formatCurrency(product.salePriceInCents ?? product.basePriceInCents)}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-brand-black transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>

            <Button
              asChild
              variant="outline"
              className="mt-6 w-full rounded-lg border-brand-black/10 bg-white/80 text-brand-black hover:bg-white md:hidden"
            >
              <Link href={section.href}>Ver vitrine</Link>
            </Button>
          </div>
        ))}
      </Container>
    </section>
  );
}

function BrandCategorySection({ data }: { data: HomePageData }) {
  return (
    <section className="section-spacing">
      <Container className="space-y-8">
        <SectionHeading
          eyebrow="Categorias e marcas"
          title="Descoberta organizada por estilo, universo e repertorio de marca"
          description="A navegacao fica mais coerente quando o cliente entende rapido onde clicar e por que aquela curadoria existe."
        />

        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {data.featuredCategories.slice(0, 4).map((category, index) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="store-panel group relative overflow-hidden p-6 transition hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(85,13,26,0.12),transparent_32%)] opacity-80 transition group-hover:opacity-100" />
                <div className="relative">
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-warm-gray">
                    Categoria {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-heading text-4xl leading-none text-brand-black">{category.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-brand-charcoal">
                    {category.description ?? "Selecao refinada para acelerar a descoberta de produto."}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="store-panel-dark p-7 sm:p-8">
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-brand-light-gray">Marcas em destaque</p>
            <h3 className="mt-4 max-w-[11ch] font-heading text-4xl leading-[0.92] text-white sm:text-5xl">
              Nomes fortes para sustentar desejo e credibilidade.
            </h3>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {data.featuredBrands.map((brand) => (
                <div key={brand.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                  <p className="font-heading text-3xl leading-none text-white">{brand.name}</p>
                  <p className="mt-3 text-sm leading-7 text-brand-light-gray">
                    {brand.description ?? "Marca com leitura premium dentro da curadoria da Sneaker Stream."}
                  </p>
                </div>
              ))}
            </div>
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
        <div className="store-panel-dark grid gap-8 overflow-hidden px-8 py-10 lg:grid-cols-[1fr_1.05fr] lg:px-12">
          <div className="space-y-5">
            <span className="inline-flex w-fit rounded-md border border-white/10 bg-white/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand-light-gray">
              Confianca de marca
            </span>
            <h2 className="max-w-[10ch] font-heading text-4xl leading-[0.92] text-white sm:text-5xl">
              Uma loja premium precisa parecer segura em cada detalhe.
            </h2>
            <p className="max-w-xl text-sm leading-8 text-brand-light-gray sm:text-base">
              {settings.authenticityMessage} {freeShippingThreshold ? `Frete gratis acima de ${freeShippingThreshold}.` : ""}
            </p>
            <Button asChild size="lg" className="h-12 rounded-lg bg-white px-7 text-brand-black hover:bg-brand-off-white">
              <Link href="/autenticidade">Entender nossa garantia</Link>
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

function SocialSection({ data }: { data: HomePageData }) {
  return (
    <section className="store-section-band section-spacing">
      <Container className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Prova social"
            title="Quando a marca parece real, a decisao de compra fica mais facil"
            description="Depoimentos, consistencia visual e produto bem apresentado ajudam a reduzir duvida e elevar a confianca."
          />

          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="store-panel-muted p-6">
                <div className="flex items-center gap-1 text-brand-wine">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={`${testimonial.name}-${index}`} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-base leading-8 text-brand-charcoal">&quot;{testimonial.quote}&quot;</p>
                <div className="mt-4">
                  <p className="font-semibold text-brand-black">{testimonial.name}</p>
                  <p className="text-sm text-brand-warm-gray">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-3">
            {instagramHighlights.map((highlight) => (
              <div key={highlight.title} className="store-panel group overflow-hidden">
                <div className="relative aspect-[4/5.1] overflow-hidden bg-[#ece6e1]">
                  <Image
                    src={highlight.image}
                    alt={highlight.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-3xl leading-none text-brand-black">{highlight.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-brand-charcoal">{highlight.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="store-panel p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Mais comentados"
                title="Modelos que concentram mais atencao e interesse"
                description="Produtos que ajudam a sustentar recorrencia de clique e leitura de desejo na home."
              />
              <Button
                asChild
                variant="outline"
                className="w-fit rounded-lg border-brand-black/10 bg-white/80 text-brand-black hover:bg-white"
              >
                <Link href="/shop?sort=bestsellers">Ver shop</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {data.testimonialProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="rounded-2xl border border-brand-black/8 bg-white/75 p-4 transition hover:border-brand-wine/20"
                >
                  <div className="relative aspect-[4/4.1] overflow-hidden rounded-xl bg-[#ece4de]">
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="33vw" />
                  </div>
                  <div className="mt-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.18em] text-brand-warm-gray">{product.brand}</p>
                    <h3 className="mt-2 font-heading text-3xl leading-none text-brand-black">{product.name}</h3>
                    <p className="mt-2 text-sm text-brand-charcoal">{product.reviewCount} avaliacoes</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
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
              Receba drops, reposicoes e condicoes antes do restante do publico.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-brand-light-gray sm:text-base">
              Um fechamento mais limpo para captar clientes com alta intencao e continuar a conversa mesmo quando a compra nao acontece na primeira visita.
            </p>
          </div>
          <div className="w-full max-w-2xl space-y-4">
            <NewsletterForm />
            <p className="text-xs uppercase tracking-[0.18em] text-brand-light-gray">
              {settings.pixDiscountPercentage}% OFF no PIX, notificacoes seletivas e atendimento rapido.
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
      <EditorialSpotlight
        featuredProduct={data.weekHighlights[0] ?? data.launchProducts[0]}
        supportProducts={[...(data.bestSellers ?? []), ...(data.exclusiveProducts ?? [])]}
      />
      <ShowcaseSection
        eyebrow="Lancamentos"
        title="Os pares novos que puxam clique, desejo e curiosidade logo na entrada"
        description="Uma vitrine principal para destacar o que acabou de chegar com leitura limpa, foto grande e CTA mais evidente."
        products={data.launchProducts}
        href="/drops"
      />
      <SplitMerchandising bestSellers={data.bestSellers} offers={data.offers} />
      <BrandCategorySection data={data} />
      <TrustBand settings={data.settings} />
      <ShowcaseSection
        eyebrow="Sneakers exclusivos"
        title="Escassez elegante para quem compra pela raridade e pela identidade visual"
        description="Produtos mais seletivos apresentados com mais respiro e uma leitura de alto valor percebido."
        products={data.exclusiveProducts}
        href="/shop?highlight=exclusive"
      />
      <SocialSection data={data} />
      <NewsletterSection settings={data.settings} />
    </>
  );
}

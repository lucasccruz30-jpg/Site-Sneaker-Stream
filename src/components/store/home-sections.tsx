import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { NewsletterForm } from "@/components/store/storefront-forms";
import { ProductGrid } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { formatCurrency, getInstallmentText } from "@/lib/format";
import { trustPillars } from "@/lib/site";
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

const topicLinks = [
  {
    eyebrow: "Shop",
    title: "Catalogo completo",
    description: "Marcas, numeracoes, preco e filtros para descoberta mais rapida.",
    href: "/shop",
  },
  {
    eyebrow: "Drops",
    title: "Lancamentos e exclusividades",
    description: "Pares com giro mais rapido, novidade e escassez elegante.",
    href: "/drops",
  },
  {
    eyebrow: "Autenticidade",
    title: "Como garantimos confianca",
    description: "Entenda o processo, atendimento e a leitura profissional da operacao.",
    href: "/autenticidade",
  },
  {
    eyebrow: "Marca",
    title: "Lifestyle e posicionamento",
    description: "Conheca melhor a identidade da Sneaker Stream e o universo da curadoria.",
    href: "/sobre",
  },
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
                  <h1 className="max-w-[10ch] font-heading text-[3.2rem] leading-[0.88] text-white sm:text-[4.5rem] lg:text-[5rem] xl:text-[5.4rem]">
                    {banner.title}
                  </h1>
                  <p className="max-w-xl text-base leading-8 text-brand-light-gray sm:text-lg">
                    {banner.subtitle ??
                      "Sneakers importados para quem compra autenticidade, exclusividade e presenca visual com uma experiencia de compra profissional."}
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
                    <Link href="/drops">Ver drops</Link>
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
                <p className="mt-2 text-sm font-medium text-white">Foto grande, leitura limpa e foco total no produto.</p>
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
                    Um bloco principal para valorizar o produto com mais imagem, mais respiro e uma copy que conduz para a compra sem alongar a home inteira.
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
                    <Link href="/shop?highlight=new">Ver novidade</Link>
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

function TopicHubSection() {
  return (
    <section className="store-section-band section-spacing">
      <Container className="space-y-8">
        <SectionHeading
          eyebrow="Explorar por topico"
          title="Uma home mais curta e paginas mais focadas"
          description="Em vez de concentrar tudo na entrada, organizamos a descoberta por temas para deixar a navegacao mais limpa e objetiva."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {topicLinks.map((topic) => (
            <Link
              key={topic.href}
              href={topic.href}
              className="store-panel group relative overflow-hidden p-6 transition hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(85,13,26,0.12),transparent_34%)] opacity-70 transition group-hover:opacity-100" />
              <div className="relative">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-warm-gray">{topic.eyebrow}</p>
                <h3 className="mt-4 font-heading text-4xl leading-none text-brand-black">{topic.title}</h3>
                <p className="mt-3 text-sm leading-7 text-brand-charcoal">{topic.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-black">
                  Acessar pagina
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
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
              Autenticidade, entrega e atendimento precisam parecer solidos em poucos segundos.
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
      <TopicHubSection />
      <EditorialSpotlight
        featuredProduct={data.weekHighlights[0] ?? data.launchProducts[0]}
        supportProducts={[...(data.bestSellers ?? []), ...(data.exclusiveProducts ?? [])]}
      />
      <ShowcaseSection
        eyebrow="Lancamentos"
        title="Os pares novos que puxam clique e desejo logo na entrada"
        description="Uma unica vitrine de produto na home para manter a pagina mais objetiva e deixar o restante distribuido nas paginas certas."
        products={data.launchProducts}
        href="/drops"
      />
      <TrustBand settings={data.settings} />
      <NewsletterSection settings={data.settings} />
    </>
  );
}

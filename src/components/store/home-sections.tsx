import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { NewsletterForm } from "@/components/store/storefront-forms";
import { ProductGrid } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { formatCurrency, getInstallmentText } from "@/lib/format";
import { trustPillars } from "@/lib/site";
import type { BannerData, HomePageData, ProductCardData, SiteSettingsData } from "@/types";

const quickLinks = [
  { label: "Shop", description: "Catalogo completo", href: "/shop" },
  { label: "Drops", description: "Lancamentos e novidades", href: "/drops" },
  { label: "Autenticidade", description: "Compra com confianca", href: "/autenticidade" },
  { label: "Marca", description: "Posicionamento da loja", href: "/sobre" },
];

const trustSignals = [
  { icon: ShieldCheck, title: "Autenticidade garantida", text: "Conferencia interna antes do envio." },
  { icon: Truck, title: "Envio com rastreio", text: "Operacao segura e acompanhamento claro." },
  { icon: Sparkles, title: "Curadoria premium", text: "Modelos selecionados por desejo e valor percebido." },
];

function HeroBanner({ banner, settings }: { banner: BannerData; settings: SiteSettingsData }) {
  const freeShippingThreshold = settings.freeShippingThresholdCents
    ? formatCurrency(settings.freeShippingThresholdCents)
    : null;

  return (
    <section className="section-spacing pb-8">
      <Container>
        <div className="store-panel-dark overflow-hidden">
          <div className="grid xl:grid-cols-[1.02fr_0.98fr]">
            <div className="flex flex-col justify-between gap-8 p-8 sm:p-10 xl:p-14">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex w-fit rounded-[0.22rem] border border-white/10 bg-white/8 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brand-light-gray">
                    {banner.eyebrow ?? "Sneaker Stream"}
                  </span>
                  <span className="inline-flex rounded-[0.22rem] border border-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand-light-gray">
                    {settings.pixDiscountPercentage}% OFF no PIX
                  </span>
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-[10ch] font-heading text-[3.1rem] leading-[0.88] text-white sm:text-[4.4rem] lg:text-[4.9rem] xl:text-[5.3rem]">
                    {banner.title}
                  </h1>
                  <p className="max-w-xl text-base leading-8 text-brand-light-gray sm:text-lg">
                    {banner.subtitle ??
                      "Sneakers importados para quem compra autenticidade, exclusividade e presenca visual com uma experiencia mais profissional."}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="h-12 rounded-[0.3rem] bg-brand-wine px-7 text-white hover:bg-brand-wine/90">
                    <Link href={banner.ctaHref ?? "/shop"} className="inline-flex items-center gap-2">
                      {banner.ctaLabel ?? "Explorar catalogo"}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-[0.3rem] border-white/12 bg-white/6 px-7 text-white hover:bg-white/10"
                  >
                    <Link href="/autenticidade">Ver garantia</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
                {trustSignals.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="rounded-[0.35rem] border border-white/10 bg-white/[0.04] p-4">
                      <div className="inline-flex size-10 items-center justify-center rounded-[0.25rem] bg-white/[0.06] text-white">
                        <Icon className="size-4" />
                      </div>
                      <p className="mt-4 text-sm font-medium text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-white/80">{item.text}</p>
                    </div>
                  );
                })}
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
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-brand-wine/20" />

              <div className="absolute left-6 top-6 rounded-[0.35rem] border border-white/12 bg-black/32 px-4 py-3">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-brand-light-gray">Selecao da semana</p>
                <p className="mt-2 text-sm font-medium text-white">Foto grande, leitura limpa e foco total no produto.</p>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/78 via-black/28 to-transparent px-6 pb-6 pt-16">
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

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="store-panel group flex items-center justify-between gap-4 px-5 py-4 transition hover:border-brand-black/16"
            >
              <div>
                <p className="text-sm font-medium text-brand-black">{item.label}</p>
                <p className="mt-1 text-sm text-brand-charcoal">{item.description}</p>
              </div>
              <ArrowRight className="size-4 text-brand-black transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeaturedShowcase({
  featuredProduct,
  sideProducts,
}: {
  featuredProduct?: ProductCardData;
  sideProducts: ProductCardData[];
}) {
  if (!featuredProduct) {
    return null;
  }

  return (
    <section className="section-spacing pt-0">
      <Container className="space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Em destaque"
            title="Uma vitrine mais objetiva, com produto no centro da decisao"
            description="Menos blocos institucionais e mais foco no que realmente faz a home vender: imagem forte, produto desejado e caminhos de compra claros."
          />
          <Button asChild variant="outline" className="w-fit rounded-[0.3rem] border-brand-black/10 bg-white/80 text-brand-black hover:bg-white">
            <Link href="/shop">Ver shop</Link>
          </Button>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="store-panel overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[1fr_0.95fr]">
              <div className="relative min-h-[320px] overflow-hidden bg-[#e6ddd5]">
                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>

              <div className="flex flex-col justify-between gap-6 p-7 sm:p-8">
                <div className="space-y-4">
                  <span className="eyebrow-chip">Drop principal</span>
                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-brand-warm-gray">
                      {featuredProduct.brand} / {featuredProduct.category}
                    </p>
                    <h3 className="mt-4 font-heading text-4xl leading-none text-brand-black sm:text-5xl">
                      {featuredProduct.name}
                    </h3>
                    <p className="mt-4 text-sm leading-8 text-brand-charcoal">
                      Um destaque forte para valorizar imagem, preco e narrativa do produto sem encher a home de informacao secundaria.
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
                    <Button asChild className="h-11 rounded-[0.3rem] bg-brand-black text-white hover:bg-brand-charcoal">
                      <Link href={`/shop/${featuredProduct.slug}`}>Ver produto</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-11 rounded-[0.3rem] border-brand-black/10 bg-white/80 text-brand-black hover:bg-white"
                    >
                      <Link href="/drops">Ver drops</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {sideProducts.slice(0, 2).map((product, index) => (
              <Link key={product.id} href={`/shop/${product.slug}`} className="store-panel group overflow-hidden">
                <div className="grid gap-0 sm:grid-cols-[144px_1fr]">
                  <div className="relative min-h-[170px] overflow-hidden bg-[#ece4de]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="144px"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-6">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-warm-gray">
                        {index === 0 ? "Mais vendido" : "Exclusivo"}
                      </p>
                      <h3 className="mt-3 font-heading text-3xl leading-none text-brand-black">{product.name}</h3>
                      <p className="mt-3 text-sm leading-7 text-brand-charcoal">
                        {index === 0
                          ? "Par com boa resposta comercial e alta procura."
                          : "Modelo com escassez mais elegante e leitura premium."}
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
          <Button asChild variant="outline" className="w-fit rounded-[0.3rem] border-brand-black/10 bg-white/80 text-brand-black hover:bg-white">
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
            <span className="inline-flex w-fit rounded-[0.22rem] border border-white/10 bg-white/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand-light-gray">
              Confianca de compra
            </span>
            <h2 className="max-w-2xl font-heading text-4xl leading-[0.92] text-white sm:text-5xl">
              Autenticidade, entrega e atendimento precisam passar seguranca sem excesso de explicacao.
            </h2>
            <p className="max-w-xl text-sm leading-8 text-brand-light-gray sm:text-base">
              {settings.authenticityMessage} {freeShippingThreshold ? `Frete gratis acima de ${freeShippingThreshold}.` : ""}
            </p>
            <Button asChild size="lg" className="h-12 rounded-[0.3rem] bg-white px-7 text-brand-black hover:bg-brand-off-white">
              <Link href="/autenticidade">Entender nossa garantia</Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {trustPillars.map((pillar) => (
              <div key={pillar.title} className="rounded-[0.35rem] border border-white/10 bg-white/[0.05] p-5">
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
            <h2 className="mt-4 max-w-2xl font-heading text-4xl text-white sm:text-5xl">
              Receba drops, reposicoes e condicoes antes do restante do publico.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-brand-light-gray sm:text-base">
              Um fechamento curto para captar clientes com alta intencao sem alongar desnecessariamente a pagina inicial.
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
      <FeaturedShowcase
        featuredProduct={data.weekHighlights[0] ?? data.launchProducts[0]}
        sideProducts={[...(data.bestSellers ?? []), ...(data.exclusiveProducts ?? [])]}
      />
      <ShowcaseSection
        eyebrow="Lancamentos"
        title="Novidades para quem quer chegar rapido no que esta em alta"
        description="Uma unica vitrine de produtos na home, com foco em clique, desejo e caminho direto para a pagina do produto."
        products={data.launchProducts}
        href="/drops"
      />
      <TrustBand settings={data.settings} />
      <NewsletterSection settings={data.settings} />
    </>
  );
}

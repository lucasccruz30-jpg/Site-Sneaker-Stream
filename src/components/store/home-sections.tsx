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
    <section className="section-spacing">
      <Container>
        <div className="hero-glow grid overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#161616] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-14">
            <div className="space-y-6">
              <span className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-brand-light-gray">
                {banner.eyebrow ?? "Sneaker Stream"}
              </span>
              <div className="space-y-5">
                <h1 className="max-w-2xl font-heading text-5xl leading-none text-white sm:text-6xl lg:text-7xl">
                  {banner.title}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-brand-light-gray sm:text-lg">
                  {banner.subtitle ??
                    "Exclusividade, autenticidade e styling premium em uma jornada de compra pensada para conversão."}
                </p>
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid gap-4 text-sm text-brand-light-gray sm:grid-cols-3">
                <div>
                  <p className="text-2xl font-semibold text-white">100%</p>
                  <p>Curadoria premium</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">Drops</p>
                  <p>Edições limitadas</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">PIX</p>
                  <p>Checkout otimizado</p>
                </div>
              </div>
              <Button asChild size="lg" className="h-12 rounded-full bg-brand-wine px-7 text-white hover:bg-brand-wine/90">
                <Link href={banner.ctaHref ?? "/shop"} className="inline-flex items-center gap-2">
                  {banner.ctaLabel ?? "Explorar catálogo"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden">
            <Image
              src={banner.imageUrl ?? "/images/placeholder-product.svg"}
              alt={banner.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-brand-wine/25" />
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
          <Button asChild variant="outline" className="w-fit rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
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

      <section className="section-spacing pt-0">
        <Container className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Autenticidade garantida", text: "Conferência interna em todos os pares." },
            { icon: Truck, title: "Envio seguro", text: "Rastreio e atendimento ativo até a entrega." },
            { icon: CheckCircle2, title: "Compra facilitada", text: "Checkout enxuto, mobile-first e com PIX." },
            { icon: Sparkles, title: "Curadoria premium", text: "Modelos escolhidos pelo desejo e valor percebido." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="surface-panel flex items-start gap-4 p-6">
                <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-wine/15 text-brand-off-white">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-brand-light-gray">{item.text}</p>
                </div>
              </div>
            );
          })}
        </Container>
      </section>

      <ShowcaseSection
        eyebrow="Lançamentos"
        title="Drops recém-chegados para quem compra primeiro"
        description="Modelos com alta procura, leitura premium e forte apelo visual para a vitrine da semana."
        products={data.launchProducts}
        href="/drops"
      />

      <ShowcaseSection
        eyebrow="Mais vendidos"
        title="Os pares que convertem desejo em compra"
        description="Silhuetas com forte aceitação, styling versátil e valor percebido elevado."
        products={data.bestSellers}
        href="/shop?sort=bestsellers"
      />

      <ShowcaseSection
        eyebrow="Ofertas"
        title="Condição especial sem perder posicionamento premium"
        description="Descontos estratégicos em pares com alto valor de marca e ótima saída."
        products={data.offers}
        href="/shop?highlight=sale"
      />

      <section className="section-spacing">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Marcas em destaque"
            title="Nomes que sustentam autenticidade, desejo e status"
            description="Curadoria com força cultural no mercado brasileiro e alta identificação com moda premium."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {data.featuredBrands.map((brand) => (
              <div key={brand.id} className="surface-panel p-6">
                <p className="text-xs uppercase tracking-[0.26em] text-brand-light-gray">Marca</p>
                <h3 className="mt-4 font-heading text-3xl text-white">{brand.name}</h3>
                <p className="mt-3 text-sm leading-7 text-brand-light-gray">{brand.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-spacing bg-black/15">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Categorias"
            title="Navegue pelo estilo que melhor traduz sua identidade"
            description="Uma arquitetura comercial pensada para encurtar a jornada até o clique de compra."
          />
          <div className="grid gap-4 lg:grid-cols-4">
            {data.featuredCategories.map((category, index) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="surface-panel group relative overflow-hidden p-7"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(85,13,26,0.26),transparent_36%)] opacity-80 transition group-hover:opacity-100" />
                <div className="relative">
                  <p className="text-[0.72rem] uppercase tracking-[0.26em] text-brand-light-gray">
                    Categoria {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-5 font-heading text-4xl text-white">{category.name}</h3>
                  <p className="mt-4 text-sm leading-7 text-brand-light-gray">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <ShowcaseSection
        eyebrow="Destaques da semana"
        title="Produtos com forte leitura comercial e styling imediato"
        description="Modelos selecionados para acelerar conversão sem poluir a experiência."
        products={data.weekHighlights}
        href="/shop"
      />

      <ShowcaseSection
        eyebrow="Sneakers exclusivos"
        title="Baixo estoque, alta percepção de valor"
        description="Pares com reposição limitada para clientes que compram primeiro e deixam para usar depois."
        products={data.exclusiveProducts}
        href="/shop?highlight=exclusive"
      />

      <section className="section-spacing">
        <Container className="grid gap-5 lg:grid-cols-4">
          {trustPillars.map((pillar) => (
            <div key={pillar.title} className="surface-panel p-6">
              <h3 className="text-xl font-semibold text-white">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-brand-light-gray">{pillar.description}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="section-spacing bg-black/15">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Depoimentos"
            title="Prova social sem ruído, credibilidade com leitura premium"
            description="Feedbacks que reforçam confiança, autenticidade e atendimento."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="surface-panel p-7">
                <div className="space-y-5">
                  <p className="text-base leading-8 text-brand-off-white/90">“{testimonial.quote}”</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-brand-light-gray">{testimonial.role}</p>
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
            title="Sneakers em contexto de desejo, não só em prateleira"
            description="Conteúdo visual para reforçar marca, estilo e status do produto."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {instagramHighlights.map((highlight) => (
              <div key={highlight.title} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
                <div className="relative aspect-[4/4.8] overflow-hidden">
                  <Image
                    src={highlight.image}
                    alt={highlight.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-3xl text-white">{highlight.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-brand-light-gray">{highlight.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-spacing pt-0">
        <Container>
          <div className="hero-glow surface-panel grid gap-8 overflow-hidden px-8 py-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Lista VIP</p>
              <h2 className="mt-4 font-heading text-4xl text-white sm:text-5xl">
                Receba drops, ofertas e edições limitadas antes do restante do mercado.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-brand-light-gray sm:text-base">
                Captação pensada para aumentar recorrência e recuperar desejo enquanto o cliente ainda está quente.
              </p>
            </div>
            <Button asChild size="lg" className="h-12 rounded-full bg-white px-7 text-brand-black hover:bg-brand-off-white">
              <Link href="/contato">Quero receber os drops</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

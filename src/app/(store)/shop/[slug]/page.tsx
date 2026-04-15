import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { siteConfig } from "@/lib/site";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductDetail } from "@/components/store/product-detail";
import { ProductGrid } from "@/components/store/product-card";
import { ReviewForm } from "@/components/store/storefront-forms";
import { getProductBySlug, getSiteSettings } from "@/server/queries/storefront";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produto nao encontrado",
    };
  }

  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.shortDescription,
    openGraph: {
      title: product.metaTitle ?? product.name,
      description: product.metaDescription ?? product.shortDescription,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSiteSettings()]);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.gallery.map((image) => image.url),
    description: product.metaDescription ?? product.shortDescription,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: ((product.salePriceInCents ?? product.basePriceInCents) / 100).toFixed(2),
      availability:
        product.totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/shop/${product.slug}`,
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.ratingAverage.toFixed(1),
            reviewCount: product.reviewCount,
          }
        : undefined,
  };

  return (
    <section className="section-spacing">
      <Container className="space-y-14">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-brand-warm-gray">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <span>{product.brand}</span>
          <span>/</span>
          <span className="text-brand-black">{product.name}</span>
        </div>

        <ProductDetail product={product} settings={settings} />

        <div className="grid gap-10 xl:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <div className="store-panel space-y-5 p-6 sm:p-8">
              <SectionHeading
                eyebrow="Descricao comercial"
                title="Produto apresentado para vender com mais clareza, contexto e confianca"
                description={product.description}
              />

              <div className="grid gap-3 pt-2">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex flex-col gap-1 rounded-xl border border-brand-black/8 bg-white/75 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm text-brand-charcoal">{spec.label}</span>
                    <span className="text-sm font-medium text-brand-black">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <div className="store-panel-muted p-5">
                <h3 className="font-heading text-3xl text-brand-black">Autenticidade</h3>
                <p className="mt-3 text-sm leading-7 text-brand-charcoal">{settings.authenticityMessage}</p>
              </div>
              <div className="store-panel-muted p-5">
                <h3 className="font-heading text-3xl text-brand-black">Trocas</h3>
                <p className="mt-3 text-sm leading-7 text-brand-charcoal">
                  Politica clara para reduzir inseguranca. O cliente encontra orientacao objetiva antes e depois da compra.
                </p>
              </div>
              <div className="store-panel-muted p-5">
                <h3 className="font-heading text-3xl text-brand-black">Entrega</h3>
                <p className="mt-3 text-sm leading-7 text-brand-charcoal">
                  Despacho em ate {product.leadTimeInBusinessDays} dias uteis com rastreio seguro e leitura mais profissional da operacao.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="store-panel space-y-4 p-6">
              <SectionHeading
                eyebrow="Avaliacoes"
                title="Prova social que reduz duvida na decisao"
                description="Comentarios de clientes e base pronta para avaliacoes reais da operacao."
              />
              {product.reviews.length ? (
                <div className="space-y-4 pt-2">
                  {product.reviews.map((review) => (
                    <article key={review.id} className="rounded-xl border border-brand-black/8 bg-white/75 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-brand-black">{review.userName}</p>
                        <p className="text-sm text-brand-warm-gray">{review.rating}/5</p>
                      </div>
                      {review.title ? <p className="mt-2 text-sm font-medium text-brand-black">{review.title}</p> : null}
                      <p className="mt-2 text-sm leading-7 text-brand-charcoal">{review.comment}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-brand-charcoal">Este produto ainda nao possui avaliacoes aprovadas.</p>
              )}
            </div>

            <ReviewForm product={product} />
          </div>
        </div>

        {product.relatedProducts.length ? (
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Relacionados"
              title="Continue explorando a curadoria com produtos de desejo parecido"
              description="Cross-sell mais sutil, com pares que conversam com a mesma leitura de marca, categoria e estilo."
            />
            <ProductGrid products={product.relatedProducts} />
          </div>
        ) : null}
      </Container>
    </section>
  );
}

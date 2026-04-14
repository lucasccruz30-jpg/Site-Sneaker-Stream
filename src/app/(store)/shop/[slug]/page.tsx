import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductDetail } from "@/components/store/product-detail";
import { ProductGrid } from "@/components/store/product-card";
import { ReviewForm } from "@/components/store/storefront-forms";
import { getProductBySlug } from "@/server/queries/storefront";

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
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="section-spacing">
      <Container className="space-y-14">
        <ProductDetail product={product} />

        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <div className="store-panel space-y-5 p-6">
            <SectionHeading
              eyebrow="Descricao"
              title="Detalhes que sustentam desejo e confianca"
              description={product.description}
            />
            <div className="grid gap-3 pt-4">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex flex-col gap-1 rounded-lg border border-brand-black/8 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-brand-charcoal">{spec.label}</span>
                  <span className="text-sm text-brand-black">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="store-panel space-y-4 p-6">
              <SectionHeading eyebrow="Avaliacoes" title="Prova social" description="Feedback de clientes e compradores recorrentes." />
              {product.reviews.length ? (
                <div className="space-y-4 pt-2">
                  {product.reviews.map((review) => (
                    <article key={review.id} className="rounded-lg border border-brand-black/8 bg-white/70 p-4">
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
              title="Continue explorando a curadoria"
              description="Cross-sell com silhuetas proximas em desejo, estilo e categoria."
            />
            <ProductGrid products={product.relatedProducts} />
          </div>
        ) : null}
      </Container>
    </section>
  );
}

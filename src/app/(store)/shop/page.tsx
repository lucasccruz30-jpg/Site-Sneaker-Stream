import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { CatalogPagination, CatalogSidebar, CatalogToolbar } from "@/components/store/catalog";
import { ProductGrid } from "@/components/store/product-card";
import { getCatalogPageData } from "@/server/queries/storefront";
import type { CatalogSearchInput } from "@/types";

export const metadata: Metadata = {
  title: "Shop",
  description: "Catálogo premium com filtros por marca, categoria, numeração, preço e disponibilidade.",
};

function normalizeSearchParams(searchParams: Record<string, string | string[] | undefined>): CatalogSearchInput {
  return Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = normalizeSearchParams(await searchParams);
  const data = await getCatalogPageData(resolvedSearchParams);
  const totalPages = Math.max(Math.ceil(data.total / data.pageSize), 1);

  const hrefBuilder = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    params.set("page", String(page));
    return `/shop?${params.toString()}`;
  };

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Catálogo premium com filtros pensados para decisão rápida"
        description="Explore os sneakers mais desejados do mercado com busca inteligente, filtros completos e foco total em conversão."
      />
      <section className="section-spacing">
        <Container className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <CatalogSidebar filters={data.filters} searchParams={resolvedSearchParams} />
          <div className="space-y-6">
            <CatalogToolbar total={data.total} searchParams={resolvedSearchParams} />
            {data.products.length ? (
              <>
                <ProductGrid products={data.products} />
                <CatalogPagination currentPage={data.page} totalPages={totalPages} hrefBuilder={hrefBuilder} />
              </>
            ) : (
              <EmptyState
                title="Nenhum produto encontrado"
                description="Ajuste os filtros, teste outra busca ou volte para a curadoria principal."
                actionLabel="Ver catálogo completo"
                actionHref="/shop"
              />
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

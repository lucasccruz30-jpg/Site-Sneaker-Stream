import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { CatalogPagination, CatalogSidebar, CatalogToolbar } from "@/components/store/catalog";
import { ProductGrid } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { getCatalogPageData, getShopDiscoveryData } from "@/server/queries/storefront";
import type { CatalogSearchInput, ShopDiscoveryData } from "@/types";

export const metadata: Metadata = {
  title: "Shop",
  description: "Catalogo premium com filtros por marca, categoria, numeracao, preco e disponibilidade.",
};

function normalizeSearchParams(searchParams: Record<string, string | string[] | undefined>): CatalogSearchInput {
  return Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
}

function ShopTopics({
  categories,
  brands,
}: {
  categories: ShopDiscoveryData["featuredCategories"];
  brands: ShopDiscoveryData["featuredBrands"];
}) {
  return (
    <section className="pb-8">
      <Container className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="store-panel p-6 sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Categorias em destaque</p>
              <h2 className="mt-3 font-heading text-4xl text-brand-black">Explore por universo</h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="hidden rounded-lg border-brand-black/10 bg-white/80 text-brand-black hover:bg-white md:inline-flex"
            >
              <Link href="/drops">Ver drops</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="rounded-2xl border border-brand-black/8 bg-white/72 p-5 transition hover:border-brand-wine/20"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-warm-gray">Categoria</p>
                <h3 className="mt-3 font-heading text-3xl leading-none text-brand-black">{category.name}</h3>
                <p className="mt-3 text-sm leading-7 text-brand-charcoal">
                  {category.description ?? "Curadoria organizada para descoberta mais rapida."}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="store-panel-dark p-6 sm:p-7">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Marcas em destaque</p>
          <h2 className="mt-3 max-w-[11ch] font-heading text-4xl leading-[0.94] text-white">
            Marcas fortes para uma descoberta mais coerente.
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {brands.slice(0, 4).map((brand) => (
              <div key={brand.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                <h3 className="font-heading text-3xl leading-none text-white">{brand.name}</h3>
                <p className="mt-3 text-sm leading-7 text-brand-light-gray">
                  {brand.description ?? "Marca com presenca cultural e leitura premium na curadoria."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = normalizeSearchParams(await searchParams);
  const [data, discoveryData] = await Promise.all([getCatalogPageData(resolvedSearchParams), getShopDiscoveryData()]);
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
        title="Catalogo premium para encontrar o proximo par com menos atrito e mais desejo"
        description="Filtros por marca, numeracao, preco e disponibilidade organizados para acelerar descoberta, comparacao e clique ate a pagina do produto."
      />
      <ShopTopics categories={discoveryData.featuredCategories} brands={discoveryData.featuredBrands} />
      <section className="section-spacing pt-0">
        <Container className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <CatalogSidebar filters={data.filters} searchParams={resolvedSearchParams} />
          <div className="space-y-6">
            <CatalogToolbar total={data.total} searchParams={resolvedSearchParams} filters={data.filters} />
            {data.products.length ? (
              <>
                <ProductGrid products={data.products} />
                <CatalogPagination currentPage={data.page} totalPages={totalPages} hrefBuilder={hrefBuilder} />
              </>
            ) : (
              <EmptyState
                title="Nenhum produto encontrado"
                description="Ajuste os filtros, teste outra busca ou volte para a curadoria principal."
                actionLabel="Ver catalogo completo"
                actionHref="/shop"
              />
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

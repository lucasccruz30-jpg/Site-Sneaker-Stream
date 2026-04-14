import Link from "next/link";

import { CatalogFiltersData, CatalogSearchInput } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CatalogSidebar({
  filters,
  searchParams,
}: {
  filters: CatalogFiltersData;
  searchParams: CatalogSearchInput;
}) {
  return (
    <aside className="surface-panel h-fit space-y-6 p-6">
      <div>
        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Filtros</p>
        <h2 className="mt-3 font-heading text-3xl text-white">Refine sua busca</h2>
      </div>
      <form className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Busca inteligente</label>
          <Input
            name="search"
            defaultValue={searchParams.search}
            placeholder="Nike, Jordan, bordô..."
            className="border-white/10 bg-white/5 text-white placeholder:text-brand-light-gray"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Marca</label>
          <select
            name="brand"
            defaultValue={searchParams.brand ?? ""}
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white"
          >
            <option value="">Todas</option>
            {filters.brands.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Categoria</label>
          <select
            name="category"
            defaultValue={searchParams.category ?? ""}
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white"
          >
            <option value="">Todas</option>
            {filters.categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm text-brand-light-gray">Preço mín.</label>
            <Input
              type="number"
              name="minPrice"
              min={filters.minPriceInCents}
              defaultValue={searchParams.minPrice}
              className="border-white/10 bg-white/5 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-brand-light-gray">Preço máx.</label>
            <Input
              type="number"
              name="maxPrice"
              max={filters.maxPriceInCents}
              defaultValue={searchParams.maxPrice}
              className="border-white/10 bg-white/5 text-white"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Numeração</label>
          <select
            name="size"
            defaultValue={searchParams.size ?? ""}
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white"
          >
            <option value="">Todas</option>
            {filters.sizes.map((size) => (
              <option key={size.id} value={size.label}>
                {size.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Cor</label>
          <Input
            name="color"
            defaultValue={searchParams.color}
            placeholder="Preto, bordô, off-white"
            className="border-white/10 bg-white/5 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Disponibilidade</label>
          <select
            name="availability"
            defaultValue={searchParams.availability ?? ""}
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white"
          >
            <option value="">Todas</option>
            <option value="in-stock">Em estoque</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-light-gray">Destaque</label>
          <select
            name="highlight"
            defaultValue={searchParams.highlight ?? ""}
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white"
          >
            <option value="">Todos</option>
            <option value="new">Lançamentos</option>
            <option value="sale">Ofertas</option>
            <option value="exclusive">Exclusivos</option>
          </select>
        </div>
        <Button type="submit" className="h-11 w-full rounded-full bg-brand-wine text-white hover:bg-brand-wine/90">
          Aplicar filtros
        </Button>
        <Button asChild variant="outline" className="h-11 w-full rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
          <Link href="/shop">Limpar</Link>
        </Button>
      </form>
    </aside>
  );
}

export function CatalogToolbar({ total, searchParams }: { total: number; searchParams: CatalogSearchInput }) {
  return (
    <div className="surface-panel flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Resultados</p>
        <h2 className="mt-2 text-lg font-semibold text-white">{total} produtos encontrados</h2>
      </div>
      <form className="flex flex-col gap-3 sm:flex-row">
        {Object.entries(searchParams).map(([key, value]) =>
          key !== "sort" && value ? <input key={key} type="hidden" name={key} value={value} /> : null,
        )}
        <select
          name="sort"
          defaultValue={searchParams.sort ?? ""}
          className="h-11 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white"
        >
          <option value="">Relevância</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="bestsellers">Mais vendidos</option>
          <option value="newest">Lançamentos</option>
        </select>
        <Button type="submit" variant="outline" className="h-11 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
          Ordenar
        </Button>
      </form>
    </div>
  );
}

export function CatalogPagination({
  currentPage,
  totalPages,
  hrefBuilder,
}: {
  currentPage: number;
  totalPages: number;
  hrefBuilder: (page: number) => string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;
        const active = currentPage === page;
        return (
          <Button
            key={page}
            asChild
            variant={active ? "default" : "outline"}
            className={
              active
                ? "rounded-full bg-brand-wine text-white hover:bg-brand-wine/90"
                : "rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
            }
          >
            <Link href={hrefBuilder(page)}>{page}</Link>
          </Button>
        );
      })}
    </div>
  );
}

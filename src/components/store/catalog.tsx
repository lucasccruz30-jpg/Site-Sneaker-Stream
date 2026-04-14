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
    <aside className="store-panel h-fit space-y-6 p-6">
      <div>
        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Filtros</p>
        <h2 className="mt-3 font-heading text-3xl text-brand-black">Refine sua busca</h2>
      </div>
      <form className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm text-brand-charcoal">Busca inteligente</label>
          <Input name="search" defaultValue={searchParams.search} placeholder="Nike, Jordan, bordo..." className="store-input" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-charcoal">Marca</label>
          <select name="brand" defaultValue={searchParams.brand ?? ""} className="store-select">
            <option value="">Todas</option>
            {filters.brands.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-charcoal">Categoria</label>
          <select name="category" defaultValue={searchParams.category ?? ""} className="store-select">
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
            <label className="text-sm text-brand-charcoal">Preco min.</label>
            <Input type="number" name="minPrice" min={filters.minPriceInCents} defaultValue={searchParams.minPrice} className="store-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-brand-charcoal">Preco max.</label>
            <Input type="number" name="maxPrice" max={filters.maxPriceInCents} defaultValue={searchParams.maxPrice} className="store-input" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-charcoal">Numeracao</label>
          <select name="size" defaultValue={searchParams.size ?? ""} className="store-select">
            <option value="">Todas</option>
            {filters.sizes.map((size) => (
              <option key={size.id} value={size.label}>
                {size.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-charcoal">Cor</label>
          <Input name="color" defaultValue={searchParams.color} placeholder="Preto, bordo, off-white" className="store-input" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-charcoal">Disponibilidade</label>
          <select name="availability" defaultValue={searchParams.availability ?? ""} className="store-select">
            <option value="">Todas</option>
            <option value="in-stock">Em estoque</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-brand-charcoal">Destaque</label>
          <select name="highlight" defaultValue={searchParams.highlight ?? ""} className="store-select">
            <option value="">Todos</option>
            <option value="new">Lancamentos</option>
            <option value="sale">Ofertas</option>
            <option value="exclusive">Exclusivos</option>
          </select>
        </div>
        <Button type="submit" className="h-11 w-full rounded-lg bg-brand-black text-white hover:bg-brand-charcoal">
          Aplicar filtros
        </Button>
        <Button asChild variant="outline" className="h-11 w-full rounded-lg border-brand-black/10 bg-white/70 text-brand-black hover:bg-white">
          <Link href="/shop">Limpar</Link>
        </Button>
      </form>
    </aside>
  );
}

export function CatalogToolbar({ total, searchParams }: { total: number; searchParams: CatalogSearchInput }) {
  return (
    <div className="store-panel flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Resultados</p>
        <h2 className="mt-2 text-lg font-semibold text-brand-black">{total} produtos encontrados</h2>
      </div>
      <form className="flex flex-col gap-3 sm:flex-row">
        {Object.entries(searchParams).map(([key, value]) =>
          key !== "sort" && value ? <input key={key} type="hidden" name={key} value={value} /> : null,
        )}
        <select name="sort" defaultValue={searchParams.sort ?? ""} className="store-select sm:min-w-52">
          <option value="">Relevancia</option>
          <option value="price-asc">Menor preco</option>
          <option value="price-desc">Maior preco</option>
          <option value="bestsellers">Mais vendidos</option>
          <option value="newest">Lancamentos</option>
        </select>
        <Button type="submit" variant="outline" className="h-11 rounded-lg border-brand-black/10 bg-white/70 text-brand-black hover:bg-white">
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
                ? "rounded-lg bg-brand-black text-white hover:bg-brand-charcoal"
                : "rounded-lg border-brand-black/10 bg-white/70 text-brand-black hover:bg-white"
            }
          >
            <Link href={hrefBuilder(page)}>{page}</Link>
          </Button>
        );
      })}
    </div>
  );
}

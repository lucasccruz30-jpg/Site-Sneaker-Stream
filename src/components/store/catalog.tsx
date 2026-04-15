import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";

import { CatalogFiltersData, CatalogSearchInput } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function getActiveFilters(filters: CatalogFiltersData, searchParams: CatalogSearchInput) {
  const brand = filters.brands.find((item) => item.slug === searchParams.brand)?.name;
  const category = filters.categories.find((item) => item.slug === searchParams.category)?.name;

  return [
    searchParams.search ? { key: "search", label: `Busca: ${searchParams.search}` } : null,
    brand ? { key: "brand", label: `Marca: ${brand}` } : null,
    category ? { key: "category", label: `Categoria: ${category}` } : null,
    searchParams.size ? { key: "size", label: `Tam: ${searchParams.size}` } : null,
    searchParams.color ? { key: "color", label: `Cor: ${searchParams.color}` } : null,
    searchParams.highlight ? { key: "highlight", label: `Destaque: ${searchParams.highlight}` } : null,
    searchParams.availability ? { key: "availability", label: "Em estoque" } : null,
    searchParams.minPrice ? { key: "minPrice", label: `Min: R$ ${searchParams.minPrice}` } : null,
    searchParams.maxPrice ? { key: "maxPrice", label: `Max: R$ ${searchParams.maxPrice}` } : null,
  ].filter(Boolean) as Array<{ key: string; label: string }>;
}

function CatalogFilterForm({
  filters,
  searchParams,
  className,
}: {
  filters: CatalogFiltersData;
  searchParams: CatalogSearchInput;
  className?: string;
}) {
  return (
    <form className={className}>
      {searchParams.sort ? <input type="hidden" name="sort" value={searchParams.sort} /> : null}
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm text-brand-charcoal">Busca inteligente</label>
          <Input
            name="search"
            defaultValue={searchParams.search}
            placeholder="Nike, Jordan, bordo, retro..."
            className="store-input"
          />
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
            <label className="text-sm text-brand-charcoal">Preco minimo</label>
            <Input type="number" name="minPrice" min={0} defaultValue={searchParams.minPrice} placeholder="800" className="store-input" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-brand-charcoal">Preco maximo</label>
            <Input type="number" name="maxPrice" min={0} defaultValue={searchParams.maxPrice} placeholder="2500" className="store-input" />
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
          <Input
            name="color"
            defaultValue={searchParams.color}
            placeholder="Preto, bordo, off-white"
            className="store-input"
          />
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

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="submit" className="h-11 rounded-lg bg-brand-black text-white hover:bg-brand-charcoal">
            Aplicar filtros
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-lg border-brand-black/10 bg-white/80 text-brand-black hover:bg-white"
          >
            <Link href="/shop">Limpar</Link>
          </Button>
        </div>
      </div>
    </form>
  );
}

export function CatalogSidebar({
  filters,
  searchParams,
}: {
  filters: CatalogFiltersData;
  searchParams: CatalogSearchInput;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="store-panel sticky top-28 h-fit space-y-6 p-6">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Filtros</p>
          <h2 className="mt-3 font-heading text-3xl text-brand-black">Refine a curadoria</h2>
          <p className="mt-3 text-sm leading-7 text-brand-charcoal">
            Ajuste marca, numeracao, preco e disponibilidade sem perder a leitura premium da vitrine.
          </p>
        </div>
        <CatalogFilterForm filters={filters} searchParams={searchParams} className="space-y-5" />
      </div>
    </aside>
  );
}

function CatalogMobileFilters({
  filters,
  searchParams,
}: {
  filters: CatalogFiltersData;
  searchParams: CatalogSearchInput;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="h-11 rounded-lg border-brand-black/10 bg-white/80 text-brand-black hover:bg-white lg:hidden"
        >
          <SlidersHorizontal className="mr-2 size-4" />
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full border-brand-black/10 bg-[#fbf7f2] text-brand-black sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Refinar catalogo</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <CatalogFilterForm filters={filters} searchParams={searchParams} className="space-y-5" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CatalogActiveFilters({
  filters,
  searchParams,
}: {
  filters: CatalogFiltersData;
  searchParams: CatalogSearchInput;
}) {
  const activeFilters = getActiveFilters(filters, searchParams);

  if (!activeFilters.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map((filter) => {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value && key !== filter.key) {
            params.set(key, value);
          }
        });

        return (
          <Badge
            key={filter.key}
            className="rounded-md border border-brand-black/10 bg-white/90 px-3 py-1 text-[0.72rem] uppercase tracking-[0.14em] text-brand-black"
          >
            <Link href={params.size ? `/shop?${params.toString()}` : "/shop"} className="inline-flex items-center gap-2">
              {filter.label}
              <X className="size-3" />
            </Link>
          </Badge>
        );
      })}
    </div>
  );
}

export function CatalogToolbar({
  total,
  searchParams,
  filters,
}: {
  total: number;
  searchParams: CatalogSearchInput;
  filters: CatalogFiltersData;
}) {
  return (
    <div className="space-y-4">
      <div className="store-panel flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Resultados</p>
            <h2 className="mt-2 text-xl font-semibold text-brand-black">{total} produtos encontrados</h2>
            <p className="mt-2 text-sm leading-7 text-brand-charcoal">
              Catalogo com foco em descoberta rapida, filtros uteis e leitura mais clara de marcas, tamanhos e condicoes.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <CatalogMobileFilters filters={filters} searchParams={searchParams} />
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
              <Button
                type="submit"
                variant="outline"
                className="h-11 rounded-lg border-brand-black/10 bg-white/80 text-brand-black hover:bg-white"
              >
                Ordenar
              </Button>
            </form>
          </div>
        </div>

        <CatalogActiveFilters filters={filters} searchParams={searchParams} />
      </div>
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
                : "rounded-lg border-brand-black/10 bg-white/80 text-brand-black hover:bg-white"
            }
          >
            <Link href={hrefBuilder(page)}>{page}</Link>
          </Button>
        );
      })}
    </div>
  );
}

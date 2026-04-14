import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { getAdminProducts } from "@/server/queries/admin";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="surface-panel p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">Gestão de produtos</p>
          <h2 className="mt-3 font-heading text-4xl text-white">Catálogo</h2>
        </div>
        <Button asChild className="rounded-full bg-brand-wine text-white hover:bg-brand-wine/90">
          <Link href="/admin/produtos/novo">Novo produto</Link>
        </Button>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-white/8 text-sm text-brand-light-gray">
              <th className="pb-3">Produto</th>
              <th className="pb-3">Marca</th>
              <th className="pb-3">Categoria</th>
              <th className="pb-3">Preço</th>
              <th className="pb-3">Estoque</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-white/6 text-sm text-white">
                <td className="py-4">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-brand-light-gray">{product.sku}</p>
                  </div>
                </td>
                <td className="py-4">{product.brand.name}</td>
                <td className="py-4">{product.category.name}</td>
                <td className="py-4">{formatCurrency(product.salePriceInCents ?? product.basePriceInCents)}</td>
                <td className="py-4">{product.variants.reduce((sum, variant) => sum + variant.stock, 0)}</td>
                <td className="py-4">{product.isActive ? "Ativo" : "Inativo"}</td>
                <td className="py-4 text-right">
                  <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <Link href={`/admin/produtos/${product.id}`}>Editar</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

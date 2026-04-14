import { notFound } from "next/navigation";

import { ProductAdminForm } from "@/components/admin/product-form";
import { getAdminCatalogLookups, getAdminProduct } from "@/server/queries/admin";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lookups, product] = await Promise.all([getAdminCatalogLookups(), getAdminProduct(id)]);

  if (!product) {
    notFound();
  }

  return (
    <ProductAdminForm
      initialProduct={product}
      brands={lookups.brands}
      categories={lookups.categories}
      sizes={lookups.sizes}
    />
  );
}

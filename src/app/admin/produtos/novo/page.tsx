import { ProductAdminForm } from "@/components/admin/product-form";
import { getAdminCatalogLookups } from "@/server/queries/admin";

export default async function AdminNewProductPage() {
  const lookups = await getAdminCatalogLookups();

  return (
    <ProductAdminForm
      brands={lookups.brands}
      categories={lookups.categories}
      sizes={lookups.sizes}
    />
  );
}

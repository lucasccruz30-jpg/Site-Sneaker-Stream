import { BrandAdminForm } from "@/components/admin/simple-forms";
import { getAdminBrands } from "@/server/queries/admin";

export default async function AdminBrandsPage() {
  const brands = await getAdminBrands();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <BrandAdminForm />
      {brands.map((brand) => (
        <BrandAdminForm key={brand.id} initialData={brand} />
      ))}
    </div>
  );
}

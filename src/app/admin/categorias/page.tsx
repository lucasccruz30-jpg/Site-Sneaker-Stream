import { CategoryAdminForm } from "@/components/admin/simple-forms";
import { getAdminCategories } from "@/server/queries/admin";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <CategoryAdminForm />
      {categories.map((category) => (
        <CategoryAdminForm key={category.id} initialData={category} />
      ))}
    </div>
  );
}

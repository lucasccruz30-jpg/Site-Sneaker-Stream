import { ContentPageAdminForm } from "@/components/admin/simple-forms";
import { getAdminContentPages } from "@/server/queries/admin";

export default async function AdminContentPage() {
  const contentPages = await getAdminContentPages();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ContentPageAdminForm />
      {contentPages.map((page) => (
        <ContentPageAdminForm key={page.id} initialData={page} />
      ))}
    </div>
  );
}

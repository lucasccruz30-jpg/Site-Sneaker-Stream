import { BannerAdminForm } from "@/components/admin/simple-forms";
import { getAdminBanners } from "@/server/queries/admin";

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <BannerAdminForm />
      {banners.map((banner) => (
        <BannerAdminForm key={banner.id} initialData={banner} />
      ))}
    </div>
  );
}

import { SettingsAdminForm } from "@/components/admin/simple-forms";
import { getAdminSettings } from "@/server/queries/admin";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return <SettingsAdminForm initialData={settings} />;
}

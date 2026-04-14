import { HomePageSections } from "@/components/store/home-sections";
import { getHomePageData } from "@/server/queries/storefront";

export default async function HomePage() {
  const data = await getHomePageData();

  return <HomePageSections data={data} />;
}

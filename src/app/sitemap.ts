import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/shop",
    "/drops",
    "/sobre",
    "/contato",
    "/faq",
    "/autenticidade",
    "/politica-de-entrega",
    "/politica-de-troca-e-devolucao",
    "/politica-de-privacidade",
    "/termos-de-uso",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    return [
      ...staticRoutes,
      ...products.map((product) => ({
        url: `${siteConfig.url}/shop/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}

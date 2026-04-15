export const storefrontCache = {
  revalidate: 300,
  shortRevalidate: 120,
  tags: {
    settings: "storefront:settings",
    banners: "storefront:banners",
    home: "storefront:home",
    catalog: "storefront:catalog",
    products: "storefront:products",
    discovery: "storefront:discovery",
    recommendations: "storefront:recommendations",
    drops: "storefront:drops",
    content: "storefront:content",
  },
} as const;

import type { MetadataRoute } from "next";
import { getAllGoodSlugs } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

// Пересобираем не чаще раза в час.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: string[] = [];
  try {
    slugs = await getAllGoodSlugs();
  } catch {
    // API недоступен — отдаём хотя бы главную, без падения роута.
    slugs = [];
  }

  const products: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...products,
  ];
}

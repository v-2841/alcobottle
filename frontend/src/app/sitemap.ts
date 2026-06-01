import type { MetadataRoute } from "next";
import { getAllGoodSlugs } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

// Считаем в рантайме: SITE_URL/API_BASE приходят из окружения контейнера,
// а бэкенд при сборке образа недоступен.
export const dynamic = "force-dynamic";

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

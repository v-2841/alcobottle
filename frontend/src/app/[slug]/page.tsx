import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/Catalog";
import { getGood } from "@/lib/api";
import { buildCatalogHref } from "@/lib/query";

type Props = { params: Promise<{ slug: string }> };

// Динамические SEO-теги: title = название товара, description = seo_description.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const good = await getGood(slug);
  if (!good) return { title: "Товар не найден" };
  return {
    title: good.name,
    description: good.seo_description,
    openGraph: {
      title: good.name,
      description: good.seo_description,
      images: good.image ? [good.image] : undefined,
    },
  };
}

// Прямой заход по ссылке: каталог отфильтрован по категории товара + попап поверх.
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const good = await getGood(slug);
  if (!good) notFound();

  return (
    <Catalog
      query={{ category: good.category.name }}
      initialProduct={good}
      initialCloseHref={buildCatalogHref({}, { category: good.category.name })}
    />
  );
}

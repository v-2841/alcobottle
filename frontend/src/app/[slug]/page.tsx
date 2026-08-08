import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/Catalog";
import { getGood } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { buildCatalogHref } from "@/lib/query";

/** «0.700» → «0,7 л»: в сниппете объём важнее любых эпитетов. */
function volumeLabel(volume: number | string): string {
  const n = typeof volume === "string" ? parseFloat(volume) : volume;
  return Number.isFinite(n) ? `${n.toLocaleString("ru-RU")} л` : `${volume} л`;
}

type Props = { params: Promise<{ slug: string }> };

// Динамические SEO-теги: title = название товара, description = seo_description.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const good = await getGood(slug);
  if (!good) return { title: "Товар не найден" };

  // В сниппете сначала факты (объём, категория, производитель, цена),
  // потом описание: с 30-40 позиции кликают по конкретике, а не по эпитетам.
  const title = `${good.name}, ${volumeLabel(good.volume)}`;
  const facts = [
    good.category.name,
    good.manufacturer.name,
    volumeLabel(good.volume),
    formatPrice(good.price),
  ].join(" · ");
  const description = `${facts}. ${good.seo_description}`.slice(0, 300);

  return {
    title,
    description,
    alternates: { canonical: `/${good.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${good.slug}`,
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
      heading={null}
      initialProduct={good}
      initialCloseHref={buildCatalogHref({}, { category: good.category.name })}
    />
  );
}

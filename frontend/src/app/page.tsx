import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";
import { parseGoodsQuery, type RawSearchParams } from "@/lib/query";

type Props = { searchParams: Promise<RawSearchParams> };

// Динамические SEO-теги каталога в зависимости от фильтров в URL.
// Без фильтров — статические из layout.
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const q = parseGoodsQuery(await searchParams);
  const parts: string[] = [];
  if (q.category) parts.push(q.category);
  if (q.manufacturer) parts.push(q.manufacturer);
  if (q.search) parts.push(`Поиск «${q.search}»`);

  if (parts.length === 0) return {};

  const title = parts.join(" · ");
  return {
    title,
    description: `${title} — каталог премиального алкоголя Alcobottle. Доставка по Москве и области.`,
  };
}

export default async function HomePage({ searchParams }: Props) {
  const query = parseGoodsQuery(await searchParams);
  return <Catalog query={query} />;
}

import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";
import {
  goodsQueryToString,
  parseGoodsQuery,
  type RawSearchParams,
} from "@/lib/query";

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

  const canonicalQuery = goodsQueryToString(q);
  const canonical = canonicalQuery ? `/?${canonicalQuery}` : "/";
  if (parts.length === 0) {
    return { alternates: { canonical } };
  }

  const title = parts.join(" · ");
  return {
    title,
    description: `${title} — каталог премиального алкоголя Alcobottle. Доставка по Москве и области.`,
    alternates: { canonical },
  };
}

export default async function HomePage({ searchParams }: Props) {
  const query = parseGoodsQuery(await searchParams);
  return <Catalog query={query} />;
}

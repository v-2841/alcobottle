import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";
import { parseGoodsQuery, type RawSearchParams } from "@/lib/query";
import type { GoodsQuery } from "@/lib/types";

type Props = { searchParams: Promise<RawSearchParams> };

/** Заголовок страницы: он же <h1> каталога. */
function headingFor(q: GoodsQuery): string {
  const parts: string[] = [];
  if (q.category) parts.push(q.category);
  if (q.manufacturer) parts.push(q.manufacturer);
  if (q.search) parts.push(`Поиск «${q.search}»`);
  return parts.length > 0
    ? parts.join(" · ")
    : "Каталог премиального алкоголя";
}

// Фильтры, поиск и сортировка дают тонкие дубли каталога: они получают
// noindex, но остаются follow — робот продолжает ходить по ссылкам на товары.
// Индексируется только чистая пагинация: это его путь ко всем карточкам.
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const q = parseGoodsQuery(await searchParams);
  const filtered = Boolean(
    q.category || q.manufacturer || q.search || q.ordering,
  );
  const canonical =
    !filtered && q.page && q.page > 1 ? `/?page=${q.page}` : "/";

  if (!filtered) {
    return { alternates: { canonical } };
  }

  const title = headingFor(q);
  return {
    title,
    description:
      `${title} — раздел каталога Alcobottle: характеристики, объём ` +
      "и справочные цены.",
    alternates: { canonical },
    robots: { index: false, follow: true },
  };
}

export default async function HomePage({ searchParams }: Props) {
  const query = parseGoodsQuery(await searchParams);
  return <Catalog query={query} heading={headingFor(query)} />;
}

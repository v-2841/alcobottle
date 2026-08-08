import type { GoodsQuery, Sort } from "./types";

const SORTS: readonly Sort[] = ["price", "-price", "name", "-name"];

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Разбор searchParams страницы в типизированный запрос к API. */
export function parseGoodsQuery(sp: RawSearchParams): GoodsQuery {
  const pageNum = Number(first(sp.page));
  const ordering = first(sp.ordering);
  return {
    page: Number.isFinite(pageNum) && pageNum > 1 ? pageNum : 1,
    search: first(sp.search)?.trim() || undefined,
    category: first(sp.category) || undefined,
    manufacturer: first(sp.manufacturer) || undefined,
    // Значения вне списка допустимых игнорируем: мусор из URL не уедет в API.
    ordering: SORTS.includes(ordering as Sort) ? (ordering as Sort) : undefined,
  };
}

/**
 * Query-строка для запросов к catalog-data (включает ordering — серверная
 * сортировка). Используется клиентом при смене сортировки и «Показать ещё».
 */
export function goodsQueryToString(query: GoodsQuery): string {
  const params = new URLSearchParams();
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.manufacturer) params.set("manufacturer", query.manufacturer);
  if (query.ordering) params.set("ordering", query.ordering);
  return params.toString();
}

type QueryUpdates = Partial<Record<keyof GoodsQuery, string | undefined>>;

/**
 * Ссылка на каталог (главную) с применёнными фильтрами.
 * Сортировка сохраняется — иначе она молча слетала при смене фильтра.
 * Пагинация сбрасывается на первую страницу.
 */
export function buildCatalogHref(
  current: GoodsQuery,
  updates: QueryUpdates = {},
): string {
  const merged = {
    ...current,
    ...updates,
    page: undefined,
  } as GoodsQuery;
  const qs = goodsQueryToString(merged);
  return qs ? `/?${qs}` : "/";
}

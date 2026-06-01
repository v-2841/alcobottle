import type {
  Category,
  Good,
  GoodsQuery,
  Manufacturer,
  Paginated,
} from "./types";

/** База Django API. Серверные запросы Next ходят сюда напрямую. */
export const API_BASE = process.env.API_BASE ?? "http://localhost:8000";

function buildGoodsParams(query: GoodsQuery): string {
  const params = new URLSearchParams();
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.manufacturer) params.set("manufacturer", query.manufacturer);
  if (query.ordering) params.set("ordering", query.ordering);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function apiGet<T>(path: string, revalidate: number | false): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    ...(revalidate === false
      ? { cache: "no-store" }
      : { next: { revalidate } }),
  });
  if (!res.ok) {
    throw new Error(`API ${path} → ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Список товаров (постранично). Всегда свежий — отражает фильтры/остатки. */
export function getGoods(query: GoodsQuery = {}): Promise<Paginated<Good>> {
  return apiGet<Paginated<Good>>(`/api/goods/${buildGoodsParams(query)}`, false);
}

/** Товар по слагу. */
export async function getGood(slug: string): Promise<Good | null> {
  try {
    return await apiGet<Good>(`/api/goods/${encodeURIComponent(slug)}/`, 300);
  } catch {
    return null;
  }
}

/** Слаги всех активных товаров (для sitemap). Идём по страницам, пока есть next. */
export async function getAllGoodSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  for (;;) {
    const data = await apiGet<Paginated<Good>>(`/api/goods/?page=${page}`, 3600);
    for (const g of data.results) slugs.push(g.slug);
    if (!data.next) break;
    page += 1;
  }
  return slugs;
}

/** Категории (полный список для фильтров). */
export function getCategories(): Promise<Category[]> {
  return apiGet<Category[]>(`/api/categories/`, 300);
}

/** Производители (полный список для фильтров). */
export function getManufacturers(): Promise<Manufacturer[]> {
  return apiGet<Manufacturer[]>(`/api/manufacturers/`, 300);
}

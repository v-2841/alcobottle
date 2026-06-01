export interface Category {
  id: number;
  name: string;
}

export interface Manufacturer {
  id: number;
  name: string;
}

export interface Good {
  id: number;
  name: string;
  slug: string;
  seo_description: string;
  description: string;
  tasting: string;
  volume: number | string;
  price: number;
  stock: number;
  image: string | null;
  category: Category;
  manufacturer: Manufacturer;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Сортировка (серверная, в URL страницы не пишется — только в запрос к API). */
export type Sort = "price" | "-price" | "name" | "-name";

export interface GoodsQuery {
  page?: number;
  search?: string;
  category?: string;
  manufacturer?: string;
  ordering?: Sort;
}

"use client";

import { useState } from "react";
import { goodsQueryToString } from "@/lib/query";
import type {
  Category,
  Good,
  GoodsQuery,
  Manufacturer,
  Paginated,
  Sort,
} from "@/lib/types";
import { Chips } from "./Chips";
import { FilterBar } from "./FilterBar";
import { ProductList } from "./ProductList";
import { ProductModalProvider } from "./ProductModalProvider";

export function CatalogContent({
  initial,
  totalCount,
  current,
  categories,
  manufacturers,
  initialProduct = null,
  initialCloseHref,
}: {
  initial: Good[];
  totalCount: number;
  current: GoodsQuery;
  categories: Category[];
  manufacturers: Manufacturer[];
  initialProduct?: Good | null;
  initialCloseHref?: string;
}) {
  // Сортировка — клиентский стейт (в URL не пишется), но сортирует сервер.
  const [sort, setSort] = useState<Sort>("price");
  const [items, setItems] = useState<Good[]>(initial);
  const [count, setCount] = useState(totalCount);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Сервер сортирует ВСЕ товары и пагинирует; "price" — дефолт бэка (без параметра).
  async function fetchPage(nextPage: number, ord: Sort): Promise<Paginated<Good>> {
    const qs = goodsQueryToString({
      ...current,
      ordering: ord === "price" ? undefined : ord,
      page: nextPage,
    });
    const res = await fetch(`/api/catalog?${qs}`);
    if (!res.ok) throw new Error("load failed");
    return res.json();
  }

  async function changeSort(next: Sort) {
    if (next === sort) return;
    setSort(next);
    setLoading(true);
    setError(false);
    try {
      const data = await fetchPage(1, next);
      setItems(data.results);
      setCount(data.count);
      setPage(1);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchPage(page + 1, sort);
      setItems((prev) => [...prev, ...data.results]);
      setPage((p) => p + 1);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProductModalProvider
      initialProduct={initialProduct}
      initialCloseHref={initialCloseHref}
    >
      <div className="mt-6 flex flex-col gap-4">
        <FilterBar
          categories={categories.map((c) => c.name)}
          manufacturers={manufacturers.map((m) => m.name)}
          current={current}
          sort={sort}
          onSortChange={changeSort}
        />
        <Chips current={current} />
      </div>

      <div className="mt-6">
        <ProductList
          items={items}
          count={count}
          loading={loading}
          error={error}
          onLoadMore={loadMore}
        />
      </div>
    </ProductModalProvider>
  );
}

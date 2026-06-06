"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  siteUrl,
}: {
  initial: Good[];
  totalCount: number;
  current: GoodsQuery;
  categories: Category[];
  manufacturers: Manufacturer[];
  initialProduct?: Good | null;
  initialCloseHref?: string;
  siteUrl: string;
}) {
  // Сортировка — клиентский стейт (в URL не пишется), но сортирует сервер.
  const [sort, setSort] = useState<Sort>("price");
  const [items, setItems] = useState<Good[]>(initial);
  const [count, setCount] = useState(totalCount);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const hasMore = items.length < count;

  // Игнорируем ответы устаревших запросов: применяем только результат последнего.
  const reqId = useRef(0);

  const resetCatalogState = useCallback(() => {
    reqId.current += 1;
    setSort("price");
    setItems(initial);
    setCount(totalCount);
    setPage(1);
    setLoading(false);
    setError(false);
  }, [initial, totalCount]);

  // Сервер сортирует ВСЕ товары и пагинирует; "price" — дефолт бэка (без параметра).
  const fetchPage = useCallback(async (
    nextPage: number,
    ord: Sort,
  ): Promise<Paginated<Good>> => {
    const qs = goodsQueryToString({
      ...current,
      ordering: ord === "price" ? undefined : ord,
      page: nextPage,
    });
    const res = await fetch(`/catalog-data?${qs}`);
    if (!res.ok) throw new Error("load failed");
    return res.json();
  }, [current]);

  useEffect(() => {
    window.addEventListener("alcobottle:catalog-reset", resetCatalogState);
    return () => {
      window.removeEventListener("alcobottle:catalog-reset", resetCatalogState);
    };
  }, [resetCatalogState]);

  async function changeSort(next: Sort) {
    if (next === sort) return;
    setSort(next);
    setLoading(true);
    setError(false);
    const id = ++reqId.current;
    try {
      const data = await fetchPage(1, next);
      if (id !== reqId.current) return;
      setItems(data.results);
      setCount(data.count);
      setPage(1);
    } catch {
      if (id === reqId.current) setError(true);
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }

  const loadMore = useCallback(async (force = false) => {
    if (loading || (!force && error) || !hasMore) return;
    setLoading(true);
    setError(false);
    const id = ++reqId.current;
    try {
      const data = await fetchPage(page + 1, sort);
      if (id !== reqId.current) return;
      setItems((prev) => [...prev, ...data.results]);
      setPage((p) => p + 1);
    } catch {
      if (id === reqId.current) setError(true);
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, [error, fetchPage, hasMore, loading, page, sort]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loading || error) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, error, loadMore]);

  return (
    <ProductModalProvider
      initialProduct={initialProduct}
      initialCloseHref={initialCloseHref}
      siteUrl={siteUrl}
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
          sentinelRef={sentinelRef}
          onRetry={() => void loadMore(true)}
        />
      </div>
    </ProductModalProvider>
  );
}

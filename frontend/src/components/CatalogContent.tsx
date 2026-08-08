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
  initialPage,
  initialHasNext,
  current,
  categories,
  manufacturers,
  initialProduct = null,
  initialCloseHref,
  siteUrl,
}: {
  initial: Good[];
  totalCount: number;
  initialPage: number;
  initialHasNext: boolean;
  current: GoodsQuery;
  categories: Category[];
  manufacturers: Manufacturer[];
  initialProduct?: Good | null;
  initialCloseHref?: string;
  siteUrl: string;
}) {
  // Сортировка живёт в URL, поэтому переживает смену фильтров.
  const sort: Sort = current.ordering ?? "price";
  const [items, setItems] = useState<Good[]>(initial);
  const [count, setCount] = useState(totalCount);
  // Последняя ЗАГРУЖЕННАЯ страница. Это НЕ номер страницы из адреса:
  // автоподгрузка увеличивает его, не меняя URL.
  const [loadedPage, setLoadedPage] = useState(initialPage);
  const [hasNext, setHasNext] = useState(initialHasNext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const hasMore = hasNext;

  // Игнорируем ответы устаревших запросов: применяем только результат последнего.
  const reqId = useRef(0);

  const resetCatalogState = useCallback(() => {
    reqId.current += 1;
    setItems(initial);
    setCount(totalCount);
    setLoadedPage(initialPage);
    setHasNext(initialHasNext);
    setLoading(false);
    setError(false);
  }, [initial, initialHasNext, initialPage, totalCount]);

  // Сервер сортирует ВСЕ товары и пагинирует; "price" — дефолт бэка (без параметра).
  const fetchPage = useCallback(async (
    nextPage: number,
  ): Promise<Paginated<Good>> => {
    const qs = goodsQueryToString({
      ...current,
      ordering: sort === "price" ? undefined : sort,
      page: nextPage,
    });
    const res = await fetch(`/catalog-data?${qs}`);
    if (!res.ok) throw new Error("load failed");
    return res.json();
  }, [current, sort]);

  useEffect(() => {
    window.addEventListener("alcobottle:catalog-reset", resetCatalogState);
    return () => {
      window.removeEventListener("alcobottle:catalog-reset", resetCatalogState);
    };
  }, [resetCatalogState]);

  const loadMore = useCallback(async (force = false) => {
    if (loading || (!force && error) || !hasMore) return;
    setLoading(true);
    setError(false);
    const id = ++reqId.current;
    try {
      const data = await fetchPage(loadedPage + 1);
      if (id !== reqId.current) return;
      setItems((prev) => [...prev, ...data.results]);
      setLoadedPage((p) => p + 1);
      setHasNext(data.next !== null);
    } catch {
      if (id === reqId.current) setError(true);
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, [error, fetchPage, hasMore, loadedPage, loading]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loading || error) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      // 800px при 12 товарах на страницу срабатывали ещё до того, как
      // предыдущая порция уходила из зоны видимости — каталог грузился каскадом.
      { rootMargin: "200px 0px" },
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
        />
        <Chips current={current} />
      </div>

      <div className="mt-6">
        <ProductList
          items={items}
          count={count}
          current={current}
          basePage={current.page ?? 1}
          nextPage={loadedPage + 1}
          hasMore={hasMore}
          loading={loading}
          error={error}
          sentinelRef={sentinelRef}
          onRetry={() => void loadMore(true)}
        />
      </div>
    </ProductModalProvider>
  );
}

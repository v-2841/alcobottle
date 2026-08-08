"use client";

import Link from "next/link";
import type { RefObject } from "react";
import { goodsQueryToString } from "@/lib/query";
import type { Good, GoodsQuery } from "@/lib/types";
import { ProductCard } from "./ProductCard";

function pageHref(current: GoodsQuery, page: number): string {
  const qs = goodsQueryToString({ ...current, page });
  return qs ? `/?${qs}` : "/";
}

export function ProductList({
  items,
  count,
  current,
  basePage,
  nextPage,
  hasMore,
  loading,
  error,
  sentinelRef,
  onRetry,
}: {
  items: Good[];
  count: number;
  current: GoodsQuery;
  /** Номер страницы из адреса — от него считается ссылка «назад». */
  basePage: number;
  /** Первая ещё не загруженная страница — на неё ведёт ссылка «вперёд». */
  nextPage: number;
  hasMore: boolean;
  loading: boolean;
  error: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
  onRetry: () => void;
}) {
  if (items.length === 0) {
    return (
      <div className="py-20 text-center text-ink/50">
        По вашему запросу ничего не найдено.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((g) => (
          <ProductCard key={g.id} good={g} />
        ))}
      </div>

      {hasMore && !error && (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          className="h-10 w-full"
        />
      )}

      {loading && (
        <p className="text-sm text-ink/40">Загрузка…</p>
      )}

      {error && hasMore && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-cta-gradient px-8 py-2.5 text-base text-ink shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          Повторить
        </button>
      )}

      {error && (
        <p className="text-sm text-wine">
          Не удалось загрузить. Попробуйте ещё раз.
        </p>
      )}

      <nav aria-label="Страницы каталога" className="flex gap-4 text-sm">
        {basePage > 1 && (
          <Link
            href={pageHref(current, basePage - 1)}
            className="font-medium text-wine hover:underline"
          >
            Предыдущая страница
          </Link>
        )}
        {hasMore && (
          <Link
            href={pageHref(current, nextPage)}
            className="font-medium text-wine hover:underline"
          >
            Следующая страница
          </Link>
        )}
      </nav>

      <p className="text-xs text-ink/40">
        Показано {items.length} из {count}
      </p>
    </div>
  );
}

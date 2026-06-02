"use client";

import type { RefObject } from "react";
import type { Good } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductList({
  items,
  count,
  loading,
  error,
  sentinelRef,
  onRetry,
}: {
  items: Good[];
  count: number;
  loading: boolean;
  error: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
  onRetry: () => void;
}) {
  const hasMore = items.length < count;

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

      <p className="text-xs text-ink/40">
        Показано {items.length} из {count}
      </p>
    </div>
  );
}

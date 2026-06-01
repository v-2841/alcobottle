"use client";

import type { Good } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductList({
  items,
  count,
  loading,
  error,
  onLoadMore,
}: {
  items: Good[];
  count: number;
  loading: boolean;
  error: boolean;
  onLoadMore: () => void;
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

      {hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loading}
          className="rounded-xl bg-cta-gradient px-8 py-2.5 text-base text-ink shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Загрузка…" : "Показать ещё"}
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

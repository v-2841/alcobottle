"use client";

import { useRouter } from "next/navigation";
import { buildCatalogHref } from "@/lib/query";
import type { GoodsQuery } from "@/lib/types";
import { CloseIcon } from "./icons";

export function Chips({ current }: { current: GoodsQuery }) {
  const router = useRouter();

  const chips: { key: keyof GoodsQuery; label: string }[] = [];
  if (current.category)
    chips.push({ key: "category", label: `Категории: ${current.category}` });
  if (current.manufacturer)
    chips.push({
      key: "manufacturer",
      label: `Производители: ${current.manufacturer}`,
    });
  if (current.search)
    chips.push({ key: "search", label: `Поиск: ${current.search}` });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => router.push(buildCatalogHref(current, { [c.key]: undefined }))}
          className="inline-flex h-8 items-center gap-2 rounded-lg bg-wine px-3 text-sm text-cream transition-colors hover:bg-wine-dark"
        >
          <span className="max-w-[240px] truncate">{c.label}</span>
          <CloseIcon className="size-4 shrink-0" />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-xs text-ink/50 underline underline-offset-2 hover:text-wine"
        >
          Сбросить всё
        </button>
      )}
    </div>
  );
}

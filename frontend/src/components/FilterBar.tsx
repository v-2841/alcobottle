"use client";

import { useRouter } from "next/navigation";
import { buildCatalogHref } from "@/lib/query";
import type { GoodsQuery } from "@/lib/types";
import { Dropdown, type Option } from "./Dropdown";
import { FilterIcon, SortIcon } from "./icons";
import { MobileFilters } from "./MobileFilters";

const SORT_OPTIONS: Option[] = [
  { label: "Сначала дешёвые", value: "price" },
  { label: "Сначала дорогие", value: "-price" },
  { label: "По названию: А–Я", value: "name" },
  { label: "По названию: Я–А", value: "-name" },
];

export function FilterBar({
  categories,
  manufacturers,
  current,
}: {
  categories: string[];
  manufacturers: string[];
  current: GoodsQuery;
}) {
  const router = useRouter();
  const go = (updates: Partial<Record<keyof GoodsQuery, string | undefined>>) =>
    router.push(buildCatalogHref(current, updates));

  const categoryOptions: Option[] = [
    { label: "Все категории", value: null },
    ...categories.map((c) => ({ label: c, value: c })),
  ];
  const manufacturerOptions: Option[] = [
    { label: "Все производители", value: null },
    ...manufacturers.map((m) => ({ label: m, value: m })),
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Сортировка живёт в URL: переживает смену фильтров и шарится ссылкой */}
      <Dropdown
        icon={<SortIcon className="size-4" />}
        options={SORT_OPTIONS}
        selected={current.ordering ?? "price"}
        active={false}
        compact
        onSelect={(v) => go({ ordering: !v || v === "price" ? undefined : v })}
      />

      {/* Десктоп: два отдельных дропдауна */}
      <div className="hidden items-center gap-3 md:flex">
        <Dropdown
          icon={<FilterIcon className="size-4" />}
          options={categoryOptions}
          selected={current.category ?? null}
          align="right"
          onSelect={(v) => go({ category: v ?? undefined })}
        />
        <Dropdown
          icon={<FilterIcon className="size-4" />}
          options={manufacturerOptions}
          selected={current.manufacturer ?? null}
          align="right"
          onSelect={(v) => go({ manufacturer: v ?? undefined })}
        />
      </div>

      {/* Мобайл: одна кнопка → попап со сворачиваемыми секциями */}
      <div className="md:hidden">
        <MobileFilters
          categories={categories}
          manufacturers={manufacturers}
          current={current}
        />
      </div>
    </div>
  );
}

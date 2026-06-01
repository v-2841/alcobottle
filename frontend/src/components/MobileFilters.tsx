"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { buildCatalogHref } from "@/lib/query";
import type { GoodsQuery } from "@/lib/types";
import { ChevronDown, FilterIcon } from "./icons";

/**
 * Мобильные фильтры (макет «dropdown filters», Type=Mob):
 * одна иконка-кнопка → попап со сворачиваемыми секциями
 * «Категории»/«Производители». Выбор одиночный (radio) и применяется сразу.
 */
export function MobileFilters({
  categories,
  manufacturers,
  current,
}: {
  categories: string[];
  manufacturers: string[];
  current: GoodsQuery;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(true);
  const [manOpen, setManOpen] = useState(true);
  const active = Boolean(current.category || current.manufacturer);

  // Закрытие по клику вне и Escape.
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // null = «Все» (сброс фильтра). Применяется сразу одним переходом по URL.
  function select(key: "category" | "manufacturer", value: string | null) {
    const next = value ?? undefined;
    if (next === current[key]) return;
    setOpen(false);
    router.push(buildCatalogHref(current, { [key]: next }));
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Фильтры"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`grid size-8 place-items-center rounded-lg border border-rose text-ink transition-colors ${
          active ? "bg-blush" : "bg-cream-50"
        }`}
      >
        <FilterIcon className="size-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-64 rounded-2xl border border-rose bg-blush p-3 shadow-xl">
          <Section
            title="Категории"
            allLabel="Все категории"
            expanded={catOpen}
            onToggle={() => setCatOpen((o) => !o)}
            options={categories}
            selected={current.category ?? null}
            onSelect={(v) => select("category", v)}
          />
          <Section
            title="Производители"
            allLabel="Все производители"
            expanded={manOpen}
            onToggle={() => setManOpen((o) => !o)}
            options={manufacturers}
            selected={current.manufacturer ?? null}
            onSelect={(v) => select("manufacturer", v)}
          />
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  allLabel,
  expanded,
  onToggle,
  options,
  selected,
  onSelect,
}: {
  title: string;
  allLabel: string;
  expanded: boolean;
  onToggle: () => void;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  // «Все» (value=null) первым пунктом + сами опции.
  const rows: { label: string; value: string | null }[] = [
    { label: allLabel, value: null },
    ...options.map((o) => ({ label: o, value: o })),
  ];

  return (
    <div className="border-b border-rose/50 py-2 last-of-type:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-2 text-left text-sm font-bold text-ink"
      >
        {title}
        <ChevronDown
          className={`size-4 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <ul role="radiogroup" className="mt-1.5 flex flex-col">
          {rows.map((row) => {
            const checked = selected === row.value;
            return (
              <li key={row.value ?? "__all"}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => onSelect(row.value)}
                  className="flex w-full items-center justify-between gap-3 py-1.5 text-left text-sm text-ink"
                >
                  <span className="truncate">{row.label}</span>
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-full border bg-cream transition-colors ${
                      checked ? "border-wine" : "border-rose"
                    }`}
                  >
                    {checked && <span className="size-2.5 rounded-full bg-wine" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

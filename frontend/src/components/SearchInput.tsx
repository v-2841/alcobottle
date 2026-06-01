"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { buildCatalogHref } from "@/lib/query";
import type { GoodsQuery } from "@/lib/types";
import { SearchIcon } from "./icons";

export function SearchInput({
  current,
  variant = "desk",
}: {
  current: GoodsQuery;
  variant?: "desk" | "mob";
}) {
  const router = useRouter();
  const [value, setValue] = useState(current.search ?? "");
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Синхронизация с URL при навигации (напр. сброс через чип) — правкой во время рендера.
  const [prevSearch, setPrevSearch] = useState(current.search);
  if (current.search !== prevSearch) {
    setPrevSearch(current.search);
    setValue(current.search ?? "");
  }

  // Закрытие попапа по клику вне и Escape
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node))
        setOpen(false);
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

  // Актуальный current для отложенного push + чистим таймер на размонтировании,
  // чтобы «протухший» debounce не перезатёр свежую навигацию (напр. выбор категории).
  const currentRef = useRef(current);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function push(next: string) {
    router.push(
      buildCatalogHref(currentRef.current, { search: next.trim() || undefined }),
    );
  }
  function onChange(v: string) {
    setValue(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => push(v), 400);
  }
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (timer.current) clearTimeout(timer.current);
    push(value);
  }

  // ── Десктоп: контурное поле на винной шапке ──
  if (variant === "desk") {
    return (
      <form onSubmit={onSubmit} className="relative flex w-40 items-center">
        <SearchIcon className="pointer-events-none absolute left-2.5 size-4 text-cream/60" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="search"
          placeholder="Поиск"
          aria-label="Поиск товаров"
          className="h-7 w-full rounded-lg border border-cream/40 bg-transparent pl-8 pr-3 text-sm text-cream placeholder:text-cream/60 outline-none focus:border-cream"
        />
      </form>
    );
  }

  // ── Мобайл: иконка-кнопка → выпадающий попап с полем и кнопкой «Закрыть» ──
  return (
    <div ref={popupRef} className="relative">
      <button
        type="button"
        aria-label="Поиск"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="grid size-8 place-items-center rounded-lg border border-cream/60 text-cream"
      >
        <SearchIcon className="size-4" />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-40 mt-2 w-52 -translate-x-1/2 rounded-xl border border-rose bg-blush p-2 shadow-xl">
          <form onSubmit={onSubmit} className="relative flex items-center">
            <SearchIcon className="pointer-events-none absolute left-2.5 size-4 text-ink/40" />
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              type="search"
              placeholder="Поиск"
              aria-label="Поиск товаров"
              className="h-7 w-full rounded-lg border border-rose/70 bg-cream pl-8 pr-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:border-wine"
            />
          </form>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 h-[31px] w-full rounded-xl bg-cta-gradient text-sm text-ink transition-opacity hover:opacity-90"
          >
            Закрыть
          </button>
        </div>
      )}
    </div>
  );
}

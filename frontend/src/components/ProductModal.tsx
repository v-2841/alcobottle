"use client";

import { useEffect } from "react";
import { formatPrice, formatStock, isLowStock } from "@/lib/format";
import type { Good } from "@/lib/types";
import { CloseIcon } from "./icons";
import { useScrollLock } from "./useScrollLock";

export function ProductModal({
  good,
  onClose,
}: {
  good: Good;
  onClose: () => void;
}) {
  useScrollLock();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={good.name}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm"
    >
      {/* Винный градиентный бордюр 1px (как stroke в макете) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[496px] rounded-[20px] bg-wine-gradient p-px shadow-2xl"
      >
        <div className="relative rounded-[19px] bg-cream-50 p-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-3 top-3 grid size-7 place-items-center rounded-full text-wine transition-colors hover:bg-wine hover:text-cream"
          >
            <CloseIcon className="size-5" />
          </button>

          <div className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto pr-1">
            {/* Заголовок уровня h1: на /{slug} это главный заголовок страницы */}
            <h1 className="pr-8 text-2xl font-extrabold text-wine">{good.name}</h1>

            {good.description && (
              <p className="text-sm leading-relaxed text-ink">
                {good.description}
              </p>
            )}

            {good.tasting && (
              <section className="flex flex-col gap-1.5">
                <h3 className="text-base font-extrabold text-wine">Дегустация</h3>
                <p className="text-sm leading-relaxed text-ink">{good.tasting}</p>
              </section>
            )}

            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-extrabold text-wine">
                {formatPrice(good.price)}
              </span>
              {isLowStock(good.stock) && (
                <span className="text-xs text-wine">
                  {formatStock(good.stock)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

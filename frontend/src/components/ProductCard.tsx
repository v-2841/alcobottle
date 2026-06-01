"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, formatStock, isLowStock } from "@/lib/format";
import { buildCatalogHref } from "@/lib/query";
import type { Good } from "@/lib/types";
import { InfoIcon } from "./icons";
import { useProductModal } from "./ProductModalProvider";

function volumeNumber(volume: number | string): string {
  const n = typeof volume === "string" ? parseFloat(volume) : volume;
  return Number.isFinite(n) ? n.toLocaleString("ru-RU") : String(volume);
}

export function ProductCard({ good }: { good: Good }) {
  const href = `/${good.slug}`;
  const { open } = useProductModal();

  // Ссылка ведёт на /{slug} (SEO, открытие в новой вкладке),
  // но обычный клик открывает попап без перезагрузки каталога.
  function openModal(e: React.MouseEvent) {
    // не перехватываем ctrl/cmd/средний клик — пусть откроется в новой вкладке
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    open(good);
  }

  return (
    <article className="group flex flex-col gap-3 rounded-[16px] bg-sand/20 p-2 [contain:layout_paint_style] md:rounded-[20px] md:p-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-cream-50 md:rounded-2xl">
        <Link
          href={href}
          onClick={openModal}
          aria-label={`Подробнее о товаре ${good.name}`}
          className="relative block size-full"
        >
          {good.image ? (
            <Image
              src={good.image}
              alt={good.name}
              fill
              sizes="(max-width: 768px) 45vw, 244px"
              className="object-contain"
            />
          ) : (
            <div className="grid size-full place-items-center text-4xl text-sand">
              🍾
            </div>
          )}
        </Link>

        <Link
          href={href}
          onClick={openModal}
          aria-label={`Информация о товаре ${good.name}`}
          className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-cream/90 text-wine transition-colors hover:bg-wine hover:text-cream md:size-8 md:bg-cream/80 md:backdrop-blur"
        >
          <InfoIcon className="size-4 md:size-5" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-1">
        <h3 className="line-clamp-2 text-base font-extrabold text-wine md:text-xl">
          <Link href={href} onClick={openModal}>
            {good.name}
          </Link>
        </h3>

        <dl className="flex flex-col gap-1 text-[12px] md:text-sm">
          <div className="flex flex-wrap gap-x-1.5">
            <dt className="text-ink">Категория:</dt>
            <dd>
              <Link
                href={buildCatalogHref({}, { category: good.category.name })}
                className="font-medium text-wine hover:underline"
              >
                {good.category.name}
              </Link>
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-1.5">
            <dt className="text-ink">Производитель:</dt>
            <dd>
              <Link
                href={buildCatalogHref({}, { manufacturer: good.manufacturer.name })}
                className="font-medium text-wine hover:underline"
              >
                {good.manufacturer.name}
              </Link>
            </dd>
          </div>
          <div className="flex gap-x-1.5">
            <dt className="text-ink">Объём, л:</dt>
            <dd className="font-medium text-wine">{volumeNumber(good.volume)}</dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-col gap-0.5 pt-1">
          <span className="text-base font-extrabold text-wine md:text-lg">
            {formatPrice(good.price)}
          </span>
          {isLowStock(good.stock) && (
            <span className="text-[10px] text-wine md:text-xs">
              {formatStock(good.stock)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

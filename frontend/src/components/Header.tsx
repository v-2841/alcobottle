import type { GoodsQuery } from "@/lib/types";
import { GeoIcon } from "./icons";
import { Logo } from "./Logo";
import { SearchInput } from "./SearchInput";

function Geo({ className = "" }: { className?: string }) {
  // inline-flex: ужимается по содержимому (ширина по тексту) и центрируется
  // как flex-элемент без baseline-сдвига. Текст постоянный → явный перенос
  // на мобайле (на десктопе скрыт → одна строка).
  return (
    <span
      className={`inline-flex items-start gap-1.5 md:items-center md:gap-2 ${className}`}
    >
      <GeoIcon className="size-5 shrink-0 text-sand" />
      <span className="w-max text-right text-[11px] italic leading-tight text-sand md:text-left md:text-xs">
        Заказы по Москве<br className="md:hidden" /> и области
      </span>
    </span>
  );
}

export function Header({ current }: { current: GoodsQuery }) {
  return (
    <header className="sticky top-0 z-30 bg-wine-gradient">
      <div className="relative mx-auto grid h-14 max-w-[1200px] grid-cols-[max-content_minmax(0,1fr)_max-content] items-center gap-3 px-5 md:flex md:h-[52px] md:justify-between md:gap-3 md:px-10">
        <Logo className="shrink-0 justify-self-start" />

        {/* десктоп: поиск + гео вместе у правого края */}
        <div className="hidden items-center gap-6 md:order-last md:flex">
          <SearchInput current={current} variant="desk" />
          <Geo />
        </div>

        {/* мобайл: поиск по центру */}
        <div className="justify-self-center md:hidden">
          <SearchInput current={current} variant="mob" />
        </div>

        {/* мобайл: гео справа, ширина по тексту, иконка вплотную к тексту */}
        <Geo className="justify-self-end md:hidden" />
      </div>
    </header>
  );
}

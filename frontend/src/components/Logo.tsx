"use client";

import Image from "next/image";
import Link from "next/link";

/** Логотип из макета: иконка-бутылка + надпись «alcobottle» (градиент cream→sand). */
export function Logo({ className = "" }: { className?: string }) {
  function resetCatalog(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event("alcobottle:catalog-reset"));
  }

  return (
    <Link
      href="/"
      aria-label="Alcobottle — на главную"
      onClick={resetCatalog}
      className={`inline-flex items-center gap-1.5 select-none ${className}`}
    >
      <Image
        src="/logo-bottle.svg"
        alt=""
        width={78}
        height={85}
        priority
        className="h-5 w-auto max-w-none md:h-[25px]"
      />
      <Image
        src="/logo-wordmark.svg"
        alt="Alcobottle"
        width={378}
        height={44}
        priority
        className="h-[10px] w-auto max-w-none md:h-[13px]"
      />
    </Link>
  );
}

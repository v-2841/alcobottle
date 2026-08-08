import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false, follow: true },
};

/** 404 в оформлении сайта: и для несуществующих товаров, и для чужих URL. */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-5 text-center">
      <h1 className="text-2xl font-extrabold text-wine">Страница не найдена</h1>
      <p className="max-w-md text-sm text-ink/70">
        Возможно, товар больше не представлен в каталоге или адрес указан с
        ошибкой.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-cta-gradient px-8 py-2.5 text-base text-ink shadow-sm transition-opacity hover:opacity-90"
      >
        Перейти в каталог
      </Link>
    </main>
  );
}

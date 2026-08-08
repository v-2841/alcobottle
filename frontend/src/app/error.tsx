"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Экран ошибки уровня приложения: показывается, когда упал рендер страницы
 * (например, недоступен Django). Без него Next отдаёт голую английскую
 * страницу без шапки и навигации.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-5 text-center">
      <h1 className="text-2xl font-extrabold text-wine">
        Каталог временно недоступен
      </h1>
      <p className="max-w-md text-sm text-ink/70">
        Не удалось загрузить данные. Обновите страницу — обычно это проходит
        за несколько секунд.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-cta-gradient px-8 py-2.5 text-base text-ink shadow-sm transition-opacity hover:opacity-90"
        >
          Попробовать снова
        </button>
        <Link
          href="/"
          className="text-sm font-medium text-wine underline underline-offset-2"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}

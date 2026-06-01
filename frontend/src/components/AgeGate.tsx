"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "alcobottle:age-confirmed";

export function AgeGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // localStorage доступен только на клиенте после монтирования
    // (чтение в рендере дало бы hydration mismatch).
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(STORAGE_KEY) !== "1") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("modal-open", open);
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  if (!open) return null;

  function confirm() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Подтверждение возраста"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-[496px] rounded-[20px] bg-wine-gradient p-px shadow-2xl">
        <div className="rounded-[19px] bg-cream-50 p-6">
          <h2 className="text-xl font-extrabold text-wine">Вам больше 18 лет?</h2>

          <p className="mt-3 text-sm leading-relaxed text-ink">
            Сайт содержит информацию для лиц совершеннолетнего возраста.
            Сведения, размещённые на сайте, не являются рекламой и носят
            исключительно информационный характер. Для доступа необходимо
            подтвердить совершеннолетний возраст.
          </p>
          <button
            type="button"
            onClick={confirm}
            className="mt-5 w-full rounded-xl bg-wine-gradient px-5 py-2.5 text-base text-cream transition-opacity hover:opacity-90"
          >
            Да, мне есть 18 лет
          </button>
        </div>
      </div>
    </div>
  );
}

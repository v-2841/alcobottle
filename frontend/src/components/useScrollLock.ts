"use client";

import { useEffect } from "react";

/**
 * Блокирует прокрутку фона, СОХРАНЯЯ позицию скролла.
 * overflow:hidden на body сбрасывал бы scrollY в 0 — используем position:fixed.
 * Горизонтальный сдвиг гасит scrollbar-gutter:stable на html.
 */
export function useScrollLock() {
  useEffect(() => {
    const y = window.scrollY;
    const { body } = document;
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      window.scrollTo(0, y);
    };
  }, []);
}

"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Good } from "@/lib/types";
import { ProductModal } from "./ProductModal";

type Ctx = { open: (good: Good) => void };
const ModalCtx = createContext<Ctx>({ open: () => {} });
export const useProductModal = () => useContext(ModalCtx);

/**
 * Попап товара поверх каталога без перезагрузки фона.
 * - Клик по карточке (soft): открываем мгновенно (данные уже есть),
 *   URL меняем через history.pushState — каталог НЕ перерисовывается.
 * - Прямой заход на /{slug} (hard): initialProduct открыт сразу (SSR + SEO).
 */
export function ProductModalProvider({
  children,
  initialProduct = null,
  initialCloseHref,
  siteUrl,
}: {
  children: React.ReactNode;
  initialProduct?: Good | null;
  initialCloseHref?: string;
  siteUrl: string;
}) {
  const router = useRouter();
  const [good, setGood] = useState<Good | null>(initialProduct);
  const [viaPush, setViaPush] = useState(false);

  const open = useCallback((g: Good) => {
    setGood(g);
    setViaPush(true);
    window.history.pushState({ modal: g.slug }, "", `/${g.slug}`);
  }, []);

  const close = useCallback(() => {
    if (viaPush) {
      // вернёт URL на каталог; закрытие сделает popstate-обработчик
      window.history.back();
    } else {
      // прямой заход: уводим на каталог категории (модалка исчезнет)
      setGood(null);
      if (initialCloseHref) router.push(initialCloseHref);
    }
  }, [viaPush, initialCloseHref, router]);

  // back/forward браузера: вернулись с /{slug} → закрыть попап
  useEffect(() => {
    function onPop() {
      setGood(null);
      setViaPush(false);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Динамический title/description при открытом попапе (pushState не триггерит
  // метаданные Next). При закрытии — восстанавливаем прежние.
  useEffect(() => {
    if (!good) return;
    const prevTitle = document.title;
    const descEl = document.querySelector('meta[name="description"]');
    const prevDesc = descEl?.getAttribute("content") ?? null;
    document.title = `${good.name} — Alcobottle`;
    if (descEl) descEl.setAttribute("content", good.seo_description);
    return () => {
      document.title = prevTitle;
      if (descEl && prevDesc !== null) descEl.setAttribute("content", prevDesc);
    };
  }, [good]);

  const jsonLd = good
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: good.name,
        description: good.description || good.seo_description,
        ...(good.image
          ? { image: new URL(good.image, siteUrl).toString() }
          : {}),
        sku: String(good.id),
        category: good.category.name,
        manufacturer: {
          "@type": "Organization",
          name: good.manufacturer.name,
        },
        offers: {
          "@type": "Offer",
          url: `${siteUrl}/${encodeURIComponent(good.slug)}`,
          price: good.price,
          priceCurrency: "RUB",
          availability:
            good.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      }
    : null;

  return (
    <ModalCtx.Provider value={{ open }}>
      {jsonLd && (
        <script
          id="product-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      {children}
      {good && <ProductModal good={good} onClose={close} />}
    </ModalCtx.Provider>
  );
}

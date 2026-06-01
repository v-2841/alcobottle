import { getImageProps } from "next/image";

// Баннер — готовая статика из макета (текст/градиент уже в картинке).
// <picture> с media: браузер грузит ТОЛЬКО подходящую картинку —
// на мобайле тяжёлый десктопный баннер не скачивается вовсе.
// Размеры контейнера по Figma: десктоп 1120×223 (r=20), мобайл 320×107 (r=16).
export function Banner() {
  const common = {
    alt: "No compromises — only premium",
    sizes: "(max-width: 767px) 100vw, 1120px",
  };
  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    src: "/banner-desktop.png",
    width: 2240,
    height: 446,
    quality: 90,
  });
  const {
    props: { srcSet: mobile, alt, ...imgProps },
  } = getImageProps({
    ...common,
    src: "/banner-mobile.png",
    width: 640,
    height: 214,
    quality: 90,
    loading: "eager",
  });

  return (
    <section aria-label="No compromises — only premium">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktop} />
        <source media="(max-width: 767px)" srcSet={mobile} />
        <img
          {...imgProps}
          alt={alt}
          fetchPriority="high"
          decoding="async"
          className="block aspect-[320/107] w-full rounded-[16px] object-cover md:aspect-[1120/223] md:rounded-[20px]"
        />
      </picture>
    </section>
  );
}

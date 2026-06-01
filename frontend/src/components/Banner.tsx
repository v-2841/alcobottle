// Баннер — готовая статика из макета (текст/градиент уже в картинке).
// <picture> с media: браузер грузит ТОЛЬКО подходящую картинку —
// на мобайле тяжёлый десктопный баннер не скачивается вовсе.
// Размеры контейнера по Figma: десктоп 1120×223 (r=20), мобайл 320×107 (r=16).
export function Banner() {
  return (
    <section aria-label="No compromises — only premium">
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet="/banner-desktop.png"
          width={2240}
          height={446}
        />
        {/* art-direction: разные картинки по брейкпоинту, next/image не поддерживает */}
        <img
          src="/banner-mobile.png"
          alt="No compromises — only premium"
          width={640}
          height={214}
          fetchPriority="high"
          decoding="async"
          className="block aspect-[320/107] w-full rounded-[16px] object-cover md:aspect-[1120/223] md:rounded-[20px]"
        />
      </picture>
    </section>
  );
}

import type { NextConfig } from "next";

// Хост картинок берём из того же API_BASE: Django строит абсолютные URL медиа
// от хоста запроса, а Next ходит в него по API_BASE → хосты совпадают.
const api = new URL(process.env.API_BASE ?? "http://localhost:8000");

const nextConfig: NextConfig = {
  images: {
    // Оптимизатор Next сам отдаёт WebP (по Accept), ресайзит под `sizes`
    // и кэширует варианты — и для статики из public/, и для удалённых
    // картинок товаров с Django. Нужен установленный sharp.
    remotePatterns: [
      {
        protocol: api.protocol.replace(":", "") as "http" | "https",
        hostname: api.hostname,
        port: api.port,
        pathname: "/media/**",
      },
    ],
    // Next 16 блокирует оптимизацию картинок с приватных IP (SSRF-защита).
    // Бэк всегда на приватном адресе (dev — 127.0.0.1, prod — Docker-сеть),
    // а URL картинок приходят из доверенного Django, не от пользователя.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;

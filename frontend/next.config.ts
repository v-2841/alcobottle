import type { NextConfig } from "next";

// Куда проксировать /media. В dev — на Django (он раздаёт media при DEBUG).
// В проде /media перехватывает Caddy на публичном домене раньше Next.
const apiBase = process.env.API_BASE ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  // Самодостаточный сервер для Docker (.next/standalone + server.js).
  output: "standalone",
  // API отдаёт относительные /media/... → картинки same-origin, поэтому
  // images.remotePatterns не нужен. Оптимизатор Next отдаёт WebP (нужен sharp).
  async rewrites() {
    return [
      {
        source: "/media/:path*",
        destination: `${apiBase}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;

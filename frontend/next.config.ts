import type { NextConfig } from "next";

const apiBase = process.env.API_BASE ?? "http://localhost:8000";

// Куда Next будет ходить за оригиналами /media при оптимизации картинок.
// В Docker Django media не раздаёт, зато Caddy отдаёт /media из volume.
const mediaBase =
  process.env.MEDIA_BASE_URL ||
  (new URL(apiBase).hostname === "backend" ? "http://webserver:80" : apiBase);

const nextConfig: NextConfig = {
  // Самодостаточный сервер для Docker (.next/standalone + server.js).
  output: "standalone",
  // API отдаёт относительные /media/...; next/image оптимизирует их через
  // локальный URL, а rewrite подставляет правильный origin оригинала.
  async rewrites() {
    return [
      {
        source: "/media/:path*",
        destination: `${mediaBase}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;

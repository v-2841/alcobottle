/**
 * Публичный URL сайта — для canonical/OpenGraph, sitemap.xml и robots.txt.
 * В Docker за Caddy задаётся через env SITE_URL; локально — фолбэк.
 */
export const SITE_URL = (
  process.env.SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

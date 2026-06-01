import { type NextRequest, NextResponse } from "next/server";
import { getGoods } from "@/lib/api";
import type { Sort } from "@/lib/types";

// Прокси к Django: клиентская сортировка/«Показать ещё» бьют сюда (тот же origin).
// Не используем /api/*, потому что в prod Caddy отправляет этот префикс в Django.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const data = await getGoods({
    page: Number(sp.get("page")) || 1,
    search: sp.get("search") ?? undefined,
    category: sp.get("category") ?? undefined,
    manufacturer: sp.get("manufacturer") ?? undefined,
    ordering: (sp.get("ordering") as Sort) || undefined,
  });
  return NextResponse.json(data);
}

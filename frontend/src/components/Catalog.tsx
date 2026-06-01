import { getCategories, getGoods, getManufacturers } from "@/lib/api";
import { goodsQueryToString } from "@/lib/query";
import type { Good, GoodsQuery } from "@/lib/types";
import { Banner } from "./Banner";
import { CatalogContent } from "./CatalogContent";
import { Footer } from "./Footer";
import { Header } from "./Header";

export async function Catalog({
  query,
  initialProduct = null,
  initialCloseHref,
}: {
  query: GoodsQuery;
  initialProduct?: Good | null;
  initialCloseHref?: string;
}) {
  const [goodsPage, categories, manufacturers] = await Promise.all([
    getGoods({ ...query, page: 1 }),
    getCategories(),
    getManufacturers(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header current={query} />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 pb-6 md:px-10">
        <div className="pt-4 md:pt-6">
          <Banner />
        </div>

        <CatalogContent
          key={goodsQueryToString(query) || "all"}
          initial={goodsPage.results}
          totalCount={goodsPage.count}
          current={query}
          categories={categories}
          manufacturers={manufacturers}
          initialProduct={initialProduct}
          initialCloseHref={initialCloseHref}
        />
      </main>

      <Footer />
    </div>
  );
}

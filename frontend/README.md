# Alcobottle — фронтенд

Next.js 16 (App Router, TypeScript, Tailwind CSS v4). Каталог премиального
алкоголя поверх Django REST API.

## Запуск (локально)

Нужен Node ≥ 20.9 и pnpm. Бэкенд должен быть поднят на `http://localhost:8000`.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Сборка прод-версии:

```bash
pnpm build && pnpm start
```

## Переменные окружения

| Переменная | По умолчанию | Назначение |
|---|---|---|
| `API_BASE` | `http://localhost:8000` | база Django API для серверных запросов Next |

## Возможности

- **Каталог** с SSR: поиск, сортировка, фильтры по категории/производителю —
  всё через URL (`/?search=…&category=…&manufacturer=…&ordering=…`), пагинация
  «Показать ещё».
- **Карточка товара** `/{slug}` открывается как попап:
  - переход с каталога — попап поверх текущего списка (intercepting route);
  - прямой заход по ссылке — на фоне каталог, отфильтрованный по категории товара.
- **Динамические SEO-теги**: `title` = название товара, `description` =
  `seo_description`; для главной — статические.
- **Подтверждение возраста** (18+) при первом визите.
- Адаптив: десктоп 1200 / мобайл 360.

## Структура

```
src/
  app/
    layout.tsx                 # шрифт Inter, метаданные, age-gate, слот @modal
    page.tsx                   # главная (каталог)
    [slug]/page.tsx            # страница товара (прямой заход) + generateMetadata
    @modal/(.)[slug]/page.tsx  # перехват: попап товара поверх каталога
    api/catalog/route.ts       # прокси к Django для клиентского «Показать ещё»
  components/                  # Header, Banner, ProductCard, FilterBar, ProductModal, …
  lib/                         # api.ts, types.ts, query.ts, format.ts
```

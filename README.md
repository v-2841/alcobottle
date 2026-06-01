# Alcobottle

Каталог премиального алкоголя: витрина с поиском, фильтрами и сортировкой,
страницы товаров с SEO, плюс Telegram-бот и уведомления об ошибках в чат.

Состоит из двух приложений за общим reverse-proxy (Caddy):

- **backend** — Django 6 + DRF: REST API каталога, админка, Telegram-бот, логирование.
- **frontend** — Next.js 16 (App Router) + TypeScript + Tailwind v4: витрина и страницы товаров.

## Архитектура

```
                ┌─────────────┐
   браузер ──▶  │   Caddy     │
                │  (webserver)│
                └──────┬──────┘
       /api,/admin     │     всё остальное
       /static,/media  │     (/, /{slug}, sitemap.xml, robots.txt)
            ┌──────────┴───────────┐
            ▼                      ▼
      ┌──────────┐          ┌───────────┐
      │ backend  │◀── ORM ──│ database  │
      │ (Django) │          │ (Postgres)│
      └──────────┘          └───────────┘
            ▲
   polling  │ ORM
      ┌──────────┐
      │   bot    │  (тот же образ, python bot.py)
      └──────────┘
```

Next делает серверные запросы к Django напрямую (`API_BASE`, внутри сети
`http://backend:8000`); картинки товаров оптимизируются на лету (WebP).

## Стек

| Слой       | Технологии |
|------------|-----------|
| Backend    | Python 3.14, Django 6, DRF, django-filter, drf-spectacular, gunicorn, psycopg |
| Frontend   | Node 24, Next.js 16, React 19, TypeScript, Tailwind CSS v4, pnpm |
| Инфра      | Docker, docker-compose, Caddy 2, PostgreSQL 18 |
| Прочее     | python-telegram-bot 22 (async), Pillow, sharp |

## Структура

```
backend/        Django-проект (API, админка, бот, логирование)
frontend/       Next.js-приложение (витрина)
webserver/      Caddyfile (маршрутизация)
docker-compose.yml
```

## Быстрый старт (Docker)

```bash
cp backend/.env.example backend/.env      # заполнить секреты
cp frontend/.env.example frontend/.env    # API_BASE=http://backend:8000, SITE_URL, JIVO_WIDGET_ID
docker compose up --build
```

Сайт доступен через Caddy (порт задан в `docker-compose.yml`, по умолчанию
`127.0.0.1:8011`). Админка — `/admin/`, API — `/api/`, схема — `/api/schema/`.

## Локальная разработка (без Docker)

**Backend** (Postgres должен быть доступен, значения в `backend/.env`):

```bash
cd backend
poetry install
poetry run python manage.py migrate
poetry run python manage.py runserver        # http://localhost:8000
poetry run python bot.py                      # бот (нужен TELEGRAM_TOKEN)
```

**Frontend** (для локали в `frontend/.env`: `API_BASE=http://localhost:8000`,
`SITE_URL=http://localhost:3000`):

```bash
cd frontend
pnpm install
pnpm dev                                       # http://localhost:3000
```

## Переменные окружения

`backend/.env` (см. `.env.example`): `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`
(обязательно включает `backend`), `CSRF_TRUSTED_ORIGINS`, `POSTGRES_*`,
`TELEGRAM_TOKEN`, `CHAT_IDS`, `LOG_FILE`.

`frontend/.env` (см. `.env.example`):

- `SITE_URL` — публичный URL (canonical/OpenGraph, sitemap.xml, robots.txt);
- `API_BASE` — адрес Django для серверных запросов и оптимизации картинок;
- `JIVO_WIDGET_ID` — ID виджета чата Jivo (пусто — выключен).

## Особенности фронтенда

- **Карточка товара** открывается оверлеем поверх каталога без перезагрузки фона
  (клиентская модалка + `history.pushState`); прямой заход на `/{slug}` отдаёт
  SSR-страницу с метаданными для SEO.
- **Сортировка** — серверная: меняется на клиенте, но запрос уходит в API и
  сортирует весь каталог; в URL страницы не пишется (чистые ссылки), только
  фильтры (`category`, `manufacturer`) и поиск (`search`).
- **Картинки** отдаются в WebP через встроенный оптимизатор Next (нужен `sharp`).
- **sitemap.xml** и **robots.txt** генерируются фронтом (`app/sitemap.ts`,
  `app/robots.ts`) и считаются в рантайме.

## Telegram-бот и логирование

- `bot.py` — отдельный сервис (async python-telegram-bot): `/start` с кнопкой
  «🛒 Товары» (список активных товаров).
- Логирование (`core/handlers.py`, настройки в `alcobottle/settings.py`): запись
  в файл (`RotatingFileHandler`) + отправка ошибок уровня ERROR в Telegram
  (`CHAT_IDS`). У каждого сервиса свой файл лога через `LOG_FILE`.

# HSKGo (a hanbeego.com clone toolkit)

Three pieces, meant to be used together:

- **`scraper/`** — a generic Python crawler that scrapes every public page of
  `hanbeego.com` (driven by its `sitemap.xml`, ~2200 URLs) into structured
  JSON, and downloads every image it references.
- **`web/`** — a Next.js 15 (App Router) + TypeScript site that renders every
  one of those scraped pages from **Postgres**, matching the original's
  design tokens (colors, fonts) so pages look the same without
  hand-authoring each template, plus an **/admin** panel to edit that data
  live and manage user accounts.
- **Postgres 17** — holds the site's content (`Page` table, imported from the
  scraper's JSON) and a `User` table for the admin panel to manage.

Everything ships with Dockerfiles; `docker-compose.yml` wires it together.

## How the clone actually works

The scraper doesn't try to model every content type (reading lessons, HSK
levels, radicals, vocab, blog posts, ...) individually. Instead, for every
URL it saves a generic record to JSON:

```jsonc
{
  "path": "/reading/1",
  "section": "reading",
  "title": "...",
  "description": "...",
  "main_html": "<div class=\"...\">...</div>", // sanitized #main-content HTML,
                                                 // original Tailwind classes kept,
                                                 // img src rewritten to local assets
  "internal_links": [...],
  "headings": [...]
}
```

A one-off **import step** (`web/prisma/seed.ts`) loads that JSON into a
`Page` table in Postgres (same shape, see `web/prisma/schema.prisma`). The
site then reads pages from Postgres at request time — nothing is statically
exported anymore, so editing a page in `/admin/pages` shows up immediately
on the public site, no rebuild needed.

The app has three route groups (Next.js App Router route groups — the
parens don't affect the URL):

- **`src/app/(marketing)/`** — the public, scraped site. A single catch-all
  route, [`(marketing)/[...slug]/page.tsx`](<web/src/app/(marketing)/%5B...slug%5D/page.tsx>),
  looks up `content.path` in Postgres and drops `main_html` into the page.
  Because the scraped HTML keeps its original utility classes, and
  `web/src/app/globals.css` redefines the same color/font design tokens the
  live site uses, pages render close to pixel-identical without per-template
  work. The homepage and shared `Header`/`Footer` are hand-built.
- **`src/app/(app)/`** — the logged-in student area. Two different kinds of
  page live here:
  - **UI-only shells** (`/dashboard`, `/profile`, `/vocab/review`,
    `/vocab/mistakes`, `/vocab/my-words`, `/exam/history`, `/tutor`).
    hanbeego's real data for these (XP, streaks, quiz history, AI tutor
    chat, ...) lives behind its own private auth + database, so a scraper
    can't pull any of it out. They're rendered from `src/lib/mock-session.ts`
    — one hardcoded fake user, not wired to Postgres or any real session.
  - **Actually real features** (`/tools/dictionary`, `/tools/pinyin`,
    `/friends`, `/game/*`) — see "Real features added beyond the clone"
    below. These read/write Postgres for real.

  All of it is wrapped in `AppSidebar`/`AppTopbar` instead of the marketing
  `Header`/`Footer`. To make the shell pages real too, you'd need your own
  student auth (e.g. NextAuth) wired to the `User` table.
- **`src/app/admin/`** — a real, database-backed admin panel (see below).

## Real features added beyond the clone

hanbeego.com's own sidebar has more than static content — games, a
dictionary, a friends list. Those can't be scraped (they're interactive
apps, not HTML), so these are built from scratch using data already in
Postgres, not mocked:

- **`/tools/dictionary`** — searches the `VocabWord` table (hanzi, pinyin,
  meaning) by hanzi / pinyin / Vietnamese meaning.
- **`/tools/pinyin`** — pastes Chinese text, converts to pinyin with real
  tone marks via the `pinyin-pro` library, colored by tone number (client-side,
  no backend call).
- **`/friends`** — a real `Friendship` table (request / accept / remove)
  between `User` rows. There's no login, so it always acts as the oldest
  seeded user (see `src/lib/current-user.ts`) — swap that for a real session
  once auth exists.
- **`/game/pinyin-speed`** and **`/game/listen-guess`** — two playable games
  against real random words from `VocabWord` (typing-speed and
  listen-and-pick, the latter using the browser's `SpeechSynthesis` API for
  zh-CN audio, no audio files needed).

`VocabWord` itself comes from `web/prisma/import-vocab.ts`, which parses the
word-card markup on the already-scraped `/vocab/topics/*` pages (cheerio) —
run it after `db:seed` (see Quick start; `db-setup` already does this).

**Deliberately not built** — these need infrastructure this project doesn't
have and a half-working version would be worse than none: hanbeego's live
1v1 "PK" matchmaking arena, its XP/coin economy + daily missions, and
audio-based listening/speaking/writing exercises beyond the static explainer
pages already scraped.

## Admin panel

`/admin` manages what's actually in Postgres:

- **`/admin/users`** — list, edit (name, HSK level, XP, streak, membership),
  delete `User` rows.
- **`/admin/pages`** — search/paginate, edit, delete, or create `Page` rows
  (the scraped content). Editing a page's HTML here changes what the public
  site renders at that path immediately.

Protected by a single shared password (`ADMIN_PASSWORD`), not a per-admin
account system — `src/middleware.ts` gates every `/admin/*` route except
`/admin/login`, checking a signed, expiring cookie
(`src/lib/admin-auth.ts`, HMAC-SHA256 via Web Crypto so it works in
middleware's Edge runtime). Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`
via `.env` (copy `.env.example`) — the defaults in `docker-compose.yml`
(`changeme` / a placeholder string) are only there so `docker compose up`
doesn't hard-fail with no `.env`; **change both before exposing this to
anyone**.

**Known simplification**: the page-editor's HTML field is saved and rendered
as-is (`dangerouslySetInnerHTML`, no sanitization) — acceptable for a single
trusted admin, but do not add more editors without adding HTML sanitization
first.

## Quick start (Docker)

```bash
cp .env.example .env   # then edit ADMIN_PASSWORD, ADMIN_SESSION_SECRET, Postgres creds

# 1. Scrape hanbeego.com onto the host (writes web/content + web/public/scraped-assets)
docker compose --profile scrape run --rm scraper

# 2. Start Postgres 17
docker compose up -d db

# 3. Apply the schema and import the scraped JSON + sample users into it
docker compose --profile setup run --rm db-setup

# 4. Build and run the site
docker compose build web
docker compose up web
# -> http://localhost:3000        (public site)
# -> http://localhost:3000/admin  (admin panel)
```

Re-run step 1 + 3 any time you want to refresh content from the live site.
`db-setup` is an upsert, safe to run repeatedly.

If port 3000 (or 5432) is already used by something else on your machine,
change the left-hand side of the `ports:` mapping for that service in
`docker-compose.yml` (or `POSTGRES_PORT` in `.env` for Postgres).

## Quick start (without Docker)

```bash
# Scraper
cd scraper
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python scraper.py --content-dir ../web/content --assets-dir ../web/public/scraped-assets

# Postgres (or point DATABASE_URL at any Postgres 17 instance you already have)
./scripts/dev-up.sh          # starts colima (if installed) + docker compose up -d db

# Web app
cd web
npm install
cp .env.example .env.local   # DATABASE_URL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET
npx prisma migrate deploy
npm run db:seed              # imports ../content + sample users
npm run db:import-vocab      # parses /vocab/topics/* into structured VocabWord rows
npm run dev                  # http://localhost:3000
```

## Day-to-day: starting/stopping Postgres

The Next.js app connects to Postgres over TCP, so it has to actually be
running — `npm run dev` does **not** start it for you. Two small scripts
handle that:

```bash
./scripts/dev-up.sh      # starts colima (if you use it) + Postgres, waits until it's healthy
./scripts/dev-down.sh    # stops Postgres (data is kept)
./scripts/dev-down.sh --colima   # also stops the colima VM itself
```

If you ever see `Can't reach database server at ...` from Prisma while
running `npm run dev`, this is why — run `./scripts/dev-up.sh` and reload.

## Scraper CLI reference

```
python scraper.py [options]

--base-url URL           Site root to crawl (default: https://hanbeego.com)
--content-dir DIR        Where per-page JSON is written
--assets-dir DIR         Where downloaded images are written
--asset-url-prefix PATH  URL prefix baked into saved HTML for images
                         (default: /scraped-assets — must match how `web`
                         serves web/public/scraped-assets)
--save-html              Also dump the raw HTML per page (debugging)
--workers N              Concurrent request workers (default: 8)
--delay SECONDS          Delay after each request, per worker (default: 0.25)
--limit N                Stop after N pages — handy for a quick test run
--follow-links           Also discover pages via internal links, on top of
                         the sitemap (off by default; the sitemap already
                         lists every public page)
--include REGEX          Only crawl paths matching this regex
--exclude REGEX          Skip paths matching this regex
-v / --verbose           Debug logging
```

The crawler respects `robots.txt` automatically (it already skips
`/dashboard`, `/profile`, `/api/`, `/admin/`, `/payment/`, etc. per
hanbeego's own robots rules) and retries transient failures. It writes
`content/manifest.json` (index of every scraped page) and
`content/report.json` (success/failure counts) at the end of each run —
`prisma/seed.ts` reads the manifest to know what to import.

## Project layout

```
scraper/
  scraper.py         crawler
  requirements.txt
  Dockerfile
web/
  prisma/schema.prisma                   User, Page, VocabWord, Friendship tables
  prisma/seed.ts                         imports content/*.json into Page, seeds sample Users
  prisma/import-vocab.ts                 parses /vocab/topics/* HTML into VocabWord rows
  src/middleware.ts                      protects /admin/*
  src/lib/db.ts                          Prisma client singleton
  src/lib/pages.ts                       Page queries used by the public site + admin
  src/lib/admin-auth.ts                  signed-cookie admin session (Web Crypto)
  src/lib/mock-session.ts                placeholder data for the (app) student shell pages
  src/lib/current-user.ts                stand-in "logged in user" for /friends (no real auth)
  src/app/layout.tsx                     root layout (fonts only)
  src/app/(marketing)/layout.tsx         Header + Footer
  src/app/(marketing)/page.tsx           homepage
  src/app/(marketing)/[...slug]/page.tsx generic page template, reads Page from Postgres
  src/app/(marketing)/download/          honest static "app coming soon" page
  src/app/(app)/...                      student shell (mock) + real tools/friends/game pages
  src/app/admin/login/                   admin login (password + signed cookie)
  src/app/admin/(dashboard)/             admin shell: overview, users, pages CRUD
  src/components/                        Header, Footer (marketing)
  src/components/app/                    AppSidebar, AppTopbar (student shell)
  content/                   scraper output (gitignored, regenerate anytime)
  public/scraped-assets/     downloaded images (gitignored)
  Dockerfile                 multi-stage; `builder` target is reused by db-setup
scripts/
  dev-up.sh                 starts colima + Postgres for local dev, waits until healthy
  dev-down.sh                stops Postgres (data kept); --colima also stops colima
docker-compose.yml
.env.example
```

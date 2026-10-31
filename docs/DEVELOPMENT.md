# Developer guide

Run the commands below from the frontend repository root.

An English/Russian Next.js learning platform with minimal black and white themes, a searchable course catalog, and lessons served by the PostgreSQL-backed NestJS API. See [the design contract](DESIGN.md) for the visual direction and scope.

The current homepage, minimal chapter grid, motion, and React compatibility decisions are in [PORTFOLIO.md](PORTFOLIO.md). [MODERNIZATION.md](MODERNIZATION.md) records the historical staged roadmap; its Observatory direction is superseded by the current course-focused design.

See [FRONTEND_QUALITY.md](FRONTEND_QUALITY.md) for the mobile/desktop performance measurements, frontend regression coverage, and release limitations.

The Observatory implementation and translations remain in the repository, but the current homepage does not mount its widget. Keep `features.playground` in [src/shared/config/features.ts](../src/shared/config/features.ts) set to `false` so legacy recovery links lead to courses. `features.sculpture` also remains `false`.

## Translations

All frontend-owned copy lives in two files: [English](../public/locales/en.json) and [Russian](../public/locales/ru.json). Each file groups existing i18next namespaces (`translation`, `about`, `contacts`, `teachers`, `observatory`, and `editor`). Common UI and SEO copy uses `translation`; CodeMirror's built-in controls use `editor.phrases`. Sample profile names, comments, reviews, and artwork labels are included. Add or edit both language files together; do not add another locale file or an English fallback in a component.

Use `useTranslation()` for common strings and `useTranslation('about')` (or another namespace) for page copy. Keep interpolation placeholders identical in both languages. English plurals use `_one` and `_other`; Russian additionally uses `_few` and `_many`. Editor phrases use CodeMirror's `$` placeholders. `translations.test.ts` checks the two-file contract, key parity, nonempty strings, placeholders, and plurals.

`createAppI18n` bundles both files without separate translation requests and creates an isolated instance per app render. Server metadata reads the same files. The `lang` cookie preserves the selected language across navigation and reloads. Course/lesson records and starter programs remain in the API, requested with the selected language; user-generated content and program output are not translated by the interface.

## Run locally

Use **Node.js 24.22.1** and **npm 11.21.1**, with the sibling `e-learning-platform-server` checkout. `.node-version`, `packageManager`, and engine checks record the supported toolchain. Install/select that Node release, then run `npm install --global npm@11.21.1 --ignore-scripts` if needed. The backend requires PostgreSQL 18; follow its [setup instructions](../../e-learning-platform-server/README.md) to create its private `.env` configuration.

Start the API in one terminal:

```sh
cd ../e-learning-platform-server
npm ci
docker compose up -d --wait
npm run db:migrate
npm run db:seed
npm start
```

Start the frontend from this repository in a second terminal:

```sh
npm ci
npm start
```

Open http://localhost:3000. The API defaults to http://localhost:3001.

To use a different API origin, copy `.env.example` to `.env`, update `SERVER_URL` (without `/api`), and restart/rebuild the frontend. Next.js proxies `/api/*` and course thumbnail requests to that origin; browser requests stay on the frontend origin. Vercel builds require a public HTTPS `SERVER_URL` and reject missing values, localhost, credentials, and extra paths. Never add database credentials to the frontend.

`SITE_URL` is the stable public frontend HTTPS origin used for canonical links, Open Graph URLs, and the sitemap. It defaults to `https://learning-platform-gray-mu.vercel.app`; set it explicitly when moving to a custom domain, then rebuild. Do not use a temporary preview URL. `/robots.txt` advertises `/sitemap.xml`, which refreshes hourly and lists public navigation, course overviews, and lesson URLs. During a catalog API outage it retains the static navigation URLs; it never invents last-modified dates or includes account/API routes. Languages currently share URLs and use a cookie, so no separate language URLs or `hreflang` alternatives are claimed.

Next.js owns page titles, descriptions, canonical URLs, and social metadata. Changing language refreshes the server metadata while retaining client state. The 404 metadata is emitted by the server, localized, and automatically marked `noindex` by Next.js; login, registration, profile, and legacy lesson recovery routes are also excluded from indexing. Missing pages have no canonical link. Regression coverage is in `test/e2e/seo.spec.ts`.

The frontend handles `GET /api/auth/session` before the general API rewrite. It returns `200 { user: null }` for guests and expired/revoked sessions, or `200 { user: { id, name, email } }` for a valid session. This optional lookup keeps ordinary signed-out page loads free of failed HTTP requests. Responses are private and never cached; only the HttpOnly session cookie is forwarded to the configured backend. Upstream failures remain `502` errors with a generic message. Protected `/api/auth/me` and authentication operations retain the backend's status codes. This change needs only a frontend deployment.

Both projects use npm and committed `package-lock.json` files. Lifecycle scripts are disabled in `.npmrc`; the current dependencies do not need them to run the app. Development access is bound to loopback. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Checks and production build

Theme colors live in [src/shared/config/themes.ts](../src/shared/config/themes.ts). `themes` defines the dark/light palettes and `DEFAULT_THEME` selects the initial mode. Components and SVG artwork consume their CSS variables. A React `ThemeProvider` applies the selected palette; Webpack also reads the same config for the initial HTML so colors are available before React starts. Rebuild/restart after editing the palettes to refresh that initial HTML.

```sh
npm run typecheck
npm run unit -- --runInBand
npm run build
npm run check:bundle
npm run security:audit
npm run security:secrets
```

`npm run build` creates the Next.js application in `.next/`. Run `npm run serve` to serve it locally, or deploy using the Next.js preset on Vercel. This application uses server rendering and rewrites; it is not a static `build/index.html` site. See [the free deployment runbook](DEPLOYMENT.md).

Browser regression checks start fresh frontend/API processes and use the backend's dedicated `TEST_DATABASE_URL` (database name ending in `_test`), applying migrations and inserting missing seed data explicitly. Create that database using the backend README first. Stop development servers on ports 3000 and 3001 before running. Credentials stay in the backend's private configuration.

```sh
npx playwright install chromium
npm run test:e2e
```

On Windows with Microsoft Edge already installed, you can avoid downloading Chromium:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm run test:e2e
```

Non-mutating lint commands are `npm run lint:ts` and `npm run lint:scss`. Frontend and backend dependency audits are clean after the targeted PostCSS remediation described in [SECURITY.md](../SECURITY.md). Existing lint/style debt is recorded separately in [docs/STABILIZATION.md](STABILIZATION.md). See the security document for secret scanning, CI, and the outstanding Atlas owner action.

## What works in this stage

- English/Russian course catalogs, search, thumbnails, and language switching.
- Course details loaded by their URL, including fresh visits and refresh.
- Course-specific lesson links: `/course/:courseId/lesson/:lessonId`.
- Course details include only the ordered lesson titles; no lesson bodies are downloaded for the overview. Opening a lesson requests `GET /api/courses/:courseId/lessons/:lessonIndex?lang=eng|rus`. Only that stored lesson's title and blocks are returned. Loading and retry states stay within the lesson body, leaving its outline visible. Redux caches course outlines by course/language and opened lesson bodies by course/index/language until a full reload. Back and revisiting an opened lesson reuse its body; unopened lessons are never prefetched. Main navigation and lesson links may prefetch their Next.js routes in production, and the page container stays mounted across URL changes.
- Recovery states for missing courses, invalid lessons, and old lesson links without a course identifier.
- Mobile search/navigation and theme switching.
- Registration, sign-in, persistent seven-day sessions, profile display, and sign-out at `/register`, `/login`, and `/profile`. Account forms and errors are translated into English and Russian. Sessions use HttpOnly cookies through the same-origin API proxy.
- JavaScript/Python lesson examples open directly in an editor with colorful syntax highlighting, completion, optional input, live output, Run/Stop/Reset, and isolated browser execution. The original expected answer can be expanded for comparison. Python downloads only when first run. Lesson text, code, reference answers, and alternate-language starters are supplied by the backend. Deploy the updated backend and run `npm run db:seed` there to upgrade unchanged lessons with language starters; no schema migration is needed. See [the runtime/security contract](CODE_PLAYGROUND.md) for limitations, asset generation and abuse tests. This does not enable the legacy Observatory feature flag.
- A complete ten-lesson JavaScript course in both languages, including examples, exercises, solutions, and a final project. After seeding, open `/course/0/lesson/0`; the final project is `/course/0/lesson/9`.

## What is still unfinished

Comment posting, contact delivery, saved courses, likes, learning progress, email verification, password recovery, and actual video files remain unfinished. Courses other than JavaScript Fundamentals are marked as coming soon, with their planned topics. Contact goes through GitHub issues; there are no teacher profiles. Invented usage statistics, testimonials, and comments are not presented as real activity.

Before deploying the account UI, apply the backend accounts migration and runtime grants described in the [API README](../../e-learning-platform-server/README.md#learner-accounts), then deploy the backend. Run its seed explicitly to upgrade unchanged JavaScript outlines to full content. The existing automatic migration guard intentionally requires a manual release for the account schema.

These capabilities are tracked in the staged roadmap. They are not prerequisites for running the existing catalog demo.

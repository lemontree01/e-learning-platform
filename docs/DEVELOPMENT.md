# Developer guide

Run the commands below from the frontend repository root.

An English/Russian Next.js learning platform with minimal black and white themes, a searchable course catalog, and lessons served by the PostgreSQL-backed NestJS API. See [the design contract](DESIGN.md) for the visual direction and scope.

The current homepage, minimal chapter grid, motion, and React compatibility decisions are in [PORTFOLIO.md](PORTFOLIO.md). [MODERNIZATION.md](MODERNIZATION.md) records the historical staged roadmap; its Observatory direction is superseded by the current course-focused design.

The Observatory implementation and translations remain in the repository, but the current homepage does not mount its widget. Keep `features.playground` in [src/shared/config/features.ts](../src/shared/config/features.ts) set to `false` so legacy recovery links lead to courses. Russian interface copy lives in `public/locales/ru/`.

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

The frontend handles `GET /api/auth/session` before the general API rewrite. It returns `200 { user: null }` for guests and expired/revoked sessions, or `200 { user: { id, name, email } }` for a valid session. This optional lookup keeps ordinary signed-out page loads free of failed HTTP requests. Responses are private and never cached; only the HttpOnly session cookie is forwarded to the configured backend. Upstream failures remain `502` errors with a generic message. Protected `/api/auth/me` and authentication operations retain the backend's status codes. This change needs only a frontend deployment.

Both projects use npm and committed `package-lock.json` files. Lifecycle scripts are disabled in `.npmrc`; the current dependencies do not need them to run the app. Development access is bound to loopback. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Checks and production build

Theme colors live in [src/shared/config/themes.ts](../src/shared/config/themes.ts). `themes` defines the dark/light palettes and `DEFAULT_THEME` selects the initial mode. Components and SVG artwork consume their CSS variables. A React `ThemeProvider` applies the selected palette; Webpack also reads the same config for the initial HTML so colors are available before React starts. Rebuild/restart after editing the palettes to refresh that initial HTML.

```sh
npm run typecheck
npm run unit -- --runInBand
npm run build
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
- Recovery states for missing courses, invalid lessons, and old lesson links without a course identifier.
- Mobile search/navigation and theme switching.
- Registration, sign-in, persistent seven-day sessions, profile display, and sign-out at `/register`, `/login`, and `/profile`. Account forms and errors are translated into English and Russian. Sessions use HttpOnly cookies through the same-origin API proxy.
- A complete ten-lesson JavaScript course in both languages, including examples, exercises, solutions, and a final project. After seeding, open `/course/0/lesson/0`; the final project is `/course/0/lesson/9`.

## What is still unfinished

Comment posting, contact delivery, saved courses, likes, learning progress, email verification, password recovery, and actual video files remain unfinished. Courses other than JavaScript Fundamentals retain sample lesson outlines. The contact form is an explicitly disabled preview; teacher profiles are labelled as samples. Invented usage statistics, testimonials, and comments are not presented as real activity.

Before deploying the account UI, apply the backend accounts migration and runtime grants described in the [API README](../../e-learning-platform-server/README.md#learner-accounts), then deploy the backend. Run its seed explicitly to upgrade unchanged JavaScript outlines to full content. The existing automatic migration guard intentionally requires a manual release for the account schema.

These capabilities are tracked in the staged roadmap. They are not prerequisites for running the existing catalog demo.

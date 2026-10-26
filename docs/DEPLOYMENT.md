# Free personal-demo deployment

Target: two Vercel Hobby projects (Next.js frontend and NestJS backend) plus Neon Free PostgreSQL 18. Personal/noncommercial use is confirmed. Stay on free plans and provider subdomains; do not enable paid add-ons. Free services have quotas and can suspend service when exhausted. No external deployment has been completed by the local preparation alone.

## Order

1. Finish local verification and review the changes. Git changes can remain staged without committing. Vercel CLI can deploy an export of the working tree; Git-connected deployments require the user to commit/push separately. The current Vercel account differs from the historical Git author, so this launch uses source exports under the parent workspace's `.cache/deploy-export/` without Git metadata. Copy only reviewed application files, exclude all private env/cache/build/skill files, and copy `.vercel/project.json` only for linking. Refresh the export from the latest source before each CLI deployment. Do not forge Git author metadata or change commits.
2. Create Neon Free PostgreSQL 18 and choose a region close to the selected Vercel function region. Keep scale-to-zero enabled. Create an isolated test branch/database separately if hosted testing is needed.
3. In the backend, use the direct owner/release connection privately for `npm run db:migrate`, then explicitly run `npm run db:seed` for the initial demo courses. Never run migration rollback against this database: the initial down migration drops course and lesson data.
4. Create a distinct runtime login with CONNECT on the database, USAGE on public, and SELECT on public.courses/public.lessons only. Create a separate read-only backup login with SELECT on all public tables and sequences, including default grants for future tables/sequences. Keep owner credentials out of production runtime and frontend settings. Verify grants before using the runtime role.
5. Deploy the backend directory using its `vercel.json` (Other framework / explicit Node.js Function), native `dist-vercel/` ESM output, and Frankfurt `fra1` function region. Select Node 24.x. Set backend `DATABASE_URL` to Neon's **pooled** runtime-role URL with verified TLS, `DATABASE_POOL_MAX=3`, and `NODE_ENV=production`. Do not set TEST_DATABASE_URL or owner credentials in production. Migrations and seeding are not build/request steps. The build pins npm 11.21.1, explicitly includes dev dependencies needed by TypeScript (`npm ci --include=dev`), and disables dependency lifecycle scripts.
6. Verify `/healthz`, `/api/courses?lang=eng`, `/api/courses?lang=rus`, `/api/courses/12`, and `/course-12.jpg` on the backend deployment. Check that failure responses/logs reveal no SQL or credentials. Verify API reachability without dashboard authentication for the public demo; preview protection can otherwise block the frontend proxy.
7. Deploy this frontend directory using its `vercel.json` (Next.js, Node 24.x). Set `SERVER_URL` to the backend's HTTPS origin, without `/api`, for the relevant deployment environment. Rebuild when it changes. No DATABASE_URL belongs in this project. Use a stable backend production URL for the frontend's production environment; keep test/preview data separate.
8. Verify the browser catalog, search, course/lesson links, refresh, English/Russian, themes, and thumbnails. Browser requests must use the frontend origin and must not target localhost.
9. Enable and test the backend's encrypted backup workflow using its runbook. Restore a dump before treating backups as operational.

## Logs, monitoring, and cost controls

Vercel Hobby runtime logs have limited retention (currently one hour). Start with these logs and provider usage pages. Optional Better Stack Free can add personal-project log retention and uptime alerts; integration and account setup are separate. Do not add paid log drains. Do not place credentials, full request bodies, or database URLs in logs.

Monitor the frontend `/favicon.svg` for basic uptime without database queries. A backend `/healthz` on a warm instance does not query the database, but a serverless cold start validates database connectivity. Frequent probes can therefore wake Neon and consume free compute; avoid minute-by-minute database polling. Check the actual course flow after deployments and investigate 503s in provider logs.

Track Vercel usage, Neon compute/storage/transfer, and backup Actions minutes/artifact storage. A free quota is not unlimited hosting. Keep local copies of the backup decryption passphrase separately from the hosted secrets.

## Rollback

Record deployment URLs/IDs once available. Restore the previous working Vercel deployment for application regressions, then repeat API and browser checks. Application rollback does not undo database data. The current initial migration must never be rolled back in production; restore into a new database/branch, verify the data, and only then switch the backend connection. Preserve the source database until recovery is verified.

## Sources

- https://vercel.com/docs/frameworks/backend/nestjs
- https://vercel.com/docs/project-configuration/vercel-json#functions
- https://nextjs.org/docs/15/app/api-reference/config/next-config-js/rewrites#rewriting-to-an-external-url
- https://vercel.com/docs/plans/hobby
- https://neon.com/pricing
- https://neon.com/docs/manage/backup-pg-dump

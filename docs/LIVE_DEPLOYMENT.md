# Live personal-demo deployment

Verified on 2026-10-25 (Asia/Qyzylorda).

## Services

| Component | URL / resource | Plan |
| --- | --- | --- |
| Frontend | https://learning-platform-gray-mu.vercel.app | Vercel Hobby |
| Backend | https://learning-platform-api-gray.vercel.app | Vercel Hobby |
| Database | learning-platform-db, PostgreSQL 18.6, Frankfurt | Neon Free (`free_v3`) |

Expected recurring hosting cost is $0 while these free allowances are sufficient. No custom domain, paid plan, paid build machine, or paid add-on was enabled. Vercel functions run in Frankfurt (`fra1`); static assets use the CDN. Provider quotas still apply.

The Vercel workspace is `acme-f6d7` (ACME). Dashboard links:

- Frontend: https://vercel.com/acme-f6d7/learning-platform
- Backend/logs: https://vercel.com/acme-f6d7/learning-platform-api
- Database: https://vercel.com/d/dashboard/integrations/neon/icfg_E83ta3ZGZpizZzb3Vj0elDc9/resources/store_62LhSf3AO1Ee6S9V

## Verification

- Public backend health, English/Russian catalogs (20 courses each), course details, thumbnails, and 400 validation response pass without login bypass.
- A clean Edge browser verified the full frontend -> backend -> database path, same-origin API/images, search plus refresh, direct lesson plus refresh, Russian, theme switching, 375px navigation/overflow, and zero page errors.
- Local checks: 27 backend integration tests, 47 frontend unit/component tests, 14 browser regression scenarios, type checking, clean installs, production builds, full/production audits, and redacted working-tree/history secret scans pass. Existing CSS prefixing/build warnings and a platform url.parse deprecation warning are not startup errors.
- The real hosted database contains 40 localized course records and 390 lessons. Production uses a pooled `learning_runtime` login with SELECT on courses/lessons, no INSERT/CREATE/admin membership, verified TLS, and a maximum pool of three per function instance.
- The temporary integration binding used to retrieve owner/release credentials was removed after setup. No owner connection or database credentials are configured on the frontend. Owner/release details stay in the backend's ignored local cache; production has only its read-only database URL, pool limit, and NODE_ENV.
- A real hosted dump was encrypted (17,920 bytes), decrypted, and restored into a separate disposable local database. It recovered all 40 course records and 390 lessons. See the backend [backup runbook](../../e-learning-platform-server/BACKUPS.md).

## Backups and logs

Vercel runtime logs are available in the project dashboard (Hobby retention is currently one hour). No paid logging service was added. Neon Free provides its limited instant-restore window; independent encrypted dump recovery was verified separately.

The daily GitHub backup workflow is prepared but **not active**. The user explicitly requested no commits, and a scheduled workflow must be published on the default branch before it can run. The existing private backend repository now has a master-only environment with its two backup secrets and `DATABASE_BACKUPS_ENABLED=true`. CI/CD is prepared in both repositories; see [CI_CD.md](../CI_CD.md). Follow the backend backup runbook; keep the decryption passphrase separately in a password manager.

## Source and recovery

No commits or pushes were created. All required source/config/tests/docs are staged in the two original repositories. Deployment used reviewed working-tree exports without inherited Git author metadata. See [DEPLOYMENT.md](DEPLOYMENT.md) before a later release; refresh the export rather than deploying stale files.

Verified working deployment IDs:

- Frontend: `dpl_EnFjPLJpQ1bZuyWHroP7o9KNvT3m`
- Backend: `dpl_3kqxM2XsEvCUJVXWwoEDPTRYFK2y`

Use these as the first known-working application rollback targets for later changes. Do not roll back the initial database migration: it drops course and lesson data. Restore database data into a new database/branch and verify it before switching the runtime connection. Preserve the source database during recovery.

## Next actions

See [NEXT_STEPS.md](NEXT_STEPS.md) for saving the encrypted recovery kit/passphrase, reviewing staged source, enabling optional scheduled backups when commits are allowed, and optional free uptime alerts. Follow-up checks reconfirmed public HTTP 200 for the site, static monitor target, backend health and database-backed catalog, with both free plans unchanged.

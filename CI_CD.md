# Automatic releases

Push to `master` to verify and release this repository. Other pushes and pull requests run checks only. The agent has not committed or pushed these files: the first Actions run happens after you publish them. A manual **Verify and release** run must also select master.

## Release sequence

1. Scan secrets/history, install the lockfile without dependency scripts, audit dependencies, check types/syntax, run tests and build. Frontend also checks TypeScript and SCSS lint. Backend tests use a separate PostgreSQL 18 service. Production secrets are not available to verification jobs.
2. A separate master-only job enters the `vercel-production` environment. Export exactly the verified Git SHA into a directory without Git metadata, pull the Vercel production configuration, build with Node 24.22.1/npm 11.21.1/Vercel CLI 65.2.0, and upload a production candidate with no domain assignment. Vercel metadata records the real release SHA/repository.
3. Backend only: require a private repository, check artifact storage headroom, check pending SQL, dump the database with a read-only role, encrypt it, and successfully upload it before running migrations. Apply forward migrations once; never seed or run down.
4. Check the staged app and a real database-backed catalog request. Reject a stale SHA, confirm no remote promotion/rollback is unfinished, then promote the candidate and check the public catalog.

Production operations share a serialized `production` concurrency group with `queue: max`. Backups cannot evict a queued release, and jobs do not cancel a running migration. GitHub allows up to 100 waiting operations; this is not an unlimited queue. A promotion timeout does not cancel the remote operation. A pending/unknown Vercel alias job blocks later releases until it is resolved.

The two repositories release independently. Keep API changes backwards compatible: deploy new backend capabilities first, then frontend code using them. Keep old endpoints/fields until old frontend builds are no longer used. Plan incompatible changes explicitly.

## Credentials and costs

GitHub environment `vercel-production` is restricted to master. Each project has its own expiring Vercel token, verified unable to access the other project. These CI tokens expire **2027-04-22**; replace the environment secret `VERCEL_TOKEN` before then. Project IDs and org IDs are public configuration, not secrets. Tokens, database URLs and dump keys are kept out of source. The approved Vercel automation bypass lets CI read protected candidate deployments without disabling their protection. The helper reads an existing bypass from project settings; it never creates or regenerates one. If you revoke it, releases stop at the candidate smoke check until you configure one again. Only trusted code should reach master because release code can read release secrets.

Vercel Hobby and Neon Free remain in use, with no paid add-ons enabled by this setup. Standard Linux Actions runners are used. Public frontend Actions minutes are free; private backend Actions uses the account's included allowance (GitHub Free currently 2,000 minutes/month and 500 MB storage, shared with other activity). This setup does not verify or change account-wide billing budgets. Check **GitHub Settings > Billing and licensing > Budgets and alerts** and keep paid Actions usage disabled/at zero if zero spend is mandatory. Frequent pushes and backups consume quotas.

## Failed release and rollback

A failed check, backup upload, migration or candidate smoke test stops promotion. A candidate may remain in Vercel without receiving production aliases. A failed transactional migration rolls back its SQL. A successful migration remains in place even if a later smoke check fails; additive compatibility is required so the old app still works. The public check runs after promotion; if it fails, inspect logs and roll back the app deliberately.

Release API reads retry network failures and HTTP 408/500/502/503/504 up to three times, with one- and two-second delays and a fresh 30-second timeout per attempt. Authentication, rate-limit and malformed-response errors stop immediately. Errors identify the method, API host/path and status or network code without logging tokens or response bodies. Promotion/rollback writes are sent once and reconciled against remote state after ambiguous failures. The latest-master check still runs after building and before promotion.

Open the repository's **Actions > Roll back application > Run workflow**, select master, and enter the previous `dpl_...` ID from the successful release summary. It validates the project and production/READY state, serializes with releases, and changes only the app deployment. It does not reverse migrations or restore data. On Vercel Hobby, Instant Rollback permits only the immediately previous production deployment; older IDs and never-promoted candidates are ineligible and the Vercel API rejects them. See [rollback eligibility](https://vercel.com/docs/instant-rollback). A later successful explicit promotion restores normal release behavior after a rollback. When a remote alias operation is unfinished, resolve it in Vercel before retrying.

Sources: [Vercel staged production deployments](https://vercel.com/docs/cli/deploy), [GitHub concurrency queues](https://github.blog/changelog/2026-05-07-github-actions-concurrency-groups-now-allow-larger-queues/), [Actions allowances](https://docs.github.com/en/billing/reference/product-usage-included).

## Setup verification (2026-10-25)

Both GitHub environments/secrets and master branch policies were read back successfully. Separate Vercel tokens were verified to access only their own project. The dedicated database role applied zero pending migrations, preserved all 40 courses/390 lessons, and passed a rolled-back future-backup-grant probe. A fresh hosted dump encrypted successfully to 17,938 bytes after ownership transfer.

Backend prebuilt deployment and frontend prebuilt deployment (built in pinned Linux Node 24.22.1) passed protected candidate smoke checks with real catalog reads. Original public deployment IDs remain unchanged. Frontend lint/type/unit/build/browser checks and backend integration/release tests pass. Promotion/rollback failure transitions are covered with mocked APIs; live production promotion/rollback and the first GitHub Actions run remain untested until publication. The agent created no commits or pushes.

The five workflows were checked with official actionlint 1.7.12. That validator does not yet recognize GitHub's supported queue:max setting, so this exact diagnostic was excluded while the setting was independently checked against current official GitHub documentation. No other actionlint diagnostics remain.

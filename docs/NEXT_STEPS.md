# What to do after deployment

The frontend, backend and PostgreSQL database are live. The full course flow has been tested, both hosting projects remain on Vercel Hobby, and the database remains on Neon Free. No commits or pushes have been made.

## 1. Save recovery material

The tested recovery kit is in the parent workspace at `.cache/deployment/recovery-kit-2026-10-25.zip`. It contains only the encrypted hosted database dump, SHA-256 checksum and a recovery README. The archive contains no passphrase or database credentials. Store a copy separately from this development checkout.

Save the `backupPassphrase` field from the backend's ignored `.cache/deployment/cloud-credentials.json` in a password manager. Copy only that field for backup recovery; do not paste the file or credentials into chat or Git. Keep the passphrase separate from the encrypted archive. The original dump restored 40 localized course records and 390 lessons successfully. Complete recovery instructions are in the backend's `BACKUPS.md`.

## 2. Review and publish source when ready

All required source, configuration, migrations, tests and runbooks are staged in the two existing repositories. Review their staged changes before making your own commits and pushing. Credentials, dependency folders, generated builds, local caches, Vercel links/auth data and downloaded agent skills are excluded.

The explicit no-commit instruction remains in force. CI/CD and encrypted daily backups are configured in GitHub but activate only after you commit and push the staged files to master. See [CI_CD.md](../CI_CD.md) for release order, safeguards and rollback. Push backend changes first and wait for its green release before a frontend change depends on them.

## 3. Check the first automated release

Open Actions in each GitHub repository after your first push. Verify **Verify and release** finishes successfully. In the private backend repository, also run **Encrypted database backup** manually and confirm its downloadable encrypted artifact. Credentials and DATABASE_BACKUPS_ENABLED are already configured. Dumps have a 10 MiB limit, seven-day retention and a 200 MiB repository artifact ceiling. Keep the decryption key separate, and verify account-wide free allowances/zero paid usage in billing settings.

## 4. Optional uptime alerts

Built-in Vercel logs are available now; Hobby runtime-log retention is currently one hour. An external uptime alert is optional and has not been configured. A personal-project monitoring service such as Better Stack has a free tier; creating its account and selecting a notification destination remain separate account steps.

For a basic monitor, use `GET https://learning-platform-gray-mu.vercel.app/favicon.svg`, expect HTTP 200, and use a free check interval. This static route was verified and does not query Neon. It checks static availability, not database functionality. Do not point frequent checks at the course API: they can keep the free database awake. After each deployment, also verify the real catalog/search/lesson flow manually. Test any alert destination before treating monitoring as active.

## 5. Use and extend the demo

You can share https://learning-platform-gray-mu.vercel.app now. Course/lesson content is database-backed. Account/profile previews, saved courses, progress, comments, payments and certificates are not implemented by this deployment. If extending the learning product, authentication and persisted learning progress are the next meaningful feature scope to define; they need backend write endpoints and carefully scoped database grants.

Service URLs, verified deployment IDs, rollback instructions and dashboard links are in `LIVE_DEPLOYMENT.md`. No paid upgrade is needed for the current demo while it stays within the free allowances.

References: https://vercel.com/docs/logs/runtime and https://betterstack.com/pricing

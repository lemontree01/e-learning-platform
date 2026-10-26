# Security and dependency maintenance

The frontend uses the sibling PostgreSQL-backed NestJS API. Database credentials belong only in private backend configuration; see the backend README for setup. Atlas remains disconnected.

## Configuration and suspected old Atlas credential

Keep `.env.example` files limited to public examples/placeholders. Environment files and private-key files are ignored. Frontend configuration is compiled into publicly downloadable assets: only a public API origin belongs there. Do not add passwords, tokens, private keys, or MongoDB connection credentials.

**Outstanding owner action (unverified):** if the old Atlas database user still exists, delete it or rotate the suspected credential, and review database users, roles, and IP access rules. Disabling an application server does not revoke that database user's credential. Manage access in Atlas; do not paste credentials into issues, logs, or this repository. See [Atlas database-user documentation](https://www.mongodb.com/docs/atlas/security-add-mongodb-users/) and [IP access-list documentation](https://www.mongodb.com/docs/atlas/security/ip-access-list/).

## Local checks

Use Node.js **24.22.1** and npm **11.21.1**. The Node target includes the [October security fixes](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases). Lifecycle scripts remain disabled in `.npmrc`; do not enable them to install this application.

```sh
npm ci --ignore-scripts
npm run security:audit
npm run security:secrets
```

The audit command checks both the complete dependency tree and production dependencies. Do not use forced audit fixes or blanket overrides to hide an advisory. Report any remaining finding with its dependency path and the reason remediation is blocked.

Verification on 2026-10-25: full and production audits for both projects report **zero vulnerabilities**. A targeted `next -> postcss: 8.5.31` override replaces Next.js 15.5.28's pinned vulnerable PostCSS 8.4.31 with the patched PostCSS version already used by this project. The generated lockfile removes only the nested vulnerable copy and marks the hoisted patched copy as a production dependency. Clean installation, production build, type checks, unit tests, and real browser checks validate compatibility. This is an actual dependency replacement, not an audit exclusion. Review removal of the override when Next.js includes a patched PostCSS directly. [Official PostCSS release](https://github.com/postcss/postcss/releases/tag/8.5.31).

The scanner downloads **official Gitleaks 8.30.1** from its [release](https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1), validates the archive against pinned official SHA-256 checksums, and scans the working tree plus all available local Git refs/history. It supports Windows x64 and Linux x64 with `tar` installed. It requires readable Git history and fresh reports, and fails if either scan cannot complete.

All scan output and JSON reports use full redaction. Terminal summaries show only rule names, paths, and line numbers. Reports and verified tool downloads stay in ignored `.cache/security/`. Default Gitleaks rules are extended with an authenticated MongoDB URI rule; generated dependency/build/test/cache directories, including `.next/` and its generated preview/encryption keys, are excluded. Do not upload raw scanner output or secret values. A clean scan covers available local content and known patterns; it cannot verify external credential revocation or inaccessible/deleted remote refs.

## Automated maintenance

Both repositories include weekly Dependabot npm and GitHub Actions checks. CI uses the pinned runtime/npm, full-history checkout, immutable installation with dependency scripts disabled, unchanged-lockfile verification, full/production audits, and redacted history/tree scans. Frontend CI also checks TypeScript, unit/component tests, and production builds; API CI runs integration tests.

Browser scenarios require the paired sibling checkouts and run locally using the frontend's `npm run test:e2e`. Review upgrade pull requests with these scenarios before merging.

GitHub workflows have been added locally; remote CI results are pending publication. **Recheck GitHub dependency alerts after the updated manifests and lockfiles reach each repository's default branch.** Do not assume local audit results close existing GitHub alerts immediately.

Existing restoration changes and Git history are preserved. This pass does not rewrite history, force-push, provision external services, or establish that the suspected Atlas incident is resolved.

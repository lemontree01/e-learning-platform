# Dependency stabilization report

Date: 2026-10-25. This pass preserves the restored React/Express demo, existing design, API response shapes, JSON fixtures, and Git history. Next.js and Code Observatory remain later stages.

This records the dependency-stage baseline. A subsequent frontend redesign now introduces the Code Observatory visual direction and SVG experiment; current UI verification and reduced legacy lint counts are recorded in [DESIGN.md](DESIGN.md). The full 3D experience remains later work.

## Dependency results

| Project | Before: full audit | After: full audit | After: production audit |
| --- | --- | --- | --- |
| Frontend | 48 (9 critical, 13 high, 25 moderate, 1 low) | 0 | 0 |
| Course API | 0 | 0 | 0 |

Audits use normal npm dependency resolution, with lifecycle scripts disabled. No forced audit fixes, blanket overrides, or advisory suppressions were used. Results describe known advisories at verification time; they do not certify every package as safe.

| Tool/library | Installed verification target |
| --- | --- |
| Node.js / npm | 24.22.1 / 11.21.1 |
| Webpack | 5.112.2 |
| Webpack CLI / development server | 7.2.3 / 6.1.0 |
| React Router DOM | 7.18.4 |
| i18next HTTP backend | 4.0.5 |
| Stylelint / standard SCSS config | 17.16.0 / 17.0.0 |
| Official Gitleaks | 8.30.1 |

React 18, MUI 5, Redux Toolkit 1, Express 4, and other unaffected majors remain in place. Removed unused Storybook and its ESLint plugin, unused Babel configuration/tooling, Sass resources loader, regenerator runtime, and redundant Webpack type stubs. Babel dependencies still required by SVGR/test tooling remain transitive dependencies.

Compatibility changes:

- Webpack CLI loads the existing typed configuration through an explicit CommonJS/ts-node entry. The development server binds to loopback and retains hot reload and SPA fallback.
- React Router retains declarative routes and existing URL/query behavior. TypeScript uses bundler resolution for current package exports; Jest/ts-node keep explicit CommonJS resolution. Jest supplies the standard TextEncoder/TextDecoder APIs missing from its older jsdom environment.
- Translation loading keeps the existing public locale paths and on-demand namespaces, using the backend's native-fetch implementation in supported browsers.
- Stylelint retains the existing policy; explicit specificity, duplicate-selector, zero-unit, and SCSS variable-spacing options prevent upstream configuration relaxations. No new lint-rule suppressions were added.

## Credential-exposure prevention

The unused document-database model and empty schema scaffolding were removed in this baseline. A subsequent backend rewrite now stores courses and lessons in PostgreSQL and requires backend-only database configuration; see the backend README. Atlas remains disconnected. Both projects retain public example configuration and ignore environment/private-key files. Frontend configuration is publicly visible.

Official, checksum-verified Gitleaks scanned both working trees and all available local Git refs/history with full redaction: **zero secret findings in either repository**. Synthetic authenticated MongoDB URI detection/redaction and failure outside a readable repository were also checked. Only redacted locations would be reported for a finding; generated dependency/build/test/cache artifacts are excluded.

**Owner action remains unverified:** revoke or rotate the suspected old Atlas database-user credential if the user still exists, and review database users and IP access rules. Disabling the application server does not revoke Atlas credentials. See [SECURITY.md](../SECURITY.md) for official Atlas links and scanning details. History rewriting and force-pushing are excluded.

## Regression verification

Verification used the pinned portable Node/npm toolchain, leaving the machine-wide installation unchanged. Both projects passed clean `npm ci --ignore-scripts` with unchanged lockfile SHA-256 hashes. The frontend passed strict TypeScript checking, all 29 existing unit/component tests, and the production build; the API passed all seven integration tests. A workspace-local npm cache was used after the restricted environment blocked writes to the default machine-wide cache.

All six browser scenarios passed against the final production build and paired local API in Microsoft Edge; the upgraded development server was also verified. They cover course/lesson direct links and refresh, thumbnails, search and query persistence, browser Back/Forward, missing/legacy links, mobile navigation at 320px/375px, themes, and English/Russian translation plus about/teachers/contacts namespaces. Hot-module replacement passed against the development server without changing source bytes. CI/Dependabot YAML was parsed and its required structure checked locally.

## Automated maintenance and follow-up

Both repositories now contain weekly Dependabot checks for npm and GitHub Actions, and CI for immutable installation, unchanged lockfiles, full/production audits, redacted history/tree secret scans, and the appropriate tests. Frontend CI also runs TypeScript and a production build. Browser integration remains a paired-checkout local verification.

Remote CI has not run from these local edits. **Recheck GitHub dependency alerts after the manifests and lockfiles reach each default branch.** Local audit results do not establish that existing GitHub alerts have closed.

Existing unrelated debt is tracked separately:

- ESLint: 12 legacy errors and one warning; mostly optional/boolean class-name interpolation, missing newlines, and existing formatting. The rules remain unchanged.
- SCSS: 128 findings across 15 files, including existing color notation, duplicate selectors, ordering, and specificity issues. These require a separate style cleanup with visual regression checks. Rule implementations and diagnostics change across the Stylelint upgrade; the original baseline was 123 findings across 15 files. The original specificity/duplicate-selector checks remain enabled explicitly.
- The production build succeeds with three existing bundle-size/runtime-chunk performance warnings. Optimization is a later stage.
- The retained ESLint 8/Jest 29 toolchains include packages with npm deprecation notices (including glob/inflight and older jsdom utilities). Their current audit is clean; replacing these toolchains and migrating lint configuration is separate maintenance work.
- Accounts, comments, contact delivery, likes, saved courses, progress, and lesson media remain unimplemented demo functionality.

The full staged direction remains in [MODERNIZATION.md](MODERNIZATION.md).

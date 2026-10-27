# Frontend verification, 27 October 2026

The deployed site was inspected at https://learning-platform-gray-mu.vercel.app/home. This change improves mobile loading and frontend correctness while retaining the current layout, typography, themes, and desktop behavior. The results below describe the local production candidate; this work has not been deployed.

## Measured results

Lighthouse 13.5.0 ran in clean, headless Microsoft Edge against Next.js production builds and the same local test API. Each value is the median of three cold-page runs, with mobile's default simulated throttling and the separate desktop configuration. The baseline is the repository's starting HEAD; the candidate includes the existing working-tree copy updates. These are laboratory results, not field Core Web Vitals or a comparison with an extension-enabled browser session.

| Metric | Baseline | Candidate |
| --- | ---: | ---: |
| Mobile performance | 95 | 96 |
| Desktop performance | 100 | 100 |
| Mobile first contentful paint | 1.365 s | 0.908 s |
| Desktop first contentful paint | 0.375 s | 0.247 s |
| Mobile largest contentful paint | 2.829 s | 2.777 s |
| Desktop largest contentful paint | 0.609 s | 0.618 s |
| Mobile total blocking time | 12.5 ms | 17 ms |
| Desktop total blocking time | 0 ms | 0 ms |
| Mobile cumulative layout shift | 0.000122 | 0 |
| Initial homepage JavaScript, gzip, including shared shell | 238.1 KiB | 205.7 KiB |
| Mobile total transferred resources | 320.9 KiB | 288.4 KiB |

All three final mobile runs scored 96; all three desktop runs scored 100. Accessibility, best practices, and SEO scored 100 in every final run. Desktop LCP and mobile blocking-time differences are small; no improvement is claimed for them. Mobile LCP remains above 2.5 seconds under simulated throttling, so this is not a claim of perfect mobile performance.

Local raw evidence is under the ignored `.cache/frontend-audit/` directory: `local-before-*.json`, `final-after-*.json` (font stage), `lazy-after-*.json` (final candidate), and `accessibility-layout.json`. Do not commit generated build snapshots or test account data.

## Changes and performance decisions

| Change | Evidence | Decision |
| --- | --- | --- |
| Replace MUI icon components on active routes with the same SVG glyphs; omit hidden featured-card avatars | Initial homepage JS 238.1 to 213.9 KiB after the initial correctness/icon changes; image requests for hidden avatars removed | Keep; preserve glyph geometry and MIT attribution |
| Preload the existing local font files for the initial language | Mobile FCP 1.365 to 0.910 s; desktop FCP 0.375 to 0.250 s; no duplicate font requests in either language | Keep; use the same URLs as the CSS, with anonymous CORS |
| Defer Motion layout features on the homepage/course index | Initial JS 213.9 to 205.7 KiB; mobile LCP 2.871 to 2.777 s; all three scores 95 to 96 | Keep; total transfer rises about 7 KiB versus the font-only stage, with less blocking initial code |

Motion's basic animation bundle is the fallback if the optional layout-feature chunk fails. Lesson links, the catalog, and grid/list controls remain usable. Reduced-motion settings still apply.

Correctness changes are covered separately from performance measurements:

- Catalog state includes language, query, and the current request ID. Older successful or failed searches cannot overwrite the latest request. Returning home uses its correct server-provided featured courses.
- Each rendered app owns its i18n instance, preventing concurrent English/Russian server renders from changing each other's language.
- Independent homepage API failures preserve successful data from the other request.
- Localized 404 and retry screens provide recovery. Route titles/descriptions follow navigation and language changes; account routes are marked noindex. `/robots.txt` is served as plain text.
- CI enforces a 225 KiB gzip budget for the homepage plus shared shell through `npm run check:bundle`. This includes initial build-manifest scripts; optional asynchronous chunks are excluded. A development build is rejected.

## Verification

- Production compilation and TypeScript checks.
- 117 unit/component tests, including request races, partial API failure, isolated language instances, and route recovery.
- All 49 browser tests pass, covering accounts, lessons, the code playground, keyboard navigation, responsive layouts, language/theme persistence, metadata, font reuse, and failure of the optional animation chunk.
- Axe checks across seven routes in both languages found no violations. Homepage layout checks at 320, 375, 768, 1024, and 1440 pixels in both languages and themes found no horizontal overflow. Desktop and phone screenshots were inspected.
- TypeScript lint has no errors; existing maximum-line-length warnings remain. SCSS lint passes.
- A deliberate inversion of the new request-ID guard caused both race regression tests to fail; the original implementation was restored afterward.

Run the normal checks from the frontend root:

```sh
npm run typecheck
npm run unit -- --runInBand
npm run lint:ts
npm run lint:scss
npm run build
npm run check:bundle
npm run test:e2e
```

The browser suite uses the dedicated test database described in [DEVELOPMENT.md](DEVELOPMENT.md). It must not target production. For performance measurements, serve the production build, use a clean browser profile, run mobile and desktop separately three times, and compare medians under identical conditions. Do not benchmark while builds or other browser suites are running.

## Release scope

The production database still needs its existing content rollout; local tests use the explicitly seeded test database. No production data, authentication schema, or deployment settings were changed. Existing unfinished product features listed in [DEVELOPMENT.md](DEVELOPMENT.md#what-is-still-unfinished) remain outside this frontend pass.

Use the existing [release workflow](LIVE_DEPLOYMENT.md) to stage, smoke-test, and promote the verified frontend. Re-run mobile/desktop Lighthouse against that candidate before promotion, then validate the public routes after release. Actual user performance still needs field evidence; these local scores cannot establish it.

Implementation references: [Lighthouse scoring and variability](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring), [font preload requirements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload), and [Motion's asynchronous feature loading](https://motion.dev/docs/react-lazy-motion).

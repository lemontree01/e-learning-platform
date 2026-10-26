# Sculptural learning platform

The portfolio frontend uses an editorial homepage, self-hosted Manrope and IBM Plex Mono,
original geometric course artwork, and a minimal JavaScript chapter index. The course
index is navigation: each numbered, named chapter opens its existing lesson URL directly.
The Observatory remains hidden; no simulation or arbitrary code execution is introduced.

## Interaction and rendering

- `CourseIndex` accepts the existing `Course` type and derives labels from ordered lessons.
  The complete authored course is currently course 0. Other courses retain sample-outline labels.
- Desktop has grid/list controls; widths below 1024px use a simple vertical syllabus.
- The chapter index uses small typographic numbers and fine rules, replacing
  the original folder-like slabs after visual feedback. Hover and keyboard focus emphasize
  the corresponding rule. Titles are readable without interaction.
- The index uses HTML/CSS and Motion. It does not load a WebGL renderer; unused Three.js
  and Fiber dependencies were removed with the original folder artwork.
- Motion and CSS transitions respect the operating system's reduced-motion preference.
- Mobile lesson navigation uses a native modal drawer with focus containment, Escape,
  focus restoration, and fixed previous/next controls. Code copying reports success/failure.
  Console examples reveal clearly labelled expected output; they do not execute code.

## Runtime compatibility

Next.js 15 App Router uses a React 19 runtime. The prior React 18 package declaration
did not reflect that browser runtime. React 19, React Redux, Redux Toolkit, React
types, and Testing Library are aligned with it. The API contract is unchanged.

## Verification

Use `npm run typecheck`, `npm run unit -- --runInBand`, and `npm run build`.
Run `npm run test:e2e` against the dedicated test database described in DEVELOPMENT.md.
Set `PLAYWRIGHT_PRODUCTION=1` to test an already-built production frontend instead of
the development server. Stop existing processes on the configured test ports first.
On Windows, `PLAYWRIGHT_CHANNEL=msedge` uses the installed Edge browser.

Browser coverage includes real chapter navigation, list switching, operation without WebGL,
localized responsive layouts, direct links/refresh, and mobile drawer keyboard behavior.
Visual review must also check title overlap, contrast, focus, and both themes.

The initial sculptural pass was verified locally on 2026-10-26: 54 unit/component tests, 26 production Edge browser
scenarios, strict TypeScript, changed-file ESLint/Stylelint, and the production build pass.
An additional sweep covers both languages and themes at 320, 375, 768, 1024, and 1440px
without horizontal overflow or clipped syllabus labels. Automated axe checks on seven
routes in both languages report zero violations. Those results include the previous 3D scene;
its rendering-specific tests were retired when the user requested the minimal index.
The dependency audit and redacted working-tree/history secret scans report zero findings.

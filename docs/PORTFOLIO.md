# Sculptural learning platform

The portfolio frontend uses an editorial homepage, self-hosted Manrope and IBM Plex Mono,
original geometric course artwork, and a minimal JavaScript chapter index. The course
index is navigation: each numbered, named chapter opens its existing lesson URL directly.
The Observatory remains hidden; no simulation or arbitrary code execution is introduced.

## Interaction and rendering

- `CourseIndex` accepts the existing `Course` type and derives labels from ordered lessons.
  The complete authored course is currently course 0. Courses without lessons are shown as coming soon.
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

## Course artwork and motion — 2026-10-30

Every course card shows its subject's icon (Angular, React, Python, a cart for e-commerce…)
extruded into the sculpture's ceramic. The 20 icon paths live in
`src/shared/ui/CourseArtwork/courseIcons.ts`. Once a card scrolls into view, a lazily loaded
three.js chunk spins the icon slowly. On mouse hover it makes one quick turn to face the viewer,
then tilts toward the pointer. All cards share one WebGL context and copy frames into their own
canvas. Reduced motion, missing WebGL or a lost context keep the static poster. After changing
an icon, run `node scripts/render-course-art.cjs`, review the posters in both themes, and check
them in (`public/images/courses`). The light theme inverts the poster and the live icon, like
the hero poster. Courses beyond the 20 icons reuse earlier ones.

Motion uses the browser's View Transitions API and CSS scroll timelines, with no new dependencies:

- The theme switch reveals the new palette as a circle growing from the toggle.
- A plain click on a catalog card morphs its artwork into the course page header. Hover and focus
  prefetch the course so the page usually renders within the transition.
- Catalog cards and chapter rows settle in on scroll. They avoid opacity, so text keeps full
  contrast for axe checks.
- Lesson pages show a reading progress line.

Without browser support, or with reduced motion, each feature falls back to the previous behavior.
React's `<ViewTransition>` is deliberately not used: Next 15.5's vendored React has no stable
export, and `experimental.viewTransition` switches the app to experimental React.

Verified locally: 142 unit/component tests, strict TypeScript, changed-file ESLint/Stylelint, and
the production build pass. Homepage JavaScript is 212.8 KiB gzip. The browser suite was not run
because no local test database was available. Edge checks against the live API confirmed all 20
distinct images, the theme reveal, card morph, progress line, reduced-motion fallbacks and a clean
console. Local Lighthouse mobile accessibility is 100 on `/home`, `/courses`, `/course/0`, and
its first lesson. `/courses` performance is about 90 instead of 100. The card image is now the
largest paint, and the catalog is still fetched in the browser. Server-rendering the catalog like
the homepage would fix this, but the catalog retry browser test would need reworking.

# Frontend redesign contract

## Current portfolio direction — 2026-10-26

The approved sculptural frontend is documented in [PORTFOLIO.md](PORTFOLIO.md).
It supersedes the historic Observatory direction below: the homepage presents the complete
JavaScript course through a minimal chapter grid with ordinary lesson links. Keep the
black/white palettes, localized content, keyboard support, and useful graphics fallback.
The Observatory remains hidden. Historical verification counts below describe earlier passes.

## Direction

Current presentation: **Learning platform / Учебная платформа**. The public UI focuses on courses. The playground is preserved behind `features.playground = false` in `src/shared/config/features.ts`, including its component/model tests and translations. Navigation, page metadata, controls, sample names, and course copy are localized through i18next; Russian lesson counts use its plural forms. The original Observatory direction below remains a later design option.

The learning-platform pass passes 40 unit/component tests, all 14 browser scenarios, strict TypeScript, and scoped lint checks. Browser checks verify the hidden playground is not requested, its public links are absent, Russian controls and page titles work, and language selection survives refresh. The original experiment's unit/component tests remain active while its public browser scenario is replaced by coverage of the hidden state.

Code Observatory is a public learning demo for curious developers and portfolio reviewers. The first screen should invite a visitor to run a small experiment, then explore the working course catalog. Keep the current React stack and API while redesigning; the Next.js migration and full 3D observatory remain later work.

Use a pure black page in dark mode and a pure white page in light mode, with neutral surfaces, contrasting text, thin rules, restrained corners, and precise monospace annotations. All theme palettes are defined in `src/shared/config/themes.ts`; components and SVG artwork use semantic CSS variables. A procedural SVG instrument provides an original visual identity without adding dependencies or external images.

Reference decisions: [Linear](https://linear.app/) informs restrained hierarchy and compact navigation; [Brilliant](https://brilliant.org/) informs immediate interactive learning; [Bartosz Ciechanowski's explanations](https://ciechanow.ski/) inform visible, user-controlled simulations. These are structural references; branding, copy, components, and artwork are original.

## First pass

- Replace the old dashboard shell with a compact top navigation, accessible navigation drawer, search, language/theme controls, and a quiet footer.
- Create an editorial homepage and interactive async-request preview. Label timing as simulated; allow replay, pause, scrubbing, and cancellation. Never execute visitor code or imply lesson completion is saved.
- Redesign catalog cards, query/topic navigation, course overview, lesson list, and lesson reading shell. Retain fixture thumbnails and honest unavailable states.
- Apply consistent tokens to remaining pages without inventing account/contact services or real learning statistics.

## Required states and verification

Preserve existing URLs, query strings, Back/Forward, direct links/refresh, English/Russian namespaces, thumbnails, search empty/error/loading states, and both themes. Use real links/buttons, visible keyboard focus, one page h1, a skip link, modal drawer focus handling, and reduced-motion support. New copy is localized. Test at 320, 375, 768, 1024, and 1440 pixels, with keyboard and production-build browser checks.

Reject stock dashboard statistics, testimonial claims, fake progress, decorative controls, autoplay, purple gradients, CDN-dependent core visuals, and a simultaneous framework migration.

## Implemented and verified — 2026-10-25

Palette follow-up: the original copper/olive styling has been replaced with monochrome black/white themes, including the experiment artwork and controls. Theme configuration is shared by the initial HTML and React provider. The selected theme survives parent rerenders and language changes; the palettes themselves are configuration, while the current selection lives in Redux.

The palette follow-up passes 36 unit/component tests, 13 production browser scenarios, TypeScript, and lint checks for the changed files. Automated accessibility checks remain clean across both languages and the white-theme homepage; black/white screenshots were inspected. The initial black palette is also verified with JavaScript disabled, before React starts.

The first pass is implemented in the current React app. It includes the original SVG instrument and deterministic async-request experiment, default dark and warm light themes, responsive shell, course/topic navigation, course overview and lesson outline/pagination, About page, sample teacher directory/profiles, a disabled contact-form preview, and honest account preview screens. Invented social statistics, testimonials, and comment activity have been removed from the rendered experience. Existing routes and fixture-backed API contracts remain intact.

No project dependencies were added or upgraded during the redesign. Unused remote font/icon stylesheets were removed from the HTML; the new interface uses local SVGs, bundled icons, and system fonts. Removing the obsolete HTML base URL also fixed native skip-link navigation without affecting direct routes or asset loading.

Verification:

- Strict TypeScript, all **34 unit/component tests**, and the production build pass.
- All **11 browser scenarios** pass against the production build and paired local API, including request-error recovery, keyboard skip/focus handling, reduced motion, experiment controls, lesson/topic navigation, and the existing browsing regressions.
- A responsive sweep checked 11 routes in both languages at 320, 375, 768, 1024, and 1440 pixels: no horizontal overflow or browser errors. Desktop/mobile screenshots were inspected for hierarchy, clipping, and readable states.
- Automated axe-core 4.14.0 checks report zero violations on all 11 routes in English and Russian, plus the light-theme homepage. Automated checks supplement the keyboard checks; they are not a complete accessibility certification.
- All newly introduced or rewritten TypeScript/components and styles pass their existing lint rules. The broader repository retains **9 legacy ESLint errors and one warning**, and **23 legacy stylesheet findings** in files outside this design pass. No rules were relaxed.
- Full and production dependency audits remain at zero; redacted working-tree/history secret scans remain clean. The production build retains the three previously documented bundle-size/runtime-chunk warnings.

Next.js, full 3D rendering, real accounts, saved progress, and lesson content remain in the staged roadmap. External Atlas credential revocation and remote CI/dependency-alert follow-up remain tracked separately in [SECURITY.md](../SECURITY.md).

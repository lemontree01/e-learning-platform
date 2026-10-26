# Modernization roadmap

## Part 1: Restore the existing application (implemented)

Keep React, Webpack, Express, and the existing visual design for this stage.

- Make installation, API startup, frontend development, and production builds reproducible.
- Run the JSON-backed course API without an unused MongoDB requirement.
- Connect the frontend to the local API by default.
- Fix course search, language selection, images, course details, lesson navigation, and refresh/direct links.
- Add regression tests for the repaired browsing flow and document accurate setup commands.
- Clearly distinguish missing functionality from working functionality. Accounts, comments, likes, saved courses, and lesson media were never connected to real services.

Done when a fresh checkout can run both apps and browse/search courses and open/reload course and lesson pages without crashing.

Verified baseline: clean npm installs with unchanged lockfiles, strict TypeScript checking, 29 frontend unit/component tests, 7 API tests, and a successful production build. Browser regression scenarios cover direct course/lesson links, refresh, search, missing links, 320px/375px mobile layouts, language switching, and theme switching. Dependency stabilization results and remaining lint debt are recorded in [STABILIZATION.md](STABILIZATION.md).

## Part 2: Stabilize and harden

Dependency and credential-exposure prevention pass implemented locally:

- Remove unused database scaffolding and unused vulnerable tooling; upgrade the router, translation backend, Webpack toolchain, and Stylelint while retaining the existing design and unaffected library majors.
- Pin the supported Node/npm toolchain, preserve disabled dependency scripts, and achieve zero full/production audit findings in both projects.
- Scan both working trees and available Git history with official, checksum-verified Gitleaks and fully redacted output.
- Add weekly Dependabot checks and CI for clean installation, audits, secret scanning, tests, frontend type checking, and builds.

Before closing this part, the owner must verify old Atlas credential revocation/access rules. Remote CI and GitHub alert rechecks remain pending publication to the default branches. See [../SECURITY.md](../SECURITY.md).

Follow-up hardening and usability work:

- Repair the recorded lint/style debt without changing the visual design.
- Review API input validation and deployment security configuration before public production use.
- Resolve remaining usability and accessibility defects; replace misleading placeholder actions with useful states.
- Decide which existing features to complete before migration, avoiding work that will immediately be replaced.

## Part 3: Introduce the modern foundation

Frontend design pass implemented first: Code Observatory branding, responsive navigation, catalog/course/lesson layouts, secondary demo screens, and a lightweight SVG async-request experiment with replay, scrubbing, speed, and cancellation controls. This establishes the visual direction in the current React app before migration. See [DESIGN.md](DESIGN.md). Accounts, database-backed progress, and full lesson materials remain future work.

- Migrate to Next.js App Router, modern React, strict TypeScript, Tailwind, and shadcn/ui.
- PostgreSQL course/lesson persistence is implemented in the NestJS backend using `pg` and versioned SQL migrations through `node-pg-migrate`. Extend this foundation for future account/progress features; see the backend README for setup.
- Implement Better Auth email/password registration, verification, sessions, logout, and password recovery.
- Use Mailpit locally and Resend for deployment email.
- Deliver saved courses, lesson completion, last learning position, and a working dashboard.
- Retain English/Russian support using next-intl and seed three original programming courses with three text/code lessons each.
- Add Vitest, Testing Library, Playwright, a committed lockfile, and documented Vercel/Neon deployment configuration.

## Part 4: Code Observatory portfolio experience

The selected destination remains an interactive 3D learning observatory, available without registration.

The current redesign includes a working 2D/SVG preview of the async-request scenario. The full 3D machine, camera transitions, and connection to saved learning progress remain in this later stage.

- Create an original procedural machine in a charcoal environment with warm metallic surfaces, moving signals, and JavaScript, TypeScript, and React course modules.
- Show “See how code comes alive” with “Run the demo” and “Explore courses” actions.
- Use Three.js, compatible stable React Three Fiber/Drei, and Motion for interactive geometry, interruptible camera movement, mechanical opening sequences, and interface transitions.
- Build one polished signature lesson: two simulated search requests return out of order; the visitor can pause/replay/change speed, inspect the timeline, and enable cancellation to see the fix.
- Drive the scene and accessible HTML timeline from the same deterministic, typed scenario events. Label simulated timing clearly; arbitrary code execution is outside the initial release.
- Connect saved lesson completion to observatory progress.
- Load 3D separately from readable content; provide keyboard/touch navigation, reduced motion, a pause control, adaptive quality, and a useful 2D fallback when WebGL is unavailable.
- Prove one complete scene and interactive lesson before adding more simulations. Target 60 fps desktop / 30 fps mobile and stop rendering when hidden.

Payments, certificates, AI features, multiplayer, course administration, and additional simulation engines remain deferred. Publishing and external service provisioning are separate from local implementation.

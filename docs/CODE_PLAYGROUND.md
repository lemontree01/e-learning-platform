# Lesson code playground

Approved scope: CodeMirror editor, JavaScript and Python, Run/Stop/Reset, input and plain-text output inside lesson code examples. English/Russian, existing monochrome themes, keyboard and small-screen support. Browser execution only; no accounts, paid services, backend execution, uploaded files or code persistence.

## Execution contract

- JavaScript and Python editors are open by default; other lesson languages retain their code display/copy controls. Runtime downloads and execution begin only when Run is pressed.
- Keep code and live output in one panel, side by side when the panel is at least 640px wide and stacked below that. Program input and the original expected answer are independent disclosures. Copy uses the edited source; Reset restores the starter. Lesson navigation resets each example.
- Syntax colors distinguish keywords, strings, numbers, functions, definitions, properties, types and comments. Theme tokens provide contrasting palettes for light/dark mode; the surrounding interface stays neutral.
- Preserve the lesson starter; changing language offers an independent starter. Reset restores that language's starter. Each run starts with fresh state.
- Lesson content, including alternate JavaScript/Python starters, comes from the backend lesson endpoint, `GET /api/courses/:courseId/lessons/:lessonIndex?lang=eng|rus`, when that lesson is opened. Course responses contain lesson titles only. A code block's optional `starters` map is passed directly to the editor. With older/custom blocks that omit an alternate starter, switching languages opens an empty editor. The original language always resets to that block's `code`. Deploy the backend and run its explicit seed command to upgrade unchanged stored lessons before deploying this frontend.
- JavaScript uses pinned QuickJS-WASM with a 16 MiB interpreter heap, bounded stack and an execution interrupt. Browser/Node APIs and imports are unavailable.
- Python uses pinned Pyodide/CPython and its bundled standard library. No third-party package downloads, browser integration or network access. Load Python assets only on Run.
- Source: at most 32 KiB; input: 8 KiB; output: 16 KiB / 200 lines. Initialization has a separate deadline; execution stops after three seconds. Stop and unmount destroy the execution context.
- Output and program errors are displayed as text inside the playground. They are never interpreted as HTML or logged as application console errors.

## Threat model and boundary

Untrusted source/input and interpreter output must not obtain application cookies, storage, DOM, credentials, account API access or external network access. Student code remains browser-local.

A fixed sandbox document is served under `/code-sandbox/frame.html` with its own response CSP. The iframe and response both use `sandbox allow-scripts` without `allow-same-origin`. No global application CSP is weakened. The document has no forms, navigation controls or user HTML. Code executes only in its dedicated opaque-origin Worker.

The application loads a fixed manifest and content-addressed runtime assets from its own origin with `credentials: omit` and SHA-256 integrity. It transfers bytes, source and input as message data. The sandbox policy permits blob modules/data for those preloaded runtimes; it denies HTTP(S) connections, nested frames, forms, objects and base URL changes. No submitted source is interpolated into a document or evaluated in the application.

The application and sandbox communicate over a private MessageChannel, never a permissive global result listener. The Worker receives no parent port or window reference. Capture native output/error functions and required primitives before loading interpreters; remove native messaging, reportError and nested Worker constructors from the exposed Worker global/prototypes. Permanent native error-cancellation listeners prevent attacker-triggered error floods. Aggregate output with a byte-oriented Python stream handler; emit a single bounded terminal result. Validate output again in the trusted frame and application.

## Review findings

Independent adversarial review identified native postMessage/error-report floods, nested workers, mutable host intrinsics, line-buffered output, and srcdoc CSP inheritance. These are acceptance tests and implementation constraints, not assumptions that a Worker alone is a sandbox. The user declined an additional external-model review.

Browser-process memory exhaustion cannot be strictly prevented for arbitrary Pyodide programs. This is a short-exercise playground, not a hardened remote multi-tenant execution service. Interpreter/browser vulnerabilities remain dependency-update concerns. Do not add DOM execution, arbitrary packages, networking, user files or grading authority without a new security review. Never use client execution results as trusted grading or authorization evidence.

## Build and verification

`npm run playground:build` explicitly bundles the pinned Worker and copies runtime files from installed npm packages. Dependency lifecycle scripts remain disabled. Generated assets are ignored and rebuilt by `npm run build` and `npm run dev`; no CDN or runtime dependency installation is used.

The broker uses a classic opaque-origin Worker. The Pyodide loader/ASM module is bundled as a trusted bootstrap; its single virtual WASM fetch is fulfilled from preloaded bytes, and its exact stdlib blob is the only other startup fetch. The fetch capability is then permanently disabled. This avoids granting network access for bootstrap and avoids module-Worker opaque-origin loading incompatibilities. Content-addressed assets are cached with integrity; the manifest is not cached. Third-party notices are generated beside the runtime files.

Verify JavaScript/Python output and input, syntax/runtime errors, Stop/reset, infinite loops, output floods, account API/network/storage/DOM denial, native message/error/nested-worker bypass attempts, source bounds, language changes, unmount cleanup, mobile layout, localization and clean ordinary browser console. Keep static expected-output lesson blocks as reference answers.

2026-10-26 local verification: 76 unit/component tests and 18 production-browser tests passed, including the existing account lifecycle. Adversarial cases reach Python's native JS global and verify messaging/Worker/reportError are absent, its origin is opaque, network requests do not occur, mutable String intrinsics cannot expand output, and asynchronous native errors do not flood the application. Multiline exceptions and malformed UTF-8 stay within the output budget. The default-open editor, separate reference answer, edited-source copy, lesson navigation, keyboard focus and five viewport widths were verified. Both themes and Russian/mobile screenshots were inspected; all syntax colors exceed 5.4:1 contrast against their theme's brightest/darkest editor surface. No dependency vulnerabilities or secret findings were reported during the runtime implementation; the UI follow-up adds no dependencies. This verification does not claim resistance to browser/interpreter vulnerabilities or a hard Python process-memory limit.

Sources: [CodeMirror](https://codemirror.net/), [QuickJS-WASM](https://github.com/justjake/quickjs-emscripten), [Pyodide deployment](https://pyodide.org/en/stable/usage/downloading-and-deploying.html), [Pyodide stream handlers](https://pyodide.org/en/stable/usage/streams.html), [sandbox semantics](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#sandbox).

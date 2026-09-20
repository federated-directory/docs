# Agent Rules and Guidelines

## Architecture Overview

This project is a static documentation site built with [VitePress](https://vitepress.dev/) and integrated with [Scalar](https://scalar.com/) for API references.

- **Framework**: VitePress (Vue.js based)
- **Deployment**: GitHub Pages (via GitHub Actions)
- **API Docs**: Scalar (fetching dynamically from Federated Directory API). Documentation from local Markdown files is **injected** into the Swagger spec during build.
- **Search**: Unified VitePress search indexes both Markdown content and API endpoints (via a generated index file), providing deep links into the Scalar interface.

### Project Structure

- `docs/`: Markdown source files for the documentation.
- `docs/.vitepress/`: VitePress configuration and theme customization.
- `docs/public/`: Static assets (images, icons, favicon).
- `scripts/`: Build-time scripts (e.g., Swagger sanitization and docs injection).

## Build and Run Guidelines

### Running Locally

- **Install**: `npm install`
- **Start**: `npm run docs:dev` (Runs VitePress dev server at `http://localhost:5173`)
- **Build**: `npm run docs:build` (Generates static site in `docs/.vitepress/dist`)
- **Preview**: `npm run docs:preview` (Serves the build output locally)

## Code Style

- **Markdown**: Use GitHub-flavored Markdown.
- **Images**: Store images in `docs/public/images/` and reference them with absolute paths (e.g., `/images/logo.svg`).
- **Links**: Use "Clean URLs" (no `.html` or `.md` extension in internal links).
- **Frontmatter**: Keep frontmatter minimal. Navigation is controlled via `docs/.vitepress/config.mts`.

## Design & Styling

This project adheres to **Material Design 3 (M3)** principles to ensure a consistent user experience with the main Federated Directory application (`/fd/frontend`).

- **Typography**: Use **Roboto** as the primary font family.
- **Colors**: Adhere to the M3 color palette defined in `docs/.vitepress/theme/custom.css`. These tokens (e.g., `--vp-c-brand-1`) are synchronized with the frontend's primary blue and neutral tones.
- **Dark Mode**: Supports native dark mode. All custom styling (including API references) must be responsive to the `.dark` class.
- **Scalar Integration**: The API reference is styled via CSS variable mapping to match the documentation's Material theme exactly.

## Content Organization & Scope

Documentation is split across three audiences, each with its own sidebar
section (`docs/user/`, `docs/administrator/`, `docs/developer/`, plus a few
top-level pages like `mcp.md`). Keep content strictly scoped to its section
— this is what keeps the developer docs (and, by extension, the Scalar API
reference they feed into) from turning into a duplicate of the admin/user
manual:

- **User docs**: how an end-user uses the Federated Directory portal itself
  (searching contacts, managing their profile, groups, chat methods, etc.).
- **Administrator docs**: how an administrator configures the portal
  (directories, SSO/SCIM setup, groups, company settings, and — importantly
  — creating directory keys / API keys via the UI). This is the single
  source of truth for "click through the portal to do X".
- **Developer docs** (and anything injected into Scalar, see below): how to
  use the APIs and the MCP server — authentication mechanics (JWT encoding,
  audiences/roles, scopes), request/response schemas, endpoints, tools, and
  integration patterns. Developer docs should **not** contain portal
  click-paths (e.g. "go to Directories > Keys tab > Create Key"). If a
  developer-facing task requires an action in the portal (creating an API
  key, creating a group, enabling a feature), **link to the relevant
  administrator (or user) doc instead of duplicating the steps** — e.g.
  `[Directory keys](/administrator/directories#directory-keys)` rather than
  re-explaining the click-path inline.

When editing developer docs, ask: "is this explaining an API/MCP concept, or
is this explaining how to click through our portal?" The former belongs in
developer docs; the latter belongs in user/administrator docs, with a link
back to it.

## Scalar API Reference Integration Notes

The `/developer/api-reference` page embeds Scalar's `@scalar/api-reference` Vue
component (via `docs/.vitepress/theme/ScalarWrapper.vue`) inside the normal
VitePress layout (`layout: page`, standard VitePress sidebar/nav). Scalar was
not designed to be embedded this way, so it has several quirks that have
already bitten us once — check here before "rediscovering" them:

- **Scalar's own sidebar/toolbar conflicts with VitePress's.** Scalar has its
  own internal sidebar, search, and a built-in toolbar ("Developer Tools",
  "Configure", "Share", "Deploy" buttons, class `.api-reference-toolbar`).
  These duplicate VitePress's own sidebar/search and caused flickering/
  duplicate menus. Fix: `showSidebar: false` in the `configuration` object
  passed to `<ApiReference>` (note: **not** `hideSidebar` — that option
  doesn't exist and silently does nothing), plus `hideSearch: true`, plus
  hiding `.api-reference-toolbar` in `custom.css`. We rely entirely on the
  VitePress left sidebar for navigation on this page (do not set
  `sidebar: false` in `api-reference.md`'s frontmatter).
- **Scalar renders in light DOM**, not Shadow DOM, so global CSS in
  `custom.css` cascades into it normally — but Scalar re-declares its own
  `--scalar-*` CSS custom properties directly on `.light-mode`/`.dark-mode`
  (applied to `<body>`), which **override** any `--scalar-*` values set on
  `:root`/`.dark`. To theme Scalar, override them again, scoped to
  `.light-mode, .dark-mode { --scalar-...: ... !important; }`.
- **Duplicate download buttons.** Scalar renders its own "Download OpenAPI
  Document" (json/yaml) buttons (`.download`, `.download-container`) in
  addition to whatever custom download button we add. Since we provide our
  own single download button in `ScalarWrapper.vue`, both `.download` and
  `.download-container` are hidden in `custom.css`.
- **`.section-header-label` is reused for two different heading levels.**
  Scalar renders both the OpenAPI tag/section title (e.g. "Users", as `h2`)
  and each operation's title (e.g. "Delete a user", as `h3`) with this same
  class, defaulted to plain 16px/400-weight body text — it does not
  automatically match the site's heading scale. Size `h2.section-header-label`
  / `h3.section-header-label` explicitly to match `.vp-doc h2`/`h3` (24px and
  20px respectively, weight 400, confirmed via computed styles — don't
  assume `600`).
- **Injected Markdown content** (from `docs/developer/users-api.md`,
  `docs/developer/obtaining-a-token.md`, `docs/mcp.md`, injected into the
  OpenAPI tag `description` fields by `scripts/sanitize-spec.js`) renders
  inside Scalar's own `.markdown` containers with a smaller heading scale
  than the rest of the site. `custom.css` overrides `.markdown h1/h2/h3/p/li`
  to match `.vp-doc`'s scale.
- **Don't put a duplicate H1 in injected Markdown.** Scalar already renders
  the tag name as its own section title (`.section-header-label`, see
  above), so a leading `# Title` in the injected content produces a visible
  duplicate title (small tag label immediately followed by a big H1 saying
  almost the same thing). Fixed by stripping the leading H1 **during
  injection** in `scripts/sanitize-spec.js`'s `processMarkdown()` — not by
  editing the source `.md` files, since some of them (e.g. `mcp.md`) are also
  real standalone routable pages that need to keep their own H1, and others
  (`users-api.md`, `obtaining-a-token.md`) are redirect stubs to the API
  reference page.
- **In-page heading anchors don't work in injected content.** Scalar does not
  generate heading-slug `id` attributes for the Markdown it renders inside
  tag descriptions (it only supports this via a `withAnchors` prop used
  internally for per-*operation* descriptions, not tag-level ones). Any
  `[text](#some-heading-slug)` link inside injected content is dead — it will
  never scroll anywhere. Either remove the link (keep the label as plain
  `**bold**` text) or point it at a real Scalar section instead, e.g.
  `/developer/api-reference#tag/oauth2` (see next point).
- **`#tag/<name>` links across sections work, but only resolve once, on
  mount.** Scalar's actual DOM ids for tag sections/operations are internally
  prefixed (e.g. `id="api-1/tag/oauth2"`, not `id="tag/oauth2""`), and Scalar
  only reads `window.location.hash` and scrolls to the matching section a
  single time, when the app first mounts (e.g. on a fresh page load/refresh).
  It does **not** react to clicks on its own `<a href="#tag/...">` links
  inside Markdown content, nor to `hashchange` events — clicking such a link
  updates the URL but never scrolls. Fixed with a manual click-interception
  workaround in `ScalarWrapper.vue`: listen for clicks on same-page `#...`
  links inside the wrapper, resolve the target element by suffix match
  (`[id$="/${hash}"]`, since the internal prefix isn't guaranteed to stay
  `api-1/`), and `scrollIntoView` + `history.pushState` manually. If you add
  more cross-references between tags/operations in injected Markdown, they'll
  go through this same fix automatically — no per-link changes needed.
- **Scalar's own scroll-spy rewrites the URL hash as you scroll**, snapping it
  to whichever section is currently centered in the viewport. This happens
  even with plain mouse-wheel scrolling (nothing to do with the click fix
  above) — don't mistake it for a bug when the hash in the address bar
  "drifts" away from the section you clicked into shortly after landing.
- **The rendered spec is a static file, not live.** `docs/public/swagger.json`
  is generated once by `node scripts/sanitize-spec.js` (run automatically as
  a `predev`/`prebuild` step). If you edit `scripts/sanitize-spec.js` or any
  of the injected `.md` files while the developer's `docs:dev` server is
  already running, you must **manually re-run
  `node scripts/sanitize-spec.js`** from `docs/` to regenerate the static
  file — the running dev server will not do this for you, and it won't
  restart on its own.
- **Keep injected content developer-focused; admin/product walkthroughs stay
  on the VitePress-only page.** Files injected into Scalar tag descriptions
  (`docs/mcp.md`, `docs/developer/users-api.md`,
  `docs/developer/obtaining-a-token.md` — see `DOCS_MAPPING` in
  `scripts/sanitize-spec.js`) are rendered on **two** surfaces: their own
  standalone VitePress page, and inline inside Scalar's API reference. A
  section that's appropriate for the standalone page (e.g. "Setup" — click
  through the admin UI to create a group/API key) is usually *not*
  appropriate inside Scalar, which should stay focused on developer/API
  reference material. Rather than maintaining two versions of the file, wrap
  the VitePress-only section in `<!-- scalar:omit:start -->` /
  `<!-- scalar:omit:end -->` HTML comments (inert on the VitePress page, so
  it still renders there normally) and set an `omitReplacement` string for
  that tag in `DOCS_MAPPING` — `processMarkdown()` swaps the wrapped block
  for that replacement (typically a short pointer link back to the full page,
  e.g. `/mcp#setup`) only in the Scalar-injected copy.
- **Scalar caches the parsed spec client-side** (localStorage/IndexedDB), so
  after regenerating `swagger.json` you may still see stale content in an
  already-open browser tab. Clear `localStorage`/`sessionStorage`/IndexedDB
  for the page (or do a genuinely fresh navigation) before concluding a fix
  didn't work.

## Agent Operational Rules

### MANDATORY DEVELOPMENT WORKFLOW

To ensure safety and provide the user with full control, all agents MUST adhere to this strict multi-turn workflow for any modification:

1.  **STEP 1: Analysis & Planning**:
    - Explore the codebase, read relevant files, and research the task.
    - Present a concise plan to the user and wait for approval if the task is complex.

2.  **STEP 2: Implementation & Verification (The "No-Commit" Turn)**:
    - Apply file edits (`edit`, `write`).
    - Run all necessary verifications: `npm run docs:build`, check for broken links, and `git diff`.
    - **CRITICAL STOP**: You MUST end your response immediately after presenting the verification results. You are FORBIDDEN from running `git commit` or `git push` in this turn.

3.  **STEP 3: User Review**:
    - Summarize what was changed and show that the build passed.
    - Explicitly ask the user: "Shall I commit these changes?"

4.  **STEP 4: Commit & Push**:
    - ONLY after the user provides an explicit "Yes" or "Commit this", you may proceed to run `git add`, `git commit`, and `git push`.

### CRITICAL GIT SAFETY PROTOCOL

- **NO AUTO-COMMITS**: Never combine code edits and git commits in a single tool call sequence or response turn.
- **Read-Only Default**: You may run read-only git commands (`status`, `log`, `diff`) freely to understand the context.
- **Explicit Approval**: `git commit` and `git push` require a direct, specific request from the developer in the _current_ prompt.
- **Verification First**: Always verify changes (run build, check diffs) in Step 2 before moving to Step 3.

### LOCAL DEV SERVER PROTOCOL

- **NEVER kill the developer's `npm run docs:dev` process** (e.g. via `kill`, `pkill`, or freeing its port) unless the developer explicitly asks you to stop it.
- If you need to start a dev server yourself to verify a change, first check whether one is already running (e.g. `lsof -ti:5173`) and reuse it / view it instead of restarting it.
- If a new instance is genuinely needed (e.g. to pick up a config change that doesn't hot-reload) and a port conflict occurs, prefer starting on a different port over killing the existing process, unless the developer confirms it's safe to kill.
- When in doubt about whether a running process belongs to the developer or to your own earlier background task, ask before killing it.

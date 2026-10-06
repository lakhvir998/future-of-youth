# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository. This is the
single source of truth; `CLAUDE.md` imports it.

## Project overview

**Future of the Youth** is a marketing / lead-capture landing page for a Detroit-based
nonprofit youth program. Visitors read about the program, submit a two-step
"Request Free Program Info" form (emailed to staff over SMTP), and can donate through
an external PayPal link. Deployed on Vercel.

There's no database, no auth, and no user accounts. The only server-side logic is one
Server Action that validates the form and sends an email.

## Tech stack

| Area            | Choice                                                               |
| --------------- | -------------------------------------------------------------------- |
| Framework       | Next.js 16, App Router only (Turbopack is the default bundler)       |
| UI              | React 19, Tailwind CSS v4 (CSS-first config in `app/globals.css`)    |
| Language        | TypeScript 6, `strict: true`                                         |
| Validation      | Zod 4, one schema shared by client and server                        |
| Email           | `nodemailer` over SMTP                                               |
| Testing         | Vitest + Testing Library (jsdom)                                     |
| Lint / format   | ESLint 9 flat config (`eslint-config-next`) + Prettier               |
| Package manager | **npm**. `package-lock.json` is committed; don't add other lockfiles |

### Pinned below latest (on purpose)

- **TypeScript 6.x, not 7**: `typescript-eslint` and Next's build type-check don't
  support the TS 7 native compiler yet.
- **ESLint 9.x, not 10**: `eslint-plugin-react` (bundled by `eslint-config-next`)
  crashes on ESLint 10.

Re-check both when you upgrade dependencies. Bump them only once `npm run check`
passes on the new versions.

## Commands

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # production build (also type-checks)
npm run start          # serve the production build
npm run typecheck      # tsc --noEmit
npm run lint           # eslint .            (lint:fix to auto-fix)
npm run format         # prettier --write .  (format:check to verify)
npm test               # vitest run          (test:watch for watch mode)
npm run check          # everything CI runs: typecheck, lint, format, test, build
```

CI (`.github/workflows/ci.yml`) runs the same steps on every PR and every push to
`main`, using the Node version in `.nvmrc`.

## Repository layout

```
app/
  layout.tsx                      Root layout: Geist fonts, site-wide metadata, viewport
  page.tsx                        Composes sections + JSON-LD; Server Component, statically prerendered
  globals.css                     Tailwind import + @theme brand tokens
  favicon.ico, icon.png, apple-icon.png   App icons (generated from the logo mark)
  opengraph-image.png, twitter-image.png  Social share images (+ .alt.txt)
  robots.ts, sitemap.ts, manifest.ts      SEO / PWA metadata routes
  llms.txt/route.ts               Plain-text site summary for AI answer engines
  actions/
    submit-request-info.ts        'use server': rate-limit → validate → honeypot → send email
components/
  layout/                         SiteHeader, SiteFooter
  sections/                       One component per page section (hero, mission, features, …)
  request-info-form/              The ONLY client component tree
    request-info-form.tsx         'use client' entry; renders the steps
    use-request-info-form.ts      All form state, validation, and submission logic
    parent-step.tsx, child-step.tsx, form-success.tsx, consent-notice.tsx
  seo/structured-data.tsx         JSON-LD (NGO, WebSite, WebPage) with safe serialization
  ui/                             Button (+ buttonClasses), Card, TextField, SelectField, CheckboxGroup
lib/
  request-info.ts                 Zod schemas, option lists, shared types, getFieldErrors
  env.ts                          Lazily validated server env vars
  mailer.ts                       Nodemailer transport + sendRequestInfoEmail
  email/                          escapeHtml + email template (HTML and plain text)
  rate-limit.ts                   Best-effort in-memory fixed-window limiter
  site.ts                         Site name/description, getSiteUrl(), getPaypalUrl(), anchor ids
  content.ts                      Page copy reused by JSON-LD and llms.txt (single source)
  cn.ts                           className joiner
test/                             Shared test helpers (axe WCAG 2.2 check)
public/                           Logo, images, icons/ (PWA), video1.mp4 (28 MB), video2.mp4 (90 MB)
```

Tests sit next to the code they cover, named `*.test.ts(x)`.

## Environment variables

Never commit `.env*` files except `.env.example`. Configure real values in Vercel and
in a local `.env.local`.

| Variable                 | Scope  | Purpose                                                                                 |
| ------------------------ | ------ | --------------------------------------------------------------------------------------- |
| `SMTP_HOST`              | server | SMTP server host                                                                        |
| `SMTP_PORT`              | server | SMTP port (number)                                                                      |
| `SMTP_SECURE`            | server | `"true"` for implicit TLS (usually port 465)                                            |
| `SMTP_USER`              | server | SMTP username                                                                           |
| `SMTP_PASS`              | server | SMTP password / app password                                                            |
| `SMTP_FROM`              | server | Sender address (optional, defaults to `SMTP_USER`)                                      |
| `FORM_TO_EMAIL`          | server | Inbox that receives form submissions                                                    |
| `NEXT_PUBLIC_SITE_URL`   | client | Canonical origin for SEO; falls back to `VERCEL_PROJECT_PRODUCTION_URL`, then localhost |
| `NEXT_PUBLIC_PAYPAL_URL` | client | PayPal donation link; must be `https://`, or the button is hidden                       |

Rules:

- Read server variables only through `getServerEnv()` in `lib/env.ts`. It validates them
  with Zod and is lazy, so `next build` doesn't need SMTP credentials.
- `NEXT_PUBLIC_*` values are baked into the JS bundle. Never put secrets in them.
- Read the site URL and PayPal URL through `getSiteUrl()` / `getPaypalUrl()` in
  `lib/site.ts`, never from `process.env` directly; they validate the values.
- **Set `NEXT_PUBLIC_SITE_URL` in Vercel production** to the real domain, or canonical
  URLs and the sitemap will point at the `*.vercel.app` domain.
- When you add a variable, update this table, `.env.example`, and `lib/env.ts` in the
  same change.

## Architecture and conventions

### Rendering model

- **Server Components by default.** The page, layout, and every section are rendered
  on the server, and `/` is prerendered as static HTML at build time.
- **`'use client'` only on the smallest interactive subtree.** Right now that's only
  `components/request-info-form/request-info-form.tsx`. Don't add it to sections or
  pages; extract the interactive part into its own client component instead.
- **Mutations use Server Actions** (`app/actions/*.ts`, `'use server'`), not API routes.
  Next.js checks the request origin on Server Actions, and the client calls them like
  typed functions. Add a route handler (`app/api/*/route.ts`) only for things that need
  a public URL (webhooks, third-party callbacks).
- Code that touches secrets (`lib/env.ts`, `lib/mailer.ts`) must only be imported from
  Server Actions or other server code, never from a `'use client'` module.

### Validation

- `lib/request-info.ts` is the one definition of the form's shape. The client uses it
  for per-step field errors (`getFieldErrors`), and the Server Action re-validates the
  full payload with `requestInfoSchema`. Don't duplicate rules elsewhere.
- Server Actions accept `unknown` input and parse it. Never trust the client-side
  types.

### Components

- One exported component per file. `PascalCase` component names, kebab-case filenames.
- Build forms from the `components/ui` primitives. They handle label association,
  `aria-invalid`, and `aria-describedby` errors for you.
- Use `buttonClasses()` for links that look like buttons, so they stay consistent with
  `<Button>`.
- Keep static data (option lists, copy) in module-level constants.
- Import with the `@/*` alias (maps to the repo root). Use relative imports only within
  the same feature folder.

### TypeScript

- `strict` stays on. No `any` (ESLint enforces this). Use `unknown` and narrow it.
- Use `import type` for type-only imports (enforced by ESLint).
- Derive types from Zod schemas (`z.input` / `z.output`) instead of writing them by
  hand.

### Styling (Tailwind v4)

- There's no `tailwind.config.js`. Brand tokens live in `@theme` in `app/globals.css`.
  Use the token classes, not hex values:
  `brand` `#0072ce`, `brand-hover` `#005fa3`, `navy` `#003a70`, `ink` `#222b45`,
  `accent` `#ffd200`, `surface` `#f4f8fb`.
- The site is intentionally light-only (`color-scheme: light`). Don't add `dark:`
  variants unless asked.
- Use `cn()` from `lib/cn.ts` for conditional classes. Prettier sorts Tailwind classes
  automatically.

### Code style

- Prettier is the source of truth: single quotes (in JSX too), semicolons, ES5
  trailing commas, 80 columns. Run `npm run format` rather than formatting by hand.
- Use named functions for handlers. Use early returns over nested conditionals.
- Comments explain _why_, not _what_.

## SEO, AEO, and GEO

- Site-wide metadata (title, description, canonical, Open Graph, Twitter, robots) lives
  in `app/layout.tsx` and uses `metadataBase = getSiteUrl()`. Pages added later should
  export their own `metadata` with a unique title, description, and
  `alternates.canonical`.
- Exactly one `<h1>` per page, with sections as `<h2>` beneath it. Label sections with
  `aria-labelledby` pointing at their heading.
- **Structured data:** `components/seo/structured-data.tsx` emits a JSON-LD `@graph`.
  Always serialize with `serializeJsonLd()`, which escapes `<`. Don't add schema types
  the page can't back up (e.g. self-serving `Review`, or `FAQPage` without visible FAQs).
- **Single source for copy:** text that appears in both the page and machine-readable
  outputs (JSON-LD, `llms.txt`) lives in `lib/content.ts`. Change it there, never in
  two places.
- New public routes must be added to `app/sitemap.ts`. `app/robots.ts` allows all
  crawlers, including AI crawlers; changing that is a business decision.
- Icons and share images use Next's file conventions in `app/`. To change them,
  regenerate the files from the logo; don't add `<link>` tags by hand.

## Production standards (must-follow)

### Security (form submission)

These are implemented in `app/actions/submit-request-info.ts` and `lib/`. Keep them
intact:

1. **Server-side validation** with `requestInfoSchema`: lengths, email format, grade
   enum, and interests/programs restricted to the allowed lists.
2. **HTML-escape every user value** in the email (`lib/email/escape-html.ts`). The
   tests assert this, so add a test if you change the template.
3. **Generic errors only** go back to the client. Log the cause with `console.error`,
   never the submission itself.
4. **Abuse protection:** honeypot field (`website`) plus per-IP rate limiting (5 per 10
   minutes). The limiter is in-memory, so each serverless instance keeps its own count.
   If spam becomes a problem, move it to a shared store (e.g. Upstash Redis) or add
   Cloudflare Turnstile.
5. Only schema-validated values may go into email headers (`replyTo` uses the
   validated parent email). Free-text fields reject control characters (CR/LF, NUL).
6. **SMTP** requires TLS (`requireTLS` on STARTTLS ports, TLS 1.2 or newer) and has
   connect/socket timeouts so a slow server can't hang the function.
7. **Headers** (`next.config.ts`): Content-Security-Policy, HSTS, `X-Frame-Options`,
   `nosniff`, COOP, and Referrer and Permissions policies. `X-Powered-By` is disabled.
   The page is static, so the CSP uses `'unsafe-inline'` for scripts instead of nonces.
   If you add a third-party script, font, image host, or iframe, add it to the CSP
   explicitly, and verify in a browser that the console shows no CSP violations.
8. **Image optimizer:** `images.remotePatterns` allow-lists the exact remote path, so
   `/_next/image` can't be abused as an open proxy. Add new remote images one by one.
9. **Server Actions** accept at most 64 KB of request body
   (`experimental.serverActions.bodySizeLimit`).
10. **Supply chain:** CI runs `npm audit signatures` and fails on high-severity advisories
    in production dependencies. Dependabot opens weekly update PRs, and the CI workflow
    has read-only `contents` permission.

### Privacy

The form collects personal data about **minors**. Collect only what's needed, never log
submissions or PII, and don't add analytics or third-party scripts that can read form
fields.

### Accessibility (WCAG 2.2 AA)

The site targets WCAG 2.2 Level AA. These rules are enforced by tests or by the
browser audit below; keep them intact.

- **Forms:** build fields from the `components/ui` primitives. Every input gets a real
  `<label>`, required fields use `required` (visual `*` is `aria-hidden`), checkbox
  sets are a `<fieldset>`/`<legend>` with an sr-only "(required)", errors are linked
  with `aria-describedby` and set `aria-invalid` on the control itself.
- **Focus management (2.4.3, 3.3.1):** after a failed step, focus moves to the first
  `[aria-invalid="true"]` field; on a step change, to the "Step X of 2" indicator; after
  success, to the "Thank you!" heading. Never unmount the focused element without
  moving focus somewhere sensible.
- **Disabled buttons:** `<Button disabled>` renders `aria-disabled` (not the native
  attribute) so focus isn't dropped to `<body>`. Don't bypass this with a raw
  `<button disabled>`.
- **Focus visibility:** use `focus:outline-hidden` / `focus-visible:outline-hidden`
  with a `ring-*`, never `outline-none` (it removes focus outlines in Windows
  forced-colors mode).
- **Contrast (1.4.3, 1.4.11):** text ≥ 4.5:1 (≥ 3:1 for large text), and field borders
  and other UI boundaries ≥ 3:1. `accent` (#ffd200) is decorative only; use
  `accent-strong` for gold text. Use `gray-500` or darker for borders and `red-700` for
  error text. Text over images needs a scrim (see the hero).
- **Target size (2.5.8):** interactive targets are at least 24×24 px (checkboxes are
  `size-6`, and buttons and checkbox rows are `min-h-11`).
- **Reflow (1.4.10):** no horizontal scrolling at 320 px wide; button rows use
  `flex-wrap`.
- **Names:** decorative glyphs (arrows, asterisks) are wrapped in
  `aria-hidden='true'`. Decorative images use `alt=''`. Videos are named via
  `aria-labelledby` pointing at their section heading. Each landmark/region name is
  unique.
- **Spacing in screen-reader text:** put spaces between inline elements as `{' '}`
  text nodes, not inside the `sr-only` span, or names get glued together
  ("Interest(s)(required)").
- **Motion:** animations and transitions are suppressed under
  `prefers-reduced-motion`.
- **Tests:** `test/axe.ts` exposes `expectNoAxeViolations(container)` for component
  tests (jsdom can't check contrast or target size). For page-level changes, also run
  axe in a real browser at 1280 px and 320 px.

### Performance

- Use `next/image` for every image (`width`/`height`, or `fill` + `sizes`). Remote hosts
  must be listed in `images.remotePatterns`.
- Videos use `preload='metadata'`. Don't add large binaries to git.

## Known issues / follow-ups

- **Legal copy:** `components/request-info-form/consent-notice.tsx` names "Johns
  Hopkins Center for Talented Youth". It looks copied from a template. The organization
  must review it; don't rewrite it without their sign-off.
- **Large videos in git:** `public/video2.mp4` (~90 MB) and `video1.mp4` (~28 MB).
  Move them to external video hosting and add `poster` images.
- **Video captions (WCAG 1.2.2, Level A — blocking):** both videos have audio
  but no captions. The organization must provide WebVTT files (e.g.
  `public/captions/video1.en.vtt`) and pass them as `captionsSrc` to `FeatureVideo`
  in `components/sections/features-section.tsx`. If the videos contain speech or
  important visual information, a transcript or audio description (1.2.3/1.2.5) is
  also needed.
- **Footer year** is fixed at build time because the page is statically prerendered.
  Redeploy yearly, or move the year into a small client component.
- **`npm audit`** reports high-severity `braces` advisories through
  `eslint-config-next`. They affect lint tooling only; `npm audit --omit=dev` is clean.
- **CSP uses `'unsafe-inline'` for scripts.** Moving to nonces would require dynamic
  rendering (no more static prerendering). Revisit if third-party scripts are added.
- **No E2E test yet.** Consider one Playwright happy-path test of the form with SMTP
  mocked.

## Workflow for agents

1. Read the files you're changing before you edit them. Keep diffs focused.
2. Before saying you're done, run `npm run check` (or at least typecheck + lint +
   test). Report failures honestly, with the output.
3. Add or update tests alongside behavior changes, especially in `lib/` and the Server
   Action.
4. For UI changes, run `npm run dev` and check mobile (~375px) and desktop widths.
5. Never commit secrets, `.env*` files (except `.env.example`), or large binaries. Don't
   commit or push unless asked. Branch off `main` for PRs.
6. Copy, legal/consent text, testimonials, and donation links belong to the
   organization. Change them only when explicitly asked.
7. When you add a dependency, script, env var, or top-level directory, update this
   file and the README in the same change.

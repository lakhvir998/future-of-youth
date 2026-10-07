# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository. This is the
single source of truth; `CLAUDE.md` imports it.

## Project overview

**Future of the Youth** is the website of Future of the Youth, a Detroit
501(c)(3) nonprofit. The site is being prepared for **Google for Nonprofits / Google
Ad Grants**, so it must stay content-rich, fast, secure, and free of broken links (see
"Google Ad Grants readiness" below).

Pages: Home, About, Programs (+ one page per program), AI & Technology, Get Involved,
Donate, Contact, and Privacy. Visitors can request program info (two-step form), send
a contact message, and donate through an external PayPal link. Both forms are emailed
to staff over SMTP. Deployed on Vercel.

There's no database, no auth, and no user accounts. Server-side logic is two Server
Actions that validate a form and send an email.

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
npm run check:links    # after a build: crawl the site, fail on broken links/anchors
npm run check          # everything CI runs: typecheck, lint, format, test, build, links
```

CI (`.github/workflows/ci.yml`) runs the same steps on every PR and every push to
`main`, using the Node version in `.nvmrc`.

## Repository layout

```
app/
  layout.tsx                      Root layout: skip link, header, <main id="main">, footer, Google tag
  page.tsx                        Home
  about/, programs/, programs/[slug]/, ai-technology/, get-involved/, donate/, contact/, privacy/
  not-found.tsx                   Branded 404 (noindex)
  globals.css                     Tailwind import + @theme brand tokens
  favicon.ico, icon.png, apple-icon.png, opengraph-image.png, twitter-image.png
  robots.ts, sitemap.ts, manifest.ts, llms.txt/route.ts   SEO / AEO metadata routes
  actions/
    submit-request-info.ts        'use server' → handleFormSubmission
    submit-contact.ts             'use server' → handleFormSubmission
components/
  layout/                         SiteHeader, NavLinks, MobileNav, SiteFooter, Breadcrumbs
  sections/                       Page sections (hero, page-hero, program cards/details, donate CTA, …)
  forms/                          Shared form parts: success, consent, honeypot, alert, focus hook
  request-info-form/              Two-step request-info form (client)
  contact-form/                   Contact form (client) + ?topic= preselect wrapper
  donate/paypal-button.tsx        Outbound PayPal link that records a donate_click
  analytics/google-tag.tsx        Loads gtag.js only when IDs are configured
  seo/structured-data.tsx         JSON-LD @graph builders with safe serialization
  ui/                             Button, Card, Section, TextField, TextArea, SelectField, CheckboxGroup, CheckList
lib/
  content/                        ALL site copy and page data (see "Content model")
  request-info.ts, contact.ts     Zod schemas + option lists shared by client and server
  validation.ts                   requiredText, emailSchema, getFieldErrors, SubmitResult
  form-submission.ts              Shared Server Action pipeline (rate limit → validate → honeypot → send)
  client-ip.ts, rate-limit.ts     Rate-limiting helpers
  env.ts                          Lazily validated server env vars
  mailer.ts                       Nodemailer transport + sendEmail / sendRequestInfoEmail / sendContactEmail
  email/                          escapeHtml, shared layout, per-form templates
  analytics-config.ts             Google tag IDs (validated) + CSP hosts; safe to import from next.config
  analytics.ts                    trackEvent() with a fixed, PII-free event schema
  csp.ts                          buildContentSecurityPolicy()
  seo.ts                          buildMetadata / buildPageMetadata
  site.ts                         Site name/description, getSiteUrl(), getPaypalUrl(), anchor ids
  cn.ts                           className joiner
brand/                            Logo sources: generate-svgs.py (single geometry) → SVGs, og-image.html
scripts/check-links.mjs           Link/anchor crawler used by CI
scripts/build-brand-assets.mjs    Renders every PNG/ICO icon and the share image from brand/
test/                             Shared test helpers (axe WCAG 2.2 check)
public/                           Logo, images, icons/ (PWA), video1.mp4 (28 MB), video2.mp4 (90 MB)
```

Tests sit next to the code they cover, named `*.test.ts(x)`.

## Environment variables

Never commit `.env*` files except `.env.example`. Configure real values in Vercel and
in a local `.env.local`.

| Variable                              | Scope  | Purpose                                                                                 |
| ------------------------------------- | ------ | --------------------------------------------------------------------------------------- |
| `SMTP_HOST`                           | server | SMTP server host                                                                        |
| `SMTP_PORT`                           | server | SMTP port (number)                                                                      |
| `SMTP_SECURE`                         | server | `"true"` for implicit TLS (usually port 465)                                            |
| `SMTP_USER`                           | server | SMTP username                                                                           |
| `SMTP_PASS`                           | server | SMTP password / app password                                                            |
| `SMTP_FROM`                           | server | Sender address (optional, defaults to `SMTP_USER`)                                      |
| `FORM_TO_EMAIL`                       | server | Inbox that receives form submissions                                                    |
| `NEXT_PUBLIC_SITE_URL`                | client | Canonical origin for SEO; falls back to `VERCEL_PROJECT_PRODUCTION_URL`, then localhost |
| `NEXT_PUBLIC_PAYPAL_URL`              | client | PayPal donation link; must be `https://`, or the button is hidden                       |
| `NEXT_PUBLIC_CONTACT_EMAIL`           | client | Public contact email (footer, Contact, Privacy, JSON-LD); hidden until set              |
| `NEXT_PUBLIC_CONTACT_PHONE`           | client | Optional public phone number                                                            |
| `NEXT_PUBLIC_MAILING_ADDRESS`         | client | Optional mailing address; `\n` separates lines                                          |
| `NEXT_PUBLIC_EIN`                     | client | Optional EIN (`12-3456789`); shown on About/Donate/footer                               |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`       | client | GA4 ID (`G-…`); enables the Google tag and its CSP hosts                                |
| `NEXT_PUBLIC_GOOGLE_ADS_ID`           | client | Google Ads ID (`AW-…`)                                                                  |
| `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL`   | client | Ads conversion label for form submissions                                               |
| `NEXT_PUBLIC_GOOGLE_ADS_DONATE_LABEL` | client | Ads conversion label for PayPal clicks                                                  |

Rules:

- Read server variables only through `getServerEnv()` in `lib/env.ts`. It validates them
  with Zod and is lazy, so `next build` doesn't need SMTP credentials.
- `NEXT_PUBLIC_*` values are baked into the JS bundle. Never put secrets in them.
- Never read `NEXT_PUBLIC_*` values from `process.env` directly in components. Use the
  validating getters: `getSiteUrl()` / `getPaypalUrl()` (`lib/site.ts`),
  `getContactInfo()` (`lib/content/organization.ts`), and `getAnalyticsConfig()`
  (`lib/analytics-config.ts`). Malformed values are dropped, never rendered.
- **Set `NEXT_PUBLIC_SITE_URL` in Vercel production** to the real domain, or canonical
  URLs and the sitemap will point at the `*.vercel.app` domain.
- When you add a variable, update this table, `.env.example`, and `lib/env.ts` in the
  same change.

## Architecture and conventions

### Rendering model

- **Server Components by default.** Every page is prerendered as static HTML at build
  time (program pages via `generateStaticParams`, with `dynamicParams = false`).
- **`'use client'` only on the smallest interactive subtree:** the two forms, the nav
  links (`aria-current`), the mobile menu, and the PayPal button (click tracking).
  Don't add it to sections or pages.
- `useSearchParams` must sit under a `<Suspense>` boundary so pages stay static (see
  `app/contact/page.tsx`).
- **Mutations use Server Actions** (`app/actions/*.ts`, `'use server'`), not API routes.
  Next.js checks the request origin on Server Actions, and the client calls them like
  typed functions. Add a route handler (`app/api/*/route.ts`) only for things that need
  a public URL (webhooks, third-party callbacks).
- Code that touches secrets (`lib/env.ts`, `lib/mailer.ts`) must only be imported from
  Server Actions or other server code, never from a `'use client'` module.

### Validation

- Each form has one schema (`lib/request-info.ts`, `lib/contact.ts`) built from the
  helpers in `lib/validation.ts`. The client uses it for field errors
  (`getFieldErrors`); the Server Action re-validates through `handleFormSubmission`.
  Don't duplicate rules elsewhere.
- New public forms: add a schema, an email template on `lib/email/layout.ts`, a
  `send…` function in `lib/mailer.ts`, and a Server Action that calls
  `handleFormSubmission`. Reuse `components/forms/*` for the honeypot, alert, consent,
  success state, and `useFocusFirstInvalid`.
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

## Homepage structure

The homepage must let a corporation, foundation, financial institution, or donor
understand within seconds who we are, what we do, who we serve, and why to support
us, with the **four program areas** visible on arrival (client direction):
Entrepreneurship | Financial Literacy | Artificial Intelligence & Technology | Career &
Leadership Development.

Order: Hero (501(c)(3) line, headline, intro, the four areas as linked badges,
Support Our Mission, the request-info form) → At a Glance → Our Programs → Mission &
Vision → feature videos → Building for Impact → donate prompt. The four areas get
equal weight (same card and icon treatment); don't give one area its own extra
homepage section. Icons come from `components/ui/program-icon.tsx`. "At a Glance"
answers must quote existing site copy (a test enforces it).

## Content model

- **All copy lives in `lib/content/`**, never inline in a page when it's reused:
  `home.ts`, `about.ts`, `programs.ts`, `ai-technology.ts`, `get-involved.ts`,
  `donate.ts`, `organization.ts`, and `pages.ts` (the page registry).
- `pages.ts` is the registry of every route: label, title, description, and whether
  it's in the nav. Navigation, metadata (`buildPageMetadata`), breadcrumbs
  (`breadcrumbsFor`), the sitemap, and `llms.txt` all derive from it. **Adding a page
  means adding it here first.**
- `programs.ts` drives the program cards, `/programs/[slug]` pages, JSON-LD `Service`
  nodes, and the sitemap. A program whose `href` isn't under `/programs/` (AI &
  Technology) has its own route instead.
- Copy marked `// DRAFT: client to approve` was written by us and still needs the
  client's sign-off. **Never invent facts**: no statistics, schedules, locations,
  partners, staff, or outcomes the client hasn't confirmed.
- **Testimonials:** publish only statements from real participants, parents,
  community partners, sponsors, or supporters who have given permission to use them
  (client policy). The original template testimonial was removed; there is no
  testimonial section until the client supplies approved ones. Never add sample,
  placeholder, or invented quotes.
- `NONPROFIT_STATEMENT` ("Future of the Youth Limited is a 501(c)(3) nonprofit
  organization.") is the client's exact wording; show it on About, Donate, Contact, the
  donate CTA, and the footer.

## SEO, AEO, and GEO

- Every page exports metadata via `buildPageMetadata(path)` or `buildMetadata()` in
  `lib/seo.ts`: a unique title and description, a canonical URL, and Open Graph tags.
  `metadataBase` comes from `getSiteUrl()`. The root layout deliberately sets no
  canonical (it would leak onto the 404). A test enforces unique titles and
  descriptions.
- Exactly one `<h1>` per page (`PageHero` on subpages), with sections as `<h2>`
  (`components/ui/section.tsx`, which labels the section by its heading).
- **Structured data:** render `<StructuredData path name description breadcrumbs
extra />` on every page. It emits the NGO (with `legalName`, `nonprofitStatus:
Nonprofit501c3`, and contact details when set), the WebSite, the WebPage, a
  BreadcrumbList, and any extra nodes (e.g. `buildProgramNode`). It's serialized with
  `serializeJsonLd()`, which escapes `<`. Don't add schema the page can't back up.
- `app/sitemap.ts` and `llms.txt` are generated from the registry and programs. Don't
  hand-edit URL lists.
- Icons and share images use Next's file conventions in `app/` and are generated (see
  "Brand and logo"); don't add `<link>` tags by hand.

## Brand and logo

- **Logo: "AI Chip".** An AI processor chip with circuit traces; inside, a young
  person made of connected network nodes with arms raised (a "Y" for Youth) and a gold
  AI sparkle for a head. It stands for young people at the heart of AI and technology.
  Colors are the site tokens: navy, brand blue, gold, and light blue on dark.
- **Single source:** `brand/generate-svgs.py` defines the geometry once and writes
  every SVG: the standalone marks (`logo-mark.svg`, `logo-mark-dark.svg` for dark
  backgrounds), the adaptive favicon (`icon-tile.svg`, which follows the browser's
  light/dark theme), and the raster sources (light tile, Apple square, maskable).
- **Regenerate** after any logo change:
  `python3 brand/generate-svgs.py && npm run brand:build`. The build renders, with
  headless Chrome (`CHROME_PATH` if it isn't in the default macOS location), `app/icon.png`,
  `app/apple-icon.png`, `app/favicon.ico` (16/32/48), `public/icons/*` (PWA, including
  maskable), `public/logo-512.png` (structured data), and the Open Graph/Twitter
  images from `brand/og-image.html`, then copies the SVGs into `app/` and `public/`.
  **Never hand-edit the generated PNG/ICO files.**
- Use `/logo-mark.svg` on light backgrounds and `/logo-mark-dark.svg` on navy. The
  header shows the name and "Inspiring Minds, Shaping Futures" next to the mark from
  `sm` up; below that they're screen-reader only, to avoid horizontal scrolling at
  320px.
- Update the share-image alt text (`app/*-image.alt.txt`) whenever the logo changes.

## Analytics (Google tag)

- Required for Google Ad Grants conversion tracking. It's off unless
  `NEXT_PUBLIC_GA_MEASUREMENT_ID` or `NEXT_PUBLIC_GOOGLE_ADS_ID` is set; then
  `GoogleTag` loads gtag.js and the CSP adds Google's hosts automatically (`lib/csp.ts`).
- Track only through `trackEvent()` in `lib/analytics.ts`. Its event schema is a closed
  set (`generate_lead { form }`, `donate_click { location }`). **Never send form values
  or any PII**; extend the typed schema with enum-only params if you need a new event.
- Google signals and ad personalization are disabled in the tag config (the audience
  includes families of minors). Don't enable them.
- After changing anything here, verify in a browser with test IDs that the console
  shows no CSP violations.

## Production standards (must-follow)

### Security (form submission)

These are implemented once in `lib/form-submission.ts` (used by every Server Action)
and the schemas in `lib/`. Keep them intact:

1. **Server-side validation** with the form's Zod schema: lengths, email format, and
   enums for grades, interests, programs, and contact topics.
2. **HTML-escape every user value** in the email. `renderEmail()` in
   `lib/email/layout.ts` escapes everything it renders (labels, values, links, the
   preheader), so templates pass plain strings and never build HTML themselves. The
   tests assert this, so add a test if you change a template.
   - The layout is table-based with inline styles and a fluid 600px container (plus an
     Outlook-only fixed wrapper). Keep it that way: `div`/flexbox layouts, external CSS,
     and `white-space: pre-wrap` break in Outlook and Gmail.
   - Every email has an HTML part and a plain-text part, a preheader, a "Reply to …"
     button (`mailto:` the validated address), and the received time in Detroit time.
3. **Generic errors only** go back to the client. Log the cause with `console.error`,
   never the submission itself.
4. **Abuse protection:** honeypot field (`website`) plus per-IP rate limiting (5 per 10
   minutes). The limiter is in-memory, so each serverless instance keeps its own count.
   If spam becomes a problem, move it to a shared store (e.g. Upstash Redis) or add
   Cloudflare Turnstile.
5. Only schema-validated values may go into email headers (`replyTo` uses the
   validated email; contact subjects use the fixed topic label). Single-line fields
   reject control characters; multi-line messages allow only tab and line breaks.
6. **SMTP** requires TLS (`requireTLS` on STARTTLS ports, TLS 1.2 or newer) and has
   connect/socket timeouts so a slow server can't hang the function.
7. **Headers** (`next.config.ts`): Content-Security-Policy, HSTS, `X-Frame-Options`,
   `nosniff`, COOP, and Referrer and Permissions policies. `X-Powered-By` is disabled.
   The page is static, so the CSP uses `'unsafe-inline'` for scripts instead of nonces.
   If you add a third-party script, font, image host, or iframe, add it to the CSP
   explicitly, and verify in a browser that the console shows no CSP violations.
8. **Image optimizer:** `images.remotePatterns` is empty (the site uses no remote
   images), so `/_next/image` can't be abused as an open proxy. If a remote image is
   ever needed, allow-list its exact path, not a whole host.
9. **Server Actions** accept at most 64 KB of request body
   (`experimental.serverActions.bodySizeLimit`).
10. **Supply chain:** CI runs `npm audit signatures` and fails on high-severity advisories
    in production dependencies. Dependabot opens weekly update PRs, and the CI workflow
    has read-only `contents` permission.

### Privacy

The request-info form collects personal data about **minors**. Collect only what's
needed, never log submissions or PII, and never send form values to analytics. The
`/privacy` page describes what we collect; update it whenever data collection, analytics,
or processors change.

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
  and other UI boundaries ≥ 3:1. On white, `accent` (#ffd200) is decorative only;
  use `accent-strong` for gold text. On `navy` (the hero), `accent` text is fine
  (about 8:1). Use `gray-500` or darker for borders and `red-700` for
  error text. Text over images needs a scrim (see the hero).
- **Target size (2.5.8):** interactive targets are at least 24×24 px (checkboxes are
  `size-6`, and buttons and checkbox rows are `min-h-11`).
- **Sticky header (2.4.11 Focus Not Obscured):** the header is `sticky` only when the
  viewport is at least 500px tall, so it doesn't eat the screen on landscape phones or
  at 400% zoom. At the same breakpoint, `globals.css` gives focusable elements and
  `[id]` anchor targets `scroll-margin-top: 6rem`, so focus and in-page links land
  below the header. If the header gets taller, raise that value. Keep the header
  background opaque so its text contrast doesn't depend on the content underneath.
  - **Don't use `scroll-padding-top` on `<html>`** for this. Next.js reads it on every
    navigation; a value taller than the page's first element makes Next think the new
    page's top is hidden and scroll it down (new pages opened partway down).
  - **Keep `data-scroll-behavior='smooth'` on `<html>`** (`app/layout.tsx`). It's how
    Next.js knows to suspend our CSS smooth scrolling during route changes; without
    it, the reset to the top animates and Next scrolls again mid-animation.
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

## Google Ad Grants readiness

Google reviews the website itself. Keep these true, and re-check them before any
release:

- Own domain over HTTPS (custom domain on Vercel, `NEXT_PUBLIC_SITE_URL` set), with
  security headers.
- Clear mission, and substantial written content for every program (a test enforces a
  minimum per program).
- Working navigation, links, and forms: `npm run check:links` must pass (CI runs it).
- Mobile-friendly: no horizontal scrolling at 320px; 0 axe WCAG 2.2 AA violations.
- Conversion tracking configured (Google tag IDs set), and the privacy policy is
  accurate.
- No commercial ads, no pop-ups, nothing that misrepresents the organization.

### Launch blockers (client inputs)

- Approve all `// DRAFT` copy, the consent notice
  (`components/forms/consent-notice.tsx`), and the privacy policy (`app/privacy`).
- Confirm the legal name "Future of the Youth" exactly matches the IRS
  determination letter. Provide the EIN, a public contact email, and (optionally) a
  phone number and mailing address.
- Provide the real PayPal donation URL, the custom domain, and the GA4 / Google Ads IDs
  and conversion labels.
- Optional, for grant reviewers: founder story, team/board, social links.

## Known issues / follow-ups

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
   Actions. New pages go in `lib/content/pages.ts` first.
4. For UI changes, run `npm run dev` and check mobile (~375px) and desktop widths.
5. Never commit secrets, `.env*` files (except `.env.example`), or large binaries. Don't
   commit or push unless asked. Branch off `main` for PRs.
6. Copy, legal/consent text, testimonials, and donation links belong to the
   organization. Change them only when explicitly asked, and mark any new copy you
   write as `// DRAFT: client to approve`.
7. When you add a dependency, script, env var, or top-level directory, update this
   file and the README in the same change.

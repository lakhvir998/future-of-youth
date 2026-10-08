# Future of the Youth

Website for **Future of the Youth Limited**, a Detroit 501(c)(3) nonprofit preparing
minority and underserved youth for the future through free AI & technology,
entrepreneurship, financial literacy, AI & technology, and career & leadership development programs.

Pages: Home, About, Programs (with a page per program), AI & Technology, Get Involved,
Donate, Contact, and Privacy. Families can request program info, anyone can send a
contact message (both emailed to staff over SMTP), and donors give through PayPal.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions)
- React 19, TypeScript 6 (strict)
- Tailwind CSS v4
- Zod for validation (shared between client and server)
- Nodemailer for email
- Vitest + Testing Library, ESLint, Prettier, GitHub Actions CI

## Getting started

Requires Node.js 20.9+ (24 recommended; see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # then fill in real SMTP values
npm run dev                  # http://localhost:3000
```

Without valid SMTP settings the page still renders, but form submissions show a
"could not send" error.

## Scripts

| Command               | What it does                                                         |
| --------------------- | -------------------------------------------------------------------- |
| `npm run dev`         | Start the dev server                                                 |
| `npm run build`       | Production build                                                     |
| `npm run start`       | Serve the production build                                           |
| `npm run typecheck`   | Type-check with `tsc`                                                |
| `npm run lint`        | Lint with ESLint (`lint:fix` to auto-fix)                            |
| `npm run format`      | Format with Prettier (`format:check` to verify only)                 |
| `npm test`            | Run unit and component tests (`test:watch` for watch mode)           |
| _(PWA)_               | Installable and offline-capable; see AGENTS.md "Progressive Web App" |
| `npm run brand:build` | Rebuild all logo/icon PNGs and the share image from `brand/`         |
| `npm run check:links` | After a build: crawl the site and fail on broken links               |
| `npm run check`       | Everything CI runs: typecheck, lint, format, test, build, links      |

## Environment variables

See [`.env.example`](.env.example). SMTP variables are server-only. `NEXT_PUBLIC_*`
variables are inlined into the client bundle at build time, so they must never hold
secrets. In production, set `NEXT_PUBLIC_SITE_URL` to the real domain so canonical
URLs, the sitemap, and social previews point at it.

## Project structure

```
app/                Routes (each page is statically prerendered), Server Actions,
                    sitemap/robots/manifest/llms.txt, icons and share images
components/         layout (header, nav, footer), sections, forms, ui primitives,
                    analytics, seo (JSON-LD)
lib/content/        All site copy and the page registry (navigation, metadata, sitemap)
lib/                Validation schemas, mailer, email templates, analytics, CSP, SEO helpers
brand/              Logo source (SVG generator + share-image template)
scripts/            Link checker and brand asset builder
test/               Shared test helpers (axe accessibility checks)
```

See [AGENTS.md](AGENTS.md) for architecture, conventions, and the Google Ad Grants
launch checklist.

## Deployment

Deployed on Vercel. Set the environment variables from `.env.example` in the Vercel
project settings. CI (`.github/workflows/ci.yml`) runs `npm run check` steps on every
push to `main` and on every pull request.

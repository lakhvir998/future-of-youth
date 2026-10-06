# Future of the Youth

Landing page for **Future of the Youth**, a Detroit nonprofit offering free tutoring,
mentorship, financial literacy, and entrepreneurship programs to minority and
underserved youth.

Visitors can learn about the program, request program info through a two-step form
(emailed to staff over SMTP), and donate through PayPal.

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

| Command             | What it does                                               |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Start the dev server                                       |
| `npm run build`     | Production build                                           |
| `npm run start`     | Serve the production build                                 |
| `npm run typecheck` | Type-check with `tsc`                                      |
| `npm run lint`      | Lint with ESLint (`lint:fix` to auto-fix)                  |
| `npm run format`    | Format with Prettier (`format:check` to verify only)       |
| `npm test`          | Run unit and component tests (`test:watch` for watch mode) |
| `npm run check`     | Everything CI runs: typecheck, lint, format, test, build   |

## Environment variables

See [`.env.example`](.env.example). SMTP variables are server-only. `NEXT_PUBLIC_*`
variables are inlined into the client bundle at build time, so they must never hold
secrets. In production, set `NEXT_PUBLIC_SITE_URL` to the real domain so canonical
URLs, the sitemap, and social previews point at it.

## Project structure

```
app/
  layout.tsx                    Root layout, fonts, metadata
  page.tsx                      Composes the landing page sections (Server Component)
  robots.ts, sitemap.ts, manifest.ts, llms.txt/   SEO and AI-crawler metadata
  favicon.ico, icon.png, apple-icon.png, opengraph-image.png   Icons and share image
  actions/submit-request-info.ts  Server Action: validate, rate-limit, send email
components/
  layout/                       Site header and footer
  sections/                     One component per page section
  request-info-form/            The only client component: form, steps, state hook
  seo/                          JSON-LD structured data
  ui/                           Button, Card, TextField, SelectField, CheckboxGroup
lib/
  request-info.ts               Zod schema + option lists shared by client and server
  content.ts, site.ts           Shared page copy and site constants (name, URL helpers)
  env.ts                        Validated server env vars
  mailer.ts                     Nodemailer transport + send
  email/                        HTML-escaped email template
  rate-limit.ts                 Best-effort in-memory rate limiter
```

## Deployment

Deployed on Vercel. Set the environment variables from `.env.example` in the Vercel
project settings. CI (`.github/workflows/ci.yml`) runs `npm run check` steps on every
push to `main` and on every pull request.

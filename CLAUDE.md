# CLAUDE.md

@AGENTS.md

## Claude Code–specific notes

The import above is the source of truth for project context, conventions, and
standards. Put shared guidance in `AGENTS.md` so every agent sees it. Keep only
Claude-specific notes here.

- **Verify before reporting done:** run `npm run check`. If `node_modules` is
  missing, run `npm install` first.
- **Running the app:** start `npm run dev` in the background and check
  http://localhost:3000. Stop the server when you're finished.
- **Security-sensitive changes:** for any edit to `app/actions/`, `lib/env.ts`,
  `lib/mailer.ts`, or `lib/email/`, re-check the Security checklist in AGENTS.md and
  consider running `/security-review` before committing.
- **Large changes** (new sections, new Server Actions, dependency upgrades): propose
  a short plan first and do them as separate, reviewable commits.
- **Questions to escalate, not guess:** legal/consent copy, testimonials, the PayPal
  URL, and the recipient email address all belong to the organization.

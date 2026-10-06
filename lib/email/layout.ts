import { NONPROFIT_STATEMENT, ORGANIZATION } from '@/lib/content/organization';
import { getSiteUrl } from '@/lib/site';

import { escapeHtml } from './escape-html';

// Staff notification layout. Built with tables and inline styles because that's
// what renders consistently across Gmail, Outlook (Word engine), and Apple Mail.

export type Row = {
  label: string;
  value: string;
  /** Makes the value a link (e.g. mailto:). Escaped like everything else. */
  href?: string;
};
export type Section = { title: string; rows: Row[] };

export type EmailContent = {
  /** Main heading, e.g. "New Program Info Request". */
  heading: string;
  /** Inbox preview text shown after the subject. */
  preheader: string;
  /** One-sentence context under the heading. */
  intro: string;
  sections: Section[];
  /** Free-text block, e.g. a contact message. Escaped; line breaks kept. */
  message?: { title: string; body: string };
  /** Adds a "Reply to …" button. `email` must already be validated. */
  reply?: { name: string; email: string; subject: string };
  /** Which form produced the email, for the footer. */
  source: string;
  submittedAt?: Date;
};

const COLORS = {
  navy: '#003a70',
  brand: '#0072ce',
  ink: '#222b45',
  muted: '#4a5568',
  border: '#e5e7eb',
  surface: '#f4f8fb',
  gold: '#ffd200',
};
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** "Tuesday, October 6, 2026 at 3:42 PM EDT", always in Detroit time. */
export function formatSubmittedAt(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Detroit',
  })
    .format(date)
    .concat(' (Detroit time)');
}

const e = escapeHtml;

/** Escapes text and turns line breaks into <br>; Outlook ignores pre-wrap. */
function multiline(text: string) {
  return e(text).replace(/\r?\n/g, '<br>');
}

function mailtoHref(email: string, subject: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

function renderRow({ label, value, href }: Row, isLast: boolean) {
  const border = isLast ? '' : `border-bottom: 1px solid ${COLORS.border};`;
  const content = href
    ? `<a href="${e(href)}" style="color: ${COLORS.brand}; text-decoration: underline;">${e(value)}</a>`
    : e(value);

  return `
            <tr>
              <td valign="top" style="padding: 10px 12px 10px 0; width: 38%; ${border} color: ${COLORS.muted}; font-size: 14px; line-height: 20px;">${e(label)}</td>
              <td valign="top" style="padding: 10px 0; ${border} color: ${COLORS.ink}; font-size: 15px; line-height: 20px; font-weight: 600;">${content}</td>
            </tr>`;
}

function renderSection({ title, rows }: Section) {
  return `
        <tr>
          <td class="px" style="padding: 24px 32px 0;">
            <h2 style="margin: 0 0 4px; color: ${COLORS.brand}; font-size: 13px; line-height: 18px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">${e(title)}</h2>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows
              .map((row, i) => renderRow(row, i === rows.length - 1))
              .join('')}
            </table>
          </td>
        </tr>`;
}

function renderMessage({ title, body }: NonNullable<EmailContent['message']>) {
  return `
        <tr>
          <td class="px" style="padding: 24px 32px 0;">
            <h2 style="margin: 0 0 8px; color: ${COLORS.brand}; font-size: 13px; line-height: 18px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">${e(title)}</h2>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background: ${COLORS.surface}; border-left: 4px solid ${COLORS.brand}; padding: 16px 18px; color: ${COLORS.ink}; font-size: 15px; line-height: 23px;">${multiline(body)}</td>
              </tr>
            </table>
          </td>
        </tr>`;
}

function renderReplyButton({
  name,
  email,
  subject,
}: NonNullable<EmailContent['reply']>) {
  // "Bulletproof" button: a padded table cell, so it renders in Outlook too.
  return `
        <tr>
          <td class="px" style="padding: 24px 32px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="border-radius: 8px; background: ${COLORS.brand};">
                  <a href="${e(mailtoHref(email, subject))}" style="display: inline-block; padding: 12px 22px; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 8px;">Reply to ${e(name)}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
}

/**
 * Renders the staff notification as HTML and plain text.
 * Every value is HTML-escaped here, including labels and links, so templates
 * can't forget to.
 */
export function renderEmail({
  heading,
  preheader,
  intro,
  sections,
  message,
  reply,
  source,
  submittedAt = new Date(),
}: EmailContent) {
  const siteUrl = getSiteUrl();
  const logoUrl = new URL('/logo-512.png', siteUrl).toString();
  const received = formatSubmittedAt(submittedAt);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${e(heading)}</title>
    <style>
      @media (max-width: 620px) {
        .px { padding-left: 20px !important; padding-right: 20px !important; }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background: ${COLORS.surface}; font-family: ${FONT};">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">${e(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: ${COLORS.surface};">
      <tr>
        <td align="center" style="padding: 32px 12px;">
          <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
          <!-- Fluid: 100% wide up to 600px, so it fits phones even where media queries are stripped. -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; font-family: ${FONT};">
            <tr>
              <td class="px" style="background: ${COLORS.navy}; padding: 18px 32px; border-bottom: 4px solid ${COLORS.gold};">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td valign="middle" style="padding-right: 12px;">
                      <img src="${e(logoUrl)}" width="40" height="40" alt="${e(ORGANIZATION.name)}" style="display: block; border: 0; background: #ffffff; border-radius: 8px;">
                    </td>
                    <td valign="middle" style="color: #ffffff; font-size: 17px; line-height: 22px; font-weight: 700;">${e(ORGANIZATION.name)}<br><span style="font-size: 12px; font-weight: 400; color: #c9d8ea;">Website notification</span></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding: 28px 32px 0;">
                <h1 style="margin: 0; color: ${COLORS.navy}; font-size: 24px; line-height: 30px; font-weight: 800;">${e(heading)}</h1>
                <p style="margin: 8px 0 0; color: ${COLORS.ink}; font-size: 15px; line-height: 22px;">${e(intro)}</p>
                <p style="margin: 6px 0 0; color: ${COLORS.muted}; font-size: 13px; line-height: 18px;">Received ${e(received)}</p>
              </td>
            </tr>${reply ? renderReplyButton(reply) : ''}${sections.map(renderSection).join('')}${message ? renderMessage(message) : ''}
            <tr>
              <td class="px" style="padding: 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-top: 1px solid ${COLORS.border}; padding-top: 16px; color: ${COLORS.muted}; font-size: 12px; line-height: 18px;">
                      Sent from the ${e(source)} on <a href="${e(siteUrl.toString())}" style="color: ${COLORS.brand};">${e(siteUrl.host)}</a>.${reply ? ` Replying to this email goes directly to ${e(reply.name)}.` : ''}<br>
                      ${e(NONPROFIT_STATEMENT)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <!--[if mso]></td></tr></table><![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const rule = '-'.repeat(40);
  const textParts = [
    `${heading.toUpperCase()}\n${intro}\nReceived ${received}`,
    ...sections.map(
      ({ title, rows }) =>
        `${title.toUpperCase()}\n${rule}\n${rows.map(({ label, value }) => `${label}: ${value}`).join('\n')}`
    ),
    ...(message
      ? [`${message.title.toUpperCase()}\n${rule}\n${message.body}`]
      : []),
    `${rule}\nSent from the ${source} on ${siteUrl.host}.${
      reply ? ` Reply to this email to respond to ${reply.name}.` : ''
    }\n${NONPROFIT_STATEMENT}`,
  ];

  return { html, text: textParts.join('\n\n') };
}

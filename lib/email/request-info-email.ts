import type { RequestInfo } from '@/lib/request-info';

import { escapeHtml } from './escape-html';

type Row = [label: string, value: string];

function listOrDash(values: readonly string[]) {
  return values.length ? values.join(', ') : '-';
}

function getSections({ parent, child }: RequestInfo): [string, Row[]][] {
  return [
    [
      'Parent Information',
      [
        ['First Name', parent.first],
        ['Last Name', parent.last],
        ['Email', parent.email],
        ['State', parent.state],
      ],
    ],
    [
      'Child Information',
      [
        ['First Name', child.first],
        ['Last Name', child.last],
        ['Grade', child.grade],
        ['Academic Interests', listOrDash(child.interests)],
        ['Program Preferences', listOrDash(child.programs)],
      ],
    ],
  ];
}

function renderHtmlSection(title: string, rows: Row[]) {
  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="font-weight: bold; padding: 4px 12px 4px 0;">${label}:</td><td>${escapeHtml(value)}</td></tr>`
    )
    .join('');

  return `
      <h3 style="color: #0072ce; font-size: 18px; margin-top: 24px; margin-bottom: 8px;">${title}</h3>
      <table style="width: 100%; margin-bottom: 16px; color: #222b45;">${body}</table>`;
}

export const REQUEST_INFO_SUBJECT = 'New Program Info Request';

/** Builds the staff notification email. Every user-supplied value is HTML-escaped. */
export function buildRequestInfoEmail(data: RequestInfo) {
  const sections = getSections(data);

  const html = `
  <div style="font-family: Arial, sans-serif; background: #f4f8fb; padding: 32px;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #e5e7eb; border-top: 4px solid #0072ce; padding: 32px;">
      <h2 style="color: #003a70; font-size: 24px; margin-bottom: 16px;">${REQUEST_INFO_SUBJECT}</h2>
      ${sections.map(([title, rows]) => renderHtmlSection(title, rows)).join('')}
      <p style="color: #888; font-size: 13px; margin-top: 32px;">This message was sent from the Future of the Youth website.</p>
    </div>
  </div>`;

  const text = sections
    .map(
      ([title, rows]) =>
        `${title}\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}`
    )
    .join('\n\n');

  return { subject: REQUEST_INFO_SUBJECT, html, text };
}

import { describe, expect, it } from 'vitest';

import type { RequestInfo } from '@/lib/request-info';

import { escapeHtml } from './escape-html';
import { buildRequestInfoEmail } from './request-info-email';

const data: RequestInfo = {
  parent: {
    first: '<img src=x onerror=alert(1)>',
    last: 'O"Brien & Sons',
    email: 'parent@example.com',
    state: 'MI',
  },
  child: {
    first: '<b>Kid</b>',
    last: "D'Angelo",
    grade: '5',
    interests: ['Mathematics', 'Language Arts'],
    programs: ['Online Programs'],
  },
};

const submittedAt = new Date('2026-10-06T19:42:00Z');

describe('escapeHtml', () => {
  it('escapes all HTML-significant characters', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;'
    );
  });
});

describe('buildRequestInfoEmail', () => {
  const email = buildRequestInfoEmail(data, submittedAt);

  it('escapes user input everywhere in the HTML, including the preheader', () => {
    expect(email.html).not.toContain('<img src=x');
    expect(email.html).not.toContain('<b>Kid</b>');
    expect(email.html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(email.html).toContain('O&quot;Brien &amp; Sons');
  });

  it('uses only the validated grade in the subject', () => {
    expect(email.subject).toBe('New Program Info Request: Grade 5');
  });

  it('adds a reply button addressed to the parent', () => {
    expect(email.html).toContain(
      'href="mailto:parent@example.com?subject=Your%20Future%20of%20the%20Youth%20program%20info%20request"'
    );
  });

  it('includes a plain-text alternative with every field', () => {
    expect(email.text).toContain(
      'Academic interests: Mathematics, Language Arts'
    );
    expect(email.text).toContain('Grade: 5');
    expect(email.text).toContain('Program preferences: Online Programs');
    expect(email.text).toContain(
      'Received Tuesday, October 6, 2026 at 3:42 PM (Detroit time)'
    );
  });
});

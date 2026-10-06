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

describe('escapeHtml', () => {
  it('escapes all HTML-significant characters', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;'
    );
  });
});

describe('buildRequestInfoEmail', () => {
  it('escapes user input in the HTML body', () => {
    const { html } = buildRequestInfoEmail(data);

    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('<b>Kid</b>');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).toContain('O&quot;Brien &amp; Sons');
  });

  it('includes a plain-text alternative with every field', () => {
    const { text, subject } = buildRequestInfoEmail(data);

    expect(subject).toBe('New Program Info Request');
    expect(text).toContain('Academic Interests: Mathematics, Language Arts');
    expect(text).toContain('Grade: 5');
  });
});

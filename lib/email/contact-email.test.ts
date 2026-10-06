import { describe, expect, it } from 'vitest';

import { buildContactEmail } from './contact-email';

describe('buildContactEmail', () => {
  const email = buildContactEmail(
    {
      name: '<b>Mallory</b>',
      email: 'mallory@example.com',
      topic: 'sponsor',
      message: '<script>alert(1)</script>\nSecond line',
    },
    new Date('2026-10-06T19:42:00Z')
  );

  it('escapes user input in the HTML body', () => {
    expect(email.html).not.toContain('<script>');
    expect(email.html).not.toContain('<b>Mallory</b>');
    expect(email.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('keeps message line breaks as <br> (Outlook ignores pre-wrap)', () => {
    expect(email.html).toContain(
      '&lt;script&gt;alert(1)&lt;/script&gt;<br>Second line'
    );
  });

  it('builds the subject from the fixed topic label only', () => {
    expect(email.subject).toBe(
      'New Contact Message: Sponsorship or partnership'
    );
  });

  it('keeps the message in the plain-text version', () => {
    expect(email.text).toContain('Second line');
    expect(email.text).toContain('Topic: Sponsorship or partnership');
  });
});

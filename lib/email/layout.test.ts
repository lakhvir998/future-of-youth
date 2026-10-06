import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatSubmittedAt, renderEmail } from './layout';

const base = {
  heading: 'Test Heading',
  preheader: 'Preview <text>',
  intro: 'Intro',
  sections: [
    {
      title: 'Details',
      rows: [
        {
          label: 'Email',
          value: 'a@example.com',
          href: 'mailto:a@example.com',
        },
      ],
    },
  ],
  source: 'test form',
  submittedAt: new Date('2026-01-15T17:05:00Z'),
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('renderEmail', () => {
  it('is a complete, light-only HTML document', () => {
    const { html } = renderEmail(base);

    expect(html.startsWith('<!doctype html>')).toBe(true);
    expect(html).toContain('<meta charset="utf-8">');
    expect(html).toContain('<meta name="color-scheme" content="light">');
  });

  it('escapes the hidden preheader', () => {
    expect(renderEmail(base).html).toContain('Preview &lt;text&gt;');
  });

  it('links the logo and footer to the configured site', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://futureoftheyouth.org');
    const { html, text } = renderEmail(base);

    expect(html).toContain('src="https://futureoftheyouth.org/logo-512.png"');
    expect(text).toContain('Sent from the test form on futureoftheyouth.org.');
  });

  it('renders link rows and omits the reply button when not requested', () => {
    const { html } = renderEmail(base);

    expect(html).toContain('href="mailto:a@example.com"');
    expect(html).not.toContain('Reply to');
  });

  it('includes the 501(c)(3) statement in both versions', () => {
    const { html, text } = renderEmail(base);

    expect(html).toContain('501(c)(3)');
    expect(text).toContain('501(c)(3)');
  });
});

describe('formatSubmittedAt', () => {
  it('formats in Detroit time regardless of server time zone', () => {
    expect(formatSubmittedAt(new Date('2026-01-15T17:05:00Z'))).toBe(
      'Thursday, January 15, 2026 at 12:05 PM (Detroit time)'
    );
  });
});

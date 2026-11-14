import { describe, expect, it } from 'vitest';

import { buildContentSecurityPolicy } from './csp';

const base = { isDev: false, isVercelPreview: false, googleTag: false };

describe('buildContentSecurityPolicy', () => {
  it('locks everything to our own origin by default', () => {
    const csp = buildContentSecurityPolicy(base);

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain('upgrade-insecure-requests');
    expect(csp).not.toContain('google');
    // Without the Google tag, images stay same-origin only.
    expect(csp).toContain("img-src 'self' data: blob:;");
    expect(csp).not.toContain('unsafe-eval');
  });

  it('allows the Google tag hosts only when analytics is configured', () => {
    const csp = buildContentSecurityPolicy({ ...base, googleTag: true });

    expect(csp).toMatch(/script-src [^;]*https:\/\/\*\.googletagmanager\.com/);
    expect(csp).toMatch(
      /script-src [^;]*https:\/\/googleads\.g\.doubleclick\.net/
    );
    expect(csp).toMatch(/connect-src [^;]*https:\/\/\*\.google-analytics\.com/);
    // Remarketing pings use country domains like www.google.co.in.
    expect(csp).toMatch(/img-src [^;]*https:(\s|;|$)/);
  });

  it('adds dev-only allowances in development', () => {
    const csp = buildContentSecurityPolicy({ ...base, isDev: true });

    expect(csp).toContain("'unsafe-eval'");
    expect(csp).not.toContain('upgrade-insecure-requests');
  });
});

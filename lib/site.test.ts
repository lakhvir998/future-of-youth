import { afterEach, describe, expect, it, vi } from 'vitest';

import { getPaypalUrl, getSiteUrl } from './site';

describe('getSiteUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefers NEXT_PUBLIC_SITE_URL', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://futureoftheyouth.org');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'other.vercel.app');

    expect(getSiteUrl().origin).toBe('https://futureoftheyouth.org');
  });

  it('falls back to the Vercel production domain, then localhost', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined);
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'fotyouth.vercel.app');
    expect(getSiteUrl().origin).toBe('https://fotyouth.vercel.app');

    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', undefined);
    expect(getSiteUrl().origin).toBe('http://localhost:3000');
  });
});

describe('getPaypalUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns https URLs', () => {
    vi.stubEnv('NEXT_PUBLIC_PAYPAL_URL', 'https://www.paypal.com/donate/?x=1');
    expect(getPaypalUrl()).toBe('https://www.paypal.com/donate/?x=1');
  });

  it.each(['javascript:alert(1)', 'http://paypal.com', 'not a url', ''])(
    'rejects %j',
    (value) => {
      vi.stubEnv('NEXT_PUBLIC_PAYPAL_URL', value);
      expect(getPaypalUrl()).toBeUndefined();
    }
  );
});

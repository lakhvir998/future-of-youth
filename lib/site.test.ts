import { afterEach, describe, expect, it, vi } from 'vitest';

import { getDonationUrl, getSiteUrl } from './site';

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

describe('getDonationUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns https Zeffy URLs', () => {
    vi.stubEnv(
      'NEXT_PUBLIC_DONATION_URL',
      'https://www.zeffy.com/en-US/donation-form/abc'
    );
    expect(getDonationUrl()).toBe(
      'https://www.zeffy.com/en-US/donation-form/abc'
    );
  });

  it.each([
    'javascript:alert(1)',
    'http://www.zeffy.com/en-US/donation-form/abc',
    'https://www.paypal.com/donate/?hosted_button_id=1',
    'https://zeffy.com.evil.example/donate',
    'not a url',
    '',
  ])('rejects %j', (value) => {
    vi.stubEnv('NEXT_PUBLIC_DONATION_URL', value);
    expect(getDonationUrl()).toBeUndefined();
  });

  it('accepts the legacy setting only when it holds a Zeffy URL', () => {
    vi.stubEnv('NEXT_PUBLIC_DONATION_URL', '');
    vi.stubEnv(
      'NEXT_PUBLIC_PAYPAL_URL',
      'https://www.zeffy.com/en-US/donation-form/future-of-the-youth'
    );
    expect(getDonationUrl()).toBe(
      'https://www.zeffy.com/en-US/donation-form/future-of-the-youth'
    );

    vi.stubEnv('NEXT_PUBLIC_PAYPAL_URL', 'https://www.paypal.com/donate/?x=1');
    expect(getDonationUrl()).toBeUndefined();
  });

  it('prefers NEXT_PUBLIC_DONATION_URL over the legacy setting', () => {
    vi.stubEnv('NEXT_PUBLIC_DONATION_URL', 'https://www.zeffy.com/new');
    vi.stubEnv('NEXT_PUBLIC_PAYPAL_URL', 'https://www.zeffy.com/old');
    expect(getDonationUrl()).toBe('https://www.zeffy.com/new');
  });
});

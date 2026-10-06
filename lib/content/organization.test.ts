import { afterEach, describe, expect, it, vi } from 'vitest';

import { getContactInfo, phoneHref } from './organization';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getContactInfo', () => {
  it('returns nothing when no contact details are configured', () => {
    expect(getContactInfo()).toEqual({});
  });

  it('returns well-formed values', () => {
    vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', 'info@example.org');
    vi.stubEnv('NEXT_PUBLIC_CONTACT_PHONE', '(313) 555-0100');
    vi.stubEnv('NEXT_PUBLIC_MAILING_ADDRESS', 'PO Box 1\\nDetroit, MI 48201');
    vi.stubEnv('NEXT_PUBLIC_EIN', '12-3456789');

    expect(getContactInfo()).toEqual({
      email: 'info@example.org',
      phone: '(313) 555-0100',
      address: 'PO Box 1\nDetroit, MI 48201',
      ein: '12-3456789',
    });
  });

  it('drops malformed values instead of rendering them', () => {
    vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', 'not an email');
    vi.stubEnv('NEXT_PUBLIC_CONTACT_PHONE', 'javascript:alert(1)');
    vi.stubEnv('NEXT_PUBLIC_EIN', '123');

    expect(getContactInfo()).toEqual({});
  });
});

describe('phoneHref', () => {
  it('strips formatting characters', () => {
    expect(phoneHref('(313) 555-0100')).toBe('tel:3135550100');
  });
});

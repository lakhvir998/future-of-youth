import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  EIN,
  getContactInfo,
  MAILING_ADDRESS,
  phoneHref,
} from './organization';

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

    expect(getContactInfo()).toEqual({
      email: 'info@example.org',
      phone: '(313) 555-0100',
    });
  });

  it('drops malformed values instead of rendering them', () => {
    vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', 'not an email');
    vi.stubEnv('NEXT_PUBLIC_CONTACT_PHONE', 'javascript:alert(1)');

    expect(getContactInfo()).toEqual({});
  });
});

describe('phoneHref', () => {
  it('strips formatting characters', () => {
    expect(phoneHref('(313) 555-0100')).toBe('tel:3135550100');
  });
});

describe('client-supplied organization facts', () => {
  it('uses the EIN and address the client provided', () => {
    expect(EIN).toBe('39-3626296');
    expect(MAILING_ADDRESS).toBe('Detroit, MI 48235');
  });
});

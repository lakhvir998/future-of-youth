// Organization facts. Values that only the client can confirm (contact details,
// EIN) come from environment variables so they can be set in Vercel without a
// code change, and are simply not rendered until they are set.

export const ORGANIZATION = {
  name: 'Future of the Youth',
  // Must match the IRS determination letter exactly (client to confirm).
  legalName: 'Future of the Youth',
  city: 'Detroit',
  region: 'Michigan',
  regionCode: 'MI',
  country: 'US',
} as const;

// Wording supplied by the client.
export const NONPROFIT_STATEMENT =
  'Future of the Youth Limited is a 501(c)(3) nonprofit organization.';

export const TAX_DEDUCTIBLE_STATEMENT =
  'Donations are tax-deductible to the extent allowed by law.';

export type ContactInfo = {
  email?: string;
  phone?: string;
  /** Free-form mailing address; line breaks separate lines. */
  address?: string;
  ein?: string;
};

const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{7,25}$/;
const EIN_PATTERN = /^\d{2}-\d{7}$/;

function readEnv(name: string, pattern?: RegExp, maxLength = 300) {
  const value = process.env[name]?.trim();
  if (!value || value.length > maxLength) return undefined;
  if (pattern && !pattern.test(value)) return undefined;
  return value;
}

/** Public contact details. Invalid or missing values are omitted, never shown. */
export function getContactInfo(): ContactInfo {
  return {
    email: readEnv('NEXT_PUBLIC_CONTACT_EMAIL', EMAIL_PATTERN, 254),
    phone: readEnv('NEXT_PUBLIC_CONTACT_PHONE', PHONE_PATTERN, 26),
    address: readEnv('NEXT_PUBLIC_MAILING_ADDRESS')?.replace(/\\n/g, '\n'),
    ein: readEnv('NEXT_PUBLIC_EIN', EIN_PATTERN, 10),
  };
}

/** `tel:` href with formatting characters stripped. */
export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

// Organization facts. The address and EIN were supplied by the client. Contact
// email and phone come from environment variables (set in Vercel) and are not
// rendered until they are set.

export const ORGANIZATION = {
  name: 'Future of the Youth',
  // Must match the IRS determination letter exactly (client to confirm).
  legalName: 'Future of the Youth',
  city: 'Detroit',
  region: 'Michigan',
  regionCode: 'MI',
  postalCode: '48235',
  country: 'US',
} as const;

/** IRS Employer Identification Number (client-supplied). */
export const EIN = '39-3626296';

/** Public mailing address (client-supplied; no street line was provided). */
export const MAILING_ADDRESS = `${ORGANIZATION.city}, ${ORGANIZATION.regionCode} ${ORGANIZATION.postalCode}`;

// Wording supplied by the client.
export const NONPROFIT_STATEMENT =
  'Future of the Youth Limited is a 501(c)(3) nonprofit organization.';

export const TAX_DEDUCTIBLE_STATEMENT =
  'Donations are tax-deductible to the extent allowed by law.';

export type ContactInfo = {
  email?: string;
  phone?: string;
};

const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{7,25}$/;

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
  };
}

/** `tel:` href with formatting characters stripped. */
export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

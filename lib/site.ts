/** Anchor for the request-info form on the home page. */
export const REQUEST_INFO_ID = 'request-info';
export const REQUEST_INFO_HREF = `/#${REQUEST_INFO_ID}`;
/** Target of the skip link; set on <main> in the root layout. */
export const MAIN_CONTENT_ID = 'main';

export const SITE_NAME = 'Future of the Youth';
export const SITE_TITLE = `${SITE_NAME} | Preparing Today’s Youth for Tomorrow’s Economy`;
export const SITE_DESCRIPTION =
  'A Detroit 501(c)(3) nonprofit preparing minority and underserved youth for the future with free entrepreneurship, financial literacy, AI & technology, and career & leadership development programs.';
// Taken from the logo artwork.
export const SITE_SLOGAN = 'Inspiring Minds, Shaping Futures';
export const BRAND_COLOR = '#0072ce';

/**
 * Absolute origin used for canonical URLs, Open Graph, sitemap, and JSON-LD.
 * Prefers the explicit NEXT_PUBLIC_SITE_URL, then Vercel's production domain.
 */
export function getSiteUrl(): URL {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);

  try {
    if (configured) return new URL(configured);
  } catch {
    // Fall through to the local default on a malformed value.
  }
  return new URL('http://localhost:3000');
}

/** Donations are processed by Zeffy (the site's wording says so). */
export const DONATION_PROVIDER = 'Zeffy';

/**
 * Returns the official Zeffy donation page URL, or undefined. Only https links
 * on zeffy.com are accepted, so a misconfigured value (another provider, or
 * `javascript:`) can never be rendered behind wording that says "Zeffy".
 *
 * NEXT_PUBLIC_PAYPAL_URL is still read as a fallback because production already
 * has the Zeffy link stored under that old name; the zeffy.com check means an
 * actual PayPal link there is still rejected.
 */
export function getDonationUrl(): string | undefined {
  const raw =
    process.env.NEXT_PUBLIC_DONATION_URL || process.env.NEXT_PUBLIC_PAYPAL_URL;
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    const isZeffy =
      url.hostname === 'zeffy.com' || url.hostname.endsWith('.zeffy.com');
    return url.protocol === 'https:' && isZeffy ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

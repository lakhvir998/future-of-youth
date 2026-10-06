/** Anchor for the request-info form on the home page. */
export const REQUEST_INFO_ID = 'request-info';
export const REQUEST_INFO_HREF = `/#${REQUEST_INFO_ID}`;
/** Target of the skip link; set on <main> in the root layout. */
export const MAIN_CONTENT_ID = 'main';

export const SITE_NAME = 'Future of the Youth';
export const SITE_TITLE = `${SITE_NAME} | Preparing Detroit Youth for the Future`;
export const SITE_DESCRIPTION =
  'A Detroit 501(c)(3) nonprofit preparing minority and underserved youth for the future with free AI & technology, entrepreneurship, financial literacy, mentorship, and youth development programs.';
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

/**
 * Returns the PayPal URL only if it's a well-formed https link, so a
 * misconfigured value (e.g. `javascript:`) can never be rendered as a link.
 */
export function getPaypalUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_PAYPAL_URL;
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    return url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

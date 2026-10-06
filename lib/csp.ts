// Relative import: this module is loaded by next.config.ts, before path
// aliases are available.
import { GOOGLE_TAG_CSP } from './analytics-config';

type CspOptions = {
  isDev: boolean;
  /** Vercel preview deployments inject the comments/feedback toolbar. */
  isVercelPreview: boolean;
  /** Allow the Google tag (GA4 / Ads) only when it's actually configured. */
  googleTag: boolean;
};

/**
 * Pages are statically prerendered, so nonces aren't available; inline scripts
 * (Next's bootstrap, JSON-LD, the gtag snippet) need 'unsafe-inline'. Every
 * other source is listed explicitly.
 */
export function buildContentSecurityPolicy({
  isDev,
  isVercelPreview,
  googleTag,
}: CspOptions) {
  const vercel = isVercelPreview ? ['https://vercel.live'] : [];
  const google = (key: keyof typeof GOOGLE_TAG_CSP) =>
    googleTag ? GOOGLE_TAG_CSP[key] : [];

  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
      ...vercel,
      ...google('script'),
    ],
    'style-src': ["'self'", "'unsafe-inline'", ...vercel],
    'img-src': ["'self'", 'data:', 'blob:', ...vercel, ...google('img')],
    'font-src': ["'self'"],
    'media-src': ["'self'"],
    'connect-src': [
      "'self'",
      ...(isDev ? ['ws:'] : []),
      ...vercel,
      ...(isVercelPreview ? ['wss://ws-us3.pusher.com'] : []),
      ...google('connect'),
    ],
    'frame-src': [...vercel, ...google('frame')],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  };

  return [
    ...Object.entries(directives).map(
      ([name, sources]) =>
        `${name} ${sources.length ? sources.join(' ') : "'none'"}`
    ),
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}

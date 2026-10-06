// Google tag (GA4 / Google Ads) configuration, read from NEXT_PUBLIC_ env vars.
// Kept free of browser and React code so next.config.ts can import it to build
// the Content-Security-Policy.

export type AnalyticsConfig = {
  gaMeasurementId?: string;
  adsId?: string;
  adsLeadLabel?: string;
  adsDonateLabel?: string;
};

// Strict formats: these values are interpolated into an inline script, so
// anything unexpected is dropped rather than escaped.
const GA_ID = /^G-[A-Z0-9]{4,20}$/;
const ADS_ID = /^AW-\d{6,15}$/;
const ADS_LABEL = /^[A-Za-z0-9_-]{4,64}$/;

function read(value: string | undefined, pattern: RegExp) {
  const trimmed = value?.trim();
  return trimmed && pattern.test(trimmed) ? trimmed : undefined;
}

export function getAnalyticsConfig(): AnalyticsConfig {
  return {
    gaMeasurementId: read(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, GA_ID),
    adsId: read(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID, ADS_ID),
    adsLeadLabel: read(
      process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
      ADS_LABEL
    ),
    adsDonateLabel: read(
      process.env.NEXT_PUBLIC_GOOGLE_ADS_DONATE_LABEL,
      ADS_LABEL
    ),
  };
}

export function isAnalyticsEnabled(config = getAnalyticsConfig()) {
  return Boolean(config.gaMeasurementId || config.adsId);
}

/**
 * Extra CSP sources the Google tag needs, per Google's CSP guidance for
 * gtag.js with GA4 and Google Ads conversion tracking.
 */
export const GOOGLE_TAG_CSP = {
  script: [
    'https://*.googletagmanager.com',
    'https://www.googleadservices.com',
    'https://www.google.com',
  ],
  connect: [
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://*.googletagmanager.com',
    'https://www.google.com',
    'https://google.com',
    'https://*.doubleclick.net',
    'https://www.googleadservices.com',
  ],
  img: [
    'https://*.google-analytics.com',
    'https://*.googletagmanager.com',
    'https://*.doubleclick.net',
    'https://www.google.com',
    'https://www.googleadservices.com',
  ],
  frame: ['https://*.doubleclick.net', 'https://www.googletagmanager.com'],
};

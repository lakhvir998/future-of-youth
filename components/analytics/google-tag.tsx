import Script from 'next/script';

import { getAnalyticsConfig } from '@/lib/analytics-config';

/**
 * Loads the Google tag only when a GA4 or Google Ads ID is configured.
 * Google signals and ad personalization are off: the audience includes
 * families of minors, and conversion measurement doesn't need them.
 */
export function GoogleTag() {
  const { gaMeasurementId, adsId } = getAnalyticsConfig();
  const primaryId = gaMeasurementId ?? adsId;
  if (!primaryId) return null;

  // IDs are validated against strict patterns in getAnalyticsConfig and
  // JSON-encoded here, so they can't break out of the script.
  const configs = [gaMeasurementId, adsId]
    .filter(Boolean)
    .map(
      (id) =>
        `gtag('config', ${JSON.stringify(id)}, { allow_google_signals: false, allow_ad_personalization_signals: false });`
    )
    .join('\n');

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primaryId)}`}
        strategy='afterInteractive'
      />
      <Script id='google-tag' strategy='afterInteractive'>
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${configs}`}
      </Script>
    </>
  );
}

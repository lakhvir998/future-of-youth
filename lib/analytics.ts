import type { AnalyticsConfig } from '@/lib/analytics-config';
import { getAnalyticsConfig } from '@/lib/analytics-config';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Only these events and parameters exist. Params are fixed enums by design,
 * so form values (names, emails, details about minors) can never be sent.
 */
type AnalyticsEvents = {
  generate_lead: { form: 'request_info' | 'contact' };
  donate_click: {
    location: 'header' | 'donate_page' | 'donate_cta' | 'mobile_nav';
  };
};

/**
 * Which Google Ads conversion (if any) an event counts as. Only a successful
 * contact-form submission is a lead conversion; request-info submissions are
 * still sent to GA4 but don't count toward the Ads conversion.
 */
function adsLabelFor<E extends keyof AnalyticsEvents>(
  event: E,
  params: AnalyticsEvents[E],
  config: AnalyticsConfig
) {
  if (event === 'generate_lead') {
    const { form } = params as AnalyticsEvents['generate_lead'];
    return form === 'contact' ? config.adsContactLabel : undefined;
  }
  return config.adsDonateLabel;
}

/** Sends a GA4 event (and the matching Google Ads conversion). No-op if the tag isn't loaded. */
export function trackEvent<E extends keyof AnalyticsEvents>(
  event: E,
  params: AnalyticsEvents[E]
) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', event, params);

  const config = getAnalyticsConfig();
  const label = adsLabelFor(event, params, config);
  if (config.adsId && label) {
    window.gtag('event', 'conversion', {
      send_to: `${config.adsId}/${label}`,
    });
  }
}

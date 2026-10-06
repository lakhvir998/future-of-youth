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

const ADS_LABEL_FOR: Record<
  keyof AnalyticsEvents,
  'adsLeadLabel' | 'adsDonateLabel'
> = {
  generate_lead: 'adsLeadLabel',
  donate_click: 'adsDonateLabel',
};

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
  const label = config[ADS_LABEL_FOR[event]];
  if (config.adsId && label) {
    window.gtag('event', 'conversion', {
      send_to: `${config.adsId}/${label}`,
    });
  }
}

import type { AnalyticsConfig } from '@/lib/analytics-config';
import { getAnalyticsConfig, isAnalyticsEnabled } from '@/lib/analytics-config';

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
  /** A completed Zeffy payment (the donor was redirected to our thank-you page). */
  donation_complete: { source: 'zeffy' };
};

type AnalyticsEvent = keyof AnalyticsEvents;

/**
 * Which Google Ads conversion (if any) an event counts as. Only a successful
 * contact-form submission is a lead conversion; request-info submissions are
 * still sent to GA4 but don't count toward the Ads conversion.
 */
function adsLabelFor<E extends AnalyticsEvent>(
  event: E,
  params: AnalyticsEvents[E],
  config: AnalyticsConfig
) {
  switch (event) {
    case 'generate_lead': {
      const { form } = params as AnalyticsEvents['generate_lead'];
      return form === 'contact' ? config.adsContactLabel : undefined;
    }
    case 'donate_click':
      return config.adsDonateLabel;
    case 'donation_complete':
      return config.adsDonationLabel;
    default:
      return undefined;
  }
}

/**
 * Sends a GA4 event (and the matching Google Ads conversion). Returns whether
 * it was sent; it's a no-op (false) if the tag isn't loaded.
 */
export function trackEvent<E extends AnalyticsEvent>(
  event: E,
  params: AnalyticsEvents[E]
): boolean {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return false;
  }

  window.gtag('event', event, params);

  const config = getAnalyticsConfig();
  const label = adsLabelFor(event, params, config);
  if (config.adsId && label) {
    window.gtag('event', 'conversion', {
      send_to: `${config.adsId}/${label}`,
    });
  }
  return true;
}

const READY_POLL_MS = 100;

/**
 * For events that fire on page load rather than on a user action. The Google
 * tag loads `afterInteractive`, so it may not exist yet when a component
 * mounts; waiting (up to `timeoutMs`) keeps the event from being dropped.
 * Calls `onSent` once the event is sent. Returns a cleanup that cancels it.
 */
export function trackEventWhenReady<E extends AnalyticsEvent>(
  event: E,
  params: AnalyticsEvents[E],
  { onSent, timeoutMs = 10_000 }: { onSent?: () => void; timeoutMs?: number }
): () => void {
  // Nothing will ever load the tag, so don't wait for it.
  if (!isAnalyticsEnabled()) return () => {};

  let waited = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  function attempt() {
    if (trackEvent(event, params)) {
      onSent?.();
      return;
    }
    if (waited >= timeoutMs) return;
    waited += READY_POLL_MS;
    timer = setTimeout(attempt, READY_POLL_MS);
  }

  attempt();
  return () => clearTimeout(timer);
}

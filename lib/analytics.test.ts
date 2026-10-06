import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAnalyticsConfig, isAnalyticsEnabled } from './analytics-config';
import { trackEvent } from './analytics';

afterEach(() => {
  vi.unstubAllEnvs();
  delete window.gtag;
});

describe('getAnalyticsConfig', () => {
  it('accepts well-formed IDs', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-ABC123XYZ');
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_ID', 'AW-123456789');

    expect(getAnalyticsConfig()).toMatchObject({
      gaMeasurementId: 'G-ABC123XYZ',
      adsId: 'AW-123456789',
    });
    expect(isAnalyticsEnabled()).toBe(true);
  });

  it('drops values that could inject script', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', "G-1');alert(1);//");
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL', '</script>');

    const config = getAnalyticsConfig();
    expect(config.gaMeasurementId).toBeUndefined();
    expect(config.adsLeadLabel).toBeUndefined();
    expect(isAnalyticsEnabled(config)).toBe(false);
  });
});

describe('trackEvent', () => {
  it('does nothing when the Google tag is not loaded', () => {
    expect(() =>
      trackEvent('generate_lead', { form: 'contact' })
    ).not.toThrow();
  });

  it('sends only the fixed event parameters', () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    trackEvent('generate_lead', { form: 'request_info' });

    expect(gtag).toHaveBeenCalledExactlyOnceWith('event', 'generate_lead', {
      form: 'request_info',
    });
  });

  it('also sends the Google Ads conversion when a label is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_ID', 'AW-123456789');
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_DONATE_LABEL', 'abcDEF_123');
    const gtag = vi.fn();
    window.gtag = gtag;

    trackEvent('donate_click', { location: 'donate_page' });

    expect(gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-123456789/abcDEF_123',
    });
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAnalyticsConfig, isAnalyticsEnabled } from './analytics-config';
import { trackEvent, trackEventWhenReady } from './analytics';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
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
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL', '</script>');

    const config = getAnalyticsConfig();
    expect(config.gaMeasurementId).toBeUndefined();
    expect(config.adsContactLabel).toBeUndefined();
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

  it('counts only a contact-form submission as the lead conversion', () => {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_ID', 'AW-123456789');
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL', 'contact_LABEL1');
    const gtag = vi.fn();
    window.gtag = gtag;

    trackEvent('generate_lead', { form: 'request_info' });
    expect(gtag).not.toHaveBeenCalledWith(
      'event',
      'conversion',
      expect.anything()
    );

    trackEvent('generate_lead', { form: 'contact' });
    expect(gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-123456789/contact_LABEL1',
    });
  });

  it('does not use the contact label for Donate Now clicks', () => {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_ID', 'AW-123456789');
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL', 'contact_LABEL1');
    const gtag = vi.fn();
    window.gtag = gtag;

    trackEvent('donate_click', { location: 'header' });

    expect(gtag).toHaveBeenCalledExactlyOnceWith('event', 'donate_click', {
      location: 'header',
    });
  });

  it('counts a completed donation only under its own label', () => {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_ID', 'AW-123456789');
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_DONATE_LABEL', 'click_LABEL1');
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_DONATION_LABEL', 'paid_LABEL1');
    const gtag = vi.fn();
    window.gtag = gtag;

    trackEvent('donation_complete', { source: 'zeffy' });

    expect(gtag.mock.calls).toEqual([
      ['event', 'donation_complete', { source: 'zeffy' }],
      ['event', 'conversion', { send_to: 'AW-123456789/paid_LABEL1' }],
    ]);
  });
});

describe('trackEventWhenReady', () => {
  function enableAds() {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_ID', 'AW-123456789');
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_DONATION_LABEL', 'paid_LABEL1');
  }

  it('waits for the Google tag to load, then sends once', () => {
    vi.useFakeTimers();
    enableAds();
    const onSent = vi.fn();

    trackEventWhenReady('donation_complete', { source: 'zeffy' }, { onSent });
    vi.advanceTimersByTime(300);
    expect(onSent).not.toHaveBeenCalled();

    const gtag = vi.fn();
    window.gtag = gtag;
    vi.advanceTimersByTime(1_000);

    expect(onSent).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-123456789/paid_LABEL1',
    });
    expect(gtag).toHaveBeenCalledTimes(2);
  });

  it('gives up after the timeout', () => {
    vi.useFakeTimers();
    enableAds();
    const onSent = vi.fn();

    trackEventWhenReady(
      'donation_complete',
      { source: 'zeffy' },
      { onSent, timeoutMs: 500 }
    );
    vi.advanceTimersByTime(1_000);
    window.gtag = vi.fn();
    vi.advanceTimersByTime(1_000);

    expect(window.gtag).not.toHaveBeenCalled();
    expect(onSent).not.toHaveBeenCalled();
  });

  it('can be cancelled before the tag loads', () => {
    vi.useFakeTimers();
    enableAds();
    const onSent = vi.fn();

    const cancel = trackEventWhenReady(
      'donation_complete',
      { source: 'zeffy' },
      { onSent }
    );
    cancel();
    window.gtag = vi.fn();
    vi.advanceTimersByTime(1_000);

    expect(window.gtag).not.toHaveBeenCalled();
  });

  it("doesn't wait when analytics isn't configured", () => {
    vi.useFakeTimers();

    trackEventWhenReady('donation_complete', { source: 'zeffy' }, {});

    expect(vi.getTimerCount()).toBe(0);
  });
});

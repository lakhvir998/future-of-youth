import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DonationCompleteTracker } from './donation-complete-tracker';

const CONVERSION = [
  'event',
  'conversion',
  { send_to: 'AW-123456789/paid_LABEL1' },
];

function arriveFrom(referrer: string) {
  Object.defineProperty(document, 'referrer', {
    value: referrer,
    configurable: true,
  });
}

let gtag: ReturnType<typeof vi.fn<(...args: unknown[]) => void>>;

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_ID', 'AW-123456789');
  vi.stubEnv('NEXT_PUBLIC_GOOGLE_ADS_DONATION_LABEL', 'paid_LABEL1');
  gtag = vi.fn<(...args: unknown[]) => void>();
  window.gtag = gtag;
  sessionStorage.clear();
});

afterEach(() => {
  vi.unstubAllEnvs();
  delete window.gtag;
  arriveFrom('');
});

describe('DonationCompleteTracker', () => {
  it('records a completed donation for visitors redirected from Zeffy', () => {
    arriveFrom('https://www.zeffy.com/');
    render(<DonationCompleteTracker />);

    expect(gtag).toHaveBeenCalledWith('event', 'donation_complete', {
      source: 'zeffy',
    });
    expect(gtag).toHaveBeenCalledWith(...CONVERSION);
  });

  it('ignores direct visits and visitors from other sites', () => {
    arriveFrom('');
    render(<DonationCompleteTracker />);
    arriveFrom('https://www.google.com/');
    render(<DonationCompleteTracker />);

    expect(gtag).not.toHaveBeenCalled();
  });

  it('counts a reload of the page (same Zeffy referrer) only once', () => {
    arriveFrom('https://www.zeffy.com/');
    const { unmount } = render(<DonationCompleteTracker />);
    unmount();
    render(<DonationCompleteTracker />);

    const conversions = gtag.mock.calls.filter(
      ([, name]) => name === 'conversion'
    );
    expect(conversions).toHaveLength(1);
  });

  it('renders nothing', () => {
    arriveFrom('https://www.zeffy.com/');
    const { container } = render(<DonationCompleteTracker />);

    expect(container).toBeEmptyDOMElement();
  });
});

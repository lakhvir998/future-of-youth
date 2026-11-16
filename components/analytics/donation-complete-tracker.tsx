'use client';

import { useEffect } from 'react';

import { trackEventWhenReady } from '@/lib/analytics';
import { isZeffyReferrer } from '@/lib/site';

// Per tab: a reload keeps the Zeffy referrer, so without this every refresh
// would count another donation. (Google Ads "Count: One" is the backstop.)
const TRACKED_KEY = 'fy:donation-complete-tracked';

function wasTracked() {
  try {
    return sessionStorage.getItem(TRACKED_KEY) === '1';
  } catch {
    return false;
  }
}

function markTracked() {
  try {
    sessionStorage.setItem(TRACKED_KEY, '1');
  } catch {
    // Storage blocked: Google Ads "Count: One" still dedupes per ad click.
  }
}

/**
 * Records the completed-donation conversion on the thank-you page, but only
 * for visitors Zeffy redirected here after payment. Direct visits (shared
 * links, bots) aren't counted. Renders nothing.
 */
export function DonationCompleteTracker() {
  useEffect(() => {
    if (!isZeffyReferrer(document.referrer) || wasTracked()) return;
    return trackEventWhenReady(
      'donation_complete',
      { source: 'zeffy' },
      { onSent: markTracked }
    );
  }, []);

  return null;
}

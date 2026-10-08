'use client';

import { useEffect } from 'react';

/**
 * Registers /sw.js in production builds only (Vercel previews and production).
 * In `next dev` a worker would serve stale bundles, so it's skipped there.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    // Register after load so it never competes with the page's own requests.
    const register = () => {
      navigator.serviceWorker
        // updateViaCache 'none': always fetch the latest worker from the network.
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .catch((error: unknown) => {
          console.error('[pwa] Service worker registration failed:', error);
        });
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
      return () => window.removeEventListener('load', register);
    }
  }, []);

  return null;
}

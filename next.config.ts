import type { NextConfig } from 'next';

import { isAnalyticsEnabled } from './lib/analytics-config';
import { buildContentSecurityPolicy } from './lib/csp';

const contentSecurityPolicy = buildContentSecurityPolicy({
  isDev: process.env.NODE_ENV === 'development',
  isVercelPreview: process.env.VERCEL_ENV === 'preview',
  googleTag: isAnalyticsEnabled(),
});

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // No remote images are used; an empty list keeps /_next/image from
    // fetching any external URL (no open proxy).
    remotePatterns: [],
  },
  experimental: {
    serverActions: {
      // The form payload is a few hundred bytes; reject anything large.
      bodySizeLimit: '64kb',
    },
  },
  // Programs consolidated into the client's four (October 2026).
  async redirects() {
    return [
      {
        source: '/programs/mentorship',
        destination: '/programs/career-leadership',
        permanent: true,
      },
      {
        source: '/programs/youth-development',
        destination: '/programs',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // Browsers and Vercel's CDN must always re-check the service worker,
        // or a new deploy's worker (and its cache cleanup) never arrives.
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },
};

export default nextConfig;

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
    // Only the one hero photo, so /_next/image can't be used as an open proxy.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/photo-1506744038136-46273834b3fb',
      },
    ],
  },
  experimental: {
    serverActions: {
      // The form payload is a few hundred bytes; reject anything large.
      bodySizeLimit: '64kb',
    },
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;

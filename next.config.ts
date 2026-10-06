import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';
// Vercel preview deployments inject the comments/feedback toolbar.
const isVercelPreview = process.env.VERCEL_ENV === 'preview';
const vercelLive = isVercelPreview ? ' https://vercel.live' : '';

// The page is statically prerendered, so nonces aren't available; inline
// scripts (Next's bootstrap and JSON-LD) need 'unsafe-inline'. Everything else
// is locked to our own origin.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}${vercelLive}`,
  `style-src 'self' 'unsafe-inline'${vercelLive}`,
  `img-src 'self' data: blob:${vercelLive}`,
  "font-src 'self'",
  "media-src 'self'",
  `connect-src 'self'${isDev ? ' ws:' : ''}${vercelLive}${isVercelPreview ? ' wss://ws-us3.pusher.com' : ''}`,
  `frame-src ${isVercelPreview ? 'https://vercel.live' : "'none'"}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

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

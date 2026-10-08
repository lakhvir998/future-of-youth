import type { MetadataRoute } from 'next';

import { PAGES } from '@/lib/content/pages';
import {
  BRAND_COLOR,
  REQUEST_INFO_HREF,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@/lib/site';

const shortcutIcon = [
  { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
];

export default function manifest(): MetadataRoute.Manifest {
  return {
    // Stable identity across deploys, so an installed app updates in place.
    id: '/',
    name: SITE_NAME,
    short_name: 'Future Youth',
    description: SITE_DESCRIPTION,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    lang: 'en-US',
    dir: 'ltr',
    background_color: '#ffffff',
    theme_color: BRAND_COLOR,
    categories: ['education', 'nonprofit'],
    prefer_related_applications: false,
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      { name: PAGES['/programs'].label, url: '/programs', icons: shortcutIcon },
      {
        name: 'Request Program Info',
        url: REQUEST_INFO_HREF,
        icons: shortcutIcon,
      },
      { name: PAGES['/donate'].label, url: '/donate', icons: shortcutIcon },
      { name: PAGES['/contact'].label, url: '/contact', icons: shortcutIcon },
    ],
  };
}

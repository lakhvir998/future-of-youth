import type { MetadataRoute } from 'next';

import { PAGES } from '@/lib/content/pages';
import { getProgramDetailPages } from '@/lib/content/programs';
import { getSiteUrl } from '@/lib/site';

/** Every public route: registry pages plus one page per program. */
export function getSitemapPaths(): string[] {
  return [
    ...Object.keys(PAGES),
    ...getProgramDetailPages().map((program) => program.href),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return getSitemapPaths().map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : path === '/privacy' ? 0.3 : 0.8,
  }));
}

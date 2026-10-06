import type { Metadata } from 'next';

import { PAGES, type PagePath } from '@/lib/content/pages';

type MetadataInput = {
  title: string;
  description: string;
  path: string;
};

/**
 * Unique title, description, canonical URL, and social tags for one page.
 * Share images come from app/opengraph-image.png via Next's file convention.
 */
export function buildMetadata({
  title,
  description,
  path,
}: MetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: 'website' },
    twitter: { title, description },
  };
}

export function buildPageMetadata(path: PagePath): Metadata {
  const { title, description } = PAGES[path];
  return buildMetadata({ title, description, path });
}

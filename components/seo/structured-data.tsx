import { HERO_INTRO, MISSION_STATEMENT } from '@/lib/content';
import { ACADEMIC_INTERESTS } from '@/lib/request-info';
import {
  getPaypalUrl,
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SLOGAN,
  SITE_TITLE,
} from '@/lib/site';

/**
 * Serializes JSON-LD for a <script> tag. Escaping `<` stops a value containing
 * `</script>` from closing the tag early and injecting markup.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function buildStructuredData() {
  const siteUrl = getSiteUrl();
  const url = (path: string) => new URL(path, siteUrl).toString();
  const paypalUrl = getPaypalUrl();

  const organizationId = url('/#organization');
  const websiteId = url('/#website');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NGO',
        '@id': organizationId,
        name: SITE_NAME,
        url: url('/'),
        logo: {
          '@type': 'ImageObject',
          url: url('/futureofyouth.png'),
          width: 1024,
          height: 1024,
        },
        image: url('/opengraph-image.png'),
        slogan: SITE_SLOGAN,
        description: MISSION_STATEMENT,
        areaServed: {
          '@type': 'City',
          name: 'Detroit',
          containedInPlace: { '@type': 'State', name: 'Michigan' },
        },
        knowsAbout: [
          'Entrepreneurship',
          'Financial literacy',
          'Tutoring',
          'Mentorship',
          ...ACADEMIC_INTERESTS,
        ],
        ...(paypalUrl && {
          potentialAction: {
            '@type': 'DonateAction',
            target: paypalUrl,
            recipient: { '@id': organizationId },
          },
        }),
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: url('/'),
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { '@id': organizationId },
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebPage',
        '@id': url('/#webpage'),
        url: url('/'),
        name: SITE_TITLE,
        description: HERO_INTRO,
        isPartOf: { '@id': websiteId },
        about: { '@id': organizationId },
        primaryImageOfPage: url('/opengraph-image.png'),
        inLanguage: 'en-US',
      },
    ],
  };
}

export function StructuredData() {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(buildStructuredData()),
      }}
    />
  );
}

import { MISSION_STATEMENT } from '@/lib/content/home';
import {
  getContactInfo,
  NONPROFIT_STATEMENT,
  ORGANIZATION,
} from '@/lib/content/organization';
import type { Crumb } from '@/lib/content/pages';
import { PROGRAMS, type Program } from '@/lib/content/programs';
import {
  getPaypalUrl,
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SLOGAN,
} from '@/lib/site';

type JsonLdNode = Record<string, unknown>;

/**
 * Serializes JSON-LD for a <script> tag. Escaping `<` stops a value containing
 * `</script>` from closing the tag early and injecting markup.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function absoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

const ORGANIZATION_ID = () => absoluteUrl('/#organization');
const WEBSITE_ID = () => absoluteUrl('/#website');

export function buildOrganizationNode(): JsonLdNode {
  const contact = getContactInfo();
  const paypalUrl = getPaypalUrl();

  return {
    '@type': 'NGO',
    '@id': ORGANIZATION_ID(),
    name: SITE_NAME,
    legalName: ORGANIZATION.legalName,
    nonprofitStatus: 'Nonprofit501c3',
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo-512.png'),
      width: 512,
      height: 512,
    },
    image: absoluteUrl('/opengraph-image.png'),
    slogan: SITE_SLOGAN,
    description: `${MISSION_STATEMENT} ${NONPROFIT_STATEMENT}`,
    areaServed: {
      '@type': 'City',
      name: ORGANIZATION.city,
      containedInPlace: { '@type': 'State', name: ORGANIZATION.region },
    },
    knowsAbout: PROGRAMS.map((program) => program.title),
    ...(contact.email && { email: contact.email }),
    ...(contact.phone && { telephone: contact.phone }),
    ...(contact.ein && { taxID: contact.ein }),
    ...(contact.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: contact.address.replace(/\n/g, ', '),
        addressLocality: ORGANIZATION.city,
        addressRegion: ORGANIZATION.regionCode,
        addressCountry: ORGANIZATION.country,
      },
    }),
    ...(paypalUrl && {
      potentialAction: {
        '@type': 'DonateAction',
        target: paypalUrl,
        recipient: { '@id': ORGANIZATION_ID() },
      },
    }),
  };
}

function buildWebsiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID(),
    url: absoluteUrl('/'),
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { '@id': ORGANIZATION_ID() },
    inLanguage: 'en-US',
  };
}

export function buildBreadcrumbNode(crumbs: Crumb[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href),
    })),
  };
}

export function buildProgramNode(program: Program): JsonLdNode {
  return {
    '@type': 'Service',
    '@id': absoluteUrl(`${program.href}#service`),
    name: program.title,
    description: program.summary,
    url: absoluteUrl(program.href),
    provider: { '@id': ORGANIZATION_ID() },
    areaServed: { '@type': 'City', name: ORGANIZATION.city },
    audience: { '@type': 'Audience', audienceType: program.audience },
    isAccessibleForFree: true,
  };
}

type PageGraphInput = {
  path: string;
  name: string;
  description: string;
  breadcrumbs?: Crumb[];
  extra?: JsonLdNode[];
};

export function buildPageGraph({
  path,
  name,
  description,
  breadcrumbs,
  extra = [],
}: PageGraphInput) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationNode(),
      buildWebsiteNode(),
      {
        '@type': 'WebPage',
        '@id': absoluteUrl(`${path}#webpage`),
        url: absoluteUrl(path),
        name,
        description,
        isPartOf: { '@id': WEBSITE_ID() },
        about: { '@id': ORGANIZATION_ID() },
        primaryImageOfPage: absoluteUrl('/opengraph-image.png'),
        inLanguage: 'en-US',
      },
      ...(breadcrumbs ? [buildBreadcrumbNode(breadcrumbs)] : []),
      ...extra,
    ],
  };
}

export function StructuredData(props: PageGraphInput) {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(buildPageGraph(props)),
      }}
    />
  );
}

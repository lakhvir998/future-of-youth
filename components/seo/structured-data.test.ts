import { afterEach, describe, expect, it, vi } from 'vitest';

import { breadcrumbsFor } from '@/lib/content/pages';
import { getProgramBySlug } from '@/lib/content/programs';

import {
  buildOrganizationNode,
  buildPageGraph,
  buildProgramNode,
  serializeJsonLd,
} from './structured-data';

describe('serializeJsonLd', () => {
  it('escapes "<" so values cannot close the script tag', () => {
    const json = serializeJsonLd({
      name: '</script><script>alert(1)</script>',
    });

    expect(json).not.toContain('</script>');
    expect(JSON.parse(json).name).toBe('</script><script>alert(1)</script>');
  });
});

describe('buildOrganizationNode', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('declares 501(c)(3) status and the legal name', () => {
    const org = buildOrganizationNode();

    expect(org).toMatchObject({
      '@type': 'NGO',
      legalName: 'Future of the Youth',
      nonprofitStatus: 'Nonprofit501c3',
    });
  });

  it('includes contact details only when they are configured', () => {
    expect(buildOrganizationNode()).not.toHaveProperty('email');

    vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', 'info@example.org');
    vi.stubEnv('NEXT_PUBLIC_EIN', '12-3456789');
    expect(buildOrganizationNode()).toMatchObject({
      email: 'info@example.org',
      taxID: '12-3456789',
    });
  });
});

describe('buildPageGraph', () => {
  it('adds breadcrumbs and extra nodes for subpages', () => {
    const program = getProgramBySlug('mentorship')!;
    const graph = buildPageGraph({
      path: program.href,
      name: program.title,
      description: program.summary,
      breadcrumbs: breadcrumbsFor('/programs', {
        label: program.title,
        href: program.href,
      }),
      extra: [buildProgramNode(program)],
    });

    expect(graph['@graph'].map((node) => node['@type'])).toEqual([
      'NGO',
      'WebSite',
      'WebPage',
      'BreadcrumbList',
      'Service',
    ]);
  });
});

import { describe, expect, it } from 'vitest';

import { getSitemapPaths } from '@/app/sitemap';

import { NAV_ITEMS, PAGES } from './pages';
import { getProgramDetailPages, PROGRAMS } from './programs';

describe('page registry', () => {
  it('has the navigation the client asked for, in order', () => {
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      'Home',
      'About Us',
      'Our Programs',
      'Get Involved',
      'Donate',
      'Contact',
    ]);
  });

  it('gives every page a unique title and description', () => {
    const pages = Object.values(PAGES);
    const programs = getProgramDetailPages();
    const titles = [
      ...pages.map((page) => page.title),
      ...programs.map((program) => `${program.title} Program for Youth`),
    ];
    const descriptions = [
      ...pages.map((page) => page.description),
      ...programs.map((program) => program.metaDescription),
    ];

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const description of descriptions) {
      expect(description.length).toBeGreaterThan(50);
      expect(description.length).toBeLessThanOrEqual(200);
    }
  });
});

describe('sitemap', () => {
  it('lists every page and program', () => {
    const paths = getSitemapPaths();

    for (const path of Object.keys(PAGES)) expect(paths).toContain(path);
    for (const program of PROGRAMS) expect(paths).toContain(program.href);
  });
});

describe('programs', () => {
  it('have enough written content for each program page', () => {
    for (const program of PROGRAMS) {
      expect(program.intro.join(' ').length).toBeGreaterThan(200);
      expect(program.outcomes.length).toBeGreaterThanOrEqual(4);
      expect(program.approach.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("client's program list", () => {
  it('has exactly the four programs, in order', () => {
    expect(PROGRAMS.map((program) => program.title)).toEqual([
      'Entrepreneurship',
      'Financial Literacy',
      'Artificial Intelligence & Technology',
      'Career & Leadership Development',
    ]);
  });

  it('keeps search descriptions short enough for result snippets', () => {
    for (const program of PROGRAMS) {
      expect(program.metaDescription.length).toBeLessThanOrEqual(160);
    }
  });

  it('redirects the retired program pages', async () => {
    const { default: nextConfig } = await import('@/next.config');
    const redirects = await nextConfig.redirects!();

    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: '/programs/mentorship',
          destination: '/programs/career-leadership',
          permanent: true,
        }),
        expect.objectContaining({
          source: '/programs/youth-development',
          destination: '/programs',
          permanent: true,
        }),
      ])
    );
  });
});

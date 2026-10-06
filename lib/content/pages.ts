// Every public page, in one place. Navigation, page metadata, the sitemap,
// breadcrumbs, and llms.txt are all derived from this registry.

export type PagePath =
  | '/'
  | '/about'
  | '/programs'
  | '/ai-technology'
  | '/get-involved'
  | '/donate'
  | '/contact'
  | '/privacy';

export type PageInfo = {
  path: PagePath;
  /** Short label for navigation and breadcrumbs. */
  label: string;
  /** <title> (the root layout appends the site name). */
  title: string;
  description: string;
  /** Shown in the main navigation, in this order. */
  inNav: boolean;
};

export const PAGES: Record<PagePath, PageInfo> = {
  '/': {
    path: '/',
    label: 'Home',
    title: 'Preparing Detroit Youth for the Future',
    description:
      'Future of the Youth is a Detroit 501(c)(3) nonprofit offering free AI & technology education, entrepreneurship, financial literacy, mentorship, and youth development programs.',
    inNav: true,
  },
  '/about': {
    path: '/about',
    label: 'About',
    title: 'About Us',
    description:
      'Learn about Future of the Youth, a Detroit 501(c)(3) nonprofit preparing minority and underserved youth for the future.',
    inNav: true,
  },
  '/programs': {
    path: '/programs',
    label: 'Programs',
    title: 'Programs',
    description:
      'Free programs for Detroit youth: AI & technology, entrepreneurship, financial literacy, mentorship, and youth development.',
    inNav: true,
  },
  '/ai-technology': {
    path: '/ai-technology',
    label: 'AI & Technology',
    title: 'AI & Technology Education for Youth',
    description:
      'AI education, responsible AI use, AI security and cybersecurity, digital skills, and technology career pathways for Detroit youth.',
    inNav: true,
  },
  '/get-involved': {
    path: '/get-involved',
    label: 'Get Involved',
    title: 'Get Involved',
    description:
      'Volunteer, mentor, sponsor, or partner with Future of the Youth to support Detroit’s young people.',
    inNav: true,
  },
  '/donate': {
    path: '/donate',
    label: 'Donate',
    title: 'Donate',
    description:
      'Support free AI & technology, entrepreneurship, financial literacy, and mentorship programs for Detroit youth. Future of the Youth is a 501(c)(3) nonprofit.',
    inNav: true,
  },
  '/contact': {
    path: '/contact',
    label: 'Contact',
    title: 'Contact Us',
    description:
      'Contact Future of the Youth about our programs, volunteering, mentoring, sponsorships, or donations.',
    inNav: true,
  },
  '/privacy': {
    path: '/privacy',
    label: 'Privacy Policy',
    title: 'Privacy Policy',
    description:
      'How Future of the Youth collects, uses, and protects information submitted through this website.',
    inNav: false,
  },
};

export const NAV_ITEMS = Object.values(PAGES).filter((page) => page.inNav);

export type Crumb = { label: string; href: string };

/** Home › Page (› …extra) trail for a subpage. */
export function breadcrumbsFor(path: PagePath, ...extra: Crumb[]): Crumb[] {
  return [
    { label: PAGES['/'].label, href: '/' },
    { label: PAGES[path].label, href: path },
    ...extra,
  ];
}

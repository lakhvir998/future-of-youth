import type { Metadata } from 'next';
import Link from 'next/link';

import { DonationCompleteTracker } from '@/components/analytics/donation-complete-tracker';
import { PageHero } from '@/components/sections/page-hero';
import { buttonClasses } from '@/components/ui/button';
import {
  DONATION_THANK_YOU_INTRO,
  DONATION_THANK_YOU_QUESTIONS,
  DONATION_THANK_YOU_TITLE,
} from '@/lib/content/donate';
import {
  EIN,
  NONPROFIT_STATEMENT,
  TAX_DEDUCTIBLE_STATEMENT,
} from '@/lib/content/organization';
import { breadcrumbsFor } from '@/lib/content/pages';
import { DONATION_THANK_YOU_PATH } from '@/lib/site';

// Zeffy redirects donors here after a completed payment. The page records the
// completed-donation conversion, so it's kept out of the page registry, the
// sitemap, and search results, like /offline.

export const metadata: Metadata = {
  title: DONATION_THANK_YOU_TITLE,
  robots: { index: false, follow: false },
};

const LINK_CLASSES =
  'font-semibold text-brand underline underline-offset-4 hover:text-brand-hover';

export default function DonationThankYouPage() {
  const breadcrumbs = breadcrumbsFor('/donate', {
    label: 'Thank You',
    href: DONATION_THANK_YOU_PATH,
  });

  return (
    <>
      <DonationCompleteTracker />
      <PageHero
        title={DONATION_THANK_YOU_TITLE}
        intro={<p>{DONATION_THANK_YOU_INTRO}</p>}
        breadcrumbs={breadcrumbs}
      >
        <div className='flex flex-wrap gap-4'>
          <Link href='/programs' className={buttonClasses()}>
            Explore our programs
          </Link>
          <Link href='/get-involved' className={buttonClasses('secondary')}>
            Other ways to get involved
          </Link>
        </div>
      </PageHero>

      <div className='mx-auto max-w-6xl space-y-4 px-4 py-10 text-lg text-ink md:py-14'>
        <p>
          {DONATION_THANK_YOU_QUESTIONS}{' '}
          <Link href='/contact?topic=donation' className={LINK_CLASSES}>
            contact us
          </Link>
          .
        </p>
        <p>
          <strong>{NONPROFIT_STATEMENT}</strong> {TAX_DEDUCTIBLE_STATEMENT}
          {` Our EIN is ${EIN}.`}
        </p>
        <p>
          <Link href='/' className={LINK_CLASSES}>
            Back to the home page
          </Link>
        </p>
      </div>
    </>
  );
}

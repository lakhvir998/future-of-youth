import Link from 'next/link';

import { PaypalButton } from '@/components/donate/paypal-button';
import { PageHero } from '@/components/sections/page-hero';
import { StructuredData } from '@/components/seo/structured-data';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import {
  DONATE_INTRO,
  IMPACT_AREAS,
  OTHER_WAYS_TO_GIVE,
} from '@/lib/content/donate';
import {
  getContactInfo,
  NONPROFIT_STATEMENT,
  TAX_DEDUCTIBLE_STATEMENT,
} from '@/lib/content/organization';
import { breadcrumbsFor, PAGES } from '@/lib/content/pages';
import { buildPageMetadata } from '@/lib/seo';
import { getPaypalUrl } from '@/lib/site';

const PAGE = PAGES['/donate'];

export const metadata = buildPageMetadata(PAGE.path);

export default function DonatePage() {
  const breadcrumbs = breadcrumbsFor(PAGE.path);
  const paypalUrl = getPaypalUrl();
  const { ein } = getContactInfo();

  return (
    <>
      <StructuredData
        path={PAGE.path}
        name={PAGE.title}
        description={PAGE.description}
        breadcrumbs={breadcrumbs}
      />
      <PageHero
        title='Support Detroit Youth'
        intro={<p>{DONATE_INTRO}</p>}
        breadcrumbs={breadcrumbs}
      >
        {paypalUrl && <PaypalButton href={paypalUrl} location='donate_page' />}
      </PageHero>

      <Section
        id='what-your-gift-supports'
        title='What Your Gift Supports'
        intro={
          <p>
            Every contribution goes toward keeping our programs free and
            accessible for Detroit students and their families.
          </p>
        }
      >
        <ul className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {IMPACT_AREAS.map((area) => (
            <li key={area.title} className='rounded-xl bg-white p-6 shadow-sm'>
              <h3 className='text-lg font-bold text-navy'>{area.title}</h3>
              <p className='mt-2 text-ink'>{area.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id='give-online' title='Give Online' tone='white'>
        <Card accent='accent' className='max-w-2xl items-start text-left'>
          {paypalUrl ? (
            <>
              <p className='text-lg text-ink'>
                Donations are processed securely by PayPal and open in a new
                tab.
              </p>
              <PaypalButton href={paypalUrl} location='donate_page' />
            </>
          ) : (
            <p className='text-lg text-ink'>
              Online giving is being set up.{' '}
              <Link
                href='/contact?topic=donation'
                className='font-semibold text-brand underline underline-offset-4'
              >
                Contact us
              </Link>{' '}
              to make a donation today.
            </p>
          )}
          <p className='text-ink'>
            <strong>{NONPROFIT_STATEMENT}</strong> {TAX_DEDUCTIBLE_STATEMENT}
            {ein && ` Our EIN is ${ein}.`}
          </p>
        </Card>
      </Section>

      <Section id='other-ways-to-give' title='Other Ways to Give'>
        <p className='max-w-3xl text-lg text-ink'>{OTHER_WAYS_TO_GIVE}</p>
        <div className='mt-6 flex flex-wrap gap-4'>
          <Link href='/contact?topic=donation' className={buttonClasses()}>
            Ask about giving
          </Link>
          <Link href='/get-involved' className={buttonClasses('secondary')}>
            Other ways to get involved
          </Link>
        </div>
      </Section>
    </>
  );
}

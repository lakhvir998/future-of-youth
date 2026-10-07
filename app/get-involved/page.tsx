import Link from 'next/link';

import { PageHero } from '@/components/sections/page-hero';
import { StructuredData } from '@/components/seo/structured-data';
import { buttonClasses } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { GRATITUDE } from '@/lib/content/about';
import {
  GET_INVOLVED_INTRO,
  INVOLVEMENT_OPTIONS,
} from '@/lib/content/get-involved';
import { breadcrumbsFor, PAGES } from '@/lib/content/pages';
import { buildPageMetadata } from '@/lib/seo';

const PAGE = PAGES['/get-involved'];

export const metadata = buildPageMetadata(PAGE.path);

export default function GetInvolvedPage() {
  const breadcrumbs = breadcrumbsFor(PAGE.path);

  return (
    <>
      <StructuredData
        path={PAGE.path}
        name={PAGE.title}
        description={PAGE.description}
        breadcrumbs={breadcrumbs}
      />
      <PageHero
        title='Get Involved'
        intro={<p>{GET_INVOLVED_INTRO}</p>}
        breadcrumbs={breadcrumbs}
      />

      <section
        aria-label='Ways to get involved'
        className='px-4 py-12 md:py-16'
      >
        <ul className='mx-auto grid max-w-6xl gap-6 md:grid-cols-2'>
          {INVOLVEMENT_OPTIONS.map((option) => (
            <li
              key={option.id}
              id={option.id}
              className='flex flex-col gap-4 rounded-2xl border-t-4 border-t-brand bg-white p-6 shadow-md'
            >
              <h2 className='text-2xl font-bold text-navy'>{option.title}</h2>
              <p className='flex-1 text-lg text-ink'>{option.description}</p>
              <Link
                href={option.cta.href}
                className={`${buttonClasses()} self-start`}
              >
                {option.cta.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Section id='thank-you' title='Thank You' tone='white'>
        <p className='max-w-3xl text-lg text-ink'>{GRATITUDE}</p>
      </Section>
    </>
  );
}

import Link from 'next/link';

import { DonateCta } from '@/components/sections/donate-cta';
import { PageHero } from '@/components/sections/page-hero';
import { StructuredData } from '@/components/seo/structured-data';
import { buttonClasses } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import {
  ABOUT_INTRO,
  GRATITUDE,
  VALUES,
  WHO_WE_SERVE,
} from '@/lib/content/about';
import {
  MISSION_PARAGRAPHS,
  MISSION_TITLE,
  VISION_PARAGRAPHS,
  VISION_TITLE,
  ORIGINAL_INTRO,
} from '@/lib/content/home';
import {
  getContactInfo,
  NONPROFIT_STATEMENT,
  TAX_DEDUCTIBLE_STATEMENT,
} from '@/lib/content/organization';
import { breadcrumbsFor, PAGES } from '@/lib/content/pages';
import { buildPageMetadata } from '@/lib/seo';

const PAGE = PAGES['/about'];

export const metadata = buildPageMetadata(PAGE.path);

export default function AboutPage() {
  const breadcrumbs = breadcrumbsFor(PAGE.path);
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
        title='About Future of the Youth'
        intro={<p>{ABOUT_INTRO}</p>}
        breadcrumbs={breadcrumbs}
      />

      <Section id='mission' title={MISSION_TITLE} tone='white'>
        <div className='max-w-3xl space-y-4 text-lg text-ink'>
          {MISSION_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section id='vision' title={VISION_TITLE}>
        <div className='max-w-3xl space-y-4 text-lg text-ink'>
          {VISION_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section id='approach' title='Our Approach' tone='white'>
        <div className='max-w-3xl space-y-4 text-lg text-ink'>
          <p>{ORIGINAL_INTRO}</p>
          <p>
            Today our programs span entrepreneurship, financial literacy,
            artificial intelligence & technology, and career & leadership
            development, so students build financial, technical, and
            professional skills together.
          </p>
        </div>
        <Link href='/programs' className={`${buttonClasses()} mt-6`}>
          Explore our programs
        </Link>
      </Section>

      <Section id='who-we-serve' title='Who We Serve'>
        <p className='max-w-3xl text-lg text-ink'>{WHO_WE_SERVE}</p>
      </Section>

      <Section id='values' title='Our Values' tone='white'>
        <ul className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {VALUES.map((value) => (
            <li key={value.title} className='rounded-xl bg-surface p-6'>
              <h3 className='text-lg font-bold text-navy'>{value.title}</h3>
              <p className='mt-2 text-ink'>{value.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id='nonprofit-status' title='Nonprofit Status'>
        <div className='max-w-3xl space-y-3 text-lg text-ink'>
          <p>
            <strong>{NONPROFIT_STATEMENT}</strong> {TAX_DEDUCTIBLE_STATEMENT}
          </p>
          {ein && <p>Employer Identification Number (EIN): {ein}</p>}
          <p>{GRATITUDE}</p>
        </div>
      </Section>

      <DonateCta />
    </>
  );
}

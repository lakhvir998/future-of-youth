import { DonateCta } from '@/components/sections/donate-cta';
import { PageHero } from '@/components/sections/page-hero';
import { ProgramCard } from '@/components/sections/program-card';
import { RequestInfoCtaSection } from '@/components/sections/request-info-cta-section';
import {
  buildProgramNode,
  StructuredData,
} from '@/components/seo/structured-data';
import { PROGRAMS_INTRO } from '@/lib/content/home';
import { breadcrumbsFor, PAGES } from '@/lib/content/pages';
import { PROGRAMS } from '@/lib/content/programs';
import { buildPageMetadata } from '@/lib/seo';

const PAGE = PAGES['/programs'];

export const metadata = buildPageMetadata(PAGE.path);

export default function ProgramsPage() {
  const breadcrumbs = breadcrumbsFor(PAGE.path);

  return (
    <>
      <StructuredData
        path={PAGE.path}
        name={PAGE.title}
        description={PAGE.description}
        breadcrumbs={breadcrumbs}
        extra={PROGRAMS.map(buildProgramNode)}
      />
      <PageHero
        title='Our Programs'
        intro={
          <p>
            Future of the Youth offers free programs that prepare Detroit
            students for the future. {PROGRAMS_INTRO}
          </p>
        }
        breadcrumbs={breadcrumbs}
      />

      <section aria-label='Program list' className='px-4 py-12 md:py-16'>
        <ul className='mx-auto grid max-w-6xl gap-6 md:grid-cols-2'>
          {PROGRAMS.map((program) => (
            <li key={program.slug}>
              <ProgramCard program={program} headingLevel='h2' />
            </li>
          ))}
        </ul>
      </section>

      <RequestInfoCtaSection />
      <DonateCta />
    </>
  );
}

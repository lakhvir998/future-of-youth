import Link from 'next/link';

import { DonateCta } from '@/components/sections/donate-cta';
import { PageHero } from '@/components/sections/page-hero';
import { ProgramDetails } from '@/components/sections/program-details';
import {
  buildProgramNode,
  StructuredData,
} from '@/components/seo/structured-data';
import { buttonClasses } from '@/components/ui/button';
import { CheckList } from '@/components/ui/check-list';
import { Section } from '@/components/ui/section';
import { AI_TECH_INTRO, AI_TOPICS } from '@/lib/content/ai-technology';
import { breadcrumbsFor, PAGES } from '@/lib/content/pages';
import { getProgramBySlug } from '@/lib/content/programs';
import { buildPageMetadata } from '@/lib/seo';
import { REQUEST_INFO_HREF } from '@/lib/site';

const PAGE = PAGES['/ai-technology'];
// Single source for the AI program's audience, outcomes, and approach.
const AI_PROGRAM = getProgramBySlug('ai-technology')!;

export const metadata = buildPageMetadata(PAGE.path);

export default function AiTechnologyPage() {
  const breadcrumbs = breadcrumbsFor(PAGE.path);

  return (
    <>
      <StructuredData
        path={PAGE.path}
        name={PAGE.title}
        description={PAGE.description}
        breadcrumbs={breadcrumbs}
        extra={[buildProgramNode(AI_PROGRAM)]}
      />
      <PageHero
        title='AI & Technology'
        intro={<p>{AI_TECH_INTRO}</p>}
        breadcrumbs={breadcrumbs}
      >
        <Link href={REQUEST_INFO_HREF} className={buttonClasses()}>
          Request free program info
        </Link>
        <Link href='/donate' className={buttonClasses('secondary')}>
          Support AI education
        </Link>
      </PageHero>

      <nav
        aria-label='On this page'
        className='border-b border-gray-200 bg-white px-4 py-4'
      >
        <ul className='mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2'>
          {AI_TOPICS.map((topic) => (
            <li key={topic.id}>
              <a
                href={`#${topic.id}`}
                className='inline-flex min-h-11 items-center rounded-md font-semibold text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-hidden'
              >
                {topic.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {AI_TOPICS.map((topic, index) => (
        <Section
          key={topic.id}
          id={topic.id}
          title={topic.title}
          tone={index % 2 === 0 ? 'surface' : 'white'}
          intro={<p>{topic.description}</p>}
        >
          <CheckList items={topic.points} className='max-w-3xl text-lg' />
        </Section>
      ))}

      <ProgramDetails program={AI_PROGRAM} />
      <DonateCta />
    </>
  );
}

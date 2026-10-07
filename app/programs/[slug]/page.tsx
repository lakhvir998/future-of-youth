import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DonateCta } from '@/components/sections/donate-cta';
import { PageHero } from '@/components/sections/page-hero';
import { ProgramDetails } from '@/components/sections/program-details';
import {
  buildProgramNode,
  StructuredData,
} from '@/components/seo/structured-data';
import { buttonClasses } from '@/components/ui/button';
import { breadcrumbsFor } from '@/lib/content/pages';
import {
  getProgramBySlug,
  getProgramDetailPages,
} from '@/lib/content/programs';
import { buildMetadata } from '@/lib/seo';
import { REQUEST_INFO_HREF } from '@/lib/site';

// Only the known programs exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProgramDetailPages().map((program) => ({ slug: program.slug }));
}

type ProgramPageProps = { params: Promise<{ slug: string }> };

async function getProgram(params: ProgramPageProps['params']) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program || !program.href.startsWith('/programs/')) notFound();
  return program;
}

export async function generateMetadata({
  params,
}: ProgramPageProps): Promise<Metadata> {
  const program = await getProgram(params);
  return buildMetadata({
    title: `${program.title} Program for Youth`,
    description: program.metaDescription,
    path: program.href,
  });
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const program = await getProgram(params);
  const breadcrumbs = breadcrumbsFor('/programs', {
    label: program.title,
    href: program.href,
  });

  return (
    <>
      <StructuredData
        path={program.href}
        name={`${program.title} Program`}
        description={program.summary}
        breadcrumbs={breadcrumbs}
        extra={[buildProgramNode(program)]}
      />
      <PageHero
        title={program.title}
        intro={
          <div className='space-y-4'>
            {program.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        }
        breadcrumbs={breadcrumbs}
      >
        <Link href={REQUEST_INFO_HREF} className={buttonClasses()}>
          Request free program info
        </Link>
        <Link href='/programs' className={buttonClasses('secondary')}>
          All programs
        </Link>
      </PageHero>

      <ProgramDetails program={program} />
      <DonateCta />
    </>
  );
}

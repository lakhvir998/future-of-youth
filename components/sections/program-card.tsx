import Link from 'next/link';

import { ProgramIcon } from '@/components/ui/program-icon';
import type { Program } from '@/lib/content/programs';

type ProgramCardProps = {
  program: Program;
  headingLevel?: 'h2' | 'h3';
};

export function ProgramCard({
  program,
  headingLevel = 'h3',
}: ProgramCardProps) {
  const Heading = headingLevel;

  return (
    <article className='flex h-full flex-col gap-3 rounded-2xl border-t-4 border-t-brand bg-white p-6 shadow-md'>
      <div className='flex items-center gap-3'>
        <span className='flex size-11 items-center justify-center rounded-xl bg-surface text-brand'>
          <ProgramIcon slug={program.slug} />
        </span>
        <Heading className='text-xl font-bold text-navy'>
          {program.title}
        </Heading>
      </div>
      <p className='flex-1 text-ink'>{program.summary}</p>
      <Link
        href={program.href}
        className='inline-flex min-h-11 items-center gap-1 self-start rounded-md font-semibold text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-hidden'
      >
        Learn more <span className='sr-only'>about {program.title}</span>
        <span aria-hidden='true'>→</span>
      </Link>
    </article>
  );
}

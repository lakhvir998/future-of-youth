import Link from 'next/link';

import { buttonClasses } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { PROGRAMS_INTRO } from '@/lib/content/home';
import { PROGRAMS } from '@/lib/content/programs';

import { ProgramCard } from './program-card';

export function ProgramsOverview() {
  return (
    <Section
      id='our-programs'
      title='Our Programs'
      tone='white'
      intro={<p>{PROGRAMS_INTRO}</p>}
    >
      <ul className='grid gap-6 md:grid-cols-2'>
        {PROGRAMS.map((program) => (
          <li key={program.slug}>
            <ProgramCard program={program} />
          </li>
        ))}
      </ul>
      <Link href='/programs' className={`${buttonClasses()} mt-8`}>
        View all programs
      </Link>
    </Section>
  );
}

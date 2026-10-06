import { CheckList } from '@/components/ui/check-list';
import { Section } from '@/components/ui/section';
import type { Program } from '@/lib/content/programs';

/** "Who it's for", "What students learn", and "How it works" for one program. */
export function ProgramDetails({ program }: { program: Program }) {
  return (
    <>
      <Section id='who-its-for' title='Who It’s For' tone='white'>
        <p className='max-w-3xl text-lg text-ink'>{program.audience}</p>
      </Section>
      <Section id='what-students-learn' title='What Students Learn'>
        <CheckList items={program.outcomes} className='max-w-3xl text-lg' />
      </Section>
      <Section id='how-it-works' title='How It Works' tone='white'>
        <CheckList items={program.approach} className='max-w-3xl text-lg' />
        <p className='mt-6 max-w-3xl text-lg text-ink'>
          All programs are free for participating families. Request program info
          to learn about current online and on-campus options.
        </p>
      </Section>
    </>
  );
}

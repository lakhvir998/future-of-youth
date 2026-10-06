import { MISSION_STATEMENT } from '@/lib/content/home';
import { Card } from '@/components/ui/card';

export function MissionSection() {
  return (
    <section
      aria-labelledby='mission-heading'
      className='flex w-full flex-col items-center bg-surface px-4 py-10 md:py-16'
    >
      <Card className='max-w-2xl'>
        <h2
          id='mission-heading'
          className='mb-4 text-center text-2xl font-bold text-navy sm:text-3xl'
        >
          Mission Statement
        </h2>
        <p className='px-1 text-center text-base text-ink sm:px-4 sm:text-lg'>
          {MISSION_STATEMENT}
        </p>
      </Card>
    </section>
  );
}

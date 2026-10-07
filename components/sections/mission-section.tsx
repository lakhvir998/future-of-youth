import { Card } from '@/components/ui/card';
import { MISSION_PARAGRAPHS, MISSION_TITLE } from '@/lib/content/home';

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
          {MISSION_TITLE}
        </h2>
        <div className='space-y-4 px-1 text-center text-base text-ink sm:px-4 sm:text-lg'>
          {MISSION_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Card>
    </section>
  );
}

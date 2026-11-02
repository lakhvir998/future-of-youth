import { Section } from '@/components/ui/section';
import { FOUNDER, FOUNDER_STORY, type Person } from '@/lib/content/leadership';

import { PersonCard } from './person-card';

type OurStorySectionProps = {
  story?: readonly string[];
  founder?: Person | null;
};

/** The story behind the organization. Hidden until the client provides it. */
export function OurStorySection({
  story = FOUNDER_STORY,
  founder = FOUNDER,
}: OurStorySectionProps) {
  if (story.length === 0 && !founder) return null;

  return (
    <Section id='our-story' title='Our Story' tone='white'>
      <div className='grid items-start gap-8 lg:grid-cols-3'>
        <div className='max-w-3xl space-y-4 text-lg text-ink lg:col-span-2'>
          {story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {founder && <PersonCard person={founder} />}
      </div>
    </Section>
  );
}

import { Card } from '@/components/ui/card';
import {
  MISSION_PARAGRAPHS,
  MISSION_TITLE,
  VISION_PARAGRAPHS,
  VISION_TITLE,
} from '@/lib/content/home';

const STATEMENTS = [
  {
    id: 'mission',
    title: MISSION_TITLE,
    paragraphs: MISSION_PARAGRAPHS,
    accent: 'brand',
  },
  {
    id: 'vision',
    title: VISION_TITLE,
    paragraphs: VISION_PARAGRAPHS,
    accent: 'accent',
  },
] as const;

/** Mission and vision side by side on wide screens, stacked on phones. */
export function MissionVisionSection() {
  return (
    <div className='bg-surface px-4 py-10 md:py-16'>
      <div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-2'>
        {STATEMENTS.map(({ id, title, paragraphs, accent }) => (
          <section key={id} aria-labelledby={`${id}-heading`}>
            <Card accent={accent} className='h-full'>
              <h2
                id={`${id}-heading`}
                className='mb-2 text-center text-2xl font-bold text-navy sm:text-3xl'
              >
                {title}
              </h2>
              <div className='space-y-4 px-1 text-center text-base text-ink sm:px-4 sm:text-lg'>
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Card>
          </section>
        ))}
      </div>
    </div>
  );
}

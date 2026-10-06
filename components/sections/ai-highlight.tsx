import Link from 'next/link';

import { buttonClasses } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { AI_TECH_INTRO, AI_TOPICS } from '@/lib/content/ai-technology';

export function AiHighlight() {
  return (
    <Section
      id='ai-technology-highlight'
      title='AI & Technology for the Next Generation'
      intro={<p>{AI_TECH_INTRO}</p>}
    >
      <ul className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {AI_TOPICS.map((topic) => (
          <li
            key={topic.id}
            className='rounded-xl border-l-4 border-l-brand bg-white p-5 shadow-sm'
          >
            <h3 className='font-bold text-navy'>{topic.title}</h3>
            <p className='mt-2 text-ink'>{topic.description}</p>
          </li>
        ))}
      </ul>
      <Link href='/ai-technology' className={`${buttonClasses()} mt-8`}>
        Explore AI & Technology
      </Link>
    </Section>
  );
}

import Link from 'next/link';

import { buttonClasses } from '@/components/ui/button';
import {
  IMPACT_GOALS,
  IMPACT_PARAGRAPHS,
  IMPACT_TITLE,
} from '@/lib/content/home';

/**
 * Goals and growth plans, not results: the client asked that this section
 * never claim outcomes that haven't been achieved yet.
 */
export function ImpactSection() {
  return (
    <section
      id='building-for-impact'
      aria-labelledby='building-for-impact-heading'
      className='border-t border-gray-200 bg-white px-4 py-12 md:py-16'
    >
      <div className='mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-5'>
        <div className='lg:col-span-3'>
          <h2
            id='building-for-impact-heading'
            className='text-2xl font-bold text-navy sm:text-3xl'
          >
            {IMPACT_TITLE}
          </h2>
          <div className='mt-4 space-y-4 text-base text-ink sm:text-lg'>
            {IMPACT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className='mt-8 flex flex-wrap gap-4'>
            <Link href='/contact?topic=sponsor' className={buttonClasses()}>
              Partner with us
            </Link>
            <Link href='/get-involved' className={buttonClasses('secondary')}>
              Ways to get involved
            </Link>
          </div>
        </div>

        <div className='rounded-2xl border-t-4 border-t-accent bg-surface p-6 lg:col-span-2'>
          <h3 className='text-lg font-bold text-navy'>Our growth goals</h3>
          <ul className='mt-4 space-y-3'>
            {IMPACT_GOALS.map((goal) => (
              <li key={goal} className='flex gap-3 text-ink'>
                {/* Arrows, not check marks: these are goals, not achievements. */}
                <svg
                  aria-hidden='true'
                  className='mt-1 size-5 shrink-0 text-brand'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2.5'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5 12h14M13 6l6 6-6 6'
                  />
                </svg>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

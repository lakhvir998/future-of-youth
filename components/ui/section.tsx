import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type SectionProps = {
  /** Used for the heading id, so the section is labelled by its heading. */
  id: string;
  title: string;
  intro?: ReactNode;
  tone?: 'surface' | 'white';
  className?: string;
  children?: ReactNode;
};

/** A page section labelled by its <h2> (one landmark name per section). */
export function Section({
  id,
  title,
  intro,
  tone = 'surface',
  className,
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        'scroll-mt-8 px-4 py-12 md:py-16',
        tone === 'white' ? 'bg-white' : 'bg-surface',
        className
      )}
    >
      <div className='mx-auto max-w-6xl'>
        <h2 id={headingId} className='text-2xl font-bold text-navy sm:text-3xl'>
          {title}
        </h2>
        {intro && (
          <div className='mt-4 max-w-3xl text-base text-ink sm:text-lg'>
            {intro}
          </div>
        )}
        {children && <div className='mt-8'>{children}</div>}
      </div>
    </section>
  );
}

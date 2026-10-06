import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type FeatureRowProps = {
  /** id for the heading, so media in the row can reference it as its name. */
  headingId: string;
  title: string;
  titleClassName: string;
  media: ReactNode;
  reverse?: boolean;
  children: ReactNode;
};

/** Media on one side, copy on the other; `reverse` flips them on desktop. */
export function FeatureRow({
  headingId,
  title,
  titleClassName,
  media,
  reverse = false,
  children,
}: FeatureRowProps) {
  return (
    <div
      className={cn(
        'relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-8 py-6 md:gap-12 md:py-12',
        reverse ? 'md:flex-row-reverse' : 'md:flex-row'
      )}
    >
      <div className='w-full overflow-hidden rounded-2xl shadow-xl md:w-1/2'>
        {media}
      </div>
      <div
        className={cn(
          'flex flex-1 flex-col gap-2 text-base text-ink sm:gap-4 sm:text-lg',
          reverse ? 'md:pr-8' : 'md:pl-8'
        )}
      >
        <h2
          id={headingId}
          className={cn('text-2xl font-bold sm:text-3xl', titleClassName)}
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

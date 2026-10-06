import type { ReactNode } from 'react';

import { Breadcrumbs, type Crumb } from '@/components/layout/breadcrumbs';

type PageHeroProps = {
  title: string;
  intro: ReactNode;
  breadcrumbs: Crumb[];
  children?: ReactNode;
};

/** Top of every subpage: breadcrumbs, the page's single <h1>, and an intro. */
export function PageHero({
  title,
  intro,
  breadcrumbs,
  children,
}: PageHeroProps) {
  return (
    <div className='border-b border-gray-200 bg-white px-4 py-10 md:py-14'>
      <div className='mx-auto max-w-6xl'>
        <Breadcrumbs items={breadcrumbs} />
        <h1 className='mt-4 text-3xl leading-tight font-bold text-navy sm:text-4xl md:text-5xl'>
          {title}
        </h1>
        <div className='mt-4 max-w-3xl text-base text-ink sm:text-lg md:text-xl'>
          {intro}
        </div>
        {children && (
          <div className='mt-6 flex flex-wrap gap-4'>{children}</div>
        )}
      </div>
    </div>
  );
}

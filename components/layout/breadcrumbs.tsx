import Link from 'next/link';

import type { Crumb } from '@/lib/content/pages';

export type { Crumb };

/** Visible breadcrumb trail; the last item is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label='Breadcrumb' className='text-sm'>
      <ol className='flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-700'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className='flex items-center gap-2'>
              {isLast ? (
                <span aria-current='page' className='font-semibold text-navy'>
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className='inline-flex min-h-6 items-center rounded-sm text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-hidden'
                  >
                    {item.label}
                  </Link>
                  <span aria-hidden='true'>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

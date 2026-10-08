import type { Metadata } from 'next';
import Link from 'next/link';

import { buttonClasses } from '@/components/ui/button';
import { NAV_ITEMS } from '@/lib/content/pages';

// Shown by the service worker when a page that hasn't been visited before is
// requested without a connection. Not in the sitemap and not indexed.
// DRAFT: client to approve.

export const metadata: Metadata = {
  title: 'You’re Offline',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className='mx-auto max-w-3xl px-4 py-16 text-center md:py-24'>
      <h1 className='text-3xl font-bold text-navy sm:text-4xl'>
        You’re offline
      </h1>
      <p className='mt-4 text-lg text-ink'>
        It looks like you’ve lost your internet connection. Pages you’ve visited
        recently are still available. Please reconnect to request program info,
        send us a message, or donate.
      </p>
      <Link href='/' className={`${buttonClasses()} mt-8`}>
        Try the home page
      </Link>
      <nav aria-label='Site pages' className='mt-10'>
        <ul className='flex flex-wrap justify-center gap-x-6 gap-y-2'>
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className='inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4 hover:text-brand-hover'
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

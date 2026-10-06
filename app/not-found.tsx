import Link from 'next/link';

import { buttonClasses } from '@/components/ui/button';
import { NAV_ITEMS } from '@/lib/content/pages';

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className='mx-auto max-w-3xl px-4 py-16 text-center md:py-24'>
      <h1 className='text-3xl font-bold text-navy sm:text-4xl'>
        Page not found
      </h1>
      <p className='mt-4 text-lg text-ink'>
        Sorry, we couldn’t find that page. It may have moved, or the link may be
        incorrect.
      </p>
      <Link href='/' className={`${buttonClasses()} mt-8`}>
        Go to the home page
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

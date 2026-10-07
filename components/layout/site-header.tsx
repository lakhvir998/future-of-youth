import Image from 'next/image';
import Link from 'next/link';

import { buttonClasses } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { NAV_ITEMS } from '@/lib/content/pages';
import { SITE_NAME, SITE_SLOGAN } from '@/lib/site';

import { MobileNav } from './mobile-nav';
import { NavLinks } from './nav-links';

// Donate is its own gold button, always visible in the header (desktop and
// mobile), so it's left out of both menus.
const LINK_ITEMS = NAV_ITEMS.filter((item) => item.path !== '/donate');

export function SiteHeader() {
  return (
    // Sticky only when the viewport is tall enough: on short screens (landscape
    // phones, 400% zoom) a pinned header would eat the content area (WCAG 1.4.10).
    <header className='relative top-0 z-40 border-b border-gray-200 bg-white shadow-sm [@media(min-height:500px)]:sticky'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4'>
        <Link
          href='/'
          className='flex min-h-11 items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-hidden'
        >
          {/* SVG is served as-is (next/image skips optimization for .svg). */}
          <Image
            src='/logo-mark.svg'
            alt=''
            width={56}
            height={56}
            preload
            className='h-12 w-auto sm:h-14'
          />
          {/* Name is visual from sm up; on 320px screens it would cause
              horizontal scrolling (WCAG 1.4.10), so it stays sr-only there. */}
          <span className='sr-only sm:not-sr-only sm:flex sm:flex-col'>
            <span className='text-lg leading-tight font-bold text-navy'>
              {SITE_NAME}
              <span className='sr-only'>, home</span>
            </span>
            <span className='text-sm leading-tight font-semibold text-brand'>
              {SITE_SLOGAN}
            </span>
          </span>
        </Link>

        <nav aria-label='Main' className='hidden lg:block'>
          <NavLinks items={LINK_ITEMS} className='flex items-center gap-1' />
        </nav>

        <div className='flex items-center gap-2'>
          <Link
            href='/donate'
            className={cn(
              buttonClasses('accent'),
              'min-h-11 px-3 py-2 text-base sm:px-6'
            )}
          >
            Donate
          </Link>
          <MobileNav items={LINK_ITEMS} />
        </div>
      </div>
    </header>
  );
}

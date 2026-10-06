'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

import type { PageInfo } from '@/lib/content/pages';

import { NavLinks } from './nav-links';

/**
 * Disclosure-pattern menu for small screens: a button with aria-expanded that
 * shows and hides the link list. Esc closes it and returns focus to the button,
 * and it closes after navigation.
 */
export function MobileNav({ items }: { items: readonly PageInfo[] }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close after client-side navigation (adjusting state during render is
  // React's recommended alternative to a state-syncing effect).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <div className='lg:hidden'>
      <button
        ref={buttonRef}
        type='button'
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className='flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-500 px-2 font-semibold text-navy focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-hidden sm:px-3'
      >
        <svg
          aria-hidden='true'
          className='size-5'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
        >
          {open ? (
            <path strokeLinecap='round' d='M6 6l12 12M18 6L6 18' />
          ) : (
            <path strokeLinecap='round' d='M4 7h16M4 12h16M4 17h16' />
          )}
        </svg>
        Menu
      </button>

      <nav
        id={menuId}
        aria-label='Main'
        hidden={!open}
        className='absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-gray-200 bg-white px-4 py-3 shadow-lg'
      >
        <NavLinks
          items={items}
          className='flex flex-col'
          linkClassName='text-lg'
          onNavigate={() => setOpen(false)}
        />
      </nav>
    </div>
  );
}

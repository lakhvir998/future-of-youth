'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/cn';
import type { PageInfo } from '@/lib/content/pages';

export function isCurrentPath(pathname: string, path: string) {
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}

type NavLinksProps = {
  items: readonly PageInfo[];
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
};

/** Navigation list that marks the current page with aria-current (WCAG 1.3.1). */
export function NavLinks({
  items,
  className,
  linkClassName,
  onNavigate,
}: NavLinksProps) {
  const pathname = usePathname() ?? '/';

  return (
    <ul className={className}>
      {items.map((item) => {
        const current = isCurrentPath(pathname, item.path);
        return (
          <li key={item.path}>
            <Link
              href={item.path}
              aria-current={current ? 'page' : undefined}
              onClick={onNavigate}
              className={cn(
                'flex min-h-11 items-center rounded-md px-3 font-semibold text-navy underline-offset-4 hover:text-brand hover:underline focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-hidden',
                current && 'text-brand underline decoration-2',
                linkClassName
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

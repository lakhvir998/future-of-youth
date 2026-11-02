'use client';

import { buttonClasses } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import { DONATE_BUTTON_LABEL } from '@/lib/content/donate';

type DonateButtonProps = {
  href: string;
  location: 'donate_page' | 'donate_cta';
  className?: string;
};

/**
 * The prominent "Donate Now" button: an outbound link to the official Zeffy
 * donation page that records a donate_click conversion (no PII).
 */
export function DonateButton({ href, location, className }: DonateButtonProps) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      onClick={() => trackEvent('donate_click', { location })}
      className={cn(
        buttonClasses('accent'),
        'px-10 py-4 text-xl tracking-wide uppercase',
        className
      )}
    >
      {DONATE_BUTTON_LABEL}{' '}
      <span className='sr-only'>(opens Zeffy in a new tab)</span>
    </a>
  );
}

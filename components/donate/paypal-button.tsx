'use client';

import { buttonClasses } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/cn';

type PaypalButtonProps = {
  href: string;
  location: 'donate_page' | 'donate_cta';
  className?: string;
};

/** Outbound PayPal link that records a donate_click conversion (no PII). */
export function PaypalButton({ href, location, className }: PaypalButtonProps) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      onClick={() => trackEvent('donate_click', { location })}
      className={cn(buttonClasses(), className)}
    >
      Donate with PayPal
      <span className='sr-only'> (opens in a new tab)</span>
    </a>
  );
}

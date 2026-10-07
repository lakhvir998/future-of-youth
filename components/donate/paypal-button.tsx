'use client';

import { buttonClasses } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import { DONATE_BUTTON_LABEL } from '@/lib/content/donate';

type PaypalButtonProps = {
  href: string;
  location: 'donate_page' | 'donate_cta';
  className?: string;
};

/**
 * The prominent "Donate Now" button: an outbound link to the official PayPal
 * donation page that records a donate_click conversion (no PII).
 */
export function PaypalButton({ href, location, className }: PaypalButtonProps) {
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
      <span className='sr-only'>(opens PayPal in a new tab)</span>
    </a>
  );
}

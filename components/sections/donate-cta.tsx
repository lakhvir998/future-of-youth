import Link from 'next/link';

import { PaypalButton } from '@/components/donate/paypal-button';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DONATE_BUTTON_LABEL,
  DONATE_PARAGRAPHS,
  DONATE_TITLE,
} from '@/lib/content/donate';
import {
  NONPROFIT_STATEMENT,
  TAX_DEDUCTIBLE_STATEMENT,
} from '@/lib/content/organization';
import { getPaypalUrl } from '@/lib/site';

/** Donation prompt used at the bottom of most pages. */
export function DonateCta() {
  const paypalUrl = getPaypalUrl();

  return (
    <section
      aria-labelledby='donate-cta-heading'
      className='flex w-full flex-col items-center bg-surface px-4 py-12 md:py-16'
    >
      <Card accent='accent' className='max-w-3xl text-center'>
        <h2
          id='donate-cta-heading'
          className='text-2xl font-bold text-navy sm:text-3xl'
        >
          {DONATE_TITLE}
        </h2>
        <div className='space-y-4 text-base text-ink sm:text-lg'>
          {DONATE_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {paypalUrl ? (
          <PaypalButton href={paypalUrl} location='donate_cta' />
        ) : (
          // Until the PayPal link is configured, send donors to the donate page,
          // which explains how to give.
          <Link
            href='/donate'
            className={`${buttonClasses('accent')} px-10 py-4 text-xl tracking-wide uppercase`}
          >
            {DONATE_BUTTON_LABEL}
          </Link>
        )}
        <p className='text-sm text-gray-700'>
          <strong>{NONPROFIT_STATEMENT}</strong> {TAX_DEDUCTIBLE_STATEMENT}
        </p>
      </Card>
    </section>
  );
}

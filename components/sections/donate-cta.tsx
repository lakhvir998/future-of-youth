import Link from 'next/link';

import { PaypalButton } from '@/components/donate/paypal-button';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  NONPROFIT_STATEMENT,
  TAX_DEDUCTIBLE_STATEMENT,
} from '@/lib/content/organization';
import { getPaypalUrl } from '@/lib/site';

/** Compact donation prompt used at the bottom of most pages. */
export function DonateCta() {
  const paypalUrl = getPaypalUrl();

  return (
    <section
      aria-labelledby='donate-cta-heading'
      className='flex w-full flex-col items-center bg-surface px-4 py-12 md:py-16'
    >
      <Card accent='accent' className='max-w-2xl text-center'>
        <h2 id='donate-cta-heading' className='text-2xl font-bold text-brand'>
          Support the Youth
        </h2>
        <p className='text-ink'>
          Help us nurture the next generation of bright minds. Your gift keeps
          our entrepreneurship, financial literacy, AI & technology, and career
          & leadership programs free for Detroit families.
        </p>
        <p className='text-sm text-gray-700'>
          {NONPROFIT_STATEMENT} {TAX_DEDUCTIBLE_STATEMENT}
        </p>
        <div className='flex flex-wrap justify-center gap-4'>
          {paypalUrl && <PaypalButton href={paypalUrl} location='donate_cta' />}
          <Link href='/donate' className={buttonClasses('secondary')}>
            See what your gift supports
          </Link>
        </div>
      </Card>
    </section>
  );
}

import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getPaypalUrl } from '@/lib/site';

export function DonateSection() {
  const paypalUrl = getPaypalUrl();

  return (
    <section
      aria-labelledby='donate-heading'
      id='paypal-section'
      className='flex w-full flex-col items-center bg-surface px-4 py-10 md:py-16'
    >
      <Card accent='accent' className='max-w-xl'>
        <h2 id='donate-heading' className='mb-2 text-2xl font-bold text-brand'>
          Support the Youth
        </h2>
        <p className='mb-4 text-center text-ink'>
          Help us nurture the next generation of bright minds. Make a
          contribution or pay for a program using PayPal.
        </p>
        {paypalUrl ? (
          <a
            href={paypalUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={buttonClasses()}
          >
            Pay with PayPal
            <span className='sr-only'> (opens in a new tab)</span>
          </a>
        ) : (
          <p className='text-sm text-gray-500'>
            Online donations are coming soon.
          </p>
        )}
      </Card>
    </section>
  );
}

import Link from 'next/link';

import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { REQUEST_INFO_HREF } from '@/lib/site';

/** Points to the request-info form on the home page. */
export function RequestInfoCtaSection() {
  return (
    <section
      aria-labelledby='request-info-cta-heading'
      className='flex w-full flex-col items-center bg-surface px-4 py-12 md:py-16'
    >
      <Card className='max-w-xl text-center'>
        <h2
          id='request-info-cta-heading'
          className='mb-2 text-2xl font-bold text-navy'
        >
          Request Free Program Info
        </h2>
        <p className='text-ink'>
          Tell us about your child and we’ll share how our free programs can
          help them grow.
        </p>
        <Link href={REQUEST_INFO_HREF} className={buttonClasses()}>
          Request Info
        </Link>
      </Card>
    </section>
  );
}

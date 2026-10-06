import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { REQUEST_INFO_ID } from '@/lib/site';

/** Points back to the single form in the hero instead of rendering a second copy. */
export function RequestInfoCtaSection() {
  return (
    <section
      aria-labelledby='request-info-cta-heading'
      className='flex w-full flex-col items-center bg-surface px-4 py-10 md:py-16'
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
        <a href={`#${REQUEST_INFO_ID}`} className={buttonClasses()}>
          Request Info
        </a>
      </Card>
    </section>
  );
}

import Image from 'next/image';

import { RequestInfoForm } from '@/components/request-info-form/request-info-form';
import { Card } from '@/components/ui/card';
import { HERO_HEADLINE, HERO_INTRO } from '@/lib/content';
import { REQUEST_INFO_ID } from '@/lib/site';

export function HeroSection() {
  return (
    <section
      aria-labelledby='hero-heading'
      className='relative flex min-h-[60vh] w-full flex-col items-center justify-center bg-surface px-4 py-8 md:py-12'
    >
      <Image
        src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=1200&h=400&facepad=3'
        alt=''
        fill
        preload
        sizes='100vw'
        className='object-cover opacity-60'
      />
      {/* Scrim: guarantees text contrast no matter what the photo shows (WCAG 1.4.3). */}
      <div aria-hidden='true' className='absolute inset-0 bg-white/50' />
      <div className='relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center'>
        <h1
          id='hero-heading'
          className='text-3xl leading-tight font-bold text-navy drop-shadow-lg sm:text-4xl md:text-5xl'
        >
          {HERO_HEADLINE}
        </h1>
        <p className='px-1 text-base font-medium text-ink sm:px-4 sm:text-lg md:text-xl'>
          {HERO_INTRO}
        </p>
        <Card
          id={REQUEST_INFO_ID}
          tabIndex={-1}
          className='mt-8 max-w-md scroll-mt-8 focus:outline-hidden sm:p-6 md:p-8'
        >
          <h2
            id='request-info-heading'
            className='mb-2 text-2xl font-bold text-navy'
          >
            Request Free Program Info
          </h2>
          <RequestInfoForm />
        </Card>
      </div>
    </section>
  );
}

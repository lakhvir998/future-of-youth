import Link from 'next/link';

import { RequestInfoForm } from '@/components/request-info-form/request-info-form';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgramIcon } from '@/components/ui/program-icon';
import { HERO_CTA_LABEL, HERO_HEADLINE, HERO_INTRO } from '@/lib/content/home';
import { PROGRAMS } from '@/lib/content/programs';
import { REQUEST_INFO_ID } from '@/lib/site';

export function HeroSection() {
  return (
    <section
      aria-labelledby='hero-heading'
      className='relative isolate overflow-hidden bg-navy px-4 py-12 md:py-16'
    >
      {/* Decorative brand glows (no stock photography). */}
      <div
        aria-hidden='true'
        className='absolute -top-32 -right-32 -z-10 size-96 rounded-full bg-brand opacity-30 blur-3xl'
      />
      <div
        aria-hidden='true'
        className='absolute -bottom-40 -left-32 -z-10 size-112 rounded-full bg-brand opacity-40 blur-3xl'
      />

      <div className='mx-auto flex max-w-4xl flex-col items-center gap-6 text-center'>
        <p className='text-sm font-semibold tracking-widest text-accent uppercase'>
          501(c)(3) nonprofit organization
        </p>
        <h1
          id='hero-heading'
          className='text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl'
        >
          {HERO_HEADLINE}
        </h1>
        <p className='max-w-3xl text-base text-blue-50 sm:text-lg md:text-xl'>
          {HERO_INTRO}
        </p>

        {/* The four program areas, visible on arrival (client direction). */}
        <ul
          aria-label='Our program areas'
          className='flex flex-wrap justify-center gap-3'
        >
          {PROGRAMS.map((program) => (
            <li key={program.slug}>
              <Link
                href={program.href}
                className='inline-flex min-h-11 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-hidden'
              >
                <ProgramIcon
                  slug={program.slug}
                  className='size-5 text-accent'
                />
                {program.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className='mt-2 flex flex-wrap justify-center gap-4'>
          {/* Written in normal case and capitalized with CSS, so screen readers
              don't spell it out letter by letter. */}
          <Link
            href='/donate'
            className={`${buttonClasses('accent')} px-10 py-4 text-xl tracking-wide uppercase`}
          >
            {HERO_CTA_LABEL}
          </Link>
          <Link href='/programs' className={buttonClasses('secondary')}>
            Explore our programs
          </Link>
        </div>

        <Card
          id={REQUEST_INFO_ID}
          tabIndex={-1}
          className='mt-8 max-w-md focus:outline-hidden sm:p-6 md:p-8'
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

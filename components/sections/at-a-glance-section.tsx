import Link from 'next/link';

import { GLANCE_ITEMS, GLANCE_TITLE } from '@/lib/content/home';

/** Who we are, what we do, who we serve, and why support us, in one scan. */
export function AtAGlanceSection() {
  return (
    <section
      aria-labelledby='at-a-glance-heading'
      className='bg-white px-4 py-12 md:py-16'
    >
      <div className='mx-auto max-w-6xl'>
        <h2
          id='at-a-glance-heading'
          className='text-2xl font-bold text-navy sm:text-3xl'
        >
          {GLANCE_TITLE}
        </h2>
        <ul className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {GLANCE_ITEMS.map((item) => (
            <li
              key={item.question}
              className='flex flex-col gap-3 border-t-4 border-t-brand pt-4'
            >
              <h3 className='text-lg font-bold text-navy'>{item.question}</h3>
              <p className='flex-1 text-ink'>{item.answer}</p>
              <Link
                href={item.link.href}
                className='inline-flex min-h-11 items-center gap-1 self-start rounded-md font-semibold text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-hidden'
              >
                {item.link.label}
                <span aria-hidden='true'>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

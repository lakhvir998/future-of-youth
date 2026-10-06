import Link from 'next/link';
import { Suspense } from 'react';

import { ContactForm } from '@/components/contact-form/contact-form';
import { ContactFormWithTopic } from '@/components/contact-form/contact-form-with-topic';
import { PageHero } from '@/components/sections/page-hero';
import { StructuredData } from '@/components/seo/structured-data';
import { Card } from '@/components/ui/card';
import {
  getContactInfo,
  NONPROFIT_STATEMENT,
  phoneHref,
} from '@/lib/content/organization';
import { breadcrumbsFor, PAGES } from '@/lib/content/pages';
import { buildPageMetadata } from '@/lib/seo';
import { REQUEST_INFO_HREF } from '@/lib/site';

const PAGE = PAGES['/contact'];

export const metadata = buildPageMetadata(PAGE.path);

const linkClasses =
  'font-semibold text-brand underline underline-offset-4 hover:text-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-hidden';

export default function ContactPage() {
  const breadcrumbs = breadcrumbsFor(PAGE.path);
  const contact = getContactInfo();

  return (
    <>
      <StructuredData
        path={PAGE.path}
        name={PAGE.title}
        description={PAGE.description}
        breadcrumbs={breadcrumbs}
      />
      <PageHero
        title='Contact Us'
        intro={
          <p>
            Have a question about our programs, volunteering, mentoring,
            sponsorships, or donations? Send us a message and we will get back
            to you.
          </p>
        }
        breadcrumbs={breadcrumbs}
      />

      <div className='mx-auto grid max-w-6xl gap-8 px-4 py-12 md:py-16 lg:grid-cols-3'>
        <section
          aria-labelledby='contact-form-heading'
          className='lg:col-span-2'
        >
          <Card className='items-stretch text-left'>
            <h2
              id='contact-form-heading'
              className='text-2xl font-bold text-navy'
            >
              Send a Message
            </h2>
            {/* The topic comes from the URL; without JS or before hydration
                the form simply starts with no topic selected. */}
            <Suspense fallback={<ContactForm />}>
              <ContactFormWithTopic />
            </Suspense>
          </Card>
        </section>

        <aside aria-labelledby='contact-details-heading' className='space-y-6'>
          <Card className='items-start text-left'>
            <h2
              id='contact-details-heading'
              className='text-xl font-bold text-navy'
            >
              Other Ways to Reach Us
            </h2>
            <ul className='space-y-3 text-ink'>
              {contact.email && (
                <li>
                  <span className='block font-semibold'>Email</span>
                  <a href={`mailto:${contact.email}`} className={linkClasses}>
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li>
                  <span className='block font-semibold'>Phone</span>
                  <a href={phoneHref(contact.phone)} className={linkClasses}>
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.address && (
                <li>
                  <span className='block font-semibold'>Mailing address</span>
                  <address className='whitespace-pre-line not-italic'>
                    {contact.address}
                  </address>
                </li>
              )}
              <li>
                <span className='block font-semibold'>
                  Parents and families
                </span>
                <Link href={REQUEST_INFO_HREF} className={linkClasses}>
                  Request free program info
                </Link>
              </li>
            </ul>
            <p className='text-sm text-gray-700'>{NONPROFIT_STATEMENT}</p>
          </Card>
        </aside>
      </div>
    </>
  );
}

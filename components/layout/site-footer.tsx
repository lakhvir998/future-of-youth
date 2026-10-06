import Image from 'next/image';
import Link from 'next/link';

import {
  getContactInfo,
  NONPROFIT_STATEMENT,
  ORGANIZATION,
  phoneHref,
} from '@/lib/content/organization';
import { NAV_ITEMS, PAGES } from '@/lib/content/pages';
import { SITE_SLOGAN } from '@/lib/site';

const linkClasses =
  'inline-flex min-h-6 items-center rounded-sm text-gray-200 underline-offset-4 hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden';

export function SiteFooter() {
  const contact = getContactInfo();

  return (
    <footer className='bg-navy text-gray-200'>
      <div className='mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3'>
        <div className='space-y-3'>
          <p className='flex items-center gap-3 text-lg font-bold text-white'>
            <Image src='/logo-mark-dark.svg' alt='' width={48} height={48} />
            {ORGANIZATION.name}
          </p>
          <p>{SITE_SLOGAN}</p>
          <p>{NONPROFIT_STATEMENT}</p>
          {contact.ein && <p>EIN: {contact.ein}</p>}
        </div>

        <nav aria-label='Footer'>
          <h2 className='mb-3 font-semibold text-white'>Explore</h2>
          <ul className='grid grid-cols-2 gap-x-6 gap-y-2'>
            {[...NAV_ITEMS, PAGES['/privacy']].map((item) => (
              <li key={item.path}>
                <Link href={item.path} className={linkClasses}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className='mb-3 font-semibold text-white'>Get in touch</h2>
          <ul className='space-y-2'>
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className={linkClasses}>
                  {contact.email}
                </a>
              </li>
            )}
            {contact.phone && (
              <li>
                <a href={phoneHref(contact.phone)} className={linkClasses}>
                  {contact.phone}
                </a>
              </li>
            )}
            {contact.address && (
              <li>
                <address className='whitespace-pre-line not-italic'>
                  {contact.address}
                </address>
              </li>
            )}
            <li>
              <Link href='/contact' className={linkClasses}>
                Send us a message
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className='border-t border-white/20'>
        <p className='mx-auto max-w-7xl px-4 py-6 text-sm'>
          © {new Date().getFullYear()} {ORGANIZATION.legalName}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

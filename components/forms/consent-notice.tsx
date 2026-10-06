import Link from 'next/link';

import { ORGANIZATION } from '@/lib/content/organization';

// DRAFT: client to approve (replaces template text that named another organization).
export function ConsentNotice() {
  return (
    <p className='mt-2 text-left text-sm text-gray-600'>
      By submitting this form, you agree that {ORGANIZATION.legalName} may
      contact you by email or phone about your request and our programs. We use
      your information only to respond to you and never sell it. You can opt out
      at any time. See our{' '}
      <Link
        href='/privacy'
        className='font-semibold text-brand underline underline-offset-4 hover:text-brand-hover'
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
}

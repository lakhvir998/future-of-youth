import Link from 'next/link';
import type { ReactNode } from 'react';

import { PageHero } from '@/components/sections/page-hero';
import { StructuredData } from '@/components/seo/structured-data';
import { getContactInfo, ORGANIZATION } from '@/lib/content/organization';
import { breadcrumbsFor, PAGES } from '@/lib/content/pages';
import { buildPageMetadata } from '@/lib/seo';

// DRAFT: client to approve. This is a starting point, not legal advice; the
// client should have it reviewed, especially the children's privacy section.

const PAGE = PAGES['/privacy'];
const LAST_UPDATED = 'October 6, 2026';

export const metadata = buildPageMetadata(PAGE.path);

function PolicySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className='space-y-3'>
      <h2 id={`${id}-heading`} className='text-2xl font-bold text-navy'>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function PrivacyPage() {
  const breadcrumbs = breadcrumbsFor(PAGE.path);
  const { email } = getContactInfo();
  const name = ORGANIZATION.legalName;

  const contactLink = email ? (
    <a
      href={`mailto:${email}`}
      className='font-semibold text-brand underline underline-offset-4'
    >
      {email}
    </a>
  ) : (
    <Link
      href='/contact'
      className='font-semibold text-brand underline underline-offset-4'
    >
      our contact form
    </Link>
  );

  return (
    <>
      <StructuredData
        path={PAGE.path}
        name={PAGE.title}
        description={PAGE.description}
        breadcrumbs={breadcrumbs}
      />
      <PageHero
        title='Privacy Policy'
        intro={<p>Last updated: {LAST_UPDATED}</p>}
        breadcrumbs={breadcrumbs}
      />

      <div className='mx-auto max-w-3xl space-y-10 px-4 py-12 text-lg text-ink md:py-16 [&_li]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2'>
        <PolicySection id='who-we-are' title='Who We Are'>
          <p>
            This website is operated by {name} (“Future of the Youth Limited,”
            “we,” “us”), a 501(c)(3) nonprofit organization based in Detroit,
            Michigan. This policy explains what information we collect through
            this website, how we use it, and the choices you have.
          </p>
        </PolicySection>

        <PolicySection
          id='information-we-collect'
          title='Information We Collect'
        >
          <p>We collect only the information you choose to send us:</p>
          <ul>
            <li>
              <strong>Program info requests:</strong> a parent or guardian’s
              name, email address, and state, and their child’s name, grade,
              academic interests, and program preferences.
            </li>
            <li>
              <strong>Contact messages:</strong> your name, email address,
              topic, and message.
            </li>
          </ul>
          <p>
            When website analytics are enabled, Google Analytics and Google Ads
            collect standard usage information such as pages visited, device and
            browser type, and approximate location, using cookies or similar
            technologies. We do not send form contents to these services.
          </p>
          <p>
            Donations are processed by PayPal on PayPal’s own website. We do not
            receive or store your payment card details.
          </p>
        </PolicySection>

        <PolicySection id='childrens-privacy' title='Children’s Privacy'>
          <p>
            Our programs serve young people, but this website is intended for
            parents, guardians, and adults. Information about a child should be
            submitted only by their parent or guardian. If you believe a child
            has sent us personal information directly, contact us and we will
            delete it.
          </p>
        </PolicySection>

        <PolicySection
          id='how-we-use-information'
          title='How We Use Information'
        >
          <ul>
            <li>To respond to your request or message</li>
            <li>
              To share information about our programs with families who ask
            </li>
            <li>To coordinate volunteers, mentors, sponsors, and donors</li>
            <li>
              To understand how the website is used and measure the
              effectiveness of our outreach
            </li>
          </ul>
        </PolicySection>

        <PolicySection id='sharing' title='How We Share Information'>
          <p>
            We do not sell or rent your personal information. We share it only
            with service providers that help us run this website and respond to
            you, such as our website host, email provider, Google (analytics and
            advertising measurement), and PayPal (donations), or when required
            by law.
          </p>
        </PolicySection>

        <PolicySection id='your-choices' title='Your Choices'>
          <ul>
            <li>You can ask us to stop contacting you at any time.</li>
            <li>
              You can ask to see, correct, or delete the information you have
              sent us.
            </li>
            <li>
              You can block or delete cookies in your browser settings, or use
              Google’s Analytics opt-out browser add-on.
            </li>
          </ul>
        </PolicySection>

        <PolicySection id='security-retention' title='Security and Retention'>
          <p>
            This website uses encrypted connections (HTTPS). We keep personal
            information only as long as needed to respond to you and run our
            programs, and we take reasonable steps to protect it.
          </p>
        </PolicySection>

        <PolicySection id='changes' title='Changes to This Policy'>
          <p>
            We may update this policy from time to time. The date at the top of
            this page shows when it was last changed.
          </p>
        </PolicySection>

        <PolicySection id='contact' title='Contact Us'>
          <p>
            Questions or requests about your privacy? Reach us at {contactLink}.
          </p>
        </PolicySection>
      </div>
    </>
  );
}

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { getSitemapPaths } from '@/app/sitemap';
import { DONATION_THANK_YOU_PATH } from '@/lib/site';
import { expectNoAxeViolations } from '@/test/axe';

import DonationThankYouPage, { metadata } from './page';

describe('Donation thank-you page', () => {
  it('is kept out of search results and the sitemap', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(getSitemapPaths()).not.toContain(DONATION_THANK_YOU_PATH);
  });

  it('thanks the donor with a single h1 and links back into the site', async () => {
    const { container } = render(<DonationThankYouPage />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { name: 'Thank You for Your Donation' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'contact us' })).toHaveAttribute(
      'href',
      '/contact?topic=donation'
    );
    expect(
      screen.getByText(
        'Future of the Youth Limited is a 501(c)(3) nonprofit organization.'
      )
    ).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });
});

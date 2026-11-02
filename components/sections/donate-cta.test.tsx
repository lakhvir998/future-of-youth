import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DonateCta } from './donate-cta';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('DonateCta', () => {
  it("shows the client's messaging and the 501(c)(3) statement", () => {
    render(<DonateCta />);

    expect(
      screen.getByRole('heading', { name: 'Invest in the Future' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Every contribution helps us create more opportunities for the next generation.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Future of the Youth Limited is a 501(c)(3) nonprofit organization.'
      )
    ).toBeInTheDocument();
  });

  it('links Donate Now to the official Zeffy donation page', () => {
    vi.stubEnv(
      'NEXT_PUBLIC_DONATION_URL',
      'https://www.zeffy.com/en-US/donation-form/test'
    );
    render(<DonateCta />);

    const button = screen.getByRole('link', { name: /donate now/i });
    expect(button).toHaveAttribute(
      'href',
      'https://www.zeffy.com/en-US/donation-form/test'
    );
    expect(button).toHaveAttribute('target', '_blank');
    expect(button).toHaveAccessibleName(
      'Donate Now (opens Zeffy in a new tab)'
    );
  });

  it('falls back to the donate page until Zeffy is configured', () => {
    render(<DonateCta />);

    expect(screen.getByRole('link', { name: 'Donate Now' })).toHaveAttribute(
      'href',
      '/donate'
    );
  });
});

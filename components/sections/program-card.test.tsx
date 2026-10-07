import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PROGRAMS } from '@/lib/content/programs';

import { ProgramCard } from './program-card';

describe('ProgramCard', () => {
  it('gives each "Learn more" link a unique, correctly spaced name', () => {
    render(<ProgramCard program={PROGRAMS[0]} />);

    expect(
      screen.getByRole('link', { name: 'Learn more about Entrepreneurship' })
    ).toHaveAttribute('href', '/programs/entrepreneurship');
  });
});

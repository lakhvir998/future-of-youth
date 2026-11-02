import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProgramStatusBadges } from './program-status';

describe('ProgramStatusBadges', () => {
  it('shows ages and that the program is operating', () => {
    render(<ProgramStatusBadges status='operating' />);
    expect(screen.getByText('Operating now')).toBeInTheDocument();
    expect(screen.getByText('Grades 2–12')).toBeInTheDocument();
  });

  it('labels planned programs as planned expansion', () => {
    render(<ProgramStatusBadges status='planned' />);
    expect(screen.getByText('Planned expansion')).toBeInTheDocument();
    expect(screen.queryByText('Operating now')).not.toBeInTheDocument();
  });
});

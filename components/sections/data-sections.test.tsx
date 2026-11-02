import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  PROGRAM_PROGRESS,
  VERIFIED_METRICS,
} from '@/lib/content/community-impact';
import {
  AWARDED_GRANTS,
  DONATION_SUMMARIES,
  PENDING_GRANT_REQUESTS,
} from '@/lib/content/financials';
import { BOARD } from '@/lib/content/leadership';
import { PROGRAMS } from '@/lib/content/programs';
import { expectNoAxeViolations } from '@/test/axe';

import { CommunityImpactSection } from './community-impact-section';
import { FinancialTransparencySection } from './financial-transparency-section';
import { LeadershipSection } from './leadership-section';
import { OurStorySection } from './our-story-section';

describe('sections that need verified client data', () => {
  it('render nothing while their data is empty', () => {
    const { container } = render(
      <>
        <CommunityImpactSection metrics={[]} progress={[]} />
        <OurStorySection story={[]} founder={null} />
        <LeadershipSection board={[]} />
        <FinancialTransparencySection
          awarded={[]}
          donations={[]}
          pending={[]}
        />
      </>
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('CommunityImpactSection', () => {
  it('shows each verified figure with its period, source, and verification date', async () => {
    const { container } = render(
      <CommunityImpactSection
        metrics={[
          {
            category: 'food-distribution',
            value: '1,250',
            label: 'meals distributed',
            period: 'January–September 2026',
            source: 'Distribution sign-in sheets',
            verifiedOn: '2026-10-15',
          },
        ]}
        progress={[
          {
            date: '2026-09-01',
            program: 'entrepreneurship',
            title: 'Fall cohort started',
            description: 'Students began building business plans.',
          },
        ]}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Food Distribution' })
    ).toBeInTheDocument();
    expect(screen.getByText('1,250')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Source: Distribution sign-in sheets · Verified Oct 15, 2026/
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Entrepreneurship/)).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });
});

describe('FinancialTransparencySection', () => {
  it('keeps awarded, donated, and pending money in separate totals', async () => {
    const { container } = render(
      <FinancialTransparencySection
        asOf='2026-10-31'
        awarded={[
          { funder: 'Foundation A', amount: 10000, awarded: '2026-03' },
        ]}
        donations={[{ period: '2026', amount: 2500 }]}
        pending={[
          {
            funder: 'Foundation B',
            amountRequested: 50000,
            submitted: '2026-08',
          },
        ]}
      />
    );

    const awarded = screen.getByRole('table', { name: /Grants Awarded/ });
    const donations = screen.getByRole('table', { name: /Donations Received/ });
    const pending = screen.getByRole('table', {
      name: /Pending Grant Requests/,
    });

    expect(
      within(awarded).getByText('$10,000', { selector: 'tfoot td' })
    ).toBeInTheDocument();
    expect(
      within(donations).getByText('$2,500', { selector: 'tfoot td' })
    ).toBeInTheDocument();
    expect(
      within(pending).getByText('$50,000', { selector: 'tfoot td' })
    ).toBeInTheDocument();
    // Pending money never shows up as awarded income.
    expect(within(awarded).queryByText('$60,000')).not.toBeInTheDocument();
    expect(within(pending).getByText(/not awarded funds/)).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });
});

describe('LeadershipSection', () => {
  it('lists board members with their roles', () => {
    render(
      <LeadershipSection
        board={[{ name: 'Jordan Smith', role: 'Board Chair', bio: 'Bio.' }]}
      />
    );
    expect(
      screen.getByRole('heading', { name: 'Jordan Smith' })
    ).toBeInTheDocument();
    expect(screen.getByText('Board Chair')).toBeInTheDocument();
  });
});

describe('client data files', () => {
  const isIsoDate = (value: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
  const programSlugs = PROGRAMS.map((program) => program.slug);

  it('every impact figure is sourced and dated', () => {
    for (const metric of VERIFIED_METRICS) {
      expect(metric.value.trim()).not.toBe('');
      expect(metric.source.trim()).not.toBe('');
      expect(metric.period.trim()).not.toBe('');
      expect(isIsoDate(metric.verifiedOn)).toBe(true);
    }
    for (const update of PROGRAM_PROGRESS) {
      expect(isIsoDate(update.date)).toBe(true);
      expect(programSlugs).toContain(update.program);
    }
  });

  it('every amount is a positive whole-dollar number', () => {
    for (const grant of AWARDED_GRANTS)
      expect(Number.isInteger(grant.amount) && grant.amount > 0).toBe(true);
    for (const d of DONATION_SUMMARIES)
      expect(Number.isInteger(d.amount) && d.amount > 0).toBe(true);
    for (const p of PENDING_GRANT_REQUESTS)
      expect(Number.isInteger(p.amountRequested) && p.amountRequested > 0).toBe(
        true
      );
  });

  it('every board member has a name, role, and bio', () => {
    for (const person of BOARD) {
      expect(person.name.trim()).not.toBe('');
      expect(person.role.trim()).not.toBe('');
      expect(person.bio.trim()).not.toBe('');
    }
  });
});

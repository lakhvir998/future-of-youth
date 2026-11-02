// Community impact: VERIFIED results only (client requirement for Ad Grants).
// The section stays hidden until at least one entry exists. Every figure needs a
// period, a source document, and the date it was verified. Never estimate,
// round up, or include planned/target numbers here; goals belong in
// "Building for Impact".

export type ImpactCategory =
  'food-distribution' | 'volunteers' | 'youth-programs';

export const IMPACT_CATEGORY_TITLES: Record<ImpactCategory, string> = {
  'food-distribution': 'Food Distribution',
  volunteers: 'Volunteers',
  'youth-programs': 'Youth Programs',
};

export type VerifiedMetric = {
  category: ImpactCategory;
  /** The number as it should appear, e.g. "1,250". */
  value: string;
  /** What was counted, e.g. "meals distributed". */
  label: string;
  /** When it happened, e.g. "January–September 2026". */
  period: string;
  /** Where the number comes from, e.g. "Distribution sign-in sheets". */
  source: string;
  /** ISO date (YYYY-MM-DD) the figure was checked against the source. */
  verifiedOn: string;
};

export type ProgressUpdate = {
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Program slug from lib/content/programs.ts. */
  program: string;
  title: string;
  description: string;
};

export const COMMUNITY_IMPACT_TITLE = 'Community Impact';

// Example of a valid entry (do not publish until verified):
// {
//   category: 'food-distribution',
//   value: '1,250',
//   label: 'meals distributed',
//   period: 'January–September 2026',
//   source: 'Distribution sign-in sheets',
//   verifiedOn: '2026-10-15',
// },
export const VERIFIED_METRICS: VerifiedMetric[] = [];

/** Milestones for operating programs (e.g. "First entrepreneurship cohort completed"). */
export const PROGRAM_PROGRESS: ProgressUpdate[] = [];

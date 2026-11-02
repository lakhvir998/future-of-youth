// Grant and financial transparency (client requirement). Awarded funding,
// donations, and pending grant requests are kept in SEPARATE lists and are
// never added together: a pending request is not income. The section stays
// hidden until at least one list has entries.

export type AwardedGrant = {
  funder: string;
  /** Whole US dollars. */
  amount: number;
  /** When awarded, e.g. "2026-03" or "March 2026". */
  awarded: string;
  purpose?: string;
};

export type DonationSummary = {
  /** e.g. "2026 (January–September)". */
  period: string;
  /** Whole US dollars received. */
  amount: number;
  note?: string;
};

export type PendingGrantRequest = {
  funder: string;
  /** Whole US dollars requested (not awarded). */
  amountRequested: number;
  /** When submitted, e.g. "2026-08". */
  submitted: string;
  purpose?: string;
};

export const FINANCIALS_TITLE = 'Financial Transparency';

/** Date the figures were last reconciled (YYYY-MM-DD), shown on the page. */
export const FINANCIALS_AS_OF: string | null = null;

export const AWARDED_GRANTS: AwardedGrant[] = [];
export const DONATION_SUMMARIES: DonationSummary[] = [];
export const PENDING_GRANT_REQUESTS: PendingGrantRequest[] = [];

export function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function sumAmounts<T>(
  items: readonly T[],
  amount: (item: T) => number
) {
  return items.reduce((total, item) => total + amount(item), 0);
}

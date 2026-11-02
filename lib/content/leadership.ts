// Founder and leadership: real people and their own words only. Sections stay
// hidden until filled in. Photos go in public/team/ (square, at least 400px).

export type Person = {
  name: string;
  /** e.g. "Founder & Executive Director", "Board Chair", "Treasurer". */
  role: string;
  bio: string;
  photo?: { src: string; alt: string };
};

/** The story behind the organization, one paragraph per entry. */
export const FOUNDER_STORY: string[] = [];

export const FOUNDER: Person | null = null;

/** Board of directors, in the order they should appear. */
export const BOARD: Person[] = [];

import { describe, expect, it } from 'vitest';

import { IMPACT_GOALS, IMPACT_PARAGRAPHS } from './home';

describe('Building for Impact copy', () => {
  // The client asked that this section describe goals and growth plans, never
  // results that haven't been achieved. Numbers are the usual way unconfirmed
  // claims creep in ("500 students served", "95% graduate").
  it('contains no statistics or counts', () => {
    for (const text of [...IMPACT_PARAGRAPHS, ...IMPACT_GOALS]) {
      expect(text).not.toMatch(/\d/);
    }
  });
});

describe('At a Glance', () => {
  // Every answer must quote copy that already appears on the site, so this
  // summary can never introduce a new or unapproved claim.
  it('only quotes existing site copy', async () => {
    const { GLANCE_ITEMS, MISSION_PARAGRAPHS } = await import('./home');
    const { WHO_WE_SERVE } = await import('./about');
    const { DONATE_PARAGRAPHS } = await import('./donate');
    const sources = [...MISSION_PARAGRAPHS, WHO_WE_SERVE, ...DONATE_PARAGRAPHS];

    for (const { answer } of GLANCE_ITEMS) {
      expect(sources.some((source) => source.includes(answer))).toBe(true);
    }
  });

  it('answers the four questions funders ask first', async () => {
    const { GLANCE_ITEMS } = await import('./home');
    expect(GLANCE_ITEMS.map((item) => item.question)).toEqual([
      'Who we are',
      'What we do',
      'Who we serve',
      'Why support us',
    ]);
  });
});

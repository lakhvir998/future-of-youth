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

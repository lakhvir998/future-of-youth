import axe from 'axe-core';
import { expect } from 'vitest';

const WCAG_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22aa',
  'best-practice',
];

/**
 * Fails the test with a readable list if axe finds WCAG 2.2 A/AA violations.
 * jsdom has no layout engine, so contrast and target-size are checked in the
 * browser audit instead (see AGENTS.md).
 */
export async function expectNoAxeViolations(container: Element) {
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: WCAG_TAGS },
    rules: {
      'color-contrast': { enabled: false },
      'target-size': { enabled: false },
      // Components are tested in isolation, outside the page's landmarks.
      region: { enabled: false },
    },
  });

  const summary = results.violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`
  );
  expect(summary).toEqual([]);
}

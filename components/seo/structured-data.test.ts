import { describe, expect, it } from 'vitest';

import { buildStructuredData, serializeJsonLd } from './structured-data';

describe('serializeJsonLd', () => {
  it('escapes "<" so values cannot close the script tag', () => {
    const json = serializeJsonLd({
      name: '</script><script>alert(1)</script>',
    });

    expect(json).not.toContain('</script>');
    expect(JSON.parse(json).name).toBe('</script><script>alert(1)</script>');
  });
});

describe('buildStructuredData', () => {
  it('describes the organization, website, and page', () => {
    const types = buildStructuredData()['@graph'].map((node) => node['@type']);

    expect(types).toEqual(['NGO', 'WebSite', 'WebPage']);
  });
});

import { describe, expect, it } from 'vitest';

import {
  buildServiceWorker,
  OFFLINE_URL,
  PRECACHE_URLS,
} from './service-worker';

describe('buildServiceWorker', () => {
  const source = buildServiceWorker('test-version');

  it('produces valid JavaScript', () => {
    // Compiles without running (it references the worker global `self`).
    expect(() => new Function(source)).not.toThrow();
  });

  it('versions its caches per deploy', () => {
    expect(source).toContain('const VERSION = "test-version";');
    expect(source).toContain("key.startsWith('fy-') && !CURRENT.includes(key)");
  });

  it('never handles form submissions, other sites, ranges, or videos', () => {
    expect(source).toContain("if (request.method !== 'GET') return;");
    expect(source).toContain(
      'if (url.origin !== self.location.origin) return;'
    );
    expect(source).toContain("if (request.headers.has('range')) return;");
    expect(source).toMatch(/mp4\|webm/);
  });

  it('precaches the home and offline pages', () => {
    expect(PRECACHE_URLS).toEqual(expect.arrayContaining(['/', OFFLINE_URL]));
  });
});

describe('/sw.js route', () => {
  it('serves JavaScript that is never cached', async () => {
    const { GET } = await import('@/app/sw.js/route');
    const response = GET();

    expect(response.headers.get('Content-Type')).toContain(
      'application/javascript'
    );
    expect(response.headers.get('Cache-Control')).toContain('no-cache');
  });
});

describe('PWA config', () => {
  it('tells browsers and the Vercel CDN to always re-check /sw.js', async () => {
    const { default: nextConfig } = await import('@/next.config');
    const rules = await nextConfig.headers!();
    const sw = rules.find((rule) => rule.source === '/sw.js');

    expect(sw?.headers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'Cache-Control',
          value: expect.stringContaining('no-cache'),
        }),
      ])
    );
  });

  it('has an installable manifest whose icons exist', async () => {
    const { existsSync } = await import('node:fs');
    const { default: manifest } = await import('@/app/manifest');
    const m = manifest();

    expect(m).toMatchObject({ id: '/', start_url: '/', display: 'standalone' });
    const sizes = m.icons!.map((icon) => icon.sizes);
    expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
    expect(m.icons!.some((icon) => icon.purpose === 'maskable')).toBe(true);
    for (const icon of m.icons!) {
      expect(existsSync(`public${icon.src}`)).toBe(true);
    }
  });
});

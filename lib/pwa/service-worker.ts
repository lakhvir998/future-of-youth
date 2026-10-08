// Service worker source, served by app/sw.js/route.ts at /sw.js (root scope).
// See that route for the caching rules.

/**
 * Unique per deploy: on Vercel the deployment ID, so each deploy installs a
 * fresh worker and deletes the previous deploy's caches.
 */
export const SW_VERSION =
  process.env.VERCEL_DEPLOYMENT_ID ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  `build-${Date.now()}`;

export const OFFLINE_URL = '/offline';

/** Visited on install so the shell works offline from the first visit. */
export const PRECACHE_URLS = [
  '/',
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/logo-mark.svg',
  '/icons/icon-192.png',
];

/** Upper bound per runtime cache, so storage can't grow without limit. */
const MAX_ENTRIES = 60;

export function buildServiceWorker(version: string) {
  return `/* Future of the Youth service worker. Version: ${version} */
const VERSION = ${JSON.stringify(version)};
const PRECACHE = 'fy-precache-' + VERSION;
const PAGES = 'fy-pages-' + VERSION;
const STATIC = 'fy-static-' + VERSION;
const IMAGES = 'fy-images-' + VERSION;
const CURRENT = [PRECACHE, PAGES, STATIC, IMAGES];
const OFFLINE_URL = ${JSON.stringify(OFFLINE_URL)};
const PRECACHE_URLS = ${JSON.stringify(PRECACHE_URLS)};
const MAX_ENTRIES = ${MAX_ENTRIES};

// The stylesheet and fonts are content-hashed, so their URLs are read from the
// cached home page; that way offline pages render styled from the first visit.
async function precacheShellAssets(cache) {
  const home = await cache.match('/');
  if (!home) return;
  const html = await home.text();
  const assets = new Set();
  for (const match of html.matchAll(/(?:href|src)="(\\/_next\\/static\\/[^"]+\\.(?:css|woff2))"/g)) {
    assets.add(match[1]);
  }
  await cache.addAll([...assets]);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then(async (cache) => {
        await cache.addAll(PRECACHE_URLS);
        await precacheShellAssets(cache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('fy-') && !CURRENT.includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

async function trim(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (const key of keys.slice(0, Math.max(0, keys.length - MAX_ENTRIES))) {
    await cache.delete(key);
  }
}

async function put(cacheName, request, response) {
  // Only cache complete, successful, same-origin responses.
  if (!response || response.status !== 200 || response.type !== 'basic') return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  trim(cacheName);
}

async function networkFirst(request, isNavigation) {
  try {
    const response = await fetch(request);
    put(PAGES, request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (isNavigation) {
      const offline = await caches.match(OFFLINE_URL);
      if (offline) return offline;
    }
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  put(STATIC, request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const refresh = fetch(request)
    .then((response) => {
      put(IMAGES, request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || refresh;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/sw.js') return;
  if (/\\.(mp4|webm|mov|m4v)$/i.test(url.pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, true));
    return;
  }
  // Next.js client navigations fetch RSC payloads for the next page.
  if (request.headers.get('RSC') === '1' || url.searchParams.has('_rsc')) {
    event.respondWith(networkFirst(request, false));
    return;
  }
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (
    request.destination === 'image' ||
    url.pathname.startsWith('/_next/image') ||
    url.pathname.startsWith('/icons/')
  ) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
`;
}

#!/usr/bin/env node
// Crawls the production build and fails if any internal link, asset, or
// #anchor is broken. Run after `next build`: `npm run check:links`.
// Absolute URLs on NEXT_PUBLIC_SITE_URL (canonical, Open Graph) are checked
// against the local server. Other external links (e.g. PayPal) are listed but
// not fetched.

import { spawn } from 'node:child_process';

const PORT = Number(process.env.LINK_CHECK_PORT ?? 4010);
const BASE = `http://localhost:${PORT}`;
const SITE_ORIGINS = new Set(
  [process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000']
    .filter(Boolean)
    .map((url) => new URL(url).origin)
);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Run next directly in its own process group so the whole server tree can be
// stopped when the crawl ends.
const server = spawn('node_modules/.bin/next', ['start', '-p', String(PORT)], {
  stdio: ['ignore', 'ignore', 'inherit'],
  detached: true,
});

function stopServer() {
  try {
    process.kill(-server.pid, 'SIGTERM');
  } catch {
    // Already stopped.
  }
}

async function waitForServer() {
  for (let i = 0; i < 120; i++) {
    try {
      await fetch(BASE);
      return;
    } catch {
      await sleep(500);
    }
  }
  throw new Error(`Server did not start on ${BASE}`);
}

/** Resolves a reference to a local URL, or null if it's truly external. */
function resolveLocal(ref, fromPage) {
  const url = new URL(ref, fromPage);
  if (url.origin === BASE) return url;
  if (SITE_ORIGINS.has(url.origin)) {
    return new URL(`${url.pathname}${url.search}${url.hash}`, BASE);
  }
  return null;
}

function extract(html, pattern) {
  return [...html.matchAll(pattern)].map((match) =>
    match[1].replaceAll('&amp;', '&')
  );
}

async function main() {
  await waitForServer();

  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const queue = extract(sitemap, /<loc>([^<]+)<\/loc>/g).map(
    (loc) => `${BASE}${new URL(loc).pathname}`
  );

  const statuses = new Map(); // url -> HTTP status
  const html = new Map(); // url -> body, for HTML pages
  const crawled = new Set();
  const anchors = []; // { from, target, id }
  const external = new Set();
  const errors = [];

  async function check(url) {
    if (!statuses.has(url)) {
      const res = await fetch(url);
      statuses.set(url, res.status);
      if (res.ok && res.headers.get('content-type')?.includes('text/html')) {
        html.set(url, await res.text());
      } else {
        // Don't download images/videos; just free the connection.
        await res.body?.cancel();
      }
    }
    return statuses.get(url);
  }

  while (queue.length) {
    const page = queue.shift();
    if (crawled.has(page)) continue;
    crawled.add(page);

    const code = await check(page);
    if (code !== 200) {
      errors.push(`${page} returned ${code}`);
      continue;
    }

    const body = html.get(page) ?? '';
    const refs = [
      ...extract(body, /<a\b[^>]*\shref="([^"]+)"/g),
      ...extract(body, /<link\b[^>]*\shref="([^"]+)"/g),
      ...extract(body, /<meta\b[^>]*\scontent="(https?:\/\/[^"]+)"/g),
      ...extract(body, /\s(?:src|poster)="([^"]+)"/g),
    ];

    for (const ref of refs) {
      if (/^(mailto:|tel:|data:|blob:|javascript:)/.test(ref)) continue;
      const url = resolveLocal(ref, page);
      if (!url) {
        external.add(ref);
        continue;
      }

      const target = `${url.origin}${url.pathname}${url.search}`;
      if (url.hash.length > 1) {
        anchors.push({
          from: page,
          target,
          id: decodeURIComponent(url.hash.slice(1)),
        });
      }

      const status = await check(target);
      if (status !== 200) errors.push(`${page} → ${ref} returned ${status}`);
      else if (html.has(target)) queue.push(target);
    }
  }

  for (const { from, target, id } of anchors) {
    if (!(html.get(target) ?? '').includes(`id="${id}"`)) {
      errors.push(`${from} → ${target}#${id}: no element with that id`);
    }
  }

  console.log(
    `Checked ${statuses.size} internal URLs across ${crawled.size} pages.`
  );
  if (external.size) {
    console.log(
      `External links (not fetched):\n  ${[...external].join('\n  ')}`
    );
  }
  if (errors.length) {
    console.error(
      `\n${errors.length} broken link(s):\n  ${errors.join('\n  ')}`
    );
    process.exitCode = 1;
  } else {
    console.log('No broken links or missing anchors.');
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    stopServer();
    process.exit();
  });

#!/usr/bin/env node
// Regenerates every raster logo/icon from the SVG sources in brand/.
// Requires Google Chrome (set CHROME_PATH if it isn't in the default location).
// Usage: npm run brand:build

import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const brand = (file) => path.join(root, 'brand', file);
const out = (file) => path.join(root, file);
const tmp = mkdtempSync(path.join(tmpdir(), 'brand-'));
const chrome =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function screenshot(htmlFile, width, height, target) {
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--default-background-color=00000000',
      '--force-device-scale-factor=1',
      '--allow-file-access-from-files',
      `--window-size=${width},${height}`,
      `--screenshot=${target}`,
      `file://${htmlFile}`,
    ],
    { stdio: 'ignore' }
  );
}

/** Renders an SVG to a PNG of the given size, optionally centered with padding. */
function renderSvg(svg, size, target, { contentWidth = size } = {}) {
  const html = path.join(tmp, 'render.html');
  writeFileSync(
    html,
    `<!doctype html><style>html,body{margin:0;background:transparent}div{width:${size}px;height:${size}px;display:grid;place-items:center}img{width:${contentWidth}px}</style><div><img src="file://${brand(svg)}"></div>`
  );
  screenshot(html, size, size, target);
}

/** Packs PNGs into a .ico (PNG-compressed entries, supported by all modern browsers). */
function writeIco(pngs, target) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  writeFileSync(
    target,
    Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)])
  );
}

const jobs = [
  ['icon-tile-light.svg', 512, 'app/icon.png'],
  ['icon-square.svg', 180, 'app/apple-icon.png'],
  ['icon-tile-light.svg', 192, 'public/icons/icon-192.png'],
  ['icon-tile-light.svg', 512, 'public/icons/icon-512.png'],
  ['icon-maskable.svg', 512, 'public/icons/icon-maskable-512.png'],
];
for (const [svg, size, target] of jobs) renderSvg(svg, size, out(target));

// Square, transparent logo for structured data (Google wants ≥112px raster).
renderSvg('logo-mark.svg', 512, out('public/logo-512.png'), {
  contentWidth: 448,
});

const icoSizes = [16, 32, 48];
writeIco(
  icoSizes.map((size) => {
    const file = path.join(tmp, `favicon-${size}.png`);
    renderSvg('icon-tile-light.svg', size, file);
    return { size, data: readFileSync(file) };
  }),
  out('app/favicon.ico')
);

screenshot(brand('og-image.html'), 1200, 630, out('app/opengraph-image.png'));
copyFileSync(out('app/opengraph-image.png'), out('app/twitter-image.png'));

// SVG sources served as-is.
copyFileSync(brand('icon-tile.svg'), out('app/icon.svg'));
copyFileSync(brand('logo-mark.svg'), out('public/logo-mark.svg'));
copyFileSync(brand('logo-mark-dark.svg'), out('public/logo-mark-dark.svg'));

console.log('Brand assets rebuilt from brand/*.svg');

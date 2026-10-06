#!/usr/bin/env python3
"""Writes every brand SVG from one geometry (logo "AI Chip").

An AI processor chip with circuit traces; inside, a young person made of
connected network nodes, arms raised (a "Y" for Youth), with a gold AI sparkle
for a head: young people at the heart of AI and technology.
Run `python3 brand/generate-svgs.py && npm run brand:build` after changes.
"""
from pathlib import Path

HERE = Path(__file__).parent
NAVY, BLUE, GOLD, WHITE, LIGHT_BLUE = '#003a70', '#0072ce', '#ffd200', '#ffffff', '#5aaeff'

# Artwork bounds: x/y 61–451 (center 256, 256).
CENTER_Y = 256
PIN_OFFSETS = (188, 256, 324)


def sparkle(cx, cy, s, fill=GOLD):
    return (f'<path d="M{cx} {cy - s}Q{cx} {cy} {cx + s} {cy}Q{cx} {cy} {cx} {cy + s}'
            f'Q{cx} {cy} {cx - s} {cy}Q{cx} {cy} {cx} {cy - s}Z" fill="{fill}"/>')


def mark(chip=NAVY, trace=BLUE, figure=WHITE, ring=LIGHT_BLUE):
    """The mark's shapes. Classes let the adaptive favicon recolor them."""
    traces = ''.join(f'M{k} 116V80M{k} 396v36M116 {k}H80M396 {k}h36' for k in PIN_OFFSETS)
    nodes = ''.join(f'<circle cx="{x}" cy="{y}" r="11"/>'
                    for k in PIN_OFFSETS for x, y in ((k, 72), (k, 440), (72, k), (440, k)))
    return f'''<path class="trace" d="{traces}" stroke="{trace}" stroke-width="12" stroke-linecap="round" fill="none"/>
  <g class="node" fill="{trace}">{nodes}</g>
  <rect class="chip" x="116" y="116" width="280" height="280" rx="56" fill="{chip}"/>
  <rect x="140" y="140" width="232" height="232" rx="36" fill="none" stroke="{ring}" stroke-width="4" opacity=".5"/>
  <path d="M196 214 256 274M316 214 256 274M256 274v66" stroke="{figure}" stroke-width="14" stroke-linecap="round" fill="none"/>
  <g fill="{figure}"><circle cx="196" cy="214" r="20"/><circle cx="316" cy="214" r="20"/><circle cx="256" cy="274" r="20"/><circle cx="256" cy="340" r="20"/></g>
  {sparkle(256, 168, 40)}'''


def centered(scale, body):
    tx, ty = 256 - 256 * scale, 256 - CENTER_Y * scale
    return f'<g transform="translate({tx:.1f} {ty:.1f}) scale({scale})">\n  {body}\n  </g>'


def svg(body, view_box='0 0 512 512', title='Future of the Youth'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}" role="img" '
            f'aria-label="{title}">\n  <title>{title}</title>\n  {body}\n</svg>\n')


MARK_VIEWBOX = '48 48 416 416'

files = {
    # Standalone marks (header, footer, share image).
    'logo-mark.svg': svg(mark(), MARK_VIEWBOX),
    'logo-mark-dark.svg': svg(mark(chip=BLUE, trace=LIGHT_BLUE, ring=WHITE), MARK_VIEWBOX),
    # Favicon tile that follows the browser's light/dark theme.
    'icon-tile.svg': svg(f'''<style>
    .tile {{ fill: {WHITE}; }}
    @media (prefers-color-scheme: dark) {{
      .tile {{ fill: {NAVY}; }}
      .chip {{ fill: {BLUE}; }}
      .trace {{ stroke: {LIGHT_BLUE}; }}
      .node {{ fill: {LIGHT_BLUE}; }}
    }}
  </style>
  <rect class="tile" width="512" height="512" rx="112"/>
  {centered(0.9, mark())}'''),
    # Raster sources: light tile, full-bleed square (Apple), maskable (PWA safe zone).
    'icon-tile-light.svg': svg(f'<rect fill="{WHITE}" width="512" height="512" rx="112"/>\n  {centered(0.9, mark())}'),
    'icon-square.svg': svg(f'<rect fill="{WHITE}" width="512" height="512"/>\n  {centered(0.84, mark())}'),
    'icon-maskable.svg': svg(f'<rect fill="{WHITE}" width="512" height="512"/>\n  {centered(0.66, mark())}'),
}

for name, content in files.items():
    (HERE / name).write_text(content)
print(f'Wrote {len(files)} SVGs to {HERE}')

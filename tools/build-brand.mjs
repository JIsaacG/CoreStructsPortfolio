/**
 * Derives every brand asset the site ships from the official exports in
 * `assets/source/`. Run with `npm run build:brand`.
 *
 * The source isotype is only 362x422px, too small to headline a retina hero, so
 * it is traced back to vector geometry (it is drawn purely from straight
 * isometric edges, so the trace is exact -- fidelity is asserted below). Icons
 * and the Open Graph card are then rendered from that vector rather than
 * upscaled from the raster.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { alphaBounds, crop, decodePNG, encodePNG, resize } from "./lib/png.mjs";
import { components, contours, fitGradient, simplify, toPathData, verify } from "./lib/trace.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "assets", "source");
const BRAND = join(ROOT, "assets", "brand");

/** RDP tolerance that collapses the antialiased pixel staircase of a 30deg edge. */
const TRACE_EPSILON = 1.6;
/** Guard rail: a regression in tracing should fail the build, not ship quietly. */
const MIN_FIDELITY = 0.98;

const BACKGROUND = [8, 11, 18];
/** Flat faces are snapped to these when they land within rounding distance,
    so the site's palette and the artwork use literally the same values. */
const BRAND_COLORS = ["#253880", "#3898d4"];
const SNAP_DISTANCE = 12;

const log = (...args) => console.log("  ", ...args);

function snapToBrand(hex) {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  for (const brand of BRAND_COLORS) {
    const target = [1, 3, 5].map((i) => parseInt(brand.slice(i, i + 2), 16));
    const distance = Math.hypot(...rgb.map((c, i) => c - target[i]));
    if (distance <= SNAP_DISTANCE) return brand;
  }
  return hex;
}

/* ------------------------------------------------------------------ tracing */

/**
 * Trace the isotype into three face polygons.
 * @returns {{ width:number, height:number, faces: {name:string,rings:any[],fill:string,gradient?:object}[] }}
 */
function traceIsotype() {
  const source = decodePNG(join(SOURCE, "ISOTIPO_PRINCIPAL_PNG.png"));
  const parts = components(source);
  if (parts.length !== 3) throw new Error(`expected 3 faces, found ${parts.length}`);

  // Largest first: the top rhombus, then the cyan "S" face, then the navy "C".
  const names = ["top", "right", "left"];
  const faces = parts.map((part, i) => {
    const rings = contours(part.mask, source.width, source.height).map((ring) =>
      simplify(ring, TRACE_EPSILON),
    );
    const fidelity = verify(part.mask, rings, source.width, source.height);
    if (fidelity < MIN_FIDELITY) {
      throw new Error(`${names[i]} face traced at IoU ${fidelity.toFixed(4)}, below ${MIN_FIDELITY}`);
    }
    const points = rings.reduce((sum, ring) => sum + ring.length, 0);
    log(`face ${names[i].padEnd(5)} ${String(points).padStart(3)} points  IoU ${fidelity.toFixed(4)}`);

    return {
      name: names[i],
      rings,
      fill: snapToBrand(`#${part.color.map((c) => c.toString(16).padStart(2, "0")).join("")}`),
      // Only the top face carries the navy -> cyan blend; the sides are flat.
      gradient: names[i] === "top" ? fitGradient(part.mask, source) : undefined,
    };
  });

  return { width: source.width, height: source.height, faces };
}

function isotypeSVG({ width, height, faces }) {
  const top = faces.find((f) => f.name === "top");
  const { from, to, stops } = top.gradient;
  const n = (v) => Number(v.toFixed(1));

  const gradient = [
    `<linearGradient id="cs-face-top" gradientUnits="userSpaceOnUse"`,
    ` x1="${n(from[0])}" y1="${n(from[1])}" x2="${n(to[0])}" y2="${n(to[1])}">`,
    stops.map((s) => `<stop offset="${n(s.offset * 100)}%" stop-color="${s.color}"/>`).join(""),
    `</linearGradient>`,
  ].join("");

  const paths = faces
    .map((face) => {
      const fill = face.name === "top" ? "url(#cs-face-top)" : face.fill;
      return `<path class="cs-face cs-face--${face.name}" fill="${fill}" d="${toPathData(face.rings)}"/>`;
    })
    .join("");

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="CoreStruct">`,
    `<defs>${gradient}</defs>`,
    paths,
    `</svg>`,
  ].join("");
}

/* ------------------------------------------------------- vector rasteriser */

/** Signed-area sample: supersampled even-odd coverage of one ring set. */
function coverage(rings, width, height, scale, offsetX, offsetY, samples = 4) {
  const cov = new Float32Array(width * height);
  const step = 1 / samples;
  const edges = [];
  for (const ring of rings) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length];
      edges.push([
        a[0] * scale + offsetX, a[1] * scale + offsetY,
        b[0] * scale + offsetX, b[1] * scale + offsetY,
      ]);
    }
  }

  for (let y = 0; y < height; y++) {
    for (let s = 0; s < samples; s++) {
      const scan = y + (s + 0.5) * step;
      const crossings = [];
      for (const [ax, ay, bx, by] of edges) {
        if ((ay <= scan && by > scan) || (by <= scan && ay > scan)) {
          crossings.push(ax + ((scan - ay) / (by - ay)) * (bx - ax));
        }
      }
      crossings.sort((p, q) => p - q);
      for (let i = 0; i + 1 < crossings.length; i += 2) {
        const from = crossings[i], to = crossings[i + 1];
        for (let x = Math.max(0, Math.floor(from)); x < Math.min(width, Math.ceil(to)); x++) {
          cov[y * width + x] += Math.max(0, Math.min(x + 1, to) - Math.max(x, from)) * step;
        }
      }
    }
  }
  return cov;
}

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** Sample a fitted multi-stop gradient at position t (0..1). */
function sampleGradient(stops, t) {
  const clamped = Math.max(0, Math.min(1, t));
  let i = 0;
  while (i < stops.length - 2 && stops[i + 1].offset < clamped) i++;
  const a = stops[i], b = stops[i + 1] ?? a;
  const span = b.offset - a.offset || 1;
  const local = Math.max(0, Math.min(1, (clamped - a.offset) / span));
  const ca = hexToRgb(a.color), cb = hexToRgb(b.color);
  return [0, 1, 2].map((c) => ca[c] + (cb[c] - ca[c]) * local);
}

/**
 * Render the traced isotype into an RGBA bitmap at any size.
 * @param {ReturnType<typeof traceIsotype>} art
 * @param {{ size:number, padding?:number, background?:number[]|null, mono?:number[] }} options
 */
function renderIsotype(art, { size, padding = 0.12, background = null, mono = null }) {
  const canvas = Buffer.alloc(size * size * 4);
  if (background) {
    for (let i = 0; i < size * size; i++) {
      canvas[i * 4] = background[0];
      canvas[i * 4 + 1] = background[1];
      canvas[i * 4 + 2] = background[2];
      canvas[i * 4 + 3] = 255;
    }
  }

  const inner = size * (1 - padding * 2);
  const scale = Math.min(inner / art.width, inner / art.height);
  const offsetX = (size - art.width * scale) / 2;
  const offsetY = (size - art.height * scale) / 2;

  // Painter's order: sides first, top rhombus last, matching the source artwork.
  const order = ["left", "right", "top"];
  for (const name of order) {
    const face = art.faces.find((f) => f.name === name);
    const cov = coverage(face.rings, size, size, scale, offsetX, offsetY);
    const flat = mono ?? hexToRgb(face.fill);
    const gradient = !mono && face.gradient;
    const axis = gradient && {
      x1: gradient.from[0] * scale + offsetX,
      y1: gradient.from[1] * scale + offsetY,
      dx: (gradient.to[0] - gradient.from[0]) * scale,
      dy: (gradient.to[1] - gradient.from[1]) * scale,
    };
    const axisLenSq = axis ? axis.dx * axis.dx + axis.dy * axis.dy : 0;

    for (let i = 0; i < size * size; i++) {
      const alpha = Math.min(1, cov[i]);
      if (alpha <= 0) continue;
      let colour = flat;
      if (axis) {
        const x = i % size, y = (i - (i % size)) / size;
        const t = ((x - axis.x1) * axis.dx + (y - axis.y1) * axis.dy) / axisLenSq;
        colour = sampleGradient(gradient.stops, t);
      }
      const o = i * 4;
      const dstA = canvas[o + 3] / 255;
      const outA = alpha + dstA * (1 - alpha);
      for (let c = 0; c < 3; c++) {
        canvas[o + c] = Math.round((colour[c] * alpha + canvas[o + c] * dstA * (1 - alpha)) / outA);
      }
      canvas[o + 3] = Math.round(outA * 255);
    }
  }
  return { width: size, height: size, data: canvas };
}

/* ------------------------------------------------------------- compositing */

/** Alpha-composite `src` onto `dst` at (x, y). */
function composite(dst, src, x, y) {
  for (let sy = 0; sy < src.height; sy++) {
    const dy = y + sy;
    if (dy < 0 || dy >= dst.height) continue;
    for (let sx = 0; sx < src.width; sx++) {
      const dx = x + sx;
      if (dx < 0 || dx >= dst.width) continue;
      const s = (sy * src.width + sx) * 4;
      const d = (dy * dst.width + dx) * 4;
      const a = src.data[s + 3] / 255;
      if (!a) continue;
      for (let c = 0; c < 3; c++) {
        dst.data[d + c] = Math.round(src.data[s + c] * a + dst.data[d + c] * (1 - a));
      }
      dst.data[d + 3] = 255;
    }
  }
}

/** The site background: near-black with two soft brand-coloured radial washes. */
function brandBackdrop(width, height) {
  const data = Buffer.alloc(width * height * 4);
  const washes = [
    { x: 0.78, y: 0.18, radius: 0.55, color: [56, 152, 212], strength: 0.3 },
    { x: 0.12, y: 0.85, radius: 0.6, color: [37, 56, 128], strength: 0.35 },
  ];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      let [r, g, b] = BACKGROUND;
      for (const wash of washes) {
        const dx = (x / width - wash.x) * (width / height);
        const dy = y / height - wash.y;
        const t = Math.max(0, 1 - Math.hypot(dx, dy) / wash.radius);
        const k = t * t * wash.strength;
        r += (wash.color[0] - r) * k;
        g += (wash.color[1] - g) * k;
        b += (wash.color[2] - b) * k;
      }
      data[o] = Math.round(r); data[o + 1] = Math.round(g); data[o + 2] = Math.round(b); data[o + 3] = 255;
    }
  }
  return { width, height, data };
}

/* -------------------------------------------------------------------- main */

function trimmedCopy(sourceFile, targetFile, targetWidth) {
  const image = decodePNG(join(SOURCE, sourceFile));
  const trimmed = crop(image, alphaBounds(image));
  const height = Math.round((trimmed.height / trimmed.width) * targetWidth);
  const out = resize(trimmed, targetWidth, height);
  const bytes = encodePNG(out, join(BRAND, targetFile));
  log(`${targetFile.padEnd(30)} ${out.width}x${out.height}  ${(bytes / 1024).toFixed(1)} KB`);
  return out;
}

/** Split the horizontal lockup at its widest transparent gutter: cube | wordmark. */
function wordmarkFrom(sourceFile, targetFile, targetWidth) {
  const image = decodePNG(join(SOURCE, sourceFile));
  const box = alphaBounds(image);
  const empty = [];
  for (let x = box.x; x < box.x + box.width; x++) {
    let ink = 0;
    for (let y = box.y; y < box.y + box.height; y++) {
      if (image.data[(y * image.width + x) * 4 + 3] > 8) { ink = 1; break; }
    }
    if (!ink) empty.push(x);
  }

  let best = { start: 0, end: 0 };
  for (let i = 0; i < empty.length; i++) {
    let j = i;
    while (j + 1 < empty.length && empty[j + 1] === empty[j] + 1) j++;
    if (empty[j] - empty[i] > best.end - best.start) best = { start: empty[i], end: empty[j] };
    i = j;
  }
  if (best.end === best.start) throw new Error(`${sourceFile}: no gutter between isotype and wordmark`);

  const region = crop(image, {
    x: best.end + 1,
    y: box.y,
    width: box.x + box.width - best.end - 1,
    height: box.height,
  });
  const tight = crop(region, alphaBounds(region));
  const height = Math.round((tight.height / tight.width) * targetWidth);
  const out = resize(tight, targetWidth, height);
  const bytes = encodePNG(out, join(BRAND, targetFile));
  log(`${targetFile.padEnd(30)} ${out.width}x${out.height}  ${(bytes / 1024).toFixed(1)} KB`);
  return out;
}

function main() {
  mkdirSync(BRAND, { recursive: true });

  console.log("\nTracing isotype");
  const art = traceIsotype();
  const svg = isotypeSVG(art);
  writeFileSync(join(BRAND, "isotipo.svg"), svg);
  log(`isotipo.svg`.padEnd(30) + `${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);

  console.log("\nLockups");
  trimmedCopy("LOGO_HORIZONTAL_BLANCO.png", "logo-horizontal-white.png", 640);
  wordmarkFrom("LOGO_HORIZONTAL_BLANCO.png", "wordmark-white.png", 720);

  console.log("\nIcons (rendered from vector)");
  for (const size of [192, 512]) {
    const icon = renderIsotype(art, { size, padding: 0.14 });
    const bytes = encodePNG(icon, join(BRAND, `icon-${size}.png`));
    log(`icon-${size}.png`.padEnd(30) + `${size}x${size}  ${(bytes / 1024).toFixed(1)} KB`);
  }
  const maskable = renderIsotype(art, { size: 512, padding: 0.22, background: BACKGROUND });
  log(`icon-maskable-512.png`.padEnd(30) + `512x512  ${(encodePNG(maskable, join(BRAND, "icon-maskable-512.png")) / 1024).toFixed(1)} KB`);
  const apple = renderIsotype(art, { size: 180, padding: 0.16, background: BACKGROUND });
  log(`apple-touch-icon.png`.padEnd(30) + `180x180  ${(encodePNG(apple, join(BRAND, "apple-touch-icon.png")) / 1024).toFixed(1)} KB`);

  console.log("\nOpen Graph card");
  const card = brandBackdrop(1200, 630);
  const mark = renderIsotype(art, { size: 300, padding: 0 });
  const wordmark = decodePNG(join(BRAND, "wordmark-white.png"));
  const wordWidth = 520;
  const word = resize(wordmark, wordWidth, Math.round((wordmark.height / wordmark.width) * wordWidth));
  composite(card, mark, Math.round((1200 - mark.width) / 2), 150);
  composite(card, word, Math.round((1200 - word.width) / 2), 150 + mark.height + 36);
  const ogBytes = encodePNG(card, join(BRAND, "og-card.png"));
  log(`og-card.png`.padEnd(30) + `1200x630  ${(ogBytes / 1024).toFixed(1)} KB`);

  console.log("\nDone.\n");
}

main();

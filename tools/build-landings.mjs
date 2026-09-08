/**
 * Renders the three landing demos and the index that introduces them into
 * `demos/landing/`: `npm run build:landing`.
 *
 *   index.html    the three projects, as the portfolio presents them
 *   nexora.html   a corporate firm — authority, editorial, one appointment
 *   velora.html   a clinic — one booking, and a widget that takes it
 *   orbita.html   a distributor — catalogue, comparison, configurator, quote
 *
 * They are three companies rather than three colour schemes: each ships its own
 * bundle, its own type pairing and its own interactive pieces, and shares only
 * the reset, the reveal system and the CoreStruct furniture in `src/styles/lp/`.
 * Content lives in `src/data/landings/`, markup is emitted by the renderers in
 * `tools/landings/`, and the output is static HTML with the words already in it.
 */

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildNexora } from "./landings/nexora.mjs";
import { buildOrbita } from "./landings/orbita.mjs";
import { buildShowcase } from "./landings/showcase.mjs";
import { buildVelora } from "./landings/velora.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "demos", "landing");
const ORIGIN = "https://corestruct.example/demos/landing";

/* The two campaign landings that used to live here — Cierzo and Lumen — are
   gone. Removing their files keeps `demos/` a true reflection of what the build
   produces rather than an archive of what it once produced. */
const RETIRED = ["servicios.html", "evento.html"];

const PAGES = [
  { file: "index.html", build: buildShowcase },
  { file: "nexora.html", build: buildNexora },
  { file: "velora.html", build: buildVelora },
  { file: "orbita.html", build: buildOrbita },
];

mkdirSync(OUT, { recursive: true });
for (const stale of RETIRED) rmSync(join(OUT, stale), { force: true });

const written = [];
for (const { file, build } of PAGES) {
  const html = build();
  writeFileSync(join(OUT, file), html);
  written.push({ file, bytes: Buffer.byteLength(html) });
}

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<!-- Demostración. Nexora, Velora y Orbita Supply son marcas ficticias y sus páginas son noindex. -->\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  written
    .map(({ file }) => `  <url>\n    <loc>${ORIGIN}/${file}</loc>\n    <priority>0.8</priority>\n  </url>`)
    .join("\n") +
  `\n</urlset>\n`;
writeFileSync(join(OUT, "sitemap.xml"), sitemap);

const total = written.reduce((sum, item) => sum + item.bytes, 0);
for (const { file, bytes } of written) {
  console.log(`  demos/landing/${file.padEnd(14)} ${(bytes / 1024).toFixed(1)} KB`);
}
console.log(`  ${written.length} páginas · ${(total / 1024).toFixed(1)} KB`);

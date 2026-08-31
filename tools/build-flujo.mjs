/**
 * Renders the Flujo automation demo into `demos/flujo/`.
 *
 * Flujo is the demo behind the "Automatización" card of the portfolio: a small,
 * complete demonstration of an internal administrative workflow — a request, the
 * rules that route it, the people who authorise it, the clock that watches it,
 * the document it produces and the trail it leaves — built to show an
 * administrative director that CoreStruct builds the tools an organisation runs
 * on, not only the site it is seen through.
 *
 * Same contract as the rest of the site: the model lives in
 * `src/data/flujo/workflows.js`, markup is emitted here at build time, and the
 * output is static HTML with the register, the rules and the trail already in
 * it. `npm run build:flujo`.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { engineProcesses, requests, workflows } from "../src/data/flujo/workflows.js";
import { context } from "./flujo/blocks.mjs";
import { modulePage, requestPage } from "./flujo/page.mjs";
import { ORIGIN, document_ } from "./flujo/shell.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "demos", "flujo");

const written = [];

/** Write one page. `path` is relative to `demos/flujo/`. */
function emit(path, build) {
  const depth = path.split("/").length - 1;
  const ctx = context(depth);
  const { meta, body } = build(ctx);

  const html = document_({ ctx, meta, body });
  const file = join(OUT, ...path.split("/"));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);

  written.push({ path, bytes: Buffer.byteLength(html) });
}

/* ------------------------------------------------------------------ pages */

emit("index.html", modulePage);

/* One file per request. Fifteen small pages rather than one modal: an
   expediente that has its own address is an expediente someone can send to a
   colleague, which is most of the point of putting the register online. */
for (const request of requests) {
  emit(`solicitudes/${request.code}.html`, (ctx) => requestPage(ctx, request));
}

/* ---------------------------------------------------------------- sitemap */

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<!-- Demostración. Las personas, los montos y los expedientes son ficticios,\n` +
  `     y todas las páginas son noindex. -->\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  written
    .map(({ path }) => {
      const loc = `${ORIGIN}/${path === "index.html" ? "" : path}`;
      const priority = path === "index.html" ? "1.0" : "0.5";
      return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join("\n") +
  `\n</urlset>\n`;

writeFileSync(join(OUT, "sitemap.xml"), sitemap);

/* ----------------------------------------------------------------- report */

const total = written.reduce((sum, item) => sum + item.bytes, 0);
for (const { path, bytes } of written) {
  console.log(`  demos/flujo/${path.padEnd(46)} ${(bytes / 1024).toFixed(1)} KB`);
}
console.log(
  `  ${written.length} páginas · ${(total / 1024).toFixed(1)} KB · ` +
    `${requests.length} solicitudes, ${Object.keys(workflows).length} flujos definidos, ` +
    `${engineProcesses.length} procesos del motor`,
);

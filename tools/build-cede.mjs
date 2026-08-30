/**
 * Renders the CEDE government portal into `demos/cede/`.
 *
 * CEDE is the demo behind the "Sitios gubernamentales" card of the portfolio: a
 * complete public-information portal for an invented education council —
 * observatory, plan monitor, normative library, open data, participation,
 * newsroom and back office — built to show a public institution the kind of
 * digital infrastructure CoreStruct delivers.
 *
 * Same contract as the rest of the site: content lives in `src/data/cede/`,
 * markup is emitted here at build time, and the output is static HTML with the
 * words, the tables and the charts already in it. `npm run build:cede`.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { consultations } from "../src/data/cede/participation.js";
import { indicators } from "../src/data/cede/indicators.js";
import { articles } from "../src/data/cede/newsroom.js";
import { context } from "./cede/blocks.mjs";
import { homeBody, homeMeta } from "./cede/home.mjs";
import {
  comparatorPage,
  indicatorPage,
  methodologyPage,
  observatoryPage,
} from "./cede/observatory.mjs";
import {
  articlePage,
  backofficePage,
  consultationPage,
  contactPage,
  institutionPage,
  libraryPage,
  newsroomPage,
  normativePage,
  notFoundPage,
  openDataPage,
  participationPage,
  planningPage,
  policyPage,
  programmesPage,
  resolutionsPage,
  searchPage,
  transparencyPage,
} from "./cede/pages.mjs";
import { ORIGIN, document_ } from "./cede/shell.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "demos", "cede");

const written = [];

/** Write one page. `path` is relative to `demos/cede/`. */
function emit(path, build) {
  const depth = path.split("/").length - 1;
  const ctx = context(depth);
  const { meta, current, body, bare } = build(ctx);

  const html = document_({ ctx, meta, current, body, bare });
  const file = join(OUT, ...path.split("/"));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);

  written.push({ path, bytes: Buffer.byteLength(html) });
}

/* ------------------------------------------------------------------ pages */

emit("index.html", (ctx) => ({ meta: homeMeta, current: "home", body: homeBody(ctx) }));

emit("institucion.html", institutionPage);
emit("politica-educativa.html", policyPage);
emit("planificacion.html", planningPage);
emit("programas.html", programmesPage);
emit("datos.html", observatoryPage);
emit("datos/comparador.html", comparatorPage);
emit("datos/metodologia.html", methodologyPage);
emit("datos-abiertos.html", openDataPage);
emit("normativa.html", normativePage);
emit("resoluciones.html", resolutionsPage);
emit("biblioteca.html", libraryPage);
emit("participacion.html", participationPage);
emit("transparencia.html", transparencyPage);
emit("actualidad.html", newsroomPage);
emit("contacto.html", contactPage);
emit("buscar.html", searchPage);
emit("404.html", notFoundPage);
emit("gestion-demo.html", backofficePage);

for (const indicator of indicators) {
  emit(`datos/indicadores/${indicator.slug}.html`, (ctx) => indicatorPage(ctx, indicator));
}

for (const article of articles) {
  emit(`noticias/${article.slug}.html`, (ctx) => articlePage(ctx, article));
}

for (const consultation of consultations) {
  emit(`participacion/${consultation.slug}.html`, (ctx) => consultationPage(ctx, consultation));
}

/* ---------------------------------------------------------------- sitemap */

/**
 * A sitemap for the portal.
 *
 * The pages are noindex, so this file is not there to be crawled — it is there
 * because a public portal ships one, and because it makes the information
 * architecture visible in a single artefact. Point `ORIGIN` at a real domain
 * and drop the noindex, and it is the sitemap of a live site.
 */
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<!-- Demostración. El Consejo Estratégico para el Desarrollo Educativo es una\n` +
  `     entidad ficticia y todas sus páginas son noindex. -->\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  written
    .filter(({ path }) => path !== "404.html" && path !== "gestion-demo.html")
    .map(({ path }) => {
      const loc = `${ORIGIN}/${path === "index.html" ? "" : path}`;
      const priority = path === "index.html" ? "1.0" : path.includes("/") ? "0.6" : "0.8";
      return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join("\n") +
  `\n</urlset>\n`;

writeFileSync(join(OUT, "sitemap.xml"), sitemap);

/* ----------------------------------------------------------------- report */

const total = written.reduce((sum, item) => sum + item.bytes, 0);
for (const { path, bytes } of written) {
  console.log(`  demos/cede/${path.padEnd(46)} ${(bytes / 1024).toFixed(1)} KB`);
}
console.log(
  `  ${written.length} páginas · ${(total / 1024).toFixed(1)} KB · ` +
    `${indicators.length} indicadores, ${articles.length} noticias, ${consultations.length} consultas`,
);

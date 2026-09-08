/**
 * Renders the AUREA education portal into `demos/aurea/`.
 *
 * AUREA is the demo behind the "Portales educativos" card of the portfolio: a
 * complete institutional ecosystem for an invented school that is also a
 * university — public site, admissions, academic catalogue, calendar,
 * newsroom, student life, research, directories and three signed-in product
 * demonstrations — built to show a rector, a director or an owner the kind of
 * digital infrastructure CoreStruct delivers.
 *
 * Same contract as the rest of the site: content lives in `src/data/aurea/`,
 * markup is emitted here at build time, and the output is static HTML with the
 * programmes, the plans of study, the calendar and the dashboards already in
 * it. `npm run build:aurea`.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { articles } from "../src/data/aurea/news.js";
import { programs } from "../src/data/aurea/programs.js";
import { context } from "./aurea/blocks.mjs";
import { ORIGIN, document_, island, searchIndex } from "./aurea/shell.mjs";
import { homeBody, homeMeta } from "./aurea/home.mjs";
import { programPage } from "./aurea/program.mjs";
import {
  admissionsPage,
  alumniPage,
  articlePage,
  calendarPage,
  campusPage,
  contactPage,
  costsPage,
  directoryPage,
  documentsPage,
  employabilityPage,
  facultyPage,
  faqPage,
  institutionPage,
  internationalPage,
  libraryPage,
  lifePage,
  newsroomPage,
  notFoundPage,
  offerPage,
  researchPage,
  scholarshipsPage,
  searchPage,
  supportPage,
} from "./aurea/pages.mjs";
import { parentPortal, studentPortal, virtualCampusPage } from "./aurea/portals.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "demos", "aurea");

const written = [];

/**
 * Write one page. `path` is relative to `demos/aurea/`.
 *
 * The search index is attached to every page rather than to a search page,
 * because the overlay opens from anywhere. It is the same object on all of
 * them and gzips to almost nothing repeated; splitting it into a fetched file
 * would trade that for a request and a loading state.
 */
function emit(path, build) {
  const depth = path.split("/").length - 1;
  const ctx = context(depth);
  const { meta, current, body, bare, islands = "" } = build(ctx);

  const html = document_({
    ctx,
    meta,
    current,
    body,
    bare,
    islands: `${island("au-search-index", searchIndex(ctx))}\n${islands}`.trimEnd(),
  });

  const file = join(OUT, ...path.split("/"));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);

  written.push({ path, bytes: Buffer.byteLength(html) });
}

/* ------------------------------------------------------------------ pages */

emit("index.html", (ctx) => ({ meta: homeMeta, current: "home", body: homeBody(ctx) }));

emit("institucion.html", institutionPage);
emit("oferta-academica.html", offerPage);
emit("admisiones.html", admissionsPage);
emit("becas.html", scholarshipsPage);
emit("costos.html", costsPage);
emit("calendario.html", calendarPage);
emit("noticias.html", newsroomPage);
emit("vida-estudiantil.html", lifePage);
emit("campus.html", campusPage);
emit("investigacion.html", researchPage);
emit("docentes.html", facultyPage);
emit("directorio.html", directoryPage);
emit("biblioteca.html", libraryPage);
emit("apoyo-estudiantil.html", supportPage);
emit("empleabilidad.html", employabilityPage);
emit("egresados.html", alumniPage);
emit("internacional.html", internationalPage);
emit("documentos.html", documentsPage);
emit("preguntas-frecuentes.html", faqPage);
emit("contacto.html", contactPage);
emit("buscar.html", searchPage);
emit("404.html", notFoundPage);

/* The three signed-in demonstrations. */
emit("demo/portal-estudiantil.html", studentPortal);
emit("demo/portal-padres.html", parentPortal);
emit("demo/campus-virtual.html", virtualCampusPage);

/* Detail pages, one per record — the CMS-shaped part of the portal. */
for (const program of programs) {
  emit(`programas/${program.slug}.html`, (ctx) => programPage(ctx, program));
}

for (const article of articles) {
  emit(`noticias/${article.slug}.html`, (ctx) => articlePage(ctx, article));
}

/* ---------------------------------------------------------------- sitemap */

/**
 * A sitemap for the portal.
 *
 * The pages are noindex, so this file is not there to be crawled — it is there
 * because a real institutional portal ships one, and because it makes the
 * information architecture of twenty-eight pages visible in a single artefact.
 * Point `ORIGIN` at a real domain and drop the noindex, and it is the sitemap
 * of a live site.
 */
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<!-- Demostración. AUREA es una institución educativa ficticia y todas sus\n` +
  `     páginas son noindex. -->\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  written
    .map(
      ({ path }) =>
        `  <url><loc>${ORIGIN}/${path === "index.html" ? "" : path}</loc>` +
        `<priority>${path === "index.html" ? "1.0" : path.includes("/") ? "0.6" : "0.8"}</priority></url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;

writeFileSync(join(OUT, "sitemap.xml"), sitemap);

/* ----------------------------------------------------------------- report */

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const total = written.reduce((sum, entry) => sum + entry.bytes, 0);

console.log(
  `demos/aurea  ${written.length} pages · ${kb(total)} total · ` +
    `${kb(total / written.length)} average`,
);
for (const entry of [...written].sort((a, b) => b.bytes - a.bytes).slice(0, 5)) {
  console.log(`  ${entry.path.padEnd(38)} ${kb(entry.bytes)}`);
}

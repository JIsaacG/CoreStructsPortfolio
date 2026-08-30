/**
 * Renders the Aurelis Group corporate portal into `demos/aurelis/`.
 *
 * Aurelis is the demo behind the "Sitios corporativos" card of the portfolio: a
 * complete institutional portal for an invented B2B group, built to show a
 * business owner the kind of site CoreStruct delivers. It is a portal and not a
 * landing page on purpose — twenty-three pages across six sections, so the
 * navigation, the catalogue and the case records are real rather than implied.
 *
 * Same contract as the rest of the site: content lives in `src/data/aurelis/`,
 * markup is emitted here at build time, and the output is static HTML with the
 * words already in it. `npm run build:aurelis`.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { articles, insights } from "../src/data/aurelis/insights.js";
import { products } from "../src/data/aurelis/products.js";
import { withRecord } from "../src/data/aurelis/projects.js";
import { services } from "../src/data/aurelis/services.js";
import { context } from "./aurelis/blocks.mjs";
import { homeBody, homeMeta } from "./aurelis/home.mjs";
import {
  articlePage,
  companyPage,
  contactPage,
  industriesIndex,
  productPage,
  productsIndex,
  projectPage,
  projectsIndex,
  resourcesIndex,
  servicePage,
  servicesIndex,
} from "./aurelis/pages.mjs";
import { document_, ORIGIN } from "./aurelis/shell.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "demos", "aurelis");

const written = [];

/** Write one page. `path` is relative to `demos/aurelis/`. */
function emit(path, build) {
  const depth = path.split("/").length - 1;
  const ctx = context(depth);
  const { meta, current, body } = build(ctx);

  const html = document_({ ctx, meta, current, body });
  const file = join(OUT, ...path.split("/"));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);

  written.push({ path, bytes: Buffer.byteLength(html) });
}

/* ------------------------------------------------------------------ pages */

emit("index.html", () => ({ meta: homeMeta, current: "home", body: homeBody(context(0)) }));

emit("empresa.html", companyPage);
emit("servicios.html", servicesIndex);
emit("industrias.html", industriesIndex);
emit("productos.html", productsIndex);
emit("proyectos.html", projectsIndex);
emit("recursos.html", resourcesIndex);
emit("contacto.html", contactPage);

for (const service of services) {
  emit(`servicios/${service.slug}.html`, (ctx) => servicePage(ctx, service));
}

for (const product of products) {
  emit(`productos/${product.slug}.html`, (ctx) => productPage(ctx, product));
}

for (const project of withRecord()) {
  emit(`proyectos/${project.slug}.html`, (ctx) => projectPage(ctx, project));
}

for (const article of articles()) {
  emit(`recursos/${article.slug}.html`, (ctx) => articlePage(ctx, article));
}

/* ---------------------------------------------------------------- sitemap */

/**
 * A sitemap for the portal.
 *
 * The demo's pages are noindex, so this file is not there to be crawled — it is
 * there because a corporate portal ships one, and because it makes the
 * information architecture visible in a single artefact. Point `ORIGIN` at a
 * real domain and drop the noindex, and it is the sitemap of a live site.
 */
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<!-- Demostración. Aurelis Group es una empresa ficticia y sus páginas son noindex. -->\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  written
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
  console.log(`  demos/aurelis/${path.padEnd(44)} ${(bytes / 1024).toFixed(1)} KB`);
}
console.log(
  `  ${written.length} páginas · ${(total / 1024).toFixed(1)} KB · ` +
    `${insights.length} recursos, ${products.length} productos, ${services.length} soluciones`,
);

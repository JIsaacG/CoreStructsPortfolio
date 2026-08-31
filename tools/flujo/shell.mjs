/**
 * The chrome every Flujo page carries.
 *
 * Document head, the slim top bar, the hero, the footer and the badge that
 * credits the demonstration. All of it emitted at build time: a visitor gets
 * real HTML with the navigation, the register and the workflow already in it,
 * and JavaScript only adds behaviour on top of a page that already reads.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { escape } from "../../src/data/flujo/format.js";
import { moduleInfo } from "../../src/data/flujo/workflows.js";
import { asset, button, icon, page } from "./blocks.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** `.example` is the TLD reserved for documentation: the canonical tags show
    the structure a deployment needs without claiming anyone's domain. */
export const ORIGIN = "https://flujo.example";

export const product = {
  name: "Flujo",
  descriptor: "Gestión administrativa",
  tagline: moduleInfo.concept,
};

/* -------------------------------------------------------------------- head */

/**
 * `<head>`, complete.
 *
 * Two things here are policy rather than convention. Every page is `noindex`,
 * because a demonstration of an administrative system full of invented people
 * and invented amounts must never reach a search result as a real one. And the
 * structured data declares a `SoftwareApplication` with an explicit
 * `disambiguatingDescription`: the schema type is a claim, and the claim being
 * made is "this is a demonstration of a product", not "this is a public body".
 */
export function documentHead(ctx, meta) {
  const title = `${meta.title} · ${product.name}`;
  const description = meta.description.replace(/\s+/g, " ").trim().slice(0, 300);
  const canonical = `${ORIGIN}/${meta.canonical ?? ""}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${product.name} · ${product.descriptor}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${ORIGIN}/`,
    description:
      "Demostración de un motor de flujos administrativos: solicitudes, reglas de aprobación, " +
      "responsables, tiempos de respuesta, documentos generados y trazabilidad.",
    disambiguatingDescription:
      "Demostración de portafolio creada por CoreStruct. Las personas, las cifras, los " +
      "documentos y los procesos mostrados son ficticios.",
    isAccessibleForFree: true,
    inLanguage: "es",
  };

  return `    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}" />
    <link rel="canonical" href="${escape(canonical)}" />

    <!-- Every person, amount, document and request code in this demonstration is
         invented. A screen full of approvals that look like real authorisations
         must never surface in a search result, so every page is noindex. -->
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="#071e4a" />
    <meta name="color-scheme" content="light" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escape(`${product.name} · ${product.descriptor}`)}" />
    <meta property="og:locale" content="es_HN" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(description)}" />
    <meta property="og:url" content="${escape(canonical)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(description)}" />

    <link rel="icon" href="${asset(ctx, "favicon.ico")}" sizes="32x32" />

    <link
      rel="preload"
      href="${asset(ctx, "assets/fonts/ibm-plex-sans-latin.woff2")}"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="preload"
      href="${asset(ctx, "assets/fonts/source-serif-4-latin.woff2")}"
      as="font"
      type="font/woff2"
      crossorigin
    />

    <link rel="stylesheet" href="${asset(ctx, "dist/flujo.css")}" />

    <script type="application/ld+json">
${JSON.stringify(schema, null, 6).replace(/^/gm, "      ")}
    </script>`;
}

/* -------------------------------------------------------------------- mark */

/**
 * The emblem.
 *
 * Three rules stepping to the right inside a square: a request moving through
 * stages, which is the only thing this product does. Drawn rather than set, so
 * it stays sharp at 20px in a browser tab and needs no image request.
 */
function logoMark() {
  return (
    `<svg class="fx-logo__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">` +
    `<rect x="0.75" y="0.75" width="30.5" height="30.5" rx="3" fill="none" stroke="currentColor" ` +
    `stroke-width="1.5" opacity="0.4"/>` +
    `<rect x="7" y="8" width="12" height="3" rx="1.5" fill="currentColor"/>` +
    `<rect x="10" y="14.5" width="12" height="3" rx="1.5" fill="currentColor" opacity="0.75"/>` +
    `<rect x="13" y="21" width="12" height="3" rx="1.5" fill="currentColor" opacity="0.5"/>` +
    `</svg>`
  );
}

export const logo = (ctx) =>
  `<a class="fx-logo" href="${page(ctx, "index.html")}" aria-label="${escape(product.name)}, inicio">` +
  logoMark() +
  `<span class="fx-logo__type"><span class="fx-logo__name">${escape(product.name)}</span>` +
  `<span class="fx-logo__sub">${escape(product.descriptor)}</span></span></a>`;

/* ------------------------------------------------------------------ header */

const NAV = [
  { label: "El proceso", hash: "proceso" },
  { label: "Panel", hash: "panel" },
  { label: "Solicitudes", hash: "solicitudes" },
  { label: "Reglas", hash: "reglas" },
  { label: "Procesos", hash: "motor" },
];

export function header(ctx) {
  const links = NAV.map(
    (item) =>
      `<a class="fx-nav__link" href="${page(ctx, "index.html")}#${escape(item.hash)}">${escape(item.label)}</a>`,
  ).join("");

  return `    <header class="fx-header fx-dark">
      <div class="fx-shell fx-header__inner">
${logo(ctx)}
        <nav class="fx-nav" aria-label="Secciones de la demostración">${links}</nav>
        <div class="fx-header__end">
          <span class="wf-flag wf-flag--onDark">${escape(moduleInfo.tag)}</span>
          ${button("Reiniciar demo", "#", { onDark: true, small: true, className: "js-only", })}
        </div>
      </div>
    </header>`;
}

/* -------------------------------------------------------------------- hero */

/**
 * The page opening.
 *
 * Breadcrumb, label, title, lead, the two calls to action, the sentence that
 * declares the fiction, and a four-item metadata strip. Every interior page of
 * the demo opens the same way, which is what makes three kinds of page feel
 * like one product.
 */
export function hero({ ctx, trail, label, title, lead, actions = "", fine, meta = [] }) {
  const crumbs = trail
    .map((item, index) =>
      index === trail.length - 1
        ? `<li aria-current="page">${escape(item.label)}</li>`
        : `<li><a href="${escape(item.href)}">${escape(item.label)}</a></li>`,
    )
    .join("");

  return (
    `<section class="fx-hero fx-dark">` +
    `<div class="fx-shell fx-hero__inner">` +
    `<nav class="fx-hero__crumbs" aria-label="Ruta"><ol class="fx-crumbs">${crumbs}</ol></nav>` +
    `<div><p class="fx-label"><span>${escape(label)}</span></p>` +
    `<h1 class="fx-hero__title">${escape(title)}</h1></div>` +
    `<div><p class="fx-hero__lead">${escape(lead)}</p>` +
    (actions ? `<div class="fx-hero__actions">${actions}</div>` : "") +
    (fine ? `<p class="fx-hero__fine">${escape(fine)}</p>` : "") +
    `</div>` +
    (meta.length
      ? `<dl class="fx-hero__meta">${meta
          .map((item) => `<div><dt>${escape(item.term)}</dt><dd>${escape(item.detail)}</dd></div>`)
          .join("")}</dl>`
      : "") +
    `</div></section>`
  );
}

/* ------------------------------------------------------------------ footer */

export function siteFooter(ctx) {
  const column = (heading, links) =>
    `<div><p class="fx-footer__heading">${escape(heading)}</p>` +
    links
      .map(
        (link) =>
          `<a class="fx-footer__link" href="${escape(link.href)}">${escape(link.label)}</a>`,
      )
      .join("") +
    `</div>`;

  return `      <footer class="fx-footer fx-dark">
        <div class="fx-shell">
          <div class="fx-footer__top">
            <div>
${logo(ctx)}
              <p class="fx-footer__pitch">${escape(product.tagline)} ${escape(
                "Un motor de flujos configurable: formularios, reglas de aprobación, responsables, " +
                  "tiempos de respuesta, documentos y trazabilidad.",
              )}</p>
            </div>
            ${column("La demostración", [
              { label: "El proceso completo", href: `${page(ctx, "index.html")}#proceso` },
              { label: "Panel administrativo", href: `${page(ctx, "index.html")}#panel` },
              { label: "Registro de solicitudes", href: `${page(ctx, "index.html")}#solicitudes` },
              { label: "Tiempos de respuesta", href: `${page(ctx, "index.html")}#tiempos` },
            ])}
            ${column("El motor", [
              { label: "Reglas de aprobación", href: `${page(ctx, "index.html")}#reglas` },
              { label: "Un motor, distintos procesos", href: `${page(ctx, "index.html")}#motor` },
              { label: "Procesos documentales", href: `${page(ctx, "index.html")}#documental` },
              { label: "Volver al portafolio", href: `${asset(ctx, "index.html")}#proyectos` },
            ])}
          </div>

          <div class="fx-footer__notice">
            <p>Demostración de portafolio. ${escape(moduleInfo.disclaimer)}</p>
            <p>&copy; <span data-current-year>2026</span> CoreStruct</p>
          </div>
        </div>
      </footer>`;
}

/* ------------------------------------------------------------------- badge */

/** The CoreStruct isotype, for the badge that credits the demonstration. */
function isotype() {
  const svg = readFileSync(join(ROOT, "assets", "brand", "isotipo.svg"), "utf8");
  return {
    defs: (svg.match(/<defs>([\s\S]*?)<\/defs>/)?.[1] ?? "").replace(/\s+/g, " ").trim(),
    paths: (svg.match(/<path[\s\S]*?\/>/g)?.join("") ?? "").replace(/\s+/g, " ").trim(),
  };
}

const MARK = isotype();

/** The one element on the page that is not part of the fiction. */
export function badge(ctx) {
  return `    <svg aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute">
      <defs>${MARK.defs}</defs>
    </svg>

    <a class="fx-badge" href="${asset(ctx, "index.html")}#proyectos">
      <svg class="fx-badge__mark" viewBox="0 0 362 422" aria-hidden="true" focusable="false">${MARK.paths}</svg>
      <span class="fx-badge__tag">DEMO</span>
      <span class="fx-badge__label">Módulo demostrativo de CoreStruct</span>
    </a>`;
}

/* -------------------------------------------------------------------- page */

/** Assemble a complete document. */
export function document_({ ctx, meta, body }) {
  return `<!doctype html>
<html lang="es">
  <head>
${documentHead(ctx, meta)}
  </head>

  <body>
    <a class="fx-skip" href="#contenido">Saltar al contenido</a>

${badge(ctx)}

${header(ctx)}

    <main id="contenido">
${body}
    </main>

${siteFooter(ctx)}

    <div class="fx-toast" data-toast role="status" aria-live="polite"></div>

    <script type="module" src="${asset(ctx, "src/scripts/flujo/main.js")}"></script>
  </body>
</html>
`;
}

export { icon };

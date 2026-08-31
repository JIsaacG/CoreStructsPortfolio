/**
 * The chrome every Flujo page carries.
 *
 * Document head, the glass bar, the field behind everything, the one-line
 * footer and the expediente search. All of it emitted at build time: a visitor
 * gets real HTML with the workflow, the route and the register already in it,
 * and JavaScript only adds behaviour on top of a page that already reads.
 *
 * The chrome is deliberately thin. The module page is a console now — the
 * demonstration is the page — so the bar carries three controls and no
 * navigation, and the footer is one line rather than three columns of links to
 * sections that no longer exist.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { escape } from "../../src/data/flujo/format.js";
import { moduleInfo, requests, roleName } from "../../src/data/flujo/workflows.js";
import { asset, icon, page, requestHref } from "./blocks.mjs";
import { statePill } from "../../src/scripts/flujo/render.js";

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
    <meta name="theme-color" content="#04060f" />
    <meta name="color-scheme" content="dark" />

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
    </script>

    <!-- Runs before first paint. The console has stages that only exist once
         the engine can drive them — a document that has not been generated yet,
         a reset control with nothing to reset. Marking the document scripted
         here means those are hidden from the start instead of appearing and
         then vanishing, and it means a reader without JavaScript still gets the
         complete, already-finished version of every one of them. -->
    <script>
      document.documentElement.classList.add("js");
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
    `<rect x="0.75" y="0.75" width="30.5" height="30.5" rx="6" fill="none" stroke="currentColor" ` +
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

/**
 * The bar.
 *
 * Three controls and a mark. The five section anchors it used to carry are gone
 * with the five sections: there is nowhere to navigate to on a page that is one
 * console, and an anchor list that scrolls you 200px is navigation theatre.
 *
 * `console` gates the two controls that only mean something where an engine is
 * running — the guided demo, and the reset that undoes it.
 */
export function header(ctx, { console: isConsole = false } = {}) {
  const search =
    `<button class="fx-btn fx-btn--ghost fx-btn--small" type="button" data-wf-palette-open>` +
    `${icon("search")}<span class="gw-bar__wide">Buscar expediente</span></button>`;

  const drive = isConsole
    ? `<button class="fx-btn fx-btn--solid fx-btn--small" type="button" data-wf-tour>` +
      `Demo guiada${icon("arrow")}</button>` +
      `<button class="fx-btn fx-btn--ghost fx-btn--small" type="button" data-wf-reset hidden>` +
      `Reiniciar</button>`
    : `<a class="fx-btn fx-btn--ghost fx-btn--small" href="${page(ctx, "index.html")}">` +
      `Ir a la consola</a>`;

  return `    <header class="fx-header">
      <div class="gw-shell fx-header__inner">
${logo(ctx)}
        <div class="fx-header__end">${search}${drive}</div>
      </div>
    </header>`;
}

/* -------------------------------------------------------------------- hero */

/**
 * The page opening, for the fifteen request files.
 *
 * The console has no hero any more — it opens on its controls. This stays for
 * an expediente, where a reader arriving from a link does need to be told which
 * request they are looking at before anything else.
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
    `<section class="fx-hero">` +
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

/* -------------------------------------------------------------------- field */

/**
 * What everything else floats on.
 *
 * Three blurred bodies of colour and a hairline grid, fixed behind the document.
 * It is decoration and nothing else, so it is `aria-hidden` and it is the first
 * thing `prefers-reduced-motion` switches off.
 */
export const field = () =>
  `    <div class="gw-field" aria-hidden="true">
      <span class="gw-field__orb gw-field__orb--a"></span>
      <span class="gw-field__orb gw-field__orb--b"></span>
      <span class="gw-field__orb gw-field__orb--c"></span>
      <span class="gw-field__grid"></span>
    </div>`;

/* ------------------------------------------------------------------ footer */

/** One line. Everything it used to link to is on the page you are already on. */
export function siteFooter(ctx) {
  return `      <footer class="gw-foot">
        <p>Demostración de portafolio · CoreStruct. ${escape(moduleInfo.disclaimer)}</p>
        <p><a href="${asset(ctx, "index.html")}#proyectos">Volver al portafolio</a> ·
          &copy; <span data-current-year>2026</span></p>
      </footer>`;
}

/* ----------------------------------------------------------------- palette */

/**
 * The register, as a search.
 *
 * Fifteen expedientes used to be a nine-column table with five filter controls
 * in the middle of the demonstration. They are still all here, still
 * addressable, still findable by code, concept, requester, area or state — they
 * simply are not in the way any more. One control opens it, typing filters it,
 * Escape closes it.
 */
export function palette(ctx) {
  const hits = requests
    .map((request) => {
      const text =
        `${request.code} ${request.concept} ${request.requester} ${request.area} ` +
        `${request.type} ${roleName(request.responsible)}`.toLowerCase();

      return (
        `<li data-text="${escape(text)}">` +
        `<a class="gw-hit" href="${requestHref(ctx, request.code)}">` +
        `<span><span class="gw-hit__code">${escape(request.code)}</span>` +
        `<span class="gw-hit__what">${escape(request.concept)} · ${escape(request.requester)}</span></span>` +
        statePill(request.state) +
        `</a></li>`
      );
    })
    .join("");

  return `    <dialog class="gw-palette" data-wf-palette aria-label="Buscar expediente">
      <div class="gw-palette__head">
        ${icon("search")}
        <input class="gw-palette__input" type="search" data-wf-palette-input autocomplete="off"
          placeholder="Buscar por código, concepto, solicitante o estado" aria-label="Buscar expediente" />
        <span class="gw-palette__hint">Esc</span>
      </div>
      <ul class="gw-palette__list" data-wf-palette-list>${hits}</ul>
      <p class="gw-palette__empty" data-wf-palette-empty hidden>
        Ningún expediente coincide con la búsqueda.
      </p>
    </dialog>`;
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
export function document_({ ctx, meta, body, console: isConsole = false }) {
  return `<!doctype html>
<html lang="es">
  <head>
${documentHead(ctx, meta)}
  </head>

  <body>
    <a class="fx-skip" href="#contenido">Saltar al contenido</a>

${field()}

${badge(ctx)}

${header(ctx, { console: isConsole })}

    <main id="contenido"${isConsole ? ' class="gw-main"' : ""}>
${body}
    </main>

${siteFooter(ctx)}

${palette(ctx)}

    <div class="fx-toast" data-toast role="status" aria-live="polite"></div>

    <script type="module" src="${asset(ctx, "src/scripts/flujo/main.js")}"></script>
  </body>
</html>
`;
}

export { icon };

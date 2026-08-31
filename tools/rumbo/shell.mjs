/**
 * The page frame every Rumbo screen shares: head, header, mobile menu,
 * footer and the "Demo" badge. Same contract as `tools/flujo/shell.mjs` —
 * one `document_()` call per page, fed a `ctx` built by `context(depth)`.
 */

import { brand, navigation } from "../../src/data/rumbo/company.js";
import { escape } from "../../src/data/rumbo/format.js";

export const ORIGIN = "https://corestruct.example/demos/rumbo";

/** Build a context for a page `depth` directories below `demos/rumbo/`. */
export const context = (depth = 0) => ({ depth, up: "../".repeat(depth) });

/** A file outside the demo — the bundle, a font, the portfolio itself. */
export const asset = (ctx, file) => `${ctx.up}../../${file}`;

/** A top-level page of the demo (`index.html`, `expedientes.html`, …). */
export const page = (ctx, file) => `${ctx.up}${file}`;

/** One client's ficha. */
export const clientHref = (ctx, slug) => `${ctx.up}expedientes/${slug}.html`;

/* ------------------------------------------------------------------- head */

function renderHead({ ctx, title, description }) {
  return `    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>${escape(title)} · Demo de CoreStruct</title>
    <meta name="description" content="${escape(description)}" />
    <!-- An invented company must never turn up in a search result as a real one. -->
    <meta name="robots" content="noindex, follow" />
    <meta name="theme-color" content="#080b12" />
    <meta name="color-scheme" content="dark" />

    <link rel="icon" href="${asset(ctx, "favicon.ico")}" sizes="32x32" />
    <link rel="icon" href="${asset(ctx, "assets/brand/isotipo.svg")}" type="image/svg+xml" />

    <link
      rel="preload"
      href="${asset(ctx, "assets/fonts/manrope-latin.woff2")}"
      as="font"
      type="font/woff2"
      crossorigin
    />

    <link rel="stylesheet" href="${asset(ctx, "dist/demo.css")}" />

    <!-- Rumbo's jade, in place of CoreStruct's navy and cyan. Every shared
         component below reads these four values rather than a hard-coded
         colour, so the whole panel re-tints from here. -->
    <style>
      :root {
        --brand-primary: #0c2a20;
        --brand-secondary: #2fae7a;
        --brand-primary-rgb: 12 42 32;
        --brand-secondary-rgb: 47 174 122;
      }
    </style>

    <script>
      document.documentElement.classList.add("js");
      setTimeout(function () {
        if (!document.documentElement.dataset.revealsReady) {
          document.documentElement.classList.remove("js");
        }
      }, 2500);
    </script>`;
}

/* ------------------------------------------------------------------ badge */

/** The CoreStruct isotype, flat-filled in its own navy/cyan — the badge
    names who built the demo, not the brand the demo is playing. */
function renderBadge(ctx) {
  return `    <a class="dm-badge" href="${asset(ctx, "index.html")}#proyectos">
      <svg class="dm-badge__mark" viewBox="0 0 362 422" aria-hidden="true" focusable="false">
        <path fill="#2c6fb2" d="M10 98L17 92L181 1L188 3L354 96L353 99L200 186L185 179L173 181L166 186L11 98Z"/>
        <path fill="#3898d4" d="M188 421L188 373L190 371L320 295L320 248L318 248L188 324L188 217L198 211L202 203L202 197L358 111L361 109L361 165L233 234L233 275L361 200L361 321L189 421Z"/>
        <path fill="#253880" d="M1 107L160 195L166 210L176 216L176 252L174 252L42 176L42 294L114 336L154 359L154 297L176 309L176 422L2 321L1 108Z"/>
      </svg>
      <span class="dm-badge__tag">Demo</span>
      <span class="dm-badge__label">Sitio de ejemplo · CoreStruct</span>
    </a>`;
}

/* ----------------------------------------------------------------- header */

function renderHeader(ctx, current) {
  const links = navigation
    .map(({ id, label, href }) => {
      const isCurrent = id === current;
      return `            <a class="dm-nav__link" href="${page(ctx, href)}"${isCurrent ? ' aria-current="page"' : ""}>${escape(label)}</a>`;
    })
    .join("\n");

  const menuLinks = navigation
    .map(({ href, label }) => `      <a class="dm-menu__link" href="${page(ctx, href)}">${escape(label)}</a>`)
    .join("\n");

  return `    <header class="dm-header" data-header>
      <div class="dm-header__inner">
        <a class="dm-wordmark" href="${page(ctx, "index.html")}">
          <span class="dm-wordmark__name">${escape(brand.name)}</span>
          <span class="dm-wordmark__mark">${escape(brand.tagline)}</span>
        </a>

        <nav class="dm-nav" aria-label="Secciones">
${links}
        </nav>

        <div class="dm-header__actions">
          <a class="button button--primary" href="${asset(ctx, "index.html")}#contacto">Hablemos de tu proyecto</a>
          <button
            class="dm-burger"
            type="button"
            aria-expanded="false"
            aria-controls="dm-menu"
            aria-label="Abrir el menú"
            data-menu-toggle
          >
            <span class="dm-burger__bar"></span>
            <span class="dm-burger__bar"></span>
          </button>
        </div>
      </div>
    </header>

    <div class="dm-menu" id="dm-menu" data-mobile-nav>
${menuLinks}
      <a class="dm-menu__link" href="${asset(ctx, "index.html")}#contacto">Hablemos de tu proyecto</a>
    </div>`;
}

/* ----------------------------------------------------------------- footer */

function renderFooter(ctx) {
  return `      <footer class="dm-footer">
        <div class="dm-shell dm-footer__inner">
          <div class="dm-footer__brand">
            <p class="dm-footer__name">${escape(brand.name)}</p>
            <p class="dm-footer__line">${escape(brand.legalName)} · ${escape(brand.sector)}</p>
            <p class="dm-footer__credit">
              Marca ficticia. Sitio de ejemplo construido por
              <a href="${asset(ctx, "index.html")}">CoreStruct</a> &copy; <span data-current-year>2026</span>.
            </p>
          </div>
          <nav class="dm-footer__nav" aria-label="Pie">
            <a href="${page(ctx, "index.html")}">Panel</a>
            <a href="${page(ctx, "expedientes.html")}">Expedientes</a>
            <a href="${page(ctx, "operaciones.html")}">Operaciones</a>
            <a href="${asset(ctx, "index.html")}#contacto">Contacto</a>
          </nav>
        </div>
      </footer>`;
}

/* ---------------------------------------------------------------- document */

export function document_({ ctx, meta, current, body }) {
  return `<!doctype html>
<html lang="es">
  <head>
${renderHead({ ctx, ...meta })}
  </head>

  <body>
    <a class="skip-link" href="#contenido">Saltar al contenido</a>

${renderBadge(ctx)}

${renderHeader(ctx, current)}

    <main class="dm" id="contenido">
${body}

${renderFooter(ctx)}
    </main>

    <script type="module" src="${asset(ctx, "src/scripts/demo/shell.js")}"></script>
    <script type="module" src="${asset(ctx, "src/scripts/rumbo/filters.js")}"></script>
  </body>
</html>
`;
}

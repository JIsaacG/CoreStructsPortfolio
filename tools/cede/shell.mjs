/**
 * The chrome every CEDE page carries.
 *
 * Document head, the three header bands with their mega panels, the mobile
 * menu, the footer and the badge that keeps the fiction honest. All of it is
 * emitted at build time: a visitor gets real HTML with the navigation, the
 * search form and the notices already in it, and JavaScript only adds the
 * disclosure behaviour on top.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { escape } from "../../src/data/cede/format.js";
import { contact, footer, institution, navigation, notice, routes } from "../../src/data/cede/institution.js";
import { asset, icon, page } from "./blocks.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export const ORIGIN = institution.origin;

/* -------------------------------------------------------------------- head */

/**
 * `<head>`, complete.
 *
 * Two things here are deliberate policy rather than convention. First, every
 * page is `noindex`: an invented council must never surface in a search result
 * as a real one. Second, the structured data declares a plain `Organization`
 * and never `GovernmentOrganization` — the schema type is a claim about what
 * this entity is, and this entity is a demonstration.
 */
export function documentHead(ctx, meta) {
  const title = `${meta.title} · ${institution.short}`;
  const description = meta.description.replace(/\s+/g, " ").trim().slice(0, 300);
  const canonical = `${ORIGIN}/${meta.canonical ?? ""}`;

  return `    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}" />
    <link rel="canonical" href="${escape(canonical)}" />

    <!-- The Consejo Estratégico para el Desarrollo Educativo does not exist. A
         demonstration of a public institution must never reach a search result
         as a real one, so every page of the portal is noindex. -->
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="#071e4a" />
    <meta name="color-scheme" content="light" />

    <meta property="og:type" content="${escape(meta.ogType ?? "website")}" />
    <meta property="og:site_name" content="${escape(institution.full)}" />
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

    <link rel="stylesheet" href="${asset(ctx, "dist/cede.css")}" />

    <script type="application/ld+json">
${JSON.stringify(schemaFor(meta), null, 6).replace(/^/gm, "      ")}
    </script>

    <!-- Runs before first paint. Two jobs: apply the reader's saved
         accessibility preferences so a high-contrast page never flashes in the
         default palette, and mark the document scripted so the reveal system
         may hide what it is about to animate — with a timer that un-marks it if
         the behaviour module never loads, so nothing is left invisible. -->
    <script>
      (function () {
        var root = document.documentElement;
        root.classList.add("js");
        try {
          var contrast = localStorage.getItem("cede:contrast");
          if (contrast === "high") root.dataset.contrast = "high";
          var scale = localStorage.getItem("cede:scale");
          if (scale) root.style.setProperty("--font-scale", scale);
        } catch (error) {
          /* Private mode, or storage disabled: the defaults are correct. */
        }
        setTimeout(function () {
          if (!root.dataset.revealsReady) root.classList.remove("js");
        }, 2500);
      })();
    </script>`;
}

/* --------------------------------------------------------- structured data */

/**
 * `Organization`, never `GovernmentOrganization`.
 *
 * The brief is explicit and the reasoning is sound: a schema type is a factual
 * claim, and publishing `GovernmentOrganization` for an invented council would
 * be the one part of this demonstration that could mislead a machine as well as
 * a person. The `disambiguatingDescription` says what it is in plain words.
 */
function schemaFor(meta) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: institution.full,
    alternateName: institution.short,
    url: `${ORIGIN}/`,
    description: institution.summary,
    disambiguatingDescription:
      "Entidad ficticia. Portal de demostración creado por CoreStruct; no representa a ninguna " +
      "institución gubernamental real.",
    email: contact.email,
    areaServed: "HN",
    knowsLanguage: ["es"],
  };

  const extra = meta.schema ?? [];
  return extra.length ? [organization, ...extra] : organization;
}

export const breadcrumbSchema = (trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: `${ORIGIN}/${item.route ? routes[item.route] : ""}`,
  })),
});

export const datasetSchema = (dataset) => ({
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: dataset.title,
  description: `${dataset.summary} Datos demostrativos: no corresponden a estadísticas oficiales.`,
  license: "https://creativecommons.org/licenses/by/4.0/",
  isAccessibleForFree: true,
  creator: { "@type": "Organization", name: institution.full },
  temporalCoverage: "2019/2026",
  distribution: ["CSV", "XLSX", "JSON"].map((format) => ({
    "@type": "DataDownload",
    encodingFormat: format,
  })),
});

export const articleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: article.title,
  datePublished: article.date,
  description: article.summary,
  author: { "@type": "Organization", name: institution.full },
  publisher: { "@type": "Organization", name: institution.full },
  isAccessibleForFree: true,
});

export const faqSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
});

/* ------------------------------------------------------------------- logo */

/**
 * The emblem.
 *
 * Not a coat of arms and not a flag: a keystone drawn from five stacked rules,
 * which is as close to "an institution that holds a record" as a mark can get
 * without borrowing the iconography of a real state. It is drawn, so it stays
 * sharp at 20px in a browser tab and inverts cleanly on the dark footer.
 */
export function logo(ctx, { inFooter = false } = {}) {
  const mark =
    `<svg class="cd-logo__mark" viewBox="0 0 44 44" aria-hidden="true" focusable="false">` +
    `<rect x="1" y="1" width="42" height="42" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>` +
    `<path d="M22 8 34 15v3H10v-3z" fill="currentColor"/>` +
    `<rect x="13" y="21" width="4" height="11" fill="currentColor"/>` +
    `<rect x="20" y="21" width="4" height="11" fill="currentColor"/>` +
    `<rect x="27" y="21" width="4" height="11" fill="currentColor"/>` +
    `<rect x="10" y="34" width="24" height="3" fill="currentColor"/></svg>`;

  return (
    `<a class="cd-logo" href="${page(ctx, "home")}"` +
    `${inFooter ? "" : ` aria-label="${escape(institution.full)}, inicio"`}>` +
    mark +
    `<span class="cd-logo__type">` +
    `<span class="cd-logo__name">${escape(institution.name)}<br />${escape(institution.suffix)}</span>` +
    `<span class="cd-logo__sub">${escape(institution.descriptor)}</span></span></a>`
  );
}

/* ----------------------------------------------------------------- header */

const CARET =
  '<svg class="cd-nav__caret" viewBox="0 0 12 8" aria-hidden="true" focusable="false" fill="none" ' +
  'stroke="currentColor" stroke-width="1.6"><path d="m1 2 5 5 5-5"/></svg>';

/** Band 1: what this site is, and the reader's own controls. */
function topbar() {
  return `      <div class="cd-topbar">
        <div class="cd-shell cd-topbar__inner">
          <p class="cd-topbar__notice"><span class="cd-topbar__dot"></span>${escape(notice.bar)}</p>
          <div class="cd-tools">
            <div class="cd-tools__group" role="group" aria-label="Tamaño del texto">
              <span class="cd-tools__label" aria-hidden="true">Texto</span>
              <button class="cd-tool" type="button" data-scale="down" aria-label="Reducir el tamaño del texto">A−</button>
              <button class="cd-tool" type="button" data-scale="reset" aria-label="Restablecer el tamaño del texto">A</button>
              <button class="cd-tool" type="button" data-scale="up" aria-label="Aumentar el tamaño del texto">A+</button>
            </div>
            <div class="cd-tools__group">
              <button class="cd-tool" type="button" data-contrast aria-pressed="false">Alto contraste</button>
            </div>
            <div class="cd-tools__group">
              <span class="cd-tool" aria-hidden="true">ES</span>
            </div>
          </div>
        </div>
      </div>`;
}

/** Band 2: emblem, global search, participation. */
function identity(ctx) {
  return `      <div class="cd-identity">
        <div class="cd-shell cd-identity__inner">
${logo(ctx)}
          <search class="cd-search" data-search>
            <form class="cd-search__form" action="${page(ctx, "buscar")}" method="get" role="search">
              <label class="cd-sr" for="cd-q">Buscar en el portal</label>
              <div class="cd-search__field">
                ${icon("search", "cd-search__icon")}
                <input
                  class="cd-search__input"
                  id="cd-q"
                  name="q"
                  type="search"
                  placeholder="Buscar indicadores, normativa, documentos o noticias"
                  autocomplete="off"
                  aria-describedby="cd-q-hint"
                  aria-expanded="false"
                  aria-controls="cd-suggest"
                />
                <button class="cd-search__submit" type="submit">Buscar</button>
              </div>
              <p class="cd-sr" id="cd-q-hint">
                Los resultados se agrupan por indicadores, normativa, documentos, noticias y datos.
              </p>
            </form>
            <div class="cd-suggest" id="cd-suggest" role="listbox" aria-label="Sugerencias" hidden></div>
          </search>
          <div class="cd-identity__end">
            <a class="cd-btn cd-btn--solid" href="${page(ctx, "participacion")}">Participación ciudadana</a>
          </div>
        </div>
      </div>`;
}

/** One mega panel. */
function megaPanel(ctx, item) {
  const columns = (item.columns ?? [])
    .map(
      (column) =>
        `<div class="cd-mega__col"><p class="cd-mega__heading">${escape(column.heading)}</p>` +
        column.links
          .map(
            (link) =>
              `<a class="cd-mega__link" href="${page(ctx, link.route, link.hash)}">${escape(link.label)}</a>`,
          )
          .join("") +
        `</div>`,
    )
    .join("");

  const feature = item.feature
    ? `<div class="cd-mega__feature">` +
      `<p class="cd-mega__feature-title">${escape(item.feature.title)}</p>` +
      `<p class="cd-mega__feature-text">${escape(item.feature.text)}</p>` +
      `<a class="cd-link" href="${page(ctx, item.feature.route)}">Abrir</a></div>`
    : "";

  return `        <div class="cd-mega" id="cd-mega-${item.mega}" data-mega-panel="${item.mega}" hidden>
          <div class="cd-mega__inner">
            <div class="cd-mega__intro">
              <p class="cd-mega__title">${escape(item.label)}</p>
              <p class="cd-mega__summary">${escape(item.summary ?? "")}</p>
            </div>
            ${columns}${feature}
          </div>
        </div>`;
}

/** Band 3: the nine sections. */
function navband(ctx, current) {
  const items = navigation
    .map((item) => {
      const isCurrent = item.route === current;
      const disclosure = item.mega
        ? `<button class="cd-nav__disc" type="button" aria-expanded="false" ` +
          `aria-controls="cd-mega-${item.mega}" aria-label="Abrir el menú de ${escape(item.label)}" ` +
          `data-mega-toggle="${item.mega}">${CARET}</button>`
        : "";

      return (
        `            <li class="cd-nav__item"${item.mega ? ` data-mega-item="${item.mega}"` : ""}` +
        `${isCurrent ? ' aria-current="true"' : ""}>` +
        `<a class="cd-nav__link" href="${page(ctx, item.route)}"${isCurrent ? ' aria-current="page"' : ""}>` +
        `${escape(item.label)}</a>${disclosure}</li>`
      );
    })
    .join("\n");

  const panels = navigation.filter((item) => item.mega).map((item) => megaPanel(ctx, item)).join("\n");

  return `      <div class="cd-navband">
        <div class="cd-shell cd-navband__inner">
          <nav class="cd-nav" aria-label="Navegación principal">
            <ul class="cd-nav__list">
${items}
            </ul>
          </nav>
          <div class="cd-navband__end">
            <a class="cd-navband__link" href="${page(ctx, "contacto")}">Contacto</a>
            <button
              class="cd-burger"
              type="button"
              aria-expanded="false"
              aria-controls="cd-panel"
              aria-label="Abrir el menú"
              data-panel-toggle
            >
              <span class="cd-burger__bar"></span>
              <span class="cd-burger__bar"></span>
            </button>
          </div>
        </div>
${panels}
      </div>`;
}

export function header(ctx, current) {
  return `    <header class="cd-header" data-header>
${topbar()}
${identity(ctx)}
${navband(ctx, current)}
    </header>

${mobilePanel(ctx)}`;
}

/** The narrow-viewport menu: the whole site map, one level deep. */
function mobilePanel(ctx) {
  const groups = navigation
    .map((item, index) => {
      const subLinks = (item.columns ?? []).flatMap((column) => column.links).slice(0, 6);
      return (
        `        <div class="cd-panel__group">` +
        `<a class="cd-panel__link" href="${page(ctx, item.route)}">${escape(item.label)}` +
        `<b>${String(index + 1).padStart(2, "0")}</b></a>` +
        (subLinks.length
          ? `<div class="cd-panel__sub">${subLinks
              .map((link) => `<a href="${page(ctx, link.route, link.hash)}">${escape(link.label)}</a>`)
              .join("")}</div>`
          : "") +
        `</div>`
      );
    })
    .join("\n");

  return `    <div class="cd-panel" id="cd-panel" data-panel>
      <div class="cd-panel__top">
        <p class="cd-label"><span>Menú</span></p>
        <button class="cd-panel__close" type="button" data-panel-close>Cerrar</button>
      </div>
${groups}
      <div class="cd-panel__actions">
        <a class="cd-btn cd-btn--solid" href="${page(ctx, "participacion")}">Participación ciudadana</a>
        <a class="cd-btn cd-btn--ghost" href="${page(ctx, "buscar")}">Buscar en el portal</a>
        <a class="cd-btn cd-btn--ghost" href="${page(ctx, "contacto")}">Contacto</a>
      </div>

      <!-- The same controls the institutional bar carries. On a phone that bar
           folds away on scroll, and accessibility settings that are only
           reachable at the top of a long page are settings nobody uses. -->
      <div class="cd-panel__a11y">
        <p class="cd-label"><span>Accesibilidad</span></p>
        <div class="cd-panel__tools">
          <div class="cd-tools__group" role="group" aria-label="Tamaño del texto">
            <span class="cd-tools__label" aria-hidden="true">Texto</span>
            <button class="cd-tool" type="button" data-scale="down" aria-label="Reducir el tamaño del texto">A−</button>
            <button class="cd-tool" type="button" data-scale="reset" aria-label="Restablecer el tamaño del texto">A</button>
            <button class="cd-tool" type="button" data-scale="up" aria-label="Aumentar el tamaño del texto">A+</button>
          </div>
          <button class="cd-tool" type="button" data-contrast aria-pressed="false">Alto contraste</button>
        </div>
      </div>
    </div>`;
}

/* ----------------------------------------------------------------- footer */

export function siteFooter(ctx) {
  const columns = footer.columns
    .map(
      (column) =>
        `            <div><p class="cd-footer__heading">${escape(column.heading)}</p>` +
        column.links
          .map(
            (link) =>
              `<a class="cd-footer__link" href="${page(ctx, link.route, link.hash)}">${escape(link.label)}</a>`,
          )
          .join("") +
        `</div>`,
    )
    .join("\n");

  const service = footer.service
    .map((link) =>
      link.route
        ? `<a href="${page(ctx, link.route, link.hash)}">${escape(link.label)}</a>`
        : `<a href="#${escape(link.hash)}">${escape(link.label)}</a>`,
    )
    .join("");

  return `      <footer class="cd-footer" id="aviso">
        <div class="cd-shell">
          <div class="cd-footer__top">
            <div class="cd-footer__brand">
${logo(ctx, { inFooter: true })}
              <p class="cd-footer__pitch">${escape(footer.pitch)}</p>
              <p class="cd-footer__pitch">${escape(contact.address)} · ${escape(contact.addressNote)}<br />
              ${escape(contact.email)} · ${escape(contact.emailNote)}</p>
            </div>
            <div class="cd-footer__columns">
${columns}
            </div>
          </div>

          <nav class="cd-footer__service" aria-label="Servicios del portal">${service}</nav>

          <dl class="cd-footer__meta">
            <div><dt>Última actualización</dt><dd>${escape(footer.updated)}</dd></div>
            <div><dt>Versión</dt><dd>${escape(footer.version)}</dd></div>
            <div><dt>Licencia de datos</dt><dd>Datos abiertos con atribución</dd></div>
            <div><dt>Cartografía</dt><dd>Límites administrativos: geoBoundaries, CC BY 4.0</dd></div>
          </dl>
        </div>

        <div class="cd-footer__notice">
          <div class="cd-shell cd-footer__notice-inner">
            <p>${escape(notice.long)} ${escape(notice.data)}</p>
            <p>&copy; <span data-current-year>2026</span> ${escape(institution.full)}</p>
          </div>
        </div>
      </footer>`;
}

/* ------------------------------------------------------------------ badge */

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
  return `    <svg class="cd-sprite" aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute">
      <defs>${MARK.defs}</defs>
    </svg>

    <a class="cd-badge" href="${asset(ctx, "index.html")}#proyectos">
      <svg class="cd-badge__mark" viewBox="0 0 362 422" aria-hidden="true" focusable="false">${MARK.paths}</svg>
      <span class="cd-badge__tag">${escape(notice.tag)}</span>
      <span class="cd-badge__label">${escape(notice.short)}<span class="cd-badge__more"> · sitio de ejemplo de CoreStruct</span></span>
    </a>`;
}

/* -------------------------------------------------------------------- page */

/** Assemble a complete document. */
export function document_({ ctx, meta, current, body, bare = false }) {
  if (bare) {
    return `<!doctype html>
<html lang="es">
  <head>
${documentHead(ctx, meta)}
  </head>

  <body>
${body}

    <script type="module" src="${asset(ctx, "src/scripts/cede/main.js")}"></script>
  </body>
</html>
`;
  }

  return `<!doctype html>
<html lang="es">
  <head>
${documentHead(ctx, meta)}
  </head>

  <body>
    <a class="cd-skip" href="#contenido">Saltar al contenido</a>

${badge(ctx)}

${header(ctx, current)}

    <main id="contenido">
${body}
    </main>

${siteFooter(ctx)}

    <div class="cd-tip" data-tip-box role="status" aria-live="polite"></div>

    <script type="module" src="${asset(ctx, "src/scripts/cede/main.js")}"></script>
  </body>
</html>
`;
}

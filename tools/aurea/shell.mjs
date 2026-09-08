/**
 * The chrome every AUREA page carries.
 *
 * Document head, the three header bands with their mega panels, the phone
 * menu, the bottom bar, the search overlay, the footer and the badge that
 * keeps the fiction honest. All of it is emitted at build time: a visitor gets
 * real HTML with the navigation, the search index and the notices already in
 * it, and JavaScript only adds disclosure behaviour on top.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { escape, fold, shortDate } from "../../src/data/aurea/format.js";
import {
  contact,
  footer,
  institution,
  mobileBar,
  navigation,
  notice,
  quickAccess,
  routes,
} from "../../src/data/aurea/institution.js";
import { programs, labelOf, levels } from "../../src/data/aurea/programs.js";
import { articles } from "../../src/data/aurea/news.js";
import { allEvents } from "../../src/data/aurea/calendar.js";
import { faculty, offices } from "../../src/data/aurea/people.js";
import { documents } from "../../src/data/aurea/resources.js";
import { asset, icon, page, sub } from "./blocks.mjs";
import { bandArt, isotype, plate } from "./art.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export const ORIGIN = institution.origin;

/* -------------------------------------------------------------------- head */

/**
 * `<head>`, complete.
 *
 * Two decisions here are policy rather than convention. First, every page is
 * `noindex`: an invented school must never surface in a search result as a
 * real one, and a family searching for a place to enrol a child is exactly the
 * person who must not find this. Second, the structured data declares
 * `Organization` and never `EducationalOrganization` — a schema type is a
 * factual claim, and this entity is a demonstration.
 */
export function documentHead(ctx, meta) {
  const title = `${meta.title} · ${institution.name}`;
  const description = meta.description.replace(/\s+/g, " ").trim().slice(0, 300);
  const canonical = `${ORIGIN}/${meta.canonical ?? ""}`;

  return `    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}" />
    <link rel="canonical" href="${escape(canonical)}" />

    <!-- AUREA does not exist. A demonstration of a school must never reach a
         search result as a real one — the person who would find it is a family
         looking for somewhere to enrol a child — so every page is noindex. -->
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="#102a43" />
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
      href="${asset(ctx, "assets/fonts/manrope-latin.woff2")}"
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

    <link rel="stylesheet" href="${asset(ctx, "dist/aurea.css")}" />

    <script type="application/ld+json">
${JSON.stringify(schemaFor(meta), null, 6).replace(/^/gm, "      ")}
    </script>

    <!-- Runs before first paint, and does exactly one thing: mark the document
         scripted so the reveal system may hide what it is about to animate.
         The timer is the safety net — if the behaviour module never loads, the
         mark is removed and nothing is left invisible. A school portal where a
         blocked script hides the admissions requirements is not acceptable. -->
    <script>
      (function () {
        var root = document.documentElement;
        root.classList.add("js");
        setTimeout(function () {
          if (!root.dataset.revealsReady) root.classList.remove("js");
        }, 2500);
      })();
    </script>`;
}

/* --------------------------------------------------------- structured data */

/**
 * `Organization`, never `EducationalOrganization`.
 *
 * Publishing `EducationalOrganization`, `CollegeOrUniversity` or `Course` for
 * an invented institution would be the one part of this demonstration capable
 * of misleading a machine as well as a person — a course card in a search
 * result, an institution in a knowledge panel. The
 * `disambiguatingDescription` says what this is in plain words.
 */
function schemaFor(meta) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: institution.full,
    alternateName: institution.name,
    url: `${ORIGIN}/`,
    description: institution.summary,
    disambiguatingDescription:
      "Institución ficticia. Portal de demostración creado por CoreStruct; no representa a " +
      "ningún colegio, instituto ni universidad real, y su oferta académica no existe.",
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
    item: `${ORIGIN}/${item.route ? routes[item.route] : (item.path ?? "")}`,
  })),
});

/**
 * An article, as `Article` rather than `NewsArticle`.
 *
 * The looser type is deliberate: `NewsArticle` invites a news surface to treat
 * an invented story as reporting.
 */
export const articleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  datePublished: article.date,
  description: `${article.summary} Contenido demostrativo de una institución ficticia.`,
  author: { "@type": "Organization", name: institution.full },
  publisher: { "@type": "Organization", name: institution.full },
  isAccessibleForFree: true,
});

/**
 * The FAQ schema is the one rich result this portal DOES publish, because a
 * question-and-answer pair about an institution that declares itself fictional
 * cannot be mistaken for an offer. Every answer carries the disclaimer anyway.
 */
export const faqSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: `${item.a} (Contenido demostrativo: AUREA es una institución ficticia.)`,
    },
  })),
});

/* -------------------------------------------------------------------- logo */

export function logo(ctx, { inFooter = false } = {}) {
  return (
    `<a class="au-logo" href="${page(ctx, "home")}"` +
    `${inFooter ? "" : ` aria-label="${escape(institution.full)}, inicio"`}>` +
    isotype() +
    `<span class="au-logo__type">` +
    `<span class="au-logo__name">${escape(institution.name)}</span>` +
    `<span class="au-logo__sub">${escape(institution.descriptor)}</span></span></a>`
  );
}

/* ------------------------------------------------------------------ header */

const CARET =
  '<svg class="au-nav__caret" width="14" height="9" viewBox="0 0 14 9" aria-hidden="true" ' +
  'focusable="false" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m1 1.5 6 6 6-6"/></svg>';

/** Band 1: the shortcuts for the people who are already inside the institution. */
function topbar(ctx) {
  const links = quickAccess
    .map(
      (item) =>
        `<a class="au-quick__link${item.external ? " au-quick__link--out" : ""}" ` +
        `href="${page(ctx, item.route, item.hash)}">${escape(item.label)}` +
        (item.external ? '<span class="au-quick__out" aria-hidden="true">↗</span>' : "") +
        `</a>`,
    )
    .join("");

  return `      <div class="au-topbar">
        <div class="au-shell au-topbar__inner">
          <p class="au-topbar__notice"><span class="au-topbar__dot"></span>${escape(notice.bar)}</p>
          <nav class="au-quick" aria-label="Accesos rápidos">${links}</nav>
        </div>
      </div>`;
}

/** Band 2: emblem, search, the admissions call to action. */
function identity(ctx) {
  return `      <div class="au-identity">
        <div class="au-shell au-identity__inner">
${logo(ctx)}
          <div class="au-identity__end">
            <button
              class="au-iconbtn"
              type="button"
              data-search-toggle
              aria-expanded="false"
              aria-controls="au-search"
              aria-label="Buscar en el portal"
            >
              ${icon("search", "", 20)}<span aria-hidden="true">Buscar</span>
            </button>

            <a class="au-btn au-btn--solid au-identity__cta" href="${page(ctx, "admisiones")}">
              Aplicar ahora
            </a>

            <button
              class="au-iconbtn au-burger"
              type="button"
              aria-expanded="false"
              aria-controls="au-panel"
              data-panel-toggle
            >
              <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true" focusable="false"
                fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <path d="M1 1.5h18M1 12.5h18M1 7h18" />
              </svg>
              <span>Menú</span>
            </button>
          </div>
        </div>
      </div>`;
}

/** One mega panel. */
function megaPanel(ctx, item) {
  const columns = (item.columns ?? [])
    .map(
      (column) =>
        `<div><p class="au-mega__heading">${escape(column.heading)}</p>` +
        column.links
          .map((link) => {
            const target = link.dir ? sub(ctx, link.dir, link.slug) : page(ctx, link.route, link.hash);
            return `<a class="au-mega__link" href="${target}">${escape(link.label)}</a>`;
          })
          .join("") +
        `</div>`,
    )
    .join("");

  const feature = item.feature
    ? `<div class="au-mega__feature">` +
      `<p class="au-mega__feature-title">${escape(item.feature.title)}</p>` +
      `<p class="au-mega__feature-text">${escape(item.feature.text)}</p>` +
      `<a class="au-link" href="${page(ctx, item.feature.route, item.feature.hash)}">Abrir</a></div>`
    : "";

  /* Two-column panels leave a gap in a five-column grid, so the columns that
     exist are told to fill it. */
  const short = (item.columns ?? []).length < 3;

  return `        <div class="au-mega" id="au-mega-${item.mega}" data-mega-panel="${item.mega}" hidden>
          <div class="au-mega__inner"${short ? ' style="grid-template-columns:minmax(0,0.85fr) repeat(2,minmax(0,1.2fr)) minmax(0,0.95fr)"' : ""}>
            <div class="au-mega__intro">
              <p class="au-mega__title">${escape(item.label)}</p>
              <p class="au-mega__summary">${escape(item.summary ?? "")}</p>
            </div>
            ${columns}${feature}
          </div>
        </div>`;
}

/** Band 3: the six sections. */
function navband(ctx, current) {
  const items = navigation
    .map((item) => {
      const isCurrent = item.route === current;
      const disclosure = item.mega
        ? `<button class="au-nav__disc" type="button" aria-expanded="false" ` +
          `aria-controls="au-mega-${item.mega}" aria-label="Abrir el menú de ${escape(item.label)}" ` +
          `data-mega-toggle="${item.mega}">${CARET}</button>`
        : "";

      return (
        `            <li class="au-nav__item"${item.mega ? ` data-mega-item="${item.mega}"` : ""}` +
        `${isCurrent ? ' aria-current="true"' : ""}>` +
        `<a class="au-nav__link" href="${page(ctx, item.route)}"${isCurrent ? ' aria-current="page"' : ""}>` +
        `${escape(item.label)}</a>${disclosure}</li>`
      );
    })
    .join("\n");

  const panels = navigation.filter((item) => item.mega).map((item) => megaPanel(ctx, item)).join("\n");

  return `      <div class="au-navband">
        <div class="au-shell au-navband__inner">
          <nav class="au-nav" aria-label="Navegación principal">
            <ul class="au-nav__list">
${items}
            </ul>
          </nav>
          <div class="au-navband__end">
            <a class="au-btn au-btn--small au-btn--ghost" href="${page(ctx, "campus", "visita")}">Visitar el campus</a>
            <a class="au-btn au-btn--small au-btn--ghost" href="${page(ctx, "contacto")}">Contacto</a>
          </div>
        </div>
${panels}
      </div>`;
}

export function header(ctx, current) {
  return `    <header class="au-header" data-header>
${topbar(ctx)}
${identity(ctx)}
${navband(ctx, current)}
    </header>

${mobilePanel(ctx)}
${bottomBar(ctx, current)}
${searchOverlay(ctx)}`;
}

/* -------------------------------------------------------------- phone menu */

/**
 * The phone menu leads with tasks and keeps the site map behind disclosures.
 *
 * Six sections with up to nine sub-pages each is four screens of scrolling if
 * opened flat, which pushes the last two sections somewhere nobody goes. So
 * the shortcuts come first — a phone visit is almost always one of them — and
 * each section is a link with its contents one tap away.
 */
function mobilePanel(ctx) {
  const tasks = [
    { label: "Admisiones", note: "Cómo aplicar", route: "admisiones" },
    { label: "Carreras", note: "Media y superior", route: "oferta" },
    { label: "Calendario", note: "Fechas y eventos", route: "calendario" },
    { label: "Costos y becas", note: "Calculadora", route: "costos" },
    { label: "Portal estudiantil", note: "Notas y pagos", route: "portalEstudiante" },
    { label: "Portal de padres", note: "Asistencia y avisos", route: "portalPadres" },
  ]
    .map(
      (task) =>
        `<a class="au-panel__task" href="${page(ctx, task.route)}">${escape(task.label)}` +
        `<span>${escape(task.note)}</span></a>`,
    )
    .join("");

  const groups = navigation
    .map((item, index) => {
      const subLinks = (item.columns ?? []).flatMap((column) => column.links).slice(0, 8);
      const id = `au-panel-${item.route}`;

      return (
        `        <div class="au-panel__group">` +
        `<div class="au-panel__row">` +
        `<a class="au-panel__link" href="${page(ctx, item.route)}">${escape(item.label)}` +
        `<b>${String(index + 1).padStart(2, "0")}</b></a>` +
        (subLinks.length
          ? `<button class="au-panel__disc" type="button" aria-expanded="false" ` +
            `aria-controls="${id}" aria-label="Ver el contenido de ${escape(item.label)}" ` +
            `data-panel-disc>${CARET}</button>`
          : "") +
        `</div>` +
        (subLinks.length
          ? `<div class="au-panel__sub" id="${id}" hidden>${subLinks
              .map((link) => {
                const target = link.dir
                  ? sub(ctx, link.dir, link.slug)
                  : page(ctx, link.route, link.hash);
                return `<a href="${target}">${escape(link.label)}</a>`;
              })
              .join("")}</div>`
          : "") +
        `</div>`
      );
    })
    .join("\n");

  return `    <div class="au-panel" id="au-panel" data-panel>
      <div class="au-panel__top">
        <p class="au-label" style="margin:0"><span>Menú</span></p>
        <button class="au-panel__close" type="button" data-panel-close>Cerrar</button>
      </div>
      <div class="au-panel__body">
        <div class="au-panel__tasks">${tasks}</div>
${groups}
        <div class="au-panel__actions">
          <a class="au-btn au-btn--solid" href="${page(ctx, "admisiones")}">Aplicar ahora</a>
          <a class="au-btn au-btn--ghost" href="${page(ctx, "campus", "visita")}">Programar una visita</a>
          <a class="au-btn au-btn--ghost" href="${page(ctx, "contacto")}">Contacto</a>
        </div>
      </div>
    </div>`;
}

/* -------------------------------------------------------------- bottom bar */

function bottomBar(ctx, current) {
  const links = mobileBar
    .map(
      (item) =>
        `<a class="au-bar__link" href="${page(ctx, item.route)}"` +
        `${item.route === current ? ' aria-current="page"' : ""}>` +
        `${icon(item.icon, "au-bar__icon", 22)}<span>${escape(item.label)}</span></a>`,
    )
    .join("");

  return `    <nav class="au-bar" data-bar aria-label="Accesos rápidos">${links}</nav>`;
}

/* ---------------------------------------------------------- search overlay */

function searchOverlay(ctx) {
  return `    <div class="au-search" id="au-search" data-search role="dialog" aria-modal="true" aria-label="Buscar en el portal">
      <div class="au-search__sheet">
        <form class="au-search__form" role="search" onsubmit="return false">
          ${icon("search", "", 22)}
          <label class="au-sr" for="au-q">¿Qué estás buscando?</label>
          <input
            class="au-search__input"
            id="au-q"
            type="search"
            placeholder="¿Qué estás buscando?"
            autocomplete="off"
            data-search-input
          />
          <button class="au-search__close" type="button" data-search-close>Cerrar</button>
        </form>
        <div class="au-search__results" data-search-results aria-live="polite">
          <p class="au-search__hint">
            Busca programas, noticias, eventos, docentes, documentos y páginas del portal.
          </p>
        </div>
      </div>
    </div>

    <noscript>
      <p style="padding:1rem;text-align:center">
        La búsqueda global necesita JavaScript. Todo el contenido del portal es accesible desde el
        <a href="${page(ctx, "documentos")}">centro de documentos</a> y la navegación principal.
      </p>
    </noscript>`;
}

/* ------------------------------------------------------------ search index */

/**
 * The whole portal, as one array of small records.
 *
 * `t` type · `n` name · `d` description · `u` url · `f` folded name ·
 * `h` folded haystack. The keys are one letter because this ships in every
 * page: eighty records at full key names would be a third larger for no
 * benefit a reader can perceive.
 *
 * A real deployment replaces this island with a query against the CMS. Nothing
 * in `scripts/aurea/search.js` would change.
 */
export function searchIndex(ctx) {
  const records = [];

  const add = (t, n, d, u, extra = "") =>
    records.push({ t, n, d, u, f: fold(n), h: fold(`${n} ${d} ${extra}`) });

  for (const program of programs) {
    add(
      "programa",
      program.name,
      `${program.levels.map((level) => labelOf(levels, level)).join(" · ")} · ${program.duration}`,
      sub(ctx, "programas", program.slug),
      `${program.tagline} ${program.summary} ${program.careers.join(" ")}`,
    );
  }

  for (const article of articles) {
    add("noticia", article.title, shortDate(article.date), sub(ctx, "noticias", article.slug), article.summary);
  }

  for (const event of allEvents) {
    add("evento", event.title, `${shortDate(event.date)} · ${event.place}`, page(ctx, "calendario"), event.text);
  }

  for (const person of faculty) {
    add("docente", person.name, person.role, `${page(ctx, "docentes")}#${person.id}`, `${person.title} ${person.courses.join(" ")} ${person.research}`);
  }

  for (const office of offices) {
    add("oficina", office.name, office.lead, `${page(ctx, "directorio")}#${office.id}`, office.does);
  }

  for (const document_ of documents) {
    add("documento", document_.title, `${document_.format} · ${document_.size}`, page(ctx, "documentos"), document_.audience);
  }

  const pages = [
    ["Institución", "Historia, misión, modelo educativo y autoridades", "institucion"],
    ["Oferta académica", "Buscador de programas de media y superior", "oferta"],
    ["Admisiones", "Proceso, requisitos, fechas y checklist", "admisiones"],
    ["Becas y financiamiento", "Cinco programas de beca y simulador", "becas"],
    ["Costos", "Aranceles y calculadora de matrícula", "costos"],
    ["Calendario", "Eventos por categoría y por audiencia", "calendario"],
    ["Noticias y comunicados", "Actualidad de la institución", "noticias"],
    ["Vida estudiantil", "Clubes, deportes, arte y voluntariado", "vida"],
    ["Galería", "El campus, las aulas y la vida estudiantil en imágenes", "galeria"],
    ["Campus", "Espacios, tour virtual y visitas", "campus"],
    ["Investigación", "Centros, proyectos y publicaciones", "investigacion"],
    ["Docentes", "Directorio de la planta docente", "docentes"],
    ["Directorio institucional", "Oficinas, contactos y horarios", "directorio"],
    ["Biblioteca", "Catálogo, repositorio y recursos digitales", "biblioteca"],
    ["Apoyo al estudiante", "Tutorías, bienestar, inclusión y empleabilidad", "apoyo"],
    ["Empleabilidad", "Bolsa de empleo, prácticas y empresas aliadas", "empleabilidad"],
    ["Egresados", "Red AUREA, beneficios y educación continua", "egresados"],
    ["Internacional", "Movilidad, convenios y estudiantes internacionales", "internacional"],
    ["Documentos", "Centro documental con búsqueda y filtros", "documentos"],
    ["Preguntas frecuentes", "Respuestas por audiencia", "faq"],
    ["Contacto", "Mapa, teléfonos y departamentos", "contacto"],
    ["Portal estudiantil", "Demostración del portal del estudiante", "portalEstudiante"],
    ["Portal de padres", "Demostración del portal de familias", "portalPadres"],
    ["Campus virtual", "Vista previa del entorno de aprendizaje", "campusVirtual"],
  ];

  for (const [name, description, route] of pages) add("pagina", name, description, page(ctx, route));

  return records;
}

/** A JSON island. Escaped so a `</script>` inside a string cannot close it. */
export const island = (id, data) =>
  `    <script type="application/json" id="${id}">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

/* ------------------------------------------------------------------ footer */

export function siteFooter(ctx) {
  const columns = footer.columns
    .map(
      (column) =>
        `            <div><p class="au-footer__heading">${escape(column.heading)}</p>` +
        column.links
          .map(
            (link) =>
              `<a class="au-footer__link" href="${page(ctx, link.route, link.hash)}">${escape(link.label)}</a>`,
          )
          .join("") +
        `</div>`,
    )
    .join("\n");

  const social = footer.social
    .map((item) => `<span><b>${escape(item.label)}</b> <span>${escape(item.handle)}</span></span>`)
    .join("");

  const service = footer.service
    .map((link) => `<a href="${page(ctx, link.route, link.hash)}">${escape(link.label)}</a>`)
    .join("");

  return `      <footer class="au-footer">
        <div class="au-shell">
          <div class="au-footer__top">
            <div class="au-footer__brand">
${logo(ctx, { inFooter: true })}
              <p class="au-footer__pitch">${escape(footer.pitch)}</p>
              <p class="au-footer__contact">
                ${escape(contact.campus)}<br />
                ${escape(contact.address)}<br />
                ${escape(contact.addressCity)} · <em>${escape(contact.addressNote)}</em><br />
                ${escape(contact.phone)} · ${escape(contact.email)}
              </p>
            </div>
            <div class="au-footer__columns">
${columns}
            </div>
          </div>

          <div class="au-footer__social">${social}</div>

          <nav class="au-footer__service" aria-label="Servicios del portal">${service}</nav>

          <dl class="au-footer__meta">
            <div><dt>Última actualización</dt><dd>${escape(footer.updated)}</dd></div>
            <div><dt>Versión</dt><dd>${escape(footer.version)}</dd></div>
            <div><dt>Accesibilidad</dt><dd>WCAG 2.2 AA como criterio de diseño</dd></div>
            <div><dt>Naturaleza del sitio</dt><dd>Demostración · institución ficticia</dd></div>
          </dl>

          <div class="au-footer__by">
            <p class="au-footer__by-label">Project by CoreStruct</p>
            <p class="au-footer__by-text">
              Esta experiencia es una demostración de cómo diseñamos y desarrollamos el
              ecosistema digital de una institución educativa.
            </p>
            <p><a class="au-link" href="${asset(ctx, "index.html")}#contacto">Quiero un portal como este →</a></p>
          </div>
        </div>

        <div class="au-footer__notice">
          <div class="au-shell au-footer__notice-inner">
            <p>${escape(notice.long)} ${escape(notice.data)}</p>
            <p>&copy; <span data-current-year>2026</span> ${escape(institution.full)}</p>
          </div>
        </div>
      </footer>`;
}

/* ------------------------------------------------------------------- badge */

/** The CoreStruct isotype, for the badge that credits the demonstration. */
function corestructMark() {
  const svg = readFileSync(join(ROOT, "assets", "brand", "isotipo.svg"), "utf8");
  return {
    defs: (svg.match(/<defs>([\s\S]*?)<\/defs>/)?.[1] ?? "").replace(/\s+/g, " ").trim(),
    paths: (svg.match(/<path[\s\S]*?\/>/g)?.join("") ?? "").replace(/\s+/g, " ").trim(),
  };
}

const MARK = corestructMark();

/** The one element on the page that is not part of the fiction. */
export function badge(ctx) {
  return `    <svg class="au-sprite" aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute">
      <defs>${MARK.defs}</defs>
    </svg>

    <a class="au-badge" href="${asset(ctx, "index.html")}#proyectos">
      <svg class="au-badge__mark" viewBox="0 0 362 422" aria-hidden="true" focusable="false">${MARK.paths}</svg>
      <span class="au-badge__tag">${escape(notice.tag)}</span>
      <span class="au-badge__label">${escape(notice.short)}<span class="au-badge__more"> · sitio de ejemplo de CoreStruct</span></span>
    </a>`;
}

/* -------------------------------------------------------------------- page */

/**
 * Assemble a complete document.
 *
 * `bare` is for the three product demonstrations: they have their own chrome —
 * a signed-in bar instead of a public header — so they take the head, the
 * badge and the scripts and supply the rest themselves.
 */
export function document_({ ctx, meta, current, body, bare = false, islands = "" }) {
  const scripts =
    `${islands}\n    <div class="au-toast" data-toast role="status" aria-live="polite"></div>\n` +
    `    <script type="module" src="${asset(ctx, "src/scripts/aurea/main.js")}"></script>`;

  if (bare) {
    return `<!doctype html>
<html lang="es">
  <head>
${documentHead(ctx, meta)}
  </head>

  <body>
    <a class="au-skip" href="#contenido">Saltar al contenido</a>

${badge(ctx)}

${body}

${scripts}
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
    <a class="au-skip" href="#contenido">Saltar al contenido</a>

${badge(ctx)}

${header(ctx, current)}

    <main id="contenido">
${body}
    </main>

${siteFooter(ctx)}

${scripts}
  </body>
</html>
`;
}

/* --------------------------------------------------------------- page head */

/**
 * The navy band that opens every interior page.
 *
 * `art` names a plate, and every interior page names one: the band behind the
 * title is then a scene from that part of the institution rather than the same
 * abstract lattice twenty times. Pages that do not name one fall back to the
 * lattice, which is what the lattice is for.
 */
export function pageHead({ crumbs: crumbsHtml, label, title, lead, aside, art }) {
  return `      <section class="au-pagehead">
        <div class="au-pagehead__art">${art ? plate(art) : bandArt()}</div>
        <div class="au-pagehead__veil"></div>
        <div class="au-shell au-pagehead__inner">
          <div class="au-pagehead__text">
            ${crumbsHtml}
            <p class="au-label">${label ? `<span>${escape(label)}</span>` : ""}</p>
            <h1 class="au-pagehead__title">${escape(title)}</h1>
            ${lead ? `<p class="au-pagehead__lead">${escape(lead)}</p>` : ""}
            ${aside ?? ""}
          </div>
        </div>
      </section>`;
}

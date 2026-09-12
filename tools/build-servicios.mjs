/**
 * Renders the service pages into `servicios/`: `npm run build:servicios`.
 *
 *   servicios/index.html                              the hub
 *   servicios/diseno-de-paginas-web-honduras/          "diseño de páginas web en Honduras"
 *   servicios/desarrollo-de-sistemas-honduras/         "desarrollo de sistemas Honduras"
 *   servicios/desarrollo-web-tegucigalpa/              "desarrollo web Tegucigalpa"
 *
 * Why these exist at all: the home page is one URL, and one URL ranks for one
 * idea. Asked to rank for three different searches it competes with itself and
 * Google picks whichever it judges the page is most about — never all three.
 * A page per query is not a trick, it is the honest shape of the answer: each
 * one is written for the person who typed that particular thing.
 *
 * Every page is a directory with an `index.html`, so the URL ends in a slash
 * and carries no extension. That is cosmetic for a reader and not for a link:
 * `/servicios/desarrollo-web-tegucigalpa/` is the URL somebody will paste into
 * a WhatsApp message, and `.html` in it is a detail of how this site happens to
 * be hosted leaking into an address that should outlive the hosting.
 *
 * The pages are deliberately plain compared with the home page. No full-screen
 * hero, no scroll choreography: a visitor who arrived from a search result has
 * a question, and the answer should be above the fold rather than behind an
 * animation. They keep the header, the footer, the quote panel and the reveal
 * system, so they still read as the same site.
 *
 * Content is in `src/data/servicios.js`; the English mirror and the sitemap
 * entries follow automatically on the next `npm run build`, because
 * `build-i18n.mjs` and `build-seo.mjs` both walk the tree rather than a list.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { readIsotype, renderSprite } from "./lib/brand.mjs";
import { servicios, serviciosIndex } from "../src/data/servicios.js";
import { site } from "../src/data/site.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = site.url.replace(/\/+$/, "");
const ORG = `${ORIGIN}/#organization`;

const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** `../` repeated: how far this page sits below the site root. */
const up = (depth) => "../".repeat(depth);

/**
 * JSON-LD, indented to sit inside the head.
 *
 * `</script>` inside a string would close the block early; no content here has
 * one, and escaping the slash costs nothing and removes the question.
 */
const jsonLd = (graph) =>
  JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)
    .replace(/</g, "\\u003c")
    .split("\n")
    .map((line) => `      ${line}`)
    .join("\n");

/* ------------------------------------------------------------------- pieces */

const sprite = renderSprite(readIsotype());

/**
 * The header, identical in shape to the home page's.
 *
 * The nav points back at the home page's sections rather than at anything here:
 * these pages are leaves, and their job when somebody wants to look around is
 * to hand them back to the page that shows the work.
 */
const header = (depth) => {
  const home = `${up(depth)}index.html`;
  return `    <header class="header" data-header>
      <div class="header__inner">
        <a class="brand" href="${home}" aria-label="CoreStruct — inicio">
          <svg class="brand__mark" viewBox="0 0 362 422" aria-hidden="true" focusable="false">
            <use href="#cs-isotipo" />
          </svg>
          <span class="brand__wordmark wordmark">CoreStruct</span>
        </a>

        <nav class="header__nav" aria-label="Principal">
          <ul class="nav__list">
            <li><a class="nav__link" href="${up(depth)}servicios/">Servicios</a></li>
            <li><a class="nav__link" href="${home}#proyectos">Proyectos</a></li>
            <li><a class="nav__link" href="${home}#contacto">Contacto</a></li>
          </ul>
        </nav>

        <div class="header__actions">
          <!--lang-switch-->
          <a
            class="button button--ghost button--compact button--pulse header__cta"
            href="${home}#contacto"
            data-cotizador
          >
            Hablemos
            <span class="button__arrow" aria-hidden="true">&rarr;</span>
          </a>
          <button
            class="menu-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="menu-movil"
            aria-label="Abrir menú"
            data-menu-toggle
          >
            <span class="menu-toggle__bar" aria-hidden="true"></span>
            <span class="menu-toggle__bar" aria-hidden="true"></span>
            <span class="menu-toggle__bar" aria-hidden="true"></span>
          </button>
        </div>
      </div>

      <nav class="mobile-nav" id="menu-movil" aria-label="Menú" data-mobile-nav>
        <a class="mobile-nav__link" href="${up(depth)}servicios/">
          <span class="mobile-nav__index">01</span> Servicios
        </a>
        <a class="mobile-nav__link" href="${home}#proyectos">
          <span class="mobile-nav__index">02</span> Proyectos
        </a>
        <a class="mobile-nav__link" href="${home}#contacto">
          <span class="mobile-nav__index">03</span> Contacto
        </a>
        <a class="button button--primary mobile-nav__cta" href="${home}#contacto" data-cotizador>
          Iniciar un proyecto
          <span class="button__arrow" aria-hidden="true">&rarr;</span>
        </a>
      </nav>
    </header>`;
};

const footer = (depth) => {
  const home = `${up(depth)}index.html`;
  return `    <footer class="footer">
      <div class="footer__inner shell">
        <a class="footer__brand" href="${home}" aria-label="CoreStruct — inicio">
          <svg class="footer__mark" viewBox="0 0 362 422" aria-hidden="true" focusable="false">
            <use href="#cs-isotipo" />
          </svg>
          <span class="footer__wordmark wordmark">CoreStruct</span>
        </a>

        <div class="footer__meta">
          <a class="footer__link" href="${up(depth)}servicios/">Servicios</a>
          <a class="footer__link" href="${home}#proyectos">Proyectos</a>
          <a class="footer__link" href="${home}#contacto">Contacto</a>
          <span class="footer__note">
            &copy; <span data-current-year>2026</span>
            CoreStruct
          </span>
        </div>
      </div>
    </footer>`;
};

/**
 * The trail, on the page as well as in the JSON-LD.
 *
 * Google will render a breadcrumb in place of the URL in a result, but it
 * corroborates the structured trail against a visible one before it does.
 */
const crumbs = (depth, trail) =>
  `          <nav class="svc-crumbs" aria-label="Ruta">
${trail
  .map(({ label, href }, index) => {
    const sep = index ? `            <span class="svc-crumbs__sep" aria-hidden="true">/</span>\n` : "";
    const item = href
      ? `            <a href="${escape(href)}">${escape(label)}</a>`
      : `            <span aria-current="page">${escape(label)}</span>`;
    return `${sep}${item}`;
  })
  .join("\n")}
          </nav>`;

/** The quote button, wherever a page offers one. */
const cta = (depth, label) =>
  `            <a
              class="button button--primary button--large"
              href="${up(depth)}index.html#contacto"
              data-cotizador
            >
              ${escape(label)}
              <span class="button__arrow" aria-hidden="true">&rarr;</span>
            </a>`;

/* --------------------------------------------------------------- the shell */

function page({ depth, canonical, title, description, graph, body }) {
  const root = up(depth);
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}" />
    <link rel="canonical" href="${escape(canonical)}" />
    <meta name="theme-color" content="#080b12" />
    <meta name="color-scheme" content="dark" />

    <!-- Open Graph / Twitter -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="CoreStruct" />
    <meta property="og:locale" content="es_HN" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta property="og:url" content="${escape(canonical)}" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(description)}" />
    <meta property="og:image" content="${ORIGIN}/assets/brand/og-card.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="CoreStruct" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(description)}" />
    <meta name="twitter:image" content="${ORIGIN}/assets/brand/og-card.png" />

    <!-- Icons -->
    <link rel="icon" href="${root}favicon.ico" sizes="32x32" />
    <link rel="icon" href="${root}assets/brand/isotipo.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="${root}assets/brand/apple-touch-icon.png" />
    <link rel="manifest" href="${root}site.webmanifest" />

    <link
      rel="preload"
      href="${root}assets/fonts/manrope-latin.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="preload"
      href="${root}assets/fonts/quantify.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link rel="stylesheet" href="${root}dist/corestruct.css" />

    <!-- Same guard as the home page: mark the document scripted before first
         paint, and switch the reveal system off if nothing claims it. -->
    <script>
      document.documentElement.classList.add("js");
      setTimeout(function () {
        if (!document.documentElement.dataset.revealsReady) {
          document.documentElement.classList.remove("js");
        }
      }, 2500);
    </script>

    <script type="application/ld+json">
${jsonLd(graph)}
    </script>
  </head>

  <body>
    <a class="skip-link" href="#contenido">Saltar al contenido</a>

    <canvas class="starfield" data-starfield aria-hidden="true"></canvas>
    <canvas class="spotlight-trail" data-spotlight-trail aria-hidden="true"></canvas>
    <div class="spotlight" data-spotlight aria-hidden="true"></div>

${sprite}

${header(depth)}

    <main id="contenido">
${body}
    </main>

${footer(depth)}

    <script type="module" src="${root}src/scripts/main.js"></script>
    <script type="module" src="${root}src/scripts/cotizador.js"></script>
  </body>
</html>
`;
}

/* ----------------------------------------------------------- the hub page */

function buildIndex() {
  const depth = 1;
  const canonical = `${ORIGIN}/servicios/`;

  const body = `      <section class="svc-hero">
        <div class="shell">
${crumbs(depth, [
  { label: "Inicio", href: `${up(depth)}index.html` },
  { label: "Servicios" },
])}
          <div class="svc-hero__inner">
            <p class="eyebrow" data-reveal="fade">Servicios</p>
            <h1 class="svc-hero__title">${escape(serviciosIndex.h1)}</h1>
            <p class="svc-hero__lede">${escape(serviciosIndex.lede)}</p>
            <div class="svc-hero__actions">
${cta(depth, "Cotizar mi proyecto")}
            </div>
          </div>
        </div>
      </section>

      <span class="connector" aria-hidden="true"></span>

      <section class="section section--tight">
        <div class="shell">
          <div class="svc-prose">
            <div class="svc-prose__block">
              <p>${escape(serviciosIndex.intro)}</p>
            </div>
          </div>

          <div class="svc-related">
${servicios
  .map(
    (service) => `            <a class="svc-related__link" href="${escape(service.slug)}/">
              <span class="svc-related__hint">${escape(service.serviceType)}</span>
              <span class="svc-related__name">${escape(service.h1)}</span>
              <span class="svc-card__body">${escape(service.lede)}</span>
            </a>`,
  )
  .join("\n")}
          </div>
        </div>
      </section>`;

  const graph = [
    { "@type": "Organization", "@id": ORG, name: site.name, url: `${ORIGIN}/` },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Servicios", item: canonical },
      ],
    },
    {
      "@type": "ItemList",
      name: serviciosIndex.h1,
      itemListElement: servicios.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: service.h1,
        url: `${ORIGIN}/servicios/${service.slug}/`,
      })),
    },
  ];

  return {
    file: join("servicios", "index.html"),
    html: page({
      depth,
      canonical,
      title: serviciosIndex.title,
      description: serviciosIndex.description,
      graph,
      body,
    }),
  };
}

/* -------------------------------------------------------- a service page */

function buildService(service) {
  const depth = 2;
  const canonical = `${ORIGIN}/servicios/${service.slug}/`;
  const others = servicios.filter((other) => other.slug !== service.slug);

  const body = `      <section class="svc-hero">
        <div class="shell">
${crumbs(depth, [
  { label: "Inicio", href: `${up(depth)}index.html` },
  { label: "Servicios", href: `${up(depth)}servicios/` },
  { label: service.serviceType },
])}
          <div class="svc-hero__inner">
            <p class="eyebrow" data-reveal="fade">${escape(service.serviceType)}</p>
            <h1 class="svc-hero__title">${escape(service.h1)}</h1>
            <p class="svc-hero__lede">${escape(service.lede)}</p>
            <div class="svc-hero__actions">
${cta(depth, "Cotizar mi proyecto")}
            </div>
          </div>
        </div>
      </section>

      <span class="connector" aria-hidden="true"></span>

      <section class="section section--tight">
        <div class="shell">
          <header class="section__head">
            <p class="eyebrow" data-reveal="fade">${escape(service.intro.eyebrow)}</p>
            <h2 class="section__title" data-reveal="far">${escape(service.intro.title)}</h2>
          </header>
          <p class="section__lede" data-reveal="far">${escape(service.intro.body)}</p>

          <div class="svc-prose" data-reveal="far">
${service.sections
  .map(
    (block) => `            <div class="svc-prose__block">
              <h3 class="svc-prose__title">${escape(block.title)}</h3>
              <p>${escape(block.body)}</p>
            </div>`,
  )
  .join("\n")}
          </div>
        </div>
      </section>

      <section class="section section--tight">
        <div class="shell">
          <header class="section__head">
            <h2 class="section__title" data-reveal="far">${escape(service.includes.title)}</h2>
          </header>
          <div class="svc-grid">
${service.includes.items
  .map(
    (item) => `            <article class="svc-card" data-reveal="far">
              <h3 class="svc-card__name">${escape(item.name)}</h3>
              <p class="svc-card__body">${escape(item.body)}</p>
            </article>`,
  )
  .join("\n")}
          </div>
        </div>
      </section>

      <section class="section section--tight">
        <div class="shell">
          <header class="section__head">
            <h2 class="section__title" data-reveal="far">${escape(service.process.title)}</h2>
          </header>
          <ol class="svc-steps">
${service.process.steps
  .map(
    (step) => `            <li class="svc-steps__item" data-reveal="far">
              <div>
                <h3 class="svc-steps__name">${escape(step.name)}</h3>
                <p class="svc-steps__body">${escape(step.body)}</p>
              </div>
            </li>`,
  )
  .join("\n")}
          </ol>
        </div>
      </section>

      <section class="section section--tight">
        <div class="shell">
          <header class="section__head">
            <h2 class="section__title" data-reveal="far">Preguntas frecuentes</h2>
          </header>
          <div class="svc-faq">
${service.faq
  .map(
    (entry) => `            <details class="svc-faq__item" open>
              <summary class="svc-faq__q">${escape(entry.q)}</summary>
              <p class="svc-faq__a">${escape(entry.a)}</p>
            </details>`,
  )
  .join("\n")}
          </div>

          <div class="svc-cta" data-reveal="far">
            <h2 class="svc-cta__title">¿Hablamos de tu proyecto?</h2>
            <p class="svc-cta__body">
              Cuéntanos qué necesitas y te respondemos con alcance, plazo y precio
              por escrito. La primera conversación no tiene costo.
            </p>
${cta(depth, "Hablemos")}
          </div>

          <div class="svc-related">
${others
  .map(
    (other) => `            <a class="svc-related__link" href="${up(depth)}servicios/${escape(other.slug)}/">
              <span class="svc-related__hint">${escape(other.serviceType)}</span>
              <span class="svc-related__name">${escape(other.h1)}</span>
            </a>`,
  )
  .join("\n")}
          </div>
        </div>
      </section>`;

  const graph = [
    { "@type": "Organization", "@id": ORG, name: site.name, url: `${ORIGIN}/` },
    {
      "@type": "Service",
      name: service.h1,
      serviceType: service.serviceType,
      description: service.description,
      url: canonical,
      provider: { "@id": ORG },
      areaServed: site.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
      /* The steps, as what they are. A process a buyer can read before
         committing is the thing that separates a quote from a gamble. */
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: service.includes.title,
        itemListElement: service.includes.items.map((item) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: item.name, description: item.body },
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Servicios", item: `${ORIGIN}/servicios/` },
        { "@type": "ListItem", position: 3, name: service.serviceType, item: canonical },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: service.faq.map((entry) => ({
        "@type": "Question",
        name: entry.q,
        acceptedAnswer: { "@type": "Answer", text: entry.a },
      })),
    },
  ];

  return {
    file: join("servicios", service.slug, "index.html"),
    html: page({
      depth,
      canonical,
      title: service.title,
      description: service.description,
      graph,
      body,
    }),
  };
}

/* ------------------------------------------------------------------ output */

const written = [];
for (const { file, html } of [buildIndex(), ...servicios.map(buildService)]) {
  const out = join(ROOT, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  written.push({ file: file.split("\\").join("/"), bytes: Buffer.byteLength(html) });
}

const total = written.reduce((sum, item) => sum + item.bytes, 0);
for (const { file, bytes } of written) {
  console.log(`  ${file.padEnd(52)} ${(bytes / 1024).toFixed(1)} KB`);
}
console.log(`  ${written.length} páginas · ${(total / 1024).toFixed(1)} KB`);

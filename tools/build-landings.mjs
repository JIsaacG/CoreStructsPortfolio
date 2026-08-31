/**
 * Renders the two campaign landings behind the "Landing pages" card into
 * `demos/landing/`: Cierzo (a service, booking a consultation) and Lumen (an
 * event, reserving a seat). Content lives in `src/data/landings.js`.
 *
 * Both are one scrolling page, no pinned stage — the whole point of a landing
 * is that nothing competes with the one call to action, so neither page
 * carries the bottle machinery Verbena needs. `npm run build:landing`.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { landings } from "../src/data/landings.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "demos", "landing");
const ORIGIN = "https://corestruct.example/demos/landing";

const escape = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** `#8b5cf6` -> `139 92 246`, the space-separated form every token uses. */
function rgbTriple(hex) {
  const clean = hex.trim().replace("#", "");
  const n = Number.parseInt(clean, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/* ------------------------------------------------------------------ chrome */

function renderHead(page) {
  const title = `${page.brand.name} — ${page.brand.mark}`;
  const description = `${page.brand.sector}. ${page.hero.lead}`.replace(/\s+/g, " ").slice(0, 300);

  return `    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>${escape(title)} · Demo de CoreStruct</title>
    <meta name="description" content="${escape(description)}" />
    <!-- An invented brand must never turn up in a search result as a real one. -->
    <meta name="robots" content="noindex, follow" />
    <meta name="theme-color" content="#080b12" />
    <meta name="color-scheme" content="dark" />

    <link rel="icon" href="../../favicon.ico" sizes="32x32" />
    <link rel="icon" href="../../assets/brand/isotipo.svg" type="image/svg+xml" />

    <link
      rel="preload"
      href="../../assets/fonts/manrope-latin.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />

    <link rel="stylesheet" href="../../dist/demo.css" />

    <style>
      :root {
        --brand-primary: ${page.accent.primary};
        --brand-secondary: ${page.accent.secondary};
        --brand-primary-rgb: ${rgbTriple(page.accent.primary)};
        --brand-secondary-rgb: ${rgbTriple(page.accent.secondary)};
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

function renderBadge() {
  return `    <a class="dm-badge" href="../../index.html#proyectos">
      <svg class="dm-badge__mark" viewBox="0 0 362 422" aria-hidden="true" focusable="false">
        <path fill="#2c6fb2" d="M10 98L17 92L181 1L188 3L354 96L353 99L200 186L185 179L173 181L166 186L11 98Z"/>
        <path fill="#3898d4" d="M188 421L188 373L190 371L320 295L320 248L318 248L188 324L188 217L198 211L202 203L202 197L358 111L361 109L361 165L233 234L233 275L361 200L361 321L189 421Z"/>
        <path fill="#253880" d="M1 107L160 195L166 210L176 216L176 252L174 252L42 176L42 294L114 336L154 359L154 297L176 309L176 422L2 321L1 108Z"/>
      </svg>
      <span class="dm-badge__tag">Demo</span>
      <span class="dm-badge__label">Sitio de ejemplo · CoreStruct</span>
    </a>`;
}

function renderHeader(page, sections) {
  const links = sections
    .map(({ id, label }) => `            <a class="dm-nav__link" href="#${id}" data-nav-link>${escape(label)}</a>`)
    .join("\n");
  const menuLinks = sections
    .map(({ id, label }) => `      <a class="dm-menu__link" href="#${id}">${escape(label)}</a>`)
    .join("\n");

  return `    <header class="dm-header" data-header>
      <div class="dm-header__inner">
        <a class="dm-wordmark" href="#inicio">
          <span class="dm-wordmark__name">${escape(page.brand.name)}</span>
          <span class="dm-wordmark__mark">${escape(page.brand.mark)}</span>
        </a>

        <nav class="dm-nav" aria-label="Secciones">
${links}
        </nav>

        <div class="dm-header__actions">
          <a class="button button--primary" href="#contacto">${escape(page.hero.primaryCta)}</a>
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
      <a class="dm-menu__link" href="#contacto">${escape(page.hero.primaryCta)}</a>
    </div>`;
}

function renderFooter(page) {
  return `      <footer class="dm-footer">
        <div class="dm-shell dm-footer__inner">
          <div class="dm-footer__brand">
            <p class="dm-footer__name">${escape(page.brand.name)}</p>
            <p class="dm-footer__line">${escape(page.brand.mark)}</p>
            <p class="dm-footer__credit">
              Marca ficticia. Sitio de ejemplo construido por
              <a href="../../index.html">CoreStruct</a> &copy; <span data-current-year>2026</span>.
            </p>
          </div>
          <nav class="dm-footer__nav" aria-label="Pie">
            <a href="#inicio">Inicio</a>
            <a href="#faq">Preguntas</a>
            <a href="#contacto">Contacto</a>
            <a href="../../index.html#proyectos">Volver al portafolio</a>
          </nav>
        </div>
      </footer>`;
}

function document_(page, sections, body) {
  return `<!doctype html>
<html lang="es">
  <head>
${renderHead(page)}
  </head>

  <body>
    <a class="skip-link" href="#contenido">Saltar al contenido</a>

${renderBadge()}

${renderHeader(page, sections)}

    <main class="dm" id="contenido">
${body}

${renderFooter(page)}
    </main>

    <script type="module" src="../../src/scripts/demo/shell.js"></script>
  </body>
</html>
`;
}

/* ------------------------------------------------------------------ pieces */

function heroSection(page) {
  const meta = page.hero.meta
    .map((item) => `            <span class="dm-chip"><span class="dm-chip__mark" aria-hidden="true"></span>${escape(item)}</span>`)
    .join("\n");

  return `      <section class="dm-land-hero dm-shell" id="inicio">
        <div class="dm-land-hero__inner">
          <span class="dm-chip" data-reveal="fade">${escape(page.hero.eyebrow)}</span>
          <h1 class="dm-land-hero__title" data-reveal="rise">${escape(page.hero.title)}</h1>
          <p class="dm-land-hero__lead" data-reveal="rise">${escape(page.hero.lead)}</p>
          <div class="dm-land-hero__actions" data-reveal="rise">
            <a class="button button--primary button--large button--pulse" href="#contacto">
              ${escape(page.hero.primaryCta)}
              <span class="button__arrow" aria-hidden="true">&rarr;</span>
            </a>
            <a class="button button--ghost button--large" href="#${page.agenda ? "agenda" : "metodo"}">${escape(page.hero.secondaryCta)}</a>
          </div>
          <div class="dm-land-hero__meta" data-reveal="fade">
${meta}
          </div>
        </div>
      </section>`;
}

function featuresSection(page, { id, heading }) {
  const cards = page.features
    .map(
      (feature) => `          <div class="dm-feature" data-reveal="rise">
            <h3 class="dm-feature__title">${escape(feature.title)}</h3>
            <p class="dm-feature__text">${escape(feature.text)}</p>
          </div>`,
    )
    .join("\n");

  return `      <section class="dm-section dm-shell" id="${id}">
        <div class="dm-land-head">
          <h2 class="dm-land-head__title" data-reveal="fade">${escape(heading)}</h2>
        </div>
        <div class="dm-features" data-reveal-group="90">
${cards}
        </div>
      </section>`;
}

function stepsSection(page) {
  const steps = page.steps
    .map(
      (step, index) => `          <div class="dm-step" data-reveal="rise">
            <p class="dm-step__index" aria-hidden="true">0${index + 1}</p>
            <h3 class="dm-step__title">${escape(step.title)}</h3>
            <p class="dm-step__text">${escape(step.text)}</p>
          </div>`,
    )
    .join("\n");

  return `      <section class="dm-section dm-shell" id="metodo">
        <div class="dm-land-head">
          <h2 class="dm-land-head__title" data-reveal="fade">Cómo trabajamos</h2>
        </div>
        <div class="dm-steps" data-reveal-group="90">
${steps}
        </div>
      </section>`;
}

function testimonialsSection(page) {
  const cards = page.testimonials
    .map(
      (item) => `          <div class="dm-testimonial" data-reveal="rise">
            <p class="dm-testimonial__quote">${escape(item.quote)}</p>
            <span class="dm-testimonial__author">${escape(item.author)}</span>
            <span class="dm-testimonial__role">${escape(item.role)}</span>
          </div>`,
    )
    .join("\n");

  return `      <section class="dm-section dm-shell" id="testimonios">
        <div class="dm-land-head">
          <h2 class="dm-land-head__title" data-reveal="fade">Lo que dicen quienes ya trabajaron con nosotros</h2>
        </div>
        <div class="dm-testimonials" data-reveal-group="90">
${cards}
        </div>
      </section>`;
}

function agendaSection(page) {
  const items = page.agenda
    .map(
      (block) => `          <div class="dm-agenda__item">
            <span class="dm-agenda__time">${escape(block.time)}</span>
            <div>
              <p class="dm-agenda__title">${escape(block.title)}</p>
              ${block.speaker ? `<p class="dm-agenda__speaker">${escape(block.speaker)}</p>` : ""}
            </div>
          </div>`,
    )
    .join("\n");

  return `      <section class="dm-section dm-shell" id="agenda">
        <div class="dm-land-head">
          <h2 class="dm-land-head__title" data-reveal="fade">Agenda del día</h2>
          <p class="dm-land-head__text">14 de noviembre de 2026 — San Pedro Sula</p>
        </div>
        <div class="dm-agenda" data-reveal="rise">
${items}
        </div>
      </section>`;
}

function speakersSection(page) {
  const cards = page.speakers
    .map((speaker) => {
      const initials = speaker.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("");
      return `          <div class="dm-speaker" data-reveal="rise">
            <span class="dm-speaker__mark" aria-hidden="true">${escape(initials)}</span>
            <div>
              <p class="dm-speaker__name">${escape(speaker.name)}</p>
              <p class="dm-speaker__role">${escape(speaker.role)}</p>
            </div>
          </div>`;
    })
    .join("\n");

  return `      <section class="dm-section dm-shell" id="speakers">
        <div class="dm-land-head">
          <h2 class="dm-land-head__title" data-reveal="fade">Quiénes hablan</h2>
        </div>
        <div class="dm-speakers" data-reveal-group="90">
${cards}
        </div>
      </section>`;
}

function faqSection(page) {
  const items = page.faq
    .map(
      (entry) => `          <details class="dm-faq__item">
            <summary>${escape(entry.question)}</summary>
            <p class="dm-faq__answer">${escape(entry.answer)}</p>
          </details>`,
    )
    .join("\n");

  return `      <section class="dm-section dm-shell" id="faq">
        <div class="dm-land-head">
          <h2 class="dm-land-head__title" data-reveal="fade">Preguntas frecuentes</h2>
        </div>
        <div class="dm-faq" data-reveal="rise">
${items}
        </div>
      </section>`;
}

function ctaSection(page) {
  return `      <section class="dm-section dm-shell" id="contacto">
        <div class="dm-cta-band" data-reveal="scale">
          <h2 class="dm-cta-band__title">${escape(page.cta.title)}</h2>
          <p class="dm-cta-band__text">${escape(page.cta.text)}</p>
          <div class="dm-cta-band__actions">
            <a class="button button--primary button--large button--pulse" href="mailto:${escape(page.cta.email)}">
              ${escape(page.hero.primaryCta)}
              <span class="button__arrow" aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>

        <p class="dm-crosslink" data-reveal="fade" style="margin-block-start: var(--space-lg)">
          ¿Buscas algo distinto? Mira el otro ejemplo:
          <a href="${escape(page.crosslink.file)}">${escape(page.crosslink.label)}</a>, ${escape(page.crosslink.text)}.
        </p>
      </section>`;
}

/* -------------------------------------------------------------------- pages */

function buildCierzo(page) {
  const sections = [
    { id: "porque", label: "Por qué Cierzo" },
    { id: "metodo", label: "Método" },
    { id: "testimonios", label: "Testimonios" },
    { id: "faq", label: "Preguntas" },
  ];

  const body = [
    heroSection(page),
    featuresSection(page, { id: "porque", heading: `¿Por qué ${page.brand.name}?` }),
    stepsSection(page),
    testimonialsSection(page),
    faqSection(page),
    ctaSection(page),
  ].join("\n\n");

  return document_(page, sections, body);
}

function buildLumen(page) {
  const sections = [
    { id: "porque", label: "Por qué asistir" },
    { id: "agenda", label: "Agenda" },
    { id: "speakers", label: "Speakers" },
    { id: "faq", label: "Preguntas" },
  ];

  const body = [
    heroSection(page),
    featuresSection(page, { id: "porque", heading: "Por qué asistir" }),
    agendaSection(page),
    speakersSection(page),
    faqSection(page),
    ctaSection(page),
  ].join("\n\n");

  return document_(page, sections, body);
}

/* ------------------------------------------------------------------- write */

mkdirSync(OUT, { recursive: true });

const written = [];
for (const page of landings) {
  const html = page.agenda ? buildLumen(page) : buildCierzo(page);
  const file = join(OUT, `${page.slug}.html`);
  writeFileSync(file, html);
  written.push({ path: `${page.slug}.html`, bytes: Buffer.byteLength(html) });
}

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<!-- Demostración. Cierzo y Lumen son marcas ficticias y sus páginas son noindex. -->\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  written
    .map(({ path }) => `  <url>\n    <loc>${ORIGIN}/${path}</loc>\n    <priority>0.8</priority>\n  </url>`)
    .join("\n") +
  `\n</urlset>\n`;
writeFileSync(join(OUT, "sitemap.xml"), sitemap);

const total = written.reduce((sum, item) => sum + item.bytes, 0);
for (const { path, bytes } of written) {
  console.log(`  demos/landing/${path.padEnd(24)} ${(bytes / 1024).toFixed(1)} KB`);
}
console.log(`  ${written.length} páginas · ${(total / 1024).toFixed(1)} KB`);

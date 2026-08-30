/**
 * Renders `src/data/demos.js` into one complete website per entry, under `demos/`.
 *
 * These pages are what the portfolio's "Explorar" links open. They are built the
 * same way index.html is — content in a data file, markup emitted at build time —
 * so a demo is a real static page with real HTML in it, not a client-rendered
 * mock-up. Editing the data and re-running `npm run build` is the whole workflow.
 *
 * Everything a demo needs beyond the shared foundation is here: the bottle, the
 * flavour palette, and the badge that says out loud that the brand is invented.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { bottle, bottleMini } from "../src/data/bottle.js";
import { demoNavigation, demos } from "../src/data/demos.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "demos");
const ISOTYPE = join(ROOT, "assets", "brand", "isotipo.svg");

const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** `#3898d4` -> `56 152 212`, the space-separated form every token uses. */
function rgbTriple(hex) {
  const clean = hex.trim().replace("#", "");
  const full = clean.length === 3 ? [...clean].map((c) => c + c).join("") : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`not a hex colour: ${hex}`);
  const n = Number.parseInt(full, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** The CoreStruct isotype, for the badge and the closing credit. */
function readIsotype() {
  const svg = readFileSync(ISOTYPE, "utf8");
  const defs = svg.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
  const paths = svg.match(/<path[\s\S]*?\/>/g)?.join("");
  if (!defs || !paths) throw new Error("assets/brand/isotipo.svg is not in the expected shape");
  return { defs, paths };
}

/** Split a headline so the shared reveal system can raise it line by line. */
const revealLines = (lines) =>
  lines
    .map((line) => `<span class="reveal-lines__line"><span>${escape(line)}</span></span>`)
    .join("");

const collapse = (svg) => svg.replace(/\s+/g, " ").trim();

/* ------------------------------------------------------------------- chrome */

function renderHead(demo) {
  const { brand, accent } = demo;
  const title = `${brand.name} — ${brand.mark}`;
  const description =
    `${brand.sector}. ${demo.hero.lead}`.replace(/\s+/g, " ").slice(0, 300);

  return `    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>${escape(title)} · Demo de CoreStruct</title>
    <meta name="description" content="${escape(description)}" />
    <!-- An invented company must never turn up in a search result as a real one. -->
    <meta name="robots" content="noindex, follow" />
    <meta name="theme-color" content="#080b12" />
    <meta name="color-scheme" content="dark" />

    <link rel="icon" href="../favicon.ico" sizes="32x32" />
    <link rel="icon" href="../assets/brand/isotipo.svg" type="image/svg+xml" />

    <link
      rel="preload"
      href="../assets/fonts/manrope-latin.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="preload"
      href="../assets/fonts/quantify.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />

    <link rel="stylesheet" href="../dist/demo.css" />

    <!-- The brand of the day. Everything downstream reads these four values, so
         a demo changes its whole palette from here — and the flavour beat then
         repoints --brand-secondary again while the visitor scrolls. -->
    <style>
      :root {
        --brand-primary: ${demo.flavours[0].deep};
        --brand-secondary: ${demo.flavours[0].tint};
        --brand-primary-rgb: ${rgbTriple(demo.flavours[0].deep)};
        --brand-secondary-rgb: ${rgbTriple(demo.flavours[0].tint)};
        --flavour-tint: ${demo.flavours[0].tint};
        --flavour-deep: ${demo.flavours[0].deep};
      }
    </style>

    <!-- Same failsafe as the portfolio: mark the document scripted before first
         paint, and undo it if the behaviour module never claims the reveals. -->
    <script>
      document.documentElement.classList.add("js");
      setTimeout(function () {
        if (!document.documentElement.dataset.revealsReady) {
          document.documentElement.classList.remove("js");
        }
      }, 2500);
    </script>`;
}

/**
 * The isotype's top face is painted with a gradient, and a gradient needs a
 * <defs> in the document. One hidden SVG carries it for every mark on the page.
 */
function renderSprite({ defs }) {
  return `    <svg class="sprite" aria-hidden="true" focusable="false" width="0" height="0">
      <defs>${collapse(defs)}</defs>
    </svg>`;
}

function renderBadge({ paths }) {
  return `    <a class="dm-badge" href="../index.html#proyectos">
      <svg class="dm-badge__mark" viewBox="0 0 362 422" aria-hidden="true" focusable="false">${collapse(paths)}</svg>
      <span class="dm-badge__tag">Demo</span>
      <span class="dm-badge__label">Sitio de ejemplo · CoreStruct</span>
    </a>`;
}

function renderHeader(demo) {
  const links = demoNavigation
    .map(
      ({ id, label }) =>
        `            <a class="dm-nav__link" href="#${id}" data-nav-link>${escape(label)}</a>`,
    )
    .join("\n");

  const menuLinks = demoNavigation
    .map(({ id, label }) => `      <a class="dm-menu__link" href="#${id}">${escape(label)}</a>`)
    .join("\n");

  return `    <header class="dm-header" data-header>
      <div class="dm-header__inner">
        <a class="dm-wordmark" href="#inicio">
          <span class="dm-wordmark__name">${escape(demo.brand.name)}</span>
          <span class="dm-wordmark__mark">${escape(demo.brand.mark)}</span>
        </a>

        <nav class="dm-nav" aria-label="Secciones">
${links}
        </nav>

        <div class="dm-header__actions">
          <a class="button button--primary" href="#tienda">Comprar</a>
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
      <a class="dm-menu__link" href="#tienda">Comprar</a>
    </div>`;
}

/* --------------------------------------------------------------- the bottle */

/**
 * The pinned bottle and the label type laid over it.
 *
 * The label starts on the first flavour so the page is correct before any script
 * runs; `flavours.js` swaps the two spans from there.
 */
function renderStage(demo) {
  const first = demo.flavours[0];
  return `        <div class="dm-stage" data-stage>
          <div class="dm-bottle" data-stage-mark>
            <svg
              class="dm-bottle__svg"
              viewBox="0 0 260 680"
              aria-hidden="true"
              focusable="false"
            >${collapse(bottle)}</svg>
            <div class="dm-bottle__paper">
              <span class="dm-bottle__house">${escape(demo.brand.name)}</span>
              <span class="dm-bottle__name" data-bottle-name>${escape(first.name)}</span>
              <span class="dm-bottle__note" data-bottle-note>${escape(first.note)}</span>
            </div>
          </div>
        </div>`;
}

/* ------------------------------------------------------------------ sections */

function renderHero(demo) {
  const { hero } = demo;
  const actions = hero.actions
    .map(
      (action) =>
        `              <a class="button${action.primary ? " button--primary" : ""}" href="${escape(action.href)}">${escape(action.label)}</a>`,
    )
    .join("\n");

  return `        <section class="dm-hero" id="inicio" data-stage-frame='{"x":19,"scale":1,"rot":-3,"fade":1}'>
          <div class="dm-shell">
            <div class="dm-grid">
              <div class="dm-grid__body dm-grid__body--start">
                <p class="dm-hero__eyebrow">${escape(hero.eyebrow)}</p>
                <h1 class="dm-hero__title reveal-lines" data-reveal="fade">${revealLines(hero.lines)}</h1>
                <p class="dm-hero__lead">${escape(hero.lead)}</p>
                <div class="dm-hero__actions">
${actions}
                </div>
                <p class="dm-cue">
                  <span class="dm-cue__rail"></span>
                  ${escape(hero.cue)}
                </p>
              </div>
            </div>
          </div>
        </section>`;
}

/**
 * Where the bottle stands while a flavour is being read.
 *
 * Without a frame per beat the whole flavour section would be one long slide
 * from the section's frame to the recipe's, and the bottle would drift straight
 * across the text on its way. These keep it parked on the right, swaying just
 * enough that flicking through the recipes turns it in the hand.
 */
const FLAVOUR_FRAMES = [
  { x: 21, scale: 0.86, rot: 5 },
  { x: 24, scale: 0.82, rot: -4 },
  { x: 20, scale: 0.88, rot: 7 },
  { x: 24, scale: 0.83, rot: -3 },
  { x: 21, scale: 0.86, rot: 6 },
];

function renderFlavours(demo) {
  const total = String(demo.flavours.length).padStart(2, "0");

  const beats = demo.flavours
    .map((flavour, index) => {
      const position = String(index + 1).padStart(2, "0");
      const frame = FLAVOUR_FRAMES[index % FLAVOUR_FRAMES.length];
      return `              <article
                class="dm-flavour"
                id="sabor-${escape(flavour.id)}"
                data-stage-frame='${JSON.stringify(frame)}'
                data-flavour
                data-tint="${escape(flavour.tint)}"
                data-deep="${escape(flavour.deep)}"
                data-tint-rgb="${rgbTriple(flavour.tint)}"
                data-deep-rgb="${rgbTriple(flavour.deep)}"
                data-flavour-name="${escape(flavour.name)}"
                data-flavour-note="${escape(flavour.note)}"
              >
                <p class="dm-flavour__index"><b>${position}</b> / ${total}</p>
                <h3 class="dm-flavour__name">${escape(flavour.name)}</h3>
                <p class="dm-flavour__note">${escape(flavour.note)}</p>
                <p class="dm-flavour__text">${escape(flavour.text)}</p>
                <dl class="dm-flavour__facts">
                  <div>
                    <dt>Marida con</dt>
                    <dd>${escape(flavour.pairs)}</dd>
                  </div>
                  <div>
                    <dt>Alcohol</dt>
                    <dd>${escape(flavour.abv)}</dd>
                  </div>
                  <div>
                    <dt>Botella 500 ml</dt>
                    <dd class="dm-flavour__price">${escape(flavour.price)}</dd>
                  </div>
                </dl>
              </article>`;
    })
    .join("\n");

  const { flavoursIntro: intro } = demo;

  return `        <section class="dm-section" id="sabores" data-stage-frame='{"x":22,"scale":0.86,"rot":6,"fade":1}'>
          <div class="dm-shell">
            <div class="dm-grid">
              <div class="dm-grid__body dm-grid__body--start">
                <header class="dm-flavours__head" data-reveal="rise">
                  <p class="dm-label"><span class="dm-label__index">01</span> ${escape(intro.label)}</p>
                  <h2 class="dm-title">${escape(intro.title)}</h2>
                  <p class="dm-text">${escape(intro.text)}</p>
                </header>
${beats}
              </div>
            </div>
          </div>
        </section>`;
}

function renderSpec(demo) {
  const items = demo.spec.items
    .map(
      (item) => `                  <li class="dm-spec__item">
                    <p class="dm-spec__value">${escape(item.value)}<span class="dm-spec__unit">${escape(item.unit)}</span></p>
                    <h3 class="dm-spec__name">${escape(item.name)}</h3>
                    <p class="dm-spec__text">${escape(item.text)}</p>
                  </li>`,
    )
    .join("\n");

  return `        <section class="dm-section" id="receta" data-stage-frame='{"x":-23,"scale":0.8,"rot":-7,"fade":1}'>
          <div class="dm-shell">
            <div class="dm-grid">
              <div class="dm-grid__body dm-grid__body--end" data-reveal="rise" data-reveal-group>
                <p class="dm-label"><span class="dm-label__index">02</span> ${escape(demo.spec.label)}</p>
                <h2 class="dm-title">${escape(demo.spec.title)}</h2>
                <p class="dm-note">${escape(demo.spec.note)}</p>
                <ol class="dm-spec__list">
${items}
                </ol>
              </div>
            </div>
          </div>
        </section>`;
}

function renderStory(demo) {
  const items = demo.story.steps
    .map(
      (step) => `              <li class="dm-story__item" data-reveal="far">
                <p class="dm-story__stamp">${escape(step.stamp)}</p>
                <h3 class="dm-story__title">${escape(step.title)}</h3>
                <p class="dm-story__text">${escape(step.text)}</p>
              </li>`,
    )
    .join("\n");

  return `        <section class="dm-section" id="casa" data-stage-frame='{"x":0,"y":2,"scale":0.6,"rot":0,"split":1,"fade":0.5}'>
          <div class="dm-shell">
            <header class="dm-shop__head" data-reveal="rise">
              <p class="dm-label"><span class="dm-label__index">03</span> ${escape(demo.story.label)}</p>
              <h2 class="dm-title">${escape(demo.story.title)}</h2>
            </header>
            <ol class="dm-story__list">
${items}
            </ol>
          </div>
        </section>`;
}

/* ---------------------------------------------------------------- the shop */

function renderShop(demo) {
  const products = demo.flavours
    .map(
      (flavour) => `              <article
                class="dm-product"
                style="--product-tint: ${escape(flavour.tint)}; --product-tint-rgb: ${rgbTriple(flavour.tint)}"
                data-reveal="rise"
              >
                <div class="dm-product__shelf">
                  <svg
                    class="dm-product__bottle"
                    viewBox="0 0 260 680"
                    aria-hidden="true"
                    focusable="false"
                  >${collapse(bottleMini)}</svg>
                </div>
                <h3 class="dm-product__name">${escape(flavour.short)}</h3>
                <p class="dm-product__note">${escape(flavour.note)}</p>
                <div class="dm-product__buy">
                  <span class="dm-product__price">${escape(flavour.price)}</span>
                  <a class="dm-product__add" href="#tienda" aria-label="Añadir ${escape(flavour.name)} al carrito">Añadir</a>
                </div>
              </article>`,
    )
    .join("\n");

  const packs = demo.shop.packs
    .map(
      (pack) => `              <article class="dm-pack${pack.featured ? " dm-pack--featured" : ""}" data-reveal="rise">
                ${pack.tag ? `<p class="dm-pack__tag">${escape(pack.tag)}</p>` : ""}
                <h3 class="dm-pack__name">${escape(pack.name)}</h3>
                <p class="dm-pack__detail">${escape(pack.detail)}</p>
                <p class="dm-pack__price">${escape(pack.price)}</p>
                <a class="button${pack.featured ? " button--primary" : ""}" href="#tienda">Comprar</a>
              </article>`,
    )
    .join("\n");

  return `      <section class="dm-section dm-shop" id="tienda">
        <div class="dm-shell">
          <header class="dm-shop__head" data-reveal="rise">
            <p class="dm-label"><span class="dm-label__index">04</span> ${escape(demo.shop.label)}</p>
            <h2 class="dm-title">${escape(demo.shop.title)}</h2>
            <p class="dm-text">${escape(demo.shop.text)}</p>
          </header>

          <div class="dm-rack" data-reveal-group>
${products}
          </div>

          <div class="dm-packs" data-reveal-group>
${packs}
          </div>

          <p class="dm-shop__note">${escape(demo.shop.note)}</p>
        </div>
      </section>`;
}

function renderClosing(demo, isotype) {
  return `      <section class="dm-section dm-cta" id="corestruct">
        <div class="dm-shell">
          <div class="dm-cta__inner" data-reveal="rise">
            <svg class="dm-cta__mark" viewBox="0 0 362 422" aria-hidden="true" focusable="false">${collapse(isotype.paths)}</svg>
            <h2 class="dm-cta__title">${escape(demo.cta.title)}</h2>
            <p class="dm-cta__text">${escape(demo.cta.text)}</p>
            <div class="dm-cta__actions">
              <a class="button button--primary" href="${escape(demo.cta.action.href)}">${escape(demo.cta.action.label)}</a>
              <a class="button" href="../index.html#proyectos">Volver al portafolio</a>
            </div>
          </div>
        </div>
      </section>

      <footer class="dm-footer">
        <div class="dm-shell dm-footer__inner">
          <div class="dm-footer__brand">
            <p class="dm-footer__name">${escape(demo.brand.name)}</p>
            <p class="dm-footer__line">${escape(demo.brand.mark)} · desde ${escape(demo.brand.since)}</p>
            <p class="dm-footer__credit">
              Marca ficticia. Sitio de ejemplo construido por
              <a href="../index.html">CoreStruct</a> &copy; <span data-current-year>2026</span>.
            </p>
          </div>
          <nav class="dm-footer__nav" aria-label="Pie">
            <a href="#inicio">Inicio</a>
            <a href="#sabores">Sabores</a>
            <a href="#tienda">Tienda</a>
            <a href="../index.html#contacto">Contacto</a>
          </nav>
        </div>
      </footer>`;
}

/* ------------------------------------------------------------------- page */

function renderPage(demo, isotype) {
  return `<!doctype html>
<html lang="es">
  <head>
${renderHead(demo)}
  </head>

  <body>
    <a class="skip-link" href="#inicio">Saltar al contenido</a>

${renderSprite(isotype)}

${renderBadge(isotype)}

${renderHeader(demo)}

    <main class="dm" id="contenido">
      <!-- Everything inside the track shares one pinned bottle. Each section
           declares the state the bottle should reach when it arrives. -->
      <div class="dm-track" data-stage-track data-stage-exit='{"scale":0.5,"y":6,"fade":0}'>
${renderStage(demo)}

${renderHero(demo)}

${renderFlavours(demo)}

${renderSpec(demo)}

${renderStory(demo)}
      </div>

${renderShop(demo)}

${renderClosing(demo, isotype)}
    </main>

    <script type="module" src="../src/scripts/demo/main.js"></script>
  </body>
</html>
`;
}

const isotype = readIsotype();
mkdirSync(OUT_DIR, { recursive: true });

for (const demo of demos) {
  const file = join(OUT_DIR, `${demo.slug}.html`);
  const page = renderPage(demo, isotype);
  writeFileSync(file, page);
  console.log(`demos/${demo.slug}.html  ${(Buffer.byteLength(page) / 1024).toFixed(1)} KB`);
}

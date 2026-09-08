/**
 * Orbita Supply — the commerce landing, rendered.
 *
 * The page has to carry four working pieces of interface, not four pictures of
 * them: a search that filters the catalogue, a product sheet that opens over
 * the page, a comparison table, and a configurator that turns a headcount into
 * a quote. Each is rendered here as complete markup with its state in the DOM,
 * so the scripts only ever toggle attributes — nothing on this page is built
 * from JavaScript strings at runtime.
 */

import { orbita } from "../../src/data/landings/orbita.js";
import { brandPlate, render, showcase } from "./orbita-art.mjs";
import { document_, escape, floatingAction, head, indent, outro, pitch, rgbTriple } from "./shell.mjs";

const page = orbita;
const fullName = `${page.brand.name} ${page.brand.suffix}`;

/** Everything a card is searched by, flattened once at build time. */
const searchIndex = (item) =>
  [item.name, item.category, item.summary, item.keywords, ...item.specs]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

/* ------------------------------------------------------------------ chrome */

function chrome() {
  const links = page.nav
    .map(
      ({ id, label }) =>
        `            <a class="ob-nav__link" href="#${id}" data-nav-link>${escape(label)}</a>`,
    )
    .join("\n");

  const menu = page.nav
    .map(({ id, label }) => `        <a class="ob-menu__link" href="#${id}">${escape(label)}</a>`)
    .join("\n");

  return `    <header class="ob-header" data-header>
      <div class="ob-header__inner lp-shell">
        <a class="ob-brand" href="#inicio">
          <span class="ob-brand__mark" aria-hidden="true"></span>
          <span class="ob-brand__name">${escape(page.brand.name)}<b>${escape(page.brand.suffix)}</b></span>
        </a>

        <nav class="ob-nav" aria-label="Secciones">
${links}
        </nav>

        <div class="ob-header__actions">
          <a class="ob-btn ob-btn--solid ob-header__cta" href="#cotizar">Cotizar</a>
          <button
            class="ob-burger"
            type="button"
            aria-expanded="false"
            aria-controls="ob-menu"
            aria-label="Abrir el menú"
            data-menu-toggle
          >
            <span class="ob-burger__bar"></span>
            <span class="ob-burger__bar"></span>
          </button>
        </div>
      </div>
    </header>

    <div class="ob-menu" id="ob-menu" data-mobile-nav>
      <nav class="ob-menu__inner" aria-label="Menú">
${menu}
        <a class="ob-menu__cta" href="#cotizar">Solicitar cotización</a>
      </nav>
    </div>`;
}

/* -------------------------------------------------------------------- hero */

function hero() {
  return `      <section class="ob-hero" id="inicio">
        <div class="lp-shell ob-hero__grid">
          <div class="ob-hero__copy">
            <p class="ob-eyebrow" data-reveal="fade">${escape(page.hero.eyebrow)}</p>
            <h1 class="ob-hero__title" data-reveal="rise">${escape(page.hero.title)}</h1>
            <p class="ob-hero__lead" data-reveal="rise">${escape(page.hero.lead)}</p>
            <div class="ob-hero__actions" data-reveal="rise">
              <a class="ob-btn ob-btn--solid ob-btn--lg" href="${escape(page.hero.primary.href)}">
                ${escape(page.hero.primary.label)}
              </a>
              <a class="ob-btn ob-btn--ghost ob-btn--lg" href="${escape(page.hero.secondary.href)}">
                ${escape(page.hero.secondary.label)}
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

${showcase(page.hero.tags)}
        </div>
      </section>`;
}

/* ------------------------------------------------------------------ search */

function search() {
  const suggestions = page.search.suggestions
    .map(
      (term) => `              <button class="ob-chip" type="button" data-search-term="${escape(term)}">
                ${escape(term)}
              </button>`,
    )
    .join("\n");

  return `      <section class="ob-search" aria-labelledby="search-title">
        <div class="lp-shell ob-search__inner">
          <div class="ob-search__head">
            <h2 class="ob-search__title" id="search-title">${escape(page.search.title)}</h2>
            <p class="ob-search__hint">${escape(page.search.hint)}</p>
          </div>

          <div class="ob-search__field">
            <svg class="ob-search__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M16.5 16.5 21 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <label class="lp-hidden" for="ob-search-input">Buscar equipos</label>
            <input
              class="ob-search__input"
              id="ob-search-input"
              type="search"
              placeholder="${escape(page.search.placeholder)}"
              autocomplete="off"
              data-search-input
            />
            <button class="ob-btn ob-btn--solid ob-search__go" type="button" data-search-go>Buscar</button>
          </div>

          <div class="ob-search__terms">
            <span class="ob-search__terms-label">Ejemplos</span>
${suggestions}
          </div>
        </div>
      </section>`;
}

/* -------------------------------------------------------------- categorías */

function categories() {
  const items = page.categories.items
    .map(
      (item) => `            <button
              class="ob-category"
              type="button"
              data-search-term="${escape(item.name)}"
              data-reveal="rise"
            >
              <span class="ob-category__art" aria-hidden="true">${render(item.art)}</span>
              <span class="ob-category__name">${escape(item.name)}</span>
              <span class="ob-category__count">${escape(item.count)}</span>
            </button>`,
    )
    .join("\n");

  return `      <section class="ob-section" id="categorias" aria-labelledby="categories-title">
        <div class="lp-shell">
          <div class="ob-head">
            <p class="ob-label" data-reveal="fade">${escape(page.categories.label)}</p>
            <h2 class="ob-h2" id="categories-title" data-reveal="rise">${escape(page.categories.title)}</h2>
            <p class="ob-lead" data-reveal="rise">${escape(page.categories.text)}</p>
          </div>

          <div class="ob-categories" data-reveal-group="70">
${items}
          </div>
        </div>
      </section>`;
}

/* ----------------------------------------------------------------- catálogo */

function productCard(item) {
  const specs = item.specs
    .map((spec) => `                <li>${escape(spec)}</li>`)
    .join("\n");

  return `            <article
              class="ob-product"
              data-product="${escape(item.id)}"
              data-search="${escape(searchIndex(item))}"
              data-reveal="rise"
            >
              <div class="ob-product__visual">
                ${item.tag ? `<span class="ob-product__flag">${escape(item.tag)}</span>` : ""}
                ${render(item.art, "ob-render--card")}
              </div>

              <p class="ob-product__category">${escape(item.category)}</p>
              <h3 class="ob-product__name">${escape(item.name)}</h3>
              <ul class="ob-product__specs">
${specs}
              </ul>

              <p class="ob-product__price">
                ${item.priceNote ? `<span class="ob-product__price-note">${escape(item.priceNote)}</span>` : ""}
                <span class="ob-product__price-value">${escape(item.price)}</span>
              </p>
              <p class="ob-product__stock">${escape(item.availability)}</p>

              <button class="ob-product__cta" type="button" data-open-sheet="${escape(item.id)}">
                Ver equipo
                <span aria-hidden="true">&rarr;</span>
              </button>
            </article>`;
}

/** The expanded sheet for one product, held in a template until it is opened. */
function productSheet(item) {
  const specs = item.specs
    .map(
      (spec) => `              <li class="ob-sheet__spec">${escape(spec)}</li>`,
    )
    .join("\n");

  const features = item.sheet.features
    .map((feature) => `              <li>${escape(feature)}</li>`)
    .join("\n");

  return `        <template data-sheet-for="${escape(item.id)}">
          <div class="ob-sheet__grid">
            <div class="ob-sheet__gallery">
              <div class="ob-sheet__stage">${render(item.art, "ob-render--sheet")}</div>
              <div class="ob-sheet__thumbs" role="group" aria-label="Vistas del equipo">
                <span class="ob-sheet__thumb is-current">${render(item.art)}</span>
                <span class="ob-sheet__thumb">${render(item.art)}</span>
                <span class="ob-sheet__thumb">${render(item.art)}</span>
              </div>
            </div>

            <div class="ob-sheet__body">
              <p class="ob-sheet__category">${escape(item.category)}</p>
              <h3 class="ob-sheet__name" data-sheet-title>${escape(item.name)}</h3>
              <p class="ob-sheet__summary">${escape(item.summary)}</p>

              <ul class="ob-sheet__specs">
${specs}
              </ul>

              <div class="ob-sheet__block">
                <p class="ob-sheet__block-title">Características</p>
                <ul class="ob-sheet__features">
${features}
                </ul>
              </div>

              <dl class="ob-sheet__facts">
                <div><dt>Disponibilidad</dt><dd>${escape(item.sheet.stock)}</dd></div>
                <div><dt>Garantía</dt><dd>${escape(item.warranty)}</dd></div>
                <div><dt>Entrega</dt><dd>${escape(item.sheet.delivery)}</dd></div>
              </dl>

              <p class="ob-sheet__price">
                ${item.priceNote ? `<span class="ob-sheet__price-note">${escape(item.priceNote)}</span>` : ""}
                <span class="ob-sheet__price-value">${escape(item.price)}</span>
              </p>

              <div class="ob-sheet__actions">
                <button class="ob-btn ob-btn--solid" type="button" data-sheet-quote>
                  ${escape(page.catalog.sheet.quote)}
                </button>
                <a class="ob-btn ob-btn--outline" href="#cotizar" data-sheet-buy>
                  ${escape(page.catalog.sheet.buy)}
                </a>
              </div>
              <p class="ob-sheet__note">${escape(page.catalog.sheet.note)}</p>
            </div>
          </div>
        </template>`;
}

function catalog() {
  return `      <section class="ob-section ob-section--muted" id="catalogo" aria-labelledby="catalog-title">
        <div class="lp-shell">
          <div class="ob-head ob-head--split">
            <div>
              <p class="ob-label" data-reveal="fade">${escape(page.catalog.label)}</p>
              <h2 class="ob-h2" id="catalog-title" data-reveal="rise">${escape(page.catalog.title)}</h2>
            </div>
            <p class="ob-lead" data-reveal="rise">${escape(page.catalog.text)}</p>
          </div>

          <p class="ob-filter" data-filter hidden>
            <span class="ob-filter__label">Filtrando por</span>
            <span class="ob-filter__value" data-filter-value></span>
            <button class="ob-filter__clear" type="button" data-filter-clear>
              Quitar filtro
            </button>
          </p>

          <div class="ob-products" data-catalog>
${page.catalog.items.map(productCard).join("\n")}
          </div>

          <p class="ob-products__empty" data-catalog-empty hidden>${escape(page.search.empty)}</p>
        </div>

        <dialog class="ob-sheet" data-sheet-dialog aria-label="Ficha del equipo">
          <button class="ob-sheet__close" type="button" data-sheet-close aria-label="Cerrar la ficha">
            <span aria-hidden="true">&times;</span>
          </button>
          <div class="ob-sheet__content" data-sheet-content></div>
          <p class="ob-sheet__added" data-sheet-added role="status" hidden>${escape(page.catalog.sheet.added)}</p>
        </dialog>

${page.catalog.items.map(productSheet).join("\n")}
      </section>`;
}

/* --------------------------------------------------------------- comparador */

function compare() {
  const { compare: c } = page;

  const picks = c.items
    .map(
      (item, index) => `              <label class="ob-pick">
                <input
                  type="checkbox"
                  value="${escape(item.id)}"
                  data-compare-pick
                  ${index < 3 ? "checked" : ""}
                />
                <span class="ob-pick__body">
                  <span class="ob-pick__art" aria-hidden="true">${render(item.art)}</span>
                  <span class="ob-pick__name">${escape(item.name)}</span>
                </span>
              </label>`,
    )
    .join("\n");

  const headCells = c.items
    .map(
      (item, index) => `                  <th scope="col" data-col="${escape(item.id)}"${index < 3 ? "" : " hidden"}>
                    <span class="ob-table__art" aria-hidden="true">${render(item.art)}</span>
                    <span class="ob-table__name">${escape(item.name)}</span>
                  </th>`,
    )
    .join("\n");

  const rows = c.rows
    .map((row, rowIndex) => {
      const cells = c.items
        .map(
          (item, index) =>
            `                  <td data-col="${escape(item.id)}"${index < 3 ? "" : " hidden"}>${escape(item.values[rowIndex])}</td>`,
        )
        .join("\n");

      const isPrice = row === "Precio";
      return `                <tr${isPrice ? ' class="ob-table__row--price"' : ""}>
                  <th scope="row">${escape(row)}</th>
${cells}
                </tr>`;
    })
    .join("\n");

  return `      <section class="ob-section" id="comparar" aria-labelledby="compare-title">
        <div class="lp-shell">
          <div class="ob-head ob-head--split">
            <div>
              <p class="ob-label" data-reveal="fade">${escape(c.label)}</p>
              <h2 class="ob-h2" id="compare-title" data-reveal="rise">${escape(c.title)}</h2>
            </div>
            <p class="ob-lead" data-reveal="rise">${escape(c.text)}</p>
          </div>

          <div class="ob-compare" data-compare data-limit="${c.limit}">
            <div class="ob-compare__picker">
              <p class="ob-compare__hint">
                ${escape(c.hint)}
                <span class="ob-compare__count" data-compare-count aria-live="polite">3 de 3</span>
              </p>
              <div class="ob-picks">
${picks}
              </div>
            </div>

            <div class="ob-table__scroll">
              <table class="ob-table">
                <caption class="lp-hidden">Comparación de especificaciones entre los equipos seleccionados</caption>
                <thead>
                  <tr>
                    <th scope="col">
                      <span class="lp-hidden">Especificación</span>
                    </th>
${headCells}
                  </tr>
                </thead>
                <tbody>
${rows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------------- configurador */

function configurator() {
  const { configurator: cfg } = page;

  const spaces = cfg.spaces
    .map(
      (space, index) => `                <label class="ob-space">
                  <input type="radio" name="ob-espacio" value="${escape(space.name)}" data-cfg-space ${index === 0 ? "checked" : ""} />
                  <span class="ob-space__body">
                    <span class="ob-space__name">${escape(space.name)}</span>
                    <span class="ob-space__note">${escape(space.note)}</span>
                  </span>
                </label>`,
    )
    .join("\n");

  const needs = cfg.needs
    .map(
      (need) => `                <label class="ob-need">
                  <input
                    type="checkbox"
                    value="${escape(need.id)}"
                    data-cfg-need
                    data-unit="${escape(need.unit)}"
                    data-name="${escape(need.name)}"
                    ${need.per ? `data-per="${need.per}"` : ""}
                    ${need.each ? `data-each="${need.each}"` : ""}
                    ${need.fixed ? `data-fixed="${need.fixed}"` : ""}
                    data-price="${need.price}"
                    ${need.checked ? "checked" : ""}
                  />
                  <span class="ob-need__body">
                    <span class="ob-need__check" aria-hidden="true"></span>
                    ${escape(need.name)}
                  </span>
                </label>`,
    )
    .join("\n");

  return `      <section class="ob-section ob-section--muted" id="equipar" aria-labelledby="cfg-title">
        <div class="lp-shell ob-cfg">
          <div class="ob-cfg__intro">
            <p class="ob-label" data-reveal="fade">${escape(cfg.label)}</p>
            <h2 class="ob-h2" id="cfg-title" data-reveal="rise">${escape(cfg.title)}</h2>
            <p class="ob-lead" data-reveal="rise">${escape(cfg.text)}</p>
          </div>

          <form class="ob-cfg__panel" data-configurator data-reveal="rise">
            <fieldset class="ob-cfg__group">
              <legend class="ob-cfg__legend">¿Qué necesitas equipar?</legend>
              <div class="ob-spaces">
${spaces}
              </div>
            </fieldset>

            <fieldset class="ob-cfg__group">
              <legend class="ob-cfg__legend">${escape(cfg.peopleLabel)}</legend>
              <div class="ob-stepper">
                <button class="ob-stepper__button" type="button" data-cfg-step="-1" aria-label="Quitar una persona">&minus;</button>
                <label class="lp-hidden" for="ob-people">Número de personas</label>
                <input
                  class="ob-stepper__input"
                  id="ob-people"
                  type="number"
                  inputmode="numeric"
                  min="${cfg.people.min}"
                  max="${cfg.people.max}"
                  step="${cfg.people.step}"
                  value="${cfg.people.value}"
                  data-cfg-people
                />
                <button class="ob-stepper__button" type="button" data-cfg-step="1" aria-label="Agregar una persona">+</button>
              </div>
            </fieldset>

            <fieldset class="ob-cfg__group">
              <legend class="ob-cfg__legend">${escape(cfg.needsLabel)}</legend>
              <div class="ob-needs">
${needs}
              </div>
            </fieldset>

            <button class="ob-btn ob-btn--solid ob-btn--lg ob-cfg__submit" type="submit">
              ${escape(cfg.submit)}
            </button>
          </form>

          <aside class="ob-cfg__result" data-cfg-result hidden aria-live="polite">
            <p class="ob-cfg__result-title">${escape(cfg.result.title)}</p>
            <p class="ob-cfg__result-for" data-cfg-for></p>
            <ul class="ob-cfg__lines" data-cfg-lines></ul>
            <p class="ob-cfg__total">
              <span>Estimado</span>
              <strong data-cfg-total></strong>
            </p>
            <a class="ob-btn ob-btn--solid" href="#cotizar">${escape(cfg.result.action)}</a>
            <p class="ob-cfg__note">${escape(cfg.result.note)}</p>
          </aside>
        </div>
      </section>`;
}

/* -------------------------------------------------------------------- promo */

function promo() {
  const items = page.promo.items
    .map((item) => `              <li>${escape(item)}</li>`)
    .join("\n");

  return `      <section class="ob-promo" aria-labelledby="promo-title">
        <div class="lp-shell ob-promo__inner" data-reveal="scale">
          <div class="ob-promo__copy">
            <p class="ob-label ob-label--light">${escape(page.promo.label)}</p>
            <h2 class="ob-promo__title" id="promo-title">${escape(page.promo.title)}</h2>
            <p class="ob-promo__text">${escape(page.promo.text)}</p>
            <ul class="ob-promo__list">
${items}
            </ul>
          </div>

          <div class="ob-promo__price">
            <span class="ob-promo__price-note">${escape(page.promo.price.note)}</span>
            <span class="ob-promo__price-value">${escape(page.promo.price.value)}</span>
            <span class="ob-promo__price-detail">${escape(page.promo.price.detail)}</span>
            <a class="ob-btn ob-btn--accent ob-btn--lg" href="${escape(page.promo.action.href)}">
              ${escape(page.promo.action.label)}
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------------------- marcas */

function brands() {
  return `      <section class="ob-brands" aria-labelledby="brands-title">
        <div class="lp-shell">
          <h2 class="ob-brands__title" id="brands-title" data-reveal="fade">${escape(page.brands.title)}</h2>
          <ul class="ob-brands__list" data-reveal-group="60">
${page.brands.items.map(brandPlate).join("\n")}
          </ul>
          <p class="ob-brands__note">${escape(page.brands.note)}</p>
        </div>
      </section>`;
}

/* ------------------------------------------------------------------ por qué */

function why() {
  const items = page.why.items
    .map(
      (item) => `            <article class="ob-benefit" data-reveal="rise">
              <span class="ob-benefit__art" aria-hidden="true">${render(item.art)}</span>
              <h3 class="ob-benefit__name">${escape(item.name)}</h3>
              <p class="ob-benefit__text">${escape(item.text)}</p>
            </article>`,
    )
    .join("\n");

  return `      <section class="ob-section" aria-labelledby="why-title">
        <div class="lp-shell">
          <div class="ob-head">
            <p class="ob-label" data-reveal="fade">${escape(page.why.label)}</p>
            <h2 class="ob-h2" id="why-title" data-reveal="rise">${escape(page.why.title)}</h2>
          </div>

          <div class="ob-benefits" data-reveal-group="90">
${items}
          </div>
        </div>
      </section>`;
}

/* ----------------------------------------------------------- experiencia B2B */

function flow() {
  const steps = page.flow.steps
    .map(
      (step, index) => `              <li class="ob-flow__step" data-track-step>
                <span class="ob-flow__index">0${index + 1}</span>
                <h3 class="ob-flow__name">${escape(step.name)}</h3>
                <p class="ob-flow__text">${escape(step.text)}</p>
              </li>`,
    )
    .join("\n");

  const industries = page.industries.items
    .map((item) => `              <li>${escape(item)}</li>`)
    .join("\n");

  return `      <section class="ob-b2b" id="empresas" aria-labelledby="b2b-title" data-track>
        <div class="lp-shell">
          <div class="ob-b2b__head">
            <h2 class="ob-b2b__title" id="b2b-title" data-reveal="rise">${escape(page.flow.title)}</h2>
            <p class="ob-b2b__text" data-reveal="rise">${escape(page.flow.text)}</p>
          </div>

          <div class="ob-flow">
            <span class="ob-flow__rail" aria-hidden="true"><span class="ob-flow__rail-fill"></span></span>
            <ol class="ob-flow__steps">
${steps}
            </ol>
          </div>

          <div class="ob-industries">
            <p class="ob-industries__text">${escape(page.industries.title)}</p>
            <ul class="ob-industries__list">
${industries}
            </ul>
          </div>
        </div>
      </section>`;
}

/* -------------------------------------------------------- voces y métricas */

function voices() {
  const items = page.voices.items
    .map(
      (item) => `            <figure class="ob-voice" data-reveal="rise">
              <blockquote class="ob-voice__quote">${escape(item.quote)}</blockquote>
              <figcaption class="ob-voice__by">
                <span class="ob-voice__name">${escape(item.name)}</span>
                <span class="ob-voice__company">${escape(item.company)}</span>
              </figcaption>
            </figure>`,
    )
    .join("\n");

  const metrics = page.metrics
    .map(
      (metric) => `            <div class="ob-metric" data-reveal="rise">
              <span class="ob-metric__value">
                <span
                  data-count-to="${metric.to}"
                  ${metric.prefix ? `data-count-prefix="${escape(metric.prefix)}"` : ""}
                  ${metric.suffix ? `data-count-suffix="${escape(metric.suffix)}"` : ""}
                >${escape(metric.display)}</span>
              </span>
              <span class="ob-metric__label">${escape(metric.label)}</span>
            </div>`,
    )
    .join("\n");

  return `      <section class="ob-section ob-section--muted" aria-labelledby="voices-title">
        <div class="lp-shell">
          <div class="ob-head ob-head--split">
            <div>
              <p class="ob-label" data-reveal="fade">${escape(page.voices.label)}</p>
              <h2 class="ob-h2" id="voices-title" data-reveal="rise">${escape(page.voices.title)}</h2>
            </div>
            <p class="ob-note" data-reveal="fade">${escape(page.voices.note)}</p>
          </div>

          <div class="ob-voices" data-reveal-group="90">
${items}
          </div>

          <div class="ob-metrics" data-reveal-group="110">
${metrics}
          </div>

${indent(pitch({ text: page.pitch }), 10)}
        </div>
      </section>`;
}

/* ----------------------------------------------------------------- cotizar */

function quote() {
  const { quote: q } = page;

  const fields = q.fields
    .map(
      (field) => `              <p class="ob-field">
                <label class="ob-field__label" for="ob-${field.name}">
                  ${escape(field.label)}${field.required ? "" : " <span>(opcional)</span>"}
                </label>
                <input
                  class="ob-field__input"
                  id="ob-${field.name}"
                  name="${escape(field.name)}"
                  type="${escape(field.type)}"
                  autocomplete="${escape(field.autocomplete)}"
                  ${field.required ? "required" : ""}
                />
              </p>`,
    )
    .join("\n");

  const needs = q.need.options
    .map(
      (option) => `                  <option value="${escape(option)}">${escape(option)}</option>`,
    )
    .join("\n");

  const amounts = q.amount.options
    .map(
      (option, index) => `                <label class="ob-radio">
                  <input type="radio" name="cantidad" value="${escape(option)}" ${index === 1 ? "checked" : ""} />
                  <span>${escape(option)}</span>
                </label>`,
    )
    .join("\n");

  return `      <section class="ob-quote" id="cotizar" aria-labelledby="quote-title">
        <div class="lp-shell ob-quote__grid">
          <div class="ob-quote__copy">
            <p class="ob-label ob-label--light" data-reveal="fade">${escape(q.label)}</p>
            <h2 class="ob-quote__title" id="quote-title" data-reveal="rise">${escape(q.title)}</h2>
            <p class="ob-quote__text" data-reveal="rise">${escape(q.text)}</p>
            <a class="ob-quote__wa" href="#cotizar" data-demo-action>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M12.04 2C6.54 2 2.08 6.46 2.08 11.96c0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.88 9.88 0 0 0 12.04 2Zm0 1.82c2.18 0 4.23.85 5.77 2.39a8.1 8.1 0 0 1 2.39 5.77c0 4.5-3.66 8.15-8.16 8.15a8.2 8.2 0 0 1-4.16-1.14l-.3-.18-3.09.81.82-3.01-.2-.31a8.1 8.1 0 0 1-1.26-4.33c0-4.5 3.66-8.15 8.19-8.15Z"/>
              </svg>
              Cotizar por WhatsApp
            </a>
          </div>

          <form class="ob-form" data-demo-form data-reveal="rise">
            <div class="ob-form__fields">
${fields}
            </div>

            <p class="ob-field">
              <label class="ob-field__label" for="ob-necesita">${escape(q.need.label)}</label>
              <select class="ob-field__input" id="ob-necesita" name="necesita">
${needs}
              </select>
            </p>

            <fieldset class="ob-form__amount">
              <legend class="ob-field__label">${escape(q.amount.label)}</legend>
              <div class="ob-radios">
${amounts}
              </div>
            </fieldset>

            <button class="ob-btn ob-btn--accent ob-btn--lg" type="submit">
              ${escape(q.submit)}
              <span aria-hidden="true">&rarr;</span>
            </button>

            <p class="ob-form__note">${escape(q.disclaimer)}</p>
            <p class="ob-form__done" data-form-done role="status" hidden>${escape(q.done)}</p>
          </form>
        </div>
      </section>`;
}

/* --------------------------------------------------------------------- cta */

function cta() {
  return `      <section class="ob-cta" aria-labelledby="cta-title">
        <div class="lp-shell ob-cta__inner">
          <h2 class="ob-cta__title" id="cta-title" data-reveal="rise">${escape(page.cta.title)}</h2>
          <p class="ob-cta__text" data-reveal="rise">${escape(page.cta.text)}</p>
          <div class="ob-cta__actions" data-reveal="rise">
            <a class="ob-btn ob-btn--accent ob-btn--lg" href="${escape(page.cta.primary.href)}">
              ${escape(page.cta.primary.label)}
            </a>
            <a class="ob-btn ob-btn--outline ob-btn--lg" href="${escape(page.cta.secondary.href)}">
              ${escape(page.cta.secondary.label)}
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------------------ footer */

function footer() {
  const columns = page.footer.columns
    .map(
      (column) => `            <div class="ob-foot__col">
              <p class="ob-foot__col-title">${escape(column.title)}</p>
              <ul>
${column.links.map((link) => `                <li><a href="${escape(link.href)}">${escape(link.label)}</a></li>`).join("\n")}
              </ul>
            </div>`,
    )
    .join("\n");

  return `      <footer class="ob-foot">
        <div class="lp-shell ob-foot__inner">
          <div class="ob-foot__brand">
            <p class="ob-foot__name">${escape(fullName)}</p>
${page.footer.lines.map((line) => `            <p class="ob-foot__line">${escape(line)}</p>`).join("\n")}
          </div>

${columns}

          <p class="ob-foot__credit">
            Marca ficticia. Demostración construida por
            <a href="../../index.html">CoreStruct</a> &copy; <span data-current-year>2026</span>.
          </p>
        </div>
      </footer>`;
}

/* -------------------------------------------------------------------- page */

export function buildOrbita() {
  const body = [
    hero(),
    search(),
    categories(),
    catalog(),
    compare(),
    configurator(),
    promo(),
    brands(),
    why(),
    flow(),
    voices(),
    quote(),
    cta(),
    footer(),
    outro({ industry: "una distribuidora, una tienda técnica o un catálogo industrial" }),
  ].join("\n\n");

  return document_({
    head: head({
      title: `${fullName} — ${page.brand.mark} · Demo de CoreStruct`,
      description:
        "Landing comercial de demostración para una distribuidora de equipo ficticia: catálogo, " +
        "ficha de producto, comparador, configurador B2B y solicitud de cotización.",
      bundle: "orbita.css",
      fonts: ["manrope", "plex"],
      themeColor: page.theme.page,
      scheme: "light",
      style: `    <style>
      :root {
        --accent: ${page.theme.accent};
        --accent-rgb: ${rgbTriple(page.theme.accent)};
      }
    </style>`,
    }),
    chrome: chrome(),
    body,
    action: floatingAction({ label: "Cotizar", href: "#cotizar" }),
    script: "../../src/scripts/orbita/main.js",
  });
}

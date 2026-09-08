/**
 * Nexora Group — the corporate landing, rendered.
 *
 * The page is laid out as an editorial document rather than as a stack of
 * cards: a twelve-column grid, hairline rules, indexed section labels, and one
 * accent that only ever appears as a mark. Each function below emits one zone,
 * in the order the visitor meets it.
 */

import { nexora } from "../../src/data/landings/nexora.js";
import { clientLogo, heroPanel, serviceArt } from "./nexora-art.mjs";
import { document_, escape, head, indent, outro, pitch, rgbTriple } from "./shell.mjs";

const page = nexora;
const fullName = `${page.brand.name} ${page.brand.suffix}`;

/* ------------------------------------------------------------------ chrome */

function chrome() {
  const links = page.nav
    .map(
      ({ id, label }) =>
        `            <a class="nx-nav__link" href="#${id}" data-nav-link>${escape(label)}</a>`,
    )
    .join("\n");

  const menu = page.nav
    .map(({ id, label }) => `        <a class="nx-menu__link" href="#${id}">${escape(label)}</a>`)
    .join("\n");

  return `    <header class="nx-header" data-header>
      <div class="nx-header__inner lp-shell">
        <a class="nx-brand" href="#inicio">
          <span class="nx-brand__name">${escape(page.brand.name)}</span>
          <span class="nx-brand__suffix">${escape(page.brand.suffix)}</span>
        </a>

        <nav class="nx-nav" aria-label="Secciones">
${links}
        </nav>

        <div class="nx-header__actions">
          <a class="nx-btn nx-btn--solid nx-header__cta" href="#contacto">Solicitar consultoría</a>
          <button
            class="nx-burger"
            type="button"
            aria-expanded="false"
            aria-controls="nx-menu"
            aria-label="Abrir el menú"
            data-menu-toggle
          >
            <span class="nx-burger__bar"></span>
            <span class="nx-burger__bar"></span>
          </button>
        </div>
      </div>
    </header>

    <div class="nx-menu" id="nx-menu" data-mobile-nav>
      <nav class="nx-menu__inner" aria-label="Menú">
${menu}
        <a class="nx-menu__cta" href="#contacto">Solicitar consultoría</a>
      </nav>
    </div>`;
}

/* -------------------------------------------------------------------- hero */

function hero() {
  const stamps = page.hero.stamps
    .map(
      (stamp) => `          <div class="nx-stamp">
            <span class="nx-stamp__value">${escape(stamp.value)}</span>
            <span class="nx-stamp__label">${escape(stamp.label)}</span>
          </div>`,
    )
    .join("\n");

  return `      <section class="nx-hero" id="inicio">
        <div class="lp-shell nx-hero__grid">
          <div class="nx-hero__copy">
            <p class="nx-eyebrow" data-reveal="fade">${escape(page.hero.eyebrow)}</p>
            <h1 class="nx-hero__title reveal-lines" data-stagger="120">
              <span class="reveal-lines__line"><span>Transformamos empresas</span></span>
              <span class="reveal-lines__line"><span>que están listas</span></span>
              <span class="reveal-lines__line"><span><em>para avanzar.</em></span></span>
            </h1>
            <p class="nx-hero__lead" data-reveal="rise">${escape(page.hero.lead)}</p>
            <div class="nx-hero__actions" data-reveal="rise">
              <a class="nx-btn nx-btn--solid" href="${escape(page.hero.primary.href)}">
                ${escape(page.hero.primary.label)}
              </a>
              <a class="nx-link" href="${escape(page.hero.secondary.href)}">
                ${escape(page.hero.secondary.label)}
                <span class="nx-link__arrow" aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          <div class="nx-hero__visual">
${heroPanel(page.panel)}
          </div>
        </div>

        <div class="lp-shell nx-hero__stamps" data-reveal-group="110">
${stamps}
        </div>
      </section>`;
}

/* ------------------------------------------------------------------- trust */

function trust() {
  return `      <section class="nx-trust" aria-labelledby="trust-title">
        <div class="lp-shell">
          <h2 class="nx-trust__title" id="trust-title" data-reveal="fade">${escape(page.trust.title)}</h2>
          <ul class="nx-trust__logos" data-reveal-group="70">
${page.trust.logos.map(clientLogo).join("\n")}
          </ul>
          <p class="nx-trust__note">${escape(page.trust.note)}</p>
        </div>
      </section>`;
}

/* --------------------------------------------------------------- resultados */

function results() {
  const items = page.results.items
    .map(
      (item) => `            <div class="nx-result" data-reveal="rise">
              <p class="nx-result__value">
                <span
                  data-count-to="${item.to}"
                  ${item.prefix ? `data-count-prefix="${escape(item.prefix)}"` : ""}
                  ${item.suffix ? `data-count-suffix="${escape(item.suffix)}"` : ""}
                >${escape(item.display)}</span>
              </p>
              <p class="nx-result__label">${escape(item.label)}</p>
            </div>`,
    )
    .join("\n");

  return `      <section class="nx-section nx-section--dark" id="resultados" aria-labelledby="results-title">
        <div class="lp-shell">
          <div class="nx-head">
            <p class="nx-label" data-reveal="fade"><span class="nx-label__index">01</span>${escape(page.results.label)}</p>
            <h2 class="nx-h2" id="results-title" data-reveal="rise">${escape(page.results.title)}</h2>
            <p class="nx-lead" data-reveal="rise">${escape(page.results.text)}</p>
          </div>

          <div class="nx-results" data-reveal-group="120">
${items}
          </div>
        </div>
      </section>`;
}

/* ---------------------------------------------------------------- servicios */

function services() {
  const tiles = page.services.items
    .map((item) => {
      const meta = item.meta
        .map((entry) => `                <li>${escape(entry)}</li>`)
        .join("\n");

      return `            <article class="nx-tile${item.span === "wide" ? " nx-tile--wide" : ""}" data-reveal="rise">
              <div class="nx-tile__visual" aria-hidden="true">${serviceArt(item.art)}</div>
              <div class="nx-tile__body">
                <h3 class="nx-tile__name">${escape(item.name)}</h3>
                <p class="nx-tile__text">${escape(item.text)}</p>
              </div>
              <ul class="nx-tile__meta">
${meta}
              </ul>
            </article>`;
    })
    .join("\n");

  return `      <section class="nx-section" id="servicios" aria-labelledby="services-title">
        <div class="lp-shell">
          <div class="nx-head nx-head--split">
            <p class="nx-label" data-reveal="fade"><span class="nx-label__index">02</span>${escape(page.services.label)}</p>
            <h2 class="nx-h2" id="services-title" data-reveal="rise">${escape(page.services.title)}</h2>
            <p class="nx-lead" data-reveal="rise">${escape(page.services.text)}</p>
          </div>

          <div class="nx-bento">
${tiles}
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------------------ método */

function shift() {
  const column = (block, variant) => {
    const items = block.items
      .map(
        (item, index) => `              <li class="nx-shift__item" style="--item: ${index}">
                <span class="nx-shift__dot" aria-hidden="true"></span>
                <span class="nx-shift__label">${escape(item)}</span>
              </li>`,
      )
      .join("\n");

    return `          <div class="nx-shift__col nx-shift__col--${variant}">
            <p class="nx-shift__note">${escape(block.note)}</p>
            <h3 class="nx-shift__title">${escape(block.title)}</h3>
            <ul class="nx-shift__list">
${items}
            </ul>
          </div>`;
  };

  const steps = page.shift.bridge.steps
    .map(
      (step) => `              <li class="nx-step" data-track-step>
                <span class="nx-step__stamp">${escape(step.stamp)}</span>
                <div>
                  <h4 class="nx-step__title">${escape(step.title)}</h4>
                  <p class="nx-step__text">${escape(step.text)}</p>
                </div>
              </li>`,
    )
    .join("\n");

  return `      <section class="nx-section nx-section--flush" id="metodo" aria-labelledby="shift-title" data-track>
        <div class="lp-shell">
          <div class="nx-head nx-head--split">
            <p class="nx-label" data-reveal="fade"><span class="nx-label__index">03</span>${escape(page.shift.label)}</p>
            <h2 class="nx-h2" id="shift-title" data-reveal="rise">${escape(page.shift.title)}</h2>
            <p class="nx-lead" data-reveal="rise">${escape(page.shift.text)}</p>
          </div>
        </div>

        <div class="lp-shell nx-shift">
${column(page.shift.before, "before")}

          <div class="nx-shift__bridge">
            <p class="nx-shift__bridge-title">${escape(page.shift.bridge.title)}</p>
            <div class="nx-shift__rail" aria-hidden="true"><span class="nx-shift__rail-fill"></span></div>
            <ol class="nx-shift__steps">
${steps}
            </ol>
          </div>

${column(page.shift.after, "after")}
        </div>
      </section>`;
}

/* ------------------------------------------------------------------- casos */

function cases() {
  const items = page.cases.items
    .map(
      (item, index) => `            <article class="nx-case" data-reveal="rise">
              <header class="nx-case__head">
                <span class="nx-case__index">0${index + 1}</span>
                <div>
                  <h3 class="nx-case__sector">${escape(item.sector)}</h3>
                  <p class="nx-case__company">${escape(item.company)}</p>
                </div>
                <p class="nx-case__metric">
                  <span class="nx-case__metric-value">${escape(item.metric.value)}${escape(item.metric.suffix)}</span>
                  <span class="nx-case__metric-label">${escape(item.metric.label)}</span>
                </p>
              </header>
              <div class="nx-case__body">
                <div class="nx-case__part">
                  <p class="nx-case__part-label">Problema</p>
                  <p class="nx-case__text">${escape(item.problem)}</p>
                </div>
                <div class="nx-case__part">
                  <p class="nx-case__part-label">Intervención</p>
                  <p class="nx-case__text">${escape(item.action)}</p>
                </div>
                <div class="nx-case__part nx-case__part--result">
                  <p class="nx-case__part-label">Resultado</p>
                  <p class="nx-case__text">${escape(item.result)}</p>
                </div>
              </div>
            </article>`,
    )
    .join("\n");

  return `      <section class="nx-section" id="casos" aria-labelledby="cases-title">
        <div class="lp-shell">
          <div class="nx-head nx-head--split">
            <p class="nx-label" data-reveal="fade"><span class="nx-label__index">04</span>${escape(page.cases.label)}</p>
            <h2 class="nx-h2" id="cases-title" data-reveal="rise">${escape(page.cases.title)}</h2>
            <p class="nx-lead" data-reveal="rise">${escape(page.cases.text)}</p>
          </div>

          <div class="nx-cases">
${items}
          </div>

${indent(pitch({ text: page.pitch }), 10)}
        </div>
      </section>`;
}

/* ----------------------------------------------------------------- contacto */

function contact() {
  const fields = page.cta.fields
    .map(
      (field) => `              <p class="nx-field">
                <label class="nx-field__label" for="nx-${field.name}">${escape(field.label)}</label>
                <input
                  class="nx-field__input"
                  id="nx-${field.name}"
                  name="${escape(field.name)}"
                  type="${escape(field.type)}"
                  autocomplete="${escape(field.autocomplete)}"
                  required
                />
              </p>`,
    )
    .join("\n");

  const options = page.cta.focus.options
    .map(
      (option, index) => `                <label class="nx-choice">
                  <input type="radio" name="foco" value="${escape(option)}"${index === 0 ? " checked" : ""} />
                  <span>${escape(option)}</span>
                </label>`,
    )
    .join("\n");

  return `      <section class="nx-cta" id="contacto" aria-labelledby="cta-title">
        <div class="lp-shell nx-cta__grid">
          <div class="nx-cta__copy">
            <h2 class="nx-cta__title" id="cta-title" data-reveal="rise">${escape(page.cta.title)}</h2>
            <p class="nx-cta__text" data-reveal="rise">${escape(page.cta.text)}</p>
          </div>

          <form class="nx-form" data-demo-form data-reveal="rise">
            <div class="nx-form__fields">
${fields}
            </div>

            <fieldset class="nx-form__focus">
              <legend class="nx-field__label">${escape(page.cta.focus.label)}</legend>
              <div class="nx-choices">
${options}
              </div>
            </fieldset>

            <button class="nx-btn nx-btn--solid nx-form__submit" type="submit">
              ${escape(page.cta.submit)}
              <span aria-hidden="true">&rarr;</span>
            </button>

            <p class="nx-form__note">${escape(page.cta.disclaimer)}</p>
            <p class="nx-form__done" data-form-done role="status" hidden>
              Solicitud registrada. En una implementación real, esta consulta llegaría al equipo
              de Nexora en menos de un minuto.
            </p>
          </form>
        </div>
      </section>`;
}

/* ------------------------------------------------------------------ footer */

function footer() {
  const columns = page.footer.columns
    .map(
      (column) => `            <div class="nx-foot__col">
              <p class="nx-foot__col-title">${escape(column.title)}</p>
              <ul>
${column.links.map((link) => `                <li><a href="${escape(link.href)}">${escape(link.label)}</a></li>`).join("\n")}
              </ul>
            </div>`,
    )
    .join("\n");

  return `      <footer class="nx-foot">
        <div class="lp-shell nx-foot__inner">
          <div class="nx-foot__brand">
            <p class="nx-foot__name">${escape(fullName)}</p>
${page.footer.lines.map((line) => `            <p class="nx-foot__line">${escape(line)}</p>`).join("\n")}
          </div>

${columns}

          <p class="nx-foot__credit">
            Marca ficticia. Demostración construida por
            <a href="../../index.html">CoreStruct</a> &copy; <span data-current-year>2026</span>.
          </p>
        </div>
      </footer>`;
}

/* -------------------------------------------------------------------- page */

export function buildNexora() {
  const body = [
    hero(),
    trust(),
    results(),
    services(),
    shift(),
    cases(),
    contact(),
    footer(),
    // The brand's page has ended; what follows is the studio signing it.
    outro({ industry: "una firma de consultoría, ingeniería o servicios profesionales" }),
  ].join("\n\n");

  return document_({
    head: head({
      title: `${fullName} — Consultoría y transformación · Demo de CoreStruct`,
      description:
        `${page.brand.sector}. Landing corporativa de demostración: estrategia, procesos y ` +
        "tecnología para organizaciones que necesitan operar de forma más simple.",
      bundle: "nexora.css",
      fonts: ["serif", "manrope"],
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
    script: "../../src/scripts/nexora/main.js",
  });
}

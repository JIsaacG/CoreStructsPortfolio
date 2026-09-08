/**
 * Velora — the conversion landing, rendered.
 *
 * The page is built around one control: the booking widget in the second
 * screen. Everything above it exists to make someone want to use it, everything
 * below it exists to remove a reason not to, and every section ends within one
 * tap of it.
 *
 * Two decisions worth stating. The booking widget and the comparison are built
 * from native form controls — radio groups and a range input — so keyboard and
 * screen-reader behaviour comes from the platform instead of being re-invented
 * in JavaScript. And nothing on the page claims a real appointment: the agenda
 * says it is a demonstration, in the widget itself.
 */

import { velora } from "../../src/data/landings/velora.js";
import { comparePlate, doctorPlate, heroPlate, stars, treatmentArt } from "./velora-art.mjs";
import { document_, escape, floatingAction, head, indent, outro, pitch, rgbTriple } from "./shell.mjs";

const page = velora;

/* ------------------------------------------------------------------ chrome */

function chrome() {
  const links = page.nav
    .map(
      ({ id, label }) =>
        `            <a class="ve-nav__link" href="#${id}" data-nav-link>${escape(label)}</a>`,
    )
    .join("\n");

  const menu = page.nav
    .map(({ id, label }) => `        <a class="ve-menu__link" href="#${id}">${escape(label)}</a>`)
    .join("\n");

  return `    <header class="ve-header" data-header>
      <div class="ve-header__inner lp-shell">
        <a class="ve-brand" href="#inicio">
          <span class="ve-brand__name">${escape(page.brand.name)}</span>
          <span class="ve-brand__mark">${escape(page.brand.mark)}</span>
        </a>

        <nav class="ve-nav" aria-label="Secciones">
${links}
        </nav>

        <div class="ve-header__actions">
          <!--lang-switch-->
          <a class="ve-btn ve-btn--solid ve-header__cta" href="#reservar">Reservar</a>
          <button
            class="ve-burger"
            type="button"
            aria-expanded="false"
            aria-controls="ve-menu"
            aria-label="Abrir el menú"
            data-menu-toggle
          >
            <span class="ve-burger__bar"></span>
            <span class="ve-burger__bar"></span>
          </button>
        </div>
      </div>
    </header>

    <div class="ve-menu" id="ve-menu" data-mobile-nav>
      <nav class="ve-menu__inner" aria-label="Menú">
${menu}
        <a class="ve-menu__cta" href="#reservar">Reservar valoración</a>
      </nav>
    </div>`;
}

/* -------------------------------------------------------------------- hero */

function hero() {
  const cards = page.hero.cards
    .map(
      (card, index) => `            <div class="ve-float-card" style="--card: ${index}">
              <span class="ve-float-card__label">${escape(card.label)}</span>
              <span class="ve-float-card__value">${escape(card.value)}</span>
            </div>`,
    )
    .join("\n");

  return `      <section class="ve-hero" id="inicio">
        <div class="lp-shell ve-hero__grid">
          <div class="ve-hero__copy">
            <p class="ve-eyebrow" data-reveal="fade">${escape(page.hero.eyebrow)}</p>
            <h1 class="ve-hero__title reveal-lines" data-stagger="140">
${page.hero.title
  .map(
    (line) =>
      `              <span class="reveal-lines__line"><span>${escape(line)}</span></span>`,
  )
  .join("\n")}
            </h1>
            <p class="ve-hero__lead" data-reveal="rise">${escape(page.hero.lead)}</p>

            <!-- The proof comes before the ask: 480 patients is the reason to
                 press the button, so it is read on the way to it. It also keeps
                 the last line of the hero clear of the fixed demo badge. -->
            <p class="ve-rating" data-reveal="fade">
              ${stars(`${page.hero.rating.score} de 5`)}
              <span class="ve-rating__score">${escape(page.hero.rating.score)}</span>
              <span class="ve-rating__text">${escape(page.hero.rating.text)}</span>
            </p>

            <div class="ve-hero__actions" data-reveal="rise">
              <a class="ve-btn ve-btn--solid ve-btn--lg" href="${escape(page.hero.primary.href)}">
                ${escape(page.hero.primary.label)}
              </a>
              <a class="ve-btn ve-btn--outline ve-btn--lg" href="${escape(page.hero.secondary.href)}">
                ${escape(page.hero.secondary.label)}
              </a>
            </div>
          </div>

          <div class="ve-hero__visual" data-reveal="scale">
            <div class="ve-plate">
${indent(heroPlate(), 14)}
            </div>
${cards}
          </div>
        </div>
      </section>`;
}

/* ----------------------------------------------------------------- reserva */

function booking() {
  const { booking: b } = page;

  const steps = b.steps
    .map(
      (label, index) => `            <li class="ve-book__step${index === 0 ? " is-current" : ""}" data-book-step="${index + 1}">
              <button class="ve-book__step-button" type="button" data-book-goto="${index + 1}" disabled>
                <span class="ve-book__step-index">0${index + 1}</span>
                <span class="ve-book__step-label">${escape(label)}</span>
              </button>
            </li>`,
    )
    .join("\n");

  const treatments = b.treatments
    .map(
      (item, index) => `              <label class="ve-option ve-option--treatment">
                <input
                  type="radio"
                  name="ve-tratamiento"
                  value="${escape(item.name)}"
                  data-book-input="treatment"
                  ${index === 0 ? "checked" : ""}
                />
                <span class="ve-option__body">
                  <span class="ve-option__name">${escape(item.name)}</span>
                  <span class="ve-option__meta">${escape(item.duration)} · ${escape(item.price)}</span>
                </span>
              </label>`,
    )
    .join("\n");

  const professionals = b.professionals
    .map(
      (item, index) => `              <label class="ve-option ve-option--person">
                <input
                  type="radio"
                  name="ve-profesional"
                  value="${escape(item.name)}"
                  data-book-input="professional"
                  ${index === 0 ? "checked" : ""}
                />
                <span class="ve-option__body">
                  <span class="ve-option__avatar" aria-hidden="true">${escape(item.initials)}</span>
                  <span>
                    <span class="ve-option__name">${escape(item.name)}</span>
                    <span class="ve-option__meta">${escape(item.role)}</span>
                  </span>
                </span>
              </label>`,
    )
    .join("\n");

  /* The seven day chips are filled in with real dates at runtime; the build
     writes the offsets and a neutral fallback so the control is never empty. */
  const days = Array.from({ length: 7 })
    .map(
      (_, index) => `              <label class="ve-option ve-option--day" data-day="${index}" data-taken="${b.taken[index].join(",")}">
                <input
                  type="radio"
                  name="ve-dia"
                  value="${index}"
                  data-book-input="day"
                  ${index === 0 ? "checked" : ""}
                />
                <span class="ve-option__body">
                  <span class="ve-option__weekday" data-day-weekday>Día</span>
                  <span class="ve-option__date" data-day-number>${index + 1}</span>
                  <span class="ve-option__free" data-day-free>${7 - b.taken[index].length} libres</span>
                </span>
              </label>`,
    )
    .join("\n");

  const slots = b.slots
    .map(
      (slot, index) => `              <label class="ve-option ve-option--slot"${b.taken[0].includes(index) ? " data-taken" : ""}>
                <input
                  type="radio"
                  name="ve-hora"
                  value="${escape(slot)}"
                  data-book-input="slot"
                  ${b.taken[0].includes(index) ? "disabled" : ""}
                />
                <span class="ve-option__body">${escape(slot)}</span>
              </label>`,
    )
    .join("\n");

  return `      <section class="ve-section ve-section--warm" id="reservar" aria-labelledby="book-title">
        <div class="lp-shell ve-book__layout">
          <div class="ve-book__intro">
            <p class="ve-label" data-reveal="fade">${escape(b.label)}</p>
            <h2 class="ve-h2" id="book-title" data-reveal="rise">${escape(b.title)}</h2>
            <p class="ve-lead" data-reveal="rise">${escape(b.text)}</p>
            <p class="ve-book__hint" data-reveal="fade">${escape(b.hint)}</p>
          </div>

          <div class="ve-book" data-booking data-reveal="rise">
            <ol class="ve-book__steps">
${steps}
            </ol>

            <div class="ve-book__stage">
              <fieldset class="ve-book__panel is-current" data-book-panel="1">
                <legend class="ve-book__legend">Selecciona tratamiento</legend>
                <div class="ve-options ve-options--list">
${treatments}
                </div>
              </fieldset>

              <fieldset class="ve-book__panel" data-book-panel="2">
                <legend class="ve-book__legend">Selecciona profesional</legend>
                <div class="ve-options ve-options--list">
${professionals}
                </div>
              </fieldset>

              <fieldset class="ve-book__panel" data-book-panel="3">
                <legend class="ve-book__legend">Selecciona fecha</legend>
                <div class="ve-options ve-options--days">
${days}
                </div>
              </fieldset>

              <fieldset class="ve-book__panel" data-book-panel="4">
                <legend class="ve-book__legend">Ver disponibilidad</legend>
                <div class="ve-options ve-options--slots" data-book-slots>
${slots}
                </div>
                <p class="ve-book__empty" data-book-empty hidden>
                  No queda espacio ese día. Elige otra fecha y volvemos a consultar la agenda.
                </p>
              </fieldset>
            </div>

            <div class="ve-book__foot">
              <p class="ve-book__summary" data-book-summary aria-live="polite">
                <span class="ve-book__summary-label">Tu cita</span>
                <span class="ve-book__summary-value" data-book-summary-value>Elige un tratamiento para empezar</span>
              </p>
              <div class="ve-book__controls">
                <button class="ve-btn ve-btn--ghost" type="button" data-book-back hidden>Atrás</button>
                <button class="ve-btn ve-btn--solid" type="button" data-book-next>Continuar</button>
              </div>
            </div>

            <div class="ve-book__done" data-book-done hidden>
              <p class="ve-book__done-title">${escape(b.confirm.title)}</p>
              <p class="ve-book__done-detail" data-book-done-detail></p>
              <p class="ve-book__done-text">${escape(b.confirm.text)}</p>
              <button class="ve-btn ve-btn--outline" type="button" data-book-reset>${escape(b.confirm.action)}</button>
            </div>
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------------ tratamientos */

function treatments() {
  const cards = page.treatments.items
    .map(
      (item) => `            <article class="ve-card" data-reveal="rise">
              <span class="ve-card__icon" aria-hidden="true">${treatmentArt(item.art)}</span>
              <h3 class="ve-card__name">${escape(item.name)}</h3>
              <p class="ve-card__text">${escape(item.text)}</p>
              <ul class="ve-card__detail">
${item.detail.map((entry) => `                <li>${escape(entry)}</li>`).join("\n")}
              </ul>
              <a class="ve-card__link" href="#reservar">
                Reservar
                <span aria-hidden="true">&rarr;</span>
              </a>
            </article>`,
    )
    .join("\n");

  return `      <section class="ve-section" id="tratamientos" aria-labelledby="treatments-title">
        <div class="lp-shell">
          <div class="ve-head">
            <p class="ve-label" data-reveal="fade">${escape(page.treatments.label)}</p>
            <h2 class="ve-h2" id="treatments-title" data-reveal="rise">${escape(page.treatments.title)}</h2>
            <p class="ve-lead" data-reveal="rise">${escape(page.treatments.text)}</p>
          </div>

          <div class="ve-cards" data-reveal-group="90">
${cards}
          </div>
        </div>
      </section>`;
}

/* --------------------------------------------------------------- resultados */

function results() {
  const figures = page.results.figures
    .map(
      (figure) => `              <div class="ve-figure">
                <span class="ve-figure__value">${escape(figure.value)}${escape(figure.suffix ?? "")}</span>
                <span class="ve-figure__label">${escape(figure.label)}</span>
              </div>`,
    )
    .join("\n");

  const { slider } = page.results;

  return `      <section class="ve-section ve-section--warm" id="resultados" aria-labelledby="results-title">
        <div class="lp-shell ve-results">
          <div class="ve-results__copy">
            <p class="ve-label" data-reveal="fade">${escape(page.results.label)}</p>
            <h2 class="ve-h2" id="results-title" data-reveal="rise">${escape(page.results.title)}</h2>
            <p class="ve-lead" data-reveal="rise">${escape(page.results.text)}</p>
            <div class="ve-figures" data-reveal="fade">
${figures}
            </div>
          </div>

          <figure class="ve-compare" data-compare data-reveal="scale">
            <div class="ve-compare__frame">
              <div class="ve-compare__layer ve-compare__layer--after">
${indent(comparePlate("after"), 16)}
                <span class="ve-compare__tag ve-compare__tag--after">${escape(slider.after)}</span>
              </div>
              <div class="ve-compare__layer ve-compare__layer--before">
${indent(comparePlate("before"), 16)}
                <span class="ve-compare__tag ve-compare__tag--before">${escape(slider.before)}</span>
              </div>

              <span class="ve-compare__handle" aria-hidden="true">
                <span class="ve-compare__handle-grip"></span>
              </span>

              <input
                class="ve-compare__range"
                type="range"
                min="0"
                max="100"
                value="52"
                step="1"
                aria-label="Comparar antes y después"
                data-compare-range
              />
            </div>
            <figcaption class="ve-compare__caption">
              <span>${escape(slider.caption)}</span>
              <span class="ve-compare__hint">${escape(slider.hint)}</span>
            </figcaption>
          </figure>
        </div>
      </section>`;
}

/* --------------------------------------------------------------- protocolo */

function protocol() {
  const steps = page.protocol.steps
    .map(
      (step) => `              <li class="ve-step" data-track-step>
                <span class="ve-step__index">${escape(step.index)}</span>
                <div class="ve-step__body">
                  <h3 class="ve-step__name">${escape(step.name)}</h3>
                  <p class="ve-step__text">${escape(step.text)}</p>
                  <p class="ve-step__meta">${escape(step.meta)}</p>
                </div>
              </li>`,
    )
    .join("\n");

  return `      <section class="ve-section" id="protocolo" aria-labelledby="protocol-title" data-track>
        <div class="lp-shell ve-protocol">
          <div class="ve-protocol__aside">
            <p class="ve-label" data-reveal="fade">${escape(page.protocol.label)}</p>
            <h2 class="ve-h2" id="protocol-title" data-reveal="rise">${escape(page.protocol.title)}</h2>
            <p class="ve-lead" data-reveal="rise">${escape(page.protocol.text)}</p>
            <a class="ve-btn ve-btn--solid" href="#reservar" data-reveal="fade">Empezar por la valoración</a>
          </div>

          <div class="ve-protocol__track">
            <span class="ve-protocol__rail" aria-hidden="true"><span class="ve-protocol__rail-fill"></span></span>
            <ol class="ve-protocol__steps">
${steps}
            </ol>
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------------- testimonios */

function testimonials() {
  const { feature } = page.testimonials;

  const items = page.testimonials.items
    .map(
      (item) => `              <figure class="ve-quote" data-reveal="rise">
                <p class="ve-quote__score">${stars(`${item.score} de 5`)}<span>${escape(item.score)}</span></p>
                <blockquote class="ve-quote__text">${escape(item.quote)}</blockquote>
                <figcaption class="ve-quote__by">
                  <span class="ve-quote__avatar" aria-hidden="true">${escape(item.initials)}</span>
                  <span>
                    <span class="ve-quote__name">${escape(item.name)}</span>
                    <span class="ve-quote__detail">${escape(item.detail)}</span>
                  </span>
                </figcaption>
              </figure>`,
    )
    .join("\n");

  return `      <section class="ve-section ve-section--warm" id="pacientes" aria-labelledby="voices-title">
        <div class="lp-shell">
          <div class="ve-head ve-head--split">
            <div>
              <p class="ve-label" data-reveal="fade">${escape(page.testimonials.label)}</p>
              <h2 class="ve-h2" id="voices-title" data-reveal="rise">${escape(page.testimonials.title)}</h2>
            </div>
            <p class="ve-note" data-reveal="fade">${escape(page.testimonials.note)}</p>
          </div>

          <div class="ve-voices">
            <figure class="ve-voices__feature" data-reveal="scale">
              <p class="ve-quote__score">${stars(`${feature.score} de 5`)}<span>${escape(feature.score)}</span></p>
              <blockquote class="ve-voices__quote">${escape(feature.quote)}</blockquote>
              <figcaption class="ve-quote__by">
                <span class="ve-quote__avatar" aria-hidden="true">${escape(feature.initials)}</span>
                <span>
                  <span class="ve-quote__name">${escape(feature.name)}</span>
                  <span class="ve-quote__detail">${escape(feature.detail)}</span>
                </span>
              </figcaption>
            </figure>

            <div class="ve-voices__list" data-reveal-group="100">
${items}
            </div>
          </div>
        </div>
      </section>`;
}

/* -------------------------------------------------------------------- nudge */

function nudge() {
  return `      <section class="ve-nudge" aria-labelledby="nudge-title">
        <div class="lp-shell ve-nudge__inner" data-reveal="scale">
          <div>
            <h2 class="ve-nudge__title" id="nudge-title">${escape(page.nudge.title)}</h2>
            <p class="ve-nudge__text">${escape(page.nudge.text)}</p>
          </div>
          <a class="ve-btn ve-btn--solid ve-btn--lg" href="${escape(page.nudge.action.href)}">
            ${escape(page.nudge.action.label)}
          </a>
        </div>
      </section>`;
}

/* ------------------------------------------------------------------ equipo */

function doctor() {
  const { doctor: d } = page;

  const stats = d.stats
    .map(
      (stat) => `              <div class="ve-doctor__stat">
                <span class="ve-doctor__stat-value">${escape(stat.value)}</span>
                <span class="ve-doctor__stat-label">${escape(stat.label)}</span>
              </div>`,
    )
    .join("\n");

  return `      <section class="ve-section" id="equipo" aria-labelledby="doctor-title">
        <div class="lp-shell ve-doctor">
          <div class="ve-doctor__portrait" data-reveal="scale">
${indent(doctorPlate("AS"), 12)}
          </div>

          <div class="ve-doctor__copy">
            <p class="ve-label" data-reveal="fade">${escape(d.label)}</p>
            <h2 class="ve-h2" id="doctor-title" data-reveal="rise">${escape(d.name)}</h2>
            <p class="ve-doctor__role" data-reveal="rise">${escape(d.role)}</p>

${d.story.map((paragraph) => `            <p class="ve-doctor__story" data-reveal="rise">${escape(paragraph)}</p>`).join("\n")}

            <ul class="ve-doctor__credentials" data-reveal="fade">
${d.credentials.map((entry) => `              <li>${escape(entry)}</li>`).join("\n")}
            </ul>

            <div class="ve-doctor__stats" data-reveal="fade">
${stats}
            </div>

            <p class="ve-doctor__disclaimer">${escape(d.disclaimer)}</p>
          </div>
        </div>

${indent(pitch({ text: page.pitch, cta: "Crear mi proyecto" }), 8)}
      </section>`;
}

/* --------------------------------------------------------------------- cta */

function cta() {
  return `      <section class="ve-cta" aria-labelledby="cta-title">
        <div class="lp-shell ve-cta__inner">
          <h2 class="ve-cta__title" id="cta-title" data-reveal="rise">${escape(page.cta.title)}</h2>
          <p class="ve-cta__text" data-reveal="rise">${escape(page.cta.text)}</p>
          <div class="ve-cta__actions" data-reveal="rise">
            <a class="ve-btn ve-btn--solid ve-btn--lg" href="${escape(page.cta.primary.href)}">
              ${escape(page.cta.primary.label)}
            </a>
            <a class="ve-btn ve-btn--outline ve-btn--lg" href="${escape(page.cta.secondary.href)}">
              ${escape(page.cta.secondary.label)}
            </a>
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------------------ footer */

function footer() {
  const columns = page.footer.columns
    .map(
      (column) => `            <div class="ve-foot__col">
              <p class="ve-foot__col-title">${escape(column.title)}</p>
              <ul>
${column.links.map((link) => `                <li><a href="${escape(link.href)}">${escape(link.label)}</a></li>`).join("\n")}
              </ul>
            </div>`,
    )
    .join("\n");

  return `      <footer class="ve-foot">
        <div class="lp-shell ve-foot__inner">
          <div class="ve-foot__brand">
            <p class="ve-foot__name">${escape(page.brand.name)}</p>
            <p class="ve-foot__line">${escape(page.footer.address)}</p>
${page.footer.hours.map((line) => `            <p class="ve-foot__line">${escape(line)}</p>`).join("\n")}
          </div>

${columns}

          <p class="ve-foot__credit">
            Marca ficticia. Demostración construida por
            <a href="../../index.html">CoreStruct</a> &copy; <span data-current-year>2026</span>.
          </p>
        </div>
      </footer>`;
}

/* -------------------------------------------------------------------- page */

export function buildVelora() {
  const body = [
    hero(),
    booking(),
    treatments(),
    results(),
    protocol(),
    testimonials(),
    nudge(),
    doctor(),
    cta(),
    footer(),
    outro({ industry: "una clínica, un estudio, un gimnasio o un restaurante" }),
  ].join("\n\n");

  return document_({
    head: head({
      title: `${page.brand.name} — ${page.brand.mark} · Demo de CoreStruct`,
      description:
        "Landing de conversión de demostración para una clínica de medicina estética ficticia: " +
        "reserva de citas, comparador de resultados y protocolo de atención.",
      bundle: "velora.css",
      fonts: ["manrope", "serif"],
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
    action: floatingAction({ label: "Escríbenos", href: "#reservar" }),
    script: "../../src/scripts/velora/main.js",
  });
}

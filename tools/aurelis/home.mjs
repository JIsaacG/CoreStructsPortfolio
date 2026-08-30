/**
 * The home page.
 *
 * Twelve zones, in the order a business reader needs them: what the company
 * does, who trusts it, how big it is, what it sells, to whom, proof, why, how,
 * what backs it, where, what clients say, and how to start. The rule the brief
 * sets — under ten seconds to understand the company — is what fixes that order.
 *
 * Only the hero, the introduction, the pillars, the method and the closing CTA
 * have copy of their own; everything else is a projection of the service,
 * industry, project and resource data, so those never say two different things.
 */

import { certifications, clients, company, offices } from "../../src/data/aurelis/company.js";
import * as home from "../../src/data/aurelis/home.js";
import { industries, industriesIntro } from "../../src/data/aurelis/industries.js";
import { insights } from "../../src/data/aurelis/insights.js";
import { featured } from "../../src/data/aurelis/projects.js";
import { services, servicesIntro } from "../../src/data/aurelis/services.js";
import { graticulePath, landPath, MAP, project as projectPoint } from "../../src/data/aurelis/atlas.js";
import {
  arrowLink,
  actions,
  bullets,
  button,
  escape,
  figure,
  head,
  href,
  mark,
  metrics,
  page,
  plate,
  quote,
  results,
  stat,
  sub,
} from "./blocks.mjs";

/** Section counter: every label prints `03 / 12`. */
const TOTAL = String(home.sectionOrder.length).padStart(2, "0");
const at = (id) => String(home.sectionOrder.indexOf(id) + 1).padStart(2, "0");

/* -------------------------------------------------------------------- hero */

function hero(ctx) {
  const lines = home.hero.lines
    .map((text) => `<span class="reveal-lines__line"><span>${escape(text)}</span></span>`)
    .join("");

  return `      <section class="au-hero au-dark" id="inicio">
        <div class="au-hero__backdrop">${plate(home.hero.plate, { reveal: false })}</div>
        <div class="au-hero__scrim"></div>

        <div class="au-hero__body">
          <p class="au-label au-hero__eyebrow">
            <span class="au-label__index">AG</span><span>${escape(home.hero.eyebrow)}</span>
          </p>
          <h1 class="au-h1 au-hero__title reveal-lines">${lines}</h1>
          <p class="au-lead au-hero__lead">${escape(home.hero.lead)}</p>
          <div class="au-hero__actions">${actions(ctx, home.hero.actions)}</div>
        </div>

        <p class="au-cue"><span class="au-cue__rail"></span>${escape(home.hero.cue)}</p>

        <div class="au-hero__rail">
          <div class="au-hero__rail-inner">${company.figures.map(stat).join("")}</div>
        </div>
      </section>`;
}

/* ----------------------------------------------------------------- clients */

function clientWall() {
  /* The track holds the wall twice: the module scrolls one full copy and wraps,
     which is why the loop has no seam. */
  const run = clients.map(mark).join("");
  return `      <section class="au-section au-clients" id="clientes" aria-labelledby="clientes-t">
        <h2 class="au-clients__title" id="clientes-t">${escape(home.clientsTitle)}</h2>
        <div class="au-clients__viewport" data-marquee>
          <div class="au-clients__track" data-marquee-track>
            <div class="au-clients__track" data-marquee-run>${run}</div>
            <div class="au-clients__track" aria-hidden="true">${run}</div>
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------------ introduction */

function intro(ctx) {
  return `      <section class="au-section" id="compania">
        <div class="au-shell">
          <div class="au-grid">
            <div class="au-intro__title" data-reveal="fade">
              <p class="au-label">
                <span class="au-label__index">${at("compania")} / ${TOTAL}</span>
                <span>${escape(home.intro.label)}</span>
              </p>
              <h2 class="au-h2" style="margin-top:1.5rem">${escape(home.intro.title)}</h2>
            </div>
            <div class="au-intro__body" data-reveal="fade">
              ${home.intro.body.map((text) => `<p class="au-body">${escape(text)}</p>`).join("")}
              <div style="margin-top:1.5rem">${arrowLink(
                home.intro.action.label,
                href(ctx, home.intro.action),
              )}</div>
            </div>
          </div>
          ${metrics(company.figures)}
        </div>
      </section>`;
}

/* --------------------------------------------------------------- solutions */

function solutions(ctx) {
  const blocks = services
    .map((service, index) => {
      const flip = index % 2 === 1;
      return `          <article class="au-capability${flip ? " au-capability--flip" : ""}">
            <div class="au-capability__figure" data-reveal="fade">
              ${figure(service.plate, service.caption, { index: service.index })}
            </div>
            <div class="au-capability__body" data-reveal="${flip ? "left" : "right"}">
              <span class="au-capability__index">${escape(service.index)}</span>
              <h3 class="au-capability__title">${escape(service.title)}</h3>
              <p class="au-capability__text">${escape(service.summary)}</p>
              ${bullets(service.home)}
              ${arrowLink("Explorar capacidades", sub(ctx, "servicios", service.slug))}
            </div>
          </article>`;
    })
    .join("\n");

  return `      <section class="au-section" id="soluciones">
        <div class="au-shell">
          ${head({
            index: at("soluciones"),
            total: TOTAL,
            label: servicesIntro.label,
            title: servicesIntro.title,
            body: servicesIntro.text,
            action: button("Ver todas las soluciones", page(ctx, "servicios")),
          })}
${blocks}
        </div>
      </section>`;
}

/* -------------------------------------------------------------- industries */

/**
 * The industry selector.
 *
 * A real tab set: one tablist, one panel at a time, arrow keys between tabs.
 * Every panel is in the document, so with JavaScript off the reader gets all
 * six industries in sequence instead of one and five dead buttons.
 */
function industrySection(ctx) {
  const tabs = industries
    .map(
      (industry, index) =>
        `            <button
              class="au-tab"
              type="button"
              role="tab"
              id="tab-${industry.id}"
              aria-controls="panel-${industry.id}"
              aria-selected="${index === 0}"
              tabindex="${index === 0 ? "0" : "-1"}"
            ><span class="au-tab__index">${escape(industry.index)}</span>${escape(industry.name)}</button>`,
    )
    .join("\n");

  const panels = industries
    .map(
      (industry, index) => `          <div
            class="au-industry"
            role="tabpanel"
            id="panel-${industry.id}"
            aria-labelledby="tab-${industry.id}"
            tabindex="0"
            ${index === 0 ? "" : "hidden"}
          >
            <div class="au-industry__figure">${figure(industry.plate, industry.caption, {
              index: industry.index,
              reveal: false,
            })}</div>
            <div class="au-industry__grid">
              <div>
                <h3 class="au-industry__title">${escape(industry.title)}</h3>
                <p class="au-industry__text">${escape(industry.text)}</p>
                <div style="margin-top:1.5rem">${arrowLink(
                  `Ver capacidades para ${industry.name.toLowerCase()}`,
                  `${page(ctx, "industrias")}#${industry.id}`,
                )}</div>
              </div>
              <div>
                ${bullets(industry.capabilities, "au-industry__caps")}
              </div>
            </div>
            <div class="au-industry__case">
              <p class="au-industry__case-label">${escape(industry.example.label)}</p>
              <p class="au-industry__case-text">${escape(industry.example.text)}</p>
              <div class="au-industry__case-figure">
                ${industry.example.figures
                  .map(
                    (item) =>
                      `<div><b>${escape(item.value)}</b><span>${escape(item.label)}</span></div>`,
                  )
                  .join("")}
              </div>
            </div>
          </div>`,
    )
    .join("\n");

  return `      <section class="au-section" id="industrias">
        <div class="au-shell">
          ${head({
            index: at("industrias"),
            total: TOTAL,
            label: industriesIntro.label,
            title: industriesIntro.title,
            body: industriesIntro.text,
          })}
          <div class="au-industries" data-tabs>
            <div class="au-industries__tabs" role="tablist" aria-label="Industrias">
${tabs}
            </div>
            <div>
${panels}
            </div>
          </div>
        </div>
      </section>`;
}

/* ---------------------------------------------------------------- the case */

function caseStudy(ctx) {
  const project = featured();
  return `      <section class="au-section au-dark" id="caso">
        <div class="au-shell">
          ${head({
            index: at("caso"),
            total: TOTAL,
            label: project.kicker,
            title: project.title,
            body: project.summary,
            action: button("Ver proyecto", sub(ctx, "proyectos", project.slug), { solid: true }),
          })}
          <div class="au-case">
            <div class="au-case__figure" data-reveal="scale">
              ${figure(project.plate, project.caption, { index: project.index })}
            </div>
            <div class="au-case__body" data-reveal="fade">
              <p class="au-case__meta">
                <span>Cliente <b>${escape(project.client)}</b></span>
                <span>Industria <b>${escape(project.industry)}</b></span>
                <span>Alcance <b>${escape(project.country)}</b></span>
              </p>
              ${results(project.results)}
            </div>
          </div>
        </div>
      </section>`;
}

/* ---------------------------------------------------------------- pillars */

function pillars() {
  const items = home.pillars.items
    .map(
      (item) => `            <article class="au-pillar" data-reveal="rise">
              <p class="au-pillar__index">${escape(item.index)}</p>
              <h3 class="au-pillar__title">${escape(item.title)}</h3>
              <p class="au-pillar__text">${escape(item.text)}</p>
            </article>`,
    )
    .join("\n");

  return `      <section class="au-section" id="razones">
        <div class="au-shell">
          ${head({
            index: at("razones"),
            total: TOTAL,
            label: home.pillars.label,
            title: home.pillars.title,
            body: home.pillars.text,
          })}
          <div class="au-pillars" data-reveal-group>
${items}
          </div>
        </div>
      </section>`;
}

/* -------------------------------------------------------------- the method */

function method() {
  const steps = home.method.steps
    .map(
      (step) => `            <article class="au-step" data-step>
              <p class="au-step__index">${escape(step.index)}</p>
              <h3 class="au-step__title">${escape(step.title)}</h3>
              <p class="au-step__text">${escape(step.text)}</p>
              <p class="au-step__out">${escape(step.out)}</p>
            </article>`,
    )
    .join("\n");

  return `      <section class="au-section" id="metodologia">
        <div class="au-shell">
          ${head({
            index: at("metodologia"),
            total: TOTAL,
            label: home.method.label,
            title: home.method.title,
            body: home.method.text,
          })}
          <div class="au-process" data-process>
            <div class="au-process__rail" aria-hidden="true"></div>
${steps}
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------------ certificates */

function certificates() {
  const items = certifications.items
    .map(
      (item) => `            <article class="au-cert" data-reveal="fade">
              <p class="au-cert__name">${escape(item.name)}</p>
              <p class="au-cert__code">${escape(item.code)}</p>
              <p class="au-cert__text">${escape(item.text)}</p>
            </article>`,
    )
    .join("\n");

  return `      <section class="au-section" id="certificaciones">
        <div class="au-shell">
          ${head({
            index: at("certificaciones"),
            total: TOTAL,
            label: certifications.label,
            title: certifications.title,
            body: certifications.text,
          })}
          <div class="au-certs" data-reveal-group>
${items}
          </div>
          <p class="au-note" style="margin-top:2rem">
            Miembro de ${escape(certifications.partners.join(" · "))}.
          </p>
        </div>
      </section>`;
}

/* -------------------------------------------------------------- the atlas */

/**
 * The drawn world.
 *
 * Land is one path of dots rasterised from continent outlines at build time —
 * a single `d` attribute rather than two thousand DOM nodes, because this map
 * is on the page every visitor loads.
 */
function atlas() {
  const markers = offices
    .map((office, index) => {
      const [x, y] = projectPoint(office.lon, office.lat);
      const anchor = office.anchor === "end" ? "end" : "start";
      const dx = anchor === "end" ? -16 : 16;
      return `              <g class="au-office" data-office="${office.id}" aria-hidden="true"
                style="--pin-delay:${240 + index * 130}ms">
                <circle class="au-office__halo" cx="${x}" cy="${y}" r="26" />
                <circle class="au-office__ring" cx="${x}" cy="${y}" r="9" />
                <circle class="au-office__dot" cx="${x}" cy="${y}" r="3.4" />
                <text class="au-office__label" x="${x + dx}" y="${y + 4}"
                  text-anchor="${anchor}">${escape(office.city)}</text>
              </g>`;
    })
    .join("\n");

  const cards = offices
    .map(
      (office) => `            <button class="au-office-card" type="button" data-office="${office.id}">
              <span class="au-office-card__head">
                <span class="au-office-card__city">${escape(office.city)}</span>
                <span class="au-office-card__country">${escape(office.country)}</span>
              </span>
              <span class="au-office-card__kind">${escape(office.kind)}</span>
              <span class="au-office-card__text">${escape(office.text)}</span>
            </button>`,
    )
    .join("\n");

  return `      <section class="au-section au-dark au-dark--navy" id="presencia">
        <div class="au-shell">
          ${head({
            index: at("presencia"),
            total: TOTAL,
            label: home.atlas.label,
            title: home.atlas.title,
            body: home.atlas.text,
          })}
          <div class="au-atlas" data-atlas data-reveal="fade">
            <div class="au-atlas__map">
              <svg class="au-atlas__svg" viewBox="0 0 ${MAP.width} ${MAP.height}"
                role="img" aria-label="Mapa del mundo con las cinco oficinas permanentes de Aurelis Group">
                <path class="au-atlas__graticule" d="${graticulePath()}" />
                <path class="au-atlas__land" d="${landPath()}" />
${markers}
              </svg>
              <p class="au-atlas__legend">
                <span><i></i>${escape(home.atlas.legend[0])}</span>
                <span>${escape(home.atlas.legend[1])}</span>
              </p>
            </div>
            <div>
              <div class="au-offices">
${cards}
              </div>
              <p class="au-note" style="margin-top:1.5rem">${escape(home.atlas.note)}</p>
            </div>
          </div>
        </div>
      </section>`;
}

/* --------------------------------------------------------------- the rest */

function testimonials() {
  return `      <section class="au-section" id="testimonios">
        <div class="au-shell">
          ${head({
            index: at("testimonios"),
            total: TOTAL,
            label: home.testimonials.label,
            title: home.testimonials.title,
          })}
          <div class="au-quotes" data-reveal-group>
            ${home.testimonials.items.map(quote).join("")}
          </div>
        </div>
      </section>`;
}

function resources(ctx) {
  const cards = insights
    .slice(0, 3)
    .map((item) => {
      const target = item.slug
        ? sub(ctx, "recursos", item.slug)
        : page(ctx, "contacto", "formulario");
      return `            <a class="au-insight" href="${target}" data-reveal="rise">
              <div class="au-insight__figure">${figure(item.plate, item.caption, {
                reveal: false,
              })}</div>
              <p class="au-insight__meta">
                <span class="au-insight__kind">${escape(item.kind)}</span>
                <span>${escape(item.dateLabel)}</span>
                <span>${escape(item.read)}</span>
              </p>
              <h3 class="au-insight__title">${escape(item.title)}</h3>
              <p class="au-insight__text">${escape(item.summary)}</p>
            </a>`;
    })
    .join("\n");

  return `      <section class="au-section" id="recursos">
        <div class="au-shell">
          ${head({
            index: at("recursos"),
            total: TOTAL,
            label: "Recursos",
            title: "Análisis del equipo técnico",
            body: "Lo que publicamos cuando un problema se repite lo suficiente como para merecer una respuesta escrita.",
            action: button("Ver todos los recursos", page(ctx, "recursos")),
          })}
          <div class="au-insights" data-reveal-group>
${cards}
          </div>
        </div>
      </section>`;
}

export function closingCta(ctx, cta) {
  return `      <section class="au-section au-dark au-cta" id="contacto">
        <svg class="au-cta__ornament" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
          <circle cx="200" cy="200" r="199" />
          <circle cx="200" cy="200" r="150" />
          <circle cx="200" cy="200" r="101" />
        </svg>
        <div class="au-shell">
          <div data-reveal="fade">
            <h2 class="au-cta__title">${escape(cta.title)}</h2>
            <p class="au-cta__text au-lead">${escape(cta.text)}</p>
            <div class="au-cta__actions">${actions(ctx, cta.actions)}</div>
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------------------- page */

export function homeBody(ctx) {
  return [
    hero(ctx),
    clientWall(),
    intro(ctx),
    solutions(ctx),
    industrySection(ctx),
    caseStudy(ctx),
    pillars(),
    method(),
    certificates(),
    atlas(),
    testimonials(),
    resources(ctx),
    closingCta(ctx, home.cta),
  ].join("\n\n");
}

export const homeMeta = {
  title: "Ingeniería, tecnología y operación",
  description: company.summary,
  canonical: "",
  ogType: "website",
  schema: [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: company.full,
      description: company.summary,
    },
  ],
};

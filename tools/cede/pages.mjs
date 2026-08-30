/**
 * Every page of the portal that is not the home page or the Observatory.
 *
 * Institution, policy, planning, programmes, normative library, resolutions,
 * digital library, participation and its consultation files, transparency, open
 * data, newsroom and its articles, contact, search, the 404 and the
 * demonstration back office.
 *
 * They are all built from the same blocks, which is the point: thirty pages
 * that feel like one system rather than one template applied thirty times.
 */

import { departments } from "../../src/data/cede/geography.js";
import { decimal, escape, group, longDate, shortDate, dateParts } from "../../src/data/cede/format.js";
import {
  contact,
  directory,
  institution,
  mandate,
  network,
  notice,
} from "../../src/data/cede/institution.js";
import { agenda, agendaStates, policy, tasks } from "../../src/data/cede/policy.js";
import { axes, milestoneStates, milestones, plan, programmes } from "../../src/data/cede/plan.js";
import {
  documentTypes,
  documentStates,
  kindName,
  library,
  libraryKinds,
  libraryYears,
  normative,
  resolutions,
  themeName,
  themes,
  typeName,
} from "../../src/data/cede/documents.js";
import { articles, events, knowledge, newsCategories } from "../../src/data/cede/newsroom.js";
import {
  consultationStates,
  consultations,
  howToParticipate,
  mechanisms,
  participationTotals,
  surveys,
} from "../../src/data/cede/participation.js";
import {
  datasets,
  requests,
  transparencyCategories,
} from "../../src/data/cede/transparency.js";
import { CURRENT_YEAR, enrolment, finance, metricFor, rate } from "../../src/data/cede/statistics.js";
import { barChart, networkDiagram } from "../../src/scripts/cede/charts.js";
import {
  arrowLink,
  button,
  card,
  chartBlock,
  demoTag,
  head,
  icon,
  page,
  pageHero,
  statePill,
  sub,
  table,
} from "./blocks.mjs";
import { articleSchema, datasetSchema } from "./shell.mjs";

const paragraphs = (text, className = "cd-prose__p") =>
  String(text)
    .split("\n\n")
    .map((block) => `<p class="${className}">${escape(block.trim())}</p>`)
    .join("");

/* ============================================================= institution */

export function institutionPage(ctx) {
  const seats = directory
    .map(
      (seat) =>
        `<div class="cd-row-item" data-reveal="fade">` +
        `<p class="cd-row-item__index">${escape(seat.index)}</p>` +
        `<p class="cd-row-item__title">${escape(seat.seat)}</p>` +
        `<div><p class="cd-row-item__text">${escape(seat.text)}</p>` +
        `<p class="cd-row-item__meta">${escape(seat.kind)}</p></div></div>`,
    )
    .join("");

  const body = `      ${pageHero({
    ctx,
    dark: true,
    trail: [{ label: "Inicio", route: "home" }, { label: "Institución" }],
    label: "La institución",
    title: mandate.title,
    lead: mandate.lead,
    meta: [
      { term: "Creación", detail: `${institution.founded} (ficticia)` },
      { term: "Naturaleza", detail: "Órgano de coordinación y de información pública" },
      { term: "Ámbito", detail: "Nacional" },
    ],
  })}

      <section class="cd-section" id="mandato">
        <div class="cd-shell">
          ${head({
            index: "01",
            label: "Mandato",
            title: "Qué hace el Consejo y qué no hace.",
            body: "Coordinar no es administrar: la diferencia define todo lo demás.",
          })}
          <div class="cd-prose cd-prose--lead">${paragraphs(mandate.body)}</div>
        </div>
      </section>

      <section class="cd-section cd-section--surface" id="mision">
        <div class="cd-shell">
          ${head({ index: "02", label: "Misión y visión", title: "Hacia dónde trabaja la institución." })}
          <div class="cd-grid cd-grid--2">
            <div class="cd-card cd-card--flat" data-reveal="rise">
              <p class="cd-card__kicker">Misión</p>
              <p class="cd-statement cd-statement--wide">${escape(mandate.mission)}</p>
            </div>
            <div class="cd-card cd-card--flat" data-reveal="rise">
              <p class="cd-card__kicker">Visión</p>
              <p class="cd-statement cd-statement--wide">${escape(mandate.vision)}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="cd-section" id="funciones">
        <div class="cd-shell">
          ${head({
            index: "03",
            label: "Funciones",
            title: "Seis funciones, un solo propósito.",
            body: "Cada función corresponde a un instrumento concreto que el portal hace público.",
          })}
          <div class="cd-rows" data-reveal-group>
            ${mandate.functions
              .map(
                (item) =>
                  `<div class="cd-row-item" data-reveal="fade">` +
                  `<p class="cd-row-item__index">${escape(item.index)}</p>` +
                  `<p class="cd-row-item__title">${escape(item.title)}</p>` +
                  `<div><p class="cd-row-item__text">${escape(item.text)}</p></div></div>`,
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="cd-section cd-section--sunken" id="principios">
        <div class="cd-shell">
          ${head({ index: "04", label: "Principios", title: "Las reglas que el Consejo se impone." })}
          <div class="cd-grid cd-grid--3" data-reveal-group>
            ${mandate.principles
              .map((item) =>
                card({ kicker: item.index, title: item.title, text: item.text, serif: true }),
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="cd-section" id="estructura">
        <div class="cd-shell">
          ${head({
            index: "05",
            label: "Estructura y directorio",
            title: "Quién integra el Consejo.",
            body:
              "Se publican los asientos institucionales y lo que cada uno aporta, no nombres de " +
              "personas: esta es una demostración, y un funcionario inventado sería un funcionario falso.",
          })}
          <div class="cd-rows" id="directorio" data-reveal-group>${seats}</div>
        </div>
      </section>

      <section class="cd-section cd-section--surface" id="red">
        <div class="cd-shell">
          ${head({ index: "06", label: "Sistema articulado", title: network.title, body: network.lead })}
          <div class="cd-network" data-network>
            <div>${networkDiagram(network)}</div>
            <div class="cd-network__legend">
              ${network.nodes
                .map(
                  (node) =>
                    `<div class="cd-network__entry" data-network-entry="${node.id}">` +
                    `<p class="cd-network__name">${escape(node.label)}</p>` +
                    `<p class="cd-network__text">${escape(node.contributes)}</p></div>`,
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="cd-section" id="historia">
        <div class="cd-shell">
          ${head({ index: "07", label: "Historia institucional", title: "Cinco años de construcción." })}
          <ol class="cd-timeline" data-reveal-group>
            ${mandate.history
              .map(
                (item) =>
                  `<li class="cd-timeline__item" data-state="cumplido" data-reveal="fade">` +
                  `<p class="cd-timeline__date">${escape(item.year)}</p>` +
                  `<div><p class="cd-timeline__title">${escape(item.title)}</p>` +
                  `<p class="cd-timeline__text">${escape(item.text)}</p></div></li>`,
              )
              .join("")}
          </ol>
        </div>
      </section>`;

  return {
    meta: {
      title: "Institución",
      canonical: "institucion.html",
      description:
        "Mandato, misión, visión, funciones, principios, estructura e historia del Consejo " +
        "Estratégico para el Desarrollo Educativo, entidad ficticia de demostración.",
    },
    current: "institucion",
    body,
  };
}

/* ================================================================== policy */

export function policyPage(ctx) {
  const agendaRows = agenda
    .map(
      (item) =>
        `<div class="cd-doc" data-reveal="fade">` +
        `<p class="cd-doc__code">${escape(item.code)}</p>` +
        `<div><p class="cd-doc__title">${escape(item.title)}</p>` +
        `<p class="cd-doc__text">${escape(item.text)}</p></div>` +
        `<div class="cd-doc__meta">${statePill(item.state, agendaStates[item.state].label)}` +
        `<span>${escape(item.since)}</span></div></div>`,
    )
    .join("");

  const body = `      ${pageHero({
    ctx,
    trail: [{ label: "Inicio", route: "home" }, { label: "Política educativa" }],
    label: "Política educativa",
    title: policy.title,
    lead: policy.lead,
    meta: [
      { term: "Marco vigente", detail: "Política Educativa Nacional 2026–2035" },
      { term: "Consulta previa", detail: "Obligatoria para toda política nacional" },
      { term: "Seguimiento", detail: "Informe semestral público" },
    ],
  })}

      <section class="cd-section" id="que-es">
        <div class="cd-shell">
          ${head({
            index: "01",
            label: "Qué es una política educativa",
            title: "Una política no es un plan, ni un programa.",
            body: "La distinción no es académica: determina qué se puede exigir y durante cuánto tiempo.",
          })}
          <div class="cd-prose cd-prose--lead">${paragraphs(policy.whatIs)}</div>
        </div>
      </section>

      <section class="cd-section cd-section--surface" id="objetivos">
        <div class="cd-shell">
          ${head({ index: "02", label: "Objetivos", title: "Cinco objetivos de política." })}
          <div class="cd-rows" data-reveal-group>
            ${policy.objectives
              .map(
                (item) =>
                  `<div class="cd-row-item" data-reveal="fade">` +
                  `<p class="cd-row-item__index">${escape(item.index)}</p>` +
                  `<p class="cd-row-item__title">${escape(item.title)}</p>` +
                  `<div><p class="cd-row-item__text">${escape(item.text)}</p></div></div>`,
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="cd-section" id="principios-politica">
        <div class="cd-shell">
          ${head({ index: "03", label: "Principios", title: "Cómo se formula y se aplica." })}
          <div class="cd-grid cd-grid--3" data-reveal-group>
            ${policy.principles
              .map((item) => card({ title: item.title, text: item.text, serif: true }))
              .join("")}
          </div>
        </div>
      </section>

      <section class="cd-section cd-section--sunken" id="lineas">
        <div class="cd-shell">
          ${head({
            index: "04",
            label: "Líneas estratégicas",
            title: "Seis líneas, cada una con su indicador.",
            body: "Una línea de acción que no declara cómo se medirá no puede evaluarse.",
          })}
          <div class="cd-rows" data-reveal-group>
            ${policy.lines
              .map(
                (line) =>
                  `<div class="cd-row-item" data-reveal="fade">` +
                  `<p class="cd-row-item__index">${escape(line.index)}</p>` +
                  `<p class="cd-row-item__title">${escape(line.title)}</p>` +
                  `<div><p class="cd-row-item__text">${escape(line.text)}</p>` +
                  `<p class="cd-row-item__meta">Indicador de seguimiento: ${escape(line.indicator)}</p></div></div>`,
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="cd-section" id="seguimiento">
        <div class="cd-shell">
          ${head({
            index: "05",
            label: "Mecanismos de seguimiento",
            title: "Cómo se sabrá si la política funcionó.",
            action: button("Ver el monitor del plan", page(ctx, "planificacion", "monitor"), {
              ghost: true,
              icon: "arrow",
            }),
          })}
          <div class="cd-prose cd-prose--lead">${paragraphs(policy.monitoring)}</div>
        </div>
      </section>

      <section class="cd-section cd-section--surface" id="agenda">
        <div class="cd-shell">
          ${head({
            index: "06",
            label: "Agenda de políticas",
            title: "Qué está vigente, qué se está formulando y qué está en consulta.",
            body:
              "Publicar la agenda permite que una política se conozca antes de decidirse, no " +
              "después de aprobada.",
          })}
          <div class="cd-docs" data-reveal-group>${agendaRows}</div>
          <div class="cd-actions" style="margin-top:1.5rem">
            ${button("Documentos de política", page(ctx, "biblioteca"), { ghost: true })}
            ${button("Consultas públicas abiertas", page(ctx, "participacion", "consultas"), { ghost: true })}
          </div>
        </div>
      </section>`;

  return {
    meta: {
      title: "Política educativa",
      canonical: "politica-educativa.html",
      description:
        "Marco de política educativa demostrativo: qué es una política educativa, objetivos, " +
        "principios, líneas estratégicas, mecanismos de seguimiento y agenda de políticas.",
    },
    current: "politica",
    body,
  };
}

/* ================================================================ planning */

export function planningPage(ctx) {
  const axisBlocks = axes
    .map(
      (axis) =>
        `<article class="cd-section cd-section--tight" id="eje-${axis.id}">
          <div class="cd-shell">
            <div class="cd-board__head">
              <div>
                <h2 class="cd-board__title">
                  <span class="cd-board__index">Eje ${escape(axis.index)}</span>${escape(axis.name)}
                </h2>
                <p class="cd-board__lead">${escape(axis.lead)}</p>
              </div>
              <div>
                <p class="cd-axisrow__value">${escape(decimal(axis.progress, 1))} % de avance</p>
                <span class="cd-meter" role="img" aria-label="${escape(
                  `${axis.name}: ${decimal(axis.progress, 1)} % de avance`,
                )}"><span class="cd-meter__fill" style="width:${axis.progress}%"></span></span>
              </div>
            </div>
            <div class="cd-prose">${paragraphs(axis.text)}</div>
            ${table({
              columns: [
                { label: "Objetivo", key: "name" },
                { label: "Indicador", key: "indicator" },
                { label: "Línea base", key: "baseline", numeric: true },
                { label: "Meta 2035", key: "goal", numeric: true },
                { label: "Estado", key: "state" },
              ],
              rows: axis.objectives.map((objective) => ({
                cells: [
                  objective.name,
                  objective.indicator,
                  objective.baseline,
                  objective.goal,
                  statePill(objective.state, objective.state === "cumplido" ? "Cumplido" : objective.state === "curso" ? "En curso" : "Requiere atención"),
                ],
              })),
              caption: `Objetivos del eje ${axis.index}. Metas y líneas base demostrativas.`,
            })}
          </div>
        </article>`,
    )
    .join("\n");

  const totals = [
    { value: plan.totals.objectives, label: "Objetivos estratégicos" },
    { value: plan.totals.indicators, label: "Indicadores" },
    { value: plan.totals.programmes, label: "Programas" },
    { value: `${plan.totals.milestonesReached} / ${plan.totals.milestones}`, label: "Hitos alcanzados" },
  ]
    .map(
      (total) =>
        `<div class="cd-monitor__total"><b>${escape(String(total.value))}</b><span>${escape(total.label)}</span></div>`,
    )
    .join("");

  const body = `      ${pageHero({
    ctx,
    dark: true,
    trail: [{ label: "Inicio", route: "home" }, { label: "Planificación" }],
    label: `${plan.code} · Planificación`,
    title: plan.title,
    lead: plan.lead,
    meta: [
      { term: "Vigencia", detail: plan.period },
      { term: "Aprobación", detail: plan.approved },
      { term: "Avance global", detail: `${decimal(plan.progress, 1)} % (demostrativo)` },
    ],
  })}

      <section class="cd-section">
        <div class="cd-shell">
          ${head({
            index: "01",
            label: "El plan",
            title: "Un plan es una promesa con fecha.",
            body: "Cinco ejes, quince indicadores estratégicos y cuarenta y seis hitos verificables.",
          })}
          <div class="cd-prose cd-prose--lead">${paragraphs(plan.summary)}</div>

          <div class="cd-grid cd-grid--4" style="margin-top:2rem" data-reveal-group>
            ${plan.horizon
              .map((step) =>
                card({
                  kicker: step.year,
                  title: step.label,
                  text: step.text,
                }),
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="cd-section cd-section--sunken" id="monitor">
        <div class="cd-shell">
          ${head({
            index: "02",
            label: "Monitor del plan",
            title: "El avance, eje por eje.",
            body:
              "El tablero muestra también lo que no avanza: dos de los cinco ejes están por debajo " +
              "de lo programado, y el informe explica por qué.",
            action: button("Ver el informe semestral", sub(ctx, "noticias", "informe-avance-plan"), {
              ghost: true,
              icon: "arrow",
            }),
          })}

          <div class="cd-monitor">
            <div>
              <div class="cd-monitor__totals">${totals}</div>
              <div class="cd-monitor__overall">
                <p class="cd-monitor__overall-value">${escape(decimal(plan.progress, 1))} %</p>
                <p class="cd-monitor__overall-label">Avance global · ${escape(notice.dataShort)}</p>
              </div>
            </div>
            <div data-reveal-group>
              ${axes
                .map(
                  (axis) =>
                    `<div class="cd-axisrow" data-reveal="fade"><div class="cd-axisrow__top">` +
                    `<a class="cd-axisrow__name" href="#eje-${axis.id}">` +
                    `<span class="cd-axisrow__index">${escape(axis.index)}</span>${escape(axis.name)}</a>` +
                    `<span class="cd-axisrow__value">${escape(decimal(axis.progress, 1))} %</span></div>` +
                    `<span class="cd-meter" role="img" aria-label="${escape(
                      `${axis.name}: ${decimal(axis.progress, 1)} % de avance`,
                    )}"><span class="cd-meter__fill" style="width:${axis.progress}%"></span></span>` +
                    `<p class="cd-axisrow__text">${escape(axis.lead)}</p></div>`,
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="cd-section" id="hitos">
        <div class="cd-shell">
          ${head({ index: "03", label: "Hitos", title: "Lo alcanzado y lo previsto." })}
          <ol class="cd-timeline" data-reveal-group>
            ${milestones
              .map(
                (item) =>
                  `<li class="cd-timeline__item" data-state="${escape(item.state)}" data-reveal="fade">` +
                  `<p class="cd-timeline__date">${escape(item.date)}</p>` +
                  `<div><p class="cd-timeline__title">${escape(item.title)}` +
                  `${statePill(item.state, milestoneStates[item.state].label)}</p>` +
                  `<p class="cd-timeline__text">${escape(item.text)}</p></div></li>`,
              )
              .join("")}
          </ol>
        </div>
      </section>

      <section class="cd-section cd-section--surface">
        <div class="cd-shell">
          ${head({
            index: "04",
            label: "Los cinco ejes",
            title: "Cada eje, con sus objetivos y sus metas.",
          })}
        </div>
      </section>
${axisBlocks}`;

  return {
    meta: {
      title: "Planificación · Plan Nacional 2026–2035",
      canonical: "planificacion.html",
      description:
        "Plan Nacional de Transformación Educativa 2026–2035, demostrativo: cinco ejes, objetivos, " +
        "indicadores, metas, hitos y monitor público de avance.",
    },
    current: "planificacion",
    body,
  };
}

/* ============================================================== programmes */

export function programmesPage(ctx) {
  const rows = programmes
    .map(
      (programme) =>
        `<div class="cd-doc" data-reveal="fade">` +
        `<p class="cd-doc__code">${escape(programme.code)}</p>` +
        `<div><p class="cd-doc__title">${escape(programme.name)}</p>` +
        `<p class="cd-doc__text">${escape(programme.text)}</p></div>` +
        `<div class="cd-doc__meta"><span>${escape(programme.stage)}</span>` +
        `<span>${escape(programme.reach)}</span></div></div>`,
    )
    .join("");

  const body = `      ${pageHero({
    ctx,
    trail: [{ label: "Inicio", route: "home" }, { label: "Programas" }],
    label: "Programas",
    title: "Los programas que ejecutan el plan.",
    lead:
      "Veintiocho programas en el plan nacional; ocho con expediente público en esta demostración. " +
      "Cada uno declara el eje al que responde: ningún programa existe fuera del plan.",
    meta: [
      { term: "Programas del plan", detail: String(plan.totals.programmes) },
      { term: "Con expediente público", detail: String(programmes.length) },
      { term: "Ejes", detail: String(axes.length) },
    ],
  })}

      <section class="cd-section">
        <div class="cd-shell">
          ${head({
            index: "01",
            label: "Por eje del plan",
            title: "Cinco ejes, veintiocho programas.",
            action: arrowLink("Ver el plan completo", page(ctx, "planificacion")),
          })}
          <div class="cd-grid cd-grid--3" data-reveal-group>
            ${axes
              .map((axis) =>
                card({
                  kicker: `Eje ${axis.index}`,
                  title: axis.name,
                  text: axis.lead,
                  serif: true,
                  target: page(ctx, "planificacion", `eje-${axis.id}`),
                  foot: `<span>${axis.programmes} programas</span><span class="cd-num">${decimal(axis.progress, 1)} %</span>`,
                }),
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="cd-section cd-section--surface">
        <div class="cd-shell">
          ${head({ index: "02", label: "Expedientes", title: "Programas con registro público." })}
          <div class="cd-docs" data-reveal-group>${rows}</div>
          <p class="cd-note cd-note--boxed" style="margin-top:1.5rem">${escape(notice.data)}</p>
        </div>
      </section>`;

  return {
    meta: {
      title: "Programas",
      canonical: "programas.html",
      description:
        "Programas demostrativos que ejecutan el Plan Nacional de Transformación Educativa, " +
        "organizados por eje estratégico.",
    },
    current: "programas",
    body,
  };
}

/* ================================================================ normative */

export function normativePage(ctx) {
  const rows = normative
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(
      (item) =>
        `<article class="cd-doc" data-doc data-type="${escape(item.type)}" data-theme="${escape(item.theme)}" ` +
        `data-state="${escape(item.state)}" data-year="${item.date.slice(0, 4)}" ` +
        `data-text="${escape(`${item.title} ${item.code} ${item.summary}`.toLowerCase())}">` +
        `<p class="cd-doc__code">${escape(item.code)}</p>` +
        `<div><p class="cd-doc__title">${escape(item.title)}</p>` +
        `<p class="cd-doc__text">${escape(item.summary)}</p>` +
        `<p class="cd-doc__meta"><span>${escape(typeName(item.type))}</span>` +
        `<span>${escape(themeName(item.theme))}</span>` +
        `<span>${escape(longDate(item.date))}</span>` +
        `<span>PDF · ${escape(item.size)}${item.pages ? ` · ${item.pages} páginas` : ""}</span></p></div>` +
        `<div class="cd-doc__meta">${statePill(item.state, documentStates.find((s) => s.id === item.state).name)}` +
        `<button class="cd-download" type="button" data-document="${escape(item.code)}">` +
        `${icon("download")}Descargar</button></div></article>`,
    )
    .join("");

  const body = `      ${pageHero({
    ctx,
    trail: [{ label: "Inicio", route: "home" }, { label: "Normativa" }],
    label: "Marco normativo",
    title: "La biblioteca jurídica del sistema educativo.",
    lead:
      "Leyes, reglamentos, acuerdos, políticas, lineamientos y circulares, con su código, su fecha " +
      "y su estado. Todo instrumento de esta demostración es ficticio.",
    meta: [
      { term: "Instrumentos", detail: String(normative.length) },
      { term: "Tipos", detail: String(documentTypes.length) },
      { term: "Última actualización", detail: longDate("2026-08-20") },
    ],
  })}

      <section class="cd-section cd-section--tight" id="buscador">
        <div class="cd-shell">
          <div class="cd-toolbar" data-doc-filters>
            <div class="cd-toolbar__row">
              <div class="cd-field">
                <label class="cd-field__label" for="n-q">Buscar</label>
                <input class="cd-input" id="n-q" type="search" data-doc-search
                  placeholder="Título, código o descripción" autocomplete="off" />
              </div>
              <div class="cd-field">
                <label class="cd-field__label" for="n-type">Tipo</label>
                <span class="cd-select"><select id="n-type" data-doc-filter="type">
                  <option value="all">Todos los tipos</option>
                  ${documentTypes.map((type) => `<option value="${type.id}">${escape(type.plural)}</option>`).join("")}
                </select></span>
              </div>
              <div class="cd-field">
                <label class="cd-field__label" for="n-theme">Tema</label>
                <span class="cd-select"><select id="n-theme" data-doc-filter="theme">
                  <option value="all">Todos los temas</option>
                  ${themes.map((theme) => `<option value="${theme.id}">${escape(theme.name)}</option>`).join("")}
                </select></span>
              </div>
              <div class="cd-field">
                <label class="cd-field__label" for="n-year">Año</label>
                <span class="cd-select"><select id="n-year" data-doc-filter="year">
                  <option value="all">Todos los años</option>
                  ${[...new Set(normative.map((item) => item.date.slice(0, 4)))]
                    .sort()
                    .reverse()
                    .map((year) => `<option value="${year}">${year}</option>`)
                    .join("")}
                </select></span>
              </div>
              <div class="cd-field">
                <label class="cd-field__label" for="n-state">Estado</label>
                <span class="cd-select"><select id="n-state" data-doc-filter="state">
                  <option value="all">Todos los estados</option>
                  ${documentStates.map((state) => `<option value="${state.id}">${escape(state.name)}</option>`).join("")}
                </select></span>
              </div>
            </div>
            <div class="cd-toolbar__foot">
              <span data-doc-count data-one="instrumento" data-many="instrumentos">${normative.length} instrumentos</span>
              <button class="cd-btn cd-btn--small cd-btn--ghost" type="button" data-doc-reset>Limpiar filtros</button>
            </div>
          </div>

          <div class="cd-docs" data-doc-list>${rows}</div>
          <p class="cd-note" data-doc-empty hidden style="padding:2rem 0">
            Ningún instrumento coincide con los filtros aplicados.
          </p>

          <div class="cd-actions" style="margin-top:1.5rem">
            ${button("Resoluciones y acuerdos", page(ctx, "resoluciones"), { ghost: true, icon: "arrow" })}
            ${button("Biblioteca digital", page(ctx, "biblioteca"), { ghost: true })}
          </div>
        </div>
      </section>`;

  return {
    meta: {
      title: "Normativa",
      canonical: "normativa.html",
      description:
        "Marco normativo demostrativo del sistema educativo: leyes, reglamentos, acuerdos, " +
        "políticas, lineamientos y circulares, con buscador y filtros.",
    },
    current: "normativa",
    body,
  };
}

/* ============================================================== resolutions */

export function resolutionsPage(ctx) {
  const rows = resolutions.map((item) => ({
    id: item.code,
    cells: [
      item.code,
      escape(item.title),
      escape(themeName(item.theme)),
      escape(item.session),
      escape(shortDate(item.date)),
      statePill(item.state, "Vigente"),
    ],
    values: [item.code, item.title, item.theme, item.session, item.date, item.state],
  }));

  const body = `      ${pageHero({
    ctx,
    trail: [
      { label: "Inicio", route: "home" },
      { label: "Normativa", route: "normativa" },
      { label: "Resoluciones y acuerdos" },
    ],
    label: "Registro de decisiones",
    title: "Resoluciones y acuerdos del Consejo.",
    lead:
      "El registro de lo que el Consejo decide: qué se resolvió, en qué sesión, sobre qué materia y " +
      "qué produjo. Códigos y contenidos ficticios.",
    meta: [
      { term: "Registros", detail: String(resolutions.length) },
      { term: "Período", detail: "2024–2026" },
      { term: "Actualización", detail: "Tras cada sesión" },
    ],
  })}

      <section class="cd-section cd-section--tight">
        <div class="cd-shell">
          <div class="cd-toolbar" data-table-filters>
            <div class="cd-toolbar__row">
              <div class="cd-field">
                <label class="cd-field__label" for="r-q">Buscar</label>
                <input class="cd-input" id="r-q" type="search" data-table-search
                  placeholder="Código, título o materia" autocomplete="off" />
              </div>
              <div class="cd-field">
                <label class="cd-field__label" for="r-theme">Materia</label>
                <span class="cd-select"><select id="r-theme" data-table-filter="2">
                  <option value="all">Todas las materias</option>
                  ${themes.map((theme) => `<option value="${escape(theme.name)}">${escape(theme.name)}</option>`).join("")}
                </select></span>
              </div>
              <div class="cd-field">
                <label class="cd-field__label" for="r-year">Año</label>
                <span class="cd-select"><select id="r-year" data-table-filter="4">
                  <option value="all">Todos los años</option>
                  ${[...new Set(resolutions.map((item) => item.date.slice(0, 4)))]
                    .sort()
                    .reverse()
                    .map((year) => `<option value="${year}">${year}</option>`)
                    .join("")}
                </select></span>
              </div>
            </div>
            <div class="cd-toolbar__foot">
              <span data-table-count data-one="resolución" data-many="resoluciones">${resolutions.length} resoluciones</span>
              <span>${escape(notice.short)}</span>
            </div>
          </div>

          <div data-table-scope>
            ${table({
              columns: [
                { label: "Código", key: "code", sortable: true },
                { label: "Asunto", key: "title", sortable: true },
                { label: "Materia", key: "theme", sortable: true },
                { label: "Sesión", key: "session" },
                { label: "Fecha", key: "date", sortable: true },
                { label: "Estado", key: "state" },
              ],
              rows,
              caption: "Resoluciones y acuerdos del Consejo. Registro demostrativo.",
            })}
          </div>
        </div>
      </section>`;

  return {
    meta: {
      title: "Resoluciones y acuerdos",
      canonical: "resoluciones.html",
      description:
        "Registro demostrativo de resoluciones y acuerdos del Consejo, con buscador, filtros por " +
        "materia y año, y tabla ordenable.",
    },
    current: "normativa",
    body,
  };
}

/* ================================================================= library */

export function libraryPage(ctx) {
  const cards = library
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(
      (item) =>
        `<article class="cd-card" id="${escape(item.slug)}" data-doc data-kind="${escape(item.kind)}" ` +
        `data-theme="${escape(item.theme)}" data-year="${item.year}" ` +
        `data-text="${escape(`${item.title} ${item.summary}`.toLowerCase())}" data-reveal="rise">` +
        `<p class="cd-card__kicker">${escape(kindName(item.kind))} · ${escape(themeName(item.theme))}</p>` +
        `<p class="cd-card__title cd-card__title--serif">${escape(item.title)}</p>` +
        `<p class="cd-card__text">${escape(item.summary)}</p>` +
        `<div class="cd-card__foot"><span>${escape(longDate(item.date))}</span>` +
        `<span>${item.pages ? `${item.pages} páginas · ` : ""}${escape(item.size)}</span></div>` +
        `<div class="cd-actions" style="margin-top:.75rem">` +
        `<button class="cd-download" type="button" data-document="${escape(item.title)}">` +
        `${icon("download")}Descargar PDF</button>` +
        `<button class="cd-download" type="button" data-document="${escape(item.title)}">` +
        `${icon("doc")}Ver ficha</button></div></article>`,
    )
    .join("");

  const body = `      ${pageHero({
    ctx,
    trail: [{ label: "Inicio", route: "home" }, { label: "Biblioteca digital" }],
    label: "Biblioteca digital",
    title: "Todo lo que el Consejo publica, en un solo catálogo.",
    lead:
      "Informes, investigaciones, estudios, documentos de política, manuales, boletines, " +
      "presentaciones y conjuntos de datos. Publicaciones ficticias con fines demostrativos.",
    meta: [
      { term: "Publicaciones", detail: String(library.length) },
      { term: "Tipos", detail: String(libraryKinds.length) },
      { term: "Años", detail: `${Math.min(...libraryYears)}–${Math.max(...libraryYears)}` },
    ],
  })}

      <section class="cd-section cd-section--tight">
        <div class="cd-shell">
          <div class="cd-toolbar" data-doc-filters>
            <div class="cd-toolbar__row">
              <div class="cd-field">
                <label class="cd-field__label" for="b-q">Buscar</label>
                <input class="cd-input" id="b-q" type="search" data-doc-search
                  placeholder="Título o descripción" autocomplete="off" />
              </div>
              <div class="cd-field">
                <label class="cd-field__label" for="b-kind">Tipo</label>
                <span class="cd-select"><select id="b-kind" data-doc-filter="kind">
                  <option value="all">Todos los tipos</option>
                  ${libraryKinds.map((kind) => `<option value="${kind.id}">${escape(kind.name)}</option>`).join("")}
                </select></span>
              </div>
              <div class="cd-field">
                <label class="cd-field__label" for="b-theme">Tema</label>
                <span class="cd-select"><select id="b-theme" data-doc-filter="theme">
                  <option value="all">Todos los temas</option>
                  ${themes.map((theme) => `<option value="${theme.id}">${escape(theme.name)}</option>`).join("")}
                </select></span>
              </div>
              <div class="cd-field">
                <label class="cd-field__label" for="b-year">Año</label>
                <span class="cd-select"><select id="b-year" data-doc-filter="year">
                  <option value="all">Todos los años</option>
                  ${libraryYears.map((year) => `<option value="${year}">${year}</option>`).join("")}
                </select></span>
              </div>
            </div>
            <div class="cd-toolbar__foot">
              <span data-doc-count data-one="publicación" data-many="publicaciones">${library.length} publicaciones</span>
              <span class="cd-switch" role="group" aria-label="Vista">
                <button type="button" data-view="grid" aria-pressed="true">Cuadrícula</button>
                <button type="button" data-view="list" aria-pressed="false">Lista</button>
              </span>
            </div>
          </div>

          <div class="cd-grid cd-grid--3" data-doc-list data-view-target>${cards}</div>
          <p class="cd-note" data-doc-empty hidden style="padding:2rem 0">
            Ninguna publicación coincide con los filtros aplicados.
          </p>
        </div>
      </section>`;

  return {
    meta: {
      title: "Biblioteca digital",
      canonical: "biblioteca.html",
      description:
        "Biblioteca digital demostrativa: informes, investigaciones, estudios, documentos de " +
        "política, manuales y boletines del sistema educativo, con buscador y filtros.",
    },
    current: "normativa",
    body,
  };
}

/* =========================================================== participation */

export function participationPage(ctx) {
  const consultationCards = consultations
    .map(
      (item) =>
        `<article class="cd-card" data-reveal="rise">` +
        `<p class="cd-card__kicker">${escape(item.code)} · ${escape(item.theme)}` +
        `${statePill(item.state, consultationStates[item.state].label)}</p>` +
        `<p class="cd-card__title cd-card__title--serif">${escape(item.title)}</p>` +
        `<p class="cd-card__text">${escape(item.summary)}</p>` +
        `<div class="cd-card__foot"><span>${escape(
          `${longDate(item.opens)} — ${longDate(item.closes)}`,
        )}</span><span>${escape(`${group(item.stats.observations)} observaciones`)}</span></div>` +
        (item.featured
          ? `<div class="cd-actions" style="margin-top:.75rem">` +
            button("Participar", sub(ctx, "participacion", item.slug), { solid: true, small: true, icon: "arrow" }) +
            `</div>`
          : "") +
        `</article>`,
    )
    .join("");

  const body = `      ${pageHero({
    ctx,
    trail: [{ label: "Inicio", route: "home" }, { label: "Participación" }],
    label: "Participación ciudadana",
    title: "Antes de decidir, se consulta. Después, se responde.",
    lead:
      "Lo que hace creíble a una consulta pública no es abrirla: es cerrar el ciclo. Al terminar " +
      "el plazo se publica la respuesta razonada a cada observación recibida.",
    meta: [
      { term: "Consultas abiertas", detail: String(participationTotals.open) },
      { term: "Observaciones recibidas", detail: group(participationTotals.observations) },
      { term: "Organizaciones", detail: group(participationTotals.organisations) },
    ],
  })}

      <section class="cd-section" id="como">
        <div class="cd-shell">
          ${head({ index: "01", label: "Cómo participar", title: "Cuatro pasos, con constancia en cada uno." })}
          <div class="cd-grid cd-grid--4" data-reveal-group>
            ${howToParticipate
              .map((step) => card({ kicker: step.index, title: step.title, text: step.text }))
              .join("")}
          </div>
        </div>
      </section>

      <section class="cd-section cd-section--surface" id="consultas">
        <div class="cd-shell">
          ${head({
            index: "02",
            label: "Consultas públicas",
            title: "Abiertas, cerradas y previstas.",
            body: "El estado de cada consulta y el enlace a su expediente completo.",
          })}
          <div class="cd-grid cd-grid--2" data-reveal-group>${consultationCards}</div>
        </div>
      </section>

      <section class="cd-section" id="foros">
        <div class="cd-shell">
          ${head({ index: "03", label: "Mecanismos", title: "Cuatro formas de incidir." })}
          <div class="cd-rows" data-reveal-group>
            ${mechanisms
              .map(
                (mechanism) =>
                  `<div class="cd-row-item" id="${escape(mechanism.id)}" data-reveal="fade">` +
                  `<p class="cd-row-item__index">${escape(mechanism.index)}</p>` +
                  `<p class="cd-row-item__title">${escape(mechanism.name)}</p>` +
                  `<div><p class="cd-row-item__text">${escape(mechanism.text)}</p></div></div>`,
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="cd-section cd-section--sunken" id="encuestas">
        <div class="cd-shell">
          ${head({ index: "04", label: "Encuestas", title: "Consultas breves con resultados publicados." })}
          ${table({
            columns: [
              { label: "Encuesta", key: "title" },
              { label: "Período", key: "period" },
              { label: "Respuestas", key: "responses", numeric: true },
              { label: "Estado", key: "state" },
            ],
            rows: surveys.map((survey) => ({
              cells: [survey.title, survey.period, group(survey.responses), survey.state],
            })),
            caption: "Encuestas a comunidades educativas. Resultados demostrativos.",
          })}
        </div>
      </section>

      <section class="cd-section" id="audiencias">
        <div class="cd-shell">
          ${head({
            index: "05",
            label: "Audiencias públicas",
            title: "Exponer directamente ante el Consejo.",
            body:
              "Cualquier organización o persona puede solicitar una audiencia. La inscripción, el " +
              "orden del día y el registro de la sesión son públicos.",
            action: button("Solicitar una audiencia", page(ctx, "contacto", "formulario"), {
              ghost: true,
              icon: "arrow",
            }),
          })}
        </div>
      </section>`;

  return {
    meta: {
      title: "Participación ciudadana",
      canonical: "participacion.html",
      description:
        "Mecanismos demostrativos de participación ciudadana en la política educativa: consultas " +
        "públicas, foros, mesas de diálogo, encuestas y audiencias.",
    },
    current: "participacion",
    body,
  };
}

export function consultationPage(ctx, consultation) {
  const schedule = (consultation.schedule ?? [])
    .map(
      (step) =>
        `<li class="cd-timeline__item" data-state="${step.done ? "cumplido" : "previsto"}">` +
        `<p class="cd-timeline__date">${escape(longDate(step.date))}</p>` +
        `<div><p class="cd-timeline__title">${escape(step.label)}` +
        `${statePill(step.done ? "cumplido" : "previsto", step.done ? "Realizado" : "Previsto")}</p></div></li>`,
    )
    .join("");

  const documents = (consultation.documents ?? [])
    .map(
      (document) =>
        `<div class="cd-doc"><p class="cd-doc__code">${escape(document.code)}</p>` +
        `<div><p class="cd-doc__title">${escape(document.title)}</p>` +
        `<p class="cd-doc__meta"><span>PDF · ${escape(document.size)}</span>` +
        `<span>${document.pages} páginas</span></p></div>` +
        `<button class="cd-download" type="button" data-document="${escape(document.code)}">` +
        `${icon("download")}Descargar</button></div>`,
    )
    .join("");

  const questions = (consultation.questions ?? [])
    .map(
      (question, index) =>
        `<div class="cd-form__field cd-form__field--wide">` +
        `<label class="cd-form__label" for="q-${index}">${index + 1}. ${escape(question)}</label>` +
        `<textarea class="cd-input" id="q-${index}" name="q-${index}" rows="3" ` +
        `placeholder="Su respuesta (opcional)"></textarea></div>`,
    )
    .join("");

  const body = `      ${pageHero({
    ctx,
    trail: [
      { label: "Inicio", route: "home" },
      { label: "Participación", route: "participacion" },
      { label: consultation.title },
    ],
    label: `Consulta pública · ${consultation.code}`,
    title: consultation.title,
    lead: consultation.summary,
    meta: [
      { term: "Estado", detail: consultationStates[consultation.state].label },
      { term: "Apertura", detail: longDate(consultation.opens) },
      { term: "Cierre", detail: longDate(consultation.closes) },
      { term: "Dirigida a", detail: consultation.audience },
    ],
  })}

      <section class="cd-section cd-section--tight" id="expediente">
        <div class="cd-shell">
          <div class="cd-grid cd-grid--2-1">
            <div>
              ${head({ index: "01", label: "Antecedentes", title: "Por qué se consulta." })}
              <div class="cd-prose cd-prose--lead">${paragraphs(consultation.background ?? consultation.summary)}</div>

              <div style="margin-top:2rem">
                ${head({ index: "02", label: "Cronograma", title: "Las fechas del proceso." })}
                <ol class="cd-timeline">${schedule}</ol>
              </div>
            </div>

            <aside>
              <div class="cd-card" data-reveal="rise">
                <p class="cd-card__kicker">Estado${statePill(consultation.state, consultationStates[consultation.state].label)}</p>
                <div class="cd-mapinfo__stats" style="margin-top:.5rem">
                  <div class="cd-mapinfo__stat"><b>${escape(group(consultation.stats.observations))}</b><span>Observaciones</span></div>
                  <div class="cd-mapinfo__stat"><b>${escape(group(consultation.stats.organisations))}</b><span>Organizaciones</span></div>
                </div>
                <p class="cd-note" style="margin-top:.75rem">
                  Cierre: ${escape(longDate(consultation.closes))}
                </p>
                <a class="cd-btn cd-btn--solid" href="#formulario" style="margin-top:.75rem">Participar</a>
              </div>

              <div style="margin-top:1.5rem">
                <p class="cd-label"><span>Documentos del expediente</span></p>
                <div class="cd-docs">${documents}</div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section class="cd-section cd-section--surface" id="formulario">
        <div class="cd-shell cd-shell--narrow">
          ${head({
            index: "03",
            label: "Formulario de participación",
            title: "Presente su observación.",
            body:
              "Este prototipo no envía ni almacena información: el formulario valida los campos y " +
              "confirma en pantalla, para demostrar el flujo completo.",
            split: false,
          })}

          <form class="cd-form" data-form novalidate>
            <div class="cd-form__grid cd-form__grid--2">
              <div class="cd-form__field">
                <label class="cd-form__label" for="p-name">Nombre completo <span class="cd-req">*</span></label>
                <input class="cd-input" id="p-name" name="name" type="text" required autocomplete="name" />
                <p class="cd-form__error">${icon("alert")}Indique su nombre.</p>
              </div>
              <div class="cd-form__field">
                <label class="cd-form__label" for="p-email">Correo electrónico <span class="cd-req">*</span></label>
                <input class="cd-input" id="p-email" name="email" type="email" required autocomplete="email" />
                <p class="cd-form__error">${icon("alert")}Indique un correo electrónico válido.</p>
              </div>
              <div class="cd-form__field">
                <label class="cd-form__label" for="p-org">Institución u organización</label>
                <input class="cd-input" id="p-org" name="org" type="text" autocomplete="organization" />
                <p class="cd-form__hint">Opcional. Si participa a título personal, deje el campo vacío.</p>
              </div>
              <div class="cd-form__field">
                <label class="cd-form__label" for="p-dep">Departamento</label>
                <span class="cd-select"><select id="p-dep" name="departamento">
                  <option value="">Seleccione</option>
                  ${departments.map((d) => `<option value="${d.id}">${escape(d.name)}</option>`).join("")}
                </select></span>
              </div>
              ${questions}
              <div class="cd-form__field cd-form__field--wide">
                <label class="cd-form__label" for="p-obs">Observación general <span class="cd-req">*</span></label>
                <textarea class="cd-input" id="p-obs" name="observacion" rows="5" required
                  placeholder="Describa su observación al borrador en consulta"></textarea>
                <p class="cd-form__error">${icon("alert")}Escriba su observación.</p>
              </div>
              <div class="cd-form__field cd-form__field--wide">
                <label class="cd-check">
                  <input type="checkbox" name="publicidad" />
                  <span>Autorizo que mi observación se publique junto con la respuesta razonada del Consejo.</span>
                </label>
              </div>
            </div>

            <div class="cd-form__status" data-form-status role="status">
              <b>Observación registrada en la demostración.</b>
              <span data-form-receipt></span>
              <span>Este prototipo no transmite ni almacena datos: el envío se simula en su navegador.</span>
            </div>

            <div class="cd-form__foot">
              <p class="cd-note">${escape(notice.short)} · el envío no sale de su navegador.</p>
              <button class="cd-btn cd-btn--solid" type="submit">Enviar observación${icon("arrow")}</button>
            </div>
          </form>
        </div>
      </section>`;

  return {
    meta: {
      title: consultation.title,
      canonical: `participacion/${consultation.slug}.html`,
      description: `Consulta pública demostrativa: ${consultation.summary.slice(0, 180)}`,
    },
    current: "participacion",
    body,
  };
}

/* ============================================================ transparency */

export function transparencyPage(ctx) {
  const categories = transparencyCategories
    .map(
      (category) =>
        `<article class="cd-card" id="${escape(category.id)}" data-reveal="rise">` +
        `<p class="cd-card__kicker">${escape(category.index)}</p>` +
        `<p class="cd-card__title">${escape(category.name)}</p>` +
        `<p class="cd-card__text">${escape(category.text)}</p>` +
        `<ul style="list-style:none;padding:0;margin:.75rem 0 0;display:grid;gap:.35rem">` +
        category.items
          .map(
            (item) =>
              `<li style="display:flex;justify-content:space-between;gap:.75rem;font-size:var(--t-xs);` +
              `border-top:1px solid var(--border);padding-top:.35rem">` +
              `<span>${escape(item.title)}</span>` +
              `<span style="color:var(--ink-muted);white-space:nowrap">${escape(item.format)} · ${escape(
                shortDate(item.updated),
              )}</span></li>`,
          )
          .join("") +
        `</ul></article>`,
    )
    .join("");

  const budget = finance.budget[CURRENT_YEAR];

  const body = `      ${pageHero({
    ctx,
    trail: [{ label: "Inicio", route: "home" }, { label: "Transparencia" }],
    label: "Portal de transparencia",
    title: "Lo que se publica, cuándo y dónde encontrarlo.",
    lead:
      "Un portal de transparencia se juzga por si la obligación es visible: qué debe publicarse, con " +
      "qué periodicidad y cuándo se publicó por última vez.",
    meta: [
      { term: "Categorías", detail: String(transparencyCategories.length) },
      { term: "Solicitudes atendidas", detail: `${requests.answered} de ${requests.received}` },
      { term: "Tiempo medio de respuesta", detail: `${decimal(requests.averageDays, 1)} días` },
    ],
  })}

      <section class="cd-section" id="categorias">
        <div class="cd-shell">
          ${head({
            index: "01",
            label: "Categorías",
            title: "Ocho obligaciones de publicación.",
            body: "Cada categoría muestra sus documentos, su formato y su fecha de actualización.",
          })}
          <div class="cd-grid cd-grid--3" data-reveal-group>${categories}</div>
        </div>
      </section>

      <section class="cd-section cd-section--sunken" id="presupuesto">
        <div class="cd-shell">
          ${head({
            index: "02",
            label: "Presupuesto",
            title: "Cuánto se asigna y cuánto se ejecuta.",
            action: arrowLink("Ver el tablero de financiamiento", page(ctx, "datos", "financiamiento")),
          })}
          <div class="cd-figures cd-figures--4" data-reveal-group>
            <div class="cd-figure"><p class="cd-figure__label">Presupuesto asignado ${CURRENT_YEAR}</p>
              <p class="cd-figure__value">L ${escape(group(budget.assigned))} M</p>
              <div class="cd-figure__foot"><span class="cd-figure__note">Información demostrativa</span></div></div>
            <div class="cd-figure"><p class="cd-figure__label">Ejecutado</p>
              <p class="cd-figure__value">L ${escape(group(budget.executed))} M</p>
              <div class="cd-figure__foot"><span class="cd-figure__note">Al segundo trimestre</span></div></div>
            <div class="cd-figure"><p class="cd-figure__label">Ejecución</p>
              <p class="cd-figure__value">${escape(decimal((budget.executed / budget.assigned) * 100, 1))}<sup>%</sup></p>
              <div class="cd-figure__foot"><span class="cd-figure__note">Sobre lo asignado</span></div></div>
            <div class="cd-figure"><p class="cd-figure__label">Inversión por estudiante</p>
              <p class="cd-figure__value">L ${escape(group(Math.round((budget.assigned * 1_000_000) / enrolment({}))))}</p>
              <div class="cd-figure__foot"><span class="cd-figure__note">Asignado ÷ matrícula</span></div></div>
          </div>
          <p class="cd-note cd-note--boxed" style="margin-top:1rem">${escape(finance.note)}</p>
        </div>
      </section>

      <section class="cd-section" id="solicitudes">
        <div class="cd-shell">
          ${head({
            index: "03",
            label: "Solicitudes de información",
            title: "Cuántas se reciben y cuánto se tarda.",
            body:
              "Publicar la estadística de respuesta es parte de la obligación: un portal que no dice " +
              "cuánto tarda no está rindiendo cuentas de su propia atención.",
          })}
          <div class="cd-grid cd-grid--2">
            ${chartBlock({
              id: "solicitudes-tema",
              title: "Solicitudes por materia",
              desc: `Distribución de las ${requests.received} solicitudes recibidas en ${CURRENT_YEAR}.`,
              svg: barChart({
                items: requests.byTopic.map((topic) => ({ name: topic.name, value: topic.value })),
                rowHeight: 30,
                ramp: true,
                label: "Solicitudes por materia",
              }),
              period: String(CURRENT_YEAR),
              table: table({
                columns: [
                  { label: "Materia", key: "name" },
                  { label: "Solicitudes", key: "value", numeric: true },
                ],
                rows: requests.byTopic.map((topic) => ({ cells: [topic.name, group(topic.value)] })),
                caption: "Solicitudes de información por materia. Datos demostrativos.",
              }),
              chart: { kind: "staticBars", items: requests.byTopic },
            })}

            <div class="cd-card">
              <p class="cd-card__kicker">Atención de solicitudes</p>
              <div class="cd-mapinfo__stats" style="margin-top:.5rem">
                <div class="cd-mapinfo__stat"><b>${requests.received}</b><span>Recibidas</span></div>
                <div class="cd-mapinfo__stat"><b>${requests.answered}</b><span>Respondidas</span></div>
                <div class="cd-mapinfo__stat"><b>${escape(decimal(requests.averageDays, 1))}</b><span>Días promedio</span></div>
                <div class="cd-mapinfo__stat"><b>${escape(decimal(requests.withinDeadline, 1))} %</b><span>En plazo</span></div>
              </div>
              <div class="cd-actions" style="margin-top:1rem">
                ${button("Presentar una solicitud", page(ctx, "contacto", "formulario"), { ghost: true, icon: "arrow" })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="cd-section cd-section--surface" id="rendicion">
        <div class="cd-shell">
          ${head({
            index: "04",
            label: "Rendición de cuentas",
            title: "Una sesión pública al año, con preguntas respondidas.",
            body:
              "El informe anual, la sesión de presentación y las respuestas a las preguntas recibidas " +
              "se publican juntos, no por separado.",
            action: button("Datos abiertos", page(ctx, "abiertos"), { ghost: true, icon: "arrow" }),
          })}
        </div>
      </section>`;

  return {
    meta: {
      title: "Transparencia",
      canonical: "transparencia.html",
      description:
        "Portal de transparencia demostrativo: marco institucional, organización, planes, " +
        "presupuesto, informes, contrataciones, rendición de cuentas y solicitudes de información.",
    },
    current: "transparencia",
    body,
  };
}

/* ============================================================== open data */

export function openDataPage(ctx) {
  const cards = datasets
    .map(
      (dataset) =>
        `<article class="cd-card" id="${escape(dataset.slug)}" data-reveal="rise">` +
        `<p class="cd-card__kicker">${escape(dataset.theme)}</p>` +
        `<p class="cd-card__title">${escape(dataset.title)}</p>` +
        `<p class="cd-card__text">${escape(dataset.summary)}</p>` +
        `<dl class="cd-doc__meta" style="margin-top:.5rem">` +
        `<div><dt class="cd-sr">Cobertura</dt><dd>${escape(dataset.coverage)}</dd></div>` +
        `<div><dt class="cd-sr">Periodicidad</dt><dd>${escape(dataset.periodicity)}</dd></div>` +
        `<div><dt class="cd-sr">Registros</dt><dd>${escape(group(dataset.rows))} registros</dd></div>` +
        `</dl>` +
        `<details class="cd-datatable" style="margin-top:.5rem">` +
        `<summary class="cd-datatable__toggle">Metodología</summary>` +
        `<p class="cd-note" style="padding:.5rem 0">${escape(dataset.methodology)}</p></details>` +
        `<div class="cd-card__foot"><span>Actualizado ${escape(shortDate(dataset.updated))}</span>` +
        `<span>${escape(dataset.licence)}</span></div>` +
        `<div class="cd-actions" style="margin-top:.5rem">` +
        ["csv", "xlsx", "json"]
          .map(
            (format) =>
              `<button class="cd-download" type="button" data-dataset="${escape(dataset.slug)}" ` +
              `data-format="${format}">${icon("download")}${format.toUpperCase()}</button>`,
          )
          .join("") +
        `</div></article>`,
    )
    .join("");

  const body = `      ${pageHero({
    ctx,
    trail: [{ label: "Inicio", route: "home" }, { label: "Datos abiertos" }],
    label: "Datos abiertos",
    title: "Catálogo de datos educativos.",
    lead:
      "Ocho conjuntos con su cobertura, su periodicidad, su metodología y su fecha de " +
      "actualización. Las descargas de esta demostración son reales: contienen las mismas cifras " +
      "que dibujan los tableros.",
    meta: [
      { term: "Conjuntos", detail: String(datasets.length) },
      { term: "Formatos", detail: "CSV · XLSX · JSON" },
      { term: "Licencia", detail: "Datos abiertos con atribución" },
      { term: "Actualización", detail: longDate("2026-08-20") },
    ],
  })}

      <section class="cd-section cd-section--tight">
        <div class="cd-shell">
          <div class="cd-grid cd-grid--3" data-reveal-group>${cards}</div>

          <div class="cd-grid cd-grid--2" style="margin-top:2.5rem">
            <div class="cd-card cd-card--flat">
              <p class="cd-card__kicker">Cómo usar estos datos</p>
              <p class="cd-card__text">
                Cada archivo incluye su diccionario de variables. Los valores ausentes van vacíos y
                nunca como cero: un cero es un dato, la ausencia no.
              </p>
              <div class="cd-actions" style="margin-top:.75rem">
                ${button("Metodología completa", page(ctx, "metodologia"), { ghost: true, small: true })}
                ${button("Diccionario de variables", page(ctx, "metodologia", "diccionario"), { ghost: true, small: true })}
              </div>
            </div>
            <div class="cd-card cd-card--flat">
              <p class="cd-card__kicker">Integración</p>
              <p class="cd-card__text">
                En un despliegue real, este catálogo se sirve desde una API con versionado por año y
                por corte. La estructura de este prototipo ya está preparada para ello.
              </p>
              <div class="cd-actions" style="margin-top:.75rem">
                ${button("Ver el observatorio", page(ctx, "datos"), { ghost: true, small: true })}
              </div>
            </div>
          </div>

          <p class="cd-note cd-note--boxed" style="margin-top:1.5rem">${escape(notice.data)}</p>
        </div>
      </section>`;

  return {
    meta: {
      title: "Datos abiertos",
      canonical: "datos-abiertos.html",
      description:
        "Catálogo demostrativo de datos abiertos educativos: matrícula, centros, docentes, " +
        "cobertura, permanencia, infraestructura, educación técnica e indicadores territoriales.",
      schema: datasets.slice(0, 3).map((dataset) => datasetSchema(dataset)),
    },
    current: "transparencia",
    body,
  };
}

/* ================================================================ newsroom */

export function newsroomPage(ctx) {
  const [lead, ...rest] = articles;

  const item = (article) =>
    `<a class="cd-article" href="${sub(ctx, "noticias", article.slug)}" data-news ` +
    `data-category="${escape(article.category)}" data-reveal="fade">` +
    `<span class="cd-article__meta"><span class="cd-article__category">${escape(
      newsCategories.find((category) => category.id === article.category)?.name ?? article.category,
    )}</span><span>${escape(longDate(article.date))}</span></span>` +
    `<span class="cd-article__title">${escape(article.title)}</span>` +
    `<span class="cd-article__summary">${escape(article.summary)}</span></a>`;

  const upcoming = events
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((event) => {
      const parts = dateParts(event.date);
      return (
        `<article class="cd-event"${event.held ? " data-held" : ""}>` +
        `<div class="cd-event__date"><span class="cd-event__day">${parts.day}</span>` +
        `<span class="cd-event__month">${parts.month}</span></div>` +
        `<div><p class="cd-event__title">${escape(event.title)}</p>` +
        `<p class="cd-event__text">${escape(event.text)}</p></div>` +
        `<p class="cd-event__place">${escape(event.place)}</p></article>`
      );
    })
    .join("");

  const body = `      ${pageHero({
    ctx,
    trail: [{ label: "Inicio", route: "home" }, { label: "Actualidad" }],
    label: "Actualidad",
    title: "El registro público de lo que el Consejo hace.",
    lead:
      "Sesiones, metodologías, acuerdos y consultas. Sin campañas y sin protagonistas: qué ocurrió, " +
      "quién participó y dónde consultarlo.",
    meta: [
      { term: "Publicaciones", detail: String(articles.length) },
      { term: "Actualización", detail: longDate(articles[0].date) },
    ],
  })}

      <section class="cd-section cd-section--tight">
        <div class="cd-shell">
          <div class="cd-toolbar">
            <div class="cd-toolbar__row">
              <div class="cd-field">
                <label class="cd-field__label" for="a-cat">Categoría</label>
                <span class="cd-select"><select id="a-cat" data-news-filter>
                  <option value="all">Todas las categorías</option>
                  ${newsCategories.map((c) => `<option value="${c.id}">${escape(c.name)}</option>`).join("")}
                </select></span>
              </div>
            </div>
          </div>

          <div class="cd-news" data-news-list>
            <div class="cd-news__lead">${item(lead)}</div>
            ${rest.map((article) => item(article)).join("")}
          </div>
        </div>
      </section>

      <section class="cd-section cd-section--surface" id="agenda">
        <div class="cd-shell">
          ${head({
            index: "02",
            label: "Agenda institucional",
            title: "Sesiones, foros, consultas y mesas técnicas.",
            body: "El calendario del Consejo, con las actividades ya realizadas atenuadas.",
          })}
          <div class="cd-events" data-reveal-group>${upcoming}</div>
        </div>
      </section>

      <section class="cd-section">
        <div class="cd-shell">
          ${head({
            index: "03",
            label: "Centro de conocimiento",
            title: "Análisis e investigación.",
            action: arrowLink("Ir a la biblioteca", page(ctx, "biblioteca")),
          })}
          <div class="cd-grid cd-grid--2" data-reveal-group>
            ${knowledge
              .map((piece) =>
                card({
                  kicker: `${piece.kind} · ${piece.theme}`,
                  title: piece.title,
                  text: piece.summary,
                  serif: true,
                  target: page(ctx, "biblioteca", piece.slug),
                  foot: `<span>${longDate(piece.date)}</span><span>${piece.reading} min</span>`,
                }),
              )
              .join("")}
          </div>
        </div>
      </section>`;

  return {
    meta: {
      title: "Actualidad",
      canonical: "actualidad.html",
      description:
        "Actualidad institucional demostrativa: sesiones del Consejo, metodologías, acuerdos, " +
        "consultas públicas y agenda de eventos.",
    },
    current: "actualidad",
    body,
  };
}

export function articlePage(ctx, article) {
  const related = (article.related ?? [])
    .map((slug) => articles.find((item) => item.slug === slug))
    .filter(Boolean);

  const body = `      ${pageHero({
    ctx,
    trail: [
      { label: "Inicio", route: "home" },
      { label: "Actualidad", route: "actualidad" },
      { label: article.title },
    ],
    label: newsCategories.find((c) => c.id === article.category)?.name ?? "Actualidad",
    title: article.title,
    lead: article.summary,
    meta: [
      { term: "Publicado", detail: longDate(article.date) },
      { term: "Lectura", detail: `${article.reading} minutos` },
      { term: "Fuente", detail: `${institution.short} · comunicación institucional` },
    ],
  })}

      <section class="cd-section cd-section--tight">
        <div class="cd-shell cd-shell--narrow">
          <div class="cd-prose cd-prose--lead">${paragraphs(article.body)}</div>

          <p class="cd-note cd-note--boxed" style="margin-top:2rem">
            ${escape(notice.long)}
          </p>

          <div class="cd-actions" style="margin-top:1.5rem">
            ${button("Volver a actualidad", page(ctx, "actualidad"), { ghost: true })}
            ${button("Ver el observatorio", page(ctx, "datos"), { ghost: true })}
          </div>
        </div>
      </section>

      ${related.length
        ? `<section class="cd-section cd-section--surface">
        <div class="cd-shell">
          ${head({ index: "", label: "Relacionadas", title: "Sobre el mismo asunto." })}
          <div class="cd-grid cd-grid--2" data-reveal-group>
            ${related
              .map((item) =>
                card({
                  kicker: newsCategories.find((c) => c.id === item.category)?.name ?? "",
                  title: item.title,
                  text: item.summary,
                  serif: true,
                  target: sub(ctx, "noticias", item.slug),
                  foot: `<span>${longDate(item.date)}</span>`,
                }),
              )
              .join("")}
          </div>
        </div>
      </section>`
        : ""}`;

  return {
    meta: {
      title: article.title,
      canonical: `noticias/${article.slug}.html`,
      description: article.summary,
      ogType: "article",
      schema: [articleSchema(article)],
    },
    current: "actualidad",
    body,
  };
}

/* ================================================================= contact */

export function contactPage(ctx) {
  const body = `      ${pageHero({
    ctx,
    trail: [{ label: "Inicio", route: "home" }, { label: "Contacto" }],
    label: "Contacto",
    title: "Escriba al Consejo.",
    lead:
      "Consultas sobre información pública, solicitudes de audiencia y reportes técnicos del portal. " +
      "Todos los datos de contacto de esta página son demostrativos.",
    meta: [
      { term: "Dirección", detail: `${contact.address} · ${contact.addressNote}` },
      { term: "Teléfono", detail: `${contact.phone} · ${contact.phoneNote}` },
      { term: "Correo", detail: `${contact.email} · ${contact.emailNote}` },
      { term: "Horario", detail: contact.hours },
    ],
  })}

      <section class="cd-section cd-section--tight" id="formulario">
        <div class="cd-shell">
          <div class="cd-grid cd-grid--2-1">
            <form class="cd-form" data-form novalidate>
              <div>
                <p class="cd-label"><span>Formulario de contacto</span></p>
                <h2 class="cd-h2" style="margin-top:.5rem">¿En qué podemos ayudarle?</h2>
              </div>

              <div class="cd-form__grid cd-form__grid--2">
                <div class="cd-form__field">
                  <label class="cd-form__label" for="c-name">Nombre <span class="cd-req">*</span></label>
                  <input class="cd-input" id="c-name" name="name" type="text" required autocomplete="name" />
                  <p class="cd-form__error">${icon("alert")}Indique su nombre.</p>
                </div>
                <div class="cd-form__field">
                  <label class="cd-form__label" for="c-email">Correo <span class="cd-req">*</span></label>
                  <input class="cd-input" id="c-email" name="email" type="email" required autocomplete="email" />
                  <p class="cd-form__error">${icon("alert")}Indique un correo válido.</p>
                </div>
                <div class="cd-form__field">
                  <label class="cd-form__label" for="c-org">Institución</label>
                  <input class="cd-input" id="c-org" name="org" type="text" autocomplete="organization" />
                </div>
                <div class="cd-form__field">
                  <label class="cd-form__label" for="c-subject">Asunto <span class="cd-req">*</span></label>
                  <span class="cd-select"><select id="c-subject" name="subject" required>
                    <option value="">Seleccione un asunto</option>
                    <option>Solicitud de información pública</option>
                    <option>Consulta sobre estadísticas</option>
                    <option>Solicitud de audiencia</option>
                    <option>Participación en una consulta</option>
                    <option>Reportar un problema técnico del portal</option>
                  </select></span>
                  <p class="cd-form__error">${icon("alert")}Seleccione un asunto.</p>
                </div>
                <div class="cd-form__field cd-form__field--wide">
                  <label class="cd-form__label" for="c-message">Mensaje <span class="cd-req">*</span></label>
                  <textarea class="cd-input" id="c-message" name="message" rows="6" required></textarea>
                  <p class="cd-form__error">${icon("alert")}Escriba su mensaje.</p>
                </div>
              </div>

              <div class="cd-form__status" data-form-status role="status">
                <b>Mensaje registrado en la demostración.</b>
                <span data-form-receipt></span>
                <span>Este prototipo no transmite ni almacena datos.</span>
              </div>

              <div class="cd-form__foot">
                <p class="cd-note">${escape(notice.short)}</p>
                <button class="cd-btn cd-btn--solid" type="submit">Enviar mensaje${icon("arrow")}</button>
              </div>
            </form>

            <aside>
              <div class="cd-card">
                <p class="cd-card__kicker">Datos de contacto ${demoTag("Demo")}</p>
                <dl style="display:grid;gap:.75rem;margin-top:.5rem">
                  <div><dt style="font-size:var(--t-2xs);text-transform:uppercase;letter-spacing:var(--track-caps);color:var(--ink-muted)">Dirección</dt>
                    <dd style="margin:0">${escape(contact.address)}</dd></div>
                  <div><dt style="font-size:var(--t-2xs);text-transform:uppercase;letter-spacing:var(--track-caps);color:var(--ink-muted)">Teléfono</dt>
                    <dd style="margin:0">${escape(contact.phone)}</dd></div>
                  <div><dt style="font-size:var(--t-2xs);text-transform:uppercase;letter-spacing:var(--track-caps);color:var(--ink-muted)">Correo</dt>
                    <dd style="margin:0">${escape(contact.email)}</dd></div>
                  <div><dt style="font-size:var(--t-2xs);text-transform:uppercase;letter-spacing:var(--track-caps);color:var(--ink-muted)">Horario</dt>
                    <dd style="margin:0">${escape(contact.hours)}</dd></div>
                </dl>
                <p class="cd-note" style="margin-top:.75rem">
                  Ninguno de estos datos corresponde a una institución real.
                </p>
              </div>

              <div class="cd-card" style="margin-top:1.5rem">
                <p class="cd-card__kicker">Otros canales</p>
                <div style="display:grid;gap:.5rem;margin-top:.5rem">
                  ${arrowLink("Solicitudes de información", page(ctx, "transparencia", "solicitudes"))}
                  ${arrowLink("Consultas públicas abiertas", page(ctx, "participacion", "consultas"))}
                  ${arrowLink("Preguntas sobre los datos", page(ctx, "metodologia"))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>`;

  return {
    meta: {
      title: "Contacto",
      canonical: "contacto.html",
      description:
        "Contacto demostrativo del Consejo: formulario, dirección, teléfono y correo ficticios, y " +
        "canales para solicitudes de información y participación.",
    },
    current: "institucion",
    body,
  };
}

/* ================================================================== search */

export function searchPage(ctx) {
  const body = `      ${pageHero({
    ctx,
    trail: [{ label: "Inicio", route: "home" }, { label: "Buscar" }],
    label: "Buscador global",
    title: "Buscar en el portal.",
    lead:
      "Indicadores, normativa, documentos, noticias, políticas y conjuntos de datos, agrupados por " +
      "tipo de resultado.",
  })}

      <section class="cd-section cd-section--tight">
        <div class="cd-shell">
          <form class="cd-toolbar" role="search" data-search-page>
            <div class="cd-toolbar__row">
              <div class="cd-field" style="grid-column:1/-1">
                <label class="cd-field__label" for="s-q">Término de búsqueda</label>
                <input class="cd-input" id="s-q" name="q" type="search"
                  placeholder="Por ejemplo: docentes, cobertura, educación técnica" autocomplete="off" />
              </div>
            </div>
            <div class="cd-toolbar__foot">
              <span data-search-count>Escriba para buscar en todo el portal.</span>
              <span>${escape(notice.short)}</span>
            </div>
          </form>

          <div data-search-results style="margin-top:1.5rem"></div>

          <div data-search-empty>
            ${head({ index: "", label: "Mapa del sitio", title: "Todo el portal, en una página.", id: "mapa" })}
            <div class="cd-tasks">
              ${tasks
                .map(
                  (task) =>
                    `<a class="cd-task" href="${page(ctx, task.route)}">` +
                    `<span class="cd-task__want">${escape(task.want)}</span>` +
                    `<span class="cd-task__go">${escape(task.go)}${icon("arrow")}</span></a>`,
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>`;

  return {
    meta: {
      title: "Buscar",
      canonical: "buscar.html",
      description:
        "Buscador global del portal demostrativo: indicadores, normativa, documentos, noticias, " +
        "políticas y datos abiertos.",
    },
    current: null,
    body,
  };
}

/* ================================================================= the 404 */

export function notFoundPage(ctx) {
  const body = `      ${pageHero({
    ctx,
    trail: [{ label: "Inicio", route: "home" }, { label: "Página no encontrada" }],
    label: "Error 404",
    title: "Esta página no existe.",
    lead:
      "El enlace puede haber cambiado o el documento puede haberse retirado. Estas son las rutas " +
      "más consultadas del portal.",
  })}

      <section class="cd-section">
        <div class="cd-shell">
          <div class="cd-tasks">
            ${tasks
              .map(
                (task) =>
                  `<a class="cd-task" href="${page(ctx, task.route)}">` +
                  `<span class="cd-task__want">${escape(task.want)}</span>` +
                  `<span class="cd-task__go">${escape(task.go)}${icon("arrow")}</span></a>`,
              )
              .join("")}
          </div>
          <div class="cd-actions" style="margin-top:2rem">
            ${button("Volver al inicio", page(ctx, "home"), { solid: true, icon: "arrow" })}
            ${button("Buscar en el portal", page(ctx, "buscar"), { ghost: true })}
          </div>
        </div>
      </section>`;

  return {
    meta: {
      title: "Página no encontrada",
      canonical: "404.html",
      description: "La página solicitada no existe en el portal demostrativo del Consejo.",
    },
    current: null,
    body,
  };
}

/* ============================================================ back office */

/**
 * The demonstration back office.
 *
 * Deliberately not linked from the public navigation. It exists to answer the
 * question a public institution always asks after seeing a portal: "and who
 * keeps it up to date?" — by showing the administration interface as part of
 * the same product.
 */
export function backofficePage(ctx) {
  const collections = [
    { name: "Noticias", count: articles.length, updated: "2026-08-26", state: "Publicado" },
    { name: "Documentos y biblioteca", count: library.length, updated: "2026-08-20", state: "Publicado" },
    { name: "Normativa", count: normative.length, updated: "2026-08-14", state: "Publicado" },
    { name: "Resoluciones", count: resolutions.length, updated: "2026-08-20", state: "Publicado" },
    { name: "Conjuntos de datos", count: datasets.length, updated: "2026-08-20", state: "Publicado" },
    { name: "Indicadores", count: 10, updated: "2026-08-20", state: "Publicado" },
    { name: "Consultas públicas", count: consultations.length, updated: "2026-08-06", state: "1 abierta" },
    { name: "Eventos de agenda", count: events.length, updated: "2026-08-25", state: "Publicado" },
    { name: "Programas", count: programmes.length, updated: "2026-07-24", state: "Publicado" },
  ];

  const activity = [
    { time: "26 ago · 09:12", text: "<b>Comunicación</b> publicó la noticia «Instituciones educativas coordinan una nueva agenda nacional de información»." },
    { time: "20 ago · 16:40", text: "<b>Secretaría Técnica</b> publicó la serie estadística 2026 y actualizó 8 conjuntos de datos." },
    { time: "20 ago · 16:05", text: "<b>Secretaría Técnica</b> validó el cruce de matrícula contra el directorio de centros." },
    { time: "14 ago · 11:22", text: "<b>Estadística</b> cargó el manual metodológico de indicadores (v1.2)." },
    { time: "06 ago · 15:03", text: "<b>Secretaría del Consejo</b> registró tres resoluciones de la sesión 08/2026." },
    { time: "06 ago · 14:50", text: "<b>Participación</b> amplió el plazo de la consulta CP-2026-04 en veinte días." },
  ];

  const body = `    <div class="cd-admin">
      <div class="cd-admin__bar">
        <p class="cd-admin__brand">
          ${escape(institution.short)} · Gestión de contenidos
          <span class="cd-admin__tag">Backoffice demostrativo</span>
        </p>
        <div class="cd-admin__user">
          <span>Sesión de demostración · no hay datos reales</span>
          <span class="cd-admin__avatar" aria-hidden="true">ST</span>
        </div>
      </div>

      <div class="cd-admin__body">
        <nav class="cd-admin__side" aria-label="Secciones de gestión">
          <div class="cd-admin__group">
            <p class="cd-admin__group-title">Contenido</p>
            <a class="cd-admin__link" href="#panel" aria-current="true">Panel<span>—</span></a>
            ${collections
              .slice(0, 5)
              .map(
                (item) =>
                  `<a class="cd-admin__link" href="#panel">${escape(item.name)}<span>${item.count}</span></a>`,
              )
              .join("")}
          </div>
          <div class="cd-admin__group">
            <p class="cd-admin__group-title">Operación</p>
            ${collections
              .slice(5)
              .map(
                (item) =>
                  `<a class="cd-admin__link" href="#panel">${escape(item.name)}<span>${item.count}</span></a>`,
              )
              .join("")}
            <a class="cd-admin__link" href="#usuarios">Usuarios y permisos<span>12</span></a>
            <a class="cd-admin__link" href="#actividad">Actividad<span>${activity.length}</span></a>
          </div>
          <div class="cd-admin__group">
            <p class="cd-admin__group-title">Portal público</p>
            <a class="cd-admin__link" href="${page(ctx, "home")}">Ver el portal${icon("external")}</a>
          </div>
        </nav>

        <main class="cd-admin__main" id="panel">
          <div class="cd-admin__head">
            <div>
              <p class="cd-label"><span>Panel de gestión</span></p>
              <h1 class="cd-admin__title">Contenido publicado</h1>
            </div>
            <div class="cd-actions">
              <button class="cd-btn cd-btn--ghost cd-btn--small" type="button">Vista previa</button>
              <button class="cd-btn cd-btn--solid cd-btn--small" type="button">Nueva publicación</button>
            </div>
          </div>

          <p class="cd-note cd-note--boxed" style="margin-bottom:1.5rem">
            Backoffice demostrativo. Ninguna acción de esta pantalla modifica contenido: existe para
            mostrar que el portal público y las herramientas para operarlo son parte del mismo producto.
          </p>

          <div class="cd-figures cd-figures--4" style="margin-bottom:1.5rem">
            <div class="cd-figure"><p class="cd-figure__label">Elementos publicados</p>
              <p class="cd-figure__value">${collections.reduce((sum, item) => sum + item.count, 0)}</p>
              <div class="cd-figure__foot"><span class="cd-figure__note">En nueve colecciones</span></div></div>
            <div class="cd-figure"><p class="cd-figure__label">Pendientes de revisión</p>
              <p class="cd-figure__value">3</p>
              <div class="cd-figure__foot"><span class="cd-figure__note">Dos noticias, un informe</span></div></div>
            <div class="cd-figure"><p class="cd-figure__label">Series de datos activas</p>
              <p class="cd-figure__value">${datasets.length}</p>
              <div class="cd-figure__foot"><span class="cd-figure__note">Última carga: 20 ago</span></div></div>
            <div class="cd-figure"><p class="cd-figure__label">Usuarios con acceso</p>
              <p class="cd-figure__value">12</p>
              <div class="cd-figure__foot"><span class="cd-figure__note">Cuatro perfiles</span></div></div>
          </div>

          <section class="cd-admin__panel">
            <h2 class="cd-admin__panel-title">Colecciones administrables
              <span class="cd-note">Sin tocar código</span></h2>
            ${table({
              columns: [
                { label: "Colección", key: "name", sortable: true },
                { label: "Elementos", key: "count", numeric: true, sortable: true },
                { label: "Última actualización", key: "updated", sortable: true },
                { label: "Estado", key: "state" },
                { label: "Acciones", key: "actions" },
              ],
              rows: collections.map((item) => ({
                cells: [
                  item.name,
                  String(item.count),
                  shortDate(item.updated),
                  item.state,
                  `<button class="cd-download" type="button">Editar</button>`,
                ],
              })),
              caption: "Colecciones de contenido del portal. Datos demostrativos.",
            })}
          </section>

          <section class="cd-admin__panel" id="actividad">
            <h2 class="cd-admin__panel-title">Actividad reciente</h2>
            <ul class="cd-activity">
              ${activity
                .map((entry) => `<li><time>${escape(entry.time)}</time><span>${entry.text}</span></li>`)
                .join("")}
            </ul>
          </section>

          <section class="cd-admin__panel" id="usuarios">
            <h2 class="cd-admin__panel-title">Perfiles de usuario</h2>
            ${table({
              columns: [
                { label: "Perfil", key: "role" },
                { label: "Permisos", key: "permissions" },
                { label: "Usuarios", key: "users", numeric: true },
              ],
              rows: [
                { cells: ["Administración", "Gestión total del portal y de los usuarios", "2"] },
                { cells: ["Secretaría Técnica", "Series estadísticas, indicadores y datos abiertos", "4"] },
                { cells: ["Comunicación", "Noticias, agenda y publicaciones", "3"] },
                { cells: ["Consulta", "Solo lectura y descarga de informes", "3"] },
              ],
              caption: "Perfiles y permisos. Estructura demostrativa.",
            })}
          </section>
        </main>
      </div>
    </div>`;

  return {
    meta: {
      title: "Backoffice demostrativo",
      canonical: "gestion-demo.html",
      description:
        "Interfaz de gestión demostrativa del portal: colecciones administrables, actividad " +
        "reciente y perfiles de usuario. No modifica contenido.",
    },
    current: null,
    body,
    bare: true,
  };
}

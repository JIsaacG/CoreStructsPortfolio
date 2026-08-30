/**
 * The home page.
 *
 * Fourteen zones in the order the brief sets them, but the order earns itself:
 * the page opens with what the institution is for, gives the country's figures
 * before it gives its own plans, and only asks for participation once it has
 * shown what there is to participate in.
 *
 * Every figure on this page is read live from `statistics.js` at build time, so
 * there is no second copy of a number anywhere in the markup.
 */

import { MAP, byId, departments } from "../../src/data/cede/geography.js";
import { decimal, group, longDate } from "../../src/data/cede/format.js";
import { institution, mandate, network, notice } from "../../src/data/cede/institution.js";
import { boards, indicators, resolve } from "../../src/data/cede/indicators.js";
import { articles, knowledge } from "../../src/data/cede/newsroom.js";
import { axes, plan } from "../../src/data/cede/plan.js";
import { consultations, participationTotals } from "../../src/data/cede/participation.js";
import { featuredLibrary } from "../../src/data/cede/documents.js";
import { tasks } from "../../src/data/cede/policy.js";
import {
  CURRENT_YEAR,
  YEARS,
  enrolment,
  enrolmentBy,
  enrolmentByDepartment,
  levels,
  metricFor,
  rate,
  series,
  variation,
} from "../../src/data/cede/statistics.js";
import {
  choropleth,
  columnChart,
  legend,
  lineChart,
  networkDiagram,
  sparkline,
  stackedBar,
} from "../../src/scripts/cede/charts.js";
import {
  arrowLink,
  button,
  card,
  chartBlock,
  dataNote,
  demoTag,
  escape,
  figureRow,
  figureTile,
  head,
  icon,
  page,
  statePill,
  sub,
  table,
} from "./blocks.mjs";

export const homeMeta = {
  title: "Portal de información y política educativa",
  canonical: "",
  description:
    "Portal demostrativo de un consejo educativo ficticio: observatorio de indicadores, plan " +
    "nacional, normativa, datos abiertos y participación ciudadana para el sistema educativo de Honduras.",
};

/* ---------------------------------------------------------------- the hero */

/**
 * Approximate length of an SVG path, from its own commands.
 *
 * The line-drawing entrance needs a dash length per department, and Node has no
 * `getTotalLength`. Summing the segments of a polyline is exact for this
 * geometry, which contains only `M` and `L` — the simplification step already
 * removed every curve.
 */
function pathLength(d) {
  let total = 0;
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;

  for (const [, command, coords] of d.matchAll(/([MLZ])([-\d. ]*)/g)) {
    if (command === "Z") {
      total += Math.hypot(startX - x, startY - y);
      continue;
    }
    const [nx, ny] = coords.trim().split(/[ ,]+/).map(Number);
    if (command === "M") {
      startX = nx;
      startY = ny;
    } else {
      total += Math.hypot(nx - x, ny - y);
    }
    x = nx;
    y = ny;
  }
  return Math.round(total);
}

/**
 * The country, drawn as data.
 *
 * The real eighteen departments, filled quietly, overlaid with a dot lattice
 * clipped to the coastline and drawn in over a second on load. It says "this
 * institution holds the map" without a photograph of anyone.
 */
function heroMap() {
  const dots = [];
  const step = 13;
  for (let y = step; y < MAP.height; y += step) {
    for (let x = step; x < MAP.width; x += step) {
      const offset = (Math.round(y / step) % 2) * (step / 2);
      dots.push(`<circle cx="${x + offset}" cy="${y}" r="1.6"/>`);
    }
  }

  const clip = departments.map((d) => `<path d="${d.path}"/>`).join("");
  const fills = departments.map((d) => `<path class="cd-hero__fill" d="${d.path}"/>`).join("");
  const outlines = departments
    .map(
      (d, index) =>
        `<path class="cd-hero__outline" d="${d.path}" ` +
        `style="--len:${pathLength(d.path)};animation-delay:${120 + index * 18}ms"/>`,
    )
    .join("");

  /* Three anchors: the capital and the two largest urban departments. They are
     unlabelled — the hero is not a chart and must not be read as one. */
  const pins = ["fm", "cr", "at"]
    .map((id) => byId[id])
    .map(
      (d) =>
        `<circle class="cd-hero__pin-halo" cx="${d.label.x}" cy="${d.label.y}" r="9"/>` +
        `<circle class="cd-hero__pin" cx="${d.label.x}" cy="${d.label.y}" r="3.2"/>`,
    )
    .join("");

  return (
    /* Deliberately NOT reveal-gated. The hero is the first thing on the page,
       and the reveal system hides what it animates until its module has loaded —
       which behind a chain of ES modules can be a second on a slow connection.
       Nothing above the fold is allowed to wait for JavaScript to be visible. */
    `<div class="cd-hero__plate">` +
    `<svg class="cd-hero__map" viewBox="0 0 ${MAP.width} ${MAP.height}" role="img" ` +
    `aria-label="Mapa de Honduras con sus dieciocho departamentos, ilustración del portal">` +
    `<defs><clipPath id="cd-hn-clip">${clip}</clipPath></defs>` +
    fills +
    `<g clip-path="url(#cd-hn-clip)"><g class="cd-hero__dots">${dots.join("")}</g></g>` +
    outlines +
    pins +
    `</svg>` +
    `<p class="cd-hero__plate-caption"><span>18 departamentos · 298 municipios</span>` +
    `<span>Geometría oficial de referencia · datos ilustrativos</span></p>` +
    `</div>`
  );
}

function hero(ctx) {
  const figures = [
    { value: group(enrolment({})), caption: "Estudiantes matriculados" },
    { value: group(metricFor("centros", {})), caption: "Centros educativos" },
    { value: group(metricFor("docentes", {})), caption: "Personal docente" },
    { value: `${decimal(rate("cobertura_c12", {}), 1)} %`, caption: "Cobertura en educación básica" },
  ]
    .map(
      (figure) =>
        `<div class="cd-hero__figure"><p class="cd-hero__value">${escape(figure.value)}</p>` +
        `<p class="cd-hero__caption">${escape(figure.caption)}</p></div>`,
    )
    .join("");

  return `      <section class="cd-hero">
        <div class="cd-shell cd-hero__inner">
          <div>
            <p class="cd-hero__eyebrow">
              <span>${escape(institution.descriptor)}</span>
              ${demoTag(notice.short, true)}
            </p>
            <h1 class="cd-hero__title">Decisiones educativas basadas en evidencia.</h1>
            <p class="cd-hero__lead">
              Articulamos instituciones, información y políticas para fortalecer un sistema educativo
              más inclusivo, transparente y preparado para el futuro.
            </p>
            <div class="cd-hero__actions">
              ${button("Explorar indicadores", page(ctx, "datos"), { solid: true, icon: "arrow" })}
              ${button("Conocer la política educativa", page(ctx, "politica"), { className: "cd-btn--onDark" })}
            </div>

            <div class="cd-hero__figures">${figures}</div>
            <p class="cd-hero__figures-note">${demoTag("Datos demostrativos", true)}</p>
          </div>
${heroMap()}
        </div>
      </section>`;
}

/* -------------------------------------------------------------- 02 · access */

function quickAccess(ctx) {
  const items = [
    { index: "01", title: "Datos educativos", text: "Diez tableros y dieciocho territorios, con series desde 2019.", route: "datos" },
    { index: "02", title: "Política educativa", text: "El marco que orienta las decisiones del sistema.", route: "politica" },
    { index: "03", title: "Plan estratégico", text: "Plan Nacional 2026–2035 y su monitor público de avance.", route: "planificacion" },
    { index: "04", title: "Normativa", text: "Leyes, reglamentos, acuerdos y resoluciones del Consejo.", route: "normativa" },
    { index: "05", title: "Biblioteca", text: "Informes, investigaciones y publicaciones descargables.", route: "biblioteca" },
    { index: "06", title: "Participación", text: "Consultas públicas abiertas y mecanismos de incidencia.", route: "participacion" },
  ];

  return `      <section class="cd-section cd-section--surface" aria-labelledby="accesos">
        <div class="cd-shell">
          ${head({
            id: "accesos",
            index: "01",
            label: "Accesos directos",
            title: "Seis puertas de entrada al sistema educativo.",
            body:
              "Cada sección responde a una necesidad concreta. Si sabe qué busca, este índice lo " +
              "lleva en un clic; si no, el observatorio es el mejor punto de partida.",
          })}
          <div class="cd-access" data-reveal-group>
            ${items
              .map(
                (item) =>
                  `<a class="cd-access__item" href="${page(ctx, item.route)}" data-reveal="rise">` +
                  `<span class="cd-access__index">${item.index}</span>` +
                  `<span class="cd-access__title">${escape(item.title)}` +
                  `${icon("arrow", "cd-access__arrow")}</span>` +
                  `<span class="cd-access__text">${escape(item.text)}</span></a>`,
              )
              .join("")}
          </div>
        </div>
      </section>`;
}

/* -------------------------------------------------------------- 03 · figures */

/** The six headline figures, each with its own eight-year sparkline. */
function nationalFigures() {
  const tiles = [
    { metric: "matricula", label: "Matrícula nacional", format: "count" },
    { metric: "centros", label: "Centros educativos", format: "count" },
    { metric: "docentes", label: "Personal docente", format: "count" },
    { metric: "cobertura_c12", label: "Cobertura en educación básica", format: "rate", better: "up" },
    { metric: "retencion", label: "Permanencia en el sistema", format: "rate", better: "up" },
    { metric: "tecnica", label: "Matrícula en educación técnica", format: "count" },
  ].map((item) => {
    const value = metricFor(item.metric, {});
    const before = metricFor(item.metric, { year: CURRENT_YEAR - 1 });
    const change = item.format === "rate" ? Math.round((value - before) * 10) / 10 : variation(item.metric, {});

    return figureTile({
      label: item.label,
      value: item.format === "rate" ? `${decimal(value, 1)}` : group(value),
      sup: item.format === "rate" ? "%" : null,
      change,
      changeNote:
        item.format === "rate"
          ? `${change > 0 ? "+" : ""}${decimal(change, 1)} pp vs. ${CURRENT_YEAR - 1}`
          : `${change > 0 ? "+" : ""}${decimal(change, 1)} % vs. ${CURRENT_YEAR - 1}`,
      improving: change >= 0,
      spark: sparkline({ points: series(item.metric, {}).map((point) => ({ x: point.year, y: point.value })) }),
    });
  });

  return figureRow(tiles, 6);
}

function figuresSection() {
  return `      <section class="cd-section" aria-labelledby="cifras">
        <div class="cd-shell">
          ${head({
            id: "cifras",
            index: "02",
            label: "Educación en cifras",
            title: "Honduras en perspectiva.",
            body: "Una lectura integral del sistema educativo, actualizada con el cierre del año lectivo 2026.",
          })}
          ${nationalFigures()}
          <p class="cd-note" style="margin-top:1rem">${escape(notice.data)}</p>
        </div>
      </section>`;
}

/* ------------------------------------------------------- 04 · the dashboard */

/**
 * The embedded dashboard.
 *
 * A trend, a composition and a map, wired to the same level selector: change
 * the level and all three redraw against the same slice. It is the observatory
 * in miniature, which is the honest way to advertise the observatory.
 */
function dashboard(ctx) {
  const trend = series("matricula", {});
  const byLevel = levels.map((level) => ({
    id: level.id,
    name: level.name,
    value: enrolment({ level: level.id }),
  }));
  const bySex = enrolmentBy("sexo", {});
  const byArea = enrolmentBy("area", {});
  const mapValues = Object.fromEntries(enrolmentByDepartment({}).map((row) => [row.id, row.value]));
  const map = choropleth({
    departments,
    values: mapValues,
    map: MAP,
    metricName: "Matrícula 2026",
  });

  const trendTable = table({
    columns: [
      { label: "Año", key: "year" },
      { label: "Matrícula", key: "value", numeric: true },
    ],
    rows: trend.map((point) => ({ cells: [String(point.year), group(point.value)] })),
    caption: "Matrícula total del sistema educativo, 2019–2026. Datos demostrativos.",
  });

  const levelTable = table({
    columns: [
      { label: "Nivel", key: "name" },
      { label: "Matrícula", key: "value", numeric: true },
      { label: "Participación", key: "share", numeric: true },
    ],
    rows: byLevel.map((level) => ({
      cells: [
        level.name,
        group(level.value),
        `${decimal((level.value / enrolment({})) * 100, 1)} %`,
      ],
    })),
    caption: "Matrícula por nivel educativo, 2026. Datos demostrativos.",
  });

  const departmentTable = table({
    columns: [
      { label: "Departamento", key: "name" },
      { label: "Matrícula", key: "value", numeric: true },
      { label: "Centros", key: "centros", numeric: true },
      { label: "Docentes", key: "docentes", numeric: true },
    ],
    rows: enrolmentByDepartment({})
      .sort((a, b) => b.value - a.value)
      .map((row) => ({
        cells: [
          row.name,
          group(row.value),
          group(metricFor("centros", { department: row.id })),
          group(metricFor("docentes", { department: row.id })),
        ],
      })),
    caption: "Matrícula, centros y docentes por departamento, 2026. Datos demostrativos.",
  });

  return `      <section class="cd-section cd-section--sunken" aria-labelledby="panorama-home">
        <div class="cd-shell">
          ${head({
            id: "panorama-home",
            index: "03",
            label: "Mapa educativo",
            title: "El sistema, territorio por territorio.",
            body:
              "Seleccione un departamento en el mapa para ver sus cifras. Los mismos datos, con " +
              "ocho dimensiones de desagregación, están en el Observatorio Educativo.",
            action: button("Explorar Observatorio Educativo", page(ctx, "datos"), {
              solid: true,
              icon: "arrow",
            }),
          })}

          <div class="cd-board__body cd-board__body--map" data-home-dashboard>
            <div class="cd-map">
              <div class="cd-map__frame" data-map>${map.svg}</div>
              ${map.legend}
            </div>

            <div class="cd-mapinfo" data-map-info>
              <p class="cd-mapinfo__name" data-map-name>Nacional</p>
              <p class="cd-mapinfo__sub">
                <span data-map-sub>18 departamentos · 298 municipios</span>${demoTag()}
              </p>
              <div class="cd-mapinfo__stats">
                <div class="cd-mapinfo__stat"><b data-map-stat="matricula">${group(enrolment({}))}</b><span>Matrícula</span></div>
                <div class="cd-mapinfo__stat"><b data-map-stat="centros">${group(metricFor("centros", {}))}</b><span>Centros</span></div>
                <div class="cd-mapinfo__stat"><b data-map-stat="docentes">${group(metricFor("docentes", {}))}</b><span>Docentes</span></div>
                <div class="cd-mapinfo__stat"><b data-map-stat="cobertura">${decimal(rate("cobertura_c12", {}), 1)} %</b><span>Cobertura básica</span></div>
              </div>
              <p class="cd-note">
                Los valores cambian al seleccionar un departamento. Toda la información de este
                mapa es demostrativa.
              </p>
              <a class="cd-link" href="${page(ctx, "comparador")}">Comparar territorios</a>
            </div>

            <div class="cd-board__wide">
              ${chartBlock({
                id: "home-trend",
                title: "Matrícula total del sistema educativo",
                desc: "Serie 2019–2026. La contracción de 2020–2021 y su recuperación posterior.",
                svg: lineChart({
                  series: [{ name: "Matrícula", points: trend.map((point) => ({ x: point.year, y: point.value })) }],
                  label: "Matrícula total del sistema educativo, 2019 a 2026",
                }),
                period: "2019–2026",
                table: trendTable,
                chart: { type: "line", metric: "matricula" },
              })}
            </div>

            ${chartBlock({
              id: "home-levels",
              title: "Matrícula por nivel educativo",
              desc: "Distribución del año lectivo 2026.",
              svg: columnChart({
                items: byLevel,
                height: 260,
                label: "Matrícula por nivel educativo, 2026",
              }),
              period: "2026",
              table: levelTable,
              chart: { type: "column", metric: "matricula", dimension: "nivel" },
            })}

            <div>
              ${chartBlock({
                id: "home-sex",
                title: "Distribución por sexo",
                desc: "Participación de mujeres y hombres en la matrícula total.",
                svg: stackedBar({ segments: bySex, label: "Matrícula por sexo, 2026" }),
                legend: legend(bySex),
                period: "2026",
                table: table({
                  columns: [
                    { label: "Sexo", key: "name" },
                    { label: "Matrícula", key: "value", numeric: true },
                    { label: "Participación", key: "share", numeric: true },
                  ],
                  rows: bySex.map((item) => ({
                    cells: [item.name, group(item.value), `${decimal(item.share * 100, 1)} %`],
                  })),
                  caption: "Matrícula por sexo, 2026. Datos demostrativos.",
                }),
                chart: { type: "stacked", metric: "matricula", dimension: "sexo" },
                className: "cd-chart--tight",
              })}
              <div style="margin-top:1.5rem">
              ${chartBlock({
                id: "home-area",
                title: "Comparación urbana y rural",
                desc: "Matrícula atendida en centros urbanos y rurales.",
                svg: stackedBar({ segments: byArea, label: "Matrícula por área, 2026" }),
                legend: legend(byArea),
                period: "2026",
                table: table({
                  columns: [
                    { label: "Área", key: "name" },
                    { label: "Matrícula", key: "value", numeric: true },
                    { label: "Participación", key: "share", numeric: true },
                  ],
                  rows: byArea.map((item) => ({
                    cells: [item.name, group(item.value), `${decimal(item.share * 100, 1)} %`],
                  })),
                  caption: "Matrícula por área, 2026. Datos demostrativos.",
                }),
                chart: { type: "stacked", metric: "matricula", dimension: "area" },
              })}
              </div>
            </div>

            <details class="cd-datatable cd-board__wide">
              <summary class="cd-datatable__toggle">Ver la tabla completa por departamento</summary>
              <div class="cd-datatable__wrap">${departmentTable}</div>
            </details>
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------ 05 · the priorities */

function priorities(ctx) {
  return `      <section class="cd-section" aria-labelledby="prioridades">
        <div class="cd-shell">
          ${head({
            id: "prioridades",
            index: "04",
            label: "Prioridades estratégicas",
            title: "Cinco ejes para la próxima década.",
            body: plan.lead,
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
                  foot:
                    `<span>${escape(`${axis.programmes} programas`)}</span>` +
                    `<span class="cd-num">${escape(`${decimal(axis.progress, 1)} % de avance`)}</span>`,
                }),
              )
              .join("")}
          </div>
        </div>
      </section>`;
}

/* ---------------------------------------------------------- 06 · the monitor */

function monitor(ctx) {
  const totals = [
    { value: plan.totals.objectives, label: "Objetivos estratégicos" },
    { value: plan.totals.indicators, label: "Indicadores" },
    { value: plan.totals.programmes, label: "Programas" },
    { value: `${plan.totals.milestonesReached} / ${plan.totals.milestones}`, label: "Hitos alcanzados" },
  ]
    .map(
      (total) =>
        `<div class="cd-monitor__total"><b>${escape(String(total.value))}</b>` +
        `<span>${escape(total.label)}</span></div>`,
    )
    .join("");

  const axisRows = axes
    .map(
      (axis) =>
        `<div class="cd-axisrow" data-reveal="fade">` +
        `<div class="cd-axisrow__top">` +
        `<a class="cd-axisrow__name" href="${page(ctx, "planificacion", `eje-${axis.id}`)}">` +
        `<span class="cd-axisrow__index">${escape(axis.index)}</span>${escape(axis.name)}</a>` +
        `<span class="cd-axisrow__value">${escape(decimal(axis.progress, 1))} %</span></div>` +
        `<span class="cd-meter" role="img" aria-label="${escape(`${axis.name}: ${decimal(axis.progress, 1)} % de avance`)}">` +
        `<span class="cd-meter__fill" style="width:${axis.progress}%"></span></span>` +
        `<p class="cd-axisrow__text">${escape(axis.lead)}</p></div>`,
    )
    .join("");

  return `      <section class="cd-section cd-section--surface" aria-labelledby="monitor-home">
        <div class="cd-shell">
          ${head({
            id: "monitor-home",
            index: "05",
            label: "Monitor del Plan Nacional",
            title: "El avance del plan, en público y en tiempo real.",
            body:
              "Cada objetivo tiene una meta, un indicador y una fecha. El tablero se actualiza con " +
              "cada informe semestral y muestra también lo que no avanza.",
            action: button("Abrir el monitor", page(ctx, "planificacion", "monitor"), { ghost: true, icon: "arrow" }),
          })}

          <div class="cd-monitor">
            <div>
              <div class="cd-monitor__totals">${totals}</div>
              <div class="cd-monitor__overall">
                <p class="cd-monitor__overall-value">${escape(decimal(plan.progress, 1))} %</p>
                <p class="cd-monitor__overall-label">
                  Avance global del ${escape(plan.code)} · ${escape(notice.dataShort)}
                </p>
              </div>
            </div>
            <div data-reveal-group>${axisRows}</div>
          </div>
        </div>
      </section>`;
}

/* ---------------------------------------------------------- 07 · the network */

function systemNetwork() {
  const entries = network.nodes
    .map(
      (node) =>
        `<div class="cd-network__entry" data-network-entry="${node.id}">` +
        `<p class="cd-network__name">${escape(node.label)}</p>` +
        `<p class="cd-network__text">${escape(node.contributes)}</p></div>`,
    )
    .join("");

  return `      <section class="cd-section" aria-labelledby="red">
        <div class="cd-shell">
          ${head({
            id: "red",
            index: "06",
            label: "Sistema educativo articulado",
            title: network.title,
            body: network.lead,
          })}
          <div class="cd-network" data-network>
            <div>${networkDiagram(network)}</div>
            <div class="cd-network__legend">${entries}</div>
          </div>
        </div>
      </section>`;
}

/* -------------------------------------------------------- 08 · the documents */

function documents(ctx) {
  return `      <section class="cd-section cd-section--sunken" aria-labelledby="documentos">
        <div class="cd-shell">
          ${head({
            id: "documentos",
            index: "07",
            label: "Documentos destacados",
            title: "Lo que el Consejo publica.",
            body: "Informes, investigaciones y documentos de política, con su metodología y su fecha.",
            action: arrowLink("Ir a la biblioteca digital", page(ctx, "biblioteca")),
          })}
          <div class="cd-grid cd-grid--3" data-reveal-group>
            ${featuredLibrary
              .map((item) =>
                card({
                  kicker: item.kind === "informe" ? "Informe" : "Investigación",
                  title: item.title,
                  text: item.summary,
                  serif: true,
                  target: page(ctx, "biblioteca", item.slug),
                  foot:
                    `<span>${escape(longDate(item.date))}</span>` +
                    `<span>${escape(`PDF · ${item.size}`)}</span>`,
                }),
              )
              .join("")}
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------- 09 · the indicators */

function recentIndicators(ctx) {
  const picks = ["cobertura-neta-media", "tasa-desercion", "centros-con-conectividad", "matricula-educacion-tecnica"];

  const tiles = picks
    .map((slug) => indicators.find((indicator) => indicator.slug === slug))
    .map((indicator) => {
      const resolved = resolve(indicator);
      const value =
        indicator.format === "rate" ? `${decimal(resolved.value, 1)} %` : group(resolved.value);
      return (
        `<a class="cd-tile" href="${sub(ctx, "datos/indicadores", indicator.slug)}" data-reveal="rise">` +
        `<span class="cd-tile__label">${escape(indicator.name)}</span>` +
        `<span class="cd-tile__value">${escape(value)}</span>` +
        `<span class="cd-tile__foot"><span>${escape(`${CURRENT_YEAR} · ${boards.find((b) => b.id === indicator.board).name}`)}</span>` +
        `${icon("arrow")}</span>` +
        `<span class="cd-tile__source">${escape(notice.dataShort)}</span></a>`
      );
    })
    .join("");

  return `      <section class="cd-section" aria-labelledby="indicadores">
        <div class="cd-shell">
          ${head({
            id: "indicadores",
            index: "08",
            label: "Indicadores recientes",
            title: "Cuatro cifras que resumen el año.",
            body:
              "Cada indicador abre su ficha completa: definición, fórmula, serie histórica, " +
              "desagregaciones, metodología y descargas.",
            action: arrowLink("Ver todos los indicadores", page(ctx, "datos")),
          })}
          <div class="cd-tiles" data-reveal-group>${tiles}</div>
        </div>
      </section>`;
}

/* ---------------------------------------------------------- 10 · the news */

function news(ctx) {
  const [lead, ...rest] = articles.slice(0, 5);

  const article = (item, isLead = false) =>
    `<a class="cd-article" href="${sub(ctx, "noticias", item.slug)}" data-reveal="fade">` +
    `<span class="cd-article__meta"><span class="cd-article__category">` +
    `${escape(item.category)}</span><span>${escape(longDate(item.date))}</span></span>` +
    `<span class="cd-article__title">${escape(item.title)}</span>` +
    (isLead ? `<span class="cd-article__summary">${escape(item.summary)}</span>` : "") +
    `</a>`;

  return `      <section class="cd-section cd-section--surface" aria-labelledby="actualidad-home">
        <div class="cd-shell">
          ${head({
            id: "actualidad-home",
            index: "09",
            label: "Actualidad",
            title: "Sesiones, metodologías y acuerdos.",
            body:
              "El registro de lo que el Consejo decide y publica. Sin campañas, sin logros: lo que " +
              "ocurrió, quién participó y dónde consultarlo.",
            action: arrowLink("Ver toda la actualidad", page(ctx, "actualidad")),
          })}
          <div class="cd-news" data-reveal-group>
            <div class="cd-news__lead">${article(lead, true)}</div>
            ${rest.map((item) => article(item)).join("")}
          </div>
        </div>
      </section>`;
}

/* -------------------------------------------------- 11 · participation */

function participation(ctx) {
  const open = consultations.find((item) => item.state === "abierta");

  return `      <section class="cd-section cd-section--sunken" aria-labelledby="participacion-home">
        <div class="cd-shell">
          ${head({
            id: "participacion-home",
            index: "10",
            label: "Participación ciudadana",
            title: "Antes de decidir, se consulta.",
            body:
              "Toda política de alcance nacional se somete a consulta pública, y al cerrarse se " +
              "publica la respuesta razonada a cada observación recibida.",
            action: button("Ver los mecanismos", page(ctx, "participacion"), { ghost: true, icon: "arrow" }),
          })}

          <div class="cd-grid cd-grid--2-1">
            <article class="cd-card" data-reveal="rise">
              <p class="cd-card__kicker">Consulta abierta · ${escape(open.code)}${statePill("abierta", "Abierta")}</p>
              <h3 class="cd-card__title cd-card__title--serif">${escape(open.title)}</h3>
              <p class="cd-card__text">${escape(open.summary)}</p>
              <div class="cd-card__foot">
                <span>Cierre: ${escape(longDate(open.closes))}</span>
                <span>${escape(`${group(open.stats.observations)} observaciones recibidas`)}</span>
              </div>
              <div class="cd-actions" style="margin-top:1rem">
                ${button("Participar", sub(ctx, "participacion", open.slug), { solid: true, icon: "arrow" })}
                ${button("Ver el expediente", sub(ctx, "participacion", open.slug) + "#expediente", { ghost: true })}
              </div>
            </article>

            <div class="cd-card" data-reveal="rise">
              <p class="cd-card__kicker">Participación acumulada</p>
              <div class="cd-mapinfo__stats" style="margin-top:.5rem">
                <div class="cd-mapinfo__stat"><b>${escape(group(participationTotals.observations))}</b><span>Observaciones</span></div>
                <div class="cd-mapinfo__stat"><b>${escape(group(participationTotals.organisations))}</b><span>Organizaciones</span></div>
                <div class="cd-mapinfo__stat"><b>${escape(group(participationTotals.sessions))}</b><span>Sesiones y mesas</span></div>
                <div class="cd-mapinfo__stat"><b>${escape(String(participationTotals.open))}</b><span>Consultas abiertas</span></div>
              </div>
              <p class="cd-note" style="margin-top:.75rem">${escape(notice.dataShort)} · el prototipo no envía información.</p>
            </div>
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------- 12 · the knowledge */

function knowledgeCentre(ctx) {
  return `      <section class="cd-section" aria-labelledby="conocimiento">
        <div class="cd-shell">
          ${head({
            id: "conocimiento",
            index: "11",
            label: "Centro de conocimiento",
            title: "Investigación para decidir mejor.",
            body:
              "Estudios y análisis producidos por el Consejo sobre los desafíos de mediano plazo " +
              "del sistema educativo.",
            action: arrowLink("Ver todas las publicaciones", page(ctx, "biblioteca")),
          })}
          <div class="cd-grid cd-grid--2" data-reveal-group>
            ${knowledge
              .slice(0, 4)
              .map((item) =>
                card({
                  kicker: `${item.kind} · ${item.theme}`,
                  title: item.title,
                  text: item.summary,
                  serif: true,
                  target: page(ctx, "biblioteca", item.slug),
                  foot:
                    `<span>${escape(longDate(item.date))}</span>` +
                    `<span>${escape(`${item.reading} min de lectura`)}</span>`,
                }),
              )
              .join("")}
          </div>
        </div>
      </section>`;
}

/* --------------------------------------------------------------- 13 · tasks */

function taskIndex(ctx) {
  return `      <section class="cd-section cd-section--surface" aria-labelledby="tareas">
        <div class="cd-shell">
          ${head({
            id: "tareas",
            index: "12",
            label: "Qué necesita hacer",
            title: "El portal, ordenado por lo que usted busca.",
          })}
          <div class="cd-tasks" data-reveal-group>
            ${tasks
              .map(
                (task) =>
                  `<a class="cd-task" href="${page(ctx, task.route)}" data-reveal="fade">` +
                  `<span class="cd-task__want">${escape(task.want)}</span>` +
                  `<span class="cd-task__go">${escape(task.go)}${icon("arrow")}</span></a>`,
              )
              .join("")}
          </div>
        </div>
      </section>`;
}

/* ----------------------------------------------------------------- 14 · CTA */

function cta(ctx) {
  return `      <section class="cd-cta">
        <div class="cd-shell cd-cta__inner">
          <div>
            <p class="cd-label" style="color:rgb(255 255 255 / .6)"><span>Observatorio Educativo</span></p>
            <h2 class="cd-cta__title">Todo el sistema educativo, en un solo lugar.</h2>
          </div>
          <div>
            <p class="cd-cta__text">
              Diez tableros, dieciocho departamentos, ocho dimensiones de desagregación y series
              históricas desde 2019, con descarga abierta de cada tabla.
            </p>
            <div class="cd-actions" style="margin-top:1.5rem">
              ${button("Explorar el Observatorio Educativo", page(ctx, "datos"), { solid: true, icon: "arrow" })}
              ${button("Catálogo de datos abiertos", page(ctx, "abiertos"), { className: "cd-btn--onDark" })}
            </div>
          </div>
        </div>
      </section>`;
}

/* ------------------------------------------------------------------- page */

export const homeBody = (ctx) =>
  [
    hero(ctx),
    quickAccess(ctx),
    figuresSection(),
    dashboard(ctx),
    priorities(ctx),
    monitor(ctx),
    systemNetwork(),
    documents(ctx),
    recentIndicators(ctx),
    news(ctx),
    participation(ctx),
    knowledgeCentre(ctx),
    taskIndex(ctx),
    cta(ctx),
  ].join("\n\n");

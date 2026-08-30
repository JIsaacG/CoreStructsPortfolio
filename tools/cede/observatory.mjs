/**
 * The Observatory: `/datos`, its ten boards, the indicator files, the
 * territorial comparator and the methodology.
 *
 * The rule that shapes this page: one filter row scopes everything below it. A
 * board never carries its own year selector, so two charts on the same screen
 * can never be describing different years — which is the most common way a
 * statistics portal loses a reader's trust.
 *
 * Every chart is emitted here with a descriptor (`data-chart`) that says how to
 * rebuild it. The browser reads that descriptor, calls the same renderer this
 * file called, and redraws against the new slice — so what the reader sees
 * after touching a filter is produced by exactly the code that produced the
 * first paint.
 */

import { MAP, byId, departments, regions } from "../../src/data/cede/geography.js";
import { decimal, group, longDate } from "../../src/data/cede/format.js";
import { institution, notice } from "../../src/data/cede/institution.js";
import {
  boards,
  indicators,
  indicatorsOfBoard,
  infrastructure,
  resolve,
  sdg4,
  teaching,
  technical,
} from "../../src/data/cede/indicators.js";
import { datasets, dictionary, methodology } from "../../src/data/cede/transparency.js";
import {
  CURRENT_YEAR,
  YEARS,
  administrations,
  areas,
  enrolment,
  enrolmentBy,
  enrolmentByDepartment,
  finance,
  financeByDepartment,
  inclusion,
  levels,
  metricFor,
  modalities,
  rate,
  series,
  sexes,
  shifts,
  technicalEnrolment,
  territoryRow,
  variation,
} from "../../src/data/cede/statistics.js";
import {
  barChart,
  choropleth,
  columnChart,
  dotPlot,
  legend,
  lineChart,
  smallMultiples,
  stackedBar,
  stackedColumns,
} from "../../src/scripts/cede/charts.js";
import {
  arrowLink,
  button,
  chartBlock,
  crumbs,
  dataNote,
  demoTag,
  escape,
  head,
  icon,
  page,
  pageHero,
  statePill,
  sub,
  table,
} from "./blocks.mjs";

/* ------------------------------------------------------------- the filters */

/**
 * The eight dimensions the observatory filters by.
 *
 * Municipality is present and disabled, with the reason written on it. A
 * control that pretends to work is worse than one that explains what it is
 * waiting for — and in a prototype, honesty about the seam is the point.
 */
function filterBar() {
  const select = (id, label, options, { disabled = false, hint = "" } = {}) =>
    `<div class="cd-field">` +
    `<label class="cd-field__label" for="f-${id}">${escape(label)}</label>` +
    `<span class="cd-select"><select id="f-${id}" data-filter="${id}"${disabled ? " disabled" : ""}>` +
    options.map((option) => `<option value="${escape(option.id)}">${escape(option.name)}</option>`).join("") +
    `</select></span>` +
    (hint ? `<span class="cd-field__hint cd-note">${escape(hint)}</span>` : "") +
    `</div>`;

  return `        <div class="cd-filters" data-filters>
          <div class="cd-shell cd-filters__inner">
            <div class="cd-filters__top">
              <p class="cd-filters__title">${icon("filter")}Filtros del observatorio</p>
              <div class="cd-actions">
                <button class="cd-btn cd-btn--small cd-btn--ghost" type="button" data-filters-reset>
                  Restablecer
                </button>
              </div>
            </div>

            <div class="cd-filters__grid">
              ${select("anio", "Año", [...YEARS].reverse().map((year) => ({ id: String(year), name: String(year) })))}
              ${select("departamento", "Departamento", [
                { id: "all", name: "Todos los departamentos" },
                ...departments.map((d) => ({ id: d.id, name: d.name })),
              ])}
              ${select("municipio", "Municipio", [{ id: "all", name: "Todos los municipios" }], {
                disabled: true,
                hint: "Se habilita al conectar el registro municipal de centros.",
              })}
              ${select("nivel", "Nivel educativo", [
                { id: "all", name: "Todos los niveles" },
                ...levels.map((level) => ({ id: level.id, name: level.name })),
              ])}
              ${select("administracion", "Administración", [
                { id: "all", name: "Todas" },
                ...administrations.map((item) => ({ id: item.id, name: item.name })),
              ])}
              ${select("sexo", "Sexo", [{ id: "all", name: "Ambos" }, ...sexes.map((s) => ({ id: s.id, name: s.name }))])}
              ${select("area", "Área", [{ id: "all", name: "Urbana y rural" }, ...areas.map((a) => ({ id: a.id, name: a.name }))])}
              ${select("modalidad", "Modalidad", [
                { id: "all", name: "Todas" },
                ...modalities.map((m) => ({ id: m.id, name: m.name })),
              ])}
            </div>

            <p class="cd-filters__state">
              <span class="cd-slice" data-slice><span class="cd-slice__dot"></span>Nacional · 2026</span>
              <span data-slice-detail>Todos los niveles · urbana y rural · ambos sexos</span>
              ${demoTag()}
            </p>
          </div>
        </div>`;
}

/** The rail of ten boards. */
const boardRail = () =>
  `        <nav class="cd-boards" aria-label="Tableros del observatorio">
          <div class="cd-shell">
            <ul class="cd-boards__list">
${boards
  .map(
    (board) =>
      `              <li><a class="cd-boards__link" href="#${board.id}" data-board-link="${board.id}"` +
      `${board.id === "panorama" ? ' aria-current="true"' : ""}>` +
      `<b>${escape(board.index)}</b>${escape(board.name)}</a></li>`,
  )
  .join("\n")}
            </ul>
          </div>
        </nav>`;

/** The head of one board. */
const boardHead = (board, action = "") =>
  `<header class="cd-board__head">` +
  `<div><h2 class="cd-board__title"><span class="cd-board__index">${escape(board.index)}</span>` +
  `${escape(board.name)}</h2>` +
  `<p class="cd-board__lead">${escape(board.lead)}</p></div>` +
  (action ? `<div class="cd-actions">${action}</div>` : "") +
  `</header>`;

/* -------------------------------------------------------------- board data */

/** A KPI tile inside a board, with its own period and source line. */
function tile({ label, value, sup, change, changeNote, improving, target, note }) {
  const tone = improving === null ? "flat" : improving ? "up" : "down";
  const inner =
    `<span class="cd-tile__label">${escape(label)}</span>` +
    `<span class="cd-tile__value">${escape(value)}${sup ? `<sup>${escape(sup)}</sup>` : ""}</span>` +
    `<span class="cd-tile__foot">` +
    (change === null || change === undefined
      ? `<span>${escape(changeNote ?? "—")}</span>`
      : `<span class="cd-change cd-change--${tone}">${icon(change >= 0 ? "arrowUp" : "arrowDown", "cd-change__arrow")}` +
        `${escape(changeNote)}</span>`) +
    (target ? icon("arrow") : "") +
    `</span>` +
    `<span class="cd-tile__source">${escape(note ?? `${CURRENT_YEAR} · Datos demostrativos`)}</span>`;

  return target
    ? `<a class="cd-tile" href="${escape(target)}" data-reveal="rise">${inner}</a>`
    : `<div class="cd-tile" data-reveal="rise">${inner}</div>`;
}

const rateTile = (metric, label, { better = "up", slug = null, ctx = null } = {}) => {
  const value = rate(metric, {});
  const change = Math.round((value - rate(metric, { year: CURRENT_YEAR - 1 })) * 10) / 10;
  return tile({
    label,
    value: decimal(value, 1),
    sup: "%",
    change,
    changeNote: `${change > 0 ? "+" : ""}${decimal(change, 1)} pp`,
    improving: better === "up" ? change >= 0 : change <= 0,
    target: slug && ctx ? sub(ctx, "datos/indicadores", slug) : null,
  });
};

const countTile = (metric, label, { slug = null, ctx = null } = {}) => {
  const value = metricFor(metric, {});
  const change = variation(metric, {});
  return tile({
    label,
    value: group(value),
    change,
    changeNote: `${change > 0 ? "+" : ""}${decimal(change, 1)} %`,
    improving: change >= 0,
    target: slug && ctx ? sub(ctx, "datos/indicadores", slug) : null,
  });
};

/* ---------------------------------------------------- reusable chart pieces */

/** The territorial map for any metric. */
function mapBlock({ metric, metricName, kind = "count", id }) {
  const values = Object.fromEntries(
    departments.map((d) => [
      d.id,
      kind === "rate" ? rate(metric, { department: d.id }) : metricFor(metric, { department: d.id }),
    ]),
  );
  const map = choropleth({ departments, values, map: MAP, metricName, kind });

  const rows = departments
    .map((d) => ({
      cells: [
        d.name,
        kind === "rate" ? `${decimal(values[d.id], 1)} %` : group(values[d.id]),
        d.capital,
        String(d.municipalities),
      ],
    }))
    .sort((a, b) => a.cells[0].localeCompare(b.cells[0], "es"));

  return (
    `<div class="cd-map" id="${escape(id)}">` +
    `<div class="cd-map__frame" data-map data-map-metric="${escape(metric)}" ` +
    `data-map-kind="${escape(kind)}">${map.svg}</div>` +
    map.legend +
    `<details class="cd-datatable"><summary class="cd-datatable__toggle">Ver la tabla del mapa</summary>` +
    `<div class="cd-datatable__wrap">` +
    table({
      columns: [
        { label: "Departamento", key: "name" },
        { label: metricName, key: "value", numeric: true },
        { label: "Cabecera", key: "capital" },
        { label: "Municipios", key: "mun", numeric: true },
      ],
      rows,
      caption: `${metricName} por departamento, ${CURRENT_YEAR}. Datos demostrativos.`,
    }) +
    `</div></details></div>`
  );
}

/** The panel that reports whichever department is selected on a map. */
const mapInfo = (ctx) =>
  `<div class="cd-mapinfo" data-map-info>
    <p class="cd-mapinfo__name" data-map-name>Nacional</p>
    <p class="cd-mapinfo__sub"><span data-map-sub>18 departamentos · 298 municipios</span>${demoTag()}</p>
    <div class="cd-mapinfo__stats">
      <div class="cd-mapinfo__stat"><b data-map-stat="matricula">${group(enrolment({}))}</b><span>Matrícula</span></div>
      <div class="cd-mapinfo__stat"><b data-map-stat="centros">${group(metricFor("centros", {}))}</b><span>Centros</span></div>
      <div class="cd-mapinfo__stat"><b data-map-stat="docentes">${group(metricFor("docentes", {}))}</b><span>Docentes</span></div>
      <div class="cd-mapinfo__stat"><b data-map-stat="cobertura">${decimal(rate("cobertura_c12", {}), 1)} %</b><span>Cobertura básica</span></div>
    </div>
    <p class="cd-note">Seleccione un departamento en el mapa para filtrar todo el observatorio.</p>
    <a class="cd-link" href="${page(ctx, "comparador")}">Comparar territorios</a>
  </div>`;

/** A table of the eighteen departments with every headline figure. */
function territoryTable() {
  const rows = departments.map((d) => {
    const row = territoryRow(d.id);
    return {
      id: d.id,
      cells: [
        row.name,
        group(row.matricula),
        group(row.centros),
        group(row.docentes),
        decimal(row.ratio, 1),
        `${decimal(row.cobertura, 1)} %`,
        `${decimal(row.permanencia, 1)} %`,
        `${decimal(row.conectividad, 1)} %`,
      ],
      values: [row.name, row.matricula, row.centros, row.docentes, row.ratio, row.cobertura, row.permanencia, row.conectividad],
    };
  });

  return table({
    columns: [
      { label: "Departamento", key: "name", sortable: true },
      { label: "Matrícula", key: "matricula", numeric: true, sortable: true },
      { label: "Centros", key: "centros", numeric: true, sortable: true },
      { label: "Docentes", key: "docentes", numeric: true, sortable: true },
      { label: "Est./doc.", key: "ratio", numeric: true, sortable: true },
      { label: "Cobertura básica", key: "cobertura", numeric: true, sortable: true },
      { label: "Permanencia", key: "permanencia", numeric: true, sortable: true },
      { label: "Conectividad", key: "conectividad", numeric: true, sortable: true },
    ],
    rows,
    caption:
      `Indicadores por departamento, ${CURRENT_YEAR}. Ordene por cualquier columna. ` +
      `Todas las cifras son demostrativas.`,
    className: "cd-tablewrap",
  });
}

/* --------------------------------------------------------------- the boards */

function boardPanorama(ctx) {
  const board = boards[0];
  const tiles = [
    countTile("matricula", "Matrícula total", { slug: "matricula-total", ctx }),
    countTile("centros", "Centros educativos"),
    countTile("docentes", "Personal docente"),
    rateTile("cobertura_c12", "Cobertura en básica", { slug: "cobertura-neta-media", ctx }),
    rateTile("retencion", "Permanencia", { slug: "tasa-retencion", ctx }),
    rateTile("transicion", "Transición a media", { slug: "tasa-transicion-media", ctx }),
    countTile("tecnica", "Matrícula técnica", { slug: "matricula-educacion-tecnica", ctx }),
    rateTile("conectividad", "Conectividad de centros", { slug: "centros-con-conectividad", ctx }),
  ].join("");

  const trend = series("matricula", {});

  return `        <section class="cd-board" id="${board.id}" data-board="${board.id}">
          <div class="cd-shell">
            ${boardHead(board, arrowLink("Descargar el panorama completo", page(ctx, "abiertos")))}
            <div class="cd-tiles" data-reveal-group>${tiles}</div>

            <div class="cd-board__body cd-board__body--map" style="margin-top:1.5rem">
              ${mapBlock({ metric: "matricula", metricName: "Matrícula", id: "mapa-panorama" })}
              ${mapInfo(ctx)}
              <div class="cd-board__wide">
                ${chartBlock({
                  id: "panorama-trend",
                  title: "Matrícula total del sistema educativo",
                  desc: "Serie histórica. Responde a los filtros de nivel y territorio.",
                  svg: lineChart({
                    series: [{ name: "Matrícula", points: trend.map((p) => ({ x: p.year, y: p.value })) }],
                    label: "Matrícula total, 2019 a 2026",
                  }),
                  period: `${YEARS[0]}–${CURRENT_YEAR}`,
                  table: seriesTable(trend, "Matrícula"),
                  chart: { kind: "trend", metric: "matricula" },
                })}
              </div>
            </div>
          </div>
        </section>`;
}

/** The table twin of a single time series. */
const seriesTable = (points, label, kind = "count") =>
  table({
    columns: [
      { label: "Año", key: "year" },
      { label, key: "value", numeric: true },
    ],
    rows: points.map((point) => ({
      cells: [String(point.year), kind === "rate" ? `${decimal(point.value, 1)} %` : group(point.value)],
    })),
    caption: `${label}, ${YEARS[0]}–${CURRENT_YEAR}. Datos demostrativos.`,
  });

/** The table twin of a one-dimension breakdown. */
const splitTable = (items, dimension) =>
  table({
    columns: [
      { label: dimension, key: "name" },
      { label: "Matrícula", key: "value", numeric: true },
      { label: "Participación", key: "share", numeric: true },
    ],
    rows: items.map((item) => ({
      cells: [item.name, group(item.value), `${decimal(item.share * 100, 1)} %`],
    })),
    caption: `Matrícula por ${dimension.toLowerCase()}, ${CURRENT_YEAR}. Datos demostrativos.`,
  });

function boardEnrolment(ctx) {
  const board = boards[1];
  const levelSeries = levels.map((level) => ({
    name: level.name,
    values: YEARS.map((year) => enrolment({ year, level: level.id })),
  }));

  const byDepartment = enrolmentByDepartment({}).sort((a, b) => b.value - a.value);
  const splits = [
    { dimension: "sexo", title: "Matrícula por sexo", label: "Sexo" },
    { dimension: "area", title: "Matrícula por área", label: "Área" },
    { dimension: "administracion", title: "Matrícula por administración", label: "Administración" },
    { dimension: "jornada", title: "Matrícula por jornada", label: "Jornada" },
    { dimension: "modalidad", title: "Matrícula por modalidad", label: "Modalidad" },
  ];

  return `        <section class="cd-board" id="${board.id}" data-board="${board.id}">
          <div class="cd-shell">
            ${boardHead(board)}
            <div class="cd-board__body cd-board__body--split">
              <div class="cd-board__wide">
                ${chartBlock({
                  id: "matricula-niveles",
                  title: "Matrícula por nivel educativo, 2019–2026",
                  desc: "Composición del sistema año por año. La educación media es la que más tardó en recuperarse.",
                  svg: stackedColumns({ years: YEARS, series: levelSeries, label: "Matrícula por nivel, 2019 a 2026" }),
                  legend: legend(levels.map((level) => ({ name: level.name }))),
                  period: `${YEARS[0]}–${CURRENT_YEAR}`,
                  table: table({
                    columns: [
                      { label: "Año", key: "year" },
                      ...levels.map((level) => ({ label: level.name, key: level.id, numeric: true })),
                      { label: "Total", key: "total", numeric: true },
                    ],
                    rows: YEARS.map((year) => ({
                      cells: [
                        String(year),
                        ...levels.map((level) => group(enrolment({ year, level: level.id }))),
                        group(enrolment({ year })),
                      ],
                    })),
                    caption: "Matrícula por nivel educativo y año. Datos demostrativos.",
                  }),
                  chart: { kind: "levelsHistory" },
                })}
              </div>

              <div class="cd-board__wide">
                ${chartBlock({
                  id: "matricula-departamentos",
                  title: "Matrícula por departamento",
                  desc: "Ordenada de mayor a menor. La intensidad del color sigue el valor.",
                  svg: barChart({
                    items: byDepartment,
                    label: "Matrícula por departamento, 2026",
                    ramp: true,
                    rowHeight: 24,
                  }),
                  period: String(CURRENT_YEAR),
                  table: table({
                    columns: [
                      { label: "Departamento", key: "name", sortable: true },
                      { label: "Matrícula", key: "value", numeric: true, sortable: true },
                      { label: "Participación", key: "share", numeric: true },
                    ],
                    rows: byDepartment.map((row) => ({
                      cells: [
                        row.name,
                        group(row.value),
                        `${decimal((row.value / enrolment({})) * 100, 1)} %`,
                      ],
                    })),
                    caption: "Matrícula por departamento, 2026. Datos demostrativos.",
                  }),
                  chart: { kind: "departments", metric: "matricula" },
                })}
              </div>

              ${splits
                .map((split) => {
                  const items = enrolmentBy(split.dimension, {});
                  return chartBlock({
                    id: `matricula-${split.dimension}`,
                    title: split.title,
                    desc: `Composición de la matrícula ${CURRENT_YEAR} por ${split.label.toLowerCase()}.`,
                    svg: stackedBar({ segments: items, label: split.title }),
                    legend: legend(items),
                    period: String(CURRENT_YEAR),
                    table: splitTable(items, split.label),
                    chart: { kind: "split", dimension: split.dimension },
                  });
                })
                .join("")}

              <div class="cd-board__wide">
                <p class="cd-label" style="margin-bottom:.75rem"><span>Tabla completa</span></p>
                ${territoryTable()}
                <p class="cd-note" style="margin-top:.75rem">
                  ${escape(notice.data)}
                </p>
              </div>
            </div>
          </div>
        </section>`;
}

function boardCoverage(ctx) {
  const board = boards[2];
  const panels = [
    { name: "Prebásica", metric: "cobertura_pre" },
    { name: "Básica · I y II ciclo", metric: "cobertura_c12" },
    { name: "Básica · III ciclo", metric: "cobertura_c3" },
    { name: "Media", metric: "cobertura_med" },
  ].map((panel) => ({
    name: panel.name,
    points: series(panel.metric, {}).map((point) => ({ x: point.year, y: point.value })),
  }));

  const gap = departments
    .map((d) => ({
      name: d.name,
      a: rate("cobertura_c12", { department: d.id }),
      b: rate("cobertura_med", { department: d.id }),
    }))
    .sort((x, y) => y.a - y.b - (x.a - x.b));

  return `        <section class="cd-board" id="${board.id}" data-board="${board.id}">
          <div class="cd-shell">
            ${boardHead(board)}
            <div class="cd-board__body">
              <div>
                <p class="cd-label" style="margin-bottom:.75rem"><span>Cobertura neta por nivel · serie 2019–2026</span></p>
                <div class="cd-multiples">${smallMultiples({ panels, kind: "rate" })}</div>
                <p class="cd-note" style="margin-top:.75rem">
                  Los cuatro paneles comparten escala, así que la distancia entre ellos es real:
                  la cobertura de media es menos de la mitad de la de básica. ${escape(notice.dataShort)}.
                </p>
              </div>

              <div class="cd-board__body cd-board__body--map" style="margin-top:1rem">
                ${mapBlock({
                  metric: "cobertura_med",
                  metricName: "Cobertura en media",
                  kind: "rate",
                  id: "mapa-cobertura",
                })}
                ${mapInfo(ctx)}
              </div>

              ${chartBlock({
                id: "cobertura-brecha",
                title: "Distancia entre la cobertura de básica y la de media",
                desc:
                  "Cada fila es un departamento. La longitud de la línea es la caída entre un nivel " +
                  "y el siguiente: donde es más larga, la oferta local termina antes.",
                svg: dotPlot({
                  items: gap,
                  keys: ["Cobertura básica", "Cobertura media"],
                  kind: "rate",
                  label: "Cobertura de básica y media por departamento",
                }),
                legend: legend([{ name: "Cobertura básica" }, { name: "Cobertura media" }]),
                period: String(CURRENT_YEAR),
                table: table({
                  columns: [
                    { label: "Departamento", key: "name", sortable: true },
                    { label: "Cobertura básica", key: "a", numeric: true, sortable: true },
                    { label: "Cobertura media", key: "b", numeric: true, sortable: true },
                    { label: "Diferencia", key: "gap", numeric: true, sortable: true },
                  ],
                  rows: gap.map((row) => ({
                    cells: [
                      row.name,
                      `${decimal(row.a, 1)} %`,
                      `${decimal(row.b, 1)} %`,
                      `${decimal(row.a - row.b, 1)} pp`,
                    ],
                  })),
                  caption: "Cobertura neta por nivel y departamento, 2026. Datos demostrativos.",
                }),
                chart: { kind: "coverageGap" },
                className: "cd-board__wide",
              })}
            </div>
          </div>
        </section>`;
}

function boardPermanence(ctx) {
  const board = boards[3];
  const tiles = [
    rateTile("retencion", "Retención", { slug: "tasa-retencion", ctx }),
    rateTile("desercion", "Deserción intranual", { better: "down", slug: "tasa-desercion", ctx }),
    rateTile("repitencia", "Repitencia", { better: "down" }),
    rateTile("transicion", "Transición a media", { slug: "tasa-transicion-media", ctx }),
    rateTile("sobreedad", "Sobreedad", { better: "down" }),
  ].join("");

  const flowSeries = [
    { name: "Retención", points: series("retencion", {}).map((p) => ({ x: p.year, y: p.value })) },
    { name: "Transición a media", points: series("transicion", {}).map((p) => ({ x: p.year, y: p.value })) },
  ];

  const lossSeries = [
    { name: "Deserción", points: series("desercion", {}).map((p) => ({ x: p.year, y: p.value })) },
    { name: "Repitencia", points: series("repitencia", {}).map((p) => ({ x: p.year, y: p.value })) },
    { name: "Sobreedad", points: series("sobreedad", {}).map((p) => ({ x: p.year, y: p.value })) },
  ];

  return `        <section class="cd-board" id="${board.id}" data-board="${board.id}">
          <div class="cd-shell">
            ${boardHead(board)}
            <div class="cd-tiles" data-reveal-group>${tiles}</div>

            <div class="cd-board__body cd-board__body--split" style="margin-top:1.5rem">
              ${chartBlock({
                id: "permanencia-flujo",
                title: "Permanencia y transición",
                desc: "Dos indicadores que se leen juntos: quién termina el año y quién pasa al nivel siguiente.",
                svg: lineChart({
                  series: flowSeries,
                  kind: "rate",
                  zeroBased: false,
                  label: "Retención y transición, 2019 a 2026",
                }),
                legend: legend(flowSeries),
                period: `${YEARS[0]}–${CURRENT_YEAR}`,
                table: table({
                  columns: [
                    { label: "Año", key: "year" },
                    { label: "Retención", key: "ret", numeric: true },
                    { label: "Transición", key: "tra", numeric: true },
                  ],
                  rows: YEARS.map((year) => ({
                    cells: [
                      String(year),
                      `${decimal(rate("retencion", { year }), 1)} %`,
                      `${decimal(rate("transicion", { year }), 1)} %`,
                    ],
                  })),
                  caption: "Retención y transición, 2019–2026. Datos demostrativos.",
                }),
                chart: { kind: "rates", metrics: ["retencion", "transicion"] },
              })}

              ${chartBlock({
                id: "permanencia-perdida",
                title: "Deserción, repitencia y sobreedad",
                desc: "Los tres indicadores donde una caída es una buena noticia.",
                svg: lineChart({
                  series: lossSeries,
                  kind: "rate",
                  label: "Deserción, repitencia y sobreedad, 2019 a 2026",
                }),
                legend: legend(lossSeries),
                period: `${YEARS[0]}–${CURRENT_YEAR}`,
                table: table({
                  columns: [
                    { label: "Año", key: "year" },
                    { label: "Deserción", key: "des", numeric: true },
                    { label: "Repitencia", key: "rep", numeric: true },
                    { label: "Sobreedad", key: "sob", numeric: true },
                  ],
                  rows: YEARS.map((year) => ({
                    cells: [
                      String(year),
                      `${decimal(rate("desercion", { year }), 1)} %`,
                      `${decimal(rate("repitencia", { year }), 1)} %`,
                      `${decimal(rate("sobreedad", { year }), 1)} %`,
                    ],
                  })),
                  caption: "Deserción, repitencia y sobreedad, 2019–2026. Datos demostrativos.",
                }),
                chart: { kind: "rates", metrics: ["desercion", "repitencia", "sobreedad"] },
              })}

              <div class="cd-board__wide">
                ${chartBlock({
                  id: "permanencia-territorio",
                  title: "Deserción por departamento",
                  desc: "Donde la permanencia es más frágil, el abandono se concentra.",
                  svg: barChart({
                    items: departments
                      .map((d) => ({ id: d.id, name: d.name, value: rate("desercion", { department: d.id }) }))
                      .sort((a, b) => b.value - a.value),
                    kind: "rate",
                    ramp: true,
                    rowHeight: 24,
                    label: "Deserción por departamento, 2026",
                  }),
                  period: String(CURRENT_YEAR),
                  table: table({
                    columns: [
                      { label: "Departamento", key: "name", sortable: true },
                      { label: "Deserción", key: "value", numeric: true, sortable: true },
                      { label: "Retención", key: "ret", numeric: true, sortable: true },
                    ],
                    rows: departments.map((d) => ({
                      cells: [
                        d.name,
                        `${decimal(rate("desercion", { department: d.id }), 1)} %`,
                        `${decimal(rate("retencion", { department: d.id }), 1)} %`,
                      ],
                    })),
                    caption: "Permanencia por departamento, 2026. Datos demostrativos.",
                  }),
                  chart: { kind: "departments", metric: "desercion", kindFormat: "rate" },
                })}
              </div>
            </div>
          </div>
        </section>`;
}

function boardTeachers(ctx) {
  const board = boards[4];
  const tiles = [
    countTile("docentes", "Docentes en servicio"),
    tile({
      label: "Relación estudiante/docente",
      value: decimal(metricFor("ratio", {}), 1),
      change: Math.round((metricFor("ratio", {}) - metricFor("ratio", { year: CURRENT_YEAR - 1 })) * 10) / 10,
      changeNote: "vs. 2025",
      improving: false,
      target: sub(ctx, "datos/indicadores", "relacion-estudiante-docente"),
    }),
    tile({
      label: "Con formación acreditada",
      value: decimal(teaching.training[0].value, 1),
      sup: "%",
      change: null,
      changeNote: "Meta 2035: 95 %",
    }),
    tile({
      label: "En formación continua",
      value: decimal(teaching.developmentSeries[CURRENT_YEAR], 1),
      sup: "%",
      change:
        Math.round(
          (teaching.developmentSeries[CURRENT_YEAR] - teaching.developmentSeries[CURRENT_YEAR - 1]) * 10,
        ) / 10,
      changeNote: "pp vs. 2025",
      improving: true,
    }),
  ].join("");

  const bySex = teaching.bySex.map((item) => ({
    id: item.id,
    name: item.name,
    value: Math.round(metricFor("docentes", {}) * item.value),
  }));

  return `        <section class="cd-board" id="${board.id}" data-board="${board.id}">
          <div class="cd-shell">
            ${boardHead(board)}
            <div class="cd-tiles" data-reveal-group>${tiles}</div>

            <div class="cd-board__body cd-board__body--split" style="margin-top:1.5rem">
              ${chartBlock({
                id: "docentes-nivel",
                title: "Personal docente por nivel educativo",
                desc: "Distribución del personal en servicio.",
                svg: columnChart({ items: teaching.byLevel, height: 260, label: "Docentes por nivel" }),
                period: String(CURRENT_YEAR),
                table: table({
                  columns: [
                    { label: "Nivel", key: "name" },
                    { label: "Docentes", key: "value", numeric: true },
                  ],
                  rows: teaching.byLevel.map((item) => ({ cells: [item.name, group(item.value)] })),
                  caption: "Personal docente por nivel, 2026. Datos demostrativos.",
                }),
                chart: { kind: "staticColumns", items: teaching.byLevel },
              })}

              ${chartBlock({
                id: "docentes-sexo",
                title: "Personal docente por sexo",
                desc: "La docencia es mayoritariamente femenina en los tres niveles.",
                svg: stackedBar({ segments: bySex, label: "Docentes por sexo" }),
                legend: legend(bySex),
                period: String(CURRENT_YEAR),
                table: table({
                  columns: [
                    { label: "Sexo", key: "name" },
                    { label: "Docentes", key: "value", numeric: true },
                  ],
                  rows: bySex.map((item) => ({ cells: [item.name, group(item.value)] })),
                  caption: "Personal docente por sexo, 2026. Datos demostrativos.",
                }),
                chart: { kind: "staticStack", items: bySex },
              })}

              ${chartBlock({
                id: "docentes-formacion",
                title: "Formación del personal docente",
                desc: "Porcentaje del personal en servicio que cumple cada condición.",
                svg: barChart({
                  items: teaching.training,
                  kind: "rate",
                  rowHeight: 30,
                  label: "Formación docente",
                }),
                period: String(CURRENT_YEAR),
                table: table({
                  columns: [
                    { label: "Condición", key: "name" },
                    { label: "Porcentaje", key: "value", numeric: true },
                  ],
                  rows: teaching.training.map((item) => ({ cells: [item.name, `${decimal(item.value, 1)} %`] })),
                  caption: "Formación del personal docente, 2026. Datos demostrativos.",
                }),
                chart: { kind: "staticBars", items: teaching.training, kindFormat: "rate" },
              })}

              ${chartBlock({
                id: "docentes-ratio",
                title: "Relación estudiante/docente por departamento",
                desc: "Un promedio de dotación, no un tamaño de aula.",
                svg: barChart({
                  items: departments
                    .map((d) => ({ id: d.id, name: d.name, value: metricFor("ratio", { department: d.id }) }))
                    .sort((a, b) => b.value - a.value),
                  kind: "decimal",
                  ramp: true,
                  rowHeight: 24,
                  label: "Relación estudiante/docente por departamento",
                }),
                period: String(CURRENT_YEAR),
                table: table({
                  columns: [
                    { label: "Departamento", key: "name", sortable: true },
                    { label: "Estudiantes por docente", key: "value", numeric: true, sortable: true },
                    { label: "Docentes", key: "docentes", numeric: true, sortable: true },
                  ],
                  rows: departments.map((d) => ({
                    cells: [
                      d.name,
                      decimal(metricFor("ratio", { department: d.id }), 1),
                      group(metricFor("docentes", { department: d.id })),
                    ],
                  })),
                  caption: "Relación estudiante/docente por departamento, 2026. Datos demostrativos.",
                }),
                chart: { kind: "departments", metric: "ratio", kindFormat: "decimal" },
                className: "cd-board__wide",
              })}
            </div>
          </div>
        </section>`;
}

function boardInfrastructure(ctx) {
  const board = boards[5];
  const items = infrastructure.map((item) => ({
    id: item.metric,
    name: item.name,
    value: rate(item.metric, {}),
  }));

  const panels = infrastructure.slice(0, 3).map((item) => ({
    name: item.name,
    points: series(item.metric, {}).map((point) => ({ x: point.year, y: point.value })),
  }));

  return `        <section class="cd-board" id="${board.id}" data-board="${board.id}">
          <div class="cd-shell">
            ${boardHead(board)}
            <div class="cd-board__body cd-board__body--split">
              ${chartBlock({
                id: "infra-servicios",
                title: "Condiciones de los centros educativos",
                desc: "Porcentaje de centros que declara contar con cada servicio o instalación.",
                svg: barChart({ items, kind: "rate", rowHeight: 32, ramp: true, label: "Condiciones de los centros" }),
                period: String(CURRENT_YEAR),
                table: table({
                  columns: [
                    { label: "Condición", key: "name" },
                    { label: `${CURRENT_YEAR}`, key: "value", numeric: true },
                    { label: "2019", key: "base", numeric: true },
                  ],
                  rows: infrastructure.map((item) => ({
                    cells: [
                      item.name,
                      `${decimal(rate(item.metric, {}), 1)} %`,
                      `${decimal(rate(item.metric, { year: 2019 }), 1)} %`,
                    ],
                  })),
                  caption: "Condiciones de los centros educativos. Datos demostrativos.",
                }),
                chart: { kind: "staticBars", items, kindFormat: "rate" },
              })}

              <div>
                <p class="cd-label" style="margin-bottom:.75rem"><span>Evolución 2019–2026</span></p>
                <div class="cd-multiples">${smallMultiples({ panels, kind: "rate" })}</div>
                <p class="cd-note" style="margin-top:.75rem">
                  La conectividad es la que más se movió y la que sigue más lejos de la meta del plan.
                  ${escape(notice.dataShort)}.
                </p>
              </div>

              <div class="cd-board__wide cd-board__body cd-board__body--map">
                ${mapBlock({
                  metric: "conectividad",
                  metricName: "Conectividad",
                  kind: "rate",
                  id: "mapa-infra",
                })}
                ${mapInfo(ctx)}
              </div>
            </div>
          </div>
        </section>`;
}

function boardTechnical(ctx) {
  const board = boards[6];
  const tiles = [
    countTile("tecnica", "Matrícula técnica", { slug: "matricula-educacion-tecnica", ctx }),
    tile({ label: "Centros con oferta técnica", value: group(technical.centres), change: null, changeNote: "Catálogo 2026" }),
    tile({ label: "Familias profesionales", value: String(technical.families.length), change: null, changeNote: "Catálogo nacional" }),
    rateTile("insercion_tecnica", "Inserción laboral de egresados"),
  ].join("");

  const families = technical.families
    .map((family) => ({ id: family.id, name: family.name, value: family.students }))
    .sort((a, b) => b.value - a.value);

  return `        <section class="cd-board" id="${board.id}" data-board="${board.id}">
          <div class="cd-shell">
            ${boardHead(board)}
            <div class="cd-tiles" data-reveal-group>${tiles}</div>

            <div class="cd-board__body cd-board__body--split" style="margin-top:1.5rem">
              ${chartBlock({
                id: "tecnica-familias",
                title: "Matrícula por familia profesional",
                desc: "Ocho familias del catálogo nacional, ordenadas por matrícula.",
                svg: barChart({ items: families, ramp: true, rowHeight: 28, label: "Matrícula por familia profesional" }),
                period: String(CURRENT_YEAR),
                table: table({
                  columns: [
                    { label: "Familia profesional", key: "name", sortable: true },
                    { label: "Estudiantes", key: "value", numeric: true, sortable: true },
                    { label: "Centros", key: "centres", numeric: true, sortable: true },
                  ],
                  rows: technical.families.map((family) => ({
                    cells: [family.name, group(family.students), group(family.centres)],
                  })),
                  caption: "Educación técnica por familia profesional, 2026. Datos demostrativos.",
                }),
                chart: { kind: "staticBars", items: families },
              })}

              ${chartBlock({
                id: "tecnica-trend",
                title: "Matrícula técnica e inserción laboral",
                desc: "La matrícula técnica creció más rápido que la matrícula de media en su conjunto.",
                svg: lineChart({
                  series: [
                    {
                      name: "Matrícula técnica",
                      points: series("tecnica", {}).map((point) => ({ x: point.year, y: point.value })),
                    },
                  ],
                  label: "Matrícula técnica, 2019 a 2026",
                }),
                period: `${YEARS[0]}–${CURRENT_YEAR}`,
                table: table({
                  columns: [
                    { label: "Año", key: "year" },
                    { label: "Matrícula técnica", key: "value", numeric: true },
                    { label: "Inserción laboral", key: "ins", numeric: true },
                  ],
                  rows: YEARS.map((year) => ({
                    cells: [
                      String(year),
                      group(technicalEnrolment({ year })),
                      `${decimal(rate("insercion_tecnica", { year }), 1)} %`,
                    ],
                  })),
                  caption: "Educación técnica, 2019–2026. Datos demostrativos.",
                }),
                chart: { kind: "trend", metric: "tecnica" },
              })}

              <div class="cd-board__wide">
                ${chartBlock({
                  id: "tecnica-territorio",
                  title: "Matrícula técnica por departamento",
                  desc: "La oferta técnica se concentra donde hay talleres equipados.",
                  svg: barChart({
                    items: departments
                      .map((d) => ({ id: d.id, name: d.name, value: technicalEnrolment({ department: d.id }) }))
                      .sort((a, b) => b.value - a.value),
                    ramp: true,
                    rowHeight: 24,
                    label: "Matrícula técnica por departamento",
                  }),
                  period: String(CURRENT_YEAR),
                  table: table({
                    columns: [
                      { label: "Departamento", key: "name", sortable: true },
                      { label: "Matrícula técnica", key: "value", numeric: true, sortable: true },
                    ],
                    rows: departments.map((d) => ({
                      cells: [d.name, group(technicalEnrolment({ department: d.id }))],
                    })),
                    caption: "Matrícula técnica por departamento, 2026. Datos demostrativos.",
                  }),
                  chart: { kind: "departments", metric: "tecnica" },
                })}
              </div>
            </div>
          </div>
        </section>`;
}

function boardInclusion(ctx) {
  const board = boards[7];
  const tiles = inclusion.groups
    .map((groupItem) =>
      tile({
        label: groupItem.name,
        value: group(groupItem.value()),
        change: null,
        changeNote: "Estudiantes atendidos",
        note: groupItem.note,
      }),
    )
    .join("");

  const inclusionSeries = [
    {
      name: "Educación intercultural bilingüe",
      points: YEARS.map((year) => ({ x: year, y: inclusion.series.indigena[year] })),
    },
    {
      name: "Comunidades afrodescendientes",
      points: YEARS.map((year) => ({ x: year, y: inclusion.series.afro[year] })),
    },
    {
      name: "Estudiantes con discapacidad",
      points: YEARS.map((year) => ({ x: year, y: inclusion.series.discapacidad[year] })),
    },
  ];

  const ruralGap = departments
    .map((d) => ({
      name: d.name,
      a: rate("conectividad", { department: d.id }),
      b: rate("brecha_digital", { department: d.id }),
    }))
    .sort((x, y) => y.b - x.b);

  return `        <section class="cd-board" id="${board.id}" data-board="${board.id}">
          <div class="cd-shell">
            ${boardHead(board)}
            <div class="cd-tiles" data-reveal-group>${tiles}</div>

            <div class="cd-board__body cd-board__body--split" style="margin-top:1.5rem">
              ${chartBlock({
                id: "inclusion-series",
                title: "Estudiantes atendidos por línea de inclusión",
                desc: "Series 2019–2026 de las tres líneas con registro propio.",
                svg: lineChart({ series: inclusionSeries, label: "Líneas de inclusión, 2019 a 2026" }),
                legend: legend(inclusionSeries),
                period: `${YEARS[0]}–${CURRENT_YEAR}`,
                table: table({
                  columns: [
                    { label: "Año", key: "year" },
                    { label: "Intercultural bilingüe", key: "a", numeric: true },
                    { label: "Afrodescendientes", key: "b", numeric: true },
                    { label: "Con discapacidad", key: "c", numeric: true },
                  ],
                  rows: YEARS.map((year) => ({
                    cells: [
                      String(year),
                      group(inclusion.series.indigena[year]),
                      group(inclusion.series.afro[year]),
                      group(inclusion.series.discapacidad[year]),
                    ],
                  })),
                  caption: "Líneas de inclusión, 2019–2026. Datos demostrativos.",
                }),
                chart: { kind: "staticLines", series: inclusionSeries },
              })}

              ${chartBlock({
                id: "inclusion-digital",
                title: "Conectividad del centro y brecha digital del hogar",
                desc:
                  "Dos medidas distintas del mismo problema: un sistema puede conectar sus escuelas " +
                  "y seguir teniendo una brecha en casa.",
                svg: dotPlot({
                  items: ruralGap,
                  keys: ["Centros conectados", "Hogares sin conexión"],
                  kind: "rate",
                  label: "Conectividad y brecha digital por departamento",
                }),
                legend: legend([{ name: "Centros conectados" }, { name: "Hogares sin conexión ni dispositivo" }]),
                period: String(CURRENT_YEAR),
                table: table({
                  columns: [
                    { label: "Departamento", key: "name", sortable: true },
                    { label: "Centros conectados", key: "a", numeric: true, sortable: true },
                    { label: "Hogares sin conexión", key: "b", numeric: true, sortable: true },
                  ],
                  rows: ruralGap.map((row) => ({
                    cells: [row.name, `${decimal(row.a, 1)} %`, `${decimal(row.b, 1)} %`],
                  })),
                  caption: "Brecha digital por departamento, 2026. Datos demostrativos.",
                }),
                chart: { kind: "digitalGap" },
              })}

              <div class="cd-board__wide">
                <p class="cd-note cd-note--boxed">
                  Las poblaciones se describen por la educación que reciben, nunca por una carencia:
                  el portal habla de estudiantes atendidos en educación intercultural bilingüe, no de
                  «población indígena atendida». ${escape(notice.data)}
                </p>
              </div>
            </div>
          </div>
        </section>`;
}

function boardFinance(ctx) {
  const board = boards[8];
  const budget = finance.budget[CURRENT_YEAR];
  const execution = (budget.executed / budget.assigned) * 100;

  const budgetSeries = [
    { name: "Asignado", points: YEARS.map((year) => ({ x: year, y: finance.budget[year].assigned })) },
    { name: "Ejecutado", points: YEARS.map((year) => ({ x: year, y: finance.budget[year].executed })) },
  ];

  const territorial = financeByDepartment().sort((a, b) => b.value - a.value);

  const tiles = [
    tile({
      label: "Presupuesto educativo asignado",
      value: `L ${group(budget.assigned)} M`,
      change: Math.round(((budget.assigned - finance.budget[CURRENT_YEAR - 1].assigned) / finance.budget[CURRENT_YEAR - 1].assigned) * 1000) / 10,
      changeNote: "% vs. 2025",
      improving: true,
    }),
    tile({
      label: "Ejecución presupuestaria",
      value: decimal(execution, 1),
      sup: "%",
      change: null,
      changeNote: "Al cierre del segundo trimestre",
    }),
    tile({
      label: "Inversión por estudiante",
      value: `L ${group(Math.round((budget.assigned * 1_000_000) / enrolment({})))}`,
      change: null,
      changeNote: "Asignado ÷ matrícula",
    }),
    tile({
      label: "Programas con presupuesto propio",
      value: String(finance.byProgramme.length),
      change: null,
      changeNote: "Ejes del plan nacional",
    }),
  ].join("");

  return `        <section class="cd-board" id="${board.id}" data-board="${board.id}">
          <div class="cd-shell">
            ${boardHead(board)}
            <div class="cd-tiles" data-reveal-group>${tiles}</div>

            <div class="cd-board__body cd-board__body--split" style="margin-top:1.5rem">
              ${chartBlock({
                id: "finanzas-serie",
                title: "Presupuesto asignado y ejecutado",
                desc: "Millones de lempiras. La distancia entre las dos líneas es la ejecución pendiente.",
                svg: lineChart({
                  series: budgetSeries,
                  zeroBased: false,
                  label: "Presupuesto asignado y ejecutado, 2019 a 2026",
                }),
                legend: legend(budgetSeries),
                period: `${YEARS[0]}–${CURRENT_YEAR}`,
                table: table({
                  columns: [
                    { label: "Año", key: "year" },
                    { label: "Asignado (L millones)", key: "a", numeric: true },
                    { label: "Ejecutado (L millones)", key: "e", numeric: true },
                    { label: "Ejecución", key: "p", numeric: true },
                  ],
                  rows: YEARS.map((year) => ({
                    cells: [
                      String(year),
                      group(finance.budget[year].assigned),
                      group(finance.budget[year].executed),
                      `${decimal((finance.budget[year].executed / finance.budget[year].assigned) * 100, 1)} %`,
                    ],
                  })),
                  caption: "Presupuesto educativo, 2019–2026. Información demostrativa.",
                }),
                chart: { kind: "staticLines", series: budgetSeries },
              })}

              ${chartBlock({
                id: "finanzas-nivel",
                title: "Distribución por nivel educativo",
                desc: "Asignación 2026 en millones de lempiras.",
                svg: barChart({ items: finance.byLevel, rowHeight: 32, ramp: true, label: "Presupuesto por nivel" }),
                period: String(CURRENT_YEAR),
                table: table({
                  columns: [
                    { label: "Nivel", key: "name" },
                    { label: "L millones", key: "value", numeric: true },
                    { label: "Participación", key: "share", numeric: true },
                  ],
                  rows: finance.byLevel.map((item) => ({
                    cells: [
                      item.name,
                      group(item.value),
                      `${decimal((item.value / budget.assigned) * 100, 1)} %`,
                    ],
                  })),
                  caption: "Presupuesto por nivel educativo, 2026. Información demostrativa.",
                }),
                chart: { kind: "staticBars", items: finance.byLevel },
              })}

              ${chartBlock({
                id: "finanzas-programa",
                title: "Inversión por eje del plan",
                desc: "Cómo se reparte el presupuesto entre los cinco ejes y la operación del sistema.",
                svg: barChart({ items: finance.byProgramme, rowHeight: 32, ramp: true, label: "Presupuesto por eje" }),
                period: String(CURRENT_YEAR),
                table: table({
                  columns: [
                    { label: "Eje o programa", key: "name" },
                    { label: "L millones", key: "value", numeric: true },
                  ],
                  rows: finance.byProgramme.map((item) => ({ cells: [item.name, group(item.value)] })),
                  caption: "Inversión por eje, 2026. Información demostrativa.",
                }),
                chart: { kind: "staticBars", items: finance.byProgramme },
              })}

              <div>
                <p class="cd-label" style="margin-bottom:.75rem"><span>Distribución territorial</span></p>
                ${table({
                  columns: [
                    { label: "Departamento", key: "name", sortable: true },
                    { label: "L millones", key: "value", numeric: true, sortable: true },
                    { label: "Inversión por estudiante", key: "per", numeric: true, sortable: true },
                  ],
                  rows: territorial.map((row) => ({
                    cells: [row.name, group(row.value), `L ${group(row.perStudent)}`],
                  })),
                  caption: "Distribución territorial de la inversión, 2026. Información demostrativa.",
                  className: "cd-tablewrap--short",
                })}
              </div>

              <div class="cd-board__wide">
                <p class="cd-note cd-note--boxed">${escape(finance.note)}</p>
              </div>
            </div>
          </div>
        </section>`;
}

function boardSdg(ctx) {
  const board = boards[9];

  const rows = sdg4.targets
    .map((target) => {
      const progress = ((target.current - target.baseline) / (target.goal - target.baseline)) * 100;
      const state = sdg4.states[target.state];
      const unit = target.unit === "estudiantes" ? "" : ` ${target.unit}`;
      const fmt = (value) =>
        target.unit === "estudiantes" ? group(value) : `${decimal(value, 1)}${unit}`;

      return (
        `<div class="cd-ods__row" data-reveal="fade">` +
        `<p class="cd-ods__id">${escape(target.id)}</p>` +
        `<div><p class="cd-ods__target">${escape(target.target)}</p>` +
        `<p class="cd-ods__indicator">${escape(target.indicator)}</p></div>` +
        `<div class="cd-ods__track">` +
        `<span class="cd-meter" role="img" aria-label="${escape(
          `${target.indicator}: ${fmt(target.current)} de una meta de ${fmt(target.goal)}`,
        )}"><span class="cd-meter__fill" style="width:${Math.max(2, Math.min(100, progress))}%"></span></span>` +
        `<span class="cd-ods__numbers"><span>Línea base ${escape(fmt(target.baseline))}</span>` +
        `<span>Actual ${escape(fmt(target.current))}</span>` +
        `<span>Meta ${escape(fmt(target.goal))}</span></span></div>` +
        `<div>${statePill(target.state, state.label)}</div>` +
        `</div>`
      );
    })
    .join("");

  return `        <section class="cd-board" id="${board.id}" data-board="${board.id}">
          <div class="cd-shell">
            ${boardHead(board)}
            <p class="cd-lead" style="margin-bottom:1.5rem">${escape(sdg4.lead)}</p>
            <div class="cd-ods" data-reveal-group>${rows}</div>

            <div style="margin-top:1.5rem">
              ${table({
                columns: [
                  { label: "Meta", key: "id" },
                  { label: "Indicador", key: "indicator" },
                  { label: "Línea base", key: "baseline", numeric: true },
                  { label: "Resultado actual", key: "current", numeric: true },
                  { label: "Meta 2035", key: "goal", numeric: true },
                  { label: "Estado", key: "state" },
                ],
                rows: sdg4.targets.map((target) => ({
                  cells: [
                    target.id,
                    target.indicator,
                    target.unit === "estudiantes" ? group(target.baseline) : `${decimal(target.baseline, 1)} ${target.unit}`,
                    target.unit === "estudiantes" ? group(target.current) : `${decimal(target.current, 1)} ${target.unit}`,
                    target.unit === "estudiantes" ? group(target.goal) : `${decimal(target.goal, 1)} ${target.unit}`,
                    sdg4.states[target.state].label,
                  ],
                })),
                caption: "Seguimiento al ODS 4. Metas, líneas base y resultados demostrativos.",
              })}
              <p class="cd-note cd-note--boxed" style="margin-top:.75rem">${escape(sdg4.note)}</p>
            </div>
          </div>
        </section>`;
}

/* -------------------------------------------------------------- the page */

export function observatoryPage(ctx) {
  const body = `      ${pageHero({
    ctx,
    trail: [{ label: "Inicio", route: "home" }, { label: "Datos e indicadores" }],
    label: "Observatorio Educativo",
    title: "El estado del sistema educativo, medido y publicado.",
    lead:
      "Diez tableros, dieciocho departamentos y series desde 2019. Todo lo que se ve aquí puede " +
      "descargarse, y todo lo que se descarga trae su metodología.",
    meta: [
      { term: "Última actualización", detail: longDate("2026-08-20") },
      { term: "Cobertura", detail: "Nacional y departamental" },
      { term: "Periodicidad", detail: "Anual" },
      { term: "Licencia", detail: "Datos abiertos con atribución" },
    ],
    extra: `<div class="cd-actions" style="margin-top:1rem">
      ${button("Comparar territorios", page(ctx, "comparador"), { ghost: true, icon: "arrow" })}
      ${button("Metodología", page(ctx, "metodologia"), { ghost: true })}
      ${button("Datos abiertos", page(ctx, "abiertos"), { ghost: true })}
    </div>`,
  })}

${filterBar()}
${boardRail()}

      <div class="cd-observatory">
${boardPanorama(ctx)}
${boardEnrolment(ctx)}
${boardCoverage(ctx)}
${boardPermanence(ctx)}
${boardTeachers(ctx)}
${boardInfrastructure(ctx)}
${boardTechnical(ctx)}
${boardInclusion(ctx)}
${boardFinance(ctx)}
${boardSdg(ctx)}
      </div>`;

  return {
    meta: {
      title: "Observatorio Educativo",
      canonical: "datos.html",
      description:
        "Observatorio educativo demostrativo: matrícula, cobertura, permanencia, docentes, " +
        "infraestructura, educación técnica, inclusión, financiamiento y seguimiento del ODS 4.",
    },
    current: "datos",
    body,
  };
}

/* ------------------------------------------------------- indicator detail */

export function indicatorPage(ctx, indicator) {
  const resolved = resolve(indicator);
  const board = boards.find((item) => item.id === indicator.board);
  const kind = indicator.format === "rate" ? "rate" : indicator.format === "decimal" ? "decimal" : "count";

  const territorial = departments
    .map((d) => ({
      id: d.id,
      name: d.name,
      value:
        indicator.format === "rate"
          ? rate(indicator.metric, { department: d.id })
          : metricFor(indicator.metric, { department: d.id }),
    }))
    .sort((a, b) => b.value - a.value);

  const values = Object.fromEntries(territorial.map((row) => [row.id, row.value]));
  const map = choropleth({
    departments,
    values,
    map: MAP,
    metricName: indicator.name,
    kind,
  });

  const definition = [
    { term: "Unidad", detail: indicator.unit },
    { term: "Periodicidad", detail: indicator.periodicity },
    { term: "Cobertura", detail: indicator.coverage },
    { term: "Última actualización", detail: longDate("2026-08-20") },
  ];

  const body = `      ${pageHero({
    ctx,
    trail: [
      { label: "Inicio", route: "home" },
      { label: "Datos e indicadores", route: "datos" },
      { label: indicator.name },
    ],
    label: `Indicador · ${board.name}`,
    title: indicator.name,
    lead: indicator.definition,
    meta: definition,
  })}

      <section class="cd-section cd-section--tight">
        <div class="cd-shell">
          <div class="cd-board__body cd-board__body--split">
            <div class="cd-tiles" style="grid-column:1/-1" data-reveal-group>
              ${tile({
                label: `Valor ${CURRENT_YEAR}`,
                value: indicator.format === "rate" ? decimal(resolved.value, 1) : group(resolved.value),
                sup: indicator.format === "rate" ? "%" : null,
                change: resolved.change,
                changeNote:
                  indicator.format === "rate"
                    ? `${resolved.change > 0 ? "+" : ""}${decimal(resolved.change, 1)} pp vs. ${CURRENT_YEAR - 1}`
                    : `${resolved.percent > 0 ? "+" : ""}${decimal(resolved.percent, 1)} % vs. ${CURRENT_YEAR - 1}`,
                improving: resolved.improving,
              })}
              ${tile({
                label: `Valor ${YEARS[0]} (línea base)`,
                value:
                  indicator.format === "rate"
                    ? decimal(resolved.history[0].value, 1)
                    : group(resolved.history[0].value),
                sup: indicator.format === "rate" ? "%" : null,
                change: null,
                changeNote: "Inicio de la serie",
              })}
              ${tile({
                label: "Territorio con el valor más alto",
                value: territorial[0].name,
                change: null,
                changeNote:
                  indicator.format === "rate"
                    ? `${decimal(territorial[0].value, 1)} %`
                    : group(territorial[0].value),
              })}
              ${tile({
                label: "Territorio con el valor más bajo",
                value: territorial[territorial.length - 1].name,
                change: null,
                changeNote:
                  indicator.format === "rate"
                    ? `${decimal(territorial[territorial.length - 1].value, 1)} %`
                    : group(territorial[territorial.length - 1].value),
              })}
            </div>

            <div class="cd-board__wide" style="margin-top:1.5rem">
              ${chartBlock({
                id: "indicador-serie",
                title: `Serie histórica · ${indicator.name}`,
                desc: `Evolución ${YEARS[0]}–${CURRENT_YEAR}.`,
                svg: lineChart({
                  series: [{ name: indicator.name, points: resolved.history.map((p) => ({ x: p.year, y: p.value })) }],
                  kind,
                  zeroBased: indicator.format !== "rate",
                  label: `${indicator.name}, ${YEARS[0]} a ${CURRENT_YEAR}`,
                }),
                period: `${YEARS[0]}–${CURRENT_YEAR}`,
                table: seriesTable(resolved.history, indicator.name, kind),
                chart: { kind: "trend", metric: indicator.metric, kindFormat: kind },
              })}
            </div>

            <div class="cd-map" style="margin-top:1.5rem">
              <div class="cd-map__frame" data-map data-map-metric="${escape(indicator.metric)}" data-map-kind="${kind}">
                ${map.svg}
              </div>
              ${map.legend}
            </div>

            <div style="margin-top:1.5rem">
              ${chartBlock({
                id: "indicador-territorio",
                title: "Desagregación territorial",
                desc: "Los dieciocho departamentos, ordenados por valor.",
                svg: barChart({
                  items: territorial,
                  kind,
                  ramp: true,
                  rowHeight: 24,
                  label: `${indicator.name} por departamento`,
                }),
                period: String(CURRENT_YEAR),
                table: table({
                  columns: [
                    { label: "Departamento", key: "name", sortable: true },
                    { label: indicator.name, key: "value", numeric: true, sortable: true },
                  ],
                  rows: territorial.map((row) => ({
                    cells: [
                      row.name,
                      indicator.format === "rate" ? `${decimal(row.value, 1)} %` : group(row.value),
                    ],
                  })),
                  caption: `${indicator.name} por departamento, ${CURRENT_YEAR}. Datos demostrativos.`,
                }),
                chart: { kind: "departments", metric: indicator.metric, kindFormat: kind },
              })}
            </div>
          </div>
        </div>
      </section>

      <section class="cd-section cd-section--surface">
        <div class="cd-shell">
          ${head({
            index: "",
            label: "Ficha metodológica",
            title: "Cómo se construye este indicador.",
            body: "La definición, la fórmula y —sobre todo— lo que el indicador no permite afirmar.",
          })}
          <div class="cd-rows">
            ${[
              { index: "01", title: "Definición", text: indicator.definition },
              { index: "02", title: "Fórmula de cálculo", text: indicator.formula },
              { index: "03", title: "Desagregaciones", text: indicator.disaggregation.join(" · ") },
              { index: "04", title: "Notas de interpretación", text: indicator.notes },
              { index: "05", title: "Limitaciones", text: indicator.limitations },
              { index: "06", title: "Fuente", text: `${institution.short} · Sistema Nacional de Información Educativa. ${notice.data}` },
            ]
              .map(
                (row) =>
                  `<div class="cd-row-item"><p class="cd-row-item__index">${row.index}</p>` +
                  `<p class="cd-row-item__title">${escape(row.title)}</p>` +
                  `<div><p class="cd-row-item__text">${escape(row.text)}</p></div></div>`,
              )
              .join("")}
          </div>

          <div class="cd-actions" style="margin-top:1.5rem">
            ${button("Ver el tablero completo", page(ctx, "datos", indicator.board), { ghost: true, icon: "arrow" })}
            ${button("Metodología general", page(ctx, "metodologia"), { ghost: true })}
            ${button("Descargar los datos", page(ctx, "abiertos"), { ghost: true })}
          </div>
        </div>
      </section>

      <section class="cd-section">
        <div class="cd-shell">
          ${head({
            index: "",
            label: "Otros indicadores",
            title: "Del mismo tablero.",
          })}
          <div class="cd-grid cd-grid--3" data-reveal-group>
            ${indicatorsOfBoard(indicator.board)
              .filter((item) => item.slug !== indicator.slug)
              .concat(indicators.filter((item) => item.board !== indicator.board).slice(0, 3))
              .slice(0, 3)
              .map((item) => {
                const other = resolve(item);
                return (
                  `<a class="cd-card" href="${sub(ctx, "datos/indicadores", item.slug)}" data-reveal="rise">` +
                  `<p class="cd-card__kicker">${escape(boards.find((b) => b.id === item.board).name)}</p>` +
                  `<p class="cd-card__title">${escape(item.name)}</p>` +
                  `<p class="cd-card__text">${escape(item.definition.slice(0, 120))}…</p>` +
                  `<div class="cd-card__foot"><span>${escape(
                    item.format === "rate" ? `${decimal(other.value, 1)} %` : group(other.value),
                  )}</span><span>${CURRENT_YEAR}</span></div></a>`
                );
              })
              .join("")}
          </div>
        </div>
      </section>`;

  return {
    meta: {
      title: indicator.name,
      canonical: `datos/indicadores/${indicator.slug}.html`,
      description: `${indicator.definition.slice(0, 200)} Datos demostrativos.`,
    },
    current: "datos",
    body,
  };
}

/* --------------------------------------------------------- the comparator */

export function comparatorPage(ctx) {
  const preset = ["fm", "cr", "cm"];
  const rows = preset.map((id) => territoryRow(id));

  const metrics = [
    { key: "matricula", label: "Matrícula", format: "count" },
    { key: "centros", label: "Centros educativos", format: "count" },
    { key: "docentes", label: "Personal docente", format: "count" },
    { key: "ratio", label: "Estudiantes por docente", format: "decimal" },
    { key: "cobertura", label: "Cobertura en básica", format: "rate" },
    { key: "coberturaMedia", label: "Cobertura en media", format: "rate" },
    { key: "permanencia", label: "Permanencia", format: "rate" },
    { key: "desercion", label: "Deserción", format: "rate" },
    { key: "transicion", label: "Transición a media", format: "rate" },
    { key: "conectividad", label: "Conectividad de centros", format: "rate" },
    { key: "tecnica", label: "Matrícula técnica", format: "count" },
  ];

  const fmt = (value, format) =>
    format === "rate" ? `${decimal(value, 1)} %` : format === "decimal" ? decimal(value, 1) : group(value);

  const slots = [0, 1, 2]
    .map(
      (index) =>
        `<div class="cd-compare__slot" data-slot="${index + 1}">` +
        `<label class="cd-field__label" for="cmp-${index}">Territorio ${index + 1}</label>` +
        `<span class="cd-select"><select id="cmp-${index}" data-compare="${index}">` +
        departments
          .map(
            (d) =>
              `<option value="${d.id}"${d.id === preset[index] ? " selected" : ""}>${escape(d.name)}</option>`,
          )
          .join("") +
        `</select></span></div>`,
    )
    .join("");

  const body = `      ${pageHero({
    ctx,
    trail: [
      { label: "Inicio", route: "home" },
      { label: "Datos e indicadores", route: "datos" },
      { label: "Comparar territorios" },
    ],
    label: "Herramienta",
    title: "Comparar territorios.",
    lead:
      "Elija hasta tres departamentos y véalos lado a lado en once indicadores. Los tres colores " +
      "se mantienen mientras la selección cambia, para que ninguna serie cambie de identidad.",
  })}

      <section class="cd-section cd-section--tight">
        <div class="cd-shell" data-comparator>
          <div class="cd-compare__picker">${slots}</div>

          <div class="cd-compare__grid">
            ${chartBlock({
              id: "cmp-matricula",
              title: "Matrícula total",
              desc: "Serie 2019–2026 de los territorios seleccionados.",
              svg: lineChart({
                series: preset.map((id) => ({
                  name: byId[id].name,
                  points: series("matricula", { department: id }).map((p) => ({ x: p.year, y: p.value })),
                })),
                label: "Comparación de matrícula",
              }),
              legend: legend(preset.map((id) => ({ name: byId[id].name }))),
              period: `${YEARS[0]}–${CURRENT_YEAR}`,
              table: table({
                columns: [
                  { label: "Año", key: "year" },
                  ...preset.map((id) => ({ label: byId[id].name, key: id, numeric: true })),
                ],
                rows: YEARS.map((year) => ({
                  cells: [String(year), ...preset.map((id) => group(enrolment({ year, department: id })))],
                })),
                caption: "Matrícula comparada. Datos demostrativos.",
              }),
              chart: { kind: "compareTrend", metric: "matricula" },
            })}

            ${chartBlock({
              id: "cmp-cobertura",
              title: "Cobertura en educación media",
              desc: "El indicador de acceso más exigente del sistema.",
              svg: lineChart({
                series: preset.map((id) => ({
                  name: byId[id].name,
                  points: series("cobertura_med", { department: id }).map((p) => ({ x: p.year, y: p.value })),
                })),
                kind: "rate",
                zeroBased: false,
                label: "Comparación de cobertura en media",
              }),
              legend: legend(preset.map((id) => ({ name: byId[id].name }))),
              period: `${YEARS[0]}–${CURRENT_YEAR}`,
              table: table({
                columns: [
                  { label: "Año", key: "year" },
                  ...preset.map((id) => ({ label: byId[id].name, key: id, numeric: true })),
                ],
                rows: YEARS.map((year) => ({
                  cells: [
                    String(year),
                    ...preset.map((id) => `${decimal(rate("cobertura_med", { year, department: id }), 1)} %`),
                  ],
                })),
                caption: "Cobertura en media comparada. Datos demostrativos.",
              }),
              chart: { kind: "compareTrend", metric: "cobertura_med", kindFormat: "rate" },
            })}
          </div>

          <div style="margin-top:1.5rem">
            <p class="cd-label" style="margin-bottom:.75rem"><span>Tabla comparativa</span>${demoTag()}</p>
            <div class="cd-tablewrap" data-compare-table>
              <table class="cd-table cd-table--stack">
                <caption>Indicadores comparados, ${CURRENT_YEAR}. Todas las cifras son demostrativas.</caption>
                <thead>
                  <tr>
                    <th scope="col">Indicador</th>
                    ${rows.map((row) => `<th scope="col" class="cd-num" data-compare-head>${escape(row.name)}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${metrics
                    .map(
                      (metric) =>
                        `<tr data-compare-row="${metric.key}"><td class="cd-table__name" data-label="Indicador">` +
                        `${escape(metric.label)}</td>` +
                        rows
                          .map(
                            (row) =>
                              `<td class="cd-num" data-label="${escape(row.name)}">` +
                              `${escape(fmt(row[metric.key], metric.format))}</td>`,
                          )
                          .join("") +
                        `</tr>`,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>

          <p class="cd-note cd-note--boxed" style="margin-top:1rem">${escape(notice.data)}</p>
        </div>
      </section>`;

  return {
    meta: {
      title: "Comparar territorios",
      canonical: "datos/comparador.html",
      description:
        "Herramienta demostrativa para comparar hasta tres departamentos de Honduras en once " +
        "indicadores educativos, con series históricas y tabla descargable.",
    },
    current: "datos",
    body,
  };
}

/* ---------------------------------------------------------- the methodology */

export function methodologyPage(ctx) {
  const body = `      ${pageHero({
    ctx,
    trail: [
      { label: "Inicio", route: "home" },
      { label: "Datos e indicadores", route: "datos" },
      { label: "Metodología" },
    ],
    label: "Metodología de datos",
    title: "Cómo se produce la información que publica el Consejo.",
    lead:
      "Fuente, validación, periodicidad, desagregaciones, limitaciones y diccionario de variables. " +
      "Una cifra sin su método es una opinión con decimales.",
  })}

      <section class="cd-section">
        <div class="cd-shell">
          <div class="cd-rows">
            ${methodology
              .map(
                (section) =>
                  `<div class="cd-row-item" id="${escape(section.id)}" data-reveal="fade">` +
                  `<p class="cd-row-item__index">${escape(section.index)}</p>` +
                  `<p class="cd-row-item__title">${escape(section.title)}</p>` +
                  `<div>${section.text
                    .split("\n\n")
                    .map((paragraph) => `<p class="cd-row-item__text">${escape(paragraph)}</p>`)
                    .join("")}</div></div>`,
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="cd-section cd-section--surface" id="diccionario">
        <div class="cd-shell">
          ${head({
            index: "07",
            label: "Diccionario de variables",
            title: "Cada variable, su tipo y su tratamiento.",
            body:
              "El diccionario forma parte de cada descarga, no de una página aparte: un archivo sin " +
              "diccionario obliga a adivinar.",
          })}
          ${table({
            columns: [
              { label: "Variable", key: "name" },
              { label: "Tipo", key: "type" },
              { label: "Unidad", key: "unit" },
              { label: "Valores admitidos", key: "values" },
              { label: "Nota", key: "note" },
            ],
            rows: dictionary.map((row) => ({
              cells: [`<code>${escape(row.name)}</code>`, row.type, row.unit, row.values, row.note],
            })),
            caption: "Diccionario de variables de los conjuntos de datos del portal.",
          })}
        </div>
      </section>

      <section class="cd-section">
        <div class="cd-shell">
          ${head({
            index: "08",
            label: "Capa de integración",
            title: "Dónde se conecta un sistema real.",
            body:
              "Esta demostración calcula sus cifras en el navegador. La arquitectura está preparada " +
              "para que cada una venga de su fuente institucional.",
          })}
          <div class="cd-rows">
            ${[
              {
                index: "01",
                title: "Registro de matrícula y centros",
                text:
                  "El módulo de estadísticas expone una sola función de consulta. Sustituirla por una " +
                  "llamada al servicio institucional de matrícula deja intactos los tableros, el mapa, " +
                  "los filtros, las tablas y las descargas.",
              },
              {
                index: "02",
                title: "Proyecciones de población",
                text:
                  "Las tasas de cobertura necesitan un denominador demográfico. La integración " +
                  "correspondiente es un servicio de proyecciones por edad simple y territorio.",
              },
              {
                index: "03",
                title: "Registro de personal docente",
                text:
                  "La relación estudiante/docente y la formación acreditada se alimentan del sistema " +
                  "de personal, no del registro escolar.",
              },
              {
                index: "04",
                title: "Gestor de contenidos",
                text:
                  "Noticias, documentos, normativa, datasets, indicadores, eventos y consultas están " +
                  "modelados como colecciones, listas para administrarse desde un CMS sin tocar código.",
              },
            ]
              .map(
                (row) =>
                  `<div class="cd-row-item" data-reveal="fade"><p class="cd-row-item__index">${row.index}</p>` +
                  `<p class="cd-row-item__title">${escape(row.title)}</p>` +
                  `<div><p class="cd-row-item__text">${escape(row.text)}</p></div></div>`,
              )
              .join("")}
          </div>
          <p class="cd-note cd-note--boxed" style="margin-top:1.5rem">${escape(notice.data)}</p>
        </div>
      </section>`;

  return {
    meta: {
      title: "Metodología de datos",
      canonical: "datos/metodologia.html",
      description:
        "Metodología del sistema de información educativa demostrativo: fuentes, validación, " +
        "periodicidad, desagregaciones, limitaciones y diccionario de variables.",
    },
    current: "datos",
    body,
  };
}

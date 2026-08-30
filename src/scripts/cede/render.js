/**
 * Redrawing a chart in the browser.
 *
 * Every chart the build emits carries a `data-chart` descriptor saying how it
 * was made. This module reads that descriptor, recomputes the numbers for the
 * filter state the reader has chosen, and calls the *same* renderer the build
 * called — so the chart after a filter change is produced by exactly the code
 * that produced the first paint. There is no second implementation to drift.
 *
 * It also redraws on resize, at the container's real pixel width, which is what
 * keeps axis labels legible on a phone instead of shrinking with a viewBox.
 */

import { byId, departments, MAP } from "../../data/cede/geography.js";
import { decimal, group } from "../../data/cede/format.js";
import {
  CURRENT_YEAR,
  YEARS,
  enrolment,
  enrolmentBy,
  levels,
  metricFor,
  rate,
  series,
  technicalEnrolment,
} from "../../data/cede/statistics.js";
import {
  barChart,
  choropleth,
  columnChart,
  dotPlot,
  legend,
  lineChart,
  stackedBar,
  stackedColumns,
} from "./charts.js";
import { table } from "./table-render.js";

/** The filter state the whole observatory shares. */
export const defaultState = () => ({
  anio: CURRENT_YEAR,
  departamento: "all",
  nivel: "all",
  sexo: "all",
  area: "all",
  administracion: "all",
  modalidad: "all",
  municipio: "all",
});

/* ----------------------------------------------------------------- scoping */

const DIMENSION_KEYS = ["sexo", "area", "administracion", "modalidad"];

/**
 * Enrolment under the full filter state.
 *
 * Year, level and territory narrow the base figure directly. The four
 * compositional dimensions are applied as the share they represent of that
 * slice, which is exact here because the data model builds them as independent
 * proportions of the same total — and it is the reason the parts of any chart
 * still add up to its own headline after four filters.
 */
export function scopedEnrolment(state, overrides = {}) {
  const query = {
    year: Number(overrides.year ?? state.anio),
    level: overrides.level ?? state.nivel,
    department: overrides.department ?? state.departamento,
  };

  let value = enrolment(query);

  for (const key of DIMENSION_KEYS) {
    const selected = overrides[key] ?? state[key];
    if (!selected || selected === "all") continue;
    const parts = enrolmentBy(key === "administracion" ? "administracion" : key, query);
    const part = parts.find((item) => item.id === selected);
    const total = parts.reduce((sum, item) => sum + item.value, 0);
    if (part && total) value = Math.round((value * part.value) / total);
  }

  return value;
}

/** The same scoping, for any metric. Rates ignore the compositional filters. */
export function scopedMetric(metric, state, overrides = {}) {
  const year = Number(overrides.year ?? state.anio);
  const department = overrides.department ?? state.departamento;

  if (metric === "matricula") return scopedEnrolment(state, overrides);
  if (metric === "tecnica") return technicalEnrolment({ year, department });
  if (["centros", "docentes", "ratio"].includes(metric)) {
    return metricFor(metric, { year, department });
  }
  return rate(metric, { year, department });
}

const isRate = (metric) => !["matricula", "centros", "docentes", "tecnica", "ratio"].includes(metric);
const formatOf = (metric) => (isRate(metric) ? "rate" : metric === "ratio" ? "decimal" : "count");
const show = (value, kind) =>
  kind === "rate" ? `${decimal(value, 1)} %` : kind === "decimal" ? decimal(value, 1) : group(value);

/* -------------------------------------------------------------- dimensions */

/** The plot's drawing width: the container, in real pixels. */
function widthOf(element) {
  const width = element.clientWidth || element.parentElement?.clientWidth || 760;
  return Math.max(280, Math.round(width));
}

/* ------------------------------------------------------------------ builds */

/**
 * One entry per chart kind. Each returns `{ svg, table, legend }` — the same
 * three pieces the build produced, so replacing them in place is enough.
 */
const BUILDERS = {
  trend(config, state, width) {
    const metric = config.metric;
    const kind = config.kindFormat ?? formatOf(metric);
    const points = YEARS.map((year) => ({
      x: year,
      y: scopedMetric(metric, state, { year }),
    }));

    return {
      svg: lineChart({
        series: [{ name: metric, points }],
        width,
        kind,
        zeroBased: kind !== "rate",
        label: `Serie ${YEARS[0]}–${CURRENT_YEAR}`,
      }),
      table: table({
        columns: [
          { label: "Año", key: "year" },
          { label: "Valor", key: "value", numeric: true },
        ],
        rows: points.map((point) => ({ cells: [String(point.x), show(point.y, kind)] })),
        caption: `Serie ${YEARS[0]}–${CURRENT_YEAR}. Datos demostrativos.`,
      }),
    };
  },

  levelsHistory(config, state, width) {
    const data = levels.map((level) => ({
      name: level.name,
      values: YEARS.map((year) => scopedEnrolment(state, { year, level: level.id })),
    }));

    return {
      svg: stackedColumns({ years: YEARS, series: data, width, label: "Matrícula por nivel" }),
      legend: legend(levels.map((level) => ({ name: level.name }))),
      table: table({
        columns: [
          { label: "Año", key: "year" },
          ...levels.map((level) => ({ label: level.name, key: level.id, numeric: true })),
          { label: "Total", key: "total", numeric: true },
        ],
        rows: YEARS.map((year, index) => ({
          cells: [
            String(year),
            ...data.map((row) => group(row.values[index])),
            group(data.reduce((sum, row) => sum + row.values[index], 0)),
          ],
        })),
        caption: "Matrícula por nivel educativo y año. Datos demostrativos.",
      }),
    };
  },

  departments(config, state, width) {
    const metric = config.metric;
    const kind = config.kindFormat ?? formatOf(metric);
    const items = departments
      .map((d) => ({
        id: d.id,
        name: d.name,
        value: scopedMetric(metric, state, { department: d.id }),
      }))
      .sort((a, b) => b.value - a.value);

    return {
      svg: barChart({
        items,
        width,
        kind,
        ramp: true,
        rowHeight: 24,
        highlight: state.departamento,
        label: "Comparación por departamento",
      }),
      table: table({
        columns: [
          { label: "Departamento", key: "name", sortable: true },
          { label: "Valor", key: "value", numeric: true, sortable: true },
        ],
        rows: items.map((item) => ({ cells: [item.name, show(item.value, kind)] })),
        caption: `Por departamento, ${state.anio}. Datos demostrativos.`,
      }),
    };
  },

  split(config, state, width) {
    const items = enrolmentBy(config.dimension, {
      year: Number(state.anio),
      level: state.nivel,
      department: state.departamento,
    });

    return {
      svg: stackedBar({ segments: items, width, label: "Composición de la matrícula" }),
      legend: legend(items),
      table: table({
        columns: [
          { label: "Categoría", key: "name" },
          { label: "Matrícula", key: "value", numeric: true },
          { label: "Participación", key: "share", numeric: true },
        ],
        rows: items.map((item) => ({
          cells: [item.name, group(item.value), `${decimal(item.share * 100, 1)} %`],
        })),
        caption: `Composición de la matrícula, ${state.anio}. Datos demostrativos.`,
      }),
    };
  },

  rates(config, state, width) {
    const data = config.metrics.map((metric) => ({
      name: metric,
      points: YEARS.map((year) => ({
        x: year,
        y: rate(metric, { year, department: state.departamento }),
      })),
    }));

    return {
      svg: lineChart({
        series: data,
        width,
        kind: "rate",
        zeroBased: config.metrics.length === 1,
        label: "Serie de indicadores",
      }),
      table: table({
        columns: [
          { label: "Año", key: "year" },
          ...config.metrics.map((metric) => ({ label: metric, key: metric, numeric: true })),
        ],
        rows: YEARS.map((year, index) => ({
          cells: [String(year), ...data.map((row) => `${decimal(row.points[index].y, 1)} %`)],
        })),
        caption: "Serie de indicadores. Datos demostrativos.",
      }),
    };
  },

  coverageGap(config, state, width) {
    const items = departments
      .map((d) => ({
        name: d.name,
        a: rate("cobertura_c12", { year: Number(state.anio), department: d.id }),
        b: rate("cobertura_med", { year: Number(state.anio), department: d.id }),
      }))
      .sort((x, y) => y.a - y.b - (x.a - x.b));

    return {
      svg: dotPlot({
        items,
        width,
        keys: ["Cobertura básica", "Cobertura media"],
        kind: "rate",
        label: "Cobertura por nivel y departamento",
      }),
      table: table({
        columns: [
          { label: "Departamento", key: "name", sortable: true },
          { label: "Cobertura básica", key: "a", numeric: true, sortable: true },
          { label: "Cobertura media", key: "b", numeric: true, sortable: true },
          { label: "Diferencia", key: "gap", numeric: true, sortable: true },
        ],
        rows: items.map((row) => ({
          cells: [
            row.name,
            `${decimal(row.a, 1)} %`,
            `${decimal(row.b, 1)} %`,
            `${decimal(row.a - row.b, 1)} pp`,
          ],
        })),
        caption: `Cobertura neta por nivel y departamento, ${state.anio}. Datos demostrativos.`,
      }),
    };
  },

  digitalGap(config, state, width) {
    const items = departments
      .map((d) => ({
        name: d.name,
        a: rate("conectividad", { year: Number(state.anio), department: d.id }),
        b: rate("brecha_digital", { year: Number(state.anio), department: d.id }),
      }))
      .sort((x, y) => y.b - x.b);

    return {
      svg: dotPlot({
        items,
        width,
        keys: ["Centros conectados", "Hogares sin conexión"],
        kind: "rate",
        label: "Conectividad y brecha digital",
      }),
      table: table({
        columns: [
          { label: "Departamento", key: "name", sortable: true },
          { label: "Centros conectados", key: "a", numeric: true, sortable: true },
          { label: "Hogares sin conexión", key: "b", numeric: true, sortable: true },
        ],
        rows: items.map((row) => ({
          cells: [row.name, `${decimal(row.a, 1)} %`, `${decimal(row.b, 1)} %`],
        })),
        caption: `Brecha digital por departamento, ${state.anio}. Datos demostrativos.`,
      }),
    };
  },

  compareTrend(config, state, width) {
    const selection = state.compare ?? ["fm", "cr", "cm"];
    const metric = config.metric;
    const kind = config.kindFormat ?? formatOf(metric);

    const data = selection.map((id) => ({
      name: byId[id].name,
      points: YEARS.map((year) => ({
        x: year,
        y: isRate(metric)
          ? rate(metric, { year, department: id })
          : metricFor(metric, { year, department: id }),
      })),
    }));

    return {
      svg: lineChart({
        series: data,
        width,
        kind,
        zeroBased: kind !== "rate",
        label: "Comparación de territorios",
      }),
      legend: legend(data),
      table: table({
        columns: [
          { label: "Año", key: "year" },
          ...data.map((row) => ({ label: row.name, key: row.name, numeric: true })),
        ],
        rows: YEARS.map((year, index) => ({
          cells: [String(year), ...data.map((row) => show(row.points[index].y, kind))],
        })),
        caption: "Comparación de territorios. Datos demostrativos.",
      }),
    };
  },

  /* The static kinds carry their own data in the descriptor: they do not answer
     to the filters (a catalogue of professional families has no year), but they
     still redraw at the container's width so their labels stay readable. */
  staticBars(config, state, width) {
    return {
      svg: barChart({
        items: config.items,
        width,
        kind: config.kindFormat ?? "count",
        ramp: true,
        rowHeight: 30,
        label: "Comparación",
      }),
    };
  },

  staticColumns(config, state, width) {
    return { svg: columnChart({ items: config.items, width, height: 260, label: "Distribución" }) };
  },

  staticStack(config, state, width) {
    return { svg: stackedBar({ segments: config.items, width, label: "Composición" }) };
  },

  staticLines(config, state, width) {
    return {
      svg: lineChart({
        series: config.series,
        width,
        kind: config.kindFormat ?? "count",
        zeroBased: false,
        label: "Serie",
      }),
    };
  },

  /* Kinds the build emits that need no rebuild beyond their own width. */
  line(config, state, width) {
    return BUILDERS.trend({ metric: config.metric ?? "matricula" }, state, width);
  },

  column(config, state, width) {
    const items = levels.map((level) => ({
      id: level.id,
      name: level.name,
      value: scopedEnrolment(state, { level: level.id }),
    }));
    return {
      svg: columnChart({ items, width, height: 260, label: "Matrícula por nivel" }),
      table: table({
        columns: [
          { label: "Nivel", key: "name" },
          { label: "Matrícula", key: "value", numeric: true },
        ],
        rows: items.map((item) => ({ cells: [item.name, group(item.value)] })),
        caption: `Matrícula por nivel, ${state.anio}. Datos demostrativos.`,
      }),
    };
  },

  stacked(config, state, width) {
    return BUILDERS.split({ dimension: config.dimension }, state, width);
  },
};

/* ------------------------------------------------------------------ render */

/** Redraw one chart. Returns false when the descriptor is not one we rebuild. */
export function renderChart(plot, state) {
  let config;
  try {
    config = JSON.parse(plot.dataset.chart);
  } catch {
    return false;
  }

  const builder = BUILDERS[config.kind ?? config.type];
  if (!builder) return false;

  const result = builder(config, state, widthOf(plot));
  if (!result?.svg) return false;

  plot.innerHTML = result.svg;

  const figure = plot.closest("figure");
  if (!figure) return true;

  if (result.legend) {
    const existing = figure.querySelector(".cd-legend");
    if (existing) existing.outerHTML = result.legend;
  }

  if (result.table) {
    const wrap = figure.querySelector(".cd-datatable__wrap");
    if (wrap) wrap.innerHTML = result.table;
  }

  return true;
}

/** Redraw every chart under `root`. */
export function renderAll(root, state) {
  for (const plot of root.querySelectorAll("[data-chart]")) renderChart(plot, state);
}

/* -------------------------------------------------------------------- map */

/** Repaint a choropleth for the current metric and year. */
export function renderMap(frame, state) {
  const metric = frame.dataset.mapMetric ?? "matricula";
  const kind = frame.dataset.mapKind ?? "count";

  const values = Object.fromEntries(
    departments.map((d) => [d.id, scopedMetric(metric, state, { department: d.id })]),
  );

  const map = choropleth({
    departments,
    values,
    map: MAP,
    kind,
    metricName: frame.dataset.mapName ?? "Valor",
    selected: state.departamento === "all" ? null : state.departamento,
  });

  frame.innerHTML = map.svg;

  const legendBox = frame.parentElement?.querySelector(".cd-maplegend");
  if (legendBox) legendBox.outerHTML = map.legend;
}

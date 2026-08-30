/**
 * The chart renderers.
 *
 * PURE. Every function here takes data and returns a string of SVG. There is no
 * DOM access, no measurement, no state — which is what lets the same code run
 * in two places: `tools/build-cede.mjs` calls it in Node to put real charts in
 * the HTML a visitor downloads, and the browser calls it again with the
 * container's measured width when a filter changes or the window resizes. One
 * implementation, so the chart cannot disagree with itself.
 *
 * Colour never appears in this file. Marks carry classes (`cd-c1`, `cd-step-3`)
 * and `cede/charts.css` decides what they look like, so the high-contrast theme
 * restyles every chart in the portal without re-rendering one.
 *
 * The specs are fixed across the portal: 2px lines, markers of r>=4 with a 2px
 * surface ring, bars capped at 24px with a rounded data-end, hairline solid
 * gridlines, area fills as a wash, and a legend whenever there is more than one
 * series. Values a mark cannot show are never gated behind a tooltip — every
 * chart is emitted next to its own data table by the block that wraps it.
 */

import { decimal, group } from "../../data/cede/format.js";

/* ------------------------------------------------------------------ util */

const esc = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Coordinates are rounded: three decimals of a pixel is noise in the payload. */
const n = (value) => Math.round(value * 100) / 100;

/**
 * A "nice" axis maximum — 2,381,500 becomes 2,500,000, not 2,381,500.
 *
 * Readers reconstruct values from gridlines, and they can only do that when the
 * gridlines land on numbers a person would say out loud.
 */
export function niceMax(value, ticks = 4) {
  if (value <= 0) return 1;
  const rough = value / ticks;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].find((candidate) => candidate * magnitude >= rough) ?? 10;
  return step * magnitude * ticks;
}

const ticksOf = (max, count) => Array.from({ length: count + 1 }, (_, i) => (max / count) * i);

/** Axis tick text: thousands for big counts, one decimal for rates. */
const tickLabel = (value, kind) => {
  if (kind === "rate") return decimal(value, value % 1 === 0 ? 0 : 1);
  if (value >= 1_000_000) return `${decimal(value / 1_000_000, value % 1_000_000 === 0 ? 0 : 1)} M`;
  if (value >= 1000) return `${group(value / 1000)} mil`;
  return group(value);
};

/**
 * The frame every plot shares.
 *
 * Padding is asymmetric on purpose: the left gutter holds y-axis numbers, the
 * bottom holds the year, and the right only needs room for the last label not
 * to be cut off.
 */
function frame(width, height, { left = 54, right = 16, top = 16, bottom = 30 } = {}) {
  return {
    width,
    height,
    left,
    right,
    top,
    bottom,
    plotWidth: width - left - right,
    plotHeight: height - top - bottom,
  };
}

const svgOpen = (f, label, extra = "") =>
  `<svg class="cd-chart__svg" viewBox="0 0 ${f.width} ${f.height}" width="${f.width}" height="${f.height}" ` +
  `role="img" aria-label="${esc(label)}" ${extra}>`;

/** Gridlines plus the y-axis numbers that make them readable. */
function grid(f, max, count, kind) {
  return ticksOf(max, count)
    .map((value) => {
      const y = n(f.top + f.plotHeight - (value / max) * f.plotHeight);
      return (
        `<line class="cd-grid" x1="${f.left}" y1="${y}" x2="${n(f.left + f.plotWidth)}" y2="${y}"/>` +
        `<text class="cd-axis cd-axis--y" x="${f.left - 10}" y="${y}" dy="0.32em" text-anchor="end">` +
        `${esc(tickLabel(value, kind))}</text>`
      );
    })
    .join("");
}

/**
 * Category labels along the bottom.
 *
 * On a narrow chart every other label is dropped rather than rotated: rotated
 * axis text is the first thing that makes a chart look like a spreadsheet.
 */
function xLabels(f, labels, positions) {
  const every = f.plotWidth / labels.length < 46 ? 2 : 1;
  return labels
    .map((label, index) =>
      index % every !== 0 && index !== labels.length - 1
        ? ""
        : `<text class="cd-axis" x="${n(positions[index])}" y="${n(f.top + f.plotHeight + 20)}" ` +
          `text-anchor="middle">${esc(label)}</text>`,
    )
    .join("");
}

/** The identity channel that is never colour alone. */
export function legend(items) {
  return (
    `<ul class="cd-legend">` +
    items
      .map(
        (item, index) =>
          `<li class="cd-legend__item"><span class="cd-legend__key cd-c${item.slot ?? index + 1}"></span>` +
          `${esc(item.name)}</li>`,
      )
      .join("") +
    `</ul>`
  );
}

/* ------------------------------------------------------------ line chart */

/**
 * Trend over time. One to three series.
 *
 * The last point of every series carries a marker and a direct label, which is
 * where a reader looks first in a time series; the rest are left to the grid,
 * the tooltip and the table.
 */
export function lineChart({
  series,
  width = 760,
  height = 300,
  kind = "count",
  label = "Serie histórica",
  zeroBased = true,
  labelLast = true,
}) {
  const f = frame(width, height, { right: labelLast ? 62 : 16 });
  const years = series[0].points.map((point) => point.x);
  const values = series.flatMap((s) => s.points.map((point) => point.y));
  const max = niceMax(Math.max(...values), 4);
  const min = zeroBased ? 0 : Math.min(...values) * 0.94;

  const x = (index) => f.left + (f.plotWidth * index) / Math.max(1, years.length - 1);
  const y = (value) => f.top + f.plotHeight - ((value - min) / (max - min)) * f.plotHeight;

  const body = series
    .map((s, slot) => {
      const points = s.points.map((point, index) => [x(index), y(point.y)]);
      const path = points.map(([px, py], i) => `${i ? "L" : "M"}${n(px)} ${n(py)}`).join("");
      const single = series.length === 1;
      const area = single
        ? `<path class="cd-area cd-f${slot + 1}" d="${path}L${n(x(years.length - 1))} ${n(
            f.top + f.plotHeight,
          )}L${n(f.left)} ${n(f.top + f.plotHeight)}Z"/>`
        : "";

      const dots = points
        .map(
          ([px, py], index) =>
            `<circle class="cd-dot cd-c${slot + 1}" cx="${n(px)}" cy="${n(py)}" r="${
              index === points.length - 1 ? 4.5 : 3.5
            }" data-tip="${esc(`${s.name} · ${years[index]}: ${valueText(s.points[index].y, kind)}`)}"/>`,
        )
        .join("");

      const last = s.points[s.points.length - 1];
      const endLabel = labelLast
        ? `<text class="cd-endlabel" x="${n(x(years.length - 1) + 10)}" y="${n(y(last.y))}" dy="0.32em">` +
          `${esc(valueText(last.y, kind))}</text>`
        : "";

      return `${area}<path class="cd-line cd-s${slot + 1}" d="${path}"/>${dots}${endLabel}`;
    })
    .join("");

  return (
    svgOpen(f, label) +
    grid(f, max, 4, kind) +
    body +
    xLabels(f, years.map(String), years.map((_, index) => x(index))) +
    `</svg>`
  );
}

const valueText = (value, kind) =>
  kind === "rate" ? `${decimal(value, 1)} %` : kind === "decimal" ? decimal(value, 1) : group(value);

/* ------------------------------------------------------------ bar charts */

/**
 * Horizontal bars — the right form when the categories have long names, which
 * in a territorial portal they always do.
 */
export function barChart({
  items,
  width = 760,
  rowHeight = 26,
  kind = "count",
  label = "Comparación",
  highlight = null,
  ramp = false,
}) {
  const left = 152;
  const right = 68;
  const height = items.length * rowHeight + 12;
  const max = niceMax(Math.max(...items.map((item) => item.value)), 4);
  const plotWidth = width - left - right;
  const barHeight = Math.min(16, rowHeight - 10);
  const steps = 5;

  const rows = items
    .map((item, index) => {
      const y = 6 + index * rowHeight;
      const w = Math.max(1.5, (item.value / max) * plotWidth);
      const step = ramp ? Math.min(steps - 1, Math.floor((item.value / max) * steps)) : null;
      const className = ramp ? `cd-step-${step}` : highlight === item.id ? "cd-c1" : "cd-c1 cd-bar--muted";

      return (
        `<g class="cd-row" data-id="${esc(item.id ?? "")}">` +
        `<text class="cd-axis cd-axis--cat" x="${left - 12}" y="${n(y + barHeight / 2)}" dy="0.32em" ` +
        `text-anchor="end">${esc(item.name)}</text>` +
        `<rect class="cd-bar ${className}" x="${left}" y="${y}" width="${n(w)}" height="${barHeight}" rx="2" ` +
        `data-tip="${esc(`${item.name}: ${valueText(item.value, kind)}`)}"/>` +
        `<text class="cd-value" x="${n(left + w + 8)}" y="${n(y + barHeight / 2)}" dy="0.32em">` +
        `${esc(valueText(item.value, kind))}</text>` +
        `</g>`
      );
    })
    .join("");

  return (
    `<svg class="cd-chart__svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" ` +
    `role="img" aria-label="${esc(label)}">${rows}</svg>`
  );
}

/**
 * Columns, for a small ordered set — levels, years, families.
 *
 * The cap on bar width is deliberate: a bar that fills its slot reads as a
 * block of colour, and the eye stops seeing the value.
 */
export function columnChart({ items, width = 760, height = 280, kind = "count", label = "Distribución" }) {
  const f = frame(width, height, { bottom: 44 });
  const max = niceMax(Math.max(...items.map((item) => item.value)), 4);
  const slot = f.plotWidth / items.length;
  const barWidth = Math.min(48, slot * 0.52);

  const columns = items
    .map((item, index) => {
      const cx = f.left + slot * index + slot / 2;
      const h = Math.max(2, (item.value / max) * f.plotHeight);
      const y = f.top + f.plotHeight - h;
      return (
        `<g class="cd-row">` +
        `<rect class="cd-bar cd-c${(index % 3) + 1}" x="${n(cx - barWidth / 2)}" y="${n(y)}" ` +
        `width="${n(barWidth)}" height="${n(h)}" rx="3" ` +
        `data-tip="${esc(`${item.name}: ${valueText(item.value, kind)}`)}"/>` +
        `<text class="cd-value" x="${n(cx)}" y="${n(y - 8)}" text-anchor="middle">` +
        `${esc(valueText(item.value, kind))}</text>` +
        `<text class="cd-axis" x="${n(cx)}" y="${n(f.top + f.plotHeight + 20)}" text-anchor="middle">` +
        `${esc(item.name)}</text></g>`
      );
    })
    .join("");

  return svgOpen(f, label) + grid(f, max, 4, kind) + columns + `</svg>`;
}

/**
 * A part-to-whole bar.
 *
 * Segments are separated by a 2px gap in the surface colour rather than by a
 * stroke: the gap is what makes two adjacent steps read as distinct without
 * adding ink that is not data.
 */
export function stackedBar({ segments, width = 760, height = 56, label = "Composición", showLabels = true }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const gap = 2;
  const usable = width - gap * (segments.length - 1);
  let x = 0;

  const parts = segments
    .map((segment, index) => {
      const w = (segment.value / total) * usable;
      const share = (segment.value / total) * 100;
      const rect =
        `<rect class="cd-seg cd-c${index + 1}" x="${n(x)}" y="0" width="${n(w)}" height="28" rx="2" ` +
        `data-tip="${esc(`${segment.name}: ${group(segment.value)} · ${decimal(share, 1)} %`)}"/>` +
        /* A label only goes inside the segment when it demonstrably fits. */
        (showLabels && w > 62
          ? `<text class="cd-seg__label" x="${n(x + w / 2)}" y="14" dy="0.32em" text-anchor="middle">` +
            `${esc(decimal(share, 1))} %</text>`
          : "");

      const legendText =
        showLabels && w > 62
          ? `<text class="cd-seg__name" x="${n(x)}" y="46">${esc(segment.name)}</text>`
          : "";

      x += w + gap;
      return rect + legendText;
    })
    .join("");

  return (
    `<svg class="cd-chart__svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" ` +
    `role="img" aria-label="${esc(label)}">${parts}</svg>`
  );
}

/**
 * Grouped columns over time — a stacked history without the stack.
 *
 * Used where the composition matters as much as the total: enrolment by level
 * across eight years.
 */
export function stackedColumns({ years, series, width = 760, height = 300, label = "Serie por componente" }) {
  const f = frame(width, height, { bottom: 34 });
  const totals = years.map((_, index) => series.reduce((sum, s) => sum + s.values[index], 0));
  const max = niceMax(Math.max(...totals), 4);
  const slot = f.plotWidth / years.length;
  const barWidth = Math.min(38, slot * 0.56);
  const gap = 2;

  const columns = years
    .map((year, index) => {
      const cx = f.left + slot * index + slot / 2;
      let y = f.top + f.plotHeight;

      const parts = series
        .map((s, slotIndex) => {
          const h = (s.values[index] / max) * f.plotHeight - gap;
          y -= h + gap;
          return (
            `<rect class="cd-seg cd-c${slotIndex + 1}" x="${n(cx - barWidth / 2)}" y="${n(y)}" ` +
            `width="${n(barWidth)}" height="${n(Math.max(1, h))}" rx="${slotIndex === series.length - 1 ? 3 : 0}" ` +
            `data-tip="${esc(`${s.name} · ${year}: ${group(s.values[index])}`)}"/>`
          );
        })
        .join("");

      return (
        parts +
        `<text class="cd-axis" x="${n(cx)}" y="${n(f.top + f.plotHeight + 20)}" text-anchor="middle">` +
        `${esc(year)}</text>`
      );
    })
    .join("");

  return svgOpen(f, label) + grid(f, max, 4, "count") + columns + `</svg>`;
}

/**
 * A dot plot — two values per row, joined by a rule.
 *
 * The honest form for a gap: the distance between the dots *is* the gap, and it
 * survives being read in grayscale.
 */
export function dotPlot({ items, width = 760, rowHeight = 30, kind = "rate", label = "Comparación", keys }) {
  const left = 152;
  const right = 56;
  const height = items.length * rowHeight + 14;
  const values = items.flatMap((item) => [item.a, item.b]);
  const max = niceMax(Math.max(...values), 4);
  const plotWidth = width - left - right;
  const x = (value) => left + (value / max) * plotWidth;

  const rows = items
    .map((item, index) => {
      const y = 10 + index * rowHeight;
      return (
        `<g class="cd-row">` +
        `<text class="cd-axis cd-axis--cat" x="${left - 12}" y="${n(y)}" dy="0.32em" text-anchor="end">` +
        `${esc(item.name)}</text>` +
        `<line class="cd-connector" x1="${n(x(item.a))}" y1="${n(y)}" x2="${n(x(item.b))}" y2="${n(y)}"/>` +
        `<circle class="cd-dot cd-c1" cx="${n(x(item.a))}" cy="${n(y)}" r="5" ` +
        `data-tip="${esc(`${item.name} · ${keys[0]}: ${valueText(item.a, kind)}`)}"/>` +
        `<circle class="cd-dot cd-c2" cx="${n(x(item.b))}" cy="${n(y)}" r="5" ` +
        `data-tip="${esc(`${item.name} · ${keys[1]}: ${valueText(item.b, kind)}`)}"/>` +
        `</g>`
      );
    })
    .join("");

  const axis = ticksOf(max, 4)
    .map(
      (value) =>
        `<line class="cd-grid" x1="${n(x(value))}" y1="4" x2="${n(x(value))}" y2="${height - 16}"/>` +
        `<text class="cd-axis" x="${n(x(value))}" y="${height - 2}" text-anchor="middle">` +
        `${esc(tickLabel(value, kind))}</text>`,
    )
    .join("");

  return (
    `<svg class="cd-chart__svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" ` +
    `role="img" aria-label="${esc(label)}">${axis}${rows}</svg>`
  );
}

/**
 * A sparkline — the trend a stat tile carries, with no axis and no promise of
 * precision. The exact figures live in the tile and in the table.
 */
export function sparkline({ points, width = 108, height = 30 }) {
  const values = points.map((point) => point.y);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (index) => (width * index) / Math.max(1, points.length - 1);
  const y = (value) => height - 3 - ((value - min) / span) * (height - 8);
  const path = points.map((point, index) => `${index ? "L" : "M"}${n(x(index))} ${n(y(point.y))}`).join("");

  return (
    `<svg class="cd-spark" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" ` +
    `aria-hidden="true" focusable="false"><path class="cd-spark__line" d="${path}"/>` +
    `<circle class="cd-spark__end" cx="${n(x(points.length - 1))}" cy="${n(y(values[values.length - 1]))}" r="2.6"/></svg>`
  );
}

/** A meter: one ratio against its limit, on the same ramp as everything else. */
export function meter({ value, max = 100, label = "" }) {
  const share = Math.max(0, Math.min(1, value / max));
  return (
    `<span class="cd-meter" role="img" aria-label="${esc(label || `${decimal(value, 1)} de ${max}`)}">` +
    `<span class="cd-meter__fill" style="width:${n(share * 100)}%"></span></span>`
  );
}

/* -------------------------------------------------------------------- map */

/**
 * The choropleth.
 *
 * Five classes on one hue, light to dark, with the light end still clearing the
 * page behind it. Colour is never the only channel: every department is a
 * focusable, labelled shape whose exact value is announced to a screen reader
 * and printed in the table under the map.
 */
export function choropleth({
  departments,
  values,
  map,
  kind = "count",
  metricName = "Matrícula",
  selected = null,
  labels = true,
}) {
  const numbers = departments.map((d) => values[d.id]).filter((value) => typeof value === "number");
  const max = Math.max(...numbers);
  const min = Math.min(...numbers);
  const span = max - min || 1;
  const steps = 5;
  const stepOf = (value) => Math.min(steps - 1, Math.floor(((value - min) / span) * steps));

  const shapes = departments
    .map((d) => {
      const value = values[d.id];
      const step = typeof value === "number" ? stepOf(value) : null;
      const readable = `${d.name}: ${valueText(value, kind)}`;
      return (
        `<path class="cd-map__dep cd-step-${step ?? "none"}${selected === d.id ? " is-selected" : ""}" ` +
        `d="${d.path}" data-dep="${d.id}" data-name="${esc(d.name)}" ` +
        `data-value="${esc(valueText(value, kind))}" data-tip="${esc(readable)}" ` +
        `tabindex="0" role="button" aria-label="${esc(`${readable}. Ver detalle de ${d.name}`)}"/>`
      );
    })
    .join("");

  /* Only the departments with room get a label drawn on them; the rest are
     named on hover, on focus and in the table. A label that does not fit its
     own shape is worse than no label. */
  const names = labels
    ? departments
        .filter((d) => !["ib", "va", "oc", "cp", "lp", "at"].includes(d.id))
        .map(
          (d) =>
            `<text class="cd-map__label" x="${d.label.x}" y="${d.label.y}" text-anchor="middle" ` +
            `aria-hidden="true">${esc(d.name)}</text>`,
        )
        .join("")
    : "";

  const legendSteps = Array.from({ length: steps }, (_, index) => {
    const from = min + (span / steps) * index;
    const to = index === steps - 1 ? max : min + (span / steps) * (index + 1);
    return (
      `<li class="cd-maplegend__item"><span class="cd-maplegend__key cd-step-${index}"></span>` +
      `<span class="cd-maplegend__range">${esc(tickLabel(Math.round(from), kind))}–${esc(
        tickLabel(Math.round(to), kind),
      )}</span></li>`
    );
  }).join("");

  return {
    svg:
      `<svg class="cd-map__svg" viewBox="0 0 ${map.width} ${map.height}" ` +
      `role="group" aria-label="${esc(`Mapa de Honduras por departamento · ${metricName}`)}">` +
      `${shapes}${names}</svg>`,
    legend:
      `<div class="cd-maplegend"><p class="cd-maplegend__title">${esc(metricName)}</p>` +
      `<ul class="cd-maplegend__scale">${legendSteps}</ul></div>`,
  };
}

/* --------------------------------------------------------- small multiples */

/**
 * Small multiples: the same tiny chart repeated, one per category.
 *
 * The form for "how did each of these move", which a single chart with eight
 * lines cannot answer. Each panel shares the scale of the whole set, so the
 * panels are comparable to each other and not just to themselves.
 */
export function smallMultiples({ panels, width = 200, height = 96, kind = "rate" }) {
  const all = panels.flatMap((panel) => panel.points.map((point) => point.y));
  const max = niceMax(Math.max(...all), 2);

  return panels
    .map((panel) => {
      const x = (index) => 4 + ((width - 8) * index) / Math.max(1, panel.points.length - 1);
      const y = (value) => height - 22 - (value / max) * (height - 34);
      const path = panel.points.map((point, index) => `${index ? "L" : "M"}${n(x(index))} ${n(y(point.y))}`).join("");
      const last = panel.points[panel.points.length - 1];

      return (
        `<figure class="cd-multiple">` +
        `<figcaption class="cd-multiple__title">${esc(panel.name)}</figcaption>` +
        `<svg class="cd-multiple__svg" viewBox="0 0 ${width} ${height}" role="img" ` +
        `aria-label="${esc(`${panel.name}: ${valueText(last.y, kind)} en ${last.x}`)}">` +
        `<line class="cd-grid" x1="4" y1="${height - 22}" x2="${width - 4}" y2="${height - 22}"/>` +
        `<path class="cd-area cd-f1" d="${path}L${n(x(panel.points.length - 1))} ${height - 22}L4 ${height - 22}Z"/>` +
        `<path class="cd-line cd-s1" d="${path}"/>` +
        `<circle class="cd-dot cd-c1" cx="${n(x(panel.points.length - 1))}" cy="${n(y(last.y))}" r="3.5"/>` +
        `</svg>` +
        `<p class="cd-multiple__value">${esc(valueText(last.y, kind))}</p>` +
        `</figure>`
      );
    })
    .join("");
}

/* ------------------------------------------------------------ the network */

/**
 * The system drawn as a network.
 *
 * A ring of actors around a convening centre, with a line from each to the
 * middle. It is a diagram of *relationship*, not of hierarchy, which is why
 * there is no top and no boxes-inside-boxes: an org chart would say something
 * about this institution that is not true.
 */
export function networkDiagram({ center, nodes, width = 720, height = 520 }) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 78;

  const positioned = nodes.map((node, index) => {
    const angle = (Math.PI * 2 * index) / nodes.length - Math.PI / 2;
    return { ...node, x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, angle };
  });

  const links = positioned
    .map(
      (node) =>
        `<line class="cd-net__link" x1="${n(cx)}" y1="${n(cy)}" x2="${n(node.x)}" y2="${n(node.y)}" ` +
        `data-link="${node.id}"/>`,
    )
    .join("");

  const marks = positioned
    .map(
      (node) =>
        `<g class="cd-net__node" data-node="${node.id}" tabindex="0" role="button" ` +
        `aria-label="${esc(`${node.label}. ${node.contributes}`)}" ` +
        `data-tip="${esc(`${node.label} · ${node.contributes}`)}">` +
        `<circle class="cd-net__ring" cx="${n(node.x)}" cy="${n(node.y)}" r="30"/>` +
        `<text class="cd-net__label" x="${n(node.x)}" y="${n(node.y + (node.y < cy ? -42 : 48))}" ` +
        `text-anchor="middle">${esc(node.label)}</text></g>`,
    )
    .join("");

  /* The hub's name is set on two balanced lines. A single line of a real
     institution's name does not fit inside a circle, and text that spills past
     its own disc reads as a rendering bug rather than as a diagram. */
  const words = center.label.split(" ");
  const split = words.length < 2 ? [center.label] : balance(words);
  const lines = split
    .map(
      (line, index) =>
        `<text class="cd-net__hub-label" x="${n(cx)}" y="${n(cy - 10 + index * 19)}" ` +
        `text-anchor="middle">${esc(line)}</text>`,
    )
    .join("");

  return (
    `<svg class="cd-net" viewBox="0 0 ${width} ${height}" role="group" ` +
    `aria-label="Diagrama del sistema educativo como una red de actores">` +
    links +
    `<g class="cd-net__center"><circle class="cd-net__hub" cx="${n(cx)}" cy="${n(cy)}" r="72"/>` +
    lines +
    `<text class="cd-net__hub-sub" x="${n(cx)}" y="${n(cy + 34)}" text-anchor="middle">${esc(center.sub)}</text></g>` +
    marks +
    `</svg>`
  );
}

/** Break a list of words into the two most even lines. */
function balance(words) {
  const total = words.join(" ").length;
  let best = 1;
  let bestGap = Infinity;

  for (let i = 1; i < words.length; i++) {
    const left = words.slice(0, i).join(" ").length;
    const gap = Math.abs(total - left - left);
    if (gap < bestGap) {
      bestGap = gap;
      best = i;
    }
  }

  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

/* -------------------------------------------------------------- dot field */

/**
 * The hero's cartographic texture.
 *
 * A dot for every sampled point inside the country, laid on a lattice and
 * clipped to the real outline. It reads as a map without pretending to carry a
 * value, which is exactly what a hero should do: set the subject, not report.
 */
export function dotField({ map, step = 13 }) {
  const dots = [];
  for (let y = step; y < map.height; y += step) {
    for (let x = step; x < map.width; x += step) {
      /* Offset every other row: a square lattice reads as a screen door. */
      const offset = (Math.round(y / step) % 2) * (step / 2);
      dots.push(`<circle cx="${n(x + offset)}" cy="${y}" r="1.5"/>`);
    }
  }
  return dots.join("");
}

/**
 * The pieces every CEDE page is assembled from.
 *
 * One renderer per component of the brief — section head, figure row, chart
 * block, data table, status pill, card, listing, timeline — so a zone is
 * described by the data it receives and never by markup copied between pages.
 *
 * `ctx` carries how deep in the tree the page being written lives, which is all
 * a renderer needs to emit a correct relative link from anywhere in the portal.
 */

import { escape, group, byFormat } from "../../src/data/cede/format.js";
import { routes } from "../../src/data/cede/institution.js";
import { SOURCE } from "../../src/data/cede/statistics.js";

export { escape };

/* ------------------------------------------------------------------- links */

/** Build a context for a page `depth` directories below `demos/cede/`. */
export const context = (depth = 0) => ({ depth, up: "../".repeat(depth) });

/** A file outside the demo — the shared bundle, a font, the portfolio itself. */
export const asset = (ctx, file) => `${ctx.up}../../${file}`;

/** A page of the portal, by its key in `routes`. */
export function page(ctx, route, hash) {
  const target = routes[route];
  if (!target) throw new Error(`unknown route: ${route}`);
  return `${ctx.up}${target}${hash ? `#${hash}` : ""}`;
}

/** A detail page: `sub(ctx, "noticias", "slug")`. */
export const sub = (ctx, dir, slug) => `${ctx.up}${dir}/${slug}.html`;

/** Resolve whatever shape a data file used to point somewhere. */
export function href(ctx, item) {
  if (item.href) return item.href;
  if (item.dir && item.slug) return sub(ctx, item.dir, item.slug);
  if (item.route) return page(ctx, item.route, item.hash);
  if (item.hash) return `#${item.hash}`;
  return "#";
}

/* ------------------------------------------------------------------- icons */

/**
 * The icon set.
 *
 * Line icons at a single weight, drawn on a 16-unit grid. They are always
 * accompanied by a word — an icon on its own is not a label — so they are all
 * `aria-hidden`.
 */
const PATHS = {
  arrow: '<path d="M2 8h11M9.5 4.5 13 8l-3.5 3.5"/>',
  arrowUp: '<path d="M8 13V3M4 7l4-4 4 4"/>',
  arrowDown: '<path d="M8 3v10M4 9l4 4 4-4"/>',
  check: '<path d="m3 8.5 3.2 3.2L13 5"/>',
  alert: '<path d="M8 2.5 14.5 13.5h-13z"/><path d="M8 6.5v3M8 11.6v.1"/>',
  clock: '<circle cx="8" cy="8" r="6"/><path d="M8 4.6V8l2.4 1.6"/>',
  open: '<circle cx="8" cy="8" r="6"/><path d="M8 5v6M5 8h6"/>',
  closed: '<circle cx="8" cy="8" r="6"/><path d="M5.5 8h5"/>',
  edit: '<path d="M11.2 2.8 13.2 4.8 5.5 12.5 2.8 13.2l.7-2.7z"/>',
  search: '<circle cx="7.2" cy="7.2" r="4.4"/><path d="m10.6 10.6 3 3"/>',
  download: '<path d="M8 2.5v8M4.8 7.6 8 10.8l3.2-3.2M2.8 13.2h10.4"/>',
  external: '<path d="M6.5 3.2H3.2v9.6h9.6V9.5"/><path d="M9.6 3.2h3.2v3.2M12.8 3.2 7.6 8.4"/>',
  doc: '<path d="M4 2.2h5l3 3v8.6H4z"/><path d="M9 2.2v3h3"/>',
  map: '<path d="M2.6 4.2 6 2.8l4 1.4 3.4-1.4v9L10 13.2 6 11.8l-3.4 1.4z"/><path d="M6 2.8v9M10 4.2v9"/>',
  chart: '<path d="M2.8 13.2h10.4"/><path d="M4.6 13.2V8M7.6 13.2V4.4M10.6 13.2v-4"/>',
  data: '<ellipse cx="8" cy="4.2" rx="5" ry="2"/><path d="M3 4.2v7.6c0 1.1 2.2 2 5 2s5-.9 5-2V4.2"/><path d="M3 8c0 1.1 2.2 2 5 2s5-.9 5-2"/>',
  people: '<circle cx="6" cy="5.6" r="2.4"/><path d="M2 13.2c0-2.2 1.8-4 4-4s4 1.8 4 4"/><path d="M11 4c1.3.3 2.2 1.4 2.2 2.7 0 .9-.4 1.7-1 2.2M11.4 9.6c1.6.5 2.6 1.9 2.6 3.6"/>',
  book: '<path d="M2.8 3.2h4c1 0 1.6.6 1.6 1.6v8c0-.8-.6-1.4-1.6-1.4h-4z"/><path d="M13.2 3.2h-4c-1 0-1.6.6-1.6 1.6v8c0-.8.6-1.4 1.6-1.4h4z"/>',
  scale: '<path d="M8 2.4v11M4 5.2h8M4.4 5.2 2.4 9.6h4zM11.6 5.2l-2 4.4h4z"/><path d="M4.5 13.2h7"/>',
  bolt: '<path d="M9 2 4 9h3.4l-.8 5 5-7H8.2z"/>',
  drop: '<path d="M8 2.2 4.6 6.6a4.4 4.4 0 1 0 6.8 0z"/>',
  signal: '<path d="M2.4 6.4a8 8 0 0 1 11.2 0M4.8 8.9a4.6 4.6 0 0 1 6.4 0"/><circle cx="8" cy="11.8" r="1"/>',
  flask: '<path d="M6.4 2.4v3.8L2.9 12a1.4 1.4 0 0 0 1.2 2.1h7.8A1.4 1.4 0 0 0 13.1 12L9.6 6.2V2.4"/><path d="M5.6 2.4h4.8"/>',
  access: '<circle cx="8" cy="3.6" r="1.4"/><path d="M4 6h8M8 6v4M8 10l-2.2 3.4M8 10l2.2 3.4"/>',
  filter: '<path d="M2.8 3.6h10.4l-4 4.8v4l-2.4 1.2v-5.2z"/>',
  print: '<path d="M4.6 6V2.8h6.8V6"/><path d="M4.6 12h-2V6.8h10.8V12h-2"/><path d="M4.6 9.6h6.8v3.6H4.6z"/>',
};

export const icon = (name, className = "") =>
  `<svg class="cd-icon${className ? ` ${className}` : ""}" width="16" height="16" viewBox="0 0 16 16" ` +
  `aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.4" ` +
  `stroke-linecap="round" stroke-linejoin="round">${PATHS[name] ?? PATHS.arrow}</svg>`;

/* ----------------------------------------------------------------- controls */

export function button(label, target, { solid, ghost, className = "", small, icon: withIcon } = {}) {
  const kind = solid ? " cd-btn--solid" : ghost ? " cd-btn--ghost" : "";
  return (
    `<a class="cd-btn${kind}${small ? " cd-btn--small" : ""}${className ? ` ${className}` : ""}" ` +
    `href="${escape(target)}">${escape(label)}${withIcon ? icon(withIcon) : ""}</a>`
  );
}

export const arrowLink = (label, target) =>
  `<a class="cd-link" href="${escape(target)}">${escape(label)}` +
  `<svg class="cd-link__arrow" width="14" height="10" viewBox="0 0 14 10" aria-hidden="true" ` +
  `focusable="false" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 5h12M8.5 1.5 12 5l-3.5 3.5"/></svg></a>`;

/* --------------------------------------------------------------- section head */

/** Index, label, rule, title — and optionally a paragraph set beside it. */
export function head({ index, label, title, body, action, id, split = true }) {
  const aside = body || action;
  return (
    `<header class="cd-head${aside && split ? " cd-head--split" : ""}"${id ? ` id="${escape(id)}"` : ""} ` +
    `data-reveal="fade">` +
    `<p class="cd-label">${index ? `<span class="cd-label__index">${escape(index)}</span>` : ""}` +
    `<span>${escape(label)}</span></p>` +
    `<h2 class="cd-head__title">${escape(title)}</h2>` +
    (aside
      ? `<div class="cd-head__aside">${body ? `<p>${escape(body)}</p>` : ""}` +
        `${action ? `<div class="cd-actions" style="margin-top:1rem">${action}</div>` : ""}</div>`
      : "") +
    `</header>`
  );
}

/* ----------------------------------------------------------------- the tag */

export const demoTag = (label = "Datos demostrativos", onDark = false) =>
  `<span class="cd-demo${onDark ? " cd-demo--onDark" : ""}">${escape(label)}</span>`;

/* --------------------------------------------------------------- status pill */

const STATE_TONE = {
  cumplido: "ok", curso: "info", atencion: "warn", previsto: "mute",
  vigente: "ok", revision: "warn", derogada: "mute",
  abierta: "ok", cerrada: "mute", proxima: "info", informe: "info",
  formulacion: "info", consulta: "warn", seguimiento: "info",
};

const STATE_ICON = {
  cumplido: "check", curso: "arrow", atencion: "alert", previsto: "clock",
  vigente: "check", revision: "edit", derogada: "closed",
  abierta: "open", cerrada: "closed", proxima: "clock", informe: "doc",
  formulacion: "edit", consulta: "open", seguimiento: "arrow",
};

/**
 * A state, shown as colour + icon + word.
 *
 * The word is the state. The colour and the icon repeat it, so a reader who
 * cannot separate the greens from the ambers loses nothing.
 */
export const statePill = (state, label) =>
  `<span class="cd-state cd-state--${STATE_TONE[state] ?? "mute"}">` +
  `${icon(STATE_ICON[state] ?? "clock", "cd-state__icon")}${escape(label ?? state)}</span>`;

/* -------------------------------------------------------------------- figures */

/**
 * A KPI tile.
 *
 * Label, value, change, note — and the change knows whether up is good, so a
 * falling dropout rate is green and a falling enrolment is not.
 */
export function figureTile({ label, value, sup, change, changeNote, note, improving, spark, hero }) {
  const tone = improving === null || improving === undefined ? "flat" : improving ? "up" : "down";
  const arrow =
    change === null || change === undefined || change === 0
      ? ""
      : icon(change > 0 ? "arrowUp" : "arrowDown", "cd-change__arrow");

  return (
    `<div class="cd-figure${hero ? " cd-figure--hero" : ""}" data-reveal="rise">` +
    `<p class="cd-figure__label">${escape(label)}</p>` +
    `<p class="cd-figure__value">${escape(value)}${sup ? `<sup>${escape(sup)}</sup>` : ""}</p>` +
    `<div class="cd-figure__foot">` +
    (change === null || change === undefined
      ? `<span class="cd-figure__note">${escape(changeNote ?? "Sin comparación")}</span>`
      : `<span class="cd-change cd-change--${tone}">${arrow}${escape(changeNote)}</span>`) +
    (spark ?? "") +
    `</div>` +
    (note ? `<p class="cd-figure__note">${escape(note)}</p>` : "") +
    `</div>`
  );
}

export const figureRow = (tiles, columns = 4) =>
  `<div class="cd-figures cd-figures--${columns}" data-reveal-group>${tiles.join("")}</div>`;

/* --------------------------------------------------------------- data table */

/**
 * The table renderer lives with the chart renderers, not here: the build writes
 * a table and the browser rewrites it when a filter changes, so both sides have
 * to call the same function.
 */
export { table } from "../../src/scripts/cede/table-render.js";

/* -------------------------------------------------------------- chart block */

let chartSeq = 0;

/**
 * The frame every chart sits in.
 *
 * Title, description, legend, plot, the table twin and the footer with the
 * source and the download controls. Two rules are enforced here rather than
 * left to each caller: a chart always states its source and period, and a chart
 * always ships the table that makes its values reachable without a mouse.
 *
 * `chart` carries the descriptor the browser needs to redraw this exact chart
 * at a different width or against a different slice — the same arguments the
 * build used, so the redraw cannot drift from the first paint.
 */
export function chartBlock({
  title,
  desc,
  svg,
  legend,
  source = SOURCE,
  period,
  table: tableHtml,
  chart,
  id,
  className = "",
  downloads = true,
  tools = "",
}) {
  const key = id ?? `cd-chart-${++chartSeq}`;
  const config = chart ? ` data-chart="${escape(JSON.stringify(chart))}"` : "";

  return (
    `<figure class="cd-chart${className ? ` ${className}` : ""}" id="${escape(key)}" ` +
    `aria-labelledby="${escape(key)}-t" data-reveal="fade">` +
    `<figcaption class="cd-chart__head">` +
    `<p class="cd-chart__title" id="${escape(key)}-t">${escape(title)}</p>` +
    (desc ? `<p class="cd-chart__desc">${escape(desc)}</p>` : "") +
    `</figcaption>` +
    (legend ?? "") +
    `<div class="cd-chart__plot"${config}>${svg}</div>` +
    (tableHtml
      ? `<details class="cd-datatable"><summary class="cd-datatable__toggle">Ver tabla de datos</summary>` +
        `<div class="cd-datatable__wrap">${tableHtml}</div></details>`
      : "") +
    `<div class="cd-chart__foot">` +
    `<p class="cd-chart__source">${escape(source)}${period ? ` · ${escape(period)}` : ""}</p>` +
    `<div class="cd-chart__tools">${tools}${downloads ? downloadTools() : ""}</div>` +
    `</div></figure>`
  );
}

/**
 * The download controls.
 *
 * They are not decorative. The runtime serialises the figure's own data table —
 * the one right above these buttons — into a real CSV, a real XLSX and a real
 * JSON file, so what a visitor downloads contains exactly the numbers the chart
 * drew. "Simulated download" would have been easier and would have taught a
 * prospective client nothing.
 */
export const downloadTools = () =>
  `<button class="cd-download" type="button" data-download="csv">${icon("download")}CSV</button>` +
  `<button class="cd-download" type="button" data-download="xlsx">${icon("download")}XLSX</button>` +
  `<button class="cd-download" type="button" data-download="json">${icon("download")}JSON</button>` +
  `<button class="cd-download" type="button" data-print>${icon("print")}PDF</button>`;

/* ------------------------------------------------------------------- cards */

export function card({ kicker, title, text, foot, target, serif = false, state }) {
  const inner =
    (kicker || state
      ? `<p class="cd-card__kicker">${kicker ? escape(kicker) : ""}${state ?? ""}</p>`
      : "") +
    `<p class="cd-card__title${serif ? " cd-card__title--serif" : ""}">${escape(title)}</p>` +
    (text ? `<p class="cd-card__text">${escape(text)}</p>` : "") +
    (foot ? `<div class="cd-card__foot">${foot}</div>` : "");

  return target
    ? `<a class="cd-card" href="${escape(target)}" data-reveal="rise">${inner}</a>`
    : `<div class="cd-card" data-reveal="rise">${inner}</div>`;
}

/** A numbered definition row — functions, principles, seats, methodology. */
export const rowItem = ({ index, title, text, meta }) =>
  `<div class="cd-row-item" data-reveal="fade">` +
  (index ? `<p class="cd-row-item__index">${escape(index)}</p>` : "") +
  `<p class="cd-row-item__title">${escape(title)}</p>` +
  `<div><p class="cd-row-item__text">${escape(text)}</p>` +
  (meta ? `<p class="cd-row-item__meta">${meta}</p>` : "") +
  `</div></div>`;

export const rows = (items) => `<div class="cd-rows" data-reveal-group>${items.join("")}</div>`;

/* --------------------------------------------------------------- listings */

export const crumbs = (ctx, trail) =>
  `<nav aria-label="Ruta" class="cd-pagehero__crumbs"><ol class="cd-crumbs">${trail
    .map((item, index) =>
      index === trail.length - 1
        ? `<li aria-current="page">${escape(item.label)}</li>`
        : `<li><a href="${escape(href(ctx, item))}">${escape(item.label)}</a></li>`,
    )
    .join("")}</ol></nav>`;

/**
 * The head of an interior page: breadcrumb, label, title, lead and a metadata
 * strip. Every section of the portal opens the same way, which is what makes a
 * portal of thirty pages feel like one system.
 */
export function pageHero({ ctx, trail, label, title, lead, meta = [], dark = false, extra = "" }) {
  return (
    `<section class="cd-pagehero${dark ? " cd-pagehero--dark" : ""}">` +
    `<div class="cd-shell"><div class="cd-pagehero__inner">` +
    crumbs(ctx, trail) +
    `<div><p class="cd-label"><span>${escape(label)}</span></p>` +
    `<h1 class="cd-pagehero__title">${escape(title)}</h1></div>` +
    `<div><p class="cd-pagehero__lead">${escape(lead)}</p>${extra}</div>` +
    (meta.length
      ? `<dl class="cd-pagehero__meta">${meta
          .map((item) => `<div><dt>${escape(item.term)}</dt><dd>${escape(item.detail)}</dd></div>`)
          .join("")}</dl>`
      : "") +
    `</div></div></section>`
  );
}

/* --------------------------------------------------------------- utilities */

/** A value formatted the way its indicator declares. Re-exported for pages. */
export const formatted = byFormat;

/** A thousands-grouped count. */
export const count = group;

/** The note that goes under any block of invented figures. */
export const dataNote = (text) => `<p class="cd-note cd-note--boxed">${escape(text)}</p>`;

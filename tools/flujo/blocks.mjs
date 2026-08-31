/**
 * The pieces every Flujo screen is assembled from.
 *
 * One renderer per primitive — icon, button, section head, status pill, SLA
 * badge, table, process track, audit trail, approval record, generated document
 * — so a screen is described by the data it receives and never by markup copied
 * between pages.
 *
 * Several of these are also needed at runtime, because the browser re-renders
 * what the build first painted: an approval added to the record list has to
 * come out identical to one written at build time. Those live in
 * `src/scripts/flujo/render.js` and are imported by both sides; what stays here
 * is only what the browser has no use for.
 */

import { escape } from "../../src/data/flujo/format.js";

export { escape };

/* ------------------------------------------------------------------- links */

/** Build a context for a page `depth` directories below `demos/flujo/`. */
export const context = (depth = 0) => ({ depth, up: "../".repeat(depth) });

/** A file outside the demo — the bundle, a font, the portfolio itself. */
export const asset = (ctx, file) => `${ctx.up}../../${file}`;

/** A page of the demo. */
export const page = (ctx, file) => `${ctx.up}${file}`;

/** The file for one request's record. */
export const requestHref = (ctx, code) => `${ctx.up}solicitudes/${code}.html`;

/* ------------------------------------------------------------------- icons */

/**
 * The icon set.
 *
 * Line icons at a single weight on a 16-unit grid. Every one of them appears
 * beside a word — an icon on its own is not a label — so they are all
 * `aria-hidden` and none of them carries meaning the text does not.
 */
const PATHS = {
  arrow: '<path d="M2 8h11M9.5 4.5 13 8l-3.5 3.5"/>',
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
  people: '<circle cx="6" cy="5.6" r="2.4"/><path d="M2 13.2c0-2.2 1.8-4 4-4s4 1.8 4 4"/><path d="M11 4c1.3.3 2.2 1.4 2.2 2.7 0 .9-.4 1.7-1 2.2M11.4 9.6c1.6.5 2.6 1.9 2.6 3.6"/>',
  book: '<path d="M2.8 3.2h4c1 0 1.6.6 1.6 1.6v8c0-.8-.6-1.4-1.6-1.4h-4z"/><path d="M13.2 3.2h-4c-1 0-1.6.6-1.6 1.6v8c0-.8.6-1.4 1.6-1.4h4z"/>',
  bolt: '<path d="M9 2 4 9h3.4l-.8 5 5-7H8.2z"/>',
  mail: '<path d="M2.4 4h11.2v8H2.4z"/><path d="m2.4 4.6 5.6 4 5.6-4"/>',
  scan: '<path d="M2.6 5.4V2.6h2.8M10.6 2.6h2.8v2.8M13.4 10.6v2.8h-2.8M5.4 13.4H2.6v-2.8"/><path d="M2.6 8h10.8"/>',
  shield: '<path d="M8 2.2 13 4v4.2c0 3-2.1 5-5 5.6-2.9-.6-5-2.6-5-5.6V4z"/><path d="m5.8 8 1.5 1.5L10.2 6.6"/>',
  rule: '<path d="M8 2.4v3.2M8 10.4v3.2"/><rect x="4.6" y="5.6" width="6.8" height="4.8" rx="1"/>',
  print: '<path d="M4.6 6V2.8h6.8V6"/><path d="M4.6 12h-2V6.8h10.8V12h-2"/><path d="M4.6 9.6h6.8v3.6H4.6z"/>',
  user: '<circle cx="8" cy="5.4" r="2.6"/><path d="M3 13.4c0-2.8 2.2-5 5-5s5 2.2 5 5"/>',
  cog: '<circle cx="8" cy="8" r="2.2"/><path d="M8 1.8v1.6M8 12.6v1.6M14.2 8h-1.6M3.4 8H1.8M12.4 3.6l-1.1 1.1M4.7 11.3l-1.1 1.1M12.4 12.4l-1.1-1.1M4.7 4.7 3.6 3.6"/>',
};

export const icon = (name, className = "") =>
  `<svg class="fx-icon${className ? ` ${className}` : ""}" width="16" height="16" viewBox="0 0 16 16" ` +
  `aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.4" ` +
  `stroke-linecap="round" stroke-linejoin="round">${PATHS[name] ?? PATHS.arrow}</svg>`;

/* ---------------------------------------------------------------- controls */

export function button(label, target, { solid, ghost, onDark, small, icon: withIcon, className = "" } = {}) {
  const kind = solid ? " fx-btn--solid" : ghost ? " fx-btn--ghost" : onDark ? " fx-btn--onDark" : "";
  return (
    `<a class="fx-btn${kind}${small ? " fx-btn--small" : ""}${className ? ` ${className}` : ""}" ` +
    `href="${escape(target)}">${escape(label)}${withIcon ? icon(withIcon) : ""}</a>`
  );
}

export const arrowLink = (label, target) =>
  `<a class="fx-link" href="${escape(target)}">${escape(label)}` +
  `<svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true" focusable="false" fill="none" ` +
  `stroke="currentColor" stroke-width="1.5"><path d="M0 5h12M8.5 1.5 12 5l-3.5 3.5"/></svg></a>`;

/* -------------------------------------------------------------- section head */

/** Index, label, rule, title — and optionally a paragraph set beside it. */
export function head({ index, label, title, body, action, id, dark = false }) {
  const aside = body || action;
  return (
    `<header class="fx-head${aside ? " fx-head--split" : ""}"${id ? ` id="${escape(id)}"` : ""}>` +
    `<p class="fx-label">${index ? `<span class="fx-label__index">${escape(index)}</span>` : ""}` +
    `<span>${escape(label)}</span></p>` +
    `<h2 class="fx-head__title">${escape(title)}</h2>` +
    (aside
      ? `<div class="fx-head__aside">${body ? `<p>${escape(body)}</p>` : ""}` +
        (action ? `<div class="fx-actions" style="margin-top:1rem">${action}</div>` : "") +
        `</div>`
      : "") +
    `</header>${dark ? "" : ""}`
  );
}

/* ------------------------------------------------------------------- tags */

export const demoTag = (label, onDark = false) =>
  `<span class="fx-demo${onDark ? " fx-demo--onDark" : ""}">${escape(label)}</span>`;

export const flag = (label, onDark = false) =>
  `<span class="wf-flag${onDark ? " wf-flag--onDark" : ""}">${escape(label)}</span>`;

export const simTag = (label = "Simulación") => `<span class="wf-sim">${escape(label)}</span>`;

export const note = (text) => `<p class="fx-note fx-note--boxed">${escape(text)}</p>`;

/* ------------------------------------------------------------------ table */

/**
 * The register.
 *
 * `columns` declares each column's label, alignment and sortability; the label
 * is repeated into every cell as `data-label`, which is what lets the
 * narrow-screen card layout keep every value named instead of turning nine
 * columns into nine anonymous lines.
 */
export function table({ columns, rows, caption, id, className = "" }) {
  const headCells = columns
    .map(
      (column) =>
        `<th scope="col"${column.numeric ? ' class="fx-num"' : ""}>${escape(column.label)}</th>`,
    )
    .join("");

  const bodyRows = rows
    .map(
      (row) =>
        `<tr${row.attrs ?? ""}>` +
        columns
          .map((column, index) => {
            const classes = [column.numeric ? "fx-num" : "", index === 0 ? "fx-table__name" : ""]
              .filter(Boolean)
              .join(" ");
            return (
              `<td${classes ? ` class="${classes}"` : ""} data-label="${escape(column.label)}">` +
              `${row.cells[index]}</td>`
            );
          })
          .join("") +
        `</tr>`,
    )
    .join("");

  return (
    `<div class="fx-tablewrap${className ? ` ${className}` : ""}"${id ? ` id="${escape(id)}"` : ""}>` +
    `<table class="fx-table fx-table--stack">` +
    (caption ? `<caption>${escape(caption)}</caption>` : "") +
    `<thead><tr>${headCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>`
  );
}

/* --------------------------------------------------------------------- QR */

/**
 * The verification square on the generated document.
 *
 * Deliberately NOT a real QR code. A demonstration document must not carry a
 * symbol that a phone will resolve to something — so this is a deterministic
 * pattern derived from the verification string: it has the finder squares that
 * make it read as "machine-verifiable" at a glance, and scanning it yields
 * nothing at all. The caption beside it says so in words.
 */
export function verificationMark(seed, size = 21) {
  /* FNV-1a, then a xorshift walk: stable output for a given code, and the same
     square every time the page is rebuilt. */
  let hash = 2166136261;
  for (const char of String(seed)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  const next = () => {
    hash ^= hash << 13;
    hash ^= hash >>> 17;
    hash ^= hash << 5;
    hash >>>= 0;
    return hash / 4294967296;
  };

  /* The three finder squares, in the corners a reader expects them. */
  const finders = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ];
  const inFinder = (x, y) =>
    finders.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);

  let cells = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (inFinder(x, y)) continue;
      if (next() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
  }

  const finder = (fx, fy) =>
    `<rect x="${fx}" y="${fy}" width="7" height="7"/>` +
    `<rect x="${fx + 1}" y="${fy + 1}" width="5" height="5" fill="#ffffff"/>` +
    `<rect x="${fx + 2}" y="${fy + 2}" width="3" height="3"/>`;

  return (
    `<svg class="wf-doc__qr" viewBox="0 0 ${size} ${size}" role="img" ` +
    `aria-label="Marca de verificación demostrativa. No es un código legible." ` +
    `shape-rendering="crispEdges" fill="#071e4a">` +
    finders.map(([fx, fy]) => finder(fx, fy)).join("") +
    cells +
    `</svg>`
  );
}

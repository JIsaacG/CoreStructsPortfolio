/**
 * The pieces every AUREA page is assembled from.
 *
 * One renderer per component of the design system — section head, card,
 * figure row, step sequence, timeline, accordion, filter bar, listing — so a
 * zone is described by the data it receives and never by markup copied between
 * pages. Twenty-eight pages share these; a change to a card is a change to all
 * of them.
 *
 * `ctx` carries how deep in the tree the page being written lives, which is
 * all a renderer needs to emit a correct relative link from anywhere in the
 * portal.
 */

import { escape, fold, slugify, dateParts } from "../../src/data/aurea/format.js";
import { routes } from "../../src/data/aurea/institution.js";
import { galleryCategories } from "../../src/data/aurea/gallery.js";
import { plate } from "./art.mjs";

export { escape, fold, slugify, dateParts };

/* ------------------------------------------------------------------- links */

/** Build a context for a page `depth` directories below `demos/aurea/`. */
export const context = (depth = 0) => ({ depth, up: "../".repeat(depth) });

/** A file outside the demo — the shared bundle, a font, the portfolio itself. */
export const asset = (ctx, file) => `${ctx.up}../../${file}`;

/** A page of the portal, by its key in `routes`. */
export function page(ctx, route, hash) {
  const target = routes[route];
  if (!target) throw new Error(`unknown route: ${route}`);
  return `${ctx.up}${target}${hash ? `#${hash}` : ""}`;
}

/** A detail page: `sub(ctx, "programas", "psicologia")`. */
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
 * Line icons at a single weight on a 24-unit grid. Every one of them is
 * accompanied by a word — an icon on its own is not a label — so they are all
 * `aria-hidden`.
 */
const PATHS = {
  arrow: '<path d="M4 12h14M13 7l5 5-5 5"/>',
  caret: '<path d="m6 9 6 6 6-6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  cap: '<path d="M12 4 2.5 9 12 14l9.5-5z"/><path d="M6.5 11.2V16c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-4.8M20.5 9.5v5"/>',
  edit: '<path d="M16.5 3.5 20.5 7.5 8 20H4v-4z"/><path d="M13.5 6.5 17.5 10.5"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  coin: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5v9M9.5 10h4a1.8 1.8 0 0 1 0 3.6h-3a1.8 1.8 0 0 0 0 3.6h4"/>',
  campus: '<path d="M3 20.5h18M5 20.5V10l7-5 7 5v10.5"/><path d="M10 20.5v-5h4v5"/>',
  user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.8v10.7h13V9.8"/><path d="M10 20.5v-6h4v6"/>',
  book: '<path d="M4 4.5h6a3 3 0 0 1 2 2.8v12a2.4 2.4 0 0 0-2-2.2H4z"/><path d="M20 4.5h-6a3 3 0 0 0-2 2.8v12a2.4 2.4 0 0 1 2-2.2h6z"/>',
  doc: '<path d="M6 3.5h7l5 5v12H6z"/><path d="M13 3.5v5h5"/><path d="M9 13h6M9 16.5h4"/>',
  flask: '<path d="M9.5 3.5v6L4.6 18a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3l-4.9-8.5v-6"/><path d="M8.5 3.5h7M8 13h8"/>',
  people: '<circle cx="9" cy="8" r="3.4"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.2a3.4 3.4 0 0 1 0 6.6M17.5 14.4A6 6 0 0 1 21 20"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.6 6.7 8.4 6 8.4-6"/>',
  phone: '<path d="M6 3.5h3l1.6 4-2 1.4a11 11 0 0 0 5.5 5.5l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.7 2 2 0 0 1 6 3.5z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.2l3.4 2"/>',
  check: '<path d="m5 12.5 4.6 4.5L19 7.5"/>',
  play: '<path d="M9.5 7.5 17 12l-7.5 4.5z"/>',
  download: '<path d="M12 3.5v11M8 11l4 4 4-4"/><path d="M4.5 19.5h15"/>',
  external: '<path d="M10 5H5v14h14v-5"/><path d="M14.5 4.5H20v5.5M20 4.5 12 12.5"/>',
  chart: '<path d="M4 19.5h16"/><path d="M7 19.5v-6M11.5 19.5V8M16 19.5v-8.5"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.6 3.6 5.5 3.6 8.5S14.4 18.4 12 20.5c-2.4-2.1-3.6-5-3.6-8.5S9.6 6.1 12 3.5z"/>',
  spark: '<path d="M12 3.5 14 10l6.5 2-6.5 2-2 6.5-2-6.5L3.5 12 10 10z"/>',
  heart: '<path d="M12 20s-7-4.4-7-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.6c0 5-7 9.4-7 9.4z"/>',
  shield: '<path d="M12 3.5 19.5 6v6c0 4.4-3.1 7.5-7.5 9-4.4-1.5-7.5-4.6-7.5-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
};

export const icon = (name, className = "", size = 24) =>
  `<svg class="au-icon${className ? ` ${className}` : ""}" width="${size}" height="${size}" ` +
  `viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" ` +
  `stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${PATHS[name] ?? PATHS.arrow}</svg>`;

/* ---------------------------------------------------------------- controls */

/**
 * A button or a link, depending on whether it is given a target.
 *
 * `type` is a named option rather than something a caller passes through
 * `attrs`, because `attrs` is appended after the element's own attributes and
 * the FIRST `type` wins in HTML — so `attrs: 'type="submit"'` silently
 * produced a `type="button"` that never submitted its form. Naming the option
 * makes the wrong version impossible to write.
 */
export function button(
  label,
  target,
  { solid, ghost, gold, onDark, small, className = "", icon: withIcon, attrs = "", type = "button" } = {},
) {
  const kind = solid
    ? " au-btn--solid"
    : gold
      ? " au-btn--gold"
      : onDark
        ? " au-btn--onDark"
        : ghost
          ? " au-btn--ghost"
          : "";

  const classes = `au-btn${kind}${small ? " au-btn--small" : ""}${className ? ` ${className}` : ""}`;
  const body = `${escape(label)}${withIcon ? icon(withIcon, "", 18) : ""}`;

  return target
    ? `<a class="${classes}" href="${escape(target)}"${attrs ? ` ${attrs}` : ""}>${body}</a>`
    : `<button class="${classes}" type="${escape(type)}"${attrs ? ` ${attrs}` : ""}>${body}</button>`;
}

export const arrowLink = (label, target, className = "") =>
  `<a class="au-link${className ? ` ${className}` : ""}" href="${escape(target)}">${escape(label)}` +
  `<svg class="au-link__arrow" width="14" height="10" viewBox="0 0 14 10" aria-hidden="true" ` +
  `focusable="false" fill="none" stroke="currentColor" stroke-width="1.6">` +
  `<path d="M0 5h12M8.5 1.5 12 5l-3.5 3.5"/></svg></a>`;

export const actions = (items) => `<div class="au-actions">${items.filter(Boolean).join("")}</div>`;

/* ------------------------------------------------------------ section head */

/** Index, label, rule, title — and optionally a paragraph set beside it. */
export function head({ index, label, title, body, action, id, ui = false, split = true }) {
  const aside = body || action;

  return (
    `<header class="au-head${aside && split ? " au-head--split" : ""}"${id ? ` id="${escape(id)}"` : ""} ` +
    `data-reveal="fade">` +
    `<p class="au-label">${index ? `<span class="au-label__index">${escape(index)}</span>` : ""}` +
    `<span>${escape(label)}</span></p>` +
    `<h2 class="au-head__title${ui ? " au-h--ui" : ""}">${escape(title)}</h2>` +
    (aside
      ? `<div class="au-head__aside">${body ? `<p>${escape(body)}</p>` : ""}` +
        `${action ? `<div class="au-actions" style="margin-top:1rem">${action}</div>` : ""}</div>`
      : "") +
    `</header>`
  );
}

/* -------------------------------------------------------------------- tags */

export const tag = (label, kind = "") =>
  `<span class="au-tag${kind ? ` au-tag--${kind}` : ""}">${escape(label)}</span>`;

export const demoTag = (label = "Contenido demostrativo", onDark = false) =>
  `<span class="au-demo${onDark ? " au-demo--onDark" : ""}">${escape(label)}</span>`;

export const note = (text, className = "") =>
  `<p class="au-note${className ? ` ${className}` : ""}">${escape(text)}</p>`;

/* -------------------------------------------------------------------- card */

export function card({ kicker, title, text, foot, link, className = "", accent, reveal = "rise", level = 3 }) {
  const inner =
    (kicker ? `<p class="au-card__kicker">${escape(kicker)}</p>` : "") +
    `<h${level} class="au-card__title">${escape(title)}</h${level}>` +
    (text ? `<p class="au-card__text">${escape(text)}</p>` : "") +
    (foot ? `<div class="au-card__foot">${foot}</div>` : "");

  const classes = `au-card${link ? " au-card--link" : ""}${accent ? " au-card--accent" : ""}${className ? ` ${className}` : ""}`;

  return link
    ? `<a class="${classes}" href="${escape(link)}" data-reveal="${reveal}">${inner}</a>`
    : `<div class="${classes}" data-reveal="${reveal}">${inner}</div>`;
}

export const grid = (items, columns = 3, attrs = "") =>
  `<div class="au-grid au-grid--${columns}" data-reveal-group${attrs ? ` ${attrs}` : ""}>${items.join("")}</div>`;

/* ----------------------------------------------------------------- figures */

/**
 * A number block.
 *
 * The final value is printed in the HTML; `data-count` only tells the counter
 * what to animate towards. A reader who never triggers the observer — no
 * JavaScript, reduced motion, or simply scrolling past too fast — sees the
 * number rather than a zero.
 */
export function figure({ value, suffix = "", label, note: noteText, count }) {
  const printed = `${value}${suffix}`;
  return (
    `<div class="au-figure">` +
    `<p class="au-figure__value"${count ? ` data-count="${count}" data-count-suffix="${escape(suffix)}"` : ""}>` +
    `${escape(printed)}</p>` +
    `<p class="au-figure__label">${escape(label)}</p>` +
    (noteText ? `<p class="au-figure__note">${escape(noteText)}</p>` : "") +
    `</div>`
  );
}

export const figureRow = (items) =>
  `<div class="au-figures" data-reveal-group>${items.join("")}</div>`;

/* ------------------------------------------------------------------- steps */

export const steps = (items) =>
  `<ol class="au-steps" data-reveal-group>` +
  items
    .map(
      (item) =>
        `<li class="au-step"><span class="au-step__num">${escape(item.number ?? item.step)}</span>` +
        `<h3 class="au-step__title">${escape(item.title)}</h3>` +
        `<p class="au-step__text">${escape(item.text)}</p></li>`,
    )
    .join("") +
  `</ol>`;

/* ---------------------------------------------------------------- timeline */

export const timeline = (items) =>
  `<ol class="au-timeline">` +
  items
    .map(
      (item) =>
        `<li class="au-timeline__item" data-reveal="side">` +
        `<span class="au-timeline__year">${escape(item.year)}</span>` +
        `<div><h3 class="au-timeline__title">${escape(item.title)}</h3>` +
        `<p class="au-timeline__text">${escape(item.text)}</p></div></li>`,
    )
    .join("") +
  `</ol>`;

/* --------------------------------------------------------------- accordion */

let accSeq = 0;

/**
 * A disclosure list.
 *
 * The panels are open in the markup and only collapsed once `ui.js` confirms
 * it can reopen them, so a reader without JavaScript gets every answer rather
 * than a column of dead buttons.
 */
export function accordion(items, { open = 0 } = {}) {
  const group = ++accSeq;

  return (
    `<div class="au-acc">` +
    items
      .map((item, index) => {
        const id = `au-acc-${group}-${index}`;
        const expanded = index === open;
        return (
          `<div class="au-acc__item">` +
          `<h3><button class="au-acc__btn" type="button" data-acc-btn aria-expanded="${expanded}" ` +
          `aria-controls="${id}"><span>${escape(item.q ?? item.title)}</span>` +
          `<span class="au-acc__sign" aria-hidden="true"></span></button></h3>` +
          `<div class="au-acc__panel" id="${id}"><p>${escape(item.a ?? item.text)}</p></div>` +
          `</div>`
        );
      })
      .join("") +
    `</div>`
  );
}

/* ------------------------------------------------------------- filter bar */

/**
 * The control strip above a catalogue.
 *
 * `groups` are chip rows, keyed to the `data-<key>` attributes on the items.
 * The count and the reset are always present: a filter interface without a
 * count leaves the reader unable to tell an empty result from a broken one.
 */
export function filters({ searchLabel, searchPlaceholder, groups = [], countLabel = "" }) {
  const search = searchLabel
    ? `<div class="au-filters__row"><label class="au-sr" for="au-collection-q">${escape(searchLabel)}</label>` +
      `<div class="au-filters__search">${icon("search", "", 20)}` +
      `<input class="au-filters__input" id="au-collection-q" type="search" ` +
      `placeholder="${escape(searchPlaceholder ?? searchLabel)}" data-collection-input autocomplete="off" />` +
      `</div></div>`
    : "";

  const rows = groups
    .map(
      (group) =>
        `<div class="au-filters__row"><p class="au-filters__legend" id="au-f-${escape(group.key)}">` +
        `${escape(group.label)}</p>` +
        `<div class="au-chips" role="group" aria-labelledby="au-f-${escape(group.key)}">` +
        group.options
          .map(
            (option) =>
              `<button class="au-chip" type="button" data-filter="${escape(group.key)}" ` +
              `data-value="${escape(option.id)}"${group.single ? ' data-filter-mode="single"' : ""} ` +
              `aria-pressed="false">${escape(option.label)}</button>`,
          )
          .join("") +
        `</div></div>`,
    )
    .join("");

  return (
    `<div class="au-filters">${search}${rows}` +
    `<div class="au-filters__foot">` +
    `<p class="au-filters__count" data-collection-count aria-live="polite">${escape(countLabel)}</p>` +
    `<button class="au-filters__reset" type="button" data-collection-reset>Limpiar filtros</button>` +
    `</div></div>`
  );
}

export const empty = (message) =>
  `<p class="au-empty" data-collection-empty hidden>${escape(message)}</p>`;

/* ------------------------------------------------------------------ prose */

export const prose = (text, className = "au-prose__p") =>
  String(text)
    .split("\n\n")
    .map((block) => `<p class="${className}">${escape(block.trim())}</p>`)
    .join("");

export const quote = (text, by) =>
  `<blockquote class="au-quote">${escape(text)}` +
  (by ? `<cite class="au-quote__by">${escape(by)}</cite>` : "") +
  `</blockquote>`;

export const callout = ({ title, text, kind = "" }) =>
  `<div class="au-callout${kind ? ` au-callout--${kind}` : ""}">` +
  (title ? `<h3 class="au-callout__title">${escape(title)}</h3>` : "") +
  `<p>${escape(text)}</p></div>`;

/* --------------------------------------------------------------- listings */

export const list = (rows) => `<ul class="au-list">${rows.join("")}</ul>`;

/* ------------------------------------------------------------------ table */

export function table({ caption, columns, rows, className = "" }) {
  return (
    `<div class="au-scroller"><table class="au-table${className ? ` ${className}` : ""}">` +
    (caption ? `<caption>${escape(caption)}</caption>` : "") +
    `<thead><tr>` +
    columns
      .map((column) => `<th scope="col"${column.num ? ' class="au-num"' : ""}>${escape(column.label)}</th>`)
      .join("") +
    `</tr></thead><tbody>` +
    rows
      .map(
        (row) =>
          `<tr>` +
          row
            .map((cell, index) =>
              index === 0
                ? `<th scope="row">${cell}</th>`
                : `<td${columns[index]?.num ? ' class="au-num"' : ""}>${cell}</td>`,
            )
            .join("") +
          `</tr>`,
      )
      .join("") +
    `</tbody></table></div>`
  );
}

/* ----------------------------------------------------------- the mosaic */

/**
 * One gallery tile.
 *
 * A `<button>`, not a link: it opens the same page's lightbox rather than
 * navigating, and a link that does not navigate is a lie told to the keyboard.
 * The caption is on the tile at all times — a mosaic whose labels appear only
 * under a pointer is unusable on a phone and invisible to a screen reader.
 *
 * The whole record travels in data attributes so the lightbox can read the
 * title and the caption off the tile it was given, without a second copy of
 * the collection in the page.
 */
export function tile(item) {
  const categoryLabel = galleryCategories.find((entry) => entry.id === item.category)?.label ?? "";

  return (
    `<button class="au-tile au-frame--${item.tone ?? "deep"}` +
    `${item.size ? ` au-tile--${item.size}` : ""}" type="button" data-tile ` +
    `data-item data-categoria="${escape(item.category)}" ` +
    `data-haystack="${escape(fold(`${item.title} ${item.caption} ${categoryLabel}`))}" ` +
    `data-title="${escape(item.title)}" data-cat-label="${escape(categoryLabel)}" ` +
    `data-caption="${escape(item.caption)}">` +
    `<span class="au-tile__art">${plate(item.plate, { tone: item.tone ?? "deep" })}</span>` +
    `<span class="au-tile__zoom" aria-hidden="true">` +
    icon("search", "", 16) +
    `</span>` +
    `<span class="au-tile__meta">` +
    `<span class="au-tile__cat">${escape(categoryLabel)}</span>` +
    `<span class="au-tile__title">${escape(item.title)}</span>` +
    `</span></button>`
  );
}

export const mosaic = (items) =>
  `<div class="au-gallery" data-gallery>${items.map((item) => tile(item)).join("")}</div>`;

/**
 * The lightbox shell.
 *
 * Emitted empty: `scripts/aurea/gallery.js` clones the drawing out of the tile
 * that was clicked rather than rendering thirty plates a second time.
 */
export const lightbox = () =>
  `<div class="au-lightbox" data-lightbox role="dialog" aria-modal="true" aria-label="Galería de AUREA">` +
  `<div class="au-lightbox__frame">` +
  `<div class="au-lightbox__stage" data-lightbox-stage></div>` +
  `<button class="au-lightbox__btn au-lightbox__close" type="button" data-lightbox-close ` +
  `aria-label="Cerrar la galería">✕</button>` +
  `<div class="au-lightbox__bar">` +
  `<div class="au-lightbox__text">` +
  `<p class="au-lightbox__cat" data-lightbox-cat></p>` +
  `<p class="au-lightbox__title" data-lightbox-title></p>` +
  `<p class="au-lightbox__caption" data-lightbox-caption></p>` +
  `</div>` +
  `<div class="au-lightbox__nav">` +
  `<p class="au-lightbox__count" data-lightbox-count aria-live="polite"></p>` +
  `<button class="au-lightbox__btn" type="button" data-lightbox-prev aria-label="Imagen anterior">←</button>` +
  `<button class="au-lightbox__btn" type="button" data-lightbox-next aria-label="Imagen siguiente">→</button>` +
  `</div></div></div></div>`;

/**
 * A plate at editorial scale, beside its text.
 *
 * For the pages that would otherwise be a column of prose. The drawing is a
 * real `<figure>` with a caption, so it carries the same weight as the words.
 */
export const feature = ({ plate: name, caption, body, flip = false, tone = "deep" }) =>
  `<div class="au-feature${flip ? " au-feature--flip" : ""}" data-reveal="fade">` +
  `<figure><div class="au-feature__frame au-frame--${tone}">${plate(name, { tone })}</div>` +
  (caption ? `<figcaption>${escape(caption)}</figcaption>` : "") +
  `</figure><div>${body}</div></div>`;

/** A row of plates, full width, between two text sections. */
/**
 * A row of plates, full width, between two text sections.
 *
 * The tones alternate. Four navy frames in a row is a black bar across the
 * page; navy, paper, navy, paper is a strip of pictures.
 */
export const strip = (names) =>
  `<div class="au-strip" data-reveal-group>` +
  names
    .map((name, index) => {
      const tone = index % 2 === 1 ? "paper" : "deep";
      return `<div class="au-strip__frame au-frame--${tone}">${plate(name, { tone })}</div>`;
    })
    .join("") +
  `</div>`;

/* ------------------------------------------------------------- breadcrumbs */

export const crumbs = (ctx, trail) =>
  `<nav aria-label="Ruta de navegación"><ol class="au-crumbs">` +
  trail
    .map((item, index) =>
      index === trail.length - 1
        ? `<li aria-current="page">${escape(item.label)}</li>`
        : `<li><a href="${escape(item.route ? page(ctx, item.route) : item.href)}">${escape(item.label)}</a></li>`,
    )
    .join("") +
  `</ol></nav>`;

/* --------------------------------------------------------------- sections */

/** A band of the page: `band({ tone, id, body })`. */
export const band = ({ tone = "", id, body, tight = false, narrow = false }) =>
  `<section class="au-band${tone ? ` au-band--${tone}` : ""}${tight ? " au-band--tight" : ""}"` +
  `${id ? ` id="${escape(id)}"` : ""}>` +
  `<div class="au-shell${narrow ? " au-shell--narrow" : ""}">${body}</div></section>`;

/* ------------------------------------------------------------- date chips */

export const dateChip = (iso) => {
  const parts = dateParts(iso);
  return (
    `<span class="au-date__chip"><span class="au-date__day">${parts.day}</span>` +
    `<span class="au-date__month">${parts.month}</span></span>`
  );
};

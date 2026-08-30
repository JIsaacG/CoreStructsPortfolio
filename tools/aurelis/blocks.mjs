/**
 * The pieces every Aurelis page is assembled from.
 *
 * One renderer per component in the brief — SectionHeader, Metric, Plate,
 * ServiceBlock, Result, LogoCloud, Testimonial, Leadership, CTA — so a zone is
 * described by the data it receives and never by markup copied between pages.
 *
 * `ctx` carries how deep in the tree the page being written lives, which is all
 * a renderer needs to emit a correct relative link from anywhere in the portal.
 */

import { plateSvg } from "../../src/data/aurelis/art.js";
import { routes } from "../../src/data/aurelis/company.js";

export const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* ------------------------------------------------------------------- links */

/** Build a context for a page `depth` directories below `demos/aurelis/`. */
export const context = (depth = 0) => ({ depth, up: "../".repeat(depth) });

/** A file that lives outside the demo, such as the shared CSS bundle. */
export const asset = (ctx, file) => `${ctx.up}../../${file}`;

/** A top-level page of the portal, by its key in `routes`. */
export function page(ctx, route, hash) {
  const target = routes[route];
  if (!target) throw new Error(`unknown route: ${route}`);
  return `${ctx.up}${target}${hash ? `#${hash}` : ""}`;
}

/** A detail page: `sub(ctx, "servicios", "infraestructura")`. */
export const sub = (ctx, dir, slug) => `${ctx.up}${dir}/${slug}.html`;

/** Resolve whatever shape a data file used to point somewhere. */
export function href(ctx, item) {
  if (item.href) return item.href;
  if (item.dir && item.slug) return sub(ctx, item.dir, item.slug);
  if (item.route) return page(ctx, item.route, item.hash);
  return "#";
}

/* --------------------------------------------------------------- controls */

const ARROW =
  '<svg class="au-btn__arrow" width="14" height="10" viewBox="0 0 14 10" ' +
  'aria-hidden="true" focusable="false" fill="none" stroke="currentColor" ' +
  'stroke-width="1.5"><path d="M0 5h12M8.5 1.5 12 5l-3.5 3.5"/></svg>';

const LINK_ARROW = ARROW.replace("au-btn__arrow", "au-link__arrow");

export function button(label, target, { solid, gold, className = "" } = {}) {
  const kind = solid ? " au-btn--solid" : gold ? " au-btn--gold" : "";
  return (
    `<a class="au-btn${kind}${className ? ` ${className}` : ""}" href="${escape(target)}">` +
    `${escape(label)}${ARROW}</a>`
  );
}

export const arrowLink = (label, target) =>
  `<a class="au-link" href="${escape(target)}">${escape(label)}${LINK_ARROW}</a>`;

export const actions = (ctx, list) =>
  `<div class="au-actions">${list
    .map((action) => button(action.label, href(ctx, action), { solid: action.solid }))
    .join("")}</div>`;

/* ----------------------------------------------------------------- plates */

/**
 * An image slot.
 *
 * The `<figure>`/aspect-box/caption construction is exactly what a photograph
 * needs, so replacing the drawn plate with a real image later is a change to
 * this one function.
 */
export function plate(key, { arg, ratio = "", reveal = true, className = "" } = {}) {
  const shape = ratio ? ` au-plate--${ratio}` : "";
  return (
    `<div class="au-plate${shape}${className ? ` ${className}` : ""}"` +
    `${reveal ? " data-reveal-plate" : ""} data-plate>${plateSvg(key, arg)}</div>`
  );
}

export function figure(key, caption, options = {}) {
  const { index, ...rest } = options;
  return (
    `<figure class="au-figure">${plate(key, rest)}` +
    (caption
      ? `<figcaption class="au-figure__caption">` +
        (index ? `<b>${escape(index)}</b>` : "") +
        `<span>${escape(caption)}</span></figcaption>`
      : "") +
    `</figure>`
  );
}

/* ------------------------------------------------------------ section head */

export function label(index, total, text) {
  const counter = total ? `${index} / ${total}` : index;
  return (
    `<p class="au-label"><span class="au-label__index">${escape(counter)}</span>` +
    `<span>${escape(text)}</span></p>`
  );
}

/**
 * The head every zone opens with: index, label, title and — optionally — a
 * paragraph set to the right of the title rather than beneath it.
 */
export function head({ index, total, label: text, title, body, action, split = true, id }) {
  const side = body || action;
  return (
    `<header class="au-head${side && split ? " au-head--split" : ""}"` +
    `${id ? ` id="${escape(id)}"` : ""} data-reveal="fade">` +
    label(index, total, text) +
    `<h2 class="au-h2 au-head__title">${escape(title)}</h2>` +
    (side
      ? `<div>${body ? `<p class="au-lead">${escape(body)}</p>` : ""}` +
        `${action ? `<div class="au-actions" style="margin-top:1.5rem">${action}</div>` : ""}</div>`
      : "") +
    `</header>`
  );
}

/* ---------------------------------------------------------------- metrics */

/** A counted figure. `data-count` is what the counter module animates. */
export function metric({ value, sup, label: text, note }, { counted = true } = {}) {
  return (
    `<div class="au-metric" data-reveal="rise">` +
    `<p class="au-metric__value"${counted ? ` data-count="${escape(value)}"` : ""}>` +
    `<span data-count-value>${escape(value)}</span>` +
    `${sup ? `<sup>${escape(sup)}</sup>` : ""}</p>` +
    `<p class="au-metric__label">${escape(text)}</p>` +
    `${note ? `<p class="au-metric__note">${escape(note)}</p>` : ""}` +
    `</div>`
  );
}

export const metrics = (figures) =>
  `<div class="au-metrics" data-reveal-group>${figures.map((f) => metric(f)).join("")}</div>`;

export function stat({ value, sup, label: text }) {
  return (
    `<div class="au-stat">` +
    `<p class="au-stat__value" data-count="${escape(value)}">` +
    `<span data-count-value>${escape(value)}</span>` +
    `${sup ? `<sup>${escape(sup)}</sup>` : ""}</p>` +
    `<p class="au-stat__label">${escape(text)}</p></div>`
  );
}

export const results = (list) =>
  `<div class="au-results${list.length === 4 ? " au-results--four" : ""}">` +
  list
    .map(
      (item) =>
        `<div class="au-result"><p class="au-result__value${item.up ? " au-result__value--up" : ""}">` +
        `${escape(item.value)}</p><p class="au-result__label">${escape(item.label)}</p></div>`,
    )
    .join("") +
  `</div>`;

/* ------------------------------------------------------------- client wall */

/**
 * A client logotype.
 *
 * Drawn devices rather than invented logos: a fake brand mark that tries to
 * pass for real is worse than one that is visibly a placeholder, and the wall
 * has to read as monochrome furniture either way.
 */
const GLYPHS = {
  hex: '<path d="M12 2 21 7v10l-9 5-9-5V7z"/>',
  arc: '<path d="M3 19a9 9 0 0 1 18 0"/><path d="M8 19a4 4 0 0 1 8 0"/>',
  stack: '<path d="M12 3 22 8l-10 5L2 8z"/><path d="m2 13 10 5 10-5"/>',
  ring: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/>',
  wave: '<path d="M2 14c4-5 6 5 10 0s4 5 10 0"/><path d="M2 8c4-5 6 5 10 0s4 5 10 0"/>',
  chevron: '<path d="m3 17 9-10 9 10"/><path d="m3 11 9-6 9 6"/>',
  bars: '<path d="M4 20V9M10 20V4M16 20v-8M22 20V6"/>',
  prism: '<path d="M12 3 3 20h18z"/><path d="M12 3v17"/>',
  grid: '<path d="M3 3h18v18H3z"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
  leaf: '<path d="M20 4C9 4 4 9 4 20c11 0 16-5 16-16z"/><path d="M4 20 20 4"/>',
};

export const mark = ({ name, glyph }) =>
  `<div class="au-mark"><svg class="au-mark__glyph" viewBox="0 0 24 24" ` +
  `aria-hidden="true" focusable="false">${GLYPHS[glyph] ?? GLYPHS.ring}</svg>` +
  `<span class="au-mark__name">${escape(name)}</span></div>`;

/* ------------------------------------------------------------ testimonials */

export const quote = ({ text, name, role, org }) =>
  `<figure class="au-quote" data-reveal="rise">` +
  `<blockquote class="au-quote__text">${escape(text)}</blockquote>` +
  `<figcaption class="au-quote__by"><span class="au-quote__name">${escape(name)}</span>` +
  `<span class="au-quote__role">${escape(role)}</span>` +
  `<span class="au-quote__org">${escape(org)}</span></figcaption></figure>`;

/* --------------------------------------------------------------- listings */

export const bullets = (items, className = "au-capability__list") =>
  `<ul class="${className}">${items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>`;

export const steps = (list) =>
  `<ol class="au-steps">${list
    .map(
      (item, index) =>
        `<li><b>${String(index + 1).padStart(2, "0")}</b>` +
        `<strong>${escape(item.title)}</strong>` +
        `<span>${escape(item.text)}</span></li>`,
    )
    .join("")}</ol>`;

export const faq = (items) =>
  `<div class="au-faq">${items
    .map(
      (item) =>
        `<details class="au-faq__item"><summary class="au-faq__q">${escape(item.q)}</summary>` +
        `<div class="au-faq__a">${escape(item.a)}</div></details>`,
    )
    .join("")}</div>`;

export const crumbs = (ctx, trail) =>
  `<nav aria-label="Ruta"><ol class="au-crumbs">${trail
    .map((item, index) =>
      index === trail.length - 1
        ? `<li aria-current="page">${escape(item.label)}</li>`
        : `<li><a href="${escape(href(ctx, item))}">${escape(item.label)}</a></li>`,
    )
    .join("")}</ol></nav>`;

/* ------------------------------------------------------------------ blocks */

/** A titled block on a detail page. The heading is an h2: these sit directly
    under the page h1, and a skipped level is a real navigation failure. */
export const block = (title, ...body) =>
  `<section class="au-block"><h2 class="au-block__title">${escape(title)}</h2>${body.join("")}</section>`;

/** Turn a data string with blank lines into paragraphs. */
export const prose = (text) =>
  String(text)
    .split("\n\n")
    .map((paragraph) => `<p class="au-body">${escape(paragraph.trim())}</p>`)
    .join("");

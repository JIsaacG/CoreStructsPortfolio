/**
 * Velora — the drawn parts.
 *
 * A clinic normally sells itself with photography, and a demo has none it can
 * honestly use: stock portraits would either look like stock portraits or,
 * worse, imply that an invented clinic treated a real person. So everything
 * visual here is built instead — warm gradient fields inside arches, a
 * champagne line drawing on top, and a texture study for the before/after.
 *
 * The arch is the motif. It appears in the hero, in the comparison, and behind
 * the doctor's portrait plate, and it is the single shape that makes the page
 * look like one place.
 */

import { escape } from "./shell.mjs";

/* Ids have to be unique per document, so every gradient is namespaced by the
   plate that owns it. */
const gradientId = (name, key) => `ve-${name}-${key}`;

/**
 * The warm field every plate is filled with: a deep champagne ground, a light
 * source high and left, and a faint terracotta pooling at the bottom.
 */
function fieldDefs(key, { light = "#f6e7d4", mid = "#e6cdb0", deep = "#d8bda0" } = {}) {
  return `<defs>
      <linearGradient id="${gradientId("field", key)}" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="${light}"/>
        <stop offset="55%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${deep}"/>
      </linearGradient>
      <radialGradient id="${gradientId("light", key)}" cx="0.34" cy="0.24" r="0.62">
        <stop offset="0%" stop-color="#fffaf3" stop-opacity="0.92"/>
        <stop offset="100%" stop-color="#fffaf3" stop-opacity="0"/>
      </radialGradient>
    </defs>`;
}

/**
 * The hero plate: an arch of warm light with a single champagne line drawing
 * over it. The arch is cut by the SVG itself rather than by a border-radius so
 * the gradient follows the shape exactly at every size.
 */
export function heroPlate() {
  const key = "hero";
  return `<svg
      class="ve-plate__art"
      viewBox="0 0 420 560"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Composición abstracta en tonos champán: un arco de luz cálida con trazos finos superpuestos."
    >
      ${fieldDefs(key)}
      <path
        d="M0 560V210C0 94 94 0 210 0S420 94 420 210v350Z"
        fill="url(#${gradientId("field", key)})"
      />
      <path
        d="M0 560V210C0 94 94 0 210 0S420 94 420 210v350Z"
        fill="url(#${gradientId("light", key)})"
      />
      <g fill="none" stroke="#fdf6ec" stroke-opacity="0.55" stroke-width="1">
        <path d="M-40 372C60 322 152 316 250 350s170 40 250 6"/>
        <path d="M-40 408C60 358 152 352 250 386s170 40 250 6"/>
        <path d="M-40 444C60 394 152 388 250 422s170 40 250 6"/>
      </g>
      <g fill="none" stroke="#8a5c3c" stroke-opacity="0.28" stroke-width="1.2">
        <path d="M210 120v300"/>
        <path d="M210 214c-34-28-58-34-92-30"/>
        <path d="M210 214c34-28 58-34 92-30"/>
        <path d="M210 284c-30-24-52-30-82-27"/>
        <path d="M210 284c30-24 52-30 82-27"/>
        <path d="M210 352c-26-20-45-26-71-24"/>
        <path d="M210 352c26-20 45-26 71-24"/>
      </g>
      <circle cx="210" cy="120" r="5" fill="#8a5c3c" fill-opacity="0.4"/>
      <circle cx="128" cy="188" r="86" fill="none" stroke="#fffaf3" stroke-opacity="0.34" stroke-width="1.4"/>
      <circle cx="300" cy="300" r="132" fill="none" stroke="#fffaf3" stroke-opacity="0.22" stroke-width="1.4"/>
    </svg>`;
}

/* ------------------------------------------------------- before / after */

/**
 * A texture study rather than a face: an even warm field with irregular
 * pigmentation. The "before" panel carries more of it, darker and larger; the
 * "after" panel keeps a few faint marks, because a comparison with nothing left
 * in it is the one that nobody believes.
 */
function marks(seed, { count, opacity, radius }) {
  // A small deterministic generator: the same texture on every build, which
  // matters for a file that is committed and diffed.
  let state = seed;
  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  let out = "";
  for (let i = 0; i < count; i++) {
    const cx = 20 + next() * 360;
    const cy = 40 + next() * 440;
    const r = radius[0] + next() * (radius[1] - radius[0]);
    const o = opacity[0] + next() * (opacity[1] - opacity[0]);
    out +=
      `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" ` +
      `rx="${r.toFixed(1)}" ry="${(r * (0.7 + next() * 0.45)).toFixed(1)}" ` +
      `fill="#9a6642" fill-opacity="${o.toFixed(3)}"/>`;
  }
  return out;
}

export function comparePlate(state) {
  const isBefore = state === "before";
  const key = isBefore ? "before" : "after";

  /* The difference between the two panels is deliberately the difference a
     course of treatment actually makes: the same skin, more even. Nothing is
     removed entirely — a comparison with a blank second half is the one nobody
     believes. */
  const texture = isBefore
    ? marks(20250907, { count: 38, opacity: [0.08, 0.26], radius: [3, 11] })
    : marks(731, { count: 14, opacity: [0.03, 0.09], radius: [2.5, 7] });

  return `<svg
      class="ve-compare__art"
      viewBox="0 0 400 520"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="${gradientId("skin", key)}" x1="0.1" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stop-color="${isBefore ? "#f0dcc6" : "#fbeada"}"/>
          <stop offset="60%" stop-color="${isBefore ? "#e2c6a9" : "#f0d9c1"}"/>
          <stop offset="100%" stop-color="${isBefore ? "#d2b092" : "#e4c8ad"}"/>
        </linearGradient>
        <radialGradient id="${gradientId("glow", key)}" cx="0.38" cy="0.28" r="0.72">
          <stop offset="0%" stop-color="#fffaf4" stop-opacity="${isBefore ? "0.16" : "0.5"}"/>
          <stop offset="100%" stop-color="#fffaf4" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="520" fill="url(#${gradientId("skin", key)})"/>
      <g>${texture}</g>
      <g fill="none" stroke="#9a6642" stroke-opacity="${isBefore ? "0.14" : "0.05"}" stroke-width="1">
        <path d="M46 156c58 24 116 28 174 11"/>
        <path d="M58 206c58 24 116 28 174 11"/>
        <path d="M300 322c-50 21-100 25-150 10"/>
        <path d="M292 366c-50 21-100 25-150 10"/>
      </g>
      <rect width="400" height="520" fill="url(#${gradientId("glow", key)})"/>
    </svg>`;
}

/* ----------------------------------------------------------- treatments */

/**
 * One line drawing per treatment, all on the same 64×64 box and the same
 * 1.4 stroke, so the six cards read as a set without being the same picture.
 */
const TREATMENT_ART = {
  face: `<path d="M22 54c0-9 3-14 8-19-5-6-7-12-7-19 0-1 0-2 .1-3" />
    <path d="M23 13C26 8 32 5 39 5c9 0 16 7 16 16 0 5-2 9-5 12 2 2 3 4 2 6-1 2-3 3-6 3 0 4 0 7 1 9-3 2-7 2-10 1" />
    <circle cx="41" cy="21" r="1.6" fill="currentColor" stroke="none"/>`,
  laser: `<path d="M32 6v12M18 12l6 9M46 12l-6 9M10 24l9 5M54 24l-9 5"/>
    <circle cx="32" cy="34" r="7"/>
    <path d="M10 50c8-4 14-6 22-6s14 2 22 6"/>
    <path d="M10 57c8-4 14-6 22-6s14 2 22 6" opacity="0.45"/>`,
  derma: `<path d="M32 6c8 11 13 18 13 25a13 13 0 0 1-26 0c0-7 5-14 13-25Z"/>
    <path d="M26 32a6 6 0 0 0 6 6"/>
    <path d="M8 50h48M8 57h34" opacity="0.5"/>`,
  renew: `<circle cx="32" cy="32" r="12"/>
    <path d="M32 6v6M32 52v6M6 32h6M52 32h6M14 14l4 4M46 46l4 4M50 14l-4 4M18 46l-4 4"/>
    <path d="M26 32a6 6 0 0 1 6-6" opacity="0.5"/>`,
  body: `<path d="M8 20c12-7 24-7 32 0s16 7 16 7"/>
    <path d="M8 32c12-7 24-7 32 0s16 7 16 7" opacity="0.75"/>
    <path d="M8 44c12-7 24-7 32 0s16 7 16 7" opacity="0.5"/>
    <circle cx="24" cy="16" r="2.4" fill="currentColor" stroke="none"/>`,
  consult: `<rect x="12" y="8" width="34" height="44" rx="4"/>
    <path d="M22 8V5h14v3"/>
    <path d="M20 24h18M20 32h18M20 40h11" opacity="0.6"/>
    <path d="M40 46l5 5 9-11" stroke-width="2"/>`,
};

export function treatmentArt(kind) {
  return `<svg class="ve-card__art" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${TREATMENT_ART[kind]}</svg>`;
}

/* --------------------------------------------------------------- rating */

const STAR =
  '<path d="M8 1.2l2.06 4.18 4.61.67-3.34 3.25.79 4.6L8 11.72l-4.12 2.17.79-4.6L1.33 6.05l4.61-.67Z"/>';

/** Five filled stars, drawn once and reused. */
export function stars(label) {
  return `<span class="ve-stars" role="img" aria-label="${escape(label)}">
      ${Array.from({ length: 5 })
        .map(
          () =>
            `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">${STAR}</svg>`,
        )
        .join("")}
    </span>`;
}

/**
 * The doctor's portrait plate — the same arch as the hero, in a cooler
 * register, with a monogram where a photograph would go. A demo that
 * fabricated a face for an invented doctor would be a different kind of demo.
 */
export function doctorPlate(initials) {
  const key = "doc";
  return `<svg
      class="ve-doctor__art"
      viewBox="0 0 380 480"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Retrato ilustrado: un arco en tonos champán con el monograma de la profesional."
    >
      <defs>
        <linearGradient id="${gradientId("doc", key)}" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stop-color="#efe0cd"/>
          <stop offset="100%" stop-color="#cfae8d"/>
        </linearGradient>
      </defs>
      <path d="M0 480V190C0 85 85 0 190 0s190 85 190 190v290Z" fill="url(#${gradientId("doc", key)})"/>
      <circle cx="190" cy="196" r="104" fill="#fdf7ee" fill-opacity="0.5"/>
      <circle cx="190" cy="196" r="104" fill="none" stroke="#a8724f" stroke-opacity="0.3" stroke-width="1.4"/>
      <text
        x="190"
        y="196"
        text-anchor="middle"
        dominant-baseline="central"
        font-family="Manrope, sans-serif"
        font-size="86"
        font-weight="300"
        letter-spacing="6"
        fill="#8a5c3c"
      >${escape(initials)}</text>
      <g fill="none" stroke="#fdf7ee" stroke-opacity="0.5" stroke-width="1.2">
        <path d="M-20 360c90-40 180-40 260-6s110 34 160 10"/>
        <path d="M-20 398c90-40 180-40 260-6s110 34 160 10"/>
      </g>
    </svg>`;
}

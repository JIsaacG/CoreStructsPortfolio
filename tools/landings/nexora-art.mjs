/**
 * Nexora — the drawn parts.
 *
 * The brief for this page rules out stock photography, so every visual is
 * geometry: a load curve, six invented logotypes, and one small diagram inside
 * each service tile. Keeping them here rather than in the page renderer means
 * `nexora.mjs` reads as a document outline instead of as a wall of path data.
 *
 * Everything is inline SVG with `currentColor` fills wherever the shape should
 * follow the surface it lands on, so a tile can be inverted without a second
 * copy of the drawing.
 */

import { escape } from "./shell.mjs";

/* --------------------------------------------------------------- hero panel */

const PLOT = { width: 320, height: 132, padX: 6, padY: 10 };

/** Map a 0–100 series onto the plot box. */
function points(series) {
  const stepX = (PLOT.width - PLOT.padX * 2) / (series.length - 1);
  const span = PLOT.height - PLOT.padY * 2;
  return series.map((value, index) => [
    PLOT.padX + index * stepX,
    PLOT.height - PLOT.padY - (value / 100) * span,
  ]);
}

/** A smooth path through the points, using mid-point cubic control handles. */
function curve(series) {
  const pts = points(series);
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const cx = (px + x) / 2;
    d += ` C${cx.toFixed(1)} ${py.toFixed(1)} ${cx.toFixed(1)} ${y.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

/** The same curve, closed against the baseline, for the area wash. */
function area(series) {
  const pts = points(series);
  const last = pts.at(-1);
  return `${curve(series)} L${last[0].toFixed(1)} ${PLOT.height} L${pts[0][0].toFixed(1)} ${PLOT.height} Z`;
}

/**
 * The composition beside the headline: one client's year, read three ways.
 * It is deliberately a *reading* and not a decoration — the numbers in it are
 * the same ones the case studies further down report.
 */
export function heroPanel(panel) {
  const { series, split, indicators } = panel;

  const gridLines = [0, 1, 2, 3]
    .map((i) => {
      const y = PLOT.padY + (i * (PLOT.height - PLOT.padY * 2)) / 3;
      return `<line x1="0" y1="${y.toFixed(1)}" x2="${PLOT.width}" y2="${y.toFixed(1)}" />`;
    })
    .join("");

  const bars = split
    .map(
      (item, index) => `        <div class="nx-panel__bar" style="--bar: ${item.value}%; --bar-index: ${index}">
          <span class="nx-panel__bar-label">${escape(item.label)}</span>
          <span class="nx-panel__bar-track"><span class="nx-panel__bar-fill"></span></span>
          <span class="nx-panel__bar-value">${item.value}&thinsp;%</span>
        </div>`,
    )
    .join("\n");

  const tiles = indicators
    .map(
      (item) => `        <div class="nx-panel__tile">
          <span class="nx-panel__tile-label">${escape(item.label)}</span>
          <span class="nx-panel__tile-value">${escape(item.value)}</span>
          <span class="nx-panel__tile-delta${item.positive ? " is-positive" : ""}">${escape(item.delta)}</span>
        </div>`,
    )
    .join("\n");

  return `      <figure class="nx-panel" data-reveal="scale">
        <figcaption class="nx-panel__head">
          <span class="nx-panel__title">${escape(panel.label)}</span>
          <span class="nx-panel__meta">${escape(panel.client)} · ${escape(panel.period)}</span>
        </figcaption>

        <div class="nx-panel__plot">
          <p class="nx-panel__caption">${escape(series.caption)}</p>
          <svg
            class="nx-panel__chart"
            viewBox="0 0 ${PLOT.width} ${PLOT.height}"
            preserveAspectRatio="none"
            role="img"
            aria-label="Capacidad operativa disponible: la línea proyectada sin intervención llega a 71 %, la observada con la transformación llega a 94 %."
          >
            <g class="nx-panel__grid" aria-hidden="true">${gridLines}</g>
            <path class="nx-panel__area" d="${area(series.after)}" />
            <path class="nx-panel__line nx-panel__line--before" d="${curve(series.before)}" />
            <path class="nx-panel__line nx-panel__line--after" d="${curve(series.after)}" />
          </svg>
          <div class="nx-panel__legend">
            <span class="nx-panel__key nx-panel__key--before">Sin intervención</span>
            <span class="nx-panel__key nx-panel__key--after">Con transformación</span>
          </div>
        </div>

        <div class="nx-panel__split">
${bars}
        </div>

        <div class="nx-panel__tiles">
${tiles}
        </div>
      </figure>`;
}

/* ------------------------------------------------------------------- logos */

/**
 * Six invented logotypes. Each takes a different construction — an arc, a
 * column series, a rotated square — because six marks built the same way read
 * as one client with six names.
 */
const MARKS = {
  arc: '<path d="M3 17a9 9 0 0 1 18 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="17" r="2" fill="currentColor"/>',
  bars: '<rect x="3" y="12" width="3.6" height="9" fill="currentColor"/><rect x="8.6" y="7" width="3.6" height="14" fill="currentColor"/><rect x="14.2" y="3" width="3.6" height="18" fill="currentColor" opacity="0.55"/>',
  diamond: '<path d="M12 2.5 21.5 12 12 21.5 2.5 12Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7.5 16.5 12 12 16.5 7.5 12Z" fill="currentColor"/>',
  ring: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/>',
  stack: '<rect x="3" y="4" width="18" height="4" rx="1" fill="currentColor"/><rect x="3" y="10" width="13" height="4" rx="1" fill="currentColor" opacity="0.6"/><rect x="3" y="16" width="8" height="4" rx="1" fill="currentColor" opacity="0.35"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" fill="currentColor"/><rect x="13.5" y="3" width="7.5" height="7.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="13.5" width="7.5" height="7.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13.5" y="13.5" width="7.5" height="7.5" fill="currentColor" opacity="0.5"/>',
};

export function clientLogo({ name, kind }) {
  return `          <li class="nx-logo">
            <svg class="nx-logo__mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${MARKS[kind]}</svg>
            <span class="nx-logo__name">${escape(name)}</span>
          </li>`;
}

/* ----------------------------------------------------------- service tiles */

/**
 * One drawing per service. They share a 120×80 box and a stroke weight so the
 * grid still reads as a set, and share nothing else.
 */
const SERVICE_ART = {
  compass: `<circle cx="60" cy="40" r="27" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.35"/>
    <circle cx="60" cy="40" r="17" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.2"/>
    <path d="M60 40 78 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="60" cy="40" r="3" fill="currentColor"/>
    <circle cx="78" cy="22" r="3.5" fill="currentColor"/>
    <path d="M18 62h22M18 68h34" stroke="currentColor" stroke-width="1.4" opacity="0.35" stroke-linecap="round"/>`,
  layers: `<path d="M60 12 96 30 60 48 24 30Z" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M24 42 60 60 96 42" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.55"/>
    <path d="M24 54 60 72 96 54" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.28"/>`,
  flow: `<rect x="12" y="30" width="24" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <rect x="48" y="14" width="24" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.5"/>
    <rect x="48" y="46" width="24" height="20" rx="3" fill="currentColor" opacity="0.12"/>
    <rect x="48" y="46" width="24" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <rect x="84" y="30" width="24" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M36 40h12M72 24h6a6 6 0 0 1 6 6v4M72 56h6a6 6 0 0 0 6-6v-4" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.7"/>`,
  chart: `<path d="M14 66h92" stroke="currentColor" stroke-width="1.2" opacity="0.3"/>
    <rect x="20" y="44" width="10" height="22" fill="currentColor" opacity="0.25"/>
    <rect x="36" y="34" width="10" height="32" fill="currentColor" opacity="0.4"/>
    <rect x="52" y="48" width="10" height="18" fill="currentColor" opacity="0.25"/>
    <rect x="68" y="24" width="10" height="42" fill="currentColor" opacity="0.6"/>
    <rect x="84" y="16" width="10" height="50" fill="currentColor"/>
    <path d="M25 40 41 30 57 44 73 20 89 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  grid: `<rect x="16" y="14" width="26" height="26" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <rect x="50" y="14" width="26" height="26" rx="3" fill="currentColor" opacity="0.14"/>
    <rect x="84" y="14" width="20" height="26" rx="3" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.45"/>
    <rect x="16" y="48" width="26" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.45"/>
    <rect x="50" y="48" width="54" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M56 59h10M70 59h14M88 59h10" stroke="currentColor" stroke-width="1.4" opacity="0.5" stroke-linecap="round"/>`,
  seat: `<path d="M22 58h76" stroke="currentColor" stroke-width="1.4" opacity="0.4"/>
    <circle cx="34" cy="40" r="7" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.5"/>
    <circle cx="52" cy="40" r="7" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.5"/>
    <circle cx="70" cy="40" r="7" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.5"/>
    <circle cx="88" cy="40" r="7" fill="currentColor"/>
    <path d="M88 20v9M84 24l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`,
};

export function serviceArt(kind) {
  return `<svg class="nx-tile__art" viewBox="0 0 120 80" aria-hidden="true" focusable="false">${SERVICE_ART[kind]}</svg>`;
}

/**
 * The bottle.
 *
 * One SVG, drawn on a 260x680 canvas, that the demo page pins to the viewport
 * and re-tints as the visitor scrolls past each flavour. Every colour is a
 * custom property so the same drawing serves all five recipes — nothing here
 * knows what hibiscus looks like, only where the liquid goes.
 *
 * The shapes are deliberately simple: this has to stay crisp at 60 % and at
 * 140 % of its natural size, and it has to weigh nothing.
 */

/** The glass outline, reused as both the silhouette and the liquid's clip. */
const SILHOUETTE =
  "M112 82 L112 176 C112 206 52 232 52 300 L52 618 Q52 646 80 646 " +
  "L180 646 Q208 646 208 618 L208 300 C208 232 148 206 148 176 L148 82 Z";

/** Bubbles rising through the liquid; the delay is what keeps them from marching. */
const bubbles = [
  { cx: 88, r: 4.5, delay: 0 },
  { cx: 130, r: 3, delay: 1.7 },
  { cx: 168, r: 5, delay: 3.1 },
  { cx: 104, r: 2.5, delay: 4.4 },
  { cx: 152, r: 3.5, delay: 2.3 },
  { cx: 118, r: 5.5, delay: 5.6 },
  { cx: 182, r: 2.5, delay: 6.4 },
  { cx: 72, r: 3, delay: 7.2 },
]
  .map(
    ({ cx, r, delay }) =>
      `<circle class="bt-bubble" cx="${cx}" cy="0" r="${r}" style="--bubble-delay:-${delay}s"/>`,
  )
  .join("");

export const bottle = `
  <defs>
    <clipPath id="bt-body">
      <path d="${SILHOUETTE}"/>
    </clipPath>

    <linearGradient id="bt-liquid-fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--flavour-tint)" stop-opacity="0.82"/>
      <stop offset="45%" stop-color="var(--flavour-tint)" stop-opacity="1"/>
      <stop offset="100%" stop-color="var(--flavour-deep)" stop-opacity="1"/>
    </linearGradient>

    <linearGradient id="bt-glass-sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="22%" stop-color="#ffffff" stop-opacity="0.04"/>
      <stop offset="72%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="94%" stop-color="#ffffff" stop-opacity="0.16"/>
    </linearGradient>

    <linearGradient id="bt-cap" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="var(--flavour-deep)"/>
      <stop offset="38%" stop-color="var(--flavour-tint)"/>
      <stop offset="100%" stop-color="var(--flavour-deep)"/>
    </linearGradient>
  </defs>

  <!-- Cap and collar -->
  <rect class="bt-cap" x="104" y="12" width="52" height="52" rx="7" fill="url(#bt-cap)"/>
  <path class="bt-cap-ridge" d="M112 20v36M122 20v36M130 20v36M138 20v36M148 20v36"/>
  <rect class="bt-collar" x="100" y="60" width="60" height="20" rx="5"/>

  <!-- Glass -->
  <path class="bt-glass" d="${SILHOUETTE}"/>

  <!-- Liquid, clipped to the glass so the shoulder curve shapes the fill -->
  <g clip-path="url(#bt-body)">
    <rect class="bt-liquid" x="40" y="252" width="180" height="420" fill="url(#bt-liquid-fade)"/>
    <rect class="bt-surface" x="40" y="252" width="180" height="7"/>
    <g class="bt-bubbles">${bubbles}</g>
  </g>

  <!-- Sheen sits above the liquid: it is the glass, not the drink -->
  <path class="bt-sheen" d="${SILHOUETTE}" fill="url(#bt-glass-sheen)"/>
  <path class="bt-outline" d="${SILHOUETTE}"/>

  <!-- Label plate. The type itself is HTML, laid over this in the page, so the
       plate is drawn wide enough for two lines of a long flavour name. -->
  <rect class="bt-label" x="54" y="366" width="152" height="192" rx="9"/>
  <rect class="bt-label-inner" x="62" y="374" width="136" height="176" rx="6"/>
`;

/**
 * The shelf version.
 *
 * The full bottle carries `<defs>` with ids, and five of those on one page would
 * collide, so the product cards get an id-free drawing: flat fills straight from
 * the card's `--product-tint`, no gradients, no bubbles, no clip path. At 8 rem
 * tall nobody misses them.
 */
export const bottleMini = `
  <path class="btm-liquid" d="M112 176 C112 206 52 232 52 300 L208 300 C208 232 148 206 148 176 Z"/>
  <path class="btm-liquid" d="M52 300 L208 300 L208 618 Q208 646 180 646 L80 646 Q52 646 52 618 Z"/>
  <rect class="btm-cap" x="104" y="12" width="52" height="52" rx="7"/>
  <rect class="btm-collar" x="100" y="60" width="60" height="20" rx="5"/>
  <path class="btm-outline" d="${SILHOUETTE}"/>
  <rect class="btm-label" x="54" y="366" width="152" height="192" rx="9"/>
  <path class="btm-rule" d="M80 442h100M80 476h64"/>
`;

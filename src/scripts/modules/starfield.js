/**
 * The ambient starfield.
 *
 * Brand-coloured motes rise slowly behind the whole page, swaying as they go
 * and breathing in and out on their own clock. Depth does most of the work: a
 * far mote is small, dim and slow, a near one is larger, brighter, and drifts
 * against the page as it scrolls, so the field has volume instead of reading as
 * a flat sheet of dots.
 *
 * The per-frame cost is kept flat on purpose. Every mote is a single
 * `drawImage` of a sprite pre-rendered once per brand colour, the field is
 * drawn additively so overlaps glow instead of stacking as opaque discs, and
 * the loop sleeps whenever the tab is hidden. Reduced motion does not freeze
 * the field — it strips it back to the rise alone, at a gentler pace: no sway,
 * no twinkle, no parallax, nothing that moves for its own sake.
 *
 * Colours are read from the token sheet at runtime — `tokens.css` stays the
 * only place a brand colour is written down.
 */

/** Motes per pixel² of viewport, then clamped: a density, not a fixed count. */
const DENSITY = 1 / 17000;
const MIN_MOTES = 24;
const MAX_MOTES = 130;

/** Retina is worth drawing for; past 2x nobody can see what it costs. */
const MAX_DPR = 2;

/** Rise speed, px per second, from the farthest mote to the nearest. */
const SPEED_FAR = 14;
const SPEED_NEAR = 46;

/** Drawn glow diameter in px, far to near. The lit core is a fraction of it. */
const SIZE_FAR = 3;
const SIZE_NEAR = 10;

/** Opacity range before the twinkle is applied. */
const ALPHA_FAR = 0.2;
const ALPHA_NEAR = 0.65;

/** How far the field lags the page while it scrolls, at full depth. */
const PARALLAX = 0.18;

/** Share of its pace the field keeps when the system asks for less motion. */
const CALM_PACE = 0.55;

/** Sideways drift: amplitude in px, and seconds per cycle. */
const SWAY_MAX = 14;
const SWAY_MIN_PERIOD = 6;
const SWAY_MAX_PERIOD = 15;

/** Share of its brightness a mote gives up at the dimmest point of a cycle. */
const TWINKLE_DEPTH = 0.55;
const TWINKLE_MIN_PERIOD = 2.6;
const TWINKLE_MAX_PERIOD = 7.5;

/**
 * A frame that arrives after a stall — a background tab, a long task — must
 * advance the field by a plausible step, never teleport it.
 */
const MAX_STEP = 1 / 20;

/** Sprites are drawn scaled down, so one modest bitmap covers every size. */
const SPRITE_SIZE = 64;

/** Vertical slack past each edge, so motes wrap around out of sight. */
const MARGIN = SIZE_NEAR;

/**
 * Mobile browsers fire `resize` every time the URL bar slides away. Re-seeding
 * the field on each of those would be visible; a small vertical change is left
 * to stretch the canvas instead, which on a field of soft dots is not.
 */
const RESIZE_TOLERANCE = 120;

const random = (min, max) => min + Math.random() * (max - min);
const lerp = (from, to, t) => from + (to - from) * t;

/** Parse `56 152 212` (or the legacy comma form) out of a custom property. */
function readRgb(styles, name, fallback) {
  const parts = styles.getPropertyValue(name).trim().split(/[\s,/]+/).map(Number);
  const rgb = parts.slice(0, 3);
  return rgb.length === 3 && rgb.every((channel) => Number.isFinite(channel)) ? rgb : fallback;
}

/** Mix a colour towards white — navy is too dark to read as a light unlifted. */
const lighten = (rgb, amount) => rgb.map((channel) => channel + (255 - channel) * amount);

const rgba = (rgb, alpha) =>
  `rgba(${rgb.map((channel) => Math.round(channel)).join(", ")}, ${alpha})`;

/**
 * One mote, pre-rendered: a hot core inside a soft halo. Drawing this scaled is
 * what makes a hundred glowing dots cost about as much as a hundred blits.
 */
function renderSprite(rgb) {
  const canvas = document.createElement("canvas");
  canvas.width = SPRITE_SIZE;
  canvas.height = SPRITE_SIZE;

  const ctx = canvas.getContext("2d");
  const centre = SPRITE_SIZE / 2;
  const glow = ctx.createRadialGradient(centre, centre, 0, centre, centre, centre);
  glow.addColorStop(0, rgba(lighten(rgb, 0.55), 1));
  glow.addColorStop(0.14, rgba(rgb, 0.72));
  glow.addColorStop(0.42, rgba(rgb, 0.16));
  glow.addColorStop(1, rgba(rgb, 0));

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return canvas;
}

/**
 * The three lights of the field, in the balance the identity already uses:
 * cyan leads, a lifted navy carries the middle, white is the rare highlight.
 */
function buildPalette() {
  const styles = getComputedStyle(document.documentElement);
  const cyan = readRgb(styles, "--brand-secondary-rgb", [56, 152, 212]);
  const navy = readRgb(styles, "--brand-primary-rgb", [37, 56, 128]);

  return [
    { sprite: renderSprite(cyan), share: 0.5 },
    { sprite: renderSprite(lighten(navy, 0.42)), share: 0.32 },
    { sprite: renderSprite([255, 255, 255]), share: 0.18 },
  ];
}

/** Pick a sprite by weight, so the mix holds at any density. */
function pickSprite(palette) {
  let roll = Math.random();
  for (const entry of palette) {
    roll -= entry.share;
    if (roll <= 0) return entry.sprite;
  }
  return palette[palette.length - 1].sprite;
}

function createMote(palette, width, span) {
  // Squared, so the field is mostly distant motes with a few near ones in front
  // of them: an even spread reads as a flat wall of identical dots.
  const depth = Math.random() ** 2;

  return {
    x: Math.random() * width,
    y: Math.random() * span,
    depth,
    sprite: pickSprite(palette),
    size: lerp(SIZE_FAR, SIZE_NEAR, depth),
    speed: lerp(SPEED_FAR, SPEED_NEAR, depth),
    alpha: lerp(ALPHA_FAR, ALPHA_NEAR, depth) * random(0.7, 1),
    sway: random(4, SWAY_MAX) * lerp(0.4, 1, depth),
    swayRate: (Math.PI * 2) / random(SWAY_MIN_PERIOD, SWAY_MAX_PERIOD),
    swayPhase: Math.random() * Math.PI * 2,
    twinkleRate: (Math.PI * 2) / random(TWINKLE_MIN_PERIOD, TWINKLE_MAX_PERIOD),
    twinklePhase: Math.random() * Math.PI * 2,
  };
}

export function initStarfield() {
  const canvas = document.querySelector("[data-starfield]");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const palette = buildPalette();

  let width = 0;
  let height = 0;
  let span = 0;
  let motes = [];
  let elapsed = 0;
  let last = 0;
  let frame = 0;

  /** Size the backing store to the viewport and top the population back up. */
  const measure = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    span = height + MARGIN * 2;

    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Overlapping motes should add light, the way real ones would, rather than
    // painting over one another.
    ctx.globalCompositeOperation = "lighter";

    const target = Math.round(
      Math.min(MAX_MOTES, Math.max(MIN_MOTES, width * height * DENSITY)),
    );
    while (motes.length > target) motes.pop();
    while (motes.length < target) motes.push(createMote(palette, width, span));
  };

  /** `calm` is the reduced-motion field: the rise, and nothing else. */
  const draw = (calm = reducedMotion.matches) => {
    ctx.clearRect(0, 0, width, height);

    // The canvas is fixed, so the page sliding underneath it is what gives the
    // near motes something to lag behind.
    const scrolled = calm ? 0 : window.scrollY * PARALLAX;

    for (const mote of motes) {
      // `y` is the mote's own place in the field; the parallax offset is applied
      // at draw time, so scrolling back up retraces the same path.
      const offset = (((mote.y - scrolled * mote.depth) % span) + span) % span;
      const y = offset - MARGIN;
      const x = calm
        ? mote.x
        : mote.x + Math.sin(elapsed * mote.swayRate + mote.swayPhase) * mote.sway;

      const dip = 0.5 - 0.5 * Math.cos(elapsed * mote.twinkleRate + mote.twinklePhase);
      ctx.globalAlpha = calm ? mote.alpha : mote.alpha * (1 - TWINKLE_DEPTH * dip);
      ctx.drawImage(mote.sprite, x - mote.size / 2, y - mote.size / 2, mote.size, mote.size);
    }

    ctx.globalAlpha = 1;
  };

  const render = (now) => {
    const calm = reducedMotion.matches;
    const step = last ? Math.min(MAX_STEP, (now - last) / 1000) : 0;
    last = now;
    // The sway and the twinkle are the two things a calm field gives up, and
    // both run off this clock — so the clock stops with them, and they resume
    // from where they left off rather than snapping to a new phase.
    if (!calm) elapsed += step;

    const pace = calm ? CALM_PACE : 1;
    for (const mote of motes) {
      mote.y -= mote.speed * pace * step;
      if (mote.y < 0) mote.y += span;
    }

    draw(calm);
    frame = requestAnimationFrame(render);
  };

  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  };

  /** Run the field, unless there is nobody looking at it. */
  const sync = () => {
    stop();
    if (document.hidden) return;
    frame = requestAnimationFrame(render);
  };

  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;
  let resizeFrame = 0;

  const resize = () => {
    resizeFrame = 0;
    const widthChanged = window.innerWidth !== lastWidth;
    const heightJumped = Math.abs(window.innerHeight - lastHeight) > RESIZE_TOLERANCE;
    if (!widthChanged && !heightJumped) return;

    lastWidth = window.innerWidth;
    lastHeight = window.innerHeight;
    measure();
    if (!frame) draw();
  };

  window.addEventListener(
    "resize",
    () => {
      if (!resizeFrame) resizeFrame = requestAnimationFrame(resize);
    },
    { passive: true },
  );

  // A hidden tab is given no frames anyway; dropping the loop keeps the page
  // from waking to a queued animation the moment it comes back.
  document.addEventListener("visibilitychange", sync);

  measure();
  draw();
  canvas.classList.add("is-awake");
  sync();
}

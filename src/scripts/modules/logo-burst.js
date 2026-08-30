/**
 * The burst the logo throws off when it is pressed.
 *
 * Clicking — or tapping — the hero isotype scatters a handful of brand-blue
 * sparks out of the point that was touched: cyan leads, a lifted navy carries
 * the middle, a pale cyan picks out the highlights. They fly out fast, are
 * pulled up short by the air, drift upwards as they cool, and are gone inside
 * of a second, leaving the mark exactly as it was.
 *
 * It is an easter egg, so it is built to cost nothing when nobody is playing
 * with it: the canvas stays empty, no loop runs, and the only listener on the
 * page is the one waiting for the press. The loop starts on the burst and shuts
 * itself down the moment the last spark has burnt out.
 *
 * The drawing follows the ambient field behind it — one `drawImage` of a sprite
 * pre-rendered once per colour, painted additively so overlapping sparks add
 * light instead of stacking as opaque discs. Reduced motion keeps the burst but
 * takes the flight out of it: the sparks appear scattered around the press and
 * fade where they stand, which changes light rather than position.
 *
 * Colours are read from the token sheet at runtime — `tokens.css` stays the
 * only place a brand colour is written down.
 */

/** The mark width the tuning below is written against, in CSS px. */
const REFERENCE_WIDTH = 240;

/** Sparks per burst. */
const COUNT_MIN = 22;
const COUNT_MAX = 30;

/** Launch speed at the reference size, px per second. */
const SPEED_MIN = 170;
const SPEED_MAX = 540;

/** Share of its speed a spark keeps per second: the air it is flying through. */
const DRAG = 0.05;

/** Upward pull, px/s², so the sparks lift as they cool, like the field behind. */
const LIFT = 110;

/** Seconds a single spark lasts. */
const LIFE_MIN = 0.62;
const LIFE_MAX = 1.15;

/** Drawn glow diameter at the reference size, in px. */
const SIZE_MIN = 3.5;
const SIZE_MAX = 11;

/** How much of its size a spark gives up as it burns down. */
const SHRINK = 0.35;

/** Scatter radius of the reduced-motion bloom, as a share of the mark width. */
const CALM_SPREAD = 0.42;

/** The flash at the point of impact: width as a share of the mark, and seconds. */
const FLASH_WIDTH = 0.85;
const FLASH_LIFE = 0.36;
/** How small it starts before it blooms out to full width. */
const FLASH_FROM = 0.3;

/** Ceiling on live sparks, so leaning on the mouse button stays cheap. */
const MAX_SPARKS = 260;

/** A frame that arrives after a stall must advance the burst, never teleport it. */
const MAX_STEP = 1 / 20;

/** Retina is worth drawing for; past 2x nobody can see what it costs. */
const MAX_DPR = 2;

/** Sparks are drawn scaled down, so one modest bitmap covers every size. */
const SPRITE_SIZE = 64;

const random = (min, max) => min + Math.random() * (max - min);

/** Parse `56 152 212` (or the legacy comma form) out of a custom property. */
function readRgb(styles, name, fallback) {
  const parts = styles.getPropertyValue(name).trim().split(/[\s,/]+/).map(Number);
  const rgb = parts.slice(0, 3);
  return rgb.length === 3 && rgb.every((channel) => Number.isFinite(channel)) ? rgb : fallback;
}

/** Mix a colour towards white — navy is too dark to read as a spark unlifted. */
const lighten = (rgb, amount) => rgb.map((channel) => channel + (255 - channel) * amount);

const rgba = (rgb, alpha) =>
  `rgba(${rgb.map((channel) => Math.round(channel)).join(", ")}, ${alpha})`;

/** One spark, pre-rendered: a hot core inside a soft halo. */
function renderSprite(rgb) {
  const canvas = document.createElement("canvas");
  canvas.width = SPRITE_SIZE;
  canvas.height = SPRITE_SIZE;

  const ctx = canvas.getContext("2d");
  const centre = SPRITE_SIZE / 2;
  const glow = ctx.createRadialGradient(centre, centre, 0, centre, centre, centre);
  glow.addColorStop(0, rgba(lighten(rgb, 0.75), 1));
  glow.addColorStop(0.16, rgba(lighten(rgb, 0.14), 0.9));
  glow.addColorStop(0.44, rgba(rgb, 0.26));
  glow.addColorStop(1, rgba(rgb, 0));

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return canvas;
}

/**
 * Three lights, all of them the institutional blue: the cyan accent, the navy
 * lifted until it reads on a dark page, and a pale cyan for the highlights.
 */
function buildPalette() {
  const styles = getComputedStyle(document.documentElement);
  const cyan = readRgb(styles, "--brand-secondary-rgb", [56, 152, 212]);
  const navy = readRgb(styles, "--brand-primary-rgb", [37, 56, 128]);

  return {
    sparks: [
      { sprite: renderSprite(cyan), share: 0.5 },
      { sprite: renderSprite(lighten(navy, 0.42)), share: 0.34 },
      { sprite: renderSprite(lighten(cyan, 0.55)), share: 0.16 },
    ],
    // The impact flash is the brightest thing in the burst, so it is drawn with
    // the palest of the three rather than a fourth, whiter colour.
    flash: renderSprite(lighten(cyan, 0.4)),
  };
}

/** Pick a sprite by weight, so the mix holds however many sparks are thrown. */
function pickSprite(sparks) {
  let roll = Math.random();
  for (const entry of sparks) {
    roll -= entry.share;
    if (roll <= 0) return entry.sprite;
  }
  return sparks[sparks.length - 1].sprite;
}

export function initLogoBurst() {
  const logo = document.querySelector("[data-logo]");
  const canvas = logo?.querySelector("[data-logo-burst]");
  const ctx = canvas?.getContext("2d");
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const palette = buildPalette();

  /** Live sparks, oldest first, and the flash behind them. */
  const sparks = [];
  const flashes = [];

  let width = 0;
  let height = 0;
  let clock = 0;
  let last = 0;
  let frame = 0;

  /**
   * Size the backing store to the box the canvas is already occupying. The mark
   * is fluid, so this is checked on every press rather than from a resize
   * listener: re-allocating the bitmap costs nothing next to a burst, and a
   * resize between two presses is the only thing that can change the answer.
   */
  const measure = () => {
    if (canvas.offsetWidth === width && canvas.offsetHeight === height) return;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;

    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    // Assigning either dimension resets the context, so the transform and the
    // blend mode are set here, after the resize, and nowhere else.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "lighter";
  };

  /** Move what is still alive, and drop what is not. */
  const advance = (step) => {
    // Compacting in place: `alive` never runs ahead of the read index, so this
    // only ever overwrites entries that have already been dealt with.
    let alive = 0;
    for (const spark of sparks) {
      if (clock - spark.born >= spark.life) continue;
      // Exponential, so a spark loses most of its speed in the first moment and
      // then coasts — a burst rather than a constant spray.
      const kept = DRAG ** step;
      spark.vx *= kept;
      spark.vy = spark.vy * kept - spark.lift * step;
      spark.x += spark.vx * step;
      spark.y += spark.vy * step;
      sparks[alive] = spark;
      alive += 1;
    }
    sparks.length = alive;

    alive = 0;
    for (const flash of flashes) {
      if (clock - flash.born >= FLASH_LIFE) continue;
      flashes[alive] = flash;
      alive += 1;
    }
    flashes.length = alive;
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (const flash of flashes) {
      const age = (clock - flash.born) / FLASH_LIFE;
      const size = flash.size * (flash.from + (1 - flash.from) * age);
      // Squared, so the flash is spent almost as soon as it lands: it marks the
      // press, it does not sit on the mark.
      ctx.globalAlpha = 0.5 * (1 - age) ** 2;
      ctx.drawImage(palette.flash, flash.x - size / 2, flash.y - size / 2, size, size);
    }

    for (const spark of sparks) {
      const age = (clock - spark.born) / spark.life;
      const size = spark.size * (1 - SHRINK * age);
      // Held bright for a moment, then let go, rather than draining evenly.
      ctx.globalAlpha = spark.alpha * (1 - age) ** 1.6;
      ctx.drawImage(spark.sprite, spark.x - size / 2, spark.y - size / 2, size, size);
    }

    ctx.globalAlpha = 1;
  };

  const render = (now) => {
    const step = last ? Math.min(MAX_STEP, (now - last) / 1000) : 0;
    last = now;
    clock += step;

    advance(step);
    draw();

    if (sparks.length || flashes.length) {
      frame = requestAnimationFrame(render);
      return;
    }
    // Nothing left to draw: wipe the canvas once and stand down until the next
    // press, so an idle logo is never holding a loop open.
    ctx.clearRect(0, 0, width, height);
    frame = 0;
    last = 0;
  };

  /** Throw a burst from a point in canvas space. */
  const burst = (x, y) => {
    measure();
    if (!width || !height) return;

    const calm = reducedMotion.matches;
    const mark = logo.offsetWidth || REFERENCE_WIDTH;
    const scale = mark / REFERENCE_WIDTH;
    const count = Math.round(random(COUNT_MIN, COUNT_MAX));
    // Angles are dealt around a full turn from a random start, so the burst
    // spreads evenly instead of clumping the way pure randomness does.
    const start = Math.random() * Math.PI * 2;

    for (let index = 0; index < count; index += 1) {
      const angle = start + (index / count) * Math.PI * 2 + random(-0.12, 0.12);
      const speed = calm ? 0 : random(SPEED_MIN, SPEED_MAX) * scale;
      // With nowhere to fly, the calm burst is laid out roughly where the sparks
      // would have reached, and simply fades from there.
      const reach = calm ? random(0, CALM_SPREAD * mark) : 0;

      sparks.push({
        x: x + Math.cos(angle) * reach,
        y: y + Math.sin(angle) * reach,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        // The lift is movement like any other, so a calm burst does without it
        // and every spark stays exactly where it was laid down.
        lift: calm ? 0 : LIFT,
        sprite: pickSprite(palette.sparks),
        size: random(SIZE_MIN, SIZE_MAX) * scale,
        alpha: random(0.55, 1),
        life: random(LIFE_MIN, LIFE_MAX),
        born: clock,
      });
    }

    // A calm flash blooms nowhere: it opens at full width and only fades.
    flashes.push({ x, y, size: FLASH_WIDTH * mark, from: calm ? 1 : FLASH_FROM, born: clock });
    if (sparks.length > MAX_SPARKS) sparks.splice(0, sparks.length - MAX_SPARKS);

    if (!frame) frame = requestAnimationFrame(render);
  };

  logo.addEventListener(
    "pointerdown",
    (event) => {
      const box = canvas.getBoundingClientRect();
      if (!box.width || !box.height) return;
      // The hero scales as it scrolls away, so the box on screen is not the box
      // the canvas was laid out at: the press is mapped back through that.
      burst(
        (event.clientX - box.left) * (canvas.offsetWidth / box.width),
        (event.clientY - box.top) * (canvas.offsetHeight / box.height),
      );
    },
    { passive: true },
  );

  measure();
}

/**
 * The effervescence — the demo's answer to the portfolio's starfield.
 *
 * Bubbles rise behind the whole page, in the colour of whatever flavour the
 * visitor is scrolling through. It is the same idea as the field of motes on
 * index.html and deliberately not the same behaviour, because the two are
 * describing different things: a star hangs, a bubble is on its way somewhere.
 *
 * What makes it read as carbonation rather than as dots drifting upwards:
 *
 *   · a bubble is born at the bottom and dies at the top. It pops — swells,
 *     goes bright, and is gone in a third of a second — instead of wrapping
 *     around the way the motes do;
 *   · it accelerates as it goes. Pressure drops on the way up, the bubble
 *     grows, and a bigger bubble climbs faster, so the last third of the
 *     journey is visibly quicker than the first;
 *   · it zigzags, and the zigzag widens as it speeds up;
 *   · most of them come from a handful of nucleation points, in chains, the
 *     way they do off a scratch in the glass — the rest are scattered.
 *
 * Scrolling shakes the bottle. The wheel's delta drags the whole field against
 * the page and decays away, and while it is decaying every bubble climbs faster
 * — so a flick down releases a burst that settles back on its own.
 *
 * Cost is kept flat the same way the starfield keeps it flat: one `drawImage`
 * of a pre-rendered sprite per bubble, additive blending so overlaps glow
 * instead of stacking, sprites cached per colour, and no loop at all while the
 * tab is hidden. The motion itself is unconditional — like the pinned bottle,
 * this is the page's subject rather than decoration laid over it — and stands
 * down only where there is nobody to see it.
 */

/** Bubbles per pixel² of viewport, then clamped: a density, not a fixed count. */
const DENSITY = 1 / 15000;
const MIN_BUBBLES = 28;
const MAX_BUBBLES = 110;

/**
 * The compact profile, below the width the layout calls a phone.
 *
 * A density in px² is the right way to seed a field and the wrong way to judge
 * one: a phone is a fifth of a laptop's area, so it was getting a fifth of the
 * bubbles, and the ones it did get were mostly the small dim far ones. On top of
 * that the ambient washes are raised on touch devices — see `base.css` — so the
 * field was being read against a lighter background than the one it was tuned
 * for. The count goes up, the bubbles come nearer, and both gains land where
 * they are needed rather than everywhere.
 */
const COMPACT_WIDTH = 768;
const COMPACT_DENSITY = 1.9;
const COMPACT_SIZE = 1.3;
const COMPACT_ALPHA = 1.35;

/**
 * The exponent on a bubble's depth. Squared-ish, so the field is mostly distant
 * bubbles with a few near ones in front of them; nearer to linear on a phone,
 * where the far ones are too small to survive the trip.
 */
const DEPTH_BIAS = 1.6;
const COMPACT_DEPTH = 1.15;

/** Retina is worth drawing for; past 2x nobody can see what it costs. */
const MAX_DPR = 2;

/** Drawn diameter in px at birth, from the farthest bubble to the nearest. */
const SIZE_FAR = 4.5;
const SIZE_NEAR = 19;

/** Rise speed, px per second, far to near. Buoyancy, so size and speed agree. */
const SPEED_FAR = 24;
const SPEED_NEAR = 86;

/** How much wider a bubble is at the surface than at the bottom. */
const GROWTH = 0.42;

/** Opacity range. A near bubble is brighter as well as bigger. */
const ALPHA_FAR = 0.26;
const ALPHA_NEAR = 0.72;

/** The zigzag: amplitude in px at full depth, and seconds per cycle. */
const WOBBLE_MAX = 15;
const WOBBLE_MIN_PERIOD = 1.7;
const WOBBLE_MAX_PERIOD = 4.4;
/** Share of the amplitude a bubble has at birth; it opens up as it climbs. */
const WOBBLE_START = 0.35;

/** The pop: how much it swells, how bright it goes, and for how long. */
const POP_SWELL = 1.7;
const POP_GAIN = 1.6;
const POP_SPAN = 0.34;

/** Where the surface is, as a share of the viewport measured from the top. */
const SURFACE_MIN = -0.04;
const SURFACE_MAX = 0.14;

/** Bubble streams: how many, and the share of the field that joins one. */
const STREAMS = 4;
const STREAM_SHARE = 0.5;
/** A stream's bubbles are finer than the loose ones, and wander less. */
const STREAM_SIZE = 0.68;
const STREAM_WOBBLE = 0.45;

/** How far below the fold a reborn bubble waits, so a stream arrives as a chain. */
const QUEUE_MAX = 320;

/** Scroll drag: pixels of lag per pixel scrolled, and how fast it lets go. */
const DRAG = 0.55;
const DRAG_DECAY = 0.9;
/** The drag that counts as a full shake, and the extra pace it buys. */
const DRAG_FULL = 90;
const SHAKE_GAIN = 0.85;

/**
 * A frame that arrives after a stall — a background tab, a long task — must
 * advance the field by a plausible step, never teleport it.
 */
const MAX_STEP = 1 / 20;

/** Sprites are drawn scaled down, so one modest bitmap covers every size. */
const SPRITE_SIZE = 64;

/** Slack past each edge, so a bubble is never seen arriving or leaving. */
const MARGIN = SIZE_NEAR * 2;

/** Seconds between checks of the flavour colour, and the length of the fade. */
const TINT_INTERVAL = 0.4;
const TINT_FADE = 0.7;

/**
 * Mobile browsers fire `resize` every time the URL bar slides away. Re-seeding
 * the field on each of those would be visible; a small vertical change is left
 * to stretch the canvas instead, which on a field of soft rings is not.
 */
const RESIZE_TOLERANCE = 120;

const random = (min, max) => min + Math.random() * (max - min);
const lerp = (from, to, t) => from + (to - from) * t;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** Share of the pop spent brightening; the rest is the fall to nothing. */
const POP_ATTACK = 0.22;

/**
 * The shape of a burst, as a multiple of the bubble's own brightness: it leaves
 * the level it was already at, flares, and is gone. Starting at 1 rather than at
 * the peak is what keeps the pop reading as the same bubble.
 */
function burst(progress) {
  return progress < POP_ATTACK
    ? lerp(1, 1 + POP_GAIN, progress / POP_ATTACK)
    : (1 + POP_GAIN) * ((1 - progress) / (1 - POP_ATTACK)) ** 1.5;
}

/** Parse `224 81 138` (or the legacy comma form) out of a custom property. */
function readRgb(styles, name, fallback) {
  const parts = styles.getPropertyValue(name).trim().split(/[\s,/]+/).map(Number);
  const rgb = parts.slice(0, 3);
  return rgb.length === 3 && rgb.every((channel) => Number.isFinite(channel)) ? rgb : fallback;
}

/** Mix a colour towards white — a bubble is lit, not painted. */
const lighten = (rgb, amount) => rgb.map((channel) => channel + (255 - channel) * amount);

const rgba = (rgb, alpha) =>
  `rgba(${rgb.map((channel) => Math.round(channel)).join(", ")}, ${alpha})`;

/**
 * One bubble, pre-rendered: a bright rim around a hollow middle, with a
 * highlight up and to the left. The rim is what separates a bubble from a dot —
 * a filled disc at this size reads as a speck of dust.
 */
function renderSprite(rgb) {
  const canvas = document.createElement("canvas");
  canvas.width = SPRITE_SIZE;
  canvas.height = SPRITE_SIZE;

  const ctx = canvas.getContext("2d");
  const centre = SPRITE_SIZE / 2;

  const shell = ctx.createRadialGradient(centre, centre, 0, centre, centre, centre);
  shell.addColorStop(0, rgba(rgb, 0.06));
  shell.addColorStop(0.52, rgba(rgb, 0.12));
  shell.addColorStop(0.78, rgba(lighten(rgb, 0.35), 0.92));
  shell.addColorStop(0.88, rgba(lighten(rgb, 0.15), 0.32));
  shell.addColorStop(1, rgba(rgb, 0));

  ctx.fillStyle = shell;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

  // The catchlight. Small, off-centre, and the only white in the sprite.
  const spot = SPRITE_SIZE * 0.34;
  const glint = ctx.createRadialGradient(spot, spot, 0, spot, spot, SPRITE_SIZE * 0.17);
  glint.addColorStop(0, "rgba(255, 255, 255, 0.7)");
  glint.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = glint;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

  return canvas;
}

/** Sprites are cheap to draw and not free to build, so each colour is kept. */
const sprites = new Map();

function spriteFor(rgb) {
  const key = rgb.map(Math.round).join(",");
  if (!sprites.has(key)) sprites.set(key, renderSprite(rgb));
  return { key, sprite: sprites.get(key) };
}

/** Send a bubble back to the bottom, either into a stream or on its own. */
function seed(bubble, field, first) {
  const { width, height, streams } = field;
  const stream = Math.random() < STREAM_SHARE ? streams[(Math.random() * streams.length) | 0] : null;

  bubble.depth = Math.random() ** field.depthBias;
  bubble.x = stream ? stream + random(-3, 3) : Math.random() * width;
  bubble.size =
    lerp(SIZE_FAR, SIZE_NEAR, bubble.depth) * field.sizeGain * (stream ? STREAM_SIZE : 1);
  bubble.speed = lerp(SPEED_FAR, SPEED_NEAR, bubble.depth) * (stream ? 1.15 : 1);
  bubble.alpha = lerp(ALPHA_FAR, ALPHA_NEAR, bubble.depth) * field.alphaGain * random(0.75, 1);
  bubble.wobble = random(5, WOBBLE_MAX) * bubble.depth * (stream ? STREAM_WOBBLE : 1);
  bubble.wobbleRate = (Math.PI * 2) / random(WOBBLE_MIN_PERIOD, WOBBLE_MAX_PERIOD);
  bubble.wobblePhase = Math.random() * Math.PI * 2;
  bubble.surface = height * random(SURFACE_MIN, SURFACE_MAX);
  bubble.popped = null;

  /* At load the field is already going, so the first generation is spread over
     the whole climb. Every one after that queues below the fold, which is what
     spaces a stream out into a chain instead of a clump. */
  bubble.y = first
    ? random(bubble.surface, height + MARGIN)
    : height + MARGIN + Math.random() * field.queue;

  return bubble;
}

export function initFizz() {
  const canvas = document.querySelector("[data-fizz]");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const root = document.documentElement;

  let width = 0;
  let height = 0;
  let bubbles = [];
  /* Everything a bubble needs to know about the glass it is being born into.
     Held as one object because `measure` writes it and `seed` reads all of it. */
  const field = {
    width: 0,
    height: 0,
    streams: [],
    sizeGain: 1,
    alphaGain: 1,
    depthBias: DEPTH_BIAS,
    queue: QUEUE_MAX,
  };
  let clock = 0;
  let last = 0;
  let frame = 0;

  /* Drag is what the wheel leaves behind: it moves the field and decays. */
  let previousScroll = window.scrollY;
  let drag = 0;

  /* The flavour beat repoints `--brand-secondary` as the visitor scrolls, so
     the tint is read from the page rather than held here. Two sprites are kept
     across a change and the field is drawn twice for the length of the fade,
     which is what stops five flavours from snapping between colours. */
  let current = spriteFor([224, 81, 138]);
  let previous = null;
  let fade = 1;
  let sinceTint = TINT_INTERVAL;

  const readTint = () => {
    const styles = getComputedStyle(root);
    const rgb = lighten(readRgb(styles, "--brand-secondary-rgb", [224, 81, 138]), 0.1);
    const next = spriteFor(rgb);
    if (next.key === current.key) return;
    previous = current;
    current = next;
    fade = 0;
  };

  /** Size the backing store to the viewport and top the population back up. */
  const measure = () => {
    width = window.innerWidth;
    height = window.innerHeight;

    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Overlapping bubbles should add light, the way real ones would, rather
    // than painting over one another.
    ctx.globalCompositeOperation = "lighter";

    const compact = width < COMPACT_WIDTH;
    field.width = width;
    field.height = height;
    field.sizeGain = compact ? COMPACT_SIZE : 1;
    field.alphaGain = compact ? COMPACT_ALPHA : 1;
    field.depthBias = compact ? COMPACT_DEPTH : DEPTH_BIAS;
    /* A bubble waiting its turn is a bubble nobody can see, so the queue is
       never allowed to run deeper than a third of the screen it feeds — on a
       phone a fixed 320 px of it would be most of the field, held off stage. */
    field.queue = Math.min(QUEUE_MAX, height * 0.35);

    /* The nucleation points move with the viewport but not with every frame:
       a stream that wandered would stop reading as a scratch in the glass. */
    field.streams = Array.from({ length: STREAMS }, (_, index) =>
      Math.round(width * ((index + random(0.25, 0.75)) / STREAMS)),
    );

    const target = Math.round(
      Math.min(
        MAX_BUBBLES,
        Math.max(MIN_BUBBLES, width * height * DENSITY * (compact ? COMPACT_DENSITY : 1)),
      ),
    );
    while (bubbles.length > target) bubbles.pop();
    while (bubbles.length < target) bubbles.push(seed({}, field, true));
  };

  /** Every bubble, once per sprite the field is currently crossfading between. */
  const paint = (sprite, mix) => {
    for (const bubble of bubbles) {
      /* How far up the glass it is, 0 at the bottom and 1 at the surface. The
         bubble grows across it, and the growth is what accelerates the climb. */
      const climb = clamp(1 - (bubble.y - bubble.surface) / (height + MARGIN), 0, 1);
      const pop = bubble.popped === null ? 0 : clamp((clock - bubble.popped) / POP_SPAN, 0, 1);

      const size = bubble.size * (1 + GROWTH * climb) * (1 + POP_SWELL * pop);
      const swing = bubble.wobble * lerp(WOBBLE_START, 1, climb);
      const x = bubble.x + Math.sin(clock * bubble.wobbleRate + bubble.wobblePhase) * swing;
      const y = bubble.y + drag * bubble.depth;

      /* A popping bubble goes bright and then vanishes inside a third of a
         second; everything else fades in as it leaves the bottom margin.

         The burst starts at the level the bubble was already at rather than at
         its peak — a flash that begins at full brightness reads as a bubble
         being replaced by a different, brighter one. */
      const level =
        bubble.popped === null
          ? bubble.alpha * clamp((height + MARGIN - bubble.y) / MARGIN, 0, 1)
          : bubble.alpha * burst(pop);

      ctx.globalAlpha = Math.min(1, level * mix);
      ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    if (previous && fade < 1) paint(previous.sprite, 1 - fade);
    paint(current.sprite, fade);
    ctx.globalAlpha = 1;
  };

  const render = (now) => {
    const step = last ? Math.min(MAX_STEP, (now - last) / 1000) : 0;
    last = now;
    clock += step;

    const scroll = window.scrollY;
    drag += (scroll - previousScroll) * DRAG;
    previousScroll = scroll;
    drag *= DRAG_DECAY ** (step * 60);
    if (Math.abs(drag) < 0.05) drag = 0;

    // Shaking the bottle releases the gas: the harder the page is moving, the
    // faster the whole field climbs, and it settles as the drag lets go.
    const pace = 1 + Math.min(1, Math.abs(drag) / DRAG_FULL) * SHAKE_GAIN;

    for (const bubble of bubbles) {
      if (bubble.popped !== null) {
        if (clock - bubble.popped > POP_SPAN) seed(bubble, field, false);
        continue;
      }

      const climb = clamp(1 - (bubble.y - bubble.surface) / (height + MARGIN), 0, 1);
      bubble.y -= bubble.speed * (1 + GROWTH * climb) * pace * step;
      if (bubble.y <= bubble.surface) bubble.popped = clock;
    }

    sinceTint += step;
    if (sinceTint >= TINT_INTERVAL) {
      sinceTint = 0;
      readTint();
    }
    if (fade < 1) fade = Math.min(1, fade + step / TINT_FADE);

    draw();
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
    previousScroll = window.scrollY;
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

  readTint();
  fade = 1;
  measure();
  draw();
  canvas.classList.add("is-awake");
  sync();
}

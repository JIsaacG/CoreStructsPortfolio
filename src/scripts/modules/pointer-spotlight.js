/**
 * Draws the cursor light: a wake, and the head that rides at the front of it.
 *
 * The head trails the pointer instead of being pinned to it, and stretches
 * along its direction of travel while it catches up — the faster the movement,
 * the more it smears, settling back into a circle at rest. Behind it, the path
 * it just took stays lit for a moment: each point of the wake fades out, spreads
 * as it goes, and cools from brand cyan towards brand navy, so the trail reads
 * as light dispersing rather than as a row of dots.
 *
 * The wake is sampled from the eased position of the head, never from the raw
 * pointer, which is what keeps the light at the front of its trail instead of
 * chasing it. Sampling is by distance travelled rather than per frame, so a slow
 * drift lays down the same trail as a fast one — just less of it.
 *
 * One pointer listener, one loop, and the loop shuts itself down once the head
 * has arrived and the last of the wake has burned out, so a still pointer costs
 * nothing.
 */

/** How much of the remaining distance is covered each frame: the lag. */
const FOLLOW = 0.13;
/** Per-frame travel, in px, that produces the maximum smear. */
const FULL_SMEAR_SPEED = 240;
const MAX_SMEAR = 0.4;
/** Below this per-frame travel the head has arrived and can stop being moved. */
const REST_THRESHOLD = 0.12;

/** How long a point of the wake stays lit, in ms. */
const TRAIL_LIFETIME = 620;
/** Distance between points along the path. Close enough to read as a stroke. */
const TRAIL_STEP = 16;
/** Radius of a fresh point, in CSS px, and how far it spreads before it dies. */
const TRAIL_RADIUS = 44;
const TRAIL_SPREAD = 1.55;
/**
 * Peak alpha of a single point. Kept low because the points are drawn additively
 * and overlap heavily along the stroke — this is the value of one contribution,
 * not of the wake.
 */
const TRAIL_ALPHA = 0.05;
/** Steps on the cyan → navy ramp. Each is pre-rendered once, then just stamped. */
const TRAIL_STAGES = 6;
/**
 * How far towards navy the oldest point gets. Never all the way: it keeps some
 * of the cyan, so the tail still reads as the same light that laid it down.
 */
const TRAIL_COOLING = 0.8;
/** The wake is all soft gradient, so half resolution is free smoothing. */
const TRAIL_SCALE = 0.5;
/** Ceiling on live points, in case a burst of movement outruns the lifetime. */
const TRAIL_MAX = 400;

/** Read a brand colour out of the token sheet, so it is declared in one place. */
function readBrandRgb(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const channels = raw.trim().split(/[\s,/]+/).slice(0, 3).map(Number);
  return channels.length === 3 && channels.every(Number.isFinite) ? channels : fallback;
}

const mixRgb = (from, to, amount) =>
  from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));

/**
 * Pre-renders one point of the wake. Stamping a bitmap is a fraction of the cost
 * of building a gradient per point per frame, and there are hundreds of points.
 */
function renderStamp([r, g, b], size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  const centre = size / 2;
  const gradient = context.createRadialGradient(centre, centre, 0, centre, centre, centre);
  // The shoulder at 40% is what gives the stroke a core, instead of leaving it a
  // uniformly soft blob with no centre to it.
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
  gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.42)`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return canvas;
}

export function initPointerSpotlight() {
  const spotlight = document.querySelector("[data-spotlight]");
  if (!spotlight) return;

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches) return;

  // Reduced motion keeps the head — what it drops is the movement the light
  // makes on its own: it is pinned to the cursor, never smears, and leaves no
  // wake, so it only ever goes where the pointer has already gone.
  let follow = reducedMotion.matches ? 1 : FOLLOW;
  let embellished = !reducedMotion.matches;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight * 0.4;
  let x = targetX;
  let y = targetY;
  let angle = 0;
  let frame = 0;
  let lit = false;

  /* --- The wake ---------------------------------------------------------- */

  const trail = document.querySelector("[data-spotlight-trail]");
  const canvas = trail?.getContext?.("2d") ?? null;
  /** Live points, oldest first. */
  const points = [];
  /** Where the last point was laid down, so spacing follows distance travelled. */
  let stampX = x;
  let stampY = y;
  let trailWidth = 0;
  let trailHeight = 0;

  const cyan = readBrandRgb("--brand-secondary-rgb", [56, 152, 212]);
  const navy = readBrandRgb("--brand-primary-rgb", [37, 56, 128]);
  const stamps = canvas
    ? Array.from({ length: TRAIL_STAGES }, (_, stage) =>
        renderStamp(
          mixRgb(cyan, navy, (stage / (TRAIL_STAGES - 1)) * TRAIL_COOLING),
          Math.round(TRAIL_RADIUS * TRAIL_SPREAD * 2 * TRAIL_SCALE),
        ),
      )
    : [];

  const resizeTrail = () => {
    trailWidth = Math.max(1, Math.round(window.innerWidth * TRAIL_SCALE));
    trailHeight = Math.max(1, Math.round(window.innerHeight * TRAIL_SCALE));
    // Assigning either dimension clears the bitmap and resets the context, so
    // every drawing flag is set per frame in `paintTrail` rather than here.
    trail.width = trailWidth;
    trail.height = trailHeight;
  };

  /** Lay down points along the ground the head has covered since the last frame. */
  const traceTrail = (time) => {
    const dx = x - stampX;
    const dy = y - stampY;
    let remaining = Math.hypot(dx, dy);
    if (remaining < TRAIL_STEP) return;

    const stepX = (dx / remaining) * TRAIL_STEP;
    const stepY = (dy / remaining) * TRAIL_STEP;
    while (remaining >= TRAIL_STEP) {
      stampX += stepX;
      stampY += stepY;
      points.push({ x: stampX, y: stampY, time });
      remaining -= TRAIL_STEP;
    }
    if (points.length > TRAIL_MAX) points.splice(0, points.length - TRAIL_MAX);
  };

  /** Repaint the whole wake from the live points: no accumulation, no residue. */
  const paintTrail = (time) => {
    canvas.clearRect(0, 0, trailWidth, trailHeight);
    // Additive, so where the path crosses itself the light piles up.
    canvas.globalCompositeOperation = "lighter";

    let alive = 0;
    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      const age = (time - point.time) / TRAIL_LIFETIME;
      if (age >= 1) continue;
      // Compact in place: `alive` never runs ahead of `index`, so this only ever
      // overwrites points that have already been drawn.
      points[alive] = point;
      alive += 1;

      // Eased, so the wake holds its brightness for a moment behind the head and
      // then lets go, instead of draining at a constant rate.
      const fade = (1 - age) ** 1.8;
      const radius = TRAIL_RADIUS * (1 + (TRAIL_SPREAD - 1) * age) * TRAIL_SCALE;
      const stage = Math.min(TRAIL_STAGES - 1, Math.floor(age * TRAIL_STAGES));

      canvas.globalAlpha = TRAIL_ALPHA * fade;
      canvas.drawImage(
        stamps[stage],
        point.x * TRAIL_SCALE - radius,
        point.y * TRAIL_SCALE - radius,
        radius * 2,
        radius * 2,
      );
    }
    points.length = alive;
    canvas.globalAlpha = 1;
  };

  /* --- The loop ---------------------------------------------------------- */

  const render = () => {
    const time = performance.now();
    const dx = targetX - x;
    const dy = targetY - y;
    x += dx * follow;
    y += dy * follow;

    const speed = Math.hypot(dx, dy);
    const smear = embellished ? Math.min(MAX_SMEAR, speed / FULL_SMEAR_SPEED) : 0;
    // Hold the last heading while nearly still, so the shape does not spin
    // around on sub-pixel jitter.
    if (speed > 0.6) angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    // Stretch along the heading and pinch across it: the area stays similar, so
    // the light reads as deformed by speed rather than as growing.
    spotlight.style.transform =
      `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) ` +
      `rotate(${angle.toFixed(1)}deg) ` +
      `scale(${(1 + smear).toFixed(3)}, ${(1 - smear * 0.55).toFixed(3)})`;

    if (canvas && embellished) {
      traceTrail(time);
      paintTrail(time);
    }

    // Keep going while the head is still travelling or the wake is still lit:
    // the trail has to be allowed to burn out even once the pointer has stopped.
    frame = speed > REST_THRESHOLD || points.length ? requestAnimationFrame(render) : 0;
  };

  const wake = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  const dim = () => {
    lit = false;
    spotlight.classList.remove("is-lit");
    trail?.classList.remove("is-lit");
  };

  if (canvas) {
    resizeTrail();
    window.addEventListener("resize", resizeTrail, { passive: true });
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!lit) {
        lit = true;
        // Start the light where the cursor already is, so it fades in in place
        // instead of flying across the page — and drawing a wake all the way —
        // on the first move.
        x = targetX;
        y = targetY;
        stampX = targetX;
        stampY = targetY;
        spotlight.classList.add("is-lit");
        trail?.classList.add("is-lit");
      }
      wake();
    },
    { passive: true },
  );

  document.addEventListener("pointerleave", dim);
  window.addEventListener("blur", dim);

  // Honour the preference being changed mid-session, in either direction.
  reducedMotion.addEventListener("change", (event) => {
    follow = event.matches ? 1 : FOLLOW;
    embellished = !event.matches;
    if (event.matches && canvas) {
      points.length = 0;
      canvas.clearRect(0, 0, trailWidth, trailHeight);
    }
  });
}

/**
 * Moves the cursor spotlight.
 *
 * The light trails the pointer instead of being pinned to it, and stretches
 * along its direction of travel while it catches up — the faster the movement,
 * the more it smears, settling back into a circle at rest.
 *
 * Only `transform` is written, and the loop shuts itself down once the light has
 * caught up, so a still pointer costs nothing.
 */

/** How much of the remaining distance is covered each frame: the trail. */
const FOLLOW = 0.13;
/** Per-frame travel, in px, that produces the maximum smear. */
const FULL_SMEAR_SPEED = 240;
const MAX_SMEAR = 0.4;
/** Below this per-frame travel the light has arrived and the loop can stop. */
const REST_THRESHOLD = 0.12;

export function initPointerSpotlight() {
  const spotlight = document.querySelector("[data-spotlight]");
  if (!spotlight) return;

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches) return;

  // Reduced motion keeps the light — what it drops is the movement the light
  // makes on its own: it is pinned to the cursor and never smears, so it only
  // ever goes where the pointer has already gone.
  let follow = reducedMotion.matches ? 1 : FOLLOW;
  let smears = !reducedMotion.matches;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight * 0.4;
  let x = targetX;
  let y = targetY;
  let angle = 0;
  let frame = 0;
  let lit = false;

  const render = () => {
    const dx = targetX - x;
    const dy = targetY - y;
    x += dx * follow;
    y += dy * follow;

    const speed = Math.hypot(dx, dy);
    const smear = smears ? Math.min(MAX_SMEAR, speed / FULL_SMEAR_SPEED) : 0;
    // Hold the last heading while nearly still, so the shape does not spin
    // around on sub-pixel jitter.
    if (speed > 0.6) angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    // Stretch along the heading and pinch across it: the area stays similar, so
    // the light reads as deformed by speed rather than as growing.
    spotlight.style.transform =
      `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) ` +
      `rotate(${angle.toFixed(1)}deg) ` +
      `scale(${(1 + smear).toFixed(3)}, ${(1 - smear * 0.55).toFixed(3)})`;

    frame = speed > REST_THRESHOLD ? requestAnimationFrame(render) : 0;
  };

  const wake = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  const dim = () => {
    lit = false;
    spotlight.classList.remove("is-lit");
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!lit) {
        lit = true;
        // Start the light where the cursor already is, so it fades in in place
        // instead of flying across the page on the first move.
        x = targetX;
        y = targetY;
        spotlight.classList.add("is-lit");
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
    smears = !event.matches;
  });
}

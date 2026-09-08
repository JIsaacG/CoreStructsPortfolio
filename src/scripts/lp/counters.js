/**
 * Number counters that run once, when the figure reaches the screen.
 *
 * Shared by the two landings that publish results — Nexora's outcomes band and
 * Orbita's operating metrics. The markup already contains the final value, so a
 * page with JavaScript off (or with reduced motion asked for) shows the right
 * number immediately; this only replaces the last stretch with a count.
 *
 *   <span data-count-to="38" data-count-prefix="+" data-count-suffix="%">+38%</span>
 */

const DURATION = 1400;

/** Ease-out cubic: fast enough to read as a change, slow enough to land softly. */
const ease = (t) => 1 - (1 - t) ** 3;

/** Format with the same separators the static markup already uses. */
function format(value, decimals) {
  return value.toLocaleString("es-HN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function run(element) {
  const target = Number(element.dataset.countTo);
  if (!Number.isFinite(target)) return;

  const decimals = Number(element.dataset.countDecimals) || 0;
  const prefix = element.dataset.countPrefix ?? "";
  const suffix = element.dataset.countSuffix ?? "";
  const from = Number(element.dataset.countFrom) || 0;

  const started = performance.now();

  const step = (now) => {
    const progress = Math.min((now - started) / DURATION, 1);
    const value = from + (target - from) * ease(progress);
    element.textContent = `${prefix}${format(value, decimals)}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

export function initCounters(root = document) {
  const targets = root.querySelectorAll("[data-count-to]");
  if (!targets.length) return;

  // Someone who asked for less motion still gets the number — they just get it
  // whole, which is what the markup already says.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        run(entry.target);
      }
    },
    { threshold: 0.6 },
  );

  for (const element of targets) observer.observe(element);
}

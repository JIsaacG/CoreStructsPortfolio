/**
 * Publishes scroll position to CSS as custom properties.
 *
 * A single passive listener feeds one requestAnimationFrame callback, and the
 * frame does nothing unless a value actually changed — so the loop costs
 * nothing while the page is still.
 *
 *   --scroll-progress   0..1 over the document. Drives the composited progress
 *                       bar only, so it can update at full precision.
 *   --ambient-progress  the same value in 0.05 steps. The background gradients
 *                       repaint a full viewport, so they move in coarse jumps.
 *   --hero-exit         0..1 as the hero scrolls away, for its scale and fade.
 */

const AMBIENT_STEP = 0.05;
const PROGRESS_PRECISION = 3;

const clamp01 = (value) => Math.min(1, Math.max(0, value));

export function initScrollMetrics() {
  const root = document.documentElement;
  const hero = document.querySelector("[data-hero]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let frame = 0;
  let lastProgress = -1;
  let lastAmbient = -1;
  let lastHeroExit = -1;

  const update = () => {
    frame = 0;

    const scrollable = root.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? clamp01(window.scrollY / scrollable) : 0;

    const rounded = Number(progress.toFixed(PROGRESS_PRECISION));
    if (rounded !== lastProgress) {
      lastProgress = rounded;
      root.style.setProperty("--scroll-progress", String(rounded));
    }

    const ambient = Math.round(progress / AMBIENT_STEP) * AMBIENT_STEP;
    if (ambient !== lastAmbient) {
      lastAmbient = ambient;
      root.style.setProperty("--ambient-progress", ambient.toFixed(2));
    }

    // The hero fades and swells only while it is the thing being scrolled past.
    // Under reduced motion it is left at rest.
    if (hero && !reducedMotion.matches) {
      const box = hero.getBoundingClientRect();
      const travel = Math.max(1, box.height - window.innerHeight);
      const exit = Number(clamp01(-box.top / travel).toFixed(PROGRESS_PRECISION));
      if (exit !== lastHeroExit) {
        lastHeroExit = exit;
        hero.style.setProperty("--hero-exit", String(exit));
      }
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches && hero) {
      hero.style.setProperty("--hero-exit", "0");
      lastHeroExit = -1;
    }
    schedule();
  });

  update();
}

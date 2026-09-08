/**
 * Scroll-linked storytelling.
 *
 * A `[data-track]` section publishes its own progress through the viewport as
 * `--track` (0 → 1) and marks the step that owns the current stretch with
 * `is-active`. Three of the landings tell a sequential story — Nexora's before
 * and after, Velora's four-visit protocol, Orbita's supply flow — and all three
 * drive it from here rather than each shipping its own listener.
 *
 * Everything it writes is a custom property or a class: no layout is read
 * inside the scroll handler beyond one `getBoundingClientRect` per tracked
 * section, and the work is coalesced into a single rAF per frame.
 */

/** Steps split the track evenly; index 0 owns the first slice. */
function activeIndex(progress, count) {
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
}

export function initScrollTrack(root = document) {
  const tracks = [...root.querySelectorAll("[data-track]")];
  if (!tracks.length) return;

  const entries = tracks.map((element) => ({
    element,
    steps: [...element.querySelectorAll("[data-track-step]")],
    last: -1,
  }));

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  // With movement switched off the story is told all at once: every step is
  // active, so nothing is hidden behind an animation that will not run.
  if (reduced.matches) {
    for (const { element, steps } of entries) {
      element.style.setProperty("--track", "1");
      for (const step of steps) step.classList.add("is-active");
    }
    return;
  }

  let frame = 0;

  const measure = () => {
    frame = 0;
    const viewport = window.innerHeight;

    for (const entry of entries) {
      const box = entry.element.getBoundingClientRect();
      // The track runs from "the section's top reaches the bottom of the
      // viewport" to "its bottom reaches the top", clamped at both ends.
      const span = box.height + viewport;
      const progress = span > 0 ? Math.min(1, Math.max(0, (viewport - box.top) / span)) : 0;

      entry.element.style.setProperty("--track", progress.toFixed(4));

      if (!entry.steps.length) continue;
      const index = activeIndex(progress, entry.steps.length);
      if (index === entry.last) continue;
      entry.last = index;
      entry.steps.forEach((step, position) => {
        step.classList.toggle("is-active", position <= index);
        step.classList.toggle("is-current", position === index);
      });
    }
  };

  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(measure);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  measure();

  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (frame) cancelAnimationFrame(frame);
  };
}

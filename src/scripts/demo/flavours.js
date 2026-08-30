/**
 * The flavour beat.
 *
 * Five recipes share one pinned bottle, so scrolling past a flavour has to
 * change the bottle rather than reveal a new one. This module watches which
 * flavour is crossing the middle of the screen and publishes its colours on the
 * root element; the tint, the label and the page's accent all follow from there,
 * through CSS transitions rather than through anything animated here.
 *
 * The colours live on the markup (`data-tint`, `data-deep`, `data-tint-rgb`) so
 * a page with JavaScript off still gets the first flavour's palette, baked in by
 * the build.
 */

/** Roughly "the flavour occupying the middle band of the viewport". */
const BAND = "-45% 0px -45% 0px";

export function initFlavours() {
  const beats = [...document.querySelectorAll("[data-flavour]")];
  if (!beats.length) return;

  const root = document.documentElement;
  const name = document.querySelector("[data-bottle-name]");
  const note = document.querySelector("[data-bottle-note]");

  const apply = (beat) => {
    const { tint, deep, tintRgb, deepRgb, flavourName, flavourNote } = beat.dataset;
    root.style.setProperty("--flavour-tint", tint);
    root.style.setProperty("--flavour-deep", deep);
    // Buttons, focus rings and the ambient wash all read the brand pair, so
    // repointing both halves is what makes the whole room take the flavour's
    // light — not just the accents sitting on top of it.
    root.style.setProperty("--brand-secondary", tint);
    root.style.setProperty("--brand-secondary-rgb", tintRgb);
    root.style.setProperty("--brand-primary", deep);
    root.style.setProperty("--brand-primary-rgb", deepRgb);

    if (name) name.textContent = flavourName;
    if (note) note.textContent = flavourNote;

    for (const other of beats) other.classList.toggle("is-active", other === beat);
  };

  if (!("IntersectionObserver" in window)) return;

  const visible = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      // With two beats in the band at once, the one further down the page wins:
      // it is the one the reader is scrolling into.
      const current = beats.filter((beat) => visible.has(beat)).at(-1);
      if (current) apply(current);
    },
    { rootMargin: BAND, threshold: 0 },
  );

  for (const beat of beats) observer.observe(beat);

  return () => observer.disconnect();
}

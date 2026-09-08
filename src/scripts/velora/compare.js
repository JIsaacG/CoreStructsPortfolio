/**
 * Velora — the before / after comparison.
 *
 * The control is a native range input stretched over the frame at zero opacity.
 * That one decision buys dragging, tapping, touch, arrow keys, Home/End and a
 * proper accessible name for free; all this module does is copy its value into
 * the `--split` custom property that the clip path and the handle both read.
 *
 * Writing a single custom property keeps the work on the compositor: nothing
 * here reads layout, and nothing re-renders the two illustrations.
 */

export function initCompare(root = document) {
  for (const figure of root.querySelectorAll("[data-compare]")) {
    const range = figure.querySelector("[data-compare-range]");
    if (!range) continue;

    const paint = () => {
      figure.style.setProperty("--split", `${range.value}%`);
    };

    range.addEventListener("input", paint);
    paint();
  }
}

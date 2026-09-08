/**
 * Orbita — the hero showcase parallax.
 *
 * The pointer's position inside the stage is written once per frame as two
 * numbers, `--px` and `--py`, on the container. Each device multiplies them by
 * its own `--depth` in CSS, so five elements separate from one input with no
 * per-element JavaScript and no layout reads inside the move handler.
 *
 * It is deliberately small — a couple of dozen pixels at the deepest layer.
 * Enough to give the composition depth, not enough to make anyone chase a
 * product around the screen.
 */

const RANGE = 14;

export function initParallax(root = document) {
  const stage = root.querySelector("[data-parallax]");
  if (!stage) return;

  // A pointer parallax on a touch screen is a parallax nobody can trigger, and
  // movement that was asked to stop should stop.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let frame = 0;
  let x = 0;
  let y = 0;

  const write = () => {
    frame = 0;
    stage.style.setProperty("--px", x.toFixed(2));
    stage.style.setProperty("--py", y.toFixed(2));
  };

  stage.addEventListener("pointermove", (event) => {
    const box = stage.getBoundingClientRect();
    x = ((event.clientX - box.left) / box.width - 0.5) * 2 * RANGE;
    y = ((event.clientY - box.top) / box.height - 0.5) * 2 * RANGE;
    stage.classList.add("is-live");
    if (!frame) frame = requestAnimationFrame(write);
  });

  // Leaving returns the composition to rest, with the spring back in place so
  // it settles instead of snapping.
  stage.addEventListener("pointerleave", () => {
    stage.classList.remove("is-live");
    x = 0;
    y = 0;
    if (!frame) frame = requestAnimationFrame(write);
  });
}

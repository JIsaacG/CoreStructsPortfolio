/**
 * Entrances, the boring way.
 *
 * An IntersectionObserver is the elegant answer and it is what the rest of the
 * repository uses. On a page carrying sixty reveal targets — many of them
 * transformed downward by their own start state, several of them inside
 * containers that are re-rendered when a filter changes — the observer's
 * thresholds turned out to leave most of the page invisible. On a marketing
 * site that is a missing animation; on a portal of public statistics it is
 * missing information.
 *
 * So this module does the unglamorous thing: on every scroll frame it reveals
 * whatever is now in view, and drops it from the list. It is O(remaining) per
 * frame, throttled to one animation frame, and the list empties as the reader
 * goes down the page. It cannot leave content hidden, which is the only
 * property that actually matters here.
 */

const MARGIN = 0.02;

export function initReveal() {
  /* Tells the failsafe in the document head that hiding is now owned here. */
  document.documentElement.dataset.revealsReady = "1";

  let pending = [...document.querySelectorAll("[data-reveal]")];
  if (!pending.length) return;

  const show = (element) => element.classList.add("is-revealed");

  /* Asked for stillness: nothing is hidden, so there is nothing to reveal. */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    pending.forEach(show);
    return;
  }

  /* A group's children come in one after another rather than all at once, and
     the cascade is capped so the last card of a long grid is not left waiting. */
  for (const group of document.querySelectorAll("[data-reveal-group]")) {
    const children = [...group.querySelectorAll("[data-reveal]")];
    children.forEach((child, index) => {
      child.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 70}ms`);
    });
  }

  let frame = 0;

  const sweep = () => {
    frame = 0;
    const limit = window.innerHeight * (1 + MARGIN);
    const remaining = [];

    for (const element of pending) {
      const box = element.getBoundingClientRect();
      /* `box` already includes the start transform, so an element that is only
         just below the fold stays pending until it has really arrived. */
      if (box.top < limit && box.bottom > -limit) show(element);
      else remaining.push(element);
    }

    pending = remaining;
    if (!pending.length) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }
  };

  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(sweep);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });

  /* Two sweeps at the start: one now, one after the fonts and the charts have
     settled the layout, because an element's position can move between them. */
  sweep();
  setTimeout(sweep, 300);
}

/**
 * Scroll entrance.
 *
 * The CSS decides what an entrance looks like and whether one happens at all
 * (see `styles/aurea/reveal.css`); this module only decides *when*. It marks
 * the document ready so the hiding rules may apply, staggers the children of a
 * group, and unobserves each element the moment it has arrived.
 *
 * The failure mode is the one that matters. If this module never loads —
 * blocked script, parse error, an old browser without IntersectionObserver —
 * the inline script in the head removes the `.js` class after two and a half
 * seconds and every hidden element becomes visible. A portal where a broken
 * script leaves the admissions requirements invisible is not an acceptable
 * portal, so the fallback is a timer rather than a promise.
 */

import { $$ } from "./dom.js";

export function initReveal() {
  const root = document.documentElement;

  /* No observer, or the reader asked for less motion: show everything and
     stop. The `.js` class is what the CSS keys its hiding off, so removing it
     is how “show everything” is expressed. */
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    root.classList.remove("js");
    return;
  }

  /* Tells the head script that the reveal system is alive, so its safety timer
     does not un-hide elements that are about to animate in. */
  root.dataset.revealsReady = "true";

  /* The stagger, capped at eight steps: past that the last card of a fourteen
     card grid arrives a second and a half after the first, which reads as a
     slow page rather than a considered one. */
  for (const group of $$("[data-reveal-group]")) {
    for (const [index, child] of [...group.children].entries()) {
      child.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 70}ms`);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );

  for (const element of $$("[data-reveal]")) observer.observe(element);

  /* Children of a group are revealed as a group, not individually: a grid of
     cards that each waited for its own intersection would ripple as the reader
     scrolls rather than arriving together. */
  for (const group of $$("[data-reveal-group]")) {
    for (const child of group.children) {
      if (!child.hasAttribute("data-reveal")) {
        child.setAttribute("data-reveal", "rise");
        observer.observe(child);
      }
    }
  }
}

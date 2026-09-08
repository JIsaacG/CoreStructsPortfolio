/**
 * The landing-pages index.
 *
 * One behaviour of its own: the transition from a card into the project it
 * opens. The card's own rectangle is painted in that project's accent and grown
 * to cover the viewport, and the navigation happens as it lands — so the demo
 * does not arrive as an unrelated new page, it arrives out of the card that
 * showed it.
 *
 * It is deliberately built on a single element and a single transform:
 *
 *   - one fixed div, positioned and sized over the card with `translate`+`scale`
 *   - one transition to the viewport's rectangle
 *   - navigation on `transitionend`, with a timer as the backstop
 *
 * Everything about it is optional. Modified clicks, reduced motion, a missing
 * element, or a transition that never fires all fall back to the plain link the
 * markup already is.
 */

import { initScrollReveal } from "../modules/scroll-reveal.js";

/* The travel itself is 520ms, set in CSS. This is the backstop for the case
   where `transitionend` never arrives — a background tab, a dropped frame — so
   a click always ends in a navigation. */
const FALLBACK_MS = 700;

function initOpenTransition(veil) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  for (const link of document.querySelectorAll("[data-open-project]")) {
    link.addEventListener("click", (event) => {
      // Anything that is not a plain left click belongs to the browser: opening
      // in a new tab must never be intercepted by an animation.
      if (event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      if (reduced.matches) return;

      const card = link.closest(".sc-card");
      if (!card) return;

      event.preventDefault();

      const box = card.getBoundingClientRect();
      const accent = getComputedStyle(card).getPropertyValue("--accent").trim();

      veil.style.setProperty("--veil-color", accent);
      veil.style.transition = "none";
      veil.style.transform =
        `translate(${box.left}px, ${box.top}px) scale(${box.width}, ${box.height})`;

      // Two frames: one to commit the starting rectangle, one to start the run.
      requestAnimationFrame(() => {
        veil.classList.add("is-running");
        requestAnimationFrame(() => {
          veil.style.transition = "";
          veil.style.transform =
            `translate(0px, 0px) scale(${window.innerWidth}, ${window.innerHeight})`;
        });
      });

      let done = false;
      const go = () => {
        if (done) return;
        done = true;
        window.location.href = link.href;
      };

      veil.addEventListener("transitionend", go, { once: true });
      setTimeout(go, FALLBACK_MS);
    });
  }
}

initScrollReveal();

const veil = document.querySelector("[data-veil]");
if (veil) initOpenTransition(veil);

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = String(new Date().getFullYear());

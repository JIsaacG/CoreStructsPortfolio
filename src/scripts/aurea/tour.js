/**
 * The campus tour and the attendance ring.
 *
 * Two small pieces of drawing behaviour that share nothing except being the
 * only places in the portal where a script touches geometry.
 */

import { $, $$ } from "./dom.js";

/* -------------------------------------------------------------- the tour */

/**
 * Eight hotspots on a drawn plan.
 *
 * The panels for all eight spaces are rendered by the build and hidden here,
 * so the tour is a real page of content before it is an interaction: with
 * JavaScript off, a reader gets the plan and eight descriptions underneath it
 * in reading order, which is a worse tour and a complete one.
 */
function initTour() {
  const root = $("[data-tour]");
  if (!root) return;

  const spots = $$("[data-tour-spot]", root);
  const panels = $$("[data-tour-panel]", root);
  if (!spots.length || !panels.length) return;

  function show(id) {
    for (const spot of spots) {
      spot.setAttribute("aria-pressed", String(spot.dataset.tourSpot === id));
    }
    for (const panel of panels) {
      panel.hidden = panel.dataset.tourPanel !== id;
    }
  }

  for (const spot of spots) {
    spot.addEventListener("click", () => show(spot.dataset.tourSpot));
  }

  /* Arrow keys walk the campus, which is the whole point of a plan: the spaces
     have an order in space, and the keyboard should follow it. */
  root.addEventListener("keydown", (event) => {
    if (!event.target.matches("[data-tour-spot]")) return;
    const index = spots.indexOf(event.target);

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = spots[(index + 1) % spots.length];
      next.focus();
      show(next.dataset.tourSpot);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const prev = spots[(index - 1 + spots.length) % spots.length];
      prev.focus();
      show(prev.dataset.tourSpot);
    }
  });

  show(spots[0].dataset.tourSpot);
}

/* -------------------------------------------------------- attendance ring */

/**
 * The parent portal's attendance figure.
 *
 * The ring is `aria-hidden` and the percentage beside it is the accessible
 * value: a circle is not a number. The arc is drawn by setting the dash offset
 * from the percentage, which also means it renders correctly at its final
 * value before any script runs.
 */
function initRings() {
  for (const ring of $$("[data-ring]")) {
    const arc = $(".au-ring__arc", ring);
    if (!arc) continue;

    const percent = Number(ring.dataset.ring);
    const radius = Number(arc.getAttribute("r"));
    const circumference = 2 * Math.PI * radius;

    arc.style.strokeDasharray = String(circumference);
    arc.style.strokeDashoffset = String(circumference * (1 - percent / 100));
  }
}

export function initCampus() {
  initTour();
  initRings();
}

/**
 * Entry point for the Rumbo demo. It gets the same header and reveal behaviour
 * the portfolio and Verbena run — a demo is a real page, not a mock-up — but it
 * pins no bottle, so `stage.js`, `fizz.js`, `flavours.js`, `kinetic.js` and
 * `places.js` stay out of its bundle entirely.

 * The three landing demos used to share this file; they now carry their own
 * entry points, because each of them has interface of its own to run.
 */

import { initHeader } from "../modules/header.js";
import { initScrollReveal } from "../modules/scroll-reveal.js";

initHeader();
initScrollReveal();

// Releases the entrance animation. Set from script so a browser that never
// runs it is left with the finished state instead of an empty screen.
document.documentElement.classList.add("is-loaded");

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = String(new Date().getFullYear());

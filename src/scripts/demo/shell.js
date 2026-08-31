/**
 * Entry point shared by the demos that are not Verbena: Rumbo and the two
 * Cierzo/Lumen landings. They get the same header and reveal behaviour the
 * portfolio and Verbena run — a demo is a real page, not a mock-up — but none
 * of them pin a bottle, so `stage.js`, `fizz.js`, `flavours.js`, `kinetic.js`
 * and `places.js` stay out of their bundle entirely.
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

/**
 * Entry point for a demo site.
 *
 * The header and the reveal system are the same modules the portfolio runs — a
 * demo is a real page, not a mock-up, so it gets the real behaviour. What belongs
 * to the demos alone is the pinned bottle in `stage.js`, the flavour beat in
 * `flavours.js`, the bubbles in `fizz.js`, the moving name in `kinetic.js` and
 * the map in `places.js`.
 */

import { initHeader } from "../modules/header.js";
import { initScrollReveal } from "../modules/scroll-reveal.js";
import { initDemoStage } from "./stage.js";
import { initFizz } from "./fizz.js";
import { initFlavours } from "./flavours.js";
import { initKinetic } from "./kinetic.js";
import { initPlaces } from "./places.js";

initHeader();
initDemoStage();
initFizz();
initFlavours();
initKinetic();
initPlaces();
initScrollReveal();

// Releases the hero entrance. Set from script so a browser that never runs it
// is left with the finished state instead of an empty screen.
document.documentElement.classList.add("is-loaded");

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = String(new Date().getFullYear());

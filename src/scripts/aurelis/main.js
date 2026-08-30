/**
 * Entry point for the Aurelis portal.
 *
 * Every page loads the same module: each initialiser looks for its own markup
 * and returns immediately when the page does not have it, which costs less than
 * shipping one bundle per template and keeps the portal on a single cached file.
 *
 * The scroll-reveal system is the portfolio's, unchanged — a demo is a real
 * page, so it gets the real behaviour.
 */

import { initScrollReveal } from "../modules/scroll-reveal.js";
import { initNav } from "./nav.js";
import {
  initAtlas,
  initCounters,
  initMarquee,
  initPlates,
  initProcess,
  initTabs,
} from "./sections.js";
import { initForm } from "./form.js";

initNav();
initTabs();
initCounters();
initProcess();
initAtlas();
initMarquee();
initPlates();
initForm();
initScrollReveal();

/* One value that would be wrong the moment the year turned. */
const year = document.querySelector("[data-current-year]");
if (year) year.textContent = String(new Date().getFullYear());

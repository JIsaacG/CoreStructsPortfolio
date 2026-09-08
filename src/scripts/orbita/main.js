/**
 * Orbita — entry point.
 *
 * Five behaviours belong to this page: the hero parallax, the catalogue search,
 * the product sheet, the comparison and the configurator. Each is a module of
 * its own because each is a piece of interface a real client would ask for on
 * its own.
 */

import { initHeader } from "../modules/header.js";
import { initScrollReveal } from "../modules/scroll-reveal.js";
import { initCounters } from "../lp/counters.js";
import { initDemoForms } from "../lp/demo-form.js";
import { initScrollTrack } from "../lp/track.js";
import { initCompare } from "./compare.js";
import { initConfigurator } from "./configurator.js";
import { initParallax } from "./parallax.js";
import { initSearch } from "./search.js";
import { initSheet } from "./sheet.js";

initHeader();
initScrollReveal();
initScrollTrack();
initCounters();
initParallax();
initSearch();
initSheet();
initCompare();
initConfigurator();
initDemoForms();

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = String(new Date().getFullYear());

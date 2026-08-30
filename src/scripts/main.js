/**
 * Entry point.
 *
 * The page is complete and readable before this runs — every module here adds
 * behaviour to markup that already exists, so nothing depends on JavaScript to
 * become visible or navigable.
 */

import { initHeader } from "./modules/header.js";
import { initPointerGlow } from "./modules/pointer-glow.js";
import { initPointerSpotlight } from "./modules/pointer-spotlight.js";
import { initScrollMetrics } from "./modules/scroll-metrics.js";
import { initScrollReveal } from "./modules/scroll-reveal.js";

initHeader();
initScrollMetrics();
initScrollReveal();
initPointerSpotlight();
initPointerGlow();

// The footer year is the one piece of copy that should never go stale.
const year = document.querySelector("[data-current-year]");
if (year) year.textContent = String(new Date().getFullYear());

/**
 * Nexora — entry point.
 *
 * Four behaviours, all of them shared: the header, the scroll reveals, the
 * result counters and the transformation track. The page has no interaction of
 * its own to script, which is the correct amount for a corporate landing —
 * everything it does is in service of one form at the end.
 */

import { initHeader } from "../modules/header.js";
import { initScrollReveal } from "../modules/scroll-reveal.js";
import { initCounters } from "../lp/counters.js";
import { initDemoForms } from "../lp/demo-form.js";
import { initScrollTrack } from "../lp/track.js";

initHeader();
initScrollReveal();
initCounters();
initScrollTrack();
initDemoForms();

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = String(new Date().getFullYear());

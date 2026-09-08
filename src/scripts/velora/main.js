/**
 * Velora — entry point.
 *
 * Two behaviours belong to this page and nothing else: the booking widget and
 * the before/after comparison. The rest is the shared kit.
 */

import { initHeader } from "../modules/header.js";
import { initScrollReveal } from "../modules/scroll-reveal.js";
import { initScrollTrack } from "../lp/track.js";
import { initBooking } from "./booking.js";
import { initCompare } from "./compare.js";

initHeader();
initScrollReveal();
initScrollTrack();
initBooking();
initCompare();

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = String(new Date().getFullYear());

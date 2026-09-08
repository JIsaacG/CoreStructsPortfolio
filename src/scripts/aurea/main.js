/**
 * Entry point for the AUREA portal.
 *
 * Every page loads this one module. Each initialiser looks for its own markup
 * and returns immediately when the page does not have it, which costs less
 * than shipping a bundle per template and keeps the portal on a single cached
 * file across twenty-eight pages.
 *
 * Two branches are deliberately not here. The search index is the largest
 * object the portal ships, so `search.js` is imported by `nav.js` the first
 * time somebody opens the overlay; and the calendar module is only imported on
 * a page that has events on it.
 *
 * Nothing in this folder supplies content. The navigation, the catalogues, the
 * plans of study, the calendar and the dashboards are all in the HTML before
 * any of this runs; these modules add behaviour on top of a page that already
 * works without them.
 */

import { initNav } from "./nav.js";
import { initCollections } from "./collections.js";
import { initAdmissions } from "./admissions.js";
import { initCampus } from "./tour.js";
import { initForms } from "./forms.js";
import { initUI } from "./ui.js";
import { initReveal } from "./reveal.js";

initNav();
initUI();
initCollections();
initAdmissions();
initCampus();
initForms();

/* The calendar, only where there is something to put in one. The module also
   owns the export menus, which appear on the homepage strip and on programme
   pages, so the test is for either. */
if (document.querySelector("[data-calendar], [data-export]")) {
  import("./calendar.js").then((module) => module.initCalendar());
}

/* Last, so the observers are attached after every other module has finished
   changing the layout they measure against. */
initReveal();

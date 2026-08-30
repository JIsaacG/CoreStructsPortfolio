/**
 * Entry point for the CEDE portal.
 *
 * Every page loads this one module: each initialiser looks for its own markup
 * and returns immediately when the page does not have it, which costs less than
 * shipping a bundle per template and keeps the portal on a single cached file.
 *
 * Nothing here supplies content. The navigation, the charts, the tables and the
 * forms are all in the HTML before this runs; these modules add behaviour on
 * top of a page that already works without them.
 */

import { initReveal } from "./reveal.js";
import { initAccessibility } from "./a11y.js";
import { initCatalogueDownloads, initDownloads } from "./download.js";
import { initForms } from "./forms.js";
import { initNav } from "./nav.js";
import { initObservatory } from "./observatory.js";
import { initSearch } from "./search.js";
import {
  initCounters,
  initListingFilters,
  initNetwork,
  initSortableTables,
  initTooltips,
  initViewSwitch,
} from "./ui.js";

initAccessibility();
initNav();
initSearch();
initObservatory();
initTooltips();
initNetwork();
initSortableTables();
initListingFilters();
initViewSwitch();
initDownloads();
initCatalogueDownloads();
initForms();
initCounters();
initReveal();

/* One value that would be wrong the moment the year turned. */
for (const year of document.querySelectorAll("[data-current-year]")) {
  year.textContent = String(new Date().getFullYear());
}

/**
 * Entry point for the CEDE portal.
 *
 * Every page loads this one module: each initialiser looks for its own markup
 * and returns immediately when the page does not have it, which costs less than
 * shipping a bundle per template and keeps the portal on a single cached file.
 *
 * The two heavy branches are the exception. The observatory pulls in the chart
 * renderers, the whole statistics model and the geometry of eighteen
 * departments — around 200 KB of modules — and the search pulls in every
 * content collection to build its index. Neither belongs on a page that has no
 * chart and no one has searched on yet, so both are imported on demand: the
 * observatory when the page actually contains a chart or a map, the search
 * index the first time someone touches the box.
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

/* The observatory, only where there is something to observe. */
if (document.querySelector("[data-chart], [data-map]")) {
  import("./observatory.js").then((module) => module.initObservatory());
}

/* One value that would be wrong the moment the year turned. */
for (const year of document.querySelectorAll("[data-current-year]")) {
  year.textContent = String(new Date().getFullYear());
}

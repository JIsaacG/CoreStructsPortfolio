/**
 * Global search.
 *
 * An institution with nine programmes, six news articles, twenty-seven events,
 * twelve professors, eighteen documents and twenty-four pages has more content
 * than any navigation can expose. The search box is the honest answer to that,
 * and on a portal of this size it is not a nicety — it is how most of the
 * content is reachable at all.
 *
 * The index is a JSON island written into every page at build time (see
 * `tools/aurea/shell.mjs`). No fetch, no API, no server: the whole index is
 * about 12 KB, it is already in the document, and it is parsed the first time
 * someone opens the overlay. A real deployment swaps the island for a query
 * against the CMS and nothing else in this file changes.
 */

import { $, fold, debounce } from "./dom.js";

const GROUP_LABEL = {
  programa: "Programas",
  pagina: "Páginas",
  noticia: "Noticias",
  evento: "Eventos",
  docente: "Docentes",
  documento: "Documentos",
  oficina: "Directorio",
};

/* The order results are grouped in: what a visitor most often wants first. */
const GROUP_ORDER = ["programa", "pagina", "admision", "noticia", "evento", "docente", "documento", "oficina"];

let index = [];

/**
 * Score a record against the query.
 *
 * Three tiers rather than a fuzzy distance: a title that starts with the query
 * beats a title that contains it, which beats a match anywhere in the body.
 * Anything cleverer would need a corpus to tune against, and the difference on
 * an index of eighty records is not measurable.
 */
function score(record, needle) {
  const title = record.f ?? "";
  if (title.startsWith(needle)) return 3;
  if (title.includes(needle)) return 2;
  if ((record.h ?? "").includes(needle)) return 1;
  return 0;
}

function render(results, container, query) {
  if (!query) {
    container.innerHTML =
      '<p class="au-search__hint">Busca programas, noticias, eventos, docentes, documentos y páginas del portal.</p>';
    return;
  }

  if (!results.length) {
    container.innerHTML = `<p class="au-search__hint">Sin resultados para “${query.replace(/</g, "&lt;")}”. Prueba con otra palabra o revisa las preguntas frecuentes.</p>`;
    return;
  }

  const groups = new Map();
  for (const record of results) {
    if (!groups.has(record.t)) groups.set(record.t, []);
    groups.get(record.t).push(record);
  }

  const ordered = [...groups.entries()].sort(
    (a, b) => GROUP_ORDER.indexOf(a[0]) - GROUP_ORDER.indexOf(b[0]),
  );

  container.innerHTML = ordered
    .map(
      ([type, records]) =>
        `<p class="au-search__group-title">${GROUP_LABEL[type] ?? type}</p>` +
        records
          .slice(0, 6)
          .map(
            (record) =>
              `<a class="au-search__hit" href="${record.u}"><b>${record.n}</b>` +
              `<span>${record.d ?? ""}</span></a>`,
          )
          .join(""),
    )
    .join("");
}

export function initSearch(overlay) {
  const input = $("[data-search-input]", overlay);
  const results = $("[data-search-results]", overlay);
  const island = document.getElementById("au-search-index");
  if (!input || !results || !island) return;

  try {
    index = JSON.parse(island.textContent);
  } catch {
    results.innerHTML =
      '<p class="au-search__hint">El índice de búsqueda no pudo cargarse. Usa el menú de navegación.</p>';
    return;
  }

  const run = debounce(() => {
    const query = input.value.trim();
    const needle = fold(query);

    const matches = needle
      ? index
          .map((record) => ({ record, points: score(record, needle) }))
          .filter((entry) => entry.points > 0)
          .sort((a, b) => b.points - a.points)
          .map((entry) => entry.record)
      : [];

    render(matches, results, query);
  }, 90);

  input.addEventListener("input", run);
  run();

  /* Arrow keys walk the results and Enter opens the highlighted one, so the
     whole search can be driven without leaving the keyboard. */
  input.addEventListener("keydown", (event) => {
    const hits = [...results.querySelectorAll(".au-search__hit")];
    if (!hits.length) return;

    const current = hits.findIndex((hit) => hit.dataset.active !== undefined);

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next =
        event.key === "ArrowDown"
          ? Math.min(current + 1, hits.length - 1)
          : Math.max(current - 1, 0);
      hits.forEach((hit) => delete hit.dataset.active);
      hits[next].dataset.active = "";
      hits[next].scrollIntoView({ block: "nearest" });
    }

    if (event.key === "Enter" && current > -1) {
      event.preventDefault();
      hits[current].click();
    }
  });
}

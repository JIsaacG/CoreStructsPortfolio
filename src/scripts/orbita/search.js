/**
 * Orbita — the catalogue search.
 *
 * Every card carries its own searchable text in `data-search`, written at build
 * time, so filtering is a substring test against markup that is already in the
 * page: no index to fetch, no request, and the catalogue is complete and
 * readable before the script runs.
 *
 * The search box sits under the hero and the results are further down, so a
 * search also takes the reader to them — a filter nobody sees applied looks
 * like a broken search box.
 */

/** Fold accents, so "Impresion" finds "Impresión". */
const fold = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

export function initSearch(root = document) {
  const input = root.querySelector("[data-search-input]");
  const catalog = root.querySelector("[data-catalog]");
  if (!input || !catalog) return;

  const cards = [...catalog.querySelectorAll("[data-search]")];
  const empty = root.querySelector("[data-catalog-empty]");
  const filter = root.querySelector("[data-filter]");
  const filterValue = root.querySelector("[data-filter-value]");
  const clear = root.querySelector("[data-filter-clear]");
  const go = root.querySelector("[data-search-go]");
  const section = catalog.closest("section");

  /**
   * A query matches when every meaningful word in it appears somewhere in the
   * card's index. Word-by-word rather than as one string, so "laptop
   * empresarial" and "equipo de oficina" behave the way anyone typing them
   * expects; anything under three letters is dropped, which takes out the
   * "de"/"y" that would otherwise have to be matched literally.
   */
  const apply = (term) => {
    const words = fold(term).split(/\s+/).filter((word) => word.length >= 3);
    let matches = 0;

    for (const card of cards) {
      const haystack = fold(card.dataset.search);
      const hit = words.every((word) => haystack.includes(word));
      card.hidden = !hit;
      if (hit) matches++;
    }

    if (empty) empty.hidden = matches > 0;
    if (filter) {
      filter.hidden = !words.length;
      if (filterValue) filterValue.textContent = term;
    }
  };

  const reveal = () => {
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  input.addEventListener("input", () => apply(input.value));

  // Enter and the button both mean "show me": they filter and then move.
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    apply(input.value);
    reveal();
  });

  go?.addEventListener("click", () => {
    apply(input.value);
    reveal();
  });

  // The example terms and the category tiles are the same gesture: they fill
  // the box, so the filter that is running is always visible in the control.
  for (const button of root.querySelectorAll("[data-search-term]")) {
    button.addEventListener("click", () => {
      input.value = button.dataset.searchTerm;
      apply(input.value);
      reveal();
    });
  }

  clear?.addEventListener("click", () => {
    input.value = "";
    apply("");
    input.focus();
  });
}

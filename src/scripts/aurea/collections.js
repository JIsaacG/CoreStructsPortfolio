/**
 * One filter engine, seven catalogues.
 *
 * The programme finder, the club explorer, the library, the document centre,
 * the FAQ, the faculty directory and the newsroom are the same interaction:
 * a text box, some chips, a list that narrows. Writing that seven times is how
 * a portal ends up with seven slightly different empty states and one of them
 * broken, so it is written once and driven entirely by markup:
 *
 *   [data-collection]              the container
 *     [data-collection-input]      the text box              (optional)
 *     [data-filter="nivel"]        a chip or a <select>      (any number)
 *     [data-item]                  a result
 *       data-haystack="…"          folded text, written by the build
 *       data-nivel="media tecnico" the values this item has for that filter
 *     [data-collection-count]      "12 programas"
 *     [data-collection-empty]      the nothing-matched line
 *     [data-collection-reset]      clears everything
 *
 * Two properties are load-bearing. First, EVERY ITEM IS ALREADY IN THE PAGE:
 * filtering hides rows, it never fetches them, so the catalogue works with
 * JavaScript off, prints complete and is searchable with the browser's own
 * find-in-page. Second, the haystacks are folded at build time by the same
 * function this module uses, so “psicologia” matches “Psicología”.
 */

import { $, $$, fold, debounce } from "./dom.js";

/** Read the active values of one filter group, as a Set. Empty means “all”. */
function activeValues(controls) {
  const values = new Set();

  for (const control of controls) {
    if (control.tagName === "SELECT") {
      if (control.value && control.value !== "todos") values.add(control.value);
    } else if (control.getAttribute("aria-pressed") === "true") {
      values.add(control.dataset.value);
    }
  }

  return values;
}

function setupCollection(root) {
  const input = $("[data-collection-input]", root);
  const items = $$("[data-item]", root);
  const count = $("[data-collection-count]", root);
  const empty = $("[data-collection-empty]", root);
  const reset = $("[data-collection-reset]", root);
  const noun = root.dataset.noun ?? "resultados";
  const nounOne = root.dataset.nounOne ?? noun;

  /* Group the filter controls by key, once. */
  const groups = new Map();
  for (const control of $$("[data-filter]", root)) {
    const key = control.dataset.filter;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(control);
  }

  function apply() {
    const needle = fold(input?.value.trim() ?? "");
    const wanted = new Map();
    for (const [key, controls] of groups) {
      const values = activeValues(controls);
      if (values.size) wanted.set(key, values);
    }

    let shown = 0;

    for (const item of items) {
      let visible = true;

      if (needle && !(item.dataset.haystack ?? "").includes(needle)) visible = false;

      if (visible) {
        for (const [key, values] of wanted) {
          const own = (item.dataset[key] ?? "").split(/\s+/).filter(Boolean);
          if (!own.some((value) => values.has(value))) {
            visible = false;
            break;
          }
        }
      }

      item.hidden = !visible;
      if (visible) shown++;
    }

    if (count) count.textContent = `${shown} ${shown === 1 ? nounOne : noun}`;
    if (empty) empty.hidden = shown > 0;

    /* Section headings inside a filtered list must disappear with their
       contents, or the reader is left with “Educación Media” over nothing. */
    for (const section of $$("[data-item-section]", root)) {
      const visibleItems = $$("[data-item]", section).some((item) => !item.hidden);
      section.hidden = !visibleItems;
    }
  }

  input?.addEventListener("input", debounce(apply, 100));

  for (const [, controls] of groups) {
    for (const control of controls) {
      if (control.tagName === "SELECT") {
        control.addEventListener("change", apply);
        continue;
      }

      control.addEventListener("click", () => {
        const single = control.dataset.filterMode === "single";
        const on = control.getAttribute("aria-pressed") === "true";

        if (single) {
          for (const sibling of controls) sibling.setAttribute("aria-pressed", "false");
          control.setAttribute("aria-pressed", String(!on));
        } else {
          control.setAttribute("aria-pressed", String(!on));
        }

        apply();
      });
    }
  }

  reset?.addEventListener("click", () => {
    if (input) input.value = "";
    for (const [, controls] of groups) {
      for (const control of controls) {
        if (control.tagName === "SELECT") control.selectedIndex = 0;
        else control.setAttribute("aria-pressed", "false");
      }
    }
    apply();
    input?.focus();
  });

  /**
   * A deep link into a filtered view.
   *
   * `oferta-academica.html#nivel=licenciatura` arrives with the filter already
   * applied, which is what makes the mega menu, the audience switch and the
   * homepage strips able to point at a slice of a catalogue instead of at the
   * whole thing.
   */
  const hash = window.location.hash.slice(1);
  if (hash.includes("=")) {
    for (const pair of hash.split("&")) {
      const [key, value] = pair.split("=");
      const controls = groups.get(key);
      if (!controls) continue;
      for (const control of controls) {
        if (control.tagName === "SELECT") {
          if ([...control.options].some((option) => option.value === value)) control.value = value;
        } else if (control.dataset.value === value) {
          control.setAttribute("aria-pressed", "true");
        }
      }
    }
  }

  apply();
}

export function initCollections() {
  for (const root of $$("[data-collection]")) setupCollection(root);
}

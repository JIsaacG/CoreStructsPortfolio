/**
 * The small behaviours: chart tooltips, counters, the network diagram, sortable
 * tables, listing filters and the view switch.
 *
 * Each initialiser looks for its own markup and returns immediately when the
 * page does not have it, which is why the whole portal can ship one module.
 */

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------- tooltips */

/**
 * The chart tooltip.
 *
 * One element for the whole page, positioned at the pointer or at the focused
 * mark. It enhances and never gates: everything it says is also in the table
 * under the chart, and focus shows exactly what hover shows — a chart whose
 * values are only reachable with a mouse is a chart half the readers cannot use.
 */
export function initTooltips() {
  const box = document.querySelector("[data-tip-box]");
  if (!box) return;

  let visible = false;

  const show = (text, x, y) => {
    box.textContent = text;
    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
    if (!visible) {
      box.classList.add("is-visible");
      visible = true;
    }
  };

  const hide = () => {
    if (!visible) return;
    box.classList.remove("is-visible");
    visible = false;
  };

  document.addEventListener("pointermove", (event) => {
    const mark = event.target.closest?.("[data-tip]");
    if (!mark) {
      hide();
      return;
    }
    show(mark.dataset.tip, event.clientX, event.clientY);
  });

  document.addEventListener("pointerleave", hide, true);
  document.addEventListener("scroll", hide, { passive: true });

  document.addEventListener(
    "focusin",
    (event) => {
      const mark = event.target.closest?.("[data-tip]");
      if (!mark) {
        hide();
        return;
      }
      const rect = mark.getBoundingClientRect();
      show(mark.dataset.tip, rect.left + rect.width / 2, rect.top);
    },
    true,
  );

  document.addEventListener("focusout", hide, true);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hide();
  });
}

/* ---------------------------------------------------------------- counters */

/**
 * Count a figure up when it first appears.
 *
 * Only where the value is a plain number, only once, and never under reduced
 * motion — a government portal does not need the number to perform, and a
 * reader who has asked for stillness gets the final value immediately.
 */
export function initCounters() {
  const targets = [...document.querySelectorAll("[data-count]")];
  if (!targets.length || reduced() || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        run(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.4 },
  );

  const run = (element) => {
    const final = element.textContent;
    const value = Number(final.replace(/[^\d.-]/g, ""));
    if (!Number.isFinite(value) || value === 0) return;

    const start = performance.now();
    const duration = 620;

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      const current = Math.round(value * eased);
      element.textContent = final.replace(/[\d.,]+/, current.toLocaleString("es-HN"));
      if (t < 1) requestAnimationFrame(step);
      else element.textContent = final;
    };

    requestAnimationFrame(step);
  };

  for (const target of targets) observer.observe(target);
}

/* ------------------------------------------------------------- the network */

/** Hovering a node lights its link and its entry in the list, and the reverse. */
export function initNetwork() {
  const root = document.querySelector("[data-network]");
  if (!root) return;

  const setActive = (id) => {
    for (const node of root.querySelectorAll("[data-node]")) {
      node.classList.toggle("is-active", node.dataset.node === id);
    }
    for (const link of root.querySelectorAll("[data-link]")) {
      link.classList.toggle("is-active", link.dataset.link === id);
    }
    for (const entry of root.querySelectorAll("[data-network-entry]")) {
      entry.classList.toggle("is-active", entry.dataset.networkEntry === id);
    }
  };

  const bind = (selector, key) => {
    for (const element of root.querySelectorAll(selector)) {
      const id = element.dataset[key];
      element.addEventListener("pointerenter", () => setActive(id));
      element.addEventListener("focusin", () => setActive(id));
      element.addEventListener("pointerleave", () => setActive(null));
      element.addEventListener("focusout", () => setActive(null));
    }
  };

  bind("[data-node]", "node");
  bind("[data-network-entry]", "networkEntry");
}

/* --------------------------------------------------------- sortable tables */

const collator = new Intl.Collator("es", { numeric: true, sensitivity: "base" });

/** Read a cell for sorting: numbers as numbers, text as text. */
function sortValue(cell) {
  const text = cell.textContent.replace(/\s+/g, " ").trim();
  if (cell.classList.contains("cd-num")) {
    const numeric = Number(text.replace(/[^\d.-]/g, ""));
    return Number.isFinite(numeric) ? numeric : text;
  }
  return text;
}

/**
 * Sorting, on the header buttons.
 *
 * Delegated from the document rather than bound per table, because a table
 * inside a chart is rewritten whenever a filter changes: listeners attached to
 * the old markup would be thrown away with it, and the column would silently
 * stop sorting. Delegation survives every re-render.
 *
 * `aria-sort` goes on the header cell so the state is announced, and the
 * original order is remembered so a third click restores it.
 */
const originalOrder = new WeakMap();

export function initSortableTables() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".cd-sort");
    if (!button) return;

    const header = button.closest("th[data-sort]");
    const table = header?.closest("table");
    const body = table?.querySelector("tbody");
    if (!header || !body) return;

    if (!originalOrder.has(body)) originalOrder.set(body, [...body.rows]);

    const headers = [...table.querySelectorAll("th[data-sort]")];
    const index = [...header.parentElement.children].indexOf(header);
    const current = header.getAttribute("aria-sort");
    const next = current === "ascending" ? "descending" : current === "descending" ? "none" : "ascending";

    for (const other of headers) other.setAttribute("aria-sort", "none");
    header.setAttribute("aria-sort", next);

    if (next === "none") {
      body.append(...originalOrder.get(body));
      return;
    }

    const direction = next === "ascending" ? 1 : -1;
    const sorted = [...body.rows].sort((a, b) => {
      const left = sortValue(a.cells[index]);
      const right = sortValue(b.cells[index]);
      if (typeof left === "number" && typeof right === "number") return (left - right) * direction;
      return collator.compare(String(left), String(right)) * direction;
    });
    body.append(...sorted);
  });
}

/* ------------------------------------------------------- listing filters */

/**
 * The noun a result counter uses, in the right number.
 *
 * Spanish plurals do not come off with a trailing "s" — «publicaciones» is not
 * «publicación» minus one letter — so the markup declares both forms and this
 * only picks between them.
 */
function counted(element, fallback) {
  const one = element?.dataset.one;
  const many = element?.dataset.many ?? element?.textContent.split(" ").slice(1).join(" ") ?? fallback;
  return (n) => (n === 1 && one ? one : many);
}

/**
 * The filters over a listing of documents, publications or resolutions.
 *
 * Everything is already in the page, so filtering is a matter of hiding rows —
 * which keeps the listing usable with JavaScript off, and instant with it on.
 */
export function initListingFilters() {
  for (const panel of document.querySelectorAll("[data-doc-filters]")) {
    const scope = panel.parentElement;
    const list = scope.querySelector("[data-doc-list]");
    if (!list) continue;

    const items = [...list.querySelectorAll("[data-doc]")];
    const counter = panel.querySelector("[data-doc-count]");
    const empty = scope.querySelector("[data-doc-empty]");
    const search = panel.querySelector("[data-doc-search]");
    const selects = [...panel.querySelectorAll("[data-doc-filter]")];
    const noun = counted(counter, "resultados");

    const apply = () => {
      const query = (search?.value ?? "").trim().toLowerCase();
      let shown = 0;

      for (const item of items) {
        const matchesText = !query || (item.dataset.text ?? "").includes(query);
        const matchesFilters = selects.every((select) => {
          const value = select.value;
          return value === "all" || item.dataset[select.dataset.docFilter] === value;
        });
        const visible = matchesText && matchesFilters;
        item.hidden = !visible;
        if (visible) shown++;
      }

      if (counter) counter.textContent = `${shown} ${noun(shown)}`;
      if (empty) empty.hidden = shown !== 0;
    };

    search?.addEventListener("input", apply);
    for (const select of selects) select.addEventListener("change", apply);

    panel.querySelector("[data-doc-reset]")?.addEventListener("click", () => {
      if (search) search.value = "";
      for (const select of selects) select.value = "all";
      apply();
    });
  }

  /* The same idea over a table instead of a list of cards. */
  for (const panel of document.querySelectorAll("[data-table-filters]")) {
    const scope = panel.parentElement;
    const rows = [...scope.querySelectorAll("[data-table-scope] tbody tr")];
    const counter = panel.querySelector("[data-table-count]");
    const search = panel.querySelector("[data-table-search]");
    const selects = [...panel.querySelectorAll("[data-table-filter]")];
    const noun = counted(counter, "registros");

    const apply = () => {
      const query = (search?.value ?? "").trim().toLowerCase();
      let shown = 0;

      for (const row of rows) {
        const text = row.textContent.toLowerCase();
        const matchesText = !query || text.includes(query);
        const matchesFilters = selects.every((select) => {
          const value = select.value;
          if (value === "all") return true;
          const cell = row.cells[Number(select.dataset.tableFilter)];
          return cell && cell.textContent.includes(value);
        });
        const visible = matchesText && matchesFilters;
        row.hidden = !visible;
        if (visible) shown++;
      }

      if (counter) counter.textContent = `${shown} ${noun(shown)}`;
    };

    search?.addEventListener("input", apply);
    for (const select of selects) select.addEventListener("change", apply);
  }

  /* The newsroom's category filter. */
  const newsFilter = document.querySelector("[data-news-filter]");
  if (newsFilter) {
    const articles = [...document.querySelectorAll("[data-news]")];
    newsFilter.addEventListener("change", () => {
      for (const article of articles) {
        const visible = newsFilter.value === "all" || article.dataset.category === newsFilter.value;
        const wrapper = article.parentElement.classList.contains("cd-news__lead")
          ? article.parentElement
          : article;
        wrapper.hidden = !visible;
      }
    });
  }
}

/* -------------------------------------------------------- grid/list switch */

export function initViewSwitch() {
  for (const group of document.querySelectorAll("[data-view]")) {
    group.addEventListener("click", () => {
      const scope = group.closest("section, .cd-shell") ?? document;
      const target = scope.querySelector("[data-view-target]");
      if (!target) return;

      for (const button of group.parentElement.querySelectorAll("[data-view]")) {
        button.setAttribute("aria-pressed", String(button === group));
      }

      const list = group.dataset.view === "list";
      target.classList.toggle("cd-grid--3", !list);
      target.classList.toggle("cd-grid--1", list);
    });
  }
}

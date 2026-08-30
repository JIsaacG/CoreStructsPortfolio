/**
 * The Observatory's behaviour: filters, the map, the board rail and the
 * territorial comparator.
 *
 * One state object drives everything. A filter change updates it once and then
 * every chart, every map and the slice line redraw from that single source, so
 * two things on screen can never describe different slices. The map is a filter
 * too: clicking a department is the same action as choosing it in the select.
 */

import { byId, departments } from "../../data/cede/geography.js";
import { decimal, group } from "../../data/cede/format.js";
import { levels, metricFor, rate } from "../../data/cede/statistics.js";
import { defaultState, renderAll, renderChart, renderMap, scopedEnrolment } from "./render.js";

const LEVEL_NAMES = Object.fromEntries(levels.map((level) => [level.id, level.name]));

const DIMENSION_LABELS = {
  sexo: { f: "mujeres", m: "hombres" },
  area: { urbano: "área urbana", rural: "área rural" },
  administracion: { publica: "administración pública", privada: "administración privada", semioficial: "semioficial" },
  modalidad: { presencial: "presencial", alternativa: "modalidad alternativa", distancia: "a distancia" },
};

/** One shared state for the page. */
const state = defaultState();

/* ------------------------------------------------------------- the readout */

/**
 * The line that says what the reader is looking at.
 *
 * It is the microinteraction that makes a filter trustworthy: "Francisco
 * Morazán · 2026 · educación media" appears the instant the map is clicked, and
 * is announced politely to screen readers.
 */
function updateSlice() {
  const territory = state.departamento === "all" ? "Nacional" : byId[state.departamento].name;
  const slice = document.querySelector("[data-slice]");
  const detail = document.querySelector("[data-slice-detail]");

  if (slice) {
    slice.innerHTML = `<span class="cd-slice__dot"></span>${territory} · ${state.anio}`;
  }

  if (detail) {
    const parts = [];
    parts.push(state.nivel === "all" ? "todos los niveles" : LEVEL_NAMES[state.nivel]);
    for (const [key, labels] of Object.entries(DIMENSION_LABELS)) {
      if (state[key] && state[key] !== "all") parts.push(labels[state[key]]);
    }
    if (state.departamento !== "all") {
      const department = byId[state.departamento];
      parts.push(`${department.municipalities} municipios · cabecera ${department.capital}`);
    }
    detail.textContent = `${parts.join(" · ")} · datos demostrativos`;
  }
}

/** The panel beside a map. */
function updateMapInfo() {
  const id = state.departamento;
  const department = id === "all" ? null : byId[id];

  for (const panel of document.querySelectorAll("[data-map-info]")) {
    const name = panel.querySelector("[data-map-name]");
    const sub = panel.querySelector("[data-map-sub]");
    if (name) name.textContent = department ? department.name : "Nacional";
    if (sub) {
      sub.textContent = department
        ? `${department.capital} · ${department.municipalities} municipios`
        : "18 departamentos · 298 municipios";
    }

    const values = {
      matricula: group(scopedEnrolment(state)),
      centros: group(metricFor("centros", { year: Number(state.anio), department: id })),
      docentes: group(metricFor("docentes", { year: Number(state.anio), department: id })),
      cobertura: `${decimal(rate("cobertura_c12", { year: Number(state.anio), department: id }), 1)} %`,
    };

    for (const [key, value] of Object.entries(values)) {
      const cell = panel.querySelector(`[data-map-stat="${key}"]`);
      if (cell) cell.textContent = value;
    }
  }
}

/* --------------------------------------------------------------- rendering */

let frame = 0;

/** Coalesce redraws into one animation frame — a filter can move three things. */
function refresh() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    renderAll(document, state);
    for (const map of document.querySelectorAll("[data-map][data-map-metric]")) {
      renderMap(map, state);
      markSelected(map);
    }
    for (const map of document.querySelectorAll("[data-map]:not([data-map-metric])")) {
      markSelected(map);
    }
    updateSlice();
    updateMapInfo();
  });
}

/** The selected department keeps its outline on every map on the page. */
function markSelected(map) {
  for (const shape of map.querySelectorAll("[data-dep]")) {
    shape.classList.toggle("is-selected", shape.dataset.dep === state.departamento);
  }
}

/* ----------------------------------------------------------------- filters */

function initFilters() {
  const bar = document.querySelector("[data-filters]");
  if (!bar) return;

  for (const control of bar.querySelectorAll("[data-filter]")) {
    control.addEventListener("change", () => {
      state[control.dataset.filter] = control.value;
      refresh();
    });
  }

  /**
   * Publish the real heights of the two bars that stack above the boards.
   *
   * The CSS carries sensible defaults in `rem`, but `rem` is exactly what the
   * reader's text-size control changes: at A+ the collapsed header and the
   * compact filter bar are both taller than the stylesheet assumed, and the
   * board rail would overlap the filters. Measuring the elements and writing
   * the pixels back is the only version of this that survives the settings the
   * portal itself offers.
   */
  const measure = () => {
    const header = document.querySelector("[data-header]");
    const root = document.documentElement;

    if (header?.classList.contains("is-stuck")) {
      root.style.setProperty("--stuck-top", `${Math.round(header.getBoundingClientRect().height)}px`);
    }
    if (bar.classList.contains("is-compact") && !bar.classList.contains("is-open")) {
      root.style.setProperty("--filters-compact", `${Math.round(bar.getBoundingClientRect().height)}px`);
    }
  };

  let measuring = 0;
  const scheduleMeasure = () => {
    if (measuring) return;
    measuring = requestAnimationFrame(() => {
      measuring = 0;
      measure();
    });
  };

  window.addEventListener("scroll", scheduleMeasure, { passive: true });
  window.addEventListener("resize", scheduleMeasure, { passive: true });
  /* The text-size and contrast controls change both heights. */
  for (const control of document.querySelectorAll("[data-scale], [data-contrast]")) {
    control.addEventListener("click", () => setTimeout(scheduleMeasure, 60));
  }

  /**
   * The bar folds itself away once it reaches the header.
   *
   * A sentinel placed where the bar starts tells us when it has been pinned;
   * eight selects are the right control at the top of the page and the wrong
   * one hovering over a chart, so pinned means compact until the reader asks
   * for the controls back.
   */
  const toggle = bar.querySelector("[data-filters-toggle]");

  const setOpen = (open) => {
    bar.classList.toggle("is-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
  };

  toggle?.addEventListener("click", () => setOpen(!bar.classList.contains("is-open")));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && bar.classList.contains("is-open")) {
      setOpen(false);
      toggle?.focus();
    }
  });

  if ("IntersectionObserver" in window) {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "height:1px;margin-bottom:-1px;";
    bar.parentElement.insertBefore(sentinel, bar);

    new IntersectionObserver(
      ([entry]) => {
        const compact = !entry.isIntersecting;
        bar.classList.toggle("is-compact", compact);
        if (!compact) setOpen(false);
        scheduleMeasure();
      },
      { rootMargin: "-140px 0px 0px 0px", threshold: 0 },
    ).observe(sentinel);
  }

  bar.querySelector("[data-filters-reset]")?.addEventListener("click", () => {
    Object.assign(state, defaultState());
    for (const control of bar.querySelectorAll("[data-filter]")) {
      control.value = state[control.dataset.filter] ?? "all";
    }
    refresh();
  });
}

/* --------------------------------------------------------------- the maps */

/**
 * The map, as an input.
 *
 * Every department is a focusable control, so the map works from the keyboard:
 * tab to a shape, press Enter, and the whole observatory follows. Clicking the
 * selected department again clears the selection, which is the behaviour a
 * reader expects from a filter and almost never gets from a map.
 */
function initMaps() {
  const select = document.querySelector('[data-filter="departamento"]');

  const choose = (id) => {
    state.departamento = state.departamento === id ? "all" : id;
    if (select) select.value = state.departamento;
    refresh();
  };

  document.addEventListener("click", (event) => {
    const shape = event.target.closest("[data-dep]");
    if (!shape) return;
    choose(shape.dataset.dep);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const shape = event.target.closest?.("[data-dep]");
    if (!shape) return;
    event.preventDefault();
    choose(shape.dataset.dep);
  });
}

/* ------------------------------------------------------------ the board rail */

/** Mark the board the reader is actually looking at. */
function initBoardRail() {
  const links = [...document.querySelectorAll("[data-board-link]")];
  const boardsOnPage = [...document.querySelectorAll("[data-board]")];
  if (!links.length || !boardsOnPage.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = entry.target.dataset.board;
        for (const link of links) {
          const current = link.dataset.boardLink === id;
          link.toggleAttribute("aria-current", current);
          if (current) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
  );

  for (const board of boardsOnPage) observer.observe(board);

  /* Clicking a board scrolls to it; the rail then follows the scroll rather
     than fighting it. */
  for (const link of links) {
    link.addEventListener("click", () => {
      links.forEach((item) => item.removeAttribute("aria-current"));
      link.setAttribute("aria-current", "true");
    });
  }
}

/* ------------------------------------------------------------ the comparator */

function initComparator() {
  const root = document.querySelector("[data-comparator]");
  if (!root) return;

  const selects = [...root.querySelectorAll("[data-compare]")];
  state.compare = selects.map((select) => select.value);

  const metrics = {
    matricula: (id) => group(metricFor("matricula", { year: Number(state.anio), department: id })),
    centros: (id) => group(metricFor("centros", { year: Number(state.anio), department: id })),
    docentes: (id) => group(metricFor("docentes", { year: Number(state.anio), department: id })),
    ratio: (id) => decimal(metricFor("ratio", { year: Number(state.anio), department: id }), 1),
    cobertura: (id) => `${decimal(rate("cobertura_c12", { department: id }), 1)} %`,
    coberturaMedia: (id) => `${decimal(rate("cobertura_med", { department: id }), 1)} %`,
    permanencia: (id) => `${decimal(rate("retencion", { department: id }), 1)} %`,
    desercion: (id) => `${decimal(rate("desercion", { department: id }), 1)} %`,
    transicion: (id) => `${decimal(rate("transicion", { department: id }), 1)} %`,
    conectividad: (id) => `${decimal(rate("conectividad", { department: id }), 1)} %`,
    tecnica: (id) => group(metricFor("tecnica", { year: Number(state.anio), department: id })),
  };

  const update = () => {
    state.compare = selects.map((select) => select.value);

    for (const [index, head] of [...root.querySelectorAll("[data-compare-head]")].entries()) {
      head.textContent = byId[state.compare[index]].name;
    }

    for (const row of root.querySelectorAll("[data-compare-row]")) {
      const metric = metrics[row.dataset.compareRow];
      if (!metric) continue;
      const cells = [...row.querySelectorAll("td")].slice(1);
      cells.forEach((cell, index) => {
        const id = state.compare[index];
        cell.textContent = metric(id);
        cell.dataset.label = byId[id].name;
      });
    }

    for (const plot of root.querySelectorAll("[data-chart]")) renderChart(plot, state);
  };

  for (const select of selects) select.addEventListener("change", update);
  update();
}

/* ------------------------------------------------------------------ resize */

/**
 * Redraw at the new width.
 *
 * Charts are drawn in real pixels rather than scaled by a viewBox, so a resize
 * is a re-render. Debounced, because a dragged window fires this continuously.
 */
function initResize() {
  let timer;
  let lastWidth = window.innerWidth;

  window.addEventListener("resize", () => {
    if (Math.abs(window.innerWidth - lastWidth) < 24) return;
    lastWidth = window.innerWidth;
    clearTimeout(timer);
    timer = setTimeout(() => {
      renderAll(document, state);
      for (const map of document.querySelectorAll("[data-map][data-map-metric]")) markSelected(map);
    }, 220);
  });
}

export function initObservatory() {
  const hasCharts = document.querySelector("[data-chart], [data-map]");
  if (!hasCharts) return;

  initFilters();
  initMaps();
  initBoardRail();
  initComparator();
  initResize();

  /* Redraw once at load so the charts match the container they ended up in,
     rather than the 760px the build assumed. */
  requestAnimationFrame(() => {
    renderAll(document, state);
    updateSlice();
  });
}

export { state };

/**
 * The global search.
 *
 * The index is not a separate artefact that can fall out of date: it is built
 * in the browser from the same data modules the pages were generated from, so
 * anything published is searchable by definition.
 *
 * Results are grouped by what they are — an indicator, a law, a publication, a
 * news item, a policy, a dataset, a section — because someone searching
 * "docentes" needs to know whether they found a statistic or a regulation
 * before they read a single title.
 */

import { indicators, boards } from "../../data/cede/indicators.js";
import { library, normative, resolutions, themeName, typeName, kindName } from "../../data/cede/documents.js";
import { articles, knowledge } from "../../data/cede/newsroom.js";
import { agenda } from "../../data/cede/policy.js";
import { datasets } from "../../data/cede/transparency.js";
import { consultations } from "../../data/cede/participation.js";
import { routes } from "../../data/cede/institution.js";
import { longDate } from "../../data/cede/format.js";

/**
 * Where the portal root is, relative to the page asking.
 *
 * Read off the emblem's own link rather than parsed out of the URL: the link is
 * already correct for this page at whatever depth it sits, and it keeps working
 * if the portal is served from a subdirectory.
 */
function base() {
  const home = document.querySelector(".cd-logo")?.getAttribute("href") ?? "index.html";
  return home.replace(/index\.html$/, "");
}

const normalise = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

let index = null;

/** Build the index once, on first use. */
function buildIndex() {
  if (index) return index;
  const root = base();
  const entries = [];

  const add = (group, title, meta, url, extra = "") =>
    entries.push({ group, title, meta, url, key: normalise(`${title} ${meta} ${extra}`) });

  for (const indicator of indicators) {
    add(
      "Indicadores",
      indicator.name,
      `${boards.find((board) => board.id === indicator.board)?.name ?? ""} · ${indicator.unit}`,
      `${root}datos/indicadores/${indicator.slug}.html`,
      indicator.definition,
    );
  }

  for (const item of normative) {
    add(
      "Normativa",
      item.title,
      `${typeName(item.type)} · ${item.code} · ${longDate(item.date)}`,
      `${root}${routes.normativa}`,
      `${item.summary} ${themeName(item.theme)}`,
    );
  }

  for (const item of resolutions) {
    add(
      "Normativa",
      item.title,
      `Resolución · ${item.code} · ${longDate(item.date)}`,
      `${root}${routes.resoluciones}`,
      `${item.summary} ${themeName(item.theme)}`,
    );
  }

  for (const item of library) {
    add(
      "Documentos",
      item.title,
      `${kindName(item.kind)} · ${longDate(item.date)}`,
      `${root}${routes.biblioteca}#${item.slug}`,
      item.summary,
    );
  }

  for (const piece of knowledge) {
    add("Documentos", piece.title, `${piece.kind} · ${piece.theme}`, `${root}${routes.biblioteca}#${piece.slug}`, piece.summary);
  }

  for (const article of articles) {
    add(
      "Noticias",
      article.title,
      longDate(article.date),
      `${root}noticias/${article.slug}.html`,
      article.summary,
    );
  }

  for (const item of agenda) {
    add("Políticas", item.title, `${item.code} · ${item.since}`, `${root}${routes.politica}#agenda`, item.text);
  }

  for (const consultation of consultations) {
    add(
      "Participación",
      consultation.title,
      `Consulta ${consultation.code} · ${consultation.theme}`,
      `${root}participacion/${consultation.slug}.html`,
      consultation.summary,
    );
  }

  for (const dataset of datasets) {
    add(
      "Datos abiertos",
      dataset.title,
      `${dataset.theme} · ${dataset.periodicity}`,
      `${root}${routes.abiertos}#${dataset.slug}`,
      dataset.summary,
    );
  }

  const sections = [
    ["Institución", "Mandato, funciones, estructura y directorio", "institucion"],
    ["Política educativa", "Marco, objetivos, líneas estratégicas y agenda", "politica"],
    ["Planificación", "Plan Nacional 2026–2035 y monitor de avance", "planificacion"],
    ["Observatorio Educativo", "Diez tableros de indicadores", "datos"],
    ["Comparar territorios", "Comparación entre departamentos", "comparador"],
    ["Metodología de datos", "Fuentes, validación y diccionario de variables", "metodologia"],
    ["Datos abiertos", "Catálogo de conjuntos descargables", "abiertos"],
    ["Normativa", "Marco normativo y buscador jurídico", "normativa"],
    ["Resoluciones y acuerdos", "Registro de decisiones del Consejo", "resoluciones"],
    ["Biblioteca digital", "Informes, investigaciones y publicaciones", "biblioteca"],
    ["Programas", "Programas que ejecutan el plan", "programas"],
    ["Participación ciudadana", "Consultas, foros, encuestas y audiencias", "participacion"],
    ["Transparencia", "Obligaciones de publicación y solicitudes", "transparencia"],
    ["Actualidad", "Noticias y agenda institucional", "actualidad"],
    ["Contacto", "Formulario y datos de contacto demostrativos", "contacto"],
  ];

  for (const [title, meta, route] of sections) {
    add("Secciones", title, meta, `${root}${routes[route]}`);
  }

  index = entries;
  return index;
}

/** Rank: a hit in the title beats a hit in the body, and earlier beats later. */
function search(query, limit = 40) {
  const needle = normalise(query).trim();
  if (needle.length < 2) return [];

  const words = needle.split(/\s+/);

  return buildIndex()
    .map((entry) => {
      let score = 0;
      const title = normalise(entry.title);
      for (const word of words) {
        if (!entry.key.includes(word)) return null;
        score += title.includes(word) ? 8 : 2;
        if (title.startsWith(word)) score += 6;
      }
      return { entry, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((hit) => hit.entry);
}

const GROUP_ORDER = [
  "Indicadores",
  "Normativa",
  "Documentos",
  "Noticias",
  "Políticas",
  "Participación",
  "Datos abiertos",
  "Secciones",
];

const groupResults = (results) => {
  const groups = new Map();
  for (const result of results) {
    if (!groups.has(result.group)) groups.set(result.group, []);
    groups.get(result.group).push(result);
  }
  return [...groups.entries()].sort(
    (a, b) => GROUP_ORDER.indexOf(a[0]) - GROUP_ORDER.indexOf(b[0]),
  );
};

const escapeHtml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ------------------------------------------------------- the header search */

export function initSearch() {
  const root = document.querySelector("[data-search]");
  if (root) initSuggestions(root);
  initResultsPage();
}

function initSuggestions(root) {
  const input = root.querySelector("input[type='search']");
  const panel = root.querySelector("#cd-suggest");
  if (!input || !panel) return;

  let active = -1;

  const close = () => {
    panel.hidden = true;
    input.setAttribute("aria-expanded", "false");
    active = -1;
  };

  const open = (results) => {
    if (!results.length) {
      panel.innerHTML = `<p class="cd-suggest__empty">Sin resultados para «${escapeHtml(input.value)}».</p>`;
    } else {
      panel.innerHTML = groupResults(results.slice(0, 12))
        .map(
          ([group, items]) =>
            `<div class="cd-suggest__group"><p class="cd-suggest__heading"><span>${escapeHtml(group)}</span>` +
            `<span>${items.length}</span></p>` +
            items
              .map(
                (item) =>
                  `<a class="cd-suggest__item" href="${escapeHtml(item.url)}" role="option">` +
                  `<span class="cd-suggest__title">${escapeHtml(item.title)}</span>` +
                  `<span class="cd-suggest__meta">${escapeHtml(item.meta)}</span></a>`,
              )
              .join("") +
            `</div>`,
        )
        .join("");
    }
    panel.hidden = false;
    input.setAttribute("aria-expanded", "true");
    active = -1;
  };

  input.addEventListener("input", () => {
    const value = input.value.trim();
    if (value.length < 2) {
      close();
      return;
    }
    open(search(value, 12));
  });

  input.addEventListener("keydown", (event) => {
    const options = [...panel.querySelectorAll(".cd-suggest__item")];
    if (event.key === "Escape") {
      close();
      return;
    }
    if (!options.length || panel.hidden) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      active = (active + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
      options.forEach((option, index) => option.classList.toggle("is-active", index === active));
      options[active].scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      window.location.href = options[active].href;
    }
  });

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) close();
  });
}

/* ---------------------------------------------------------- the results page */

function initResultsPage() {
  const form = document.querySelector("[data-search-page]");
  if (!form) return;

  const input = form.querySelector("input[name='q']");
  const output = document.querySelector("[data-search-results]");
  const counter = form.querySelector("[data-search-count]");
  const fallback = document.querySelector("[data-search-empty]");

  const render = (query) => {
    const results = query.trim().length >= 2 ? search(query, 60) : [];

    if (!query.trim()) {
      output.innerHTML = "";
      counter.textContent = "Escriba para buscar en todo el portal.";
      if (fallback) fallback.hidden = false;
      return;
    }

    if (fallback) fallback.hidden = true;

    if (!results.length) {
      output.innerHTML =
        `<p class="cd-note cd-note--boxed">Sin resultados para «${escapeHtml(query)}». ` +
        `Pruebe con un término más general, como «docentes», «cobertura» o «normativa».</p>`;
      counter.textContent = "0 resultados";
      return;
    }

    counter.textContent = `${results.length} resultado${results.length === 1 ? "" : "s"} para «${query}»`;
    output.innerHTML = groupResults(results)
      .map(
        ([group, items]) =>
          `<section style="margin-bottom:2rem">` +
          `<p class="cd-label"><span class="cd-label__index">${items.length}</span>` +
          `<span>${escapeHtml(group)}</span></p>` +
          `<div class="cd-docs">` +
          items
            .map(
              (item) =>
                `<a class="cd-doc" href="${escapeHtml(item.url)}">` +
                `<p class="cd-doc__code">${escapeHtml(group)}</p>` +
                `<div><p class="cd-doc__title">${escapeHtml(item.title)}</p>` +
                `<p class="cd-doc__text">${escapeHtml(item.meta)}</p></div></a>`,
            )
            .join("") +
          `</div></section>`,
      )
      .join("");
  };

  form.addEventListener("submit", (event) => event.preventDefault());
  input.addEventListener("input", () => {
    render(input.value);
    const url = new URL(window.location.href);
    if (input.value) url.searchParams.set("q", input.value);
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", url);
  });

  const initial = new URL(window.location.href).searchParams.get("q") ?? "";
  if (initial) {
    input.value = initial;
    render(initial);
  }
}

/**
 * Downloads.
 *
 * Every chart in the portal ships its own data table, so a download does not
 * need a second copy of the data: it serialises the table that is already next
 * to the chart. That guarantees the file contains exactly the figures the
 * reader was looking at — including any filter they had applied — and it means
 * a new chart gets working downloads for free.
 *
 * CSV, XLSX and JSON are produced for real. "PDF" opens the browser's print
 * dialog, which is how a public portal actually produces one: the print
 * stylesheet already strips the chrome.
 */

import { toXlsx } from "./xlsx.js";

/** The invented-data warning travels with the file, not just with the page. */
const NOTICE =
  "Datos demostrativos generados por el portal CEDE (entidad ficticia). " +
  "No corresponden a estadisticas oficiales.";

/** Read a rendered table back into rows of values. */
function readTable(table) {
  const header = [...table.querySelectorAll("thead th")].map((cell) =>
    cell.textContent.replace(/\s+/g, " ").trim(),
  );

  const rows = [...table.querySelectorAll("tbody tr")]
    .filter((row) => !row.hidden)
    .map((row) =>
      [...row.children].map((cell) => {
        const text = cell.textContent.replace(/\s+/g, " ").trim();
        /* A numeric column is written as a number so the workbook can sort and
           chart it; the thousands separators and the unit are stripped, and the
           unit is already named in the header. */
        if (cell.classList.contains("cd-num")) {
          const numeric = Number(text.replace(/[^\d.-]/g, ""));
          return Number.isFinite(numeric) && text !== "" ? numeric : text;
        }
        return text;
      }),
    );

  const caption = table.querySelector("caption")?.textContent.replace(/\s+/g, " ").trim() ?? "";
  return { header, rows, caption };
}

const slug = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "datos";

function save(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  /* Revoking immediately can cancel the download in some browsers. */
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function toCsv({ header, rows, caption }) {
  const cell = (value) => {
    const text = String(value ?? "");
    return /[",;\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  return (
    `# ${NOTICE}\n` +
    (caption ? `# ${caption}\n` : "") +
    [header, ...rows].map((row) => row.map(cell).join(",")).join("\n") +
    "\n"
  );
}

function toJson({ header, rows, caption }) {
  const keys = header.map((label) => slug(label).replace(/-/g, "_"));
  return JSON.stringify(
    {
      aviso: NOTICE,
      descripcion: caption,
      generado: new Date().toISOString().slice(0, 10),
      registros: rows.map((row) => Object.fromEntries(keys.map((key, index) => [key, row[index]]))),
    },
    null,
    2,
  );
}

/** Confirm on the button itself — a download that says nothing feels broken. */
function confirmOn(button, label) {
  const original = button.dataset.label ?? button.textContent;
  button.dataset.label = original;
  button.dataset.done = "1";
  button.setAttribute("aria-live", "polite");
  setTimeout(() => {
    delete button.dataset.done;
  }, 2600);
  void label;
}

export function initDownloads() {
  document.addEventListener("click", (event) => {
    const printer = event.target.closest("[data-print]");
    if (printer) {
      event.preventDefault();
      window.print();
      return;
    }

    const button = event.target.closest("[data-download]");
    if (!button) return;

    const figure = button.closest("figure, section, article, .cd-chart");
    const table = figure?.querySelector("table");
    if (!table) return;

    const data = readTable(table);
    const name = slug(
      figure.querySelector(".cd-chart__title")?.textContent ?? data.caption ?? "datos-cede",
    );
    const format = button.dataset.download;

    if (format === "csv") {
      save(new Blob([`﻿${toCsv(data)}`], { type: "text/csv;charset=utf-8" }), `cede-${name}.csv`);
    } else if (format === "json") {
      save(new Blob([toJson(data)], { type: "application/json" }), `cede-${name}.json`);
    } else if (format === "xlsx") {
      save(toXlsx({ rows: [data.header, ...data.rows], sheetName: "Datos CEDE" }), `cede-${name}.xlsx`);
    }

    confirmOn(button, format);
  });
}

/* ------------------------------------------------- catalogue and documents */

/**
 * The open-data catalogue and the document library.
 *
 * A dataset card has no table beside it, so its download is built from the
 * catalogue entry itself: the descriptive record, in the requested format. A
 * PDF placeholder would have been the easy answer; a real file that says what
 * it is, and what it is not, is the better one.
 */
export function initCatalogueDownloads() {
  document.addEventListener("click", async (event) => {
    const dataset = event.target.closest("[data-dataset]");
    if (dataset) {
      event.preventDefault();
      const { datasets } = await import("../../data/cede/transparency.js");
      const { buildDatasetRows } = await import("./datasets.js");
      const entry = datasets.find((item) => item.slug === dataset.dataset);
      if (!entry) return;

      const { header, rows } = buildDatasetRows(entry);
      const format = dataset.dataset && dataset.getAttribute("data-format");
      const name = slug(entry.title);

      if (format === "csv") {
        save(
          new Blob([`﻿${toCsv({ header, rows, caption: entry.title })}`], {
            type: "text/csv;charset=utf-8",
          }),
          `cede-${name}.csv`,
        );
      } else if (format === "json") {
        save(
          new Blob([toJson({ header, rows, caption: entry.title })], { type: "application/json" }),
          `cede-${name}.json`,
        );
      } else {
        save(toXlsx({ rows: [header, ...rows], sheetName: "Datos CEDE" }), `cede-${name}.xlsx`);
      }

      confirmOn(dataset, format);
      return;
    }

    /* A normative instrument or a publication: the file does not exist, and the
       prototype says so plainly rather than serving an empty PDF. */
    const document_ = event.target.closest("[data-document]");
    if (!document_) return;
    event.preventDefault();
    announce(
      `«${document_.dataset.document}» es un documento ficticio: en esta demostración no existe el ` +
        `archivo. En un despliegue real, este botón entrega el PDF desde el repositorio documental.`,
    );
  });
}

/** A single polite live region, reused by every simulated action. */
function announce(message) {
  let box = document.querySelector("[data-announce]");
  if (!box) {
    box = document.createElement("div");
    box.setAttribute("data-announce", "");
    box.setAttribute("role", "status");
    box.setAttribute("aria-live", "polite");
    box.className = "cd-toast";
    document.body.append(box);
  }
  box.textContent = message;
  box.classList.add("is-visible");
  clearTimeout(box.timer);
  box.timer = setTimeout(() => box.classList.remove("is-visible"), 6000);
}

export { announce };

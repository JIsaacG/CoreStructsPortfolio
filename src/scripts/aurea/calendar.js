/**
 * The institutional calendar.
 *
 * Three jobs: move between months, cross two taxonomies of filters, and get an
 * event out of the site and into the reader's own calendar.
 *
 * The third is the one that matters and the one almost no school website does.
 * A date that a parent cannot add to their phone is a date they will miss, so
 * the export here is real: the `.ics` is generated in the browser from the
 * event's own data, which every calendar application on earth imports, and the
 * Google and Outlook buttons build the add-event URL those two actually
 * accept. Nothing is sent anywhere to produce it.
 *
 * The current month is rendered by the build; this module re-renders the grid
 * when the reader moves, from the same event objects, so the two cannot
 * disagree.
 */

import { $, $$, store, toast } from "./dom.js";

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const DOW = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const pad = (value) => String(value).padStart(2, "0");

/* ------------------------------------------------------------------ export */

/** `2026-09-18` → `20260918`, the only date format iCalendar accepts here. */
const stamp = (iso) => iso.replace(/-/g, "");

/** The day after the last day — iCalendar all-day ranges are end-exclusive. */
function dayAfter(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + 1));
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
}

/** Escape the four characters iCalendar reserves inside a text value. */
const icsText = (value) =>
  String(value).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

function buildIcs(event) {
  const end = dayAfter(event.endDate ?? event.date);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AUREA//Portal demostrativo//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@aurea.example`,
    `DTSTAMP:${stamp(event.date)}T000000Z`,
    `DTSTART;VALUE=DATE:${stamp(event.date)}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${icsText(event.title)}`,
    `LOCATION:${icsText(event.place)}`,
    `DESCRIPTION:${icsText(`${event.text} — Evento demostrativo de AUREA, institución ficticia.`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function download(event) {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `aurea-${event.id}.ics`;
  document.body.append(link);
  link.click();
  link.remove();
  /* Revoked on the next frame: revoking synchronously races the download in
     some browsers and produces an empty file. */
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function externalUrl(target, event) {
  const end = dayAfter(event.endDate ?? event.date);
  const details = `${event.text} — Evento demostrativo de AUREA, institución ficticia.`;

  if (target === "google") {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${stamp(event.date)}/${end}`,
      details,
      location: event.place,
    });
    return `https://calendar.google.com/calendar/render?${params}`;
  }

  if (target === "outlook") {
    const params = new URLSearchParams({
      path: "/calendar/action/compose",
      rru: "addevent",
      subject: event.title,
      startdt: event.date,
      enddt: event.endDate ?? event.date,
      allday: "true",
      body: details,
      location: event.place,
    });
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
  }

  return null;
}

/* -------------------------------------------------------------- the module */

export function initCalendar() {
  const root = $("[data-calendar]");
  const island = document.getElementById("au-events");

  /* The export menus exist on pages without a calendar — the homepage event
     strip, a programme page — so they are wired before the grid returns. */
  initExport(island);

  if (!root || !island) return;

  let events = [];
  try {
    events = JSON.parse(island.textContent);
  } catch {
    return;
  }

  const grid = $("[data-cal-grid]", root);
  const monthLabel = $("[data-cal-month]", root);
  const list = $("[data-cal-list]", root);
  const empty = $("[data-cal-empty]", root);
  const countOut = $("[data-cal-count]", root);

  let year = Number(root.dataset.year);
  let month = Number(root.dataset.month);

  function activeFilters(key) {
    const chips = $$(`[data-cal-filter="${key}"][aria-pressed="true"]`, root);
    return new Set(chips.map((chip) => chip.dataset.value));
  }

  function matches(event) {
    const cats = activeFilters("category");
    const auds = activeFilters("audience");
    if (cats.size && !cats.has(event.category)) return false;
    /* “Toda la comunidad” events belong to every audience, not to a third one:
       filtering to Educación Media must not hide the aniversario. */
    if (auds.size && !auds.has(event.audience) && event.audience !== "todos") return false;
    return true;
  }

  /** Build the month grid: leading blanks, the days, trailing blanks. */
  function renderGrid() {
    if (!grid) return;

    const first = new Date(year, month, 1);
    /* getDay() is Sunday-first; the calendar is Monday-first, as it is read
       here. */
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const today = new Date();

    const cells = [];

    for (let i = offset; i > 0; i--) {
      cells.push({ label: prevDays - i + 1, out: true });
    }

    for (let day = 1; day <= days; day++) {
      const iso = `${year}-${pad(month + 1)}-${pad(day)}`;
      cells.push({
        label: day,
        iso,
        today:
          today.getFullYear() === year && today.getMonth() === month && today.getDate() === day,
        events: events.filter((event) => {
          const start = event.date;
          const end = event.endDate ?? event.date;
          return iso >= start && iso <= end && matches(event);
        }),
      });
    }

    while (cells.length % 7 !== 0) cells.push({ label: cells.length, out: true });

    grid.innerHTML =
      DOW.map((day) => `<div class="au-cal__dow" role="columnheader">${day}</div>`).join("") +
      cells
        .map((cell) => {
          if (cell.out) return '<div class="au-cal__day au-cal__day--out" aria-hidden="true"></div>';

          const marks = (cell.events ?? [])
            .map(
              (event) =>
                `<button class="au-cal__event" type="button" data-cat="${event.category}" ` +
                `data-goto="${event.id}">${event.title}</button>`,
            )
            .join("");

          return (
            `<div class="au-cal__day${cell.today ? " au-cal__day--today" : ""}">` +
            `<span class="au-cal__num">${cell.label}</span>${marks}</div>`
          );
        })
        .join("");

    if (monthLabel) monthLabel.textContent = `${MONTHS[month]} ${year}`;
  }

  /** The list view shares the filters and is the accessible twin of the grid. */
  function renderList() {
    if (!list) return;

    let shown = 0;
    for (const row of $$("[data-event]", list)) {
      const event = events.find((entry) => entry.id === row.dataset.event);
      const visible = event ? matches(event) : true;
      row.hidden = !visible;
      if (visible) shown++;
    }

    if (empty) empty.hidden = shown > 0;
    if (countOut) countOut.textContent = `${shown} ${shown === 1 ? "evento" : "eventos"}`;
  }

  function refresh() {
    renderGrid();
    renderList();
  }

  $("[data-cal-prev]", root)?.addEventListener("click", () => {
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    refresh();
  });

  $("[data-cal-next]", root)?.addEventListener("click", () => {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    refresh();
  });

  for (const chip of $$("[data-cal-filter]", root)) {
    chip.addEventListener("click", () => {
      chip.setAttribute("aria-pressed", String(chip.getAttribute("aria-pressed") !== "true"));
      refresh();
    });
  }

  /* View switch. The choice is remembered, because a reader who prefers the
     list on a phone prefers it on every visit. */
  const views = $$("[data-cal-view]", root);
  function setView(view) {
    for (const button of views) {
      button.setAttribute("aria-pressed", String(button.dataset.calView === view));
    }
    const gridWrap = $("[data-cal-gridwrap]", root);
    if (gridWrap) gridWrap.hidden = view !== "mes";
    if (list) list.hidden = view !== "lista";
    const listTools = $("[data-cal-listtools]", root);
    if (listTools) listTools.hidden = view !== "lista";
    store.set("cal-view", view);
  }

  for (const button of views) {
    button.addEventListener("click", () => setView(button.dataset.calView));
  }

  const saved = store.get("cal-view");
  const narrow = window.matchMedia("(max-width: 46rem)").matches;
  setView(saved ?? (narrow ? "lista" : "mes"));

  /* A click on an event in the grid jumps to its entry in the list, which is
     where its full detail and its export controls live. */
  grid?.addEventListener("click", (clickEvent) => {
    const button = clickEvent.target.closest("[data-goto]");
    if (!button) return;
    setView("lista");
    const row = $(`[data-event="${button.dataset.goto}"]`, root);
    row?.scrollIntoView({ behavior: "smooth", block: "center" });
    row?.querySelector("a, button")?.focus();
  });

  refresh();
}

/* ------------------------------------------------------------ export menus */

function initExport(island) {
  let events = [];
  if (island) {
    try {
      events = JSON.parse(island.textContent);
    } catch {
      events = [];
    }
  }

  for (const wrap of $$("[data-export]")) {
    const button = $("[data-export-toggle]", wrap);
    const menu = $("[data-export-menu]", wrap);
    if (!button || !menu) continue;

    button.addEventListener("click", () => {
      const open = !menu.hidden;
      for (const other of $$("[data-export-menu]")) other.hidden = true;
      menu.hidden = open;
      button.setAttribute("aria-expanded", String(!open));
    });

    for (const item of $$("[data-export-target]", menu)) {
      item.addEventListener("click", () => {
        const event = events.find((entry) => entry.id === wrap.dataset.export);
        menu.hidden = true;
        button.setAttribute("aria-expanded", "false");

        if (!event) {
          toast("Este evento no está disponible para exportar en la demo.");
          return;
        }

        const target = item.dataset.exportTarget;
        if (target === "ical" || target === "descargar") {
          download(event);
          toast(`Archivo .ics generado: ${event.title}.`);
          return;
        }

        const url = externalUrl(target, event);
        if (url) {
          window.open(url, "_blank", "noopener");
          toast("Se abrió tu calendario en una pestaña nueva.");
        }
      });
    }
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-export]")) return;
    for (const menu of $$("[data-export-menu]")) menu.hidden = true;
    for (const button of $$("[data-export-toggle]")) button.setAttribute("aria-expanded", "false");
  });
}

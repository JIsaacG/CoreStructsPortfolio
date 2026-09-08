/**
 * Formatting for the AUREA portal — written by hand, not delegated to `Intl`.
 *
 * The same reason CEDE gives applies here: the build renders a figure in Node
 * and the browser re-renders it when a filter, a simulator or a calculator
 * changes, and the two have to agree to the character. `toLocaleString`
 * depends on the ICU data of whoever runs the build, so a machine without full
 * ICU would emit "L 42500" where the browser emits "L 42,500" and the number
 * would change under the reader the moment they touched a control.
 *
 * Convention is Honduran Spanish: comma for thousands, point for decimals.
 */

/** 8400 -> "8,400" */
export function group(value) {
  const negative = value < 0;
  const digits = Math.abs(Math.round(value)).toString();
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += ",";
    out += digits[i];
  }
  return negative ? `−${out}` : out;
}

/** 4.13 -> "4.1" · always the same number of decimals. */
export function decimal(value, places = 1) {
  if (value === null || value === undefined) return "—";
  const factor = 10 ** places;
  const rounded = Math.round(Math.abs(value) * factor) / factor;
  const whole = Math.floor(rounded);
  const rest = Math.round((rounded - whole) * factor);
  const sign = value < 0 ? "−" : "";
  return places ? `${sign}${group(whole)}.${String(rest).padStart(places, "0")}` : `${sign}${group(whole)}`;
}

export const percent = (value, places = 0) => (value === null ? "—" : `${decimal(value, places)} %`);

/**
 * Money, in lempiras.
 *
 * Every figure in the cost calculator and the scholarship table passes through
 * here, including the ones the browser recomputes — see `scripts/aurea/money.js`,
 * which is this function again for the client so the two cannot drift.
 */
export const lempiras = (value) => `L ${group(value)}`;

/* -------------------------------------------------------------------- dates */

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export const monthName = (index) => MONTHS[index];
export const monthShort = (index) => MONTHS_SHORT[index];

/** "2026-09-18" -> "18 de septiembre de 2026". Parsed as parts, never as a
    Date: `new Date("2026-09-18")` is UTC midnight and can render as the 17th. */
export function longDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} de ${MONTHS[month - 1]} de ${year}`;
}

/** "2026-09-18" -> "18 sep 2026" */
export function shortDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS_SHORT[month - 1]} ${year}`;
}

/** "2026-09-18" -> { day: "18", month: "SEP", year: "2026", weekday: "viernes" } */
export function dateParts(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  /* Zeller-free: the Date is built from local parts, so no timezone shift. */
  const weekday = DAYS[new Date(year, month - 1, day).getDay()];
  return {
    day: String(day).padStart(2, "0"),
    month: MONTHS_SHORT[month - 1].toUpperCase(),
    monthLong: MONTHS[month - 1],
    year: String(year),
    weekday,
  };
}

/** Reading time from a word count, rounded the way a magazine rounds it. */
export const readingTime = (words) => `${Math.max(2, Math.round(words / 200))} min de lectura`;

/* ------------------------------------------------------------------- text */

/** HTML-escape. Everything the generators emit passes through here. */
export const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** A URL-safe, accent-free slug — used for ids derived from titles. */
export const slugify = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Paragraph text: a data string with blank lines becomes real paragraphs. */
export const paragraphs = (text, className = "au-prose__p") =>
  String(text)
    .split("\n\n")
    .map((block) => `<p class="${className}">${escape(block.trim())}</p>`)
    .join("");

/**
 * Accent-insensitive haystack for the search boxes.
 *
 * A visitor types "psicologia" and expects "Psicología". Normalising both sides
 * to the same accent-free lowercase is the whole of it — and it lives here
 * rather than in the browser module because the build uses it to write the
 * `data-haystack` attributes the browser then matches against.
 */
export const fold = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

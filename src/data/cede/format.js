/**
 * Formatting, written by hand rather than delegated to `Intl`.
 *
 * The portal renders every chart twice — once at build time in Node and once in
 * the browser when a filter changes — and the two have to agree to the
 * character. `toLocaleString` depends on the ICU data of whoever is running it,
 * so a build machine without full ICU would quietly emit "2381500" where the
 * browser emits "2,381,500", and the number would change under the reader as
 * soon as they touched a control. Sixty lines of arithmetic remove that class
 * of bug entirely.
 *
 * Convention is Honduran Spanish: comma for thousands, point for decimals.
 */

/** 2381500 -> "2,381,500" */
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

/** A percentage, with its sign when it is a change. */
export const percent = (value, places = 1) => (value === null ? "—" : `${decimal(value, places)} %`);

export const signed = (value, places = 1) =>
  value === null || value === undefined
    ? "—"
    : `${value > 0 ? "+" : value < 0 ? "−" : ""}${decimal(Math.abs(value), places)}`;

/**
 * Compact form for tiles where the full number does not fit.
 *
 * Only ever used where the exact figure is one hover or one table row away.
 */
export function compact(value) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${decimal(value / 1_000_000, 2)} M`;
  if (abs >= 10_000) return `${decimal(value / 1000, 1)} mil`;
  return group(value);
}

/** Currency of the finance board. Millions of lempiras, invented. */
export const lempiras = (millions) => `L ${group(millions)} M`;

/* -------------------------------------------------------------------- dates */

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** "2026-08-26" -> "26 de agosto de 2026". Parsed as parts, never as a Date:
    `new Date("2026-08-26")` is UTC midnight and can render as the 25th. */
export function longDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} de ${MONTHS[month - 1]} de ${year}`;
}

/** "2026-08-26" -> "26 ago 2026" */
export function shortDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS_SHORT[month - 1]} ${year}`;
}

/** "2026-08-26" -> { day: "26", month: "AGO", year: "2026" } for calendar chips. */
export function dateParts(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return { day: String(day).padStart(2, "0"), month: MONTHS_SHORT[month - 1].toUpperCase(), year: String(year) };
}

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
    /* NFD splits an accented letter into letter + combining mark, so the mark
       can be dropped by range instead of by a table of every accented vowel. */
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Paragraph text: a data string with blank lines becomes real paragraphs. */
export const paragraphs = (text, className = "cd-prose__p") =>
  String(text)
    .split("\n\n")
    .map((block) => `<p class="${className}">${escape(block.trim())}</p>`)
    .join("");

/** Format a value the way its indicator declares it should be read. */
export function byFormat(value, format) {
  if (value === null || value === undefined) return "—";
  if (format === "rate") return `${decimal(value, 1)} %`;
  if (format === "decimal") return decimal(value, 1);
  return group(value);
}

/**
 * The two text utilities the build and the browser both need.
 *
 * `escape` is the important one: every string that reaches the markup goes
 * through it, including the ones a visitor types into the request form and the
 * ones read back out of `localStorage` on the next visit.
 */

/** HTML-escape a value for interpolation into markup. */
export const escape = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** `2026-08-30` → `30 de agosto de 2026`. */
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function longDate(iso) {
  const [y, m, d] = String(iso).slice(0, 10).split("-").map(Number);
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
}

/** `2026-08-30` → `30 ago 2026`. */
export function shortDate(iso) {
  const [y, m, d] = String(iso).slice(0, 10).split("-").map(Number);
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1].slice(0, 3)} ${y}`;
}

/** The clock part of a local ISO stamp: `2026-08-30T10:31` → `10:31`. */
export const timeOf = (iso) => String(iso).split("T")[1]?.slice(0, 5) ?? "";

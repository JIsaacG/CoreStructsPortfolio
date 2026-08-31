/**
 * Text utilities the Rumbo build needs. Same contract as `flujo/format.js`:
 * `escape` is the one every string goes through before it reaches markup.
 */

export const escape = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** `18450` → `L 18,450`. Lempiras, no decimals — the register never carries cents. */
export function money(amount) {
  const sign = amount < 0 ? "-" : "";
  return `${sign}L ${Math.abs(Math.round(amount)).toLocaleString("es-HN")}`;
}

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** `2026-08-24` → `24 de agosto de 2026`. */
export function longDate(iso) {
  const [y, m, d] = String(iso).slice(0, 10).split("-").map(Number);
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
}

/** `2026-08-24` → `24 ago 2026`. */
export function shortDate(iso) {
  const [y, m, d] = String(iso).slice(0, 10).split("-").map(Number);
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1].slice(0, 3)} ${y}`;
}

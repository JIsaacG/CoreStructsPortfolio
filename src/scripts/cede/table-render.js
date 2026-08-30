/**
 * The table renderer.
 *
 * PURE, like the chart renderers, and for the same reason: the build writes the
 * first table and the browser rewrites it when a filter changes, and the two
 * have to be the same table. It lives under `src/scripts/` rather than under
 * `tools/` because both sides import it — the build through `tools/cede/blocks.mjs`,
 * the browser through `render.js`.
 *
 * `columns` declares each column's label, alignment and whether it can be
 * sorted; the label is repeated into every cell as `data-label`, which is what
 * lets the narrow-screen card layout keep every value named.
 */

import { escape } from "../../data/cede/format.js";

const SORT_ARROW =
  '<svg class="cd-sort__arrow" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" ' +
  'fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 1v8M2 6l3 3 3-3"/></svg>';

export function table({ columns, rows, caption, className = "", stack = true, foot, id }) {
  const headCells = columns
    .map(
      (column) =>
        `<th scope="col"${column.numeric ? ' class="cd-num"' : ""}` +
        `${column.sortable ? ` aria-sort="none" data-sort="${escape(column.key)}"` : ""}>` +
        `${
          column.sortable
            ? `<button class="cd-sort" type="button">${escape(column.label)}${SORT_ARROW}</button>`
            : escape(column.label)
        }</th>`,
    )
    .join("");

  const bodyRows = rows
    .map(
      (row) =>
        `<tr${row.id ? ` data-row="${escape(row.id)}"` : ""}>` +
        columns
          .map((column, index) => {
            const classes = [column.numeric ? "cd-num" : "", index === 0 ? "cd-table__name" : ""]
              .filter(Boolean)
              .join(" ");
            return (
              `<td${classes ? ` class="${classes}"` : ""} data-label="${escape(column.label)}">` +
              `${row.cells[index]}</td>`
            );
          })
          .join("") +
        `</tr>`,
    )
    .join("");

  return (
    `<div class="cd-tablewrap${className ? ` ${className}` : ""}"${id ? ` id="${escape(id)}"` : ""}>` +
    `<table class="cd-table${stack ? " cd-table--stack" : ""}">` +
    (caption ? `<caption>${escape(caption)}</caption>` : "") +
    `<thead><tr>${headCells}</tr></thead><tbody>${bodyRows}</tbody>` +
    (foot ? `<tfoot><tr>${foot}</tr></tfoot>` : "") +
    `</table></div>`
  );
}

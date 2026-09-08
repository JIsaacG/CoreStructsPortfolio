/**
 * Orbita — the comparison table.
 *
 * The table is complete in the markup: every product is a real column in a real
 * `<table>`, with `<th scope>` on both axes. Choosing which three to look at
 * only sets `hidden` on the cells of a column, which keeps the table a table —
 * readable by a screen reader, selectable, and correct with scripting off, when
 * it simply shows the first three.
 */

export function initCompare(root = document) {
  const widget = root.querySelector("[data-compare]");
  if (!widget) return;

  const limit = Number(widget.dataset.limit) || 3;
  const picks = [...widget.querySelectorAll("[data-compare-pick]")];
  const count = widget.querySelector("[data-compare-count]");
  if (!picks.length) return;

  const paint = () => {
    const chosen = picks.filter((pick) => pick.checked).map((pick) => pick.value);

    for (const cell of widget.querySelectorAll("[data-col]")) {
      cell.hidden = !chosen.includes(cell.dataset.col);
    }

    // At the limit, the unchecked boxes are disabled rather than ignored: the
    // rule is then visible before someone runs into it.
    for (const pick of picks) {
      pick.disabled = !pick.checked && chosen.length >= limit;
    }

    if (count) count.textContent = `${chosen.length} de ${limit}`;
  };

  widget.addEventListener("change", (event) => {
    if (!event.target.matches("[data-compare-pick]")) return;

    // Never leave the table with nothing in it: the last column stays.
    const chosen = picks.filter((pick) => pick.checked);
    if (!chosen.length) {
      event.target.checked = true;
      return;
    }

    paint();
  });

  paint();
}

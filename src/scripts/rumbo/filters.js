/**
 * Progressive enhancement for the two tables that need it (expedientes,
 * filtered by estado; operaciones, filtered by tipo). The register is
 * complete in the HTML either way — a client with JavaScript disabled sees
 * every row, just without the filter chips doing anything.
 *
 * One instance per `[data-table]` on the page, so expedientes.html and
 * operaciones.html share the same script without knowing about each other.
 */

function initTable(table) {
  const group = table.querySelector("[data-filter-group]");
  const search = table.querySelector("[data-search]");
  const rows = [...table.querySelectorAll("[data-row]")];
  const empty = table.querySelector("[data-table-empty]");
  if (!rows.length) return;

  let activeFilter = "all";

  const apply = () => {
    const query = (search?.value ?? "").trim().toLowerCase();
    let visible = 0;

    for (const row of rows) {
      const matchesFilter = activeFilter === "all" || row.dataset.filterval === activeFilter;
      const matchesQuery = !query || (row.dataset.search ?? "").includes(query);
      const show = matchesFilter && matchesQuery;
      row.hidden = !show;
      if (show) visible++;
    }

    empty?.classList.toggle("is-visible", visible === 0);
  };

  if (group) {
    const buttons = [...group.querySelectorAll("[data-filter]")];
    for (const button of buttons) {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        for (const other of buttons) other.setAttribute("aria-pressed", String(other === button));
        apply();
      });
    }
  }

  search?.addEventListener("input", apply);
}

for (const table of document.querySelectorAll("[data-table]")) initTable(table);

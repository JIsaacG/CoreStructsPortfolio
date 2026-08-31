/**
 * The interface around the engine.
 *
 * Tabs, the register's filters and search, the two mini-demo dialogs, the
 * process chooser, the transient message, the simulated download and the reset
 * control. None of it supplies content — every one of these operates on markup
 * the build already wrote, which is why the page is complete before any of this
 * runs and merely becomes usable afterwards.
 */

/* ------------------------------------------------------------------ toast */

/** The one-line answer the interface gives an action. */
export function initToast() {
  const box = document.querySelector("[data-toast]");
  let timer = 0;

  return (message) => {
    if (!box) return;
    box.textContent = message;
    box.classList.add("is-visible");
    window.clearTimeout(timer);
    timer = window.setTimeout(() => box.classList.remove("is-visible"), 4200);
  };
}

/* ------------------------------------------------------------------- tabs */

/**
 * Tab panels, with the keyboard behaviour the pattern requires.
 *
 * Arrow keys move between tabs, Home and End jump to the ends, and only the
 * selected tab is in the tab order — so a keyboard user steps *into* the tab
 * strip once and then moves along it, instead of tabbing through five buttons
 * to reach the panel.
 */
export function initTabs(scope = document) {
  const strips = [...scope.querySelectorAll('[role="tablist"]')];
  const controllers = new Map();

  for (const strip of strips) {
    const tabs = [...strip.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

    const select = (index, { focus = true } = {}) => {
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (panels[i]) panels[i].hidden = !selected;
      });
      if (focus) tabs[index].focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(index, { focus: false }));
      tab.addEventListener("keydown", (event) => {
        const moves = {
          ArrowRight: index + 1,
          ArrowLeft: index - 1,
          Home: 0,
          End: tabs.length - 1,
        };
        if (!(event.key in moves)) return;
        event.preventDefault();
        select((moves[event.key] + tabs.length) % tabs.length);
      });
    });

    /* Named access, so the engine can bring the document tab forward the moment
       there is finally a document in it. */
    controllers.set(strip, (name) => {
      const index = tabs.findIndex((tab) => tab.id === `tab-${name}`);
      if (index > -1) select(index, { focus: false });
    });
  }

  const first = controllers.values().next().value;
  return (name) => first?.(name);
}

/* --------------------------------------------------------------- register */

/**
 * Filters and search over the register.
 *
 * Rows carry their own facets as data attributes, written by the build, so
 * filtering is a comparison rather than a re-render: nine columns of fifteen
 * requests stay exactly as they were painted, and nothing can drift.
 */
export function initRegister() {
  const panel = document.querySelector("[data-wf-filters]");
  if (!panel) return;

  const scope = panel.parentElement;
  const rows = [...scope.querySelectorAll("[data-wf-register] tbody tr")];
  const search = panel.querySelector("[data-wf-search]");
  const selects = [...panel.querySelectorAll("[data-wf-filter]")];
  const counter = panel.querySelector("[data-wf-count]");
  const empty = scope.querySelector("[data-wf-noresults]");
  const clear = panel.querySelector("[data-wf-clear]");

  const apply = () => {
    const query = (search?.value ?? "").trim().toLowerCase();
    let shown = 0;

    for (const row of rows) {
      const matchesText = !query || (row.dataset.text ?? "").includes(query);
      const matchesFacets = selects.every((select) => {
        const value = select.value;
        return value === "all" || row.dataset[select.dataset.wfFilter] === value;
      });

      const visible = matchesText && matchesFacets;
      row.hidden = !visible;
      if (visible) shown += 1;
    }

    if (counter) {
      counter.textContent = `${shown} ${shown === 1 ? "solicitud" : "solicitudes"}`;
    }
    if (empty) empty.hidden = shown !== 0;
  };

  search?.addEventListener("input", apply);
  for (const select of selects) select.addEventListener("change", apply);

  clear?.addEventListener("click", () => {
    if (search) search.value = "";
    for (const select of selects) select.value = "all";
    apply();
  });

  /* A code arriving in the address — from a link, or from someone pasting one —
     lands in the search box rather than nowhere. */
  const query = new URLSearchParams(location.search).get("q");
  if (query && search) {
    search.value = query;
    apply();
  }
}

/* --------------------------------------------------------------- dialogs */

/** The two mini demos. `<dialog>` supplies the focus trap and the Escape key. */
export function initDialogs() {
  const dialogs = new Map(
    [...document.querySelectorAll("[data-wf-modal]")].map((node) => [node.dataset.wfModal, node]),
  );

  const open = (name) => {
    const dialog = dialogs.get(name);
    if (!dialog) return false;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    return true;
  };

  for (const dialog of dialogs.values()) {
    for (const close of dialog.querySelectorAll("[data-wf-modal-close]")) {
      close.addEventListener("click", () => dialog.close());
    }
    /* Clicking the backdrop closes it: the click lands on the dialog element
       itself only when it is outside the padded box. */
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  for (const trigger of document.querySelectorAll("[data-wf-mini]")) {
    trigger.addEventListener("click", () => open(trigger.dataset.wfMini));
  }

  return open;
}

/* -------------------------------------------------------- process chooser */

/**
 * The six entry points.
 *
 * Only the purchase request has a form behind it. The other five say so rather
 * than pretending — two of them by opening their example, three by naming what
 * would be built. A tile that looks clickable and does nothing is worse than a
 * tile that explains itself.
 */
export function initChooser({ openDialog, toast }) {
  const tiles = [...document.querySelectorAll("[data-wf-process]")];

  for (const tile of tiles) {
    tile.addEventListener("click", () => {
      const id = tile.dataset.wfProcess;

      if (id === "vacaciones" || id === "viaticos") {
        openDialog(id);
        return;
      }

      for (const other of tiles) other.setAttribute("aria-pressed", String(other === tile));

      if (id === "compra") {
        document.querySelector("#solicitud")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      toast(
        `${tile.querySelector(".wf-process__title")?.textContent.trim()}: flujo demostrativo. ` +
          "El motor y la pantalla de seguimiento son los mismos; cambia la definición de pasos.",
      );
    });
  }
}

/* ----------------------------------------------------- document and reset */

/** The download that never writes a file, and says so. */
export function initDocumentActions(toast) {
  document.querySelector("[data-wf-download]")?.addEventListener("click", () => {
    toast("Descarga simulada. En una implementación real el documento se genera en el servidor.");
  });

  document.querySelector("[data-wf-print]")?.addEventListener("click", () => window.print());
}

/**
 * `Reiniciar demo`.
 *
 * Hidden in the markup and revealed here, because a control that restores
 * something only makes sense once there is a script capable of having changed
 * it. Clearing and reloading is deliberate over patching the DOM back: the
 * build already knows how to draw the initial state perfectly.
 */
export function initReset({ clear }) {
  const control = document.querySelector("[data-wf-reset]");
  if (!control) return;

  control.hidden = false;
  control.addEventListener("click", () => {
    clear();
    location.reload();
  });
}

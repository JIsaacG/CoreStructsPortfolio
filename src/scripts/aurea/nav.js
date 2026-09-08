/**
 * Header behaviour: mega panels, the phone menu and the search overlay.
 *
 * Everything here is disclosure. The links are in the HTML before this runs —
 * a reader without JavaScript gets the mega panels rendered open in the page
 * flow and the phone menu as a plain expanded list — so nothing below supplies
 * content. It supplies hiding, and the keyboard contract that goes with it.
 */

import { $, $$, trapFocus } from "./dom.js";

/* --------------------------------------------------------------- mega menu */

function initMega() {
  const toggles = $$("[data-mega-toggle]");
  if (!toggles.length) return;

  const panels = new Map(
    $$("[data-mega-panel]").map((panel) => [panel.dataset.megaPanel, panel]),
  );

  let open = null;
  let closeTimer;

  function close(key) {
    const panel = panels.get(key);
    if (!panel) return;
    panel.hidden = true;
    $(`[data-mega-toggle="${key}"]`)?.setAttribute("aria-expanded", "false");
    if (open === key) open = null;
  }

  function show(key) {
    clearTimeout(closeTimer);
    if (open && open !== key) close(open);
    const panel = panels.get(key);
    if (!panel) return;
    panel.hidden = false;
    $(`[data-mega-toggle="${key}"]`)?.setAttribute("aria-expanded", "true");
    open = key;
  }

  /* Hover opens, but with a delay on the way out: a panel that vanishes the
     instant the pointer leaves the button is unusable, because the pointer has
     to cross the gap between the button and the panel to reach it. */
  function scheduleClose(key) {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => close(key), 180);
  }

  for (const toggle of toggles) {
    const key = toggle.dataset.megaToggle;
    const item = toggle.closest("[data-mega-item]");
    const panel = panels.get(key);

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      if (open === key) close(key);
      else show(key);
    });

    /* Pointer only. A touch tap fires both a pointerenter and a click, which
       would open and immediately close the panel. */
    item?.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      show(key);
    });
    item?.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;
      scheduleClose(key);
    });
    panel?.addEventListener("pointerenter", () => clearTimeout(closeTimer));
    panel?.addEventListener("pointerleave", () => scheduleClose(key));
  }

  /* Escape closes and returns focus to the button that opened it — otherwise
     focus is left inside a panel that is no longer visible. */
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !open) return;
    const button = $(`[data-mega-toggle="${open}"]`);
    close(open);
    button?.focus();
  });

  /* A click anywhere outside closes, and so does a focus that leaves: tabbing
     past the last link of a panel should not leave it hanging open. */
  document.addEventListener("click", (event) => {
    if (!open) return;
    if (event.target.closest("[data-mega-panel], [data-mega-item]")) return;
    close(open);
  });

  document.addEventListener("focusin", (event) => {
    if (!open) return;
    if (event.target.closest("[data-mega-panel], [data-mega-item]")) return;
    close(open);
  });
}

/* -------------------------------------------------------------- phone menu */

function initPanel() {
  const panel = $("[data-panel]");
  const toggle = $("[data-panel-toggle]");
  if (!panel || !toggle) return;

  const bar = $("[data-bar]");
  const trap = trapFocus(panel);
  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    panel.dataset.open = "";
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.overlay = "panel";
    if (bar) bar.dataset.hidden = "";
    document.addEventListener("keydown", trap);
    $("[data-panel-close]", panel)?.focus();
  }

  function close() {
    delete panel.dataset.open;
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    delete document.documentElement.dataset.overlay;
    if (bar) delete bar.dataset.hidden;
    document.removeEventListener("keydown", trap);
    lastFocus?.focus();
  }

  toggle.addEventListener("click", () => (panel.dataset.open === undefined ? open() : close()));
  $("[data-panel-close]", panel)?.addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.dataset.open !== undefined) close();
  });

  /* Section disclosures inside the menu. */
  for (const disc of $$("[data-panel-disc]", panel)) {
    disc.addEventListener("click", () => {
      const target = document.getElementById(disc.getAttribute("aria-controls"));
      if (!target) return;
      const willOpen = target.hidden;
      target.hidden = !willOpen;
      disc.setAttribute("aria-expanded", String(willOpen));
    });
  }

  /* A resize past the breakpoint leaves the menu open over a desktop header
     with no way to close it, because the button that closes it is hidden. */
  const wide = window.matchMedia("(min-width: 64.0625rem)");
  wide.addEventListener("change", (event) => {
    if (event.matches && panel.dataset.open !== undefined) close();
  });
}

/* ---------------------------------------------------------- search overlay */

/**
 * Opening and closing only.
 *
 * The index and the matching live in `search.js`, which is imported the first
 * time the overlay opens: the index is the largest object the portal ships and
 * there is no reason for a visitor who never searches to download it.
 */
function initSearchOverlay() {
  const overlay = $("[data-search]");
  if (!overlay) return;

  const input = $("[data-search-input]", overlay);
  const bar = $("[data-bar]");
  const trap = trapFocus(overlay);
  let lastFocus = null;
  let loaded = false;

  async function open() {
    lastFocus = document.activeElement;
    overlay.dataset.open = "";
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.overlay = "search";
    if (bar) bar.dataset.hidden = "";
    document.addEventListener("keydown", trap);
    input?.focus();

    if (!loaded) {
      loaded = true;
      const module = await import("./search.js");
      module.initSearch(overlay);
    }
  }

  function close() {
    delete overlay.dataset.open;
    document.body.style.overflow = "";
    delete document.documentElement.dataset.overlay;
    if (bar) delete bar.dataset.hidden;
    document.removeEventListener("keydown", trap);
    for (const toggle of $$("[data-search-toggle]")) toggle.setAttribute("aria-expanded", "false");
    lastFocus?.focus();
  }

  for (const toggle of $$("[data-search-toggle]")) {
    toggle.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "true");
      open();
    });
  }

  $("[data-search-close]", overlay)?.addEventListener("click", close);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.dataset.open !== undefined) {
      close();
      return;
    }
    /* The shortcut every search box on the web now has. Ignored while the
       reader is typing somewhere else. */
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? "");
    if (event.key === "/" && !typing && overlay.dataset.open === undefined) {
      event.preventDefault();
      open();
    }
  });
}

export function initNav() {
  initMega();
  initPanel();
  initSearchOverlay();
}

/**
 * Header behaviour: the compact state, the mega menus and the mobile panel.
 *
 * Everything this module touches already works without it — the nav items are
 * links to real pages, the panels are `hidden`, the search form submits to the
 * results page — so this file adds disclosure behaviour rather than supplying
 * the navigation.
 */

const STUCK_AFTER_PX = 8;
/** Long enough that crossing one item on the way to another does not open it. */
const HOVER_OPEN_MS = 130;
const HOVER_CLOSE_MS = 240;

/**
 * Collapse the header to its navigation band once the page scrolls.
 *
 * A public portal's header carries three bands; keeping all three pinned would
 * cost a fifth of a phone screen on every page. The emblem and the search come
 * back the moment the reader returns to the top.
 */
function initStuck(header) {
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText = `position:absolute;top:${STUCK_AFTER_PX}px;left:0;width:1px;height:1px;pointer-events:none;`;
  document.body.prepend(sentinel);

  if (!("IntersectionObserver" in window)) return;

  new IntersectionObserver(
    ([entry]) => header.classList.toggle("is-stuck", !entry.isIntersecting),
    { threshold: 0 },
  ).observe(sentinel);
}

/**
 * The mega menus.
 *
 * One panel open at a time. The pointer opens on hover after a short delay, the
 * keyboard opens through the disclosure button, and both close on Escape, on
 * focus leaving the header, and on a click outside it.
 */
function initMega(header) {
  const toggles = [...header.querySelectorAll("[data-mega-toggle]")];
  if (!toggles.length) return;

  const panels = new Map(
    [...header.querySelectorAll("[data-mega-panel]")].map((panel) => [panel.dataset.megaPanel, panel]),
  );
  const items = new Map(
    [...header.querySelectorAll("[data-mega-item]")].map((item) => [item.dataset.megaItem, item]),
  );

  /* The panels ship `hidden` so a browser without this module never shows one
     it cannot close. Taking the attribute off is the module announcing that it
     now owns them. */
  for (const panel of panels.values()) {
    panel.hidden = false;
    panel.style.display = "none";
  }

  let open = null;
  let timer;

  const setOpen = (name) => {
    if (open === name) return;

    if (open) {
      const previous = panels.get(open);
      previous.classList.remove("is-open");
      previous.style.display = "none";
      items.get(open)?.removeAttribute("data-open");
      header.querySelector(`[data-mega-toggle="${open}"]`)?.setAttribute("aria-expanded", "false");
    }

    open = name;
    if (!name) return;

    const panel = panels.get(name);
    panel.style.display = "block";
    requestAnimationFrame(() => panel.classList.add("is-open"));
    items.get(name)?.setAttribute("data-open", "");
    header.querySelector(`[data-mega-toggle="${name}"]`)?.setAttribute("aria-expanded", "true");
  };

  const schedule = (name, delay) => {
    clearTimeout(timer);
    timer = setTimeout(() => setOpen(name), delay);
  };

  for (const toggle of toggles) {
    const name = toggle.dataset.megaToggle;

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      clearTimeout(timer);
      setOpen(open === name ? null : name);
    });

    items.get(name)?.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      schedule(name, HOVER_OPEN_MS);
    });

    panels.get(name)?.addEventListener("pointerenter", () => clearTimeout(timer));
  }

  header.addEventListener("pointerleave", () => schedule(null, HOVER_CLOSE_MS));

  header.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !open) return;
    const toggle = header.querySelector(`[data-mega-toggle="${open}"]`);
    setOpen(null);
    toggle?.focus();
  });

  header.addEventListener("focusout", (event) => {
    if (!header.contains(event.relatedTarget)) setOpen(null);
  });

  document.addEventListener("click", (event) => {
    if (open && !header.contains(event.target)) setOpen(null);
  });
}

/** The full-height menu for narrow viewports. */
function initPanel(header) {
  const toggle = header.querySelector("[data-panel-toggle]");
  const panel = document.querySelector("[data-panel]");
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    document.body.classList.toggle("cd-locked", open);
    if (open) panel.querySelector("a, button")?.focus();
  };

  const close = ({ restoreFocus = false } = {}) => {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    setOpen(false);
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  panel.querySelector("[data-panel-close]")?.addEventListener("click", () => close({ restoreFocus: true }));

  panel.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close({ restoreFocus: true });
  });

  /* Leaving the narrow breakpoint with the menu open would strand the body lock
     on a layout that no longer shows the panel. */
  window.matchMedia("(min-width: 64rem)").addEventListener("change", (event) => {
    if (event.matches) close();
  });
}

export function initNav() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  initStuck(header);
  initMega(header);
  initPanel(header);
}

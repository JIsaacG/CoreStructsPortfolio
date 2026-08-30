/**
 * Header behaviour: the frosted state once the page moves, the mobile menu,
 * and marking which section is currently in view.
 */

const STUCK_AFTER_PX = 12;

/** Frost the header as soon as content passes underneath it. */
function initStuckState(header) {
  // A zero-height sentinel at the top of the document is cheaper than reading
  // scroll position on every scroll event.
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText = `position:absolute;top:${STUCK_AFTER_PX}px;left:0;width:1px;height:1px;pointer-events:none;`;
  document.body.prepend(sentinel);

  const observer = new IntersectionObserver(
    ([entry]) => header.classList.toggle("is-stuck", !entry.isIntersecting),
    { threshold: 0 },
  );
  observer.observe(sentinel);
}

/** Full-screen menu for narrow viewports. */
function initMobileMenu(toggle, panel) {
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    document.body.classList.toggle("has-open-menu", open);
    if (open) panel.querySelector("a")?.focus();
  };

  const close = ({ restoreFocus = false } = {}) => {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    setOpen(false);
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Any navigation closes the menu; the browser then handles the anchor jump.
  panel.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close({ restoreFocus: true });
  });

  // Leaving the mobile breakpoint with the menu open would strand the body lock.
  const wide = window.matchMedia("(min-width: 60rem)");
  wide.addEventListener("change", (event) => {
    if (event.matches) close();
  });
}

/** Reflect the section in view on the matching nav link. */
function initSectionSpy(links) {
  const sections = [...links]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!sections.length) return;

  const visible = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      // With several sections on screen, the topmost one wins.
      const current = sections.find((section) => visible.has(section.id))?.id;
      for (const link of links) {
        const isCurrent = Boolean(current) && link.getAttribute("href") === `#${current}`;
        if (isCurrent) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      }
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
  );

  for (const section of sections) observer.observe(section);
}

export function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  initStuckState(header);
  initMobileMenu(
    header.querySelector("[data-menu-toggle]"),
    document.querySelector("[data-mobile-nav]"),
  );
  initSectionSpy(document.querySelectorAll("[data-nav-link]"));
}

/**
 * The small behaviours: tabs, accordions, counters, the assistant, disclosures.
 *
 * Each initialiser looks for its own markup and returns immediately when the
 * page does not have it, which is why the whole portal ships one module
 * instead of one bundle per template.
 *
 * Everything here is progressive. The tab panels are all in the HTML and only
 * hidden once a script confirms it can show them again; the accordions are
 * `<button>` elements over content that is visible without them; the counters
 * animate to a value that is already printed.
 */

import { $, $$, store } from "./dom.js";

/* --------------------------------------------------------------------- tabs */

/**
 * One tablist implementation, three uses: the audience switch, the admissions
 * tracks and the portal sections.
 *
 * Full ARIA keyboard contract — arrows move, Home and End jump, and the panel
 * follows selection. The container declares whether the choice is remembered:
 * the audience switch is (a parent should not have to pick “Padre de familia”
 * on every visit), the admissions tracks are not.
 */
function initTabs() {
  for (const list of $$('[role="tablist"]')) {
    const tabs = $$('[role="tab"]', list);
    if (!tabs.length) continue;

    const memory = list.dataset.remember;

    function select(tab, focus = true) {
      for (const other of tabs) {
        const on = other === tab;
        other.setAttribute("aria-selected", String(on));
        other.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(other.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      }
      if (focus) tab.focus();
      if (memory) store.set(memory, tab.id);
    }

    for (const [index, tab] of tabs.entries()) {
      tab.addEventListener("click", () => select(tab, false));

      tab.addEventListener("keydown", (event) => {
        const horizontal = list.getAttribute("aria-orientation") !== "vertical";
        const next = horizontal ? "ArrowRight" : "ArrowDown";
        const prev = horizontal ? "ArrowLeft" : "ArrowUp";

        if (event.key === next) {
          event.preventDefault();
          select(tabs[(index + 1) % tabs.length]);
        } else if (event.key === prev) {
          event.preventDefault();
          select(tabs[(index - 1 + tabs.length) % tabs.length]);
        } else if (event.key === "Home") {
          event.preventDefault();
          select(tabs[0]);
        } else if (event.key === "End") {
          event.preventDefault();
          select(tabs[tabs.length - 1]);
        }
      });
    }

    const remembered = memory ? store.get(memory) : null;
    const initial =
      tabs.find((tab) => tab.id === remembered) ??
      tabs.find((tab) => tab.getAttribute("aria-selected") === "true") ??
      tabs[0];

    select(initial, false);
  }
}

/* ---------------------------------------------------------------- accordion */

function initAccordions() {
  for (const button of $$("[data-acc-btn]")) {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) continue;

    /* Collapse only now: without a script the panels stay open, which is the
       correct fallback for a page of requirements and answers. */
    if (button.getAttribute("aria-expanded") !== "true") panel.hidden = true;

    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  }
}

/** Generic show/hide: the faculty detail, the requirement lists, the notices. */
function initDisclosures() {
  for (const button of $$("[data-toggle]")) {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) continue;

    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
      if (button.dataset.toggleLabel && !open) button.textContent = button.dataset.toggleLabel;
      else if (button.dataset.toggleLabelClosed && open) {
        button.textContent = button.dataset.toggleLabelClosed;
      }
    });
  }
}

/* ----------------------------------------------------------------- counters */

/**
 * The figures count up on entry.
 *
 * Three guards, and all three matter. The final value is in the HTML from the
 * start, so a reader who never triggers the observer sees the number rather
 * than a zero. `prefers-reduced-motion` skips the animation entirely — this is
 * decoration, not content, so there is nothing here to exempt. And the element
 * is only ever counted once.
 */
function initCounters() {
  const targets = $$("[data-count]");
  if (!targets.length) return;

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const element = entry.target;
        observer.unobserve(element);

        const final = Number(element.dataset.count);
        if (!Number.isFinite(final)) continue;

        const suffix = element.dataset.countSuffix ?? "";
        const duration = 1100;
        const start = performance.now();

        function frame(now) {
          const progress = Math.min((now - start) / duration, 1);
          /* Ease-out cubic: fast at the beginning, settles at the end, which
             is how a number that is being *revealed* should behave. */
          const eased = 1 - (1 - progress) ** 3;
          const value = Math.round(final * eased);
          element.textContent = value.toLocaleString("es-HN") + suffix;
          if (progress < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
      }
    },
    { threshold: 0.4 },
  );

  for (const target of targets) observer.observe(target);
}

/* ---------------------------------------------------------------- assistant */

/**
 * Six questions, six written answers.
 *
 * Not a chatbot and never presented as one. The answer panel is a live region
 * so a screen reader hears the new answer without the focus moving.
 */
function initAssistant() {
  const root = $("[data-assistant]");
  if (!root) return;

  const answer = $("[data-assistant-answer]", root);
  const text = $("[data-assistant-text]", root);
  const link = $("[data-assistant-link]", root);
  if (!answer || !text) return;

  for (const button of $$("[data-assistant-q]", root)) {
    button.addEventListener("click", () => {
      for (const other of $$("[data-assistant-q]", root)) {
        other.setAttribute("aria-pressed", String(other === button));
      }

      text.textContent = button.dataset.answer ?? "";

      if (link) {
        link.href = button.dataset.href ?? "#";
        link.hidden = !button.dataset.href;
      }
    });
  }
}

/* --------------------------------------------------------------- the year */

function initYear() {
  const year = String(new Date().getFullYear());
  for (const slot of $$("[data-current-year]")) slot.textContent = year;
}

export function initUI() {
  initTabs();
  initAccordions();
  initDisclosures();
  initCounters();
  initAssistant();
  initYear();
}

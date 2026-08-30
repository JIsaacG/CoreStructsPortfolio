/**
 * The behaviour that belongs to individual zones of the portal.
 *
 * Counters, the industry tabs, the methodology rail, the world map and the
 * client wall. Each one is independent, each one is a no-op when its markup is
 * not on the page, and each one leaves the page correct if it never runs.
 */

/* ---------------------------------------------------------------- counters */

/**
 * Count a figure up when it first arrives on screen.
 *
 * Only the digits move: the `+`, the `%` and the thousands separator are
 * separate elements or come back from the formatter, so a value never renders
 * as a bare number mid-count. Duration is fixed rather than proportional to the
 * value, so four figures side by side finish together.
 */
const COUNT_MS = 1100;

function runCount(element) {
  const target = Number(element.dataset.count);
  const output = element.querySelector("[data-count-value]");
  if (!output || !Number.isFinite(target)) return;

  const start = performance.now();
  const format = new Intl.NumberFormat("es-HN");

  const step = (now) => {
    const t = Math.min(1, (now - start) / COUNT_MS);
    /* Ease-out quart: fast enough to read as decisive, slow enough at the end
       that the final value settles rather than snaps. */
    const eased = 1 - Math.pow(1 - t, 4);
    output.textContent = format.format(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(step);
  };

  output.textContent = "0";
  requestAnimationFrame(step);
}

export function initCounters() {
  const figures = [...document.querySelectorAll("[data-count]")];
  if (!figures.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        runCount(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.4 },
  );

  for (const figure of figures) observer.observe(figure);
}

/* -------------------------------------------------------------------- tabs */

/**
 * The industry selector.
 *
 * A standard tablist: one tab in the tab order, arrow keys between them, Home
 * and End to the ends. Panels are already in the document, so this only decides
 * which one is shown.
 */
export function initTabs() {
  for (const root of document.querySelectorAll("[data-tabs]")) {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    if (!tabs.length) return;

    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

    const select = (index, { focus = false } = {}) => {
      tabs.forEach((tab, i) => {
        const current = i === index;
        tab.setAttribute("aria-selected", String(current));
        tab.tabIndex = current ? 0 : -1;
        if (panels[i]) panels[i].hidden = !current;
      });
      if (focus) tabs[index].focus();
      /* Restart the panel's entrance so switching tabs reads as a change and
         not as a swap of text under a static frame. */
      const panel = panels[index];
      if (panel) {
        panel.style.animation = "none";
        void panel.offsetWidth;
        panel.style.animation = "";
      }
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(index));
      tab.addEventListener("keydown", (event) => {
        const moves = {
          ArrowRight: index + 1,
          ArrowDown: index + 1,
          ArrowLeft: index - 1,
          ArrowUp: index - 1,
          Home: 0,
          End: tabs.length - 1,
        };
        const next = moves[event.key];
        if (next === undefined) return;
        event.preventDefault();
        select((next + tabs.length) % tabs.length, { focus: true });
      });
    });
  }
}

/* ----------------------------------------------------------------- process */

/**
 * The methodology rail.
 *
 * `--process` is written in the range 0..1 as the section crosses the middle of
 * the viewport, and drives a scaled pseudo-element plus the state of each
 * marker. It is set directly rather than transitioned, so it tracks the scroll
 * exactly and needs no animation frame budget of its own.
 */
export function initProcess() {
  const root = document.querySelector("[data-process]");
  if (!root) return;

  const steps = [...root.querySelectorAll("[data-step]")];
  let ticking = false;

  const update = () => {
    ticking = false;
    const box = root.getBoundingClientRect();
    const height = window.innerHeight;

    /* Zero when the block's top reaches 80% of the viewport, one when its
       bottom passes 40%: the rail fills across the reading of the section. */
    const from = height * 0.8;
    const to = height * 0.4;
    const progress = (from - box.top) / (box.height + from - to);
    const clamped = Math.max(0, Math.min(1, progress));

    root.style.setProperty("--process", clamped.toFixed(3));
    steps.forEach((step, index) => {
      step.classList.toggle("is-reached", clamped >= index / steps.length);
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

/* ------------------------------------------------------------------- atlas */

/**
 * The world map.
 *
 * One `data-office` value ties a marker to its card, so hovering either one
 * raises both. The cards are real buttons and carry the keyboard path; the
 * markers are `aria-hidden` decoration, which is why the section does not
 * depend on SVG focus behaviour.
 */
export function initAtlas() {
  const root = document.querySelector("[data-atlas]");
  if (!root) return;

  const nodes = [...root.querySelectorAll("[data-office]")];
  if (!nodes.length) return;

  const setActive = (id) => {
    for (const node of nodes) node.classList.toggle("is-active", Boolean(id) && node.dataset.office === id);
  };

  for (const node of nodes) {
    const id = node.dataset.office;
    node.addEventListener("pointerenter", () => setActive(id));
    node.addEventListener("focus", () => setActive(id));
    node.addEventListener("click", () => setActive(id));
  }

  root.addEventListener("pointerleave", () => setActive(null));
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget)) setActive(null);
  });
}

/* ----------------------------------------------------------------- marquee */

/**
 * The client wall's drift.
 *
 * Driven from here rather than from a CSS animation for two reasons: it can be
 * halted while off screen and while hovered, and it can be re-measured after a
 * resize without the jump a restarted keyframe would produce. One copy of the
 * wall is scrolled and wrapped at its own width, so the loop has no seam.
 *
 * Speed is 22 pixels per second — slow enough that it reads as a slow pan
 * rather than as a ticker demanding attention.
 */
const SPEED = 22;

export function initMarquee() {
  const root = document.querySelector("[data-marquee]");
  const track = root?.querySelector("[data-marquee-track]");
  const run = root?.querySelector("[data-marquee-run]");
  if (!root || !track || !run) return;

  let offset = 0;
  let width = run.getBoundingClientRect().width;
  let last = 0;
  let running = false;
  let paused = false;
  let frame = 0;

  const tick = (now) => {
    if (!running) return;
    const delta = last ? Math.min(64, now - last) : 0;
    last = now;

    if (!paused && width > 0) {
      offset -= (SPEED * delta) / 1000;
      if (offset <= -width) offset += width;
      track.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
    }
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;
    running = true;
    last = 0;
    frame = requestAnimationFrame(tick);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };

  root.addEventListener("pointerenter", () => {
    paused = true;
  });
  root.addEventListener("pointerleave", () => {
    paused = false;
  });

  window.addEventListener("resize", () => {
    width = run.getBoundingClientRect().width;
  });

  /* Nothing animates while the wall is off screen. */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    ).observe(root);
  } else {
    start();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (root.getBoundingClientRect().top < window.innerHeight) start();
  });
}

/* ------------------------------------------------------------------ plates */

/**
 * Plate reveals and their parallax.
 *
 * The reveal is a clip from the bottom edge, which the shared reveal system
 * does not handle — it works in transform and opacity — so plates get their own
 * observer. The parallax writes `--plate-shift` in the range -1..1 and nothing
 * else; the transform itself lives in CSS and stays on the compositor.
 */
export function initPlates() {
  const plates = [...document.querySelectorAll("[data-plate]")];
  if (!plates.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );

    for (const element of plates) {
      const box = element.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.9 && box.bottom > 0) {
        element.classList.add("is-revealed");
        continue;
      }
      observer.observe(element);
    }
  } else {
    for (const element of plates) element.classList.add("is-revealed");
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const height = window.innerHeight;
    for (const element of plates) {
      const box = element.getBoundingClientRect();
      if (box.bottom < -200 || box.top > height + 200) continue;
      const centre = box.top + box.height / 2;
      const shift = (centre - height / 2) / (height / 2);
      element.style.setProperty("--plate-shift", Math.max(-1, Math.min(1, shift)).toFixed(3));
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

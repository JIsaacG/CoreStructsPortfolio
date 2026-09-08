/**
 * Reveals elements as they enter the viewport.
 *
 * One IntersectionObserver for the whole page; each element is unobserved the
 * moment it appears, so nothing keeps running once the user has scrolled past.
 */

const REVEAL_SELECTOR = "[data-reveal], .reveal-lines, .reveal-words";
const STAGGER_MS = 90;
const MAX_STAGGER_STEPS = 6;
/* How far above the fold an element has to be before it counts as arrived. It
   is one constant because two places need it — the observer's root margin and
   the immediate-reveal check below — and they must agree. */
const VIEWPORT_INSET = 0.12;

/**
 * Cascade a group's children instead of revealing them all at once.
 *
 * Two cases: a `data-reveal-group` container staggers its revealing
 * descendants, and a line/word reveal staggers its own parts.
 */
function applyStagger(root) {
  const stagger = (elements, step, maxSteps) => {
    elements.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index, maxSteps) * step}ms`);
    });
  };

  // Cards cap out quickly so a long grid never leaves the last one waiting.
  for (const group of root.querySelectorAll("[data-reveal-group]")) {
    stagger(
      group.querySelectorAll(REVEAL_SELECTOR),
      Number(group.dataset.revealGroup) || STAGGER_MS,
      MAX_STAGGER_STEPS,
    );
  }

  // Lines and words are meant to read in sequence, so they are not capped.
  for (const text of root.querySelectorAll(".reveal-lines, .reveal-words")) {
    const isWords = text.classList.contains("reveal-words");
    stagger(
      text.querySelectorAll(":scope > .reveal-lines__line, :scope > span"),
      Number(text.dataset.stagger) || (isWords ? 55 : 110),
      Infinity,
    );
  }
}

export function initScrollReveal(root = document) {
  // Tells the failsafe in index.html that hiding is now owned by this module.
  document.documentElement.dataset.revealsReady = "1";

  const targets = root.querySelectorAll(REVEAL_SELECTOR);
  if (!targets.length) return;

  applyStagger(root);

  // Without IntersectionObserver, show everything rather than hide it.
  if (!("IntersectionObserver" in window)) {
    targets.forEach((element) => element.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    },
    {
      // Fire a little before the element is fully on screen so the motion
      // finishes about when the element reaches a comfortable reading position.
      rootMargin: `0px 0px -${VIEWPORT_INSET * 100}% 0px`,
      threshold: 0.12,
    },
  );

  // Anything already inside the observer's root at load is shown immediately —
  // no entrance animation should gate content the user can already see. The
  // bound is the SAME one the observer uses, deliberately: a narrower one leaves
  // a band just above the fold where an element is on screen, is not revealed
  // here, and has to wait for the observer's first delivery to appear.
  const inset = window.innerHeight * (1 - VIEWPORT_INSET);

  for (const element of targets) {
    const box = element.getBoundingClientRect();
    if (box.top < inset && box.bottom > 0) {
      element.classList.add("is-revealed");
      continue;
    }
    observer.observe(element);
  }

  return () => observer.disconnect();
}

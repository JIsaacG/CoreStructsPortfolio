/**
 * The four helpers every other module in this folder uses.
 *
 * Deliberately not a framework. The portal is server-rendered HTML; these
 * modules attach behaviour to markup that already exists and already works, so
 * what they need is a shorter querySelector, a debounce, a toast and the money
 * formatter — not a rendering layer.
 */

export const $ = (selector, scope = document) => scope.querySelector(selector);
export const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

/**
 * Accent-insensitive folding, identical to `data/aurea/format.js`.
 *
 * It exists twice because the build writes the `data-haystack` attributes with
 * the Node copy and the browser matches against them with this one. The two
 * MUST agree character for character: a mismatch means a visitor types
 * “psicologia” and the row that the build folded to “psicologia” fails to
 * match. Any change here is a change there.
 */
export const fold = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Money, the same way the build writes it: `L 42,500`. */
export function lempiras(value) {
  const digits = Math.abs(Math.round(value)).toString();
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += ",";
    out += digits[i];
  }
  return `L ${value < 0 ? "−" : ""}${out}`;
}

/**
 * The status line.
 *
 * Every simulated action on this portal — a booking, a download, an export, a
 * form — reports through this one live region rather than through an alert or
 * a fake page transition, so a screen reader hears the outcome and a sighted
 * reader is never navigated somewhere they did not ask to go.
 */
let toastTimer;
export function toast(message) {
  const box = $("[data-toast]");
  if (!box) return;

  box.textContent = message;
  box.dataset.on = "";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => delete box.dataset.on, 4200);
}

/** Trailing debounce, for the search inputs. */
export function debounce(fn, wait = 120) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/**
 * Read/write a small preference.
 *
 * Wrapped because storage throws rather than returning null in a private
 * window with cookies blocked, and a thrown exception in a preference read
 * would take down whichever module called it.
 */
export const store = {
  get(key) {
    try {
      return localStorage.getItem(`aurea:${key}`);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`aurea:${key}`, value);
    } catch {
      /* Private mode, or storage disabled. The session still works. */
    }
  },
};

/** Trap Tab inside an open overlay, and hand focus back when it closes. */
export function trapFocus(container) {
  const selector =
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

  return (event) => {
    if (event.key !== "Tab") return;
    const items = $$(selector, container).filter((el) => el.offsetParent !== null);
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
}

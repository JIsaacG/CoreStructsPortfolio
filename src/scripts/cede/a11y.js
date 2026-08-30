/**
 * The reader's own controls: text size and high contrast.
 *
 * Both are real settings, not decoration. They are stored per browser and
 * re-applied before first paint by the inline script in the document head, so a
 * reader who has chosen high contrast never sees a flash of the default palette
 * on the next page.
 *
 * The size control multiplies the root font size rather than overriding it, so
 * a reader who has already enlarged text in their browser keeps that setting
 * and this one compounds with it — overriding the browser's own preference is
 * the classic way a "text size" widget makes a site less accessible.
 */

const STEPS = [0.875, 1, 1.125, 1.25, 1.4];
const DEFAULT_STEP = 1;

const read = (key, fallback) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* Private mode: the preference simply does not persist. */
  }
};

function announce(message) {
  let region = document.querySelector("[data-a11y-status]");
  if (!region) {
    region = document.createElement("p");
    region.className = "cd-sr";
    region.setAttribute("data-a11y-status", "");
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
    document.body.append(region);
  }
  region.textContent = message;
}

export function initAccessibility() {
  const root = document.documentElement;

  /* ------------------------------------------------------------- text size */

  let index = STEPS.indexOf(Number(read("cede:scale", String(STEPS[DEFAULT_STEP]))));
  if (index < 0) index = DEFAULT_STEP;

  const applyScale = (next, { silent = false } = {}) => {
    index = Math.max(0, Math.min(STEPS.length - 1, next));
    const scale = STEPS[index];
    root.style.setProperty("--font-scale", String(scale));
    write("cede:scale", index === DEFAULT_STEP ? null : String(scale));

    for (const button of document.querySelectorAll("[data-scale]")) {
      const action = button.dataset.scale;
      const limit =
        (action === "up" && index === STEPS.length - 1) || (action === "down" && index === 0);
      button.disabled = limit;
      button.setAttribute("aria-disabled", String(limit));
    }

    if (!silent) announce(`Tamaño del texto: ${Math.round(scale * 100)} %`);
  };

  for (const button of document.querySelectorAll("[data-scale]")) {
    button.addEventListener("click", () => {
      const action = button.dataset.scale;
      applyScale(action === "up" ? index + 1 : action === "down" ? index - 1 : DEFAULT_STEP);
    });
  }

  applyScale(index, { silent: true });

  /* --------------------------------------------------------- high contrast */

  const contrastButtons = [...document.querySelectorAll("[data-contrast]")];
  const applyContrast = (on, { silent = false } = {}) => {
    if (on) root.dataset.contrast = "high";
    else delete root.dataset.contrast;
    write("cede:contrast", on ? "high" : null);
    for (const button of contrastButtons) button.setAttribute("aria-pressed", String(on));
    if (!silent) announce(on ? "Alto contraste activado" : "Alto contraste desactivado");
  };

  applyContrast(read("cede:contrast", "") === "high", { silent: true });

  for (const button of contrastButtons) {
    button.addEventListener("click", () => applyContrast(root.dataset.contrast !== "high"));
  }
}

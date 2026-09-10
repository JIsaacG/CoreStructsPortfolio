/**
 * The boot intro: a rain of brand-blue cubes falls into the isotype's shape,
 * bounces into place and locks it, then dissolves to hand the page over
 * already composed underneath.
 *
 * Replaces the mark's old per-face build-in — each `.cs-face` sliding into
 * place on load, in `hero.css` — with a single full-page moment instead of a
 * small one inside the hero. `hero.css` now paints the mark at rest from the
 * first frame; the assembly lives here.
 *
 * The isotype is never redrawn from scratch: it is read straight out of the
 * sprite sheet already sitting in the page (`#cs-isotipo`, filled in by
 * `build-content.mjs` from `assets/brand/isotipo.svg`), so this can never
 * drift from the real artwork.
 *
 * Runs once per session by default — a returning visitor within the same tab
 * has already seen it — and is skipped entirely for reduced motion, where the
 * mark simply appears and the overlay lifts a moment later.
 */

const COPY = {
  es: { label: "CoreStruct", skip: "Saltar intro" },
  en: { label: "CoreStruct", skip: "Skip intro" },
};

const STORAGE_KEY = "cs-intro-seen";

/** Mirrors `--duration-slow` in `tokens.css`: how long the overlay takes to fade out. */
const EXIT_MS = 620;

/** Height of the mark against the viewport, clamped so it never crowds a short one. */
const LOGO_VH = 0.36;
const LOGO_MIN = 150;
const LOGO_MAX = 340;

/** Sampling grid step, in source px: lower is denser, and slower to draw. */
const STEP = 5;

/** Alpha a sampled pixel must clear (0-255) to become a falling cube. */
const ALPHA_THRESHOLD = 140;

/** Seconds a single cube takes to fall and land, and how late it can start. */
const FALL_MIN = 0.86;
const FALL_MAX = 1.12;
const DELAY_MIN = 0.05;
const DELAY_MAX = 0.75;

/** How far off its landing column a cube can start, in px. */
const DRIFT = 26;

const random = (min, max) => min + Math.random() * (max - min);
const clampChannel = (value) => Math.max(0, Math.min(255, value | 0));

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

/** Standard `easeOutBounce`: overshoots and settles, like something dropped. */
function easeOutBounce(t) {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
}

/** Rebuild the isotype as a standalone image source from the sprite already on the page. */
function readLogo() {
  const symbol = document.getElementById("cs-isotipo");
  const defs = document.querySelector(".sprite defs");
  if (!symbol || !defs) return null;

  const viewBox = symbol.getAttribute("viewBox") || "0 0 362 422";
  const [, , w, h] = viewBox.split(" ").map(Number);
  const markup =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">` +
    `<defs>${defs.innerHTML}</defs>${symbol.innerHTML}</svg>`;

  return {
    ratio: w / h,
    url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`,
  };
}

export function initIntro({ once = true } = {}) {
  if (once) {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Storage blocked (private mode, some embeds): play the intro anyway.
    }
  }

  const logo = readLogo();
  if (!logo) return;

  const lang = document.documentElement.lang?.slice(0, 2) === "en" ? "en" : "es";
  const t = COPY[lang];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const root = document.createElement("div");
  root.className = "intro";
  root.setAttribute("role", "img");
  root.setAttribute("aria-label", t.label);
  root.innerHTML =
    `<div class="intro__stage">` +
    `<canvas class="intro__canvas"></canvas>` +
    `<img class="intro__logo" alt="" src="${logo.url}">` +
    `<div class="intro__wordmark">${t.label}</div>` +
    `</div>` +
    `<button type="button" class="button button--ghost button--compact intro__skip">${t.skip}</button>`;
  document.body.append(root);
  document.body.classList.add("has-intro");

  const canvas = root.querySelector(".intro__canvas");
  const ctx = canvas.getContext("2d");
  const img = root.querySelector(".intro__logo");
  const wordmark = root.querySelector(".intro__wordmark");
  const skipBtn = root.querySelector(".intro__skip");

  let width = 0;
  let height = 0;
  let cx = 0;
  let cy = 0;
  let logoH = 0;
  let cubes = null;
  let total = 0;
  let size = 0;
  let raf = 0;
  let finished = false;

  const layout = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    logoH = Math.max(LOGO_MIN, Math.min(height * LOGO_VH, LOGO_MAX));
    cx = width / 2;
    cy = height / 2 - height * 0.045;

    img.style.height = `${logoH}px`;
    img.style.width = `${logoH * logo.ratio}px`;
    img.style.top = `${cy}px`;
    wordmark.style.top = `${cy + logoH / 2 + Math.max(26, height * 0.05)}px`;
  };

  /** Rasterise the mark at its on-screen size and turn its opaque pixels into falling cubes. */
  const sample = (image) => {
    const h = Math.round(logoH);
    const w = Math.round(h * logo.ratio);
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const offCtx = off.getContext("2d");
    offCtx.drawImage(image, 0, 0, w, h);
    const data = offCtx.getImageData(0, 0, w, h).data;

    const list = [];
    for (let y = 0; y < h; y += STEP) {
      for (let x = 0; x < w; x += STEP) {
        const i = (y * w + x) * 4;
        if (data[i + 3] <= ALPHA_THRESHOLD) continue;
        const tx = cx - w / 2 + x;
        const ty = cy - h / 2 + y;
        list.push({
          tx,
          ty,
          r: data[i],
          g: data[i + 1],
          b: data[i + 2],
          sx: tx + random(-DRIFT / 2, DRIFT / 2),
          sy: -60 - Math.random() * height * 0.9,
          delay: random(DELAY_MIN, DELAY_MAX),
          duration: random(FALL_MIN, FALL_MAX),
        });
      }
    }

    cubes = list;
    total = 0;
    for (const cube of list) total = Math.max(total, cube.delay + cube.duration);
    size = Math.max(2.4, STEP * 0.62);
  };

  /** One faceted cube: a lit top face, a shaded left face, a bright right face. */
  const draw = (elapsed) => {
    ctx.clearRect(0, 0, width, height);

    for (const cube of cubes) {
      const t = (elapsed - cube.delay) / cube.duration;
      if (t < 0) continue;
      const clamped = Math.min(1, t);

      const x = cube.sx + (cube.tx - cube.sx) * easeOutCubic(Math.min(1, clamped * 1.6));
      const y = cube.sy + (cube.ty - cube.sy) * easeOutBounce(clamped);
      const s =
        clamped > 0.55 ? size * (1 + Math.sin((clamped - 0.55) * 9) * 0.13 * (1 - clamped)) : size;
      const half = s * 0.55;

      ctx.globalAlpha = Math.min(1, clamped * 6);

      ctx.fillStyle = `rgb(${clampChannel(cube.r * 1.5)} ${clampChannel(cube.g * 1.5)} ${clampChannel(cube.b * 1.5)})`;
      ctx.beginPath();
      ctx.moveTo(x, y - s - half);
      ctx.lineTo(x + s, y - s);
      ctx.lineTo(x, y - s + half);
      ctx.lineTo(x - s, y - s);
      ctx.fill();

      ctx.fillStyle = `rgb(${clampChannel(cube.r * 0.62)} ${clampChannel(cube.g * 0.62)} ${clampChannel(cube.b * 0.62)})`;
      ctx.beginPath();
      ctx.moveTo(x - s, y - s);
      ctx.lineTo(x, y - s + half);
      ctx.lineTo(x, y + half * 0.6);
      ctx.lineTo(x - s, y);
      ctx.fill();

      ctx.fillStyle = `rgb(${cube.r} ${cube.g} ${cube.b})`;
      ctx.beginPath();
      ctx.moveTo(x + s, y - s);
      ctx.lineTo(x, y - s + half);
      ctx.lineTo(x, y + half * 0.6);
      ctx.lineTo(x + s, y);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    // A brief flash as the last cube lands, echoing the hero mark's own glow.
    const flash = (elapsed - (total - 0.22)) / 0.5;
    if (flash > 0 && flash < 1) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = (1 - flash) * 0.32;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, logoH * 1.15);
      glow.addColorStop(0, "rgb(159 233 255)");
      glow.addColorStop(1, "rgb(159 233 255 / 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  };

  const run = () => {
    const startedAt = performance.now();
    skipBtn.classList.add("is-visible");

    const frame = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      draw(elapsed);
      if (elapsed < total + 0.05) raf = requestAnimationFrame(frame);
      else reveal();
    };
    raf = requestAnimationFrame(frame);

    setTimeout(() => wordmark.classList.add("is-visible"), Math.max(0, (total - 0.25) * 1000));
  };

  // Cubes give way to the crisp vector logo, which then dissolves into the page.
  const reveal = () => {
    img.style.opacity = "1";
    canvas.style.opacity = "0";
    setTimeout(finish, 760);
  };

  const onKey = (event) => {
    if (event.key === "Escape" || event.key === "Enter" || event.key === " ") finish(true);
  };
  const onResize = () => layout();

  function finish(skipped) {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", onResize);
    try {
      if (once) sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Nothing to persist; the intro simply plays again next time.
    }

    if (skipped) {
      img.style.opacity = "1";
      canvas.style.opacity = "0";
    }

    root.classList.add("is-leaving");
    setTimeout(() => {
      root.remove();
      document.body.classList.remove("has-intro");
      document.dispatchEvent(new CustomEvent("corestruct:intro-done"));
    }, EXIT_MS);
  }

  skipBtn.addEventListener("click", () => finish(true));
  document.addEventListener("keydown", onKey);
  window.addEventListener("resize", onResize, { passive: true });

  layout();

  if (reducedMotion.matches) {
    img.style.opacity = "1";
    wordmark.classList.add("is-visible");
    setTimeout(() => finish(), 900);
    return;
  }

  const preload = new Image();
  preload.onload = () => {
    sample(preload);
    run();
  };
  preload.onerror = () => finish(true);
  preload.src = logo.url;
}

#!/usr/bin/env node
/**
 * Graba las demos del sitio en vertical, fotograma por fotograma.
 *
 *   npm run record                    # todas las demos
 *   npm run record -- aurea           # una demo
 *   npm run record -- aurea:hero,soy  # tomas concretas
 *   npm run record -- --list          # ver demos y tomas
 *
 * Salida: raw/clips/<demo>/<toma>.mp4 (780x1688, 30 fps, H.264) y
 * raw/clips/index.json. La carpeta raw/ no se sube al repo.
 *
 * Por qué fotograma por fotograma y no `recordVideo`: el video de Playwright
 * comprime mucho el texto y su ritmo depende de la máquina. Aquí cada
 * fotograma es una captura nítida a escala 2, y el tiempo de la página se
 * controla:
 *   - el JavaScript de la página corre sobre el reloj falso de Playwright
 *     (`page.clock`), que avanza exactamente 1/30 s por fotograma;
 *   - las animaciones y transiciones CSS se ralentizan con CDP
 *     (`Animation.setPlaybackRate`) y cada fotograma espera el tiempo real
 *     equivalente, así que también avanzan 1/30 s por fotograma.
 * Se graba con `reducedMotion: "no-preference"`: las animaciones del sitio
 * son parte del producto y tienen que verse.
 */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CLIPS, TMP } from "./lib/paths.mjs";
import { ensureSite } from "./lib/server.mjs";
import { ALWAYS_HIDE, HIDE_TEXT, demos } from "./shots.mjs";

const FPS = 30;
const FRAME_MS = 1000 / FPS;
/** Velocidad de las animaciones CSS durante la captura (0.1 = 10 veces más lento). */
const RATE = Number(process.env.REELS_RATE || 0.12);
const REAL_FRAME_MS = FRAME_MS / RATE;

const VIEWPORT = { width: 390, height: 844 };
const SCALE = 2;

const ease = {
  linear: (t) => t,
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  outCubic: (t) => 1 - (1 - t) ** 3,
  inOutQuart: (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2),
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseArgs(argv) {
  const args = argv.filter((a) => !a.startsWith("--"));
  if (argv.includes("--list")) {
    for (const [key, demo] of Object.entries(demos)) {
      console.log(`${key.padEnd(11)} ${demo.label}`);
      for (const s of demo.shots) console.log(`  · ${s.name.padEnd(12)} ${s.dur}s  ${s.path}`);
    }
    process.exit(0);
  }
  const plan = [];
  const wanted = args.length ? args : Object.keys(demos);
  for (const item of wanted) {
    const [key, only] = item.split(":");
    const demo = demos[key];
    if (!demo) throw new Error(`Demo desconocida: ${key}. Usa --list.`);
    const names = only ? only.split(",") : null;
    for (const shot of demo.shots) {
      if (!names || names.includes(shot.name)) plan.push({ key, demo, shot });
    }
  }
  return plan;
}

/** Pasa un tiempo real sincronizado con el reloj falso, a velocidad normal. */
async function runRealtime(page, cdp, ms) {
  await cdp.send("Animation.setPlaybackRate", { playbackRate: 1 });
  const step = 50;
  for (let t = 0; t < ms; t += step) {
    await page.clock.runFor(step);
    await sleep(step);
  }
}

async function resolveY(page, to, base) {
  if (typeof to === "number") return to;
  if (typeof to === "string" && /^[+-]\d+$/.test(to)) return base + Number(to);
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`No existe ${sel}`);
    return el.getBoundingClientRect().top + window.scrollY;
  }, to);
}

async function recordShot(browser, url, key, demo, shot) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
    locale: "es-HN",
    colorScheme: "light",
  });
  const page = await context.newPage();
  await page.clock.install({ time: new Date("2026-09-15T09:00:00-06:00") });
  const cdp = await context.newCDPSession(page);
  await cdp.send("Animation.enable");

  const hide = [...ALWAYS_HIDE, ...(demo.hide || [])];
  // El estilo se inyecta antes de que cargue la página para que lo oculto no
  // aparezca ni un fotograma.
  await page.addInitScript((css) => {
    const apply = () => {
      const style = document.createElement("style");
      style.dataset.reels = "";
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
    else apply();
  }, `${hide.join(",")}{display:none!important} html{scroll-behavior:auto!important} ::-webkit-scrollbar{display:none}`);

  // Oculta enlaces, ítems y párrafos que mencionan precios o costos, también
  // los que la página crea después (menús que se arman con JavaScript).
  await page.addInitScript((source) => {
    const re = new RegExp(source, "i");
    const sweep = () => {
      for (const node of document.querySelectorAll("a, button, li, p, dt, dd, h3, h4, tr, figcaption, small")) {
        if (node.dataset.reelsHidden || !re.test(node.textContent || "")) continue;
        // El más pequeño: si un hijo de la lista también coincide, se oculta el hijo.
        const inner = node.querySelectorAll("a, button, li, p, dt, dd, h3, h4, tr, figcaption, small");
        if ([...inner].some((n) => re.test(n.textContent || ""))) continue;
        node.dataset.reelsHidden = "1";
        node.style.setProperty("display", "none", "important");
      }
    };
    const start = () => {
      sweep();
      new MutationObserver(sweep).observe(document.body, { childList: true, subtree: true, characterData: true });
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  }, HIDE_TEXT);

  // Con preroll 0 se quiere ver la animación de entrada: la página carga ya
  // ralentizada, así la entrada empieza en el primer fotograma.
  if (!shot.preroll) await cdp.send("Animation.setPlaybackRate", { playbackRate: RATE });
  await page.goto(url + shot.path, { waitUntil: "load" });
  if (!shot.preroll) await cdp.send("Animation.setPlaybackRate", { playbackRate: RATE });
  await page.evaluate(() => document.fonts.ready);

  // Posición inicial de la cámara.
  let y = 0;
  if (shot.start) {
    y = Math.max(0, (await resolveY(page, shot.start, 0)) - (shot.offset || 0));
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
  }
  if (shot.preroll) await runRealtime(page, cdp, shot.preroll * 1000);

  const frames = Math.round(shot.dur * FPS);
  const dir = join(TMP, "frames", `${key}-${shot.name}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  // Coreografía preparada: los scroll resuelven su destino al empezar.
  const steps = (shot.steps || []).map((s) => ({ ...s, done: false }));
  const active = [];
  const typing = [];

  await cdp.send("Animation.setPlaybackRate", { playbackRate: RATE });
  for (let f = 0; f < frames; f++) {
    const began = Date.now();
    const t = f / FPS;

    for (const step of steps) {
      if (step.done || t + 1e-6 < step.at) continue;
      step.done = true;
      if (step.scroll) {
        const from = await page.evaluate(() => window.scrollY);
        const to = await resolveY(page, step.scroll.to, from);
        const target = step.scroll.offset ? to - step.scroll.offset : to;
        active.push({ at: step.at, dur: step.scroll.dur, from, to: target, ease: ease[step.scroll.ease || "inOutCubic"] });
      }
      if (step.tap) {
        await page.locator(step.tap).first().tap({ force: true, timeout: 5000 }).catch((e) => console.warn(`  ! tap ${step.tap}: ${e.message.split("\n")[0]}`));
      }
      if (step.type) {
        const { sel, text, cps = 8 } = step.type;
        await page.locator(sel).first().focus().catch(() => {});
        [...text].forEach((ch, i) => typing.push({ at: step.at + i / cps, ch }));
      }
    }

    for (const k of typing) {
      if (!k.done && t + 1e-6 >= k.at) {
        k.done = true;
        await page.keyboard.type(k.ch);
      }
    }

    for (const s of active) {
      const p = Math.min(1, Math.max(0, (t - s.at) / s.dur));
      if (t + 1e-6 < s.at) continue;
      const pos = s.from + (s.to - s.from) * s.ease(p);
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), pos);
    }

    await page.clock.runFor(FRAME_MS);
    const spent = Date.now() - began;
    if (spent < REAL_FRAME_MS) await sleep(REAL_FRAME_MS - spent);
    await page.screenshot({
      path: join(dir, `${String(f).padStart(5, "0")}.jpg`),
      type: "jpeg",
      quality: 95,
      scale: "device",
      caret: "initial",
    });
  }
  await context.close();

  const outDir = join(CLIPS, key);
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, `${shot.name}.mp4`);
  const ff = spawnSync(
    "ffmpeg",
    ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", join(dir, "%05d.jpg"),
      "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p",
      "-movflags", "+faststart", out],
    { stdio: "inherit" },
  );
  if (ff.status !== 0) throw new Error(`ffmpeg falló al ensamblar ${key}/${shot.name}`);
  rmSync(dir, { recursive: true, force: true });
  return { file: `${key}/${shot.name}.mp4`, dur: shot.dur, path: shot.path, recorded: new Date().toISOString() };
}

const plan = parseArgs(process.argv.slice(2));
const site = await ensureSite();
const browser = await chromium.launch();
const indexFile = join(CLIPS, "index.json");
const index = existsSync(indexFile) ? JSON.parse(readFileSync(indexFile, "utf8")) : {};
try {
  for (const { key, demo, shot } of plan) {
    const t0 = Date.now();
    process.stdout.write(`● ${key}/${shot.name} (${shot.dur}s)… `);
    const entry = await recordShot(browser, site.url, key, demo, shot);
    index[`${key}/${shot.name}`] = entry;
    mkdirSync(CLIPS, { recursive: true });
    writeFileSync(indexFile, JSON.stringify(index, null, 2));
    console.log(`listo en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
} finally {
  await browser.close();
  site.stop();
}

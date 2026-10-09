#!/usr/bin/env node
/**
 * Convierte videos/<ID>/reel.json en un proyecto HyperFrames listo para
 * renderizar (videos/<ID>/index.html + assets/).
 *
 *   npm run build -- R00            # variante Instagram (la que se previsualiza)
 *   npm run build -- R00 tiktok     # variante TikTok (gancho más grande, escenas omitidas)
 *   npm run build -- R00 cover      # fotograma de portada
 *
 * reel.json es lo único que se edita a mano. Este script:
 *   - calcula los tiempos de cada escena, subtítulo y rótulo;
 *   - escribe los <video> estáticos (HyperFrames necesita el src y los tiempos
 *     en el HTML) y el bloque JSON inline que lee el motor (templates/_shared/reel.js);
 *   - copia fuentes, GSAP, el logo y los clips grabados a videos/<ID>/assets/.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { BRAND, CLIPS, FORMATS, RAW, REELS, SHARED, SITE, TEMPLATES, VIDEOS } from "./lib/paths.mjs";

export const CONTACT = {
  whatsapp: "+504 9230-0861",
  url: "corestructhn.com",
  handle: "@corestructhn",
};
const ENDCARD = 1.5;
const r2 = (n) => Math.round(n * 1000) / 1000;

export function loadReel(id) {
  const file = join(VIDEOS, id, "reel.json");
  if (!existsSync(file)) throw new Error(`No existe ${file}. Créalo con: npm run new -- ${id} <A|B|C|D|E>`);
  return JSON.parse(readFileSync(file, "utf8"));
}

/** "aurea/hero" → raw/clips/aurea/hero.mp4 · "raw:cara-01.mp4" → raw/cara-01.mp4 */
export function clipSource(ref) {
  if (ref.startsWith("raw:")) return join(RAW, ref.slice(4));
  return join(CLIPS, ...ref.split("/")) + ".mp4";
}
const clipAsset = (ref) => "assets/clips/" + basename(ref.replace(/^raw:/, "raw-").replace(/\//g, "-"), ".mp4") + ".mp4";

function clipIndex() {
  const f = join(CLIPS, "index.json");
  return existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : {};
}

/** Reparte las palabras de un texto en bloques de 2-3 y les da tiempos. */
function captionChunks(text, start, end, explicit) {
  const chunks = explicit && explicit.length
    ? explicit.map((c) => c.split(/\s+/).filter(Boolean))
    : (() => {
        const words = text.split(/\s+/).filter(Boolean);
        // Bloques de hasta 3 palabras y ~20 caracteres: a 72 px caben en una línea.
        const out = [];
        let cur = [];
        for (const w of words) {
          const len = [...cur, w].join(" ").length;
          if (cur.length && (cur.length >= 3 || len > 20)) { out.push(cur); cur = []; }
          cur.push(w);
        }
        if (cur.length) out.push(cur);
        // Un bloque final de una sola palabra se ve cortado: se une al anterior.
        if (out.length > 1 && out[out.length - 1].length === 1 && [...out[out.length - 2], out[out.length - 1][0]].join(" ").length <= 22) {
          out[out.length - 2].push(out.pop()[0]);
        }
        return out;
      })();
  const weight = (w) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 3;
  const total = chunks.flat().reduce((a, w) => a + weight(w), 0);
  const span = end - start;
  let t = start;
  return chunks.map((ws) => {
    const words = ws.map((w) => {
      const d = (weight(w) / total) * span;
      const item = { text: w, start: r2(t), end: r2(t + d) };
      t += d;
      return item;
    });
    return { start: words[0].start, end: words[words.length - 1].end, words };
  });
}

export function plan(reel, variant = "ig") {
  const skip = new Set(variant === "tiktok" ? reel.variants?.tiktok?.skip || [] : []);
  // TikTok puede ir 1-2 s más corto: `variants.tiktok.trim` acorta escenas
  // concretas ({"s2": 2.2}) y `skip` las quita.
  const trim = variant === "tiktok" ? reel.variants?.tiktok?.trim || {} : {};
  const scenesIn = reel.scenes.map((s) => (trim[s.id] ? { ...s, dur: trim[s.id] } : s));
  if (reel.cta) scenesIn.push({ id: "cta", type: "cta", dur: reel.cta.dur || 2, clip: reel.cta.clip, from: reel.cta.from, zoom: reel.cta.zoom });
  const idx = clipIndex();

  let t = 0;
  const scenes = [];
  const media = [];
  for (const s of scenesIn) {
    if (skip.has(s.id)) continue;
    const start = r2(t);
    const end = r2(t + s.dur);
    t = end;
    const hasClip = Boolean(s.clip);
    const phone = ["demo", "wipe"].includes(s.type) || (s.type === "cta" && hasClip);
    const sc = { id: s.id, type: s.type, start, end, phone };
    if (s.zoom) sc.zoom = s.zoom;
    if (s.origin) sc.origin = s.origin;
    if (s.lines) sc.lines = s.lines;
    if (s.kicker) sc.kicker = s.kicker;
    if (s.items) sc.items = s.items;
    if (s.before) sc.before = s.before;
    if (s.type === "wipe") sc.wipeAt = r2(start + (s.wipeAt ?? s.dur * 0.45));
    if (hasClip) {
      const from = s.from || 0;
      const known = idx[s.clip];
      if (known && from + s.dur > known.dur + 0.01) {
        throw new Error(`Escena ${s.id}: ${s.clip} dura ${known.dur}s y se piden ${from}+${s.dur}s.`);
      }
      media.push({ scene: sc, ref: s.clip, from, where: s.type === "face" ? "face" : s.type === "wipe" ? "wipe" : "screen" });
    }
    scenes.push({ ...sc, label: s.label, labelBefore: s.labelBefore, labelAfter: s.labelAfter, caption: s.caption, captions: s.captions });
  }
  const duration = r2(t + ENDCARD);
  const endStart = r2(t);

  // Gancho: siempre sobre el arranque del video.
  const hookText = variant === "cover" ? reel.copy?.cover || reel.hook.text : reel.hook.text;
  const hook = { text: hookText, start: 0, end: r2(variant === "cover" ? duration : reel.hook.dur || 1.8), hold: variant === "cover" };

  // Rótulos: la palabra clave entra en el segundo 0.15 (antes del 3, regla de
  // TikTok) y luego cada escena muestra el suyo.
  // Si el video abre con un antes/después, la palabra clave cede el chip
  // antes para que se lean "Antes" y "Después".
  const keyEnd = scenes[0]?.type === "wipe" ? r2(hook.end + 0.6) : r2(Math.max(hook.end + 1.4, 3.2));
  const labels = [];
  if (reel.keyword) labels.push({ text: reel.keyword, start: 0.15, end: variant === "cover" ? duration : keyEnd, key: true });
  if (variant !== "cover") {
    for (const s of scenes) {
      if (s.type === "cta") continue;
      if (s.type === "wipe") {
        const a = Math.max(s.start, keyEnd) + 0.05;
        if (a < s.wipeAt - 0.4) labels.push({ text: s.labelBefore || "Antes", start: r2(a), end: s.wipeAt });
        labels.push({ text: s.labelAfter || "Después", start: r2(Math.max(s.wipeAt, keyEnd + 0.05)), end: s.end });
        continue;
      }
      if (!s.label) continue;
      const a = Math.max(s.start, keyEnd) + 0.05;
      if (s.end - a < 0.8) continue;
      labels.push({ text: s.label, start: r2(a), end: s.end });
    }
  }

  // Subtítulos: el video se lee sin audio, así que cada escena trae su frase.
  const captions = [];
  if (variant !== "cover") {
    for (const s of scenes) {
      if (!s.caption && !s.captions) continue;
      const a = Math.max(s.start, s.start < hook.end ? hook.end + 0.05 : s.start) + 0.05;
      const b = s.end - 0.06;
      if (b - a < 0.5) continue;
      captions.push(...captionChunks(s.caption || "", a, b, s.captions));
    }
  }

  const cta = reel.cta && !skip.has("cta") && variant !== "cover"
    ? { text: reel.cta.text, start: scenes.find((s) => s.type === "cta").start, end: endStart }
    : null;

  const data = {
    id: reel.id,
    format: reel.format,
    variant,
    duration,
    seed: reel.seed || 2026,
    hook,
    scenes: scenes.map(({ label, labelBefore, labelAfter, caption, captions: _c, ...rest }) => rest),
    labels,
    captions,
    cta,
    endcard: { start: endStart, ...CONTACT },
  };
  return { data, media, duration };
}

function mediaTags(media, where) {
  return media
    .filter((m) => m.where === where || (where === "screen" && m.where === "wipe"))
    .map((m) => {
      const s = m.scene;
      const tag =
        `<video id="v-${s.id}" class="scr" src="${clipAsset(m.ref)}" data-start="${s.start}" ` +
        `data-duration="${r2(s.end - s.start)}" data-media-start="${m.from}" data-track-index="1" muted playsinline></video>`;
      return m.where === "wipe" ? `<div class="wipe-after" id="wa-${s.id}">${tag}</div>` : tag;
    })
    .map((l) => "              " + l)
    .join("\n");
}

function copyIfNewer(src, dst) {
  if (!existsSync(src)) throw new Error(`Falta ${src}`);
  mkdirSync(resolve(dst, ".."), { recursive: true });
  copyFileSync(src, dst);
}

/** Escribe videos/<ID>/index.html para la variante pedida. */
export function build(id, variant = "ig") {
  const reel = loadReel(id);
  const folder = FORMATS[reel.format];
  if (!folder) throw new Error(`Formato desconocido "${reel.format}" (usa A, B, C, D o E)`);
  const dir = join(VIDEOS, id);
  const { data, media, duration } = plan(reel, variant);

  // Recursos compartidos.
  copyIfNewer(join(SITE, "assets", "fonts", "manrope-latin.woff2"), join(dir, "assets", "fonts", "manrope-latin.woff2"));
  copyIfNewer(join(SITE, "assets", "fonts", "manrope-latin-ext.woff2"), join(dir, "assets", "fonts", "manrope-latin-ext.woff2"));
  copyIfNewer(join(SITE, "assets", "fonts", "Manrope-OFL.txt"), join(dir, "assets", "fonts", "Manrope-OFL.txt"));
  copyIfNewer(join(SHARED, "gsap.min.js"), join(dir, "assets", "gsap.min.js"));
  copyIfNewer(join(SHARED, "reel.css"), join(dir, "assets", "reel.css"));
  copyIfNewer(join(SHARED, "reel.js"), join(dir, "assets", "reel.js"));
  copyIfNewer(join(BRAND, "LOGO_HORIZONTAL_BLANCO.png"), join(dir, "assets", "brand", "LOGO_HORIZONTAL_BLANCO.png"));
  const missing = [];
  for (const m of media) {
    const src = clipSource(m.ref);
    const dst = join(dir, clipAsset(m.ref));
    if (!existsSync(src)) { missing.push(m.ref); continue; }
    copyIfNewer(src, dst);
  }
  if (missing.length) {
    throw new Error(`Faltan clips grabados: ${[...new Set(missing)].join(", ")}.\n  Grábalos con: npm run record -- ${[...new Set(missing.map((m) => m.split("/")[0]))].join(" ")}`);
  }
  let audio = "";
  if (reel.music?.src) {
    const src = join(REELS, reel.music.src);
    const name = basename(src);
    copyIfNewer(src, join(dir, "assets", "music", name));
    const vol = Math.pow(10, (reel.music.db ?? -20) / 20).toFixed(3);
    audio = `      <audio id="music" src="assets/music/${name}" data-start="0" data-duration="${duration}" data-volume="${vol}" data-track-index="5"></audio>`;
  }

  const fill = (tpl, map) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in map ? map[k] : `{{${k}}}`));
  const html = fill(readFileSync(join(SHARED, "skeleton.html"), "utf8"), {
    TITLE: `${reel.id} · ${reel.title}`.replace(/[<>&]/g, ""),
    FORMAT: reel.format,
    FORMAT_NAME: folder,
    VARIANT: variant,
    DURATION: String(duration),
    FONTS_CSS: readFileSync(join(SHARED, "fonts.css"), "utf8"),
    FORMAT_CSS: readFileSync(join(TEMPLATES, folder, "format.css"), "utf8"),
    MEDIA_SCREEN: mediaTags(media, "screen"),
    MEDIA_FACE: mediaTags(media, "face"),
    AUDIO: audio,
    DATA: JSON.stringify(data).replace(/</g, "\\u003c"),
  });
  writeFileSync(join(dir, "index.html"), html);
  if (!existsSync(join(dir, "hyperframes.json"))) {
    writeFileSync(join(dir, "hyperframes.json"), JSON.stringify({
      $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
      registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
      paths: { blocks: "compositions", components: "compositions/components", assets: "assets" },
      media: { autoProxy: true },
    }, null, 2) + "\n");
  }
  return { dir, duration, data, reel };
}

if (resolve(process.argv[1] || "") === resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"))) {
  const [id, variant = "ig"] = process.argv.slice(2);
  if (!id) { console.log("Uso: npm run build -- <ID> [ig|tiktok|cover]"); process.exit(1); }
  const { dir, duration } = build(id, variant);
  console.log(`✓ ${id} (${variant}) → ${dir}\\index.html · ${duration}s`);
}

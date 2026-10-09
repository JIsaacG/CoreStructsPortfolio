#!/usr/bin/env node
/**
 * Control de calidad automático de un Reel.
 *
 *   npm run qa -- R00
 *
 * Revisa:
 *   1. Archivo final: duración, resolución, fps, códecs (H.264 + AAC 48 kHz),
 *      peso (≤ 30 MB) y loudness (-14 LUFS si hay audio).
 *   2. Composición: ningún texto fuera de la zona segura (120 px a los lados,
 *      220 arriba, 480 abajo) en ningún momento; Manrope en todo el texto;
 *      Quantify en ningún lado; el logo es LOGO_HORIZONTAL_BLANCO (fondo oscuro)
 *      y solo aparece en la tarjeta final.
 *   3. Textos: sin precios, plazos, cifras ni lenguaje de venta agresiva;
 *      ortografía básica (tildes de palabras frecuentes, signos de apertura).
 *   4. Copy: largo de captions, palabra clave en los primeros 80 caracteres
 *      de TikTok, 3-5 hashtags, portada de máximo 5 palabras con la palabra clave.
 */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { CONTACT, build, loadReel, plan } from "./build.mjs";
import { OUT, VIDEOS } from "./lib/paths.mjs";

const SAFE = { left: 120, right: 960, top: 220, bottom: 1440 };
const MAX_MB = 30;

/** Palabras que casi siempre llevan tilde en estos videos. */
const ACCENTS = {
  pagina: "página", paginas: "páginas", telefono: "teléfono", tambien: "también", aqui: "aquí",
  facil: "fácil", rapido: "rápido", rapida: "rápida", informacion: "información", educacion: "educación",
  admision: "admisión", solucion: "solución", automatizacion: "automatización", menu: "menú",
  numero: "número", academico: "académico", academica: "académica", gestion: "gestión",
  institucion: "institución", tecnologia: "tecnología", busqueda: "búsqueda", diseno: "diseño",
  ingles: "inglés", ademas: "además", dificil: "difícil", unico: "único", unica: "única",
  publico: "público", publica: "pública",
};

const BANNED = [
  [/\$|\blempiras?\b|\bL\.\s?\d|\bHNL\b|\bUSD\b/i, "precio"],
  [/\bprecios?\b|\bcostos?\b|\bcuesta\b|\baranceles?\b|\btarifas?\b/i, "precio"],
  [/\bdescuentos?\b|\bpromo(ci[oó]n)?\b|\bgratis\b|\bbarat[oa]s?\b|\boferta(?!\s+acad[eé]mica)\b/i, "venta agresiva"],
  [/\bcotiza\b|\bcompra ya\b|\búltim[oa]s? (cupos|días)\b|\bsolo hoy\b/i, "venta agresiva"],
  [/\bplazos?\b|\ben \d+\s?(d[ií]as|semanas|meses)\b|\b\d+\s?(d[ií]as|semanas|meses|horas)\b/i, "plazo"],
  [/\d+\s?%|\b\d+x\b|\+\d+\b(?!\s?\d{4})/i, "cifra"],
];

export function bannedIn(text, { allowDigits = false } = {}) {
  const issues = [];
  for (const [re, kind] of BANNED) if (re.test(text)) issues.push(`${kind}: "${text}"`);
  if (!allowDigits && /\d/.test(text)) issues.push(`cifra: "${text}"`);
  return issues;
}

export function spelling(text) {
  const issues = [];
  const plain = text.replace(/\*/g, "");
  for (const w of plain.toLowerCase().match(/[\p{L}]+/gu) || []) {
    if (ACCENTS[w]) issues.push(`"${w}" → "${ACCENTS[w]}"`);
  }
  if (plain.includes("?") && !plain.includes("¿")) issues.push(`falta "¿" en "${plain}"`);
  if (plain.includes("!") && !plain.includes("¡")) issues.push(`falta "¡" en "${plain}"`);
  if (/\s{2,}/.test(plain)) issues.push(`doble espacio en "${plain}"`);
  return issues;
}

const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\*/g, "").toLowerCase();

/* ---------------------------------------------------------- 1. archivo */
export function probe(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_format", "-show_streams", "-of", "json", file], { encoding: "utf8" });
  return JSON.parse(r.stdout);
}

export function loudness(file) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-filter_complex", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" });
  const text = r.stderr || "";
  const summary = text.slice(text.lastIndexOf("Summary:"));
  const I = summary.match(/I:\s+(-?[\d.]+|-inf)\s+LUFS/);
  const TP = summary.match(/Peak:\s+(-?[\d.]+|-inf)\s+dBFS/);
  return { lufs: I ? Number(I[1]) : null, truePeak: TP ? Number(TP[1]) : null };
}

export function qaVideo(file, expected, hasAudio) {
  const checks = [];
  const add = (name, ok, detail) => checks.push({ name, ok, detail });
  if (!existsSync(file)) return [{ name: "archivo", ok: false, detail: `no existe ${file}` }];
  const info = probe(file);
  const v = info.streams.find((s) => s.codec_type === "video");
  const a = info.streams.find((s) => s.codec_type === "audio");
  const dur = Number(info.format.duration);
  const mb = statSync(file).size / 1024 / 1024;
  const [n, d] = String(v?.r_frame_rate || "0/1").split("/").map(Number);
  add("duración", Math.abs(dur - expected) < 0.2 && dur >= 7 && dur <= 45, `${dur.toFixed(2)} s (esperado ${expected} s; rango 7-45 s)`);
  add("resolución", v?.width === 1080 && v?.height === 1920, `${v?.width}x${v?.height}`);
  add("fps", Math.abs(n / d - 30) < 0.01, `${(n / d).toFixed(2)} fps`);
  add("video H.264", v?.codec_name === "h264" && v?.pix_fmt === "yuv420p", `${v?.codec_name} ${v?.pix_fmt}`);
  add("audio AAC 48 kHz", a?.codec_name === "aac" && a?.sample_rate === "48000", a ? `${a.codec_name} ${a.sample_rate} Hz ${a.channels} canales` : "sin pista de audio");
  add("peso ≤ 30 MB", mb <= MAX_MB, `${mb.toFixed(2)} MB`);
  const L = loudness(file);
  if (hasAudio) add("loudness -14 LUFS", L.lufs !== null && Math.abs(L.lufs + 14) <= 1, `${L.lufs} LUFS, pico ${L.truePeak} dBTP`);
  else add("loudness", true, `sin voz ni música: pista AAC en silencio (${L.lufs === null ? "-inf" : L.lufs} LUFS); -14 LUFS se aplica cuando haya audio`);
  return checks;
}

/* ------------------------------------------------------ 2. composición */
export async function qaComposition(id, variant = "ig") {
  const { dir, data } = build(id, variant);
  const html = readFileSync(join(dir, "index.html"), "utf8");
  const checks = [];
  const add = (name, ok, detail) => checks.push({ name, ok, detail });
  add("Quantify ausente", !/quantify/i.test(html), /quantify/i.test(html) ? "aparece Quantify en el HTML" : "solo Manrope declarada");

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(pathToFileURL(join(dir, "index.html")).href);
  await page.waitForFunction(() => window.__reel && document.fonts.status === "loaded");
  await page.evaluate(() => document.fonts.ready);
  const manrope = await page.evaluate(() => document.fonts.check('700 72px "Manrope"'));
  add("Manrope cargada", manrope, manrope ? "fuente local cargada" : "Manrope NO cargó");

  const times = [];
  for (let t = 0; t < data.duration - 0.02; t += 0.25) times.push(Math.round(t * 100) / 100);
  times.push(data.duration - 0.05);
  const outside = new Map();
  const fonts = new Set();
  let logoEarly = [];
  let logoSrc = "";
  let imgs = 0;
  for (const t of times) {
    const res = await page.evaluate(({ t, SAFE }) => {
      window.__reel.timeline.seek(t, false);
      const vis = (el) => {
        let o = 1;
        for (let n = el; n && n !== document.body; n = n.parentElement) {
          const cs = getComputedStyle(n);
          if (cs.display === "none" || cs.visibility === "hidden") return 0;
          o *= Number(cs.opacity);
        }
        return o;
      };
      const sel = "#hook .w, #cta .w, .chip, .cap-box, .stage-scene .line, .stage-scene .kicker, .card, #endcard-inner > *";
      const bad = [];
      const fam = [];
      for (const el of document.querySelectorAll(sel)) {
        if (vis(el) < 0.05) continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        fam.push(getComputedStyle(el).fontFamily);
        const tol = 2;
        if (r.left < SAFE.left - tol || r.right > SAFE.right + tol || r.top < SAFE.top - tol || r.bottom > SAFE.bottom + tol) {
          bad.push(`${el.id || el.className}: "${(el.textContent || el.getAttribute("alt") || "").trim().slice(0, 40)}" [${Math.round(r.left)},${Math.round(r.top)} → ${Math.round(r.right)},${Math.round(r.bottom)}]`);
        }
      }
      const logo = document.getElementById("endcard-logo");
      return { bad, fam, logoVis: vis(logo), logoSrc: logo.getAttribute("src"), imgs: document.querySelectorAll("img").length };
    }, { t, SAFE });
    res.bad.forEach((b) => outside.set(b.replace(/\[.*\]/, ""), `${b} @${t}s`));
    res.fam.forEach((f) => fonts.add(f.split(",")[0].replace(/"/g, "").trim()));
    if (t < data.endcard.start - 0.01 && res.logoVis > 0.01) logoEarly.push(t);
    logoSrc = res.logoSrc;
    imgs = res.imgs;
  }
  await browser.close();

  add("zona segura", outside.size === 0, outside.size ? [...outside.values()].slice(0, 6).join(" | ") : `${times.length} instantes revisados, todo el texto dentro de 120-960 × 220-1440`);
  add("Manrope en todo el texto", [...fonts].every((f) => f === "Manrope"), `familias usadas: ${[...fonts].join(", ")}`);
  add("logo correcto", /LOGO_HORIZONTAL_BLANCO\.png$/.test(logoSrc) && imgs === 1, `${logoSrc} sobre fondo oscuro; ${imgs} imagen(es) en la composición`);
  add("logo solo al final", logoEarly.length === 0, logoEarly.length ? `visible antes de la tarjeta final en ${logoEarly.join(", ")} s` : `aparece en ${data.endcard.start} s (tarjeta final de 1.5 s)`);

  // Palabra clave en pantalla antes del segundo 3.
  const key = data.labels.find((l) => l.key);
  add("palabra clave antes de 3 s", Boolean(key && key.start < 3), key ? `"${key.text}" desde ${key.start} s` : "sin palabra clave");
  add("gancho ≤ 1.5-2 s y sin logo", data.hook && data.hook.end <= 2.0 + 1e-6, `gancho "${data.hook.text.replace(/\*/g, "")}" de 0 a ${data.hook.end} s`);
  return { checks, data };
}

/* ----------------------------------------------------------- 3. textos */
export function qaTexts(reel, data) {
  const checks = [];
  const add = (name, ok, detail) => checks.push({ name, ok, detail });
  const onScreen = [
    data.hook.text,
    ...(reel.hook.variants || []),
    ...data.labels.map((l) => l.text),
    ...data.captions.map((c) => c.words.map((w) => w.text).join(" ")),
    ...data.scenes.flatMap((s) => [...(s.lines || []), s.kicker || "", ...(s.items || [])]).filter(Boolean),
    data.cta?.text || "",
    reel.copy?.cover || "",
  ].filter(Boolean);
  const banned = onScreen.flatMap((t) => bannedIn(t));
  add("sin precios, plazos ni cifras", banned.length === 0, banned.length ? banned.join(" | ") : `${onScreen.length} textos en pantalla revisados (solo el WhatsApp ${CONTACT.whatsapp} lleva números)`);
  const sp = [...onScreen, reel.copy?.instagram || "", reel.copy?.tiktok || "", reel.copy?.pinned || ""].flatMap(spelling);
  add("ortografía básica", sp.length === 0, sp.length ? sp.join(" | ") : "tildes y signos de apertura correctos");
  const hookStart = norm(data.hook.text);
  add("gancho sin 'Hola' ni marca", !/^(hola|en corestruct)/.test(hookStart) && !hookStart.includes("corestruct"), `"${data.hook.text.replace(/\*/g, "")}"`);
  const words = data.hook.text.split(/\s+/).length;
  add("gancho ≤ 7 palabras", words <= 7, `${words} palabras`);
  return checks;
}

/* ------------------------------------------------------------- 4. copy */
export function qaCopy(reel) {
  const checks = [];
  const add = (name, ok, detail) => checks.push({ name, ok, detail });
  const c = reel.copy || {};
  const ig = c.instagram || "";
  const tt = c.tiktok || "";
  add("caption IG 125-150", ig.length >= 125 && ig.length <= 150, `${ig.length} caracteres`);
  add("hashtags IG 3-5", (c.instagramHashtags || []).length >= 3 && (c.instagramHashtags || []).length <= 5, (c.instagramHashtags || []).join(" "));
  add("caption TikTok 100-150", tt.length >= 100 && tt.length <= 150, `${tt.length} caracteres`);
  add("palabra clave en 80 caracteres (TikTok)", norm(tt.slice(0, 80)).includes(norm(reel.keyword)), `"${tt.slice(0, 80)}"`);
  add("hashtags TikTok 3-5", (c.tiktokHashtags || []).length >= 3 && (c.tiktokHashtags || []).length <= 5, (c.tiktokHashtags || []).join(" "));
  const cover = (c.cover || "").replace(/\*/g, "");
  add("portada ≤ 5 palabras con palabra clave", cover.split(/\s+/).length <= 5 && norm(cover).includes(norm(reel.keyword)), `"${cover}"`);
  const banned = [ig, tt, c.pinned || ""].flatMap((t) => bannedIn(t, { allowDigits: true }));
  add("copy sin precios ni venta agresiva", banned.length === 0, banned.length ? banned.join(" | ") : "ok");
  return checks;
}

export function report(id, sections) {
  const lines = [`# QA ${id}`, "", `Generado: ${new Date().toISOString()}`, ""];
  let failed = 0;
  for (const [title, checks] of sections) {
    lines.push(`## ${title}`, "", "| Revisión | Estado | Detalle |", "| --- | --- | --- |");
    for (const c of checks) {
      if (!c.ok) failed++;
      lines.push(`| ${c.name} | ${c.ok ? "OK" : "FALLA"} | ${String(c.detail).replace(/\|/g, "/")} |`);
    }
    lines.push("");
  }
  lines.splice(3, 0, failed ? `**Resultado: ${failed} revisión(es) fallaron.**` : "**Resultado: todo en orden.**", "");
  return { md: lines.join("\n"), failed };
}

if (resolve(process.argv[1] || "") === resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"))) {
  const id = process.argv[2];
  if (!id) { console.log("Uso: npm run qa -- <ID>"); process.exit(1); }
  const reel = loadReel(id);
  const sections = [];
  for (const variant of ["ig", "tiktok"]) {
    const file = join(OUT, id, `${id}_${variant}.mp4`);
    const { duration } = plan(reel, variant);
    sections.push([`Archivo ${variant}`, qaVideo(file, duration, Boolean(reel.music?.src))]);
  }
  const comp = await qaComposition(id, "tiktok");
  sections.push(["Composición TikTok", comp.checks]);
  const compIg = await qaComposition(id, "ig");
  sections.push(["Composición Instagram", compIg.checks]);
  sections.push(["Textos", qaTexts(reel, compIg.data)]);
  sections.push(["Copy", qaCopy(reel)]);
  const { md, failed } = report(id, sections);
  writeFileSync(join(OUT, id, `${id}_qa.md`), md);
  console.log(md);
  process.exit(failed ? 1 : 0);
}

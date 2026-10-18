#!/usr/bin/env node
/**
 * Produce un Reel de punta a punta con un solo comando.
 *
 *   npm run produce -- R00
 *   npm run produce -- R00 --record     # además vuelve a grabar las demos que usa
 *   npm run produce -- R00 --remix      # solo rehace la mezcla de audio sobre el último render
 *
 * Pasos:
 *   1. (opcional) graba los clips de las demos que pide reel.json;
 *   2. por variante (TikTok e Instagram): build → `hyperframes check` sin
 *      hallazgos → render 1080x1920 a 30 fps;
 *   3. posproducción con FFmpeg: mezcla voz + música (la música se agacha
 *      bajo la voz), H.264 + AAC 48 kHz, -14 LUFS, faststart, ≤ 30 MB;
 *   4. portada 1080x1920 en PNG con el texto de portada;
 *   5. <ID>_copy.md, hoja de fotogramas y control de calidad (<ID>_qa.md);
 *   6. actualiza out/INDEX.md.
 *
 * Todo queda en out/<ID>/. Los temporales van a tmp/ (no se suben).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { build, loadReel, plan } from "./build.mjs";
import { contactSheet } from "./frames.mjs";
import { check, hf } from "./lib/hf.mjs";
import { OUT, REELS, TMP } from "./lib/paths.mjs";
import { qaComposition, qaCopy, qaTexts, qaVideo, report } from "./qa.mjs";

const MAX_MB = 30;
const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith("--"));
if (!id) {
  console.log("Uso: npm run produce -- <ID> [--record]");
  process.exit(1);
}
const reel = loadReel(id);
const outDir = join(OUT, id);
mkdirSync(outDir, { recursive: true });
mkdirSync(join(TMP, "render"), { recursive: true });
const step = (msg) => console.log(`\n▶ ${msg}`);
const fail = (msg) => {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
};

/* 1 ---------------------------------------------------------- grabación */
if (args.includes("--record")) {
  const refs = [...reel.scenes, reel.cta || {}].map((s) => s.clip).filter((c) => c && !c.startsWith("raw:"));
  const byDemo = {};
  for (const r of refs) {
    const [demo, shot] = r.split("/");
    (byDemo[demo] ||= new Set()).add(shot);
  }
  const targets = Object.entries(byDemo).map(([d, s]) => `${d}:${[...s].join(",")}`);
  step(`Grabando ${targets.join(" ")}`);
  const r = spawnSync(process.execPath, [join(REELS, "scripts", "record-demos.mjs"), ...targets], { stdio: "inherit" });
  if (r.status !== 0) fail("La grabación falló.");
}

/* 3 ------------------------------------------------------- posproducción */
function hasAudioStream(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", file], { encoding: "utf8" });
  return r.stdout.trim().length > 0;
}

/** Loudness integrada (LUFS) de un archivo, para dejar la música a una distancia fija de la voz. */
function lufs(file) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-af", "ebur128", "-f", "null", "-"], { encoding: "utf8" });
  const m = [...r.stderr.matchAll(/I:\s+(-?[\d.]+)\s+LUFS/g)].pop();
  return m ? Number(m[1]) : null;
}

/**
 * Cadena de audio. La música no va en la composición: se mezcla aquí.
 * - Con voz: la música queda `music.db` dB por debajo de la voz (-12 por
 *   defecto) y además se agacha mientras la voz habla (sidechain), con
 *   entrada y salida suaves. Luego todo a -14 LUFS.
 * - Sin voz: la música es el audio; se normaliza a -14 LUFS.
 * - Sin nada: pista AAC en silencio para cumplir el formato de entrega.
 */
function audioArgs(src, duration) {
  const voice = hasAudioStream(src) && Boolean(reel.voice?.src);
  const music = reel.music?.src ? join(REELS, reel.music.src) : null;
  if (music && !existsSync(music)) fail(`Falta la música ${music}`);
  const norm = "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000";
  const fade = `afade=t=in:d=0.4,afade=t=out:st=${Math.max(0, duration - 0.9).toFixed(2)}:d=0.9`;
  if (music && voice) {
    const voiceL = lufs(join(REELS, reel.voice.src)) ?? -18;
    const musicL = lufs(music) ?? -14;
    const gain = (voiceL + (reel.music.db ?? -12) - musicL).toFixed(1);
    return ["-stream_loop", "-1", "-i", music, "-filter_complex",
      `[1:a]aresample=48000,atrim=0:${duration},volume=${gain}dB,${fade}[m];` +
      `[0:a]aresample=48000,asplit=2[v][sc];` +
      `[m][sc]sidechaincompress=threshold=0.02:ratio=4:attack=20:release=300:makeup=1[md];` +
      `[v][md]amix=inputs=2:normalize=0:duration=first,${norm}[a]`,
      "-map", "0:v:0", "-map", "[a]"];
  }
  if (music) {
    return ["-stream_loop", "-1", "-i", music, "-filter_complex",
      `[1:a]aresample=48000,atrim=0:${duration},${fade},${norm}[a]`, "-map", "0:v:0", "-map", "[a]"];
  }
  if (voice) return ["-map", "0:v:0", "-map", "0:a:0", "-af", norm];
  return ["-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-map", "0:v:0", "-map", "1:a:0", "-shortest"];
}

function finish(src, dst, duration) {
  for (let crf = 18; crf <= 30; crf += 2) {
    const a = ["-y", "-loglevel", "error", "-i", src, ...audioArgs(src, duration)];
    a.push(
      "-t", String(duration),
      "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-r", "30", "-g", "60", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", dst,
    );
    const r = spawnSync("ffmpeg", a, { stdio: "inherit" });
    if (r.status !== 0) fail(`FFmpeg falló al exportar ${dst}`);
    const mb = statSync(dst).size / 1024 / 1024;
    if (mb <= MAX_MB) return { crf, mb };
    console.log(`  · ${mb.toFixed(1)} MB con CRF ${crf}; se sube el CRF`);
  }
  fail(`${dst} sigue pesando más de ${MAX_MB} MB con CRF 30.`);
}

/* 2 ------------------------------------------------- build, check, render */
const withAudio = Boolean(reel.music?.src || reel.voice?.src);
// --remix: reutiliza el render de tmp/render y solo rehace audio, exportación y QA
// (para ajustar la mezcla sin volver a capturar fotogramas).
const remix = args.includes("--remix");
for (const variant of ["tiktok", "ig"]) {
  const raw = join(TMP, "render", `${id}_${variant}.mp4`);
  if (remix && existsSync(raw)) {
    const { duration } = plan(reel, variant);
    step(`${id} · ${variant}: remezcla (render reutilizado)`);
    const res = finish(raw, join(outDir, `${id}_${variant}.mp4`), duration);
    console.log(`  · ${id}_${variant}.mp4: ${res.mb.toFixed(2)} MB (CRF ${res.crf})`);
    continue;
  }
  step(`${id} · ${variant}: build`);
  const { dir, duration } = build(id, variant);
  step(`${id} · ${variant}: hyperframes check`);
  const c = check(dir);
  if (!c.ok || c.findings.length) {
    console.error(c.findings.join("\n") || c.raw);
    fail(`hyperframes check no quedó limpio para ${variant}. Corrige y vuelve a correr.`);
  }
  console.log("  · check limpio: 0 hallazgos");
  step(`${id} · ${variant}: render (${duration} s)`);
  const r = hf(["render", dir, "--output", raw, "--fps", "30", "--quality", "delivery", "--video-frame-format", "png"]);
  if (r.status !== 0 || !existsSync(raw)) fail(`El render de ${variant} falló (código ${r.status}).`);
  step(`${id} · ${variant}: posproducción`);
  const res = finish(raw, join(outDir, `${id}_${variant}.mp4`), duration);
  console.log(`  · ${id}_${variant}.mp4: ${res.mb.toFixed(2)} MB (CRF ${res.crf})`);
}

/* 4 ------------------------------------------------------------ portada */
step(`${id}: portada`);
{
  const { dir } = build(id, "cover");
  const snapDir = join(TMP, `cover-${id}`);
  rmSync(snapDir, { recursive: true, force: true });
  const r = hf(["snapshot", dir, "--at", "1.6", "--no-end", "--output", snapDir], { capture: true });
  const png = existsSync(snapDir) ? readdirSync(snapDir).find((f) => /^frame-.*\.png$/.test(f)) : null;
  if (r.status !== 0 || !png) fail(`No se pudo capturar la portada:\n${r.stdout}${r.stderr}`);
  const s = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", join(snapDir, png), "-vf", "scale=1080:1920:flags=lanczos", join(outDir, `${id}_cover.png`)], { stdio: "inherit" });
  if (s.status !== 0) fail("FFmpeg no pudo escribir la portada.");
}
build(id, "ig"); // el proyecto queda en su variante principal para previsualizar

/* 5 ------------------------------------------------------ copy y revisión */
step(`${id}: copy, fotogramas y control de calidad`);
const c = reel.copy || {};
const igPlan = plan(reel, "ig");
const ttPlan = plan(reel, "tiktok");
const copyMd = [
  `# ${id} · ${reel.title}`,
  "",
  `- Formato: ${reel.format} · ${reel.platform || ""}`,
  `- Pilar: ${reel.pillar || "sin pilar (agregar \"pillar\" en reel.json)"}`,
  `- Duración: Instagram ${igPlan.duration} s · TikTok ${ttPlan.duration} s`,
  `- Palabra clave: **${reel.keyword}** (en pantalla desde el segundo 0.15)`,
  `- Gancho usado: "${reel.hook.text.replace(/\*/g, "")}"`,
  `- Variantes para A/B con Trial Reels: ${(reel.hook.variants || []).filter((v) => v !== reel.hook.text).map((v) => `"${v.replace(/\*/g, "")}"`).join(" · ")}`,
  `- Texto de portada: "${(c.cover || "").replace(/\*/g, "")}"`,
  `- Hora sugerida: ${c.time || "ver calendar.md"}`,
  c.trial ? `- Trial Reel: ${c.trial}` : "",
  "",
  "## Instagram",
  "",
  "```",
  `${c.instagram}`,
  "",
  `${(c.instagramHashtags || []).join(" ")}`,
  "```",
  "",
  "## TikTok",
  "",
  "```",
  `${c.tiktok} ${(c.tiktokHashtags || []).join(" ")}`,
  "```",
  "",
  "## Comentario fijado (TikTok)",
  "",
  "```",
  `${c.pinned}`,
  "```",
  "",
  "## Al publicar",
  "",
  "- Subir `" + `${id}_ig.mp4` + "` a Instagram y `" + `${id}_tiktok.mp4` + "` a TikTok, con `" + `${id}_cover.png` + "` como portada.",
  "- Agregar el sonido en tendencia desde la app (el MP4 va sin música con derechos).",
  "- Compartir en Stories y responder los primeros comentarios en 30-60 minutos.",
  "- Avisar \"Subido " + id + " <plataforma> <enlace>\" para actualizar INDEX.md.",
  "",
].filter((l) => l !== null).join("\n");
writeFileSync(join(outDir, `${id}_copy.md`), copyMd);

contactSheet(join(outDir, `${id}_ig.mp4`), null, join(outDir, `${id}_frames.png`), 300);

const sections = [];
sections.push(["Archivo Instagram", qaVideo(join(outDir, `${id}_ig.mp4`), igPlan.duration, withAudio)]);
sections.push(["Archivo TikTok", qaVideo(join(outDir, `${id}_tiktok.mp4`), ttPlan.duration, withAudio)]);
const compTt = await qaComposition(id, "tiktok");
sections.push(["Composición TikTok", compTt.checks]);
const compIg = await qaComposition(id, "ig");
sections.push(["Composición Instagram", compIg.checks]);
sections.push(["Textos", qaTexts(reel, compIg.data)]);
sections.push(["Copy", qaCopy(reel)]);
const { md, failed } = report(id, sections);
writeFileSync(join(outDir, `${id}_qa.md`), md);
console.log("\n" + md);

/* 6 ---------------------------------------------------------- INDEX.md */
const indexFile = join(OUT, "INDEX.md");
const header = [
  "# Videos producidos",
  "",
  "Una fila por video. Estado: pendiente de subir / subido a IG / subido a TikTok.",
  "Para marcar uno como subido, pide: \"Subido <ID> <plataforma> <enlace>\".",
  "",
  "| ID | Título | Formato | Duración | Estado | Fecha de subida | Enlace |",
  "| --- | --- | --- | --- | --- | --- | --- |",
].join("\n");
let index = existsSync(indexFile) ? readFileSync(indexFile, "utf8") : header + "\n";
const fmt = reel.pillar ? `${reel.format} · ${reel.pillar}` : reel.format;
const row = `| ${id} | ${reel.title} | ${fmt} | IG ${igPlan.duration} s · TikTok ${ttPlan.duration} s | pendiente de subir | — | — |`;
const re = new RegExp(`^\\| ${id} \\|.*$`, "m");
if (re.test(index)) {
  // Conserva estado, fecha y enlace si ya se había subido.
  index = index.replace(re, (old) => {
    const cells = old.split("|").map((x) => x.trim());
    const keep = cells[5] && cells[5] !== "pendiente de subir" ? cells.slice(5, 8) : ["pendiente de subir", "—", "—"];
    return `| ${id} | ${reel.title} | ${fmt} | IG ${igPlan.duration} s · TikTok ${ttPlan.duration} s | ${keep.join(" | ")} |`;
  });
} else {
  index = index.trimEnd() + "\n" + row + "\n";
}
writeFileSync(indexFile, index);

console.log(failed ? `\n✗ ${id}: ${failed} revisión(es) de calidad fallaron (ver out/${id}/${id}_qa.md).` : `\n✓ ${id} listo en out/${id}/`);
process.exit(failed ? 1 : 0);

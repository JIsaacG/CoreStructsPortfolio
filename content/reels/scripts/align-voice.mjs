#!/usr/bin/env node
/**
 * Tiempos por palabra de una voz en off sin servicio de transcripción.
 *
 *   npm run align -- R03 "Texto exacto del guion…"
 *   npm run align -- R03 --text-file guion.txt
 *   npm run align -- R00 --check            # compara contra voz/R00.words.json
 *
 * Se conoce el texto exacto (es el guion), así que solo falta saber cuándo
 * suena cada palabra. FFmpeg (silencedetect) marca los tramos con voz; las
 * palabras se reparten por sílabas sobre el tiempo hablado, y una palabra que
 * cae encima de una pausa se pasa al tramo siguiente. Escribe
 * voz/<ID>.words.json con el mismo formato que la transcripción de ElevenLabs.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REELS } from "./lib/paths.mjs";

const r2 = (n) => Math.round(n * 100) / 100;

function duration(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" });
  return Number(r.stdout.trim());
}

/** Tramos con voz [inicio, fin], a partir de los silencios de FFmpeg. */
export function speechSegments(file, { noise = -38, minSilence = 0.15 } = {}) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-af", `silencedetect=n=${noise}dB:d=${minSilence}`, "-f", "null", "-"], { encoding: "utf8" });
  const total = duration(file);
  const starts = [...r.stderr.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...r.stderr.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  const segs = [];
  let t = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] > t + 0.02) segs.push([t, starts[i]]);
    t = ends[i] ?? total;
  }
  if (t < total - 0.02) segs.push([t, total]);
  return { segs, total };
}

/** Peso de una palabra: sílabas aproximadas (grupos de vocales) + algo por consonantes. */
function weight(word) {
  const w = word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const syl = (w.match(/[aeiouáéíóúü]+/g) || []).length || 1;
  return syl + w.length * 0.08;
}

/**
 * Cada tramo con voz recibe un grupo de palabras seguidas. Programación
 * dinámica: el corte entre tramos cae en el límite entre palabras que mejor
 * cuadra la duración del tramo con las sílabas que contiene, y se prefieren
 * los límites con puntuación (ahí es donde la voz hace pausa).
 */
export function align(text, segs) {
  const words = text.split(/\s+/).filter(Boolean);
  const N = words.length;
  const K = segs.length;
  if (K > N) throw new Error(`Hay ${K} tramos con voz y solo ${N} palabras: sube minSilence.`);
  const wts = words.map(weight);
  const cum = [0];
  for (const w of wts) cum.push(cum[cum.length - 1] + w);
  const speech = segs.reduce((a, [s, e]) => a + (e - s), 0);
  const rate = speech / cum[N];
  const punct = (i) => /[.,;:?!…"”»)]$/.test(words[i]);

  const cost = (k, i, j) => {
    const dur = segs[k][1] - segs[k][0];
    const fit = Math.abs(dur - rate * (cum[j] - cum[i])) / Math.max(dur, 0.4);
    const brk = j < N && !punct(j - 1) ? 0.8 : 0;
    return fit + brk;
  };
  const INF = Infinity;
  const dp = Array.from({ length: K + 1 }, () => new Array(N + 1).fill(INF));
  const from = Array.from({ length: K + 1 }, () => new Array(N + 1).fill(-1));
  dp[0][0] = 0;
  for (let k = 1; k <= K; k++) {
    for (let j = k; j <= N - (K - k); j++) {
      for (let i = k - 1; i < j; i++) {
        if (dp[k - 1][i] === INF) continue;
        const c = dp[k - 1][i] + cost(k - 1, i, j);
        if (c < dp[k][j]) { dp[k][j] = c; from[k][j] = i; }
      }
    }
  }
  const bounds = [N];
  for (let k = K, j = N; k > 0; k--) { j = from[k][j]; bounds.unshift(j); }

  const out = [];
  for (let k = 0; k < K; k++) {
    const [s, e] = segs[k];
    const i0 = bounds[k], i1 = bounds[k + 1];
    const span = cum[i1] - cum[i0];
    let t = s;
    for (let i = i0; i < i1; i++) {
      const d = (wts[i] / span) * (e - s);
      out.push({ text: words[i], start: r2(t), end: r2(t + d) });
      t += d;
    }
  }
  return out;
}

function main() {
  const [id, ...rest] = process.argv.slice(2);
  if (!id) {
    console.log('Uso: npm run align -- <ID> "texto" | --text-file archivo | --check');
    process.exit(1);
  }
  const audio = join(REELS, "voz", `${id}.mp3`);
  if (!existsSync(audio)) throw new Error(`Falta ${audio}`);
  const { segs, total } = speechSegments(audio);
  const outFile = join(REELS, "voz", `${id}.words.json`);

  if (rest[0] === "--check") {
    const ref = JSON.parse(readFileSync(outFile, "utf8"));
    const got = align(ref.words.map((w) => w.text).join(" "), segs);
    const errs = got.map((w, i) => Math.abs(w.start - ref.words[i].start));
    const mean = errs.reduce((a, b) => a + b, 0) / errs.length;
    console.log(`${id}: error medio ${mean.toFixed(3)} s, máximo ${Math.max(...errs).toFixed(3)} s en ${errs.length} palabras`);
    return;
  }

  const text = rest[0] === "--text-file" ? readFileSync(rest[1], "utf8") : rest.join(" ");
  if (!text.trim()) throw new Error("Falta el texto exacto de la voz.");
  const words = align(text.trim(), segs);
  writeFileSync(outFile, JSON.stringify({
    source: "Tiempos estimados con scripts/align-voice.mjs (silencios de FFmpeg + reparto por sílabas)",
    duration: r2(total),
    words,
  }, null, 1) + "\n");
  console.log(`${outFile}: ${words.length} palabras en ${segs.length} tramos con voz, ${r2(total)} s`);
}

main();

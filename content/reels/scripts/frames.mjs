#!/usr/bin/env node
/**
 * Hoja de fotogramas para revisar un video a ojo.
 *
 *   npm run frames -- out/R00/R00_ig.mp4                 # 0, 1.5, 3, mitad y final
 *   npm run frames -- out/R00/R00_ig.mp4 0,2,4 hoja.png  # tiempos concretos
 *
 * Escribe un PNG con los fotogramas lado a lado (cada uno a 360 px de ancho)
 * y el tiempo impreso debajo. Por defecto lo deja junto al video.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { TMP } from "./lib/paths.mjs";

export function probeDuration(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" });
  return Number(r.stdout.trim());
}

export function contactSheet(video, times, out, width = 360) {
  const dur = probeDuration(video);
  const ts = times || [0, 1.5, 3, dur / 2, Math.max(0, dur - 0.75)];
  const dir = join(TMP, "sheet-" + basename(video, ".mp4"));
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const inputs = [];
  ts.forEach((t, i) => {
    const png = join(dir, `${i}.png`);
    const label = `${t.toFixed(2)} s`;
    // drawtext necesita una fuente explícita en Windows (no hay fontconfig).
    const font = process.platform === "win32" ? ":fontfile='C\\:/Windows/Fonts/arial.ttf'" : "";
    const grab = (vf) => spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(t), "-i", video, "-frames:v", "1", "-vf", vf, png]);
    let r = grab(`scale=${width}:-2,pad=iw+12:ih+44:6:0:white,drawtext=text='${label}':x=10:y=h-34:fontsize=24:fontcolor=black${font}`);
    if (r.status !== 0) r = grab(`scale=${width}:-2,pad=iw+12:ih+12:6:0:white`);
    if (r.status === 0) inputs.push(png);
    else console.warn(String(r.stderr));
  });
  const args = ["-y", "-loglevel", "error"];
  inputs.forEach((p) => args.push("-i", p));
  args.push("-filter_complex", inputs.length > 1 ? `hstack=inputs=${inputs.length}` : "null", out);
  const r = spawnSync("ffmpeg", args, { stdio: "inherit" });
  rmSync(dir, { recursive: true, force: true });
  if (r.status !== 0) throw new Error("ffmpeg no pudo armar la hoja de fotogramas");
  return out;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"))) {
  const [video, times, out] = process.argv.slice(2);
  if (!video) {
    console.log("Uso: npm run frames -- <video.mp4> [t1,t2,…] [salida.png]");
    process.exit(1);
  }
  const ts = times ? times.split(",").map(Number) : null;
  const target = out || join(dirname(video), basename(video, ".mp4") + "_frames.png");
  console.log(contactSheet(video, ts, target));
}

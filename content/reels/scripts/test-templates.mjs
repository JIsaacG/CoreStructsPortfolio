#!/usr/bin/env node
/**
 * Prueba las 5 plantillas: arma cada reel.example.json como un proyecto
 * temporal (videos/_prueba-<formato>/), corre `hyperframes check` y saca
 * fotogramas para mirarlos. Necesita los clips de las demos que usa cada
 * ejemplo (npm run record -- aurea velora flujo rumbo cede verbena).
 *
 *   npm run test:templates            # A-E
 *   npm run test:templates -- C D     # solo esas
 *   npm run test:templates -- --keep  # no borra los proyectos temporales
 */
import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { build } from "./build.mjs";
import { check, hf } from "./lib/hf.mjs";
import { FORMATS, TEMPLATES, TMP, VIDEOS } from "./lib/paths.mjs";

const args = process.argv.slice(2);
const keep = args.includes("--keep");
const wanted = args.filter((a) => !a.startsWith("--"));
const formats = wanted.length ? wanted : Object.keys(FORMATS);
let failed = 0;
for (const f of formats) {
  const id = `_prueba-${f}`;
  const dir = join(VIDEOS, id);
  mkdirSync(dir, { recursive: true });
  copyFileSync(join(TEMPLATES, FORMATS[f], "reel.example.json"), join(dir, "reel.json"));
  try {
    const { duration, data } = build(id, "ig");
    const c = check(dir);
    const ok = c.ok && c.findings.length === 0;
    if (!ok) failed++;
    console.log(`${ok ? "✓" : "✗"} ${f} · ${FORMATS[f]} · ${duration} s · check ${ok ? "limpio" : "con hallazgos"}`);
    if (!ok) console.log("  " + (c.findings.join("\n  ") || c.raw));
    const times = [0.6, ...data.scenes.map((s) => +((s.start + s.end) / 2).toFixed(2)), data.endcard.start + 0.9];
    const out = join(TMP, "plantillas", f);
    rmSync(out, { recursive: true, force: true });
    hf(["snapshot", dir, "--at", times.join(","), "--no-end", "--output", out], { capture: true });
    console.log(`  fotogramas: ${out}`);
  } catch (e) {
    failed++;
    console.log(`✗ ${f} · ${e.message}`);
  }
  if (!keep) rmSync(dir, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);

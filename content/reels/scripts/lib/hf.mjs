/**
 * Llama al CLI de HyperFrames instalado en content/reels/node_modules
 * (versión fija en package.json), sin pasar por la shell.
 */
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { REELS } from "./paths.mjs";

const BIN = join(REELS, "node_modules", "hyperframes", "bin", "hyperframes.mjs");

export function hf(args, { capture = false } = {}) {
  const r = spawnSync(process.execPath, [BIN, ...args], {
    cwd: REELS,
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
    env: { ...process.env, HYPERFRAMES_SKIP_SKILLS: "1", NO_COLOR: "1" },
    maxBuffer: 64 * 1024 * 1024,
  });
  return { status: r.status, stdout: r.stdout || "", stderr: r.stderr || "" };
}

/** `hyperframes check --json`: devuelve { ok, findings, raw }. */
export function check(dir) {
  const r = hf(["check", dir, "--json"], { capture: true });
  const text = r.stdout.slice(r.stdout.indexOf("{"));
  let json = null;
  try { json = JSON.parse(text); } catch { /* salida inesperada */ }
  const findings = [];
  if (json) {
    const walk = (node, path) => {
      if (Array.isArray(node)) node.forEach((n) => walk(n, path));
      else if (node && typeof node === "object") {
        if ((node.code || node.rule) && (node.severity || node.level) && node.message) {
          findings.push(`${path}: ${node.severity || node.level} ${node.code || node.rule} — ${node.message}`);
        }
        for (const [k, v] of Object.entries(node)) if (typeof v === "object") walk(v, path ? path : k);
      }
    };
    for (const key of ["lint", "runtime", "layout", "motion", "contrast"]) walk(json[key], key);
  }
  return { ok: Boolean(json?.ok) && r.status === 0, findings, raw: json ? null : r.stdout + r.stderr };
}

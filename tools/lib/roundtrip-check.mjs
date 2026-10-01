/**
 * Safety net for the walker in `html.mjs`: run every generated page through it
 * with no handlers attached and assert the output is byte-identical.
 *
 * The translator rewrites 143 files that contain inline SVG, JSON-LD and data
 * URIs. Nothing else in the build can tell us the parser stayed faithful, so
 * this does, and it runs before the mirror is written.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { transform } from "./html.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Every generated page in the Spanish tree. */
export function pages(root = ROOT) {
  const found = [];
  // `KathMolina.html` es una página personal y oculta: ni se traduce ni lleva
  // selector de idioma, así que se queda fuera del espejo `en/`.
  const skip = new Set([".git", "node_modules", "assets", "dist", "src", "tools", "en", "KathMolina.html"]);

  const walkDir = (dir) => {
    for (const entry of readdirSync(dir)) {
      if (skip.has(entry)) continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walkDir(full);
      else if (entry.endsWith(".html")) found.push(relative(root, full).split("\\").join("/"));
    }
  };

  walkDir(root);
  return found.sort();
}

export function roundtrip(root = ROOT) {
  const failures = [];
  for (const page of pages(root)) {
    const source = readFileSync(join(root, page), "utf8");
    const out = transform(source, {});
    if (out !== source) {
      let at = 0;
      while (at < source.length && source[at] === out[at]) at++;
      failures.push({ page, at, expected: source.slice(at, at + 60), got: out.slice(at, at + 60) });
    }
  }
  return failures;
}

if (import.meta.url === `file:///${process.argv[1].split("\\").join("/")}`) {
  const failures = roundtrip();
  const total = pages().length;
  if (!failures.length) {
    console.log(`html.mjs round-trips all ${total} pages byte for byte.`);
  } else {
    for (const f of failures) {
      console.error(`\n${f.page} diverges at ${f.at}`);
      console.error(`  expected: ${JSON.stringify(f.expected)}`);
      console.error(`  got:      ${JSON.stringify(f.got)}`);
    }
    console.error(`\n${failures.length} of ${total} pages did not round-trip.`);
    process.exitCode = 1;
  }
}

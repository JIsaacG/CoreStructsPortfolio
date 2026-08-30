/**
 * Bundles each stylesheet entry point into `dist/`.
 *
 * Native `@import` would make the browser discover each stylesheet only after
 * fetching the one before it, so the modular source is flattened into a single
 * render-blocking file. No dependencies: the whole job is resolving imports,
 * rewriting relative `url()`s to the output directory, and a string-aware
 * whitespace pass.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* The portfolio and the demo sites share tokens, reset and reveal system but
   ship separately: a demo must not pay for the starfield, and index.html must
   not pay for the bottle. */
const BUNDLES = [
  { entry: join(ROOT, "src", "styles", "main.css"), output: join(ROOT, "dist", "corestruct.css") },
  { entry: join(ROOT, "src", "styles", "demo.css"), output: join(ROOT, "dist", "demo.css") },
];

const IMPORT = /@import\s+(?:url\()?["']([^"']+)["']\)?\s*;/g;
/* Quoted forms are matched first and greedily to the closing quote: a data URI
   contains both `'` and `)`, so a looser pattern would stop inside it and then
   mangle the `url(#…)` references in the embedded SVG. */
const URL_REF = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^"'()\s]*))\s*\)/g;

/** Rewrite a relative `url()` so it still resolves from the bundle's location. */
function rewriteUrls(css, fromDir, toDir) {
  return css.replace(URL_REF, (match, double, single, bare) => {
    const target = double ?? single ?? bare;
    if (!target || /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(target)) return match;
    const rebased = relative(toDir, resolve(fromDir, target)).split("\\").join(posix.sep);
    return `url("${rebased}")`;
  });
}

/** Depth-first inline of `@import` statements. */
function inline(file, outDir, seen = new Set()) {
  const path = resolve(file);
  if (seen.has(path)) return "";
  seen.add(path);

  const dir = dirname(path);
  const source = readFileSync(path, "utf8");
  let out = "";
  let cursor = 0;

  for (const match of source.matchAll(IMPORT)) {
    out += rewriteUrls(source.slice(cursor, match.index), dir, outDir);
    out += inline(join(dir, match[1]), outDir, seen);
    cursor = match.index + match[0].length;
  }
  out += rewriteUrls(source.slice(cursor), dir, outDir);
  return out;
}

/**
 * Whitespace-only minification. It walks the source tracking string and
 * comment state, so quoted data URIs and `content` values are never touched.
 */
function minify(css) {
  let out = "";
  let i = 0;

  while (i < css.length) {
    const char = css[i];

    if (char === '"' || char === "'") {
      const quote = char;
      let literal = char;
      i++;
      while (i < css.length) {
        literal += css[i];
        if (css[i] === "\\") { literal += css[i + 1] ?? ""; i += 2; continue; }
        if (css[i] === quote) { i++; break; }
        i++;
      }
      out += literal;
      continue;
    }

    if (char === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      i = end === -1 ? css.length : end + 2;
      continue;
    }

    if (/\s/.test(char)) {
      while (i < css.length && /\s/.test(css[i])) i++;
      const previous = out.at(-1) ?? "";
      const next = css[i] ?? "";
      // Whitespace is only dropped next to structural punctuation, and never
      // around an operator: `calc()` and `clamp()` REQUIRE spaces around + and -,
      // and ` > + ~ ` are combinators when they appear in a selector.
      const structural = "{};,";
      const redundant =
        !out ||
        !next ||
        structural.includes(previous) ||
        previous === ":" ||
        structural.includes(next);
      if (!redundant) out += " ";
      continue;
    }

    if (char === ";") {
      // Trailing semicolons before a closing brace are redundant.
      let j = i + 1;
      while (j < css.length && /\s/.test(css[j])) j++;
      if (css[j] === "}") { i = j; continue; }
    }

    out += char;
    i++;
  }
  return out.trim();
}
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

for (const { entry, output } of BUNDLES) {
  const bundled = inline(entry, dirname(output));
  const minified = minify(bundled);

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${minified}
`);

  console.log(
    `${relative(ROOT, output).split("\\").join(posix.sep)}  ${kb(Buffer.byteLength(minified))}  ` +
      `(from ${kb(Buffer.byteLength(bundled))} of source)`,
  );
}

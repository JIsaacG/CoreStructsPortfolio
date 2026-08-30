/**
 * Pre-flight checks for the built site: `npm run check`.
 *
 * Catches the failures that are invisible until someone loads the page — a
 * renamed asset, an anchor pointing at an id that no longer exists, a typo in a
 * custom property, an image without dimensions. Exits non-zero on any error.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGE = join(ROOT, "index.html");
const BUNDLE = join(ROOT, "dist", "corestruct.css");

const errors = [];
const warnings = [];
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);

const html = readFileSync(PAGE, "utf8");

/* --------------------------------------------------------- build regions */

for (const [, name] of html.matchAll(/<!--\s*build:([\w-]+)\s*-->\s*<!--\s*\/build:\1\s*-->/g)) {
  fail(`build region "${name}" is empty — run \`npm run build:content\``);
}

/* ------------------------------------------------------------- resources */

const localRefs = new Set();
for (const [, attr, value] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value) || value.startsWith("#")) continue;
  localRefs.add(value.split(/[?#]/)[0]);
  void attr;
}
for (const ref of localRefs) {
  if (!existsSync(join(ROOT, ref))) fail(`missing file referenced from index.html: ${ref}`);
}

/* -------------------------------------------------------------- anchors */

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
for (const [, href] of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(href)) fail(`anchor #${href} has no matching id`);
}
for (const [, controls] of html.matchAll(/aria-controls="([^"]+)"/g)) {
  if (!ids.has(controls)) fail(`aria-controls="${controls}" has no matching id`);
}
for (const [, labelled] of html.matchAll(/aria-labelledby="([^"]+)"/g)) {
  if (!ids.has(labelled)) fail(`aria-labelledby="${labelled}" has no matching id`);
}

/* ------------------------------------------------------------- headings */

const headings = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
const h1Count = headings.filter((level) => level === 1).length;
if (h1Count !== 1) fail(`expected exactly one <h1>, found ${h1Count}`);

headings.reduce((previous, level) => {
  if (level > previous + 1) fail(`heading level jumps from h${previous} to h${level}`);
  return level;
}, headings[0] ?? 1);

/* --------------------------------------------------------------- images */

for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
  if (!/\balt="/.test(tag)) fail(`<img> without alt: ${tag.slice(0, 80)}`);
  if (!/\bwidth="/.test(tag) || !/\bheight="/.test(tag)) {
    warn(`<img> without intrinsic width/height (risks layout shift): ${tag.slice(0, 80)}`);
  }
}

/* ------------------------------------------------------- document basics */

if (!/<html lang="[a-z-]+"/i.test(html)) fail("<html> is missing a lang attribute");

// Attributes may be split across lines by the formatter, so match inside the tag.
const description = html
  .match(/<meta\b[^>]*\bname="description"[^>]*>/i)?.[0]
  ?.match(/content="([^"]*)"/i)?.[1];
if (!description || description.length < 50) fail("meta description is missing or too short");
if (!/<title>[^<]{10,70}<\/title>/.test(html)) warn("<title> is missing or an unusual length");

/* ------------------------------------------------- CSS custom properties */

function checkBundle(bundle) {
  const label = bundle.replace(ROOT, ".").split("\\").join("/");
  if (!existsSync(bundle)) {
    fail(`${label} is missing — run \`npm run build:css\``);
    return;
  }

  const css = readFileSync(bundle, "utf8");
  const defined = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
  // A var() with a fallback is deliberate; only bare references must resolve.
  for (const [, name] of css.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)) {
    if (!defined.has(name)) fail(`CSS references undefined custom property ${name}`);
  }
  for (const [, url] of css.matchAll(/url\("(?!data:)([^"]+)"\)/g)) {
    if (!existsSync(resolve(dirname(bundle), url))) fail(`missing asset referenced from CSS: ${url}`);
  }

  // calc()/clamp() silently invalidate the whole declaration when the spaces
  // around + and - are lost — exactly what an over-eager minifier does. Only the
  // insides of the math functions are inspected, so `U+2000` and `svg+xml` are
  // not mistaken for arithmetic.
  for (const fn of ["calc", "clamp", "min", "max"]) {
    const opener = new RegExp(`\\b${fn}\\(`, "g");
    for (const match of css.matchAll(opener)) {
      let depth = 0;
      let end = match.index + match[0].length - 1;
      do {
        if (css[end] === "(") depth++;
        else if (css[end] === ")") depth--;
        end++;
      } while (depth > 0 && end < css.length);

      const body = css.slice(match.index + match[0].length, end - 1);
      // `+` is only ever arithmetic here, so any unspaced one is a bug. `-` also
      // appears inside identifiers (`--brand-primary`, `layer-header`), so it is
      // only flagged when a number, percentage or `)` sits directly before it.
      const brokenPlus = /[\w%)]\+|\+[\w.(]/.test(body);
      const brokenMinus = /[\d%)]-/.test(body);
      if (brokenPlus || brokenMinus) {
        fail(`${fn}() operator without surrounding spaces: ${fn}(${body}) — the declaration will be dropped`);
      }
    }
  }
}

checkBundle(BUNDLE);
checkBundle(join(ROOT, "dist", "demo.css"));

/* ------------------------------------------------------------ JS imports */

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

for (const file of walk(join(ROOT, "src")).filter((f) => f.endsWith(".js"))) {
  const source = readFileSync(file, "utf8");
  for (const [, specifier] of source.matchAll(/from\s+"(\.[^"]+)"/g)) {
    if (!existsSync(resolve(dirname(file), specifier))) {
      fail(`${file.replace(ROOT, ".")} imports missing module ${specifier}`);
    }
  }
}

/* ---------------------------------------------------------------- report */

for (const message of warnings) console.warn(`warn   ${message}`);
for (const message of errors) console.error(`error  ${message}`);

if (errors.length) {
  console.error(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`checks passed (${warnings.length} warning(s))`);

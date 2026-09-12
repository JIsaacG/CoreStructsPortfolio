/**
 * Stamps every stylesheet reference with a hash of the file it points at:
 * `npm run build:stamp`. Runs after the HTML exists and before the mirror is
 * made, so `en/` inherits the stamps rather than needing its own pass.
 *
 *   dist/corestruct.css  ->  dist/corestruct.css?v=8f2a1c40
 *
 * The problem it solves is one the caching rules in `.htaccess` create. A
 * stylesheet is worth caching for a long time — it is 57 KB, it is on every
 * page, and most of this site's traffic is on mobile data. But `corestruct.css`
 * is called `corestruct.css` after every build, so a browser holding last
 * week's copy has no way to know the file changed: it keeps the old one until
 * the cache expires, and renders new HTML against old rules. Classes added in
 * that build simply do nothing, which looks exactly like a broken layout.
 *
 * A query string fixes it because caches key on the whole URL. Change the
 * content, change the hash, change the URL, and every browser fetches it —
 * including the ones already holding a stale copy, which is the part a change
 * to the caching headers alone cannot do. Nothing has to expire first.
 *
 * Only stylesheets are stamped. The scripts are ES modules that import each
 * other, so stamping the entry point would leave every module it pulls in still
 * cached under its old URL — a half-measure that reads as a fix. They are kept
 * out of the long-cache rules in `.htaccess` instead, and revalidate.
 *
 * Idempotent: an existing `?v=` is replaced rather than appended to, so running
 * the build twice produces the same file both times.
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { pages } from "./lib/roundtrip-check.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Eight hex characters of SHA-1: short enough to read, long enough to not collide. */
const hashes = new Map();
function hashOf(file) {
  if (!hashes.has(file)) {
    hashes.set(file, createHash("sha1").update(readFileSync(file)).digest("hex").slice(0, 8));
  }
  return hashes.get(file);
}

/* `href` on a `rel="stylesheet"` link, in either attribute order, with or
   without a stamp already on it. */
const LINK = /<link\b[^>]*\brel="stylesheet"[^>]*>/gi;
const HREF = /(\bhref=")([^"?#]+\.css)(?:\?[^"#]*)?((?:#[^"]*)?")/i;

const missing = [];
let stamped = 0;
let touched = 0;

for (const page of pages(ROOT)) {
  const file = join(ROOT, ...page.split("/"));
  const html = readFileSync(file, "utf8");

  const next = html.replace(LINK, (tag) =>
    tag.replace(HREF, (whole, open, url, close) => {
      /* Absolute and protocol-relative URLs point at something this build does
         not produce, so there is nothing to hash. */
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) return whole;

      const target = resolve(dirname(file), url);
      if (!existsSync(target)) {
        missing.push(`${page} -> ${url}`);
        return whole;
      }

      stamped += 1;
      return `${open}${url}?v=${hashOf(target)}${close}`;
    }),
  );

  if (next !== html) {
    writeFileSync(file, next);
    touched += 1;
  }
}

if (missing.length) {
  console.error(`\n  ${missing.length} stylesheet(s) referenced but not on disk:`);
  for (const entry of missing) console.error(`    ${entry}`);
  console.error("");
  process.exit(1);
}

console.log(
  `  ${stamped} hoja(s) de estilo versionada(s) · ${touched} página(s) reescrita(s)\n` +
    `  ${[...hashes].map(([f, h]) => `${f.split(/[\\/]/).pop()}=${h}`).join("  ")}`,
);

/**
 * Rewrites every internal link to its clean form: `npm run build:urls`.
 *
 *   demos/aurea/index.html      ->  demos/aurea/
 *   demos/verbena.html          ->  demos/verbena
 *   ../index.html#proyectos     ->  ../#proyectos
 *
 * The `.htaccess` does the other half: it maps a clean URL back to the file on
 * disk, and 301s the `.html` form to the clean one. Both halves are needed and
 * neither is optional. Rewriting alone would leave the old URLs answering 200
 * beside the new ones — the same page at two addresses, which is the duplicate
 * this was meant to remove. Redirecting alone would leave every internal link
 * pointing at a redirect, spending a round trip on each click and handing a
 * crawler a hop it has to follow before it reaches anything.
 *
 * WHY THIS IS A PASS AND NOT A CHANGE TO THE FIFTEEN BUILDERS
 *
 * The English tree is produced by matching Spanish markup against a dictionary
 * whose keys are literal HTML — `<a href="../expedientes.html">Expedientes</a>`
 * is a key in `src/i18n/en/rumbo.js`. Emitting clean links from the builders
 * would change that markup and miss every key that contains a link, silently
 * shipping untranslated strings. Running after `build:i18n` means the dictionary
 * still sees the markup it was written against, and the link shortening happens
 * to both languages at once, on the finished pages.
 *
 * It runs before `build:seo`, which reads canonicals back off disk: the sitemap
 * has to be built from the URLs that actually ship.
 *
 * SAFE BECAUSE THE DEPTH DOES NOT MOVE
 *
 * Every relative link on these pages keeps resolving to what it did, because a
 * clean URL sits at the same depth as the file behind it. `/a/b.html` and
 * `/a/b` both resolve `../c` against `/a/`; `/a/b/index.html` and `/a/b/` both
 * resolve it against `/a/b/`. That is the whole reason the two URL shapes are
 * interchangeable, and why 32,000 links can be shortened without recomputing a
 * single one of them.
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { transform } from "./lib/html.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Attributes that carry a URL to a page of this site. */
const URL_ATTRS = new Set(["href", "src", "action", "formaction", "data-href"]);

/** Schemes that are not a path, and the bare fragment, which is already clean. */
const NOT_A_PATH = /^(?:[a-z][a-z0-9+.-]*:(?!\/\/)|#)/i;

/**
 * `demos/aurea/index.html#x` -> `demos/aurea/#x`, `buscar.html` -> `buscar`.
 *
 * Query and fragment ride along untouched. An `index.html` becomes its own
 * directory rather than losing a segment, so the link still points at a
 * directory URL the server can answer with `DirectoryIndex`.
 *
 * A bare `index.html` — a nav link to the home page of a demo, written from a
 * sibling page — becomes `./` and not the empty string: an empty `href` is a
 * link to the current page, which is the one thing it must not mean.
 */
export function cleanUrl(url) {
  if (!url || NOT_A_PATH.test(url)) return url;

  const [, path, suffix = ""] = url.match(/^([^?#]*)([?#][\s\S]*)?$/);
  if (!path.endsWith(".html")) return url;

  if (/(^|\/)index\.html$/.test(path)) {
    return (path.slice(0, -"index.html".length) || "./") + suffix;
  }
  return path.slice(0, -".html".length) + suffix;
}

/**
 * The files a clean URL could be asking for, in the order a server tries them.
 *
 * This is `cleanUrl` read backwards, and it is exported so that the two things
 * which have to resolve a link — `check.mjs`, which asserts every link points
 * at something, and `serve.mjs`, which answers them locally — agree with the
 * `.htaccess` instead of each keeping their own guess.
 *
 * The order is the one the rewrite rules use: a real file wins, then `x.html`,
 * then the directory `x/`. A file that is already on disk is never shadowed by
 * a rewrite — that is what `!-f` guarantees over there and what putting
 * `target` first guarantees here. A trailing slash means a directory and
 * nothing else, because that is all `DirectoryIndex` will answer.
 *
 * @param {string} target  a URL path with query and fragment already stripped
 * @returns {string[]} paths relative to the same base as `target`
 */
export function filesFor(target) {
  if (!target || target.endsWith("/")) return [`${target}index.html`];
  return [target, `${target}.html`, `${target}/index.html`];
}

/** Every generated page, both languages. */
function allPages(root) {
  const found = [];
  const skip = new Set([".git", "node_modules", "assets", "dist", "src", "tools"]);

  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      if (skip.has(entry)) continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".html")) found.push(relative(root, full).split("\\").join("/"));
    }
  };

  walk(root);
  return found.sort();
}

/* ------------------------------------------------------------------- rewrite */

/** Shorten every link on one page. Returns the new HTML and how many changed. */
export function cleanPage(source) {
  let links = 0;

  const html = transform(source, {
    onAttr(value, { name, element, attrs }) {
      /* `og:url` is the only URL this site keeps in a `content` attribute, and
         it has to agree with the canonical sitting two lines above it. */
      const isOgUrl = name === "content" && element === "meta" && attrs.property === "og:url";
      if (!URL_ATTRS.has(name) && !isOgUrl) return undefined;

      const cleaned = cleanUrl(value);
      if (cleaned === value) return undefined;
      links++;
      return cleaned;
    },
  });

  return { html, links };
}

/* Guarded, so `check.mjs` and `serve.mjs` can import `filesFor` without a
   stray import rewriting 292 pages as a side effect. */
if (import.meta.url === `file:///${process.argv[1].split("\\").join("/")}`) {
  let changedFiles = 0;
  let changedLinks = 0;

  for (const page of allPages(ROOT)) {
    const file = join(ROOT, ...page.split("/"));
    const source = readFileSync(file, "utf8");
    const { html, links } = cleanPage(source);
    if (html === source) continue;
    writeFileSync(file, html);
    changedFiles++;
    changedLinks += links;
  }

  console.log(
    changedFiles
      ? `  clean URLs   ${changedLinks} link(s) shortened across ${changedFiles} page(s)`
      : `  clean URLs   every link already clean`,
  );
}

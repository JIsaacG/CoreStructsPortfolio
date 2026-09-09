/**
 * Writes `sitemap.xml` and `robots.txt` from what the built pages actually say:
 * `npm run build:seo`. It runs last, after the mirror exists.
 *
 * The rule it enforces is that one fact has one home. A page decides whether it
 * is indexable, in its own `<meta name="robots">`; this tool reads that decision
 * back off disk and reports it. Nothing here carries a second list of URLs that
 * could drift out of step with the tree — add a page, or flip a `noindex`, and
 * the sitemap follows on the next build without anyone editing it.
 *
 * That matters here more than it would elsewhere, because 284 of this site's
 * 286 pages are deliberately `noindex`: the demos are invented institutions —
 * a university, a ministry, an engineering firm — and a demonstration of a
 * school must never reach a search result as a real one. Only the two home
 * pages sell anything, so only they are listed.
 *
 * The sitemap is one file covering both languages, with each URL naming the
 * whole language set through `xhtml:link`. Two sitemaps listing one language
 * each cannot express that pairing, which is why the mirror no longer gets a
 * derived copy of its own (see `build-i18n.mjs`).
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { site } from "../src/data/site.js";
import { pages } from "./lib/roundtrip-check.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = site.url.replace(/\/+$/, "");
const MIRROR = "en";

const errors = [];
const fail = (message) => errors.push(message);

/* ------------------------------------------------------------------ reading */

/** `index.html` -> `/`, `demos/aurea/index.html` -> `/demos/aurea/`. */
const urlFor = (page) => `${ORIGIN}/${page.replace(/(^|\/)index\.html$/, "$1")}`;

const metaRobots = (html) =>
  html.match(/<meta\b[^>]*\bname="robots"[^>]*\bcontent="([^"]*)"/i)?.[1] ?? "";

/**
 * Indexable means the page does not say otherwise. A page with no `robots` meta
 * at all is indexable, which is how HTML works and so how this reads it.
 */
const isIndexable = (html) => !/\bnoindex\b/i.test(metaRobots(html));

const canonicalOf = (html) => html.match(/<link\b[^>]*\brel="canonical"[^>]*\bhref="([^"]+)"/i)?.[1];

/**
 * The date the file's content last changed, not the date it was last written.
 *
 * `mtime` is useless here: `build-content.mjs` rewrites `index.html` on every
 * build, so an mtime-based `lastmod` would announce a change to Google every
 * time anyone ran `npm run build`, and a signal that fires constantly is one
 * Google learns to ignore. The last commit to touch the file is the honest
 * answer, and it is stable between content changes.
 */
function lastModified(page) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", page], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {
    /* No git, or a file git has never seen: fall through to today. */
  }
  return new Date().toISOString().slice(0, 10);
}

/* ------------------------------------------------------- the indexable pages */

/**
 * Every page, Spanish and mirrored, paired with its counterpart.
 *
 * `pages()` skips `en/`, so the mirror is derived from the same list rather
 * than walked separately — which also means a mirrored page that failed to
 * build simply has no counterpart, instead of silently pairing with nothing.
 */
const set = [];
for (const page of pages(ROOT)) {
  const mirrored = `${MIRROR}/${page}`;
  const versions = [{ lang: "es", page, xDefault: true }];
  if (existsSync(join(ROOT, ...mirrored.split("/")))) {
    versions.push({ lang: "en", page: mirrored, xDefault: false });
  }

  for (const version of versions) {
    const html = readFileSync(join(ROOT, ...version.page.split("/")), "utf8");
    version.indexable = isIndexable(html);
    version.canonical = canonicalOf(html);
    version.url = urlFor(version.page);
  }

  /* A page and its translation are one decision. If they disagree, one language
     is being indexed while the other is hidden, and the hreflang pair they both
     declare points at a page Google was told to drop — so this is an error, not
     something to resolve by picking a side. */
  const indexable = versions.filter((v) => v.indexable);
  if (indexable.length && indexable.length !== versions.length) {
    fail(
      `${page}: the Spanish and English versions disagree on indexability ` +
        `(${versions.map((v) => `${v.lang}=${v.indexable ? "index" : "noindex"}`).join(", ")}). ` +
        `An hreflang pair where one side is noindex points Google at a dead end.`,
    );
    continue;
  }
  if (!indexable.length) continue;

  for (const version of versions) {
    /* The sitemap says "this URL is canonical". The page has to agree, or the
       two are arguing and Google settles it by trusting the page. */
    if (!version.canonical) {
      fail(`${version.page}: indexable but has no <link rel="canonical">`);
    } else if (version.canonical.replace(/\/+$/, "/") !== version.url.replace(/\/+$/, "/")) {
      fail(
        `${version.page}: canonical is ${version.canonical}, but the sitemap ` +
          `would list ${version.url}. A sitemap URL that is not self-canonical is dropped.`,
      );
    }
  }

  set.push(versions);
}

/* -------------------------------------------------------------- the sitemap */

/**
 * Every URL in a language set lists the complete set, itself included — that is
 * the part of the hreflang spec people leave out, and a set where the return
 * links are not reciprocal is discarded whole rather than partly honoured.
 */
const alternatesFor = (versions) => {
  const links = versions.map(
    (v) => `    <xhtml:link rel="alternate" hreflang="${v.lang}" href="${v.url}" />`,
  );
  const fallback = versions.find((v) => v.xDefault);
  if (fallback) {
    links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${fallback.url}" />`);
  }
  return links;
};

/* `changefreq` and `priority` are left out on purpose: Google has said it reads
   neither, and a field nobody reads is a field that can only be wrong. */
const entries = set.flatMap((versions) =>
  versions.map((version) =>
    [
      "  <url>",
      `    <loc>${version.url}</loc>`,
      `    <lastmod>${lastModified(version.page)}</lastmod>`,
      ...alternatesFor(versions),
      "  </url>",
    ].join("\n"),
  ),
);

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
  `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  `${entries.join("\n")}\n` +
  `</urlset>\n`;

/* --------------------------------------------------------------- robots.txt */

/**
 * The answer engines, allowed by name.
 *
 * Two of these are not crawlers. `Google-Extended` and `Applebot-Extended` are
 * policy tokens: they do not fetch anything, they only carry a yes or no about
 * using already-crawled pages in AI answers. Listing them with `Allow` is how
 * that yes is expressed — leaving them out is a different, quieter answer.
 */
const ANSWER_ENGINES = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

const robots =
  `# ${site.name} — ${ORIGIN}\n` +
  `# Generated by tools/build-seo.mjs. Edit that, not this.\n` +
  `#\n` +
  `# Nothing is disallowed, and the demos are crawlable on purpose. Every page\n` +
  `# under /demos/ carries <meta name="robots" content="noindex">, and a crawler\n` +
  `# has to be able to FETCH a page to read that tag. A Disallow here would hide\n` +
  `# the noindex rather than reinforce it, and leave the invented institutions\n` +
  `# eligible for indexing on inbound links alone — a URL Google may not fetch is\n` +
  `# a URL it can still list. Crawlable plus noindex is what keeps them out.\n` +
  `\n` +
  `User-agent: *\n` +
  `Allow: /\n` +
  `\n` +
  `# Answer engines. Being cited by ChatGPT, Perplexity, Claude and Google's AI\n` +
  `# surfaces is its own route to a sales conversation now, so these are allowed\n` +
  `# deliberately rather than by omission.\n` +
  ANSWER_ENGINES.map((agent) => `User-agent: ${agent}\nAllow: /\n`).join("\n") +
  `\n` +
  `Sitemap: ${ORIGIN}/sitemap.xml\n`;

/* ------------------------------------------------------------------- output */

if (errors.length) {
  console.error(`\n  ${errors.length} SEO problem(s). Refusing to write a sitemap that lies:\n`);
  for (const message of errors) console.error(`    ${message}`);
  console.error("");
  process.exit(1);
}

writeFileSync(join(ROOT, "sitemap.xml"), sitemap);
writeFileSync(join(ROOT, "robots.txt"), robots);

/* The mirror's own sitemap is gone; leaving the old file behind would keep a
   second, half-true list of URLs live at a URL robots.txt no longer names. */
const stale = join(ROOT, MIRROR, "sitemap.xml");
if (existsSync(stale)) rmSync(stale);

const total = pages(ROOT).length;
console.log(
  `  sitemap.xml  ${entries.length} URL(s) across ${set.length} language set(s)\n` +
    `               ${total - set.length} of ${total} pages held back by their own noindex\n` +
    `  robots.txt   ${ANSWER_ENGINES.length} answer engines allowed by name`,
);

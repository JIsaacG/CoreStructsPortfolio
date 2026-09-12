/**
 * Builds the English mirror of the site into `en/`: `npm run build:i18n`.
 *
 * It runs last, over the finished Spanish pages, and does four things to each:
 *
 *   1. translates every run of copy through `src/i18n/en/` (see `lib/i18n.mjs`)
 *   2. re-points the relative URLs that leave the mirror — a page in `en/` is
 *      one directory deeper, so `assets/`, `dist/` and `src/` need one more
 *      `../`, while links between pages are unchanged, because the mirror has
 *      the same shape as the tree it mirrors
 *   3. swaps the document language, canonical and Open Graph locale, and links
 *      the two versions to each other with `hreflang`
 *   4. fills in the `<!--lang-switch-->` marker each header carries, in *both*
 *      trees, with a switch that points at the counterpart of that exact page
 *
 * Step 4 is why this also rewrites the Spanish tree in place. Everything it
 * injects is wrapped in its own pair of comment markers and stripped before the
 * next injection, so the build is idempotent: running it twice changes nothing,
 * and a page that has lost its marker is a hard error rather than a page that
 * quietly ships without a way to switch language.
 *
 * Coverage is reported, not assumed: anything that reads as Spanish and has no
 * dictionary entry is listed in `tools/i18n-missing.txt` with the pages it
 * appears on. An empty list is what "every word" means here.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";

import { cleanUrl } from "./build-urls.mjs";
import { key, loadDictionary, loadRules, newReport, translatePage } from "./lib/i18n.mjs";
import { pages, roundtrip } from "./lib/roundtrip-check.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const EN = { code: "en", label: "EN", og: "en_US", name: "English" };
/* es_HN, not es_ES: the Spanish the site is written in, and sells in. */
const ES = { code: "es", label: "ES", og: "es_HN", name: "Español" };
const MIRROR = "en";

/* Everything this build injects is fenced, so the next run can lift it back
   out and re-derive it rather than nesting a second copy inside the first. */
const fence = (name) => ({
  open: `<!--${name}-->`,
  close: `<!--/${name}-->`,
  region: new RegExp(`<!--${name}-->(?:[\\s\\S]*?<!--/${name}-->)?`, "g"),
});
const SWITCH = fence("lang-switch");
const MEMORY = fence("lang-memory");
const ALTERNATES = fence("lang-alternates");

/* ------------------------------------------------------------------- paths */

/** Every path the mirror reproduces; a link to one of these needs no shifting. */
const mirrored = new Set(pages(ROOT));

/** Absolute, protocol-relative, root-relative and in-page URLs are left alone. */
const isExternal = (url) => !url || /^(?:[a-z][a-z0-9+.-]*:|\/\/|\/|#)/i.test(url);

/**
 * Re-point one relative URL for a page that has moved into `en/`.
 *
 * A link to another page resolves to the mirrored copy without changing, since
 * both ends moved together. A link to a shared asset has to climb one more
 * level, because the asset did not move.
 */
function shift(url, pageDir) {
  if (isExternal(url)) return url;

  const [, path, suffix = ""] = url.match(/^([^?#]*)([?#][\s\S]*)?$/);
  if (!path) return url;

  const target = posix.normalize(posix.join(pageDir, path));
  if (mirrored.has(target)) return url;

  /* A link to a directory is a link to its `index.html`, and that page moved
     into the mirror with this one. Without this the URL is treated as a shared
     asset and re-pointed back at the Spanish tree: `servicios/` on an English
     page would become `../servicios`, quietly dropping the reader out of the
     language they chose — and handing Google a cross-language link where the
     hreflang pair says there should be none. */
  const asIndex = posix.join(target, "index.html");
  if (path.endsWith("/") && mirrored.has(asIndex)) return url;

  /* The same reasoning for the other clean shape. `build-urls.mjs` shortens
     `demos/verbena.html` to `demos/verbena` on the finished pages, and this
     step re-reads those pages on the next build. Without this, a link whose
     `.html` had already been dropped would not be found in `mirrored`, would
     be taken for a shared asset, and would be re-pointed at the Spanish tree —
     dropping an English reader out of English on a link that used to work. */
  if (mirrored.has(`${target}.html`)) return url;

  return posix.relative(posix.join(MIRROR, pageDir), target) + suffix;
}

/** Re-point every relative URL on a page that moved into the mirror. */
const shiftUrls = (html, dir) =>
  html.replace(
    /\s(href|src|action|formaction|poster|xlink:href)="([^"]*)"/g,
    (match, name, url) => {
      const moved = shift(url, dir);
      return moved === url ? match : ` ${name}="${moved}"`;
    },
  );

/** `https://host/path` -> `https://host/en/path`. */
const withLocale = (url) => url.replace(/^(https?:\/\/[^/]+)\/?/i, `$1/${MIRROR}/`);

/* --------------------------------------------------------------- injections */

/**
 * The two-state language switch.
 *
 * The current language is a `<span>`, not a disabled link: there is nowhere for
 * it to go, and a link that does nothing is the worse of the two for anyone
 * reading the page with a screen reader.
 */
const langSwitch = ({ current, other, href }) =>
  `${SWITCH.open}<div class="lang-switch" role="group" aria-label="Idioma · Language">` +
  `<span class="lang-switch__current" lang="${current.code}" aria-current="true">${current.label}</span>` +
  `<a class="lang-switch__link" lang="${other.code}" hreflang="${other.code}" href="${href}"` +
  ` data-lang-pick="${other.code}" title="${other.name}">${other.label}</a>` +
  `</div>${SWITCH.close}`;

/**
 * Remembers the choice and honours it on the next page.
 *
 * Inline and in the head, because the alternative is a visible hop after first
 * paint. It only ever moves between a page and its own counterpart, and only
 * when the stored preference disagrees with the page it is on, so it cannot
 * cycle; the session key is the belt to that pair of braces.
 */
const memoryScript = (alternate) => `${MEMORY.open}
    <script>
      /* Language preference: written by the ES/EN switch, applied before paint. */
      (function () {
        try {
          var pref = localStorage.getItem("cs-lang");
          if (pref && pref !== document.documentElement.lang) {
            if (sessionStorage.getItem("cs-lang-hop") !== location.pathname) {
              sessionStorage.setItem("cs-lang-hop", location.pathname);
              location.replace("${alternate}");
              return;
            }
          } else {
            sessionStorage.removeItem("cs-lang-hop");
          }
        } catch (e) {}
        document.addEventListener("click", function (event) {
          var pick = event.target.closest && event.target.closest("[data-lang-pick]");
          if (pick) {
            try { localStorage.setItem("cs-lang", pick.getAttribute("data-lang-pick")); } catch (e) {}
          }
        }, true);
      })();
    </script>
    ${MEMORY.close}`;

/** The `hreflang` pair, so each version declares the other. */
const alternates = (esUrl, enUrl) => `${ALTERNATES.open}
    <link rel="alternate" hreflang="es" href="${esUrl}" />
    <link rel="alternate" hreflang="en" href="${enUrl}" />
    <link rel="alternate" hreflang="x-default" href="${esUrl}" />
    ${ALTERNATES.close}`;

/** Put a block in just before `</head>`, on its own line. */
function intoHead(html, block) {
  const at = html.lastIndexOf("</head>");
  if (at === -1) return html;
  const lineStart = html.lastIndexOf("\n", at) + 1;
  return `${html.slice(0, lineStart)}${block}\n${html.slice(lineStart)}`;
}

/**
 * Lift a previous run's injections back out, so this run re-derives them.
 *
 * The whole line goes, trailing newline included: leaving the blank line behind
 * would let the head grow by one every time the build ran.
 */
const stripRegion = (html, name) =>
  html.replace(new RegExp(`[ \\t]*<!--${name}-->[\\s\\S]*?<!--/${name}-->[ \\t]*\\n?`, "g"), "");

const stripInjections = (html) => stripRegion(stripRegion(html, "lang-memory"), "lang-alternates");

/* -------------------------------------------------------------------- build */

const failures = roundtrip(ROOT);
if (failures.length) {
  console.error(`The HTML walker no longer round-trips ${failures.length} page(s). Refusing to build.`);
  for (const f of failures.slice(0, 3)) {
    console.error(`  ${f.page} at ${f.at}: expected ${JSON.stringify(f.expected)}`);
  }
  process.exit(1);
}

const dictionary = await loadDictionary(ROOT, EN.code);
const rules = await loadRules(ROOT, EN.code);
const report = newReport();
const written = [];
const unmarked = [];

for (const page of pages(ROOT)) {
  const dir = posix.dirname(page) === "." ? "" : posix.dirname(page);
  const original = readFileSync(join(ROOT, page), "utf8");
  /* Back to the bare markers, so this run translates the page rather than the
     switch the last run left in it. */
  const clean = stripInjections(original).replace(SWITCH.region, SWITCH.open);

  if (!clean.includes(SWITCH.open)) {
    unmarked.push(page);
    continue;
  }

  /* Clean from the start, and not left to `build-urls.mjs` to shorten later.
     These two feed the language switch *and* the `location.replace()` in the
     memory script, and that call is a string inside a `<script>` — the link
     pass walks attributes, so it would never reach it. A visitor arriving at
     `/` with English remembered would be sent to `en/index.html`, land on the
     301, and pay a second round trip to end up where this could have pointed
     in the first place. */
  const enHref = cleanUrl(posix.relative(dir, posix.join(MIRROR, page)));
  const esHref = cleanUrl(posix.relative(posix.join(MIRROR, dir), page));
  const canonical = clean.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];

  /* --- the Spanish page keeps its shape and gains the switch --- */
  let spanish = clean.replace(SWITCH.region, langSwitch({ current: ES, other: EN, href: enHref }));
  spanish = intoHead(spanish, memoryScript(enHref));
  if (canonical) spanish = intoHead(spanish, alternates(canonical, withLocale(canonical)));
  if (spanish !== original) writeFileSync(join(ROOT, page), spanish);

  /* --- the English page, translated from the marker-only source --- */
  let english = translatePage(clean, { dictionary, rules, page, report, locale: EN.code });

  english = english
    .replace(/<html([^>]*)\slang="es"/i, '<html$1 lang="en"')
    .replace(/(<meta property="og:locale" content=")es[_-][A-Za-z]{2}(")/i, `$1${EN.og}$2`)
    /* The pair is symmetric: each version names itself in `og:locale` and its
       counterpart in `og:locale:alternate`, so the two never both claim the
       same locale. The closing quote after `og:locale` is what keeps the
       rule above off this tag. */
    .replace(
      /(<meta property="og:locale:alternate" content=")en[_-][A-Za-z]{2}(")/i,
      `$1${ES.og}$2`,
    )
    .replace(
      /(<(?:link|meta)\b[^>]*?\b(?:rel="canonical"|property="og:url")[^>]*?\b(?:href|content)=")([^"]+)(")/gi,
      (_m, open, url, close) => `${open}${withLocale(url)}${close}`,
    );

  english = shiftUrls(english, dir);

  // The mirror has a manifest of its own — English name, `/en/` start URL — so
  // an installed app opens in the language it was installed from.
  english = english.replace(
    /(<link\b[^>]*\brel="manifest"[^>]*\bhref=")[^"]*(")/i,
    (_m, open, close) => `${open}${posix.relative(dir, "site.webmanifest")}${close}`,
  );

  english = english.replace(SWITCH.region, langSwitch({ current: EN, other: ES, href: esHref }));
  english = intoHead(english, memoryScript(esHref));
  if (canonical) english = intoHead(english, alternates(canonical, withLocale(canonical)));

  const out = join(ROOT, MIRROR, ...page.split("/"));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, english);
  written.push({ page, bytes: Buffer.byteLength(english) });
}

if (unmarked.length) {
  console.error(`\n  ${unmarked.length} page(s) carry no ${SWITCH.open} marker and were skipped:`);
  for (const page of unmarked) console.error(`    ${page}`);
  console.error(`  Every page needs one, or it ships with no way to change language.\n`);
  process.exitCode = 1;
}

/* ------------------------------------------------------------- the manifest */

const manifest = JSON.parse(readFileSync(join(ROOT, "site.webmanifest"), "utf8"));
writeFileSync(
  join(ROOT, MIRROR, "site.webmanifest"),
  `${JSON.stringify(
    {
      ...manifest,
      description: dictionary.resolve(key(manifest.description)) ?? manifest.description,
      lang: EN.code,
      start_url: `/${MIRROR}/`,
      scope: `/${MIRROR}/`,
      icons: manifest.icons.map((icon) => ({ ...icon, src: `../${icon.src}` })),
    },
    null,
    2,
  )}\n`,
);

/* The mirror used to get a sitemap of its own, derived from the Spanish one by
   re-pointing every `<loc>`. It no longer does: `build-seo.mjs` writes a single
   sitemap that lists both languages and links each URL to its counterpart with
   `xhtml:link`, which is the pair Google wants to read together. Two sitemaps
   listing one language each cannot express that pairing. */

/* ------------------------------------------------------------------ report */

const byCount = (a, b) => b.count - a.count;
const missing = [...report.missing.values()].sort(byCount);
const review = [...report.review.values()].sort(byCount);

/**
 * One entry: what it says, how often, and where to find it.
 *
 * The sample of pages shows one per site rather than the first four in sort
 * order. A run like "Recursos" appears in four demos' navigation, and a sample
 * that listed four Aurea pages would hide the other three sites completely —
 * which is exactly how a shared nav item gets translated in one place and
 * missed in the rest.
 */
const format = (entry) => {
  const where = [...entry.pages];
  const seen = new Set();
  const sample = [];
  for (const page of where) {
    const site = page.startsWith("demos/") ? page.split("/")[1] : ".";
    if (seen.has(site)) continue;
    seen.add(site);
    sample.push(page);
  }
  const rest = where.length - sample.length;
  return (
    `${String(entry.count).padStart(4)}  ${entry.kind.padEnd(10)}  ${JSON.stringify(entry.text)}\n` +
    `      ${sample.slice(0, 6).join(", ")}${rest > 0 ? `, +${rest} more` : ""}`
  );
};

writeFileSync(
  join(ROOT, "tools", "i18n-missing.txt"),
  `${missing.length} untranslated runs that read as Spanish, across ${written.length} pages.\n` +
    `Below them, ${review.length} runs the dictionary does not cover and that do not read as\n` +
    `Spanish prose — names, acronyms and codes, most of which should simply be mapped to\n` +
    `themselves so that "unchanged" is a decision on the record rather than an omission.\n\n` +
    `=== TO TRANSLATE (${missing.length}) ===\n\n${missing.map(format).join("\n")}\n\n` +
    `=== TO REVIEW (${review.length}) ===\n\n${review.map(format).join("\n")}\n`,
);

const total = written.reduce((sum, w) => sum + w.bytes, 0);
const words = missing.reduce((sum, m) => sum + m.text.split(/\s+/).length * m.count, 0);
console.log(
  `  en/  ${written.length} páginas · ${(total / 1024 / 1024).toFixed(1)} MB\n` +
    `       ${report.translated.size} textos traducidos · ` +
    `${missing.length} por traducir (~${words} palabras) · ${review.length} por revisar`,
);
if (missing.length || review.length) console.log(`       detalle en tools/i18n-missing.txt`);

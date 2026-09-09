/**
 * The translation layer.
 *
 * The site's copy is spread across `src/data/` (structured content) and the
 * renderers in `tools/` (the words that are part of a layout: "Explorar",
 * "Abrir el menú", a headline split into three animated lines). Threading a
 * locale through 270 source files to reach both would touch every one of them.
 *
 * So the translation happens once, on the finished page: the walker in
 * `html.mjs` visits every run of character data and every attribute that can
 * hold copy, and each one is looked up in a dictionary keyed by its Spanish
 * source text. Markup, SVG geometry, class names and URLs are never candidates,
 * because the walker never offers them.
 *
 * The property that makes this trustworthy is the report: anything that reads
 * as Spanish and is *not* in the dictionary comes back as a finding, with the
 * pages it appears on. Coverage is therefore measurable rather than asserted —
 * "every word" is a number this file can print.
 */

import { readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { decodeEntities, escapeAttr, escapeText, transform } from "./html.mjs";

/* ------------------------------------------------------------ what to read */

/** Attributes that hold words a visitor can perceive. */
const COPY_ATTRS = new Set([
  "alt",
  "title",
  "aria-label",
  "aria-description",
  "aria-roledescription",
  "aria-placeholder",
  "aria-valuetext",
  "placeholder",
  "label",
  "download",
]);

/**
 * `content` is copy only on the metadata that describes the page. On every
 * other `<meta>` it is a colour, a URL, a viewport or a pixel count.
 */
const COPY_META = new Set([
  "description",
  "keywords",
  "application-name",
  "apple-mobile-web-app-title",
  "og:title",
  "og:description",
  "og:image:alt",
  "og:site_name",
  "twitter:title",
  "twitter:description",
  "twitter:image:alt",
]);

/**
 * `value` on an `<input>` is copy in this codebase: a button's label, or the
 * pre-filled demo content the workflow console reads back out and displays. The
 * exceptions are the controls whose value is a key rather than a caption —
 * a radio or a checkbox is selected *by* its value, so translating it would
 * break the control rather than the sentence.
 *
 * `<option value>` is excluded for the same reason, and is not matched here:
 * an option's caption is its text, which the text pass already visits.
 */
const VALUE_KEYS = new Set(["radio", "checkbox"]);

/**
 * Data attributes the client scripts read back out and display. Anything not
 * listed is treated as machinery — an id, a state, a number, a selector.
 */
const COPY_DATA_ATTRS = new Set([
  "data-label",
  "data-title",
  "data-caption",
  "data-empty",
  "data-summary",
  "data-legend",
  "data-unit",
  "data-note",
  "data-hint",
  "data-error",
  "data-success",
  "data-placeholder",
  "data-tooltip",
  "data-announce",
]);

/** Elements whose whitespace is significant, so their text is left alone. */
const PRESERVE_WHITESPACE = new Set(["pre", "textarea", "code", "kbd", "samp"]);

/* ------------------------------------------------------------- phrase runs */

/**
 * A sentence with a word lifted out of it — `No solo hacemos <em>páginas
 * web.</em>` — is three nodes to a parser and one sentence to a reader. Handing
 * the parser's view to a translator produces exactly the fragments you would
 * expect: "No solo hacemos" has no verb object, and "páginas web." has no verb.
 *
 * So a container whose copy is broken up this way is translated whole, markup
 * and all, before the text pass runs. The dictionary key is then the sentence
 * as it is written, and the translation says where the emphasis goes in English
 * — which is rarely where it went in Spanish.
 */
const INLINE = "em|strong|b|i|u|s|sub|sup|small|abbr|span|a|code|mark|time|q|cite|dfn|var";
const CONTAINER = "p|h1|h2|h3|h4|h5|h6|li|dd|dt|figcaption|caption|blockquote|summary|td|th|label|legend";

/**
 * A heading set one `<span>` per word so it can be revealed a word at a time.
 *
 * Word by word is how it animates, not how it reads, and not how it
 * translates — the sentence is thirteen words in Spanish and eleven in
 * English. So the run is put back together into a sentence, looked up as one,
 * and dealt back out into spans afterwards. `**…**` marks the emphasised run,
 * the same convention the data files use.
 */
const WORD_SPLIT = /<(h1|h2|h3|h4|p)\b([^>]*\bclass="[^"]*\breveal-words\b[^"]*"[^>]*)>([\s\S]*?)<\/\1>/gi;
const WORD_SPAN = /<span>(<em>)?([^<]*)(?:<\/em>)?<\/span>/gi;

/** The spans of a word-split run, as `{ word, lifted }`. */
function readWords(inner) {
  const words = [];
  let match;
  WORD_SPAN.lastIndex = 0;
  while ((match = WORD_SPAN.exec(inner))) {
    words.push({ word: decodeEntities(match[2]).trim(), lifted: Boolean(match[1]) });
  }
  // Anything else in there means this is not the construct we think it is.
  return inner.replace(WORD_SPAN, "").trim() ? null : words;
}

/** `["La", "tecnología", …]` -> `"La tecnología … **no … tecnología.**"` */
function joinWords(words) {
  let out = "";
  let lifting = false;
  for (const { word, lifted } of words) {
    if (lifted && !lifting) out += `${out ? " " : ""}**`;
    else if (!lifted && lifting) out += "** ";
    else if (out) out += " ";
    out += word;
    lifting = lifted;
  }
  return lifting ? `${out}**` : out;
}

/** The inverse: a sentence back into one span per word. */
const splitWords = (sentence) =>
  sentence
    .split(/\*\*(.+?)\*\*/g)
    .flatMap((part, index) =>
      part
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => {
          const safe = escapeText(word);
          return `<span>${index % 2 === 1 ? `<em>${safe}</em>` : safe}</span>`;
        }),
    )
    .join(" ");

/** A container holding only text and one level of inline elements. */
const PHRASE = new RegExp(
  `<(${CONTAINER})\\b([^>]*)>` +
    `((?:[^<]|<(?:${INLINE})\\b[^>]*>[^<]*</(?:${INLINE})>|<br\\s*/?>)+)` +
    `</\\1>`,
  "gi",
);

/** Text this run contributes to the sentence, ignoring the tags around it. */
const textOf = (html) => decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/**
 * Is this container's copy actually split, or is it a line of text with some
 * decoration parked next to it?
 *
 * The arrow links all over this site are the case to reject: a `<p>` holding
 * the word "Explorar" between two empty decorative spans is one run of copy,
 * and it belongs in the dictionary as the word, not as the markup.
 */
function isSplitPhrase(inner) {
  const bearing = inner
    .split(/(<[^>]+>)/)
    .filter((part) => !part.startsWith("<") && /\p{L}/u.test(decodeEntities(part)));
  return bearing.length >= 2 && textOf(inner).split(/\s+/).length >= 3;
}

/* --------------------------------------------------------- is this Spanish */

/**
 * Words that appear in Spanish prose and are not also English words. A run
 * qualifies as Spanish if it carries Spanish orthography or at least one of
 * these, which keeps brand names, codes and numbers out of the report.
 */
const MARKERS = new RegExp(
  "\\b(" +
    [
      "de", "del", "la", "las", "los", "el", "al", "un", "una", "unos", "unas",
      "que", "para", "con", "por", "sus", "su", "se", "es", "son", "está",
      "están", "estás", "desde", "hasta", "cada", "como", "donde", "cuando",
      "entre", "sobre", "sin", "también", "esto", "esta", "este", "estos",
      "estas", "esa", "ese", "esas", "esos", "nuestro", "nuestra", "nuestros",
      "nuestras", "tu", "tus", "ser", "hacer", "tiene", "tienen", "puede",
      "pueden", "hacia", "según", "aunque", "porque", "mientras", "siempre",
      "nunca", "todo", "toda", "todos", "todas", "otro", "otra", "otros",
      "otras", "mismo", "misma", "ya", "lo", "le", "les", "nos", "muy",
      "más", "menos", "pero", "sino", "cuál", "cuáles", "quién", "quiénes",
      "dónde", "cómo", "qué", "año", "años", "día", "días", "mes", "meses",
      "hora", "horas", "nombre", "correo", "teléfono", "buscar", "ver",
      "enviar", "cerrar", "abrir", "siguiente", "anterior", "volver",
      "inicio", "página", "páginas", "menú", "aquí", "ahora", "hoy",
    ].join("|") +
    ")\\b",
  "i",
);

const SPANISH_LETTERS = /[áéíóúüñÁÉÍÓÚÜÑ¿¡]/;

/** Runs that are punctuation, numbers or a single capitalised token. */
const IGNORABLE = /^[\s\d\p{P}\p{S}]*$/u;

/**
 * Does this run read as Spanish that a visitor would see?
 *
 * Deliberately generous: a false positive costs one dictionary entry that maps
 * a word to itself, while a false negative ships untranslated copy.
 */
export function isSpanish(text) {
  const value = text.trim();
  if (!value || IGNORABLE.test(value)) return false;
  if (SPANISH_LETTERS.test(value)) return true;
  if (MARKERS.test(value)) return true;
  return false;
}

/* ------------------------------------------------------------- dictionary */

/** Collapse a run to the shape the dictionary is keyed by. */
export const key = (text) => decodeEntities(text).replace(/\s+/g, " ").trim();

/**
 * Load every module in `src/i18n/<locale>/` and merge it into one map.
 *
 * The files are split by site purely so they stay editable; a key may only be
 * defined once across all of them, and a collision is a build error rather than
 * a silent last-one-wins.
 */
export async function loadDictionary(root, locale) {
  const dir = join(root, "src", "i18n", locale);

  let files;
  try {
    // `_`-prefixed modules are machinery (the rule set), not word lists.
    files = readdirSync(dir)
      .filter((f) => f.endsWith(".js") && !f.startsWith("_"))
      .sort();
  } catch {
    return emptyDictionary();
  }

  /* One map per scope. A module may `export const scope = "demos/cede"`, and
     its entries then apply only to pages under that path. Without it the same
     word could only ever have one translation across the whole site, and some
     genuinely do not: "Permanencia" is continuity for an engineering group and
     retention for an education ministry, and both are right. */
  const scopes = new Map([["", new Map()]]);
  const origin = new Map();

  for (const file of files) {
    const module = await import(pathToFileURL(join(dir, file)).href);
    const scope = module.scope ?? "";
    if (!scopes.has(scope)) scopes.set(scope, new Map());
    const map = scopes.get(scope);

    for (const [spanish, english] of Object.entries(module.default ?? {})) {
      const normalised = key(spanish);
      const seen = `${scope} ${normalised}`;
      if (map.has(normalised) && map.get(normalised) !== english) {
        throw new Error(
          `"${normalised}" is translated differently in ${origin.get(seen)} and ${file}` +
            (scope ? ` (both scoped to ${scope})` : " (both global)"),
        );
      }
      map.set(normalised, english);
      origin.set(seen, file);
    }
  }

  // Longest prefix first, so a narrow scope beats a broad one.
  const ordered = [...scopes.entries()]
    .map(([prefix, map]) => ({ prefix, map }))
    .sort((a, b) => b.prefix.length - a.prefix.length);

  return {
    /** The translation for `text` on `page`, or undefined. */
    resolve(text, page = "") {
      for (const { prefix, map } of ordered) {
        if (prefix && !page.startsWith(prefix)) continue;
        const hit = map.get(text);
        if (hit !== undefined) return hit;
      }
      return undefined;
    },
    /** How many distinct entries were loaded, for the build's summary line. */
    get size() {
      return ordered.reduce((sum, { map }) => sum + map.size, 0);
    },
  };
}

const emptyDictionary = () => ({ resolve: () => undefined, size: 0 });

/**
 * Load the generative rules for a locale, if it has any.
 *
 * Some copy is not vocabulary, it is a format: a date, a duration, a month.
 * There are several hundred dates across the calendars, registers and
 * statistical tables in these demos, and listing each one as its own dictionary
 * entry would be both enormous and wrong — "24 ago 2026" is not a phrase
 * somebody wrote, it is what the date formatter produced. A rule translates the
 * shape once.
 *
 * Rules only ever fire on a run they match end to end. A rule that matched
 * halfway would leave a half-translated sentence behind and nothing would
 * report it.
 */
export async function loadRules(root, locale) {
  try {
    const module = await import(pathToFileURL(join(root, "src", "i18n", locale, "_rules.js")).href);
    return module.rules ?? [];
  } catch {
    return [];
  }
}

/** Apply the first rule that matches the whole run. */
export function applyRules(text, rules, translate = (value) => value) {
  for (const { pattern, replace } of rules) {
    const anchored = new RegExp(`^(?:${pattern.source})$`, pattern.flags.replace("g", ""));
    const match = text.match(anchored);
    if (!match) continue;
    if (typeof replace !== "function") return text.replace(anchored, replace);

    /* A template rule gets `t` as its last argument, so the pieces it captured
       can go back through the dictionary. "Renovación de contrato de limpieza.
       Solicitado por Rodrigo Salgado, Administración." is one sentence shape
       with three slots, two of which are already translated elsewhere; without
       this the shape would have to be listed once per request. */
    return replace(...match, translate);
  }
  return undefined;
}

/* ------------------------------------------------------------- translation */

/**
 * Translate one page.
 *
 * @param {string} html
 * @param {object} options
 * @param {Map<string,string>} options.dictionary
 * @param {string} options.page     the page's path, for the report
 * @param {object} options.report   accumulates hits and misses across pages
 * @returns {string}
 */
export function translatePage(html, { dictionary, rules = [], page, report, locale = "en" }) {
  const seen = (bucket, text, kind) => {
    const entry = report[bucket].get(text) ?? { text, kind, count: 0, pages: new Set() };
    entry.count++;
    entry.pages.add(page);
    report[bucket].set(text, entry);
  };

  /**
   * Sentences the phrase pass has already dealt with, either way.
   *
   * Both lists exist for the same reason: a sentence translated whole is still
   * a set of text nodes by the time the text pass walks over it, and every one
   * of them would otherwise be reported — the Spanish halves of a sentence
   * nobody has translated yet, or the English halves of one already finished.
   * Neither is a finding, and both would drown the ones that are.
   */
  const unresolvedPhrases = [];
  const resolvedPhrases = [];

  /**
   * What a template rule uses on the pieces it captured.
   *
   * It consults the dictionary and the rules, and hands back the original when
   * neither knows the piece — a rule should still produce its English shape
   * around a proper noun it could not place. Nothing is reported from in here:
   * the run as a whole is being counted by the caller.
   */
  let slotMissed = false;

  const translateSlot = (value) => {
    const normalised = key(value);
    const known = dictionary.resolve(normalised, page);
    if (known !== undefined) return known;
    const ruled = applyRules(normalised, rules, translateSlot);
    if (ruled !== undefined) return ruled;
    /* Nothing covers this piece. The rule may still assemble its English shape
       around it — a proper noun belongs in the sentence either way — but the
       run as a whole no longer counts as translated, so `ruledOrMissed` below
       hands it to the report instead. */
    if (normalised && !IGNORABLE.test(normalised)) slotMissed = true;
    return value;
  };

  /**
   * Apply the rules, but stand aside if any slot came back untranslated.
   *
   * A shape rule fills its placeholders from the dictionary. When one of them
   * is not covered, the rule would otherwise produce a sentence that is English
   * around a Spanish middle — "Comparison of los nueve programas" — and count
   * itself as translated, which is precisely the failure the coverage report
   * exists to catch. Rules that gate themselves with `t.known` are unaffected;
   * this makes the same guarantee for the ones that do not.
   */
  const ruledOrMissed = (normalised) => {
    slotMissed = false;
    const ruled = applyRules(normalised, rules, translateSlot);
    if (ruled === undefined || slotMissed) return undefined;
    return ruled;
  };

  /**
   * Whether a slot is actually covered, as opposed to handed back unchanged.
   *
   * A rule that assembles several slots needs this. Without it, a shape rule
   * would report itself as translated while quietly passing untranslated
   * Spanish through its own placeholders — the one failure mode the coverage
   * report exists to catch.
   */
  translateSlot.known = (value) => {
    const normalised = key(value);
    if (!normalised || IGNORABLE.test(normalised)) return true;
    if (dictionary.resolve(normalised, page) !== undefined) return true;
    /* A rule that fires but leaves a slot of its own untranslated does not
       count as knowing this piece, so the probe is run against a clean flag
       and the caller's is put back afterwards. */
    const outer = slotMissed;
    slotMissed = false;
    const ruled = applyRules(normalised, rules, translateSlot);
    const covered = ruled !== undefined && !slotMissed;
    slotMissed = outer;
    return covered;
  };

  /**
   * Look a run up, and account for it either way.
   *
   * Everything that is not in the dictionary is reported, not just what trips
   * the Spanish heuristic. "Servicios", "Productos", "Normativa" carry no
   * accent and no function word, so a heuristic alone would wave them through
   * and they would ship untranslated with nothing to say they had. The two
   * buckets differ only in priority: `missing` reads as Spanish prose and is
   * certainly copy, `review` is more likely a name, a code or an acronym — but
   * it is still listed, because "we looked and it stays as it is" has to be a
   * decision somebody made rather than one the heuristic made by omission.
   */
  const lookup = (raw, kind) => {
    const normalised = key(raw);
    if (!normalised) return undefined;

    const known = dictionary.resolve(normalised, page);
    if (known !== undefined) {
      seen("translated", normalised, kind);
      return known;
    }
    // Digits, punctuation and symbols carry no language.
    if (IGNORABLE.test(normalised)) return undefined;

    // A date, a duration, a month: a format rather than a phrase.
    const ruled = ruledOrMissed(normalised);
    if (ruled !== undefined) {
      seen("translated", normalised, kind);
      return ruled;
    }
    // Already accounted for as part of the sentence it was cut out of.
    if (unresolvedPhrases.some((phrase) => phrase.includes(normalised))) return undefined;
    if (resolvedPhrases.some((phrase) => phrase.includes(normalised))) return undefined;

    seen(isSpanish(normalised) ? "missing" : "review", normalised, kind);
    return undefined;
  };

  /* --- the word-split pass: reassemble, translate, deal back out --- */

  const rejoined = html.replace(WORD_SPLIT, (whole, tag, attrs, inner) => {
    const words = readWords(inner);
    if (!words || words.length < 3) return whole;

    const sentence = joinWords(words);
    const normalised = key(sentence);

    const rejoinedHit =
      dictionary.resolve(normalised, page) ?? ruledOrMissed(normalised);
    if (rejoinedHit !== undefined) {
      seen("translated", normalised, `<${tag.toLowerCase()}>`);
      const [, lead, , tail] = inner.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const english = rejoinedHit;
      resolvedPhrases.push(english.replace(/\*\*/g, ""));
      return `<${tag}${attrs}>${lead}${splitWords(english)}${tail}</${tag}>`;
    }
    if (isSpanish(sentence)) {
      seen("missing", normalised, `<${tag.toLowerCase()}>`);
      unresolvedPhrases.push(sentence.replace(/\*\*/g, ""));
    }
    return whole;
  });

  /* --- the phrase pass: whole sentences, emphasis included --- */

  const phrased = rejoined.replace(PHRASE, (whole, tag, attrs, inner) => {
    if (!isSplitPhrase(inner)) return whole;

    const [, lead, core, tail] = inner.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const normalised = key(core);

    /* The dictionary first, then the rules: a sentence can be a shape as well
       as a phrase — a row of `<span>`s holding a document's type, subject, date
       and size is generated, not written, and belongs to a rule. */
    const phrase = dictionary.resolve(normalised, page) ?? ruledOrMissed(normalised);
    if (phrase !== undefined) {
      seen("translated", normalised, `<${tag.toLowerCase()}>`);
      const english = phrase;
      resolvedPhrases.push(textOf(english));
      return `<${tag}${attrs}>${lead}${english}${tail}</${tag}>`;
    }
    if (isSpanish(textOf(core))) {
      seen("missing", normalised, `<${tag.toLowerCase()}>`);
      unresolvedPhrases.push(textOf(core));
    }
    return whole;
  });

  return transform(phrased, {
    onText(text, { parent, stack }) {
      if (stack.some((tag) => PRESERVE_WHITESPACE.has(tag))) return undefined;
      if (!text.trim()) return undefined;

      // Keep the surrounding whitespace: it is the page's indentation.
      const [, lead, core, tail] = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const english = lookup(core, parent || "text");
      if (english === undefined) return undefined;
      return `${lead}${escapeText(english)}${tail}`;
    },

    onAttr(value, { name, element, attrs, quote }) {
      const translatable =
        COPY_ATTRS.has(name) ||
        COPY_DATA_ATTRS.has(name) ||
        (name === "content" &&
          element === "meta" &&
          COPY_META.has(attrs.name ?? attrs.property ?? "")) ||
        (name === "value" && element === "input" && !VALUE_KEYS.has(attrs.type ?? "text"));

      if (!translatable) return undefined;

      const english = lookup(value, `@${name}`);
      if (english === undefined) return undefined;
      return escapeAttr(english, quote);
    },

    onRaw(body, { element, attrs }) {
      // The only script the translator has business inside is the JSON-LD
      // block: it is metadata a search engine reads as prose.
      if (element !== "script" || attrs.type !== "application/ld+json") return undefined;

      let data;
      try {
        data = JSON.parse(body);
      } catch {
        return undefined;
      }

      /* Fields that are addresses, identifiers or codes rather than prose. */
      const VERBATIM = new Set([
        "url", "logo", "image", "email", "telephone", "sameAs", "@id",
        // schema.org enumerations: vocabulary the spec fixes, not prose.
        "applicationCategory", "operatingSystem", "priceCurrency", "currency",
      ]);

      const localise = (node) => {
        if (typeof node === "string") {
          const english = lookup(node, "@ld+json");
          return english === undefined ? node : english;
        }
        if (Array.isArray(node)) return node.map(localise);
        if (node && typeof node === "object") {
          return Object.fromEntries(
            Object.entries(node).map(([k, v]) => {
              // A language tag is structure, not copy: it states what language
              // the page is in, so it follows the page rather than a dictionary.
              if (k === "inLanguage") return [k, locale];
              // Each mirror is monolingual, so the list it advertises is one
              // entry long whatever length it started as.
              if (k === "availableLanguage" || k === "knowsLanguage") {
                return [k, Array.isArray(v) ? [locale] : locale];
              }
              if (k.startsWith("@") || VERBATIM.has(k)) return [k, v];
              return [k, localise(v)];
            }),
          );
        }
        return node;
      };

      const indent = body.match(/\n(\s*)\S/)?.[1] ?? "      ";
      const json = JSON.stringify(localise(data), null, 2)
        .split("\n")
        .map((line, i) => (i === 0 ? line : indent + line))
        .join("\n");
      return `\n${indent}${json}\n${indent.slice(0, -2)}`;
    },
  });
}

/** A fresh, empty report. */
/**
 * A fresh, empty report.
 *
 *   translated  runs the dictionary covered, so coverage can be counted
 *   missing     runs that read as Spanish prose — the work queue
 *   review      everything else the dictionary does not know: names, acronyms,
 *               codes. Usually nothing to do, but never nothing to check.
 */
export const newReport = () => ({
  translated: new Map(),
  missing: new Map(),
  review: new Map(),
});

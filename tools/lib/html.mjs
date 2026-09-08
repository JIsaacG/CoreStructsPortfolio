/**
 * A small, forgiving HTML walker.
 *
 * The site emits its own markup, so this does not need to be a conformant
 * parser — it needs to be a *faithful* one: whatever it does not deliberately
 * rewrite must come out byte for byte as it went in. That constraint is what
 * makes it safe to run over 143 generated pages that contain inline SVG path
 * data, JSON-LD, data URIs and hand-tuned whitespace.
 *
 * It walks the source once and hands each piece to a callback:
 *
 *   onText(text, ctx)   a run of character data, with the tag it sits in
 *   onAttr(value, ctx)  one attribute value, with its name and its element
 *   onRaw(text, ctx)    the body of <script>/<style>, so JSON-LD can be reached
 *
 * A callback returns a replacement string, or `undefined` to leave the piece
 * exactly as it was. Returning `undefined` is not the same as returning the
 * input: an untouched piece is spliced back from the original source, so
 * entities and quoting survive a pass that had nothing to say about them.
 */

/** Elements whose content is character data, not markup. */
const RAW_ELEMENTS = new Set(["script", "style"]);

/** Elements that never have a closing tag. */
const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

/**
 * Parse the attribute list of a start tag.
 *
 * Returns the attributes and the offset where the list ended, so the caller can
 * rebuild the tag from the pieces it did not change.
 *
 * @param {string} source
 * @param {number} start  first character after the tag name
 * @returns {{ attrs: Array, end: number, selfClosing: boolean }}
 */
function parseAttributes(source, start) {
  const attrs = [];
  let i = start;

  while (i < source.length) {
    while (i < source.length && /\s/.test(source[i])) i++;
    if (i >= source.length) break;

    if (source[i] === ">") return { attrs, end: i, selfClosing: false };
    if (source[i] === "/" && source[i + 1] === ">") {
      return { attrs, end: i + 1, selfClosing: true };
    }

    // Attribute name.
    const nameStart = i;
    while (i < source.length && !/[\s=/>]/.test(source[i])) i++;
    const name = source.slice(nameStart, i);
    if (!name) { i++; continue; }

    // Optional value.
    const afterName = i;
    while (i < source.length && /\s/.test(source[i])) i++;

    if (source[i] !== "=") {
      attrs.push({ name, value: null, quote: "", start: nameStart, end: afterName });
      i = afterName;
      continue;
    }

    i++; // past '='
    while (i < source.length && /\s/.test(source[i])) i++;

    const quote = source[i] === '"' || source[i] === "'" ? source[i] : "";
    let value;
    let valueStart;
    let valueEnd;

    if (quote) {
      valueStart = i + 1;
      valueEnd = source.indexOf(quote, valueStart);
      if (valueEnd === -1) valueEnd = source.length;
      value = source.slice(valueStart, valueEnd);
      i = valueEnd + 1;
    } else {
      valueStart = i;
      while (i < source.length && !/[\s>]/.test(source[i])) i++;
      valueEnd = i;
      value = source.slice(valueStart, valueEnd);
    }

    attrs.push({ name, value, quote, start: nameStart, end: i, valueStart, valueEnd });
  }

  return { attrs, end: i, selfClosing: false };
}

/**
 * Walk `source`, rebuilding it from the callbacks' answers.
 *
 * @param {string} source
 * @param {object} handlers
 * @param {(text: string, ctx: object) => string|undefined} [handlers.onText]
 * @param {(value: string, ctx: object) => string|undefined} [handlers.onAttr]
 * @param {(text: string, ctx: object) => string|undefined} [handlers.onRaw]
 * @returns {string}
 */
export function transform(source, { onText, onAttr, onRaw } = {}) {
  let out = "";
  let i = 0;
  /** The open-element stack, so a text run knows what it is inside of. */
  const stack = [];

  /** Emit a run of character data through `onText`. */
  const emitText = (text) => {
    if (!text) return;
    if (!onText) { out += text; return; }
    const parent = stack.at(-1) ?? "";
    const replacement = onText(text, { parent, stack });
    out += replacement === undefined ? text : replacement;
  };

  while (i < source.length) {
    const next = source.indexOf("<", i);

    if (next === -1) { emitText(source.slice(i)); break; }
    emitText(source.slice(i, next));
    i = next;

    // Comment.
    if (source.startsWith("<!--", i)) {
      const end = source.indexOf("-->", i + 4);
      const stop = end === -1 ? source.length : end + 3;
      out += source.slice(i, stop);
      i = stop;
      continue;
    }

    // Doctype, CDATA and other declarations.
    if (source.startsWith("<!", i) || source.startsWith("<?", i)) {
      const end = source.indexOf(">", i);
      const stop = end === -1 ? source.length : end + 1;
      out += source.slice(i, stop);
      i = stop;
      continue;
    }

    // Closing tag.
    if (source.startsWith("</", i)) {
      const end = source.indexOf(">", i);
      const stop = end === -1 ? source.length : end + 1;
      const name = source.slice(i + 2, end === -1 ? source.length : end).trim().toLowerCase();
      const at = stack.lastIndexOf(name);
      if (at !== -1) stack.length = at;
      out += source.slice(i, stop);
      i = stop;
      continue;
    }

    // Anything else that is not a tag start is literal text.
    if (!/[a-zA-Z]/.test(source[i + 1] ?? "")) {
      emitText("<");
      i += 1;
      continue;
    }

    // Start tag.
    const nameStart = i + 1;
    let nameEnd = nameStart;
    while (nameEnd < source.length && !/[\s/>]/.test(source[nameEnd])) nameEnd++;
    const rawName = source.slice(nameStart, nameEnd);
    const name = rawName.toLowerCase();

    const { attrs, end, selfClosing } = parseAttributes(source, nameEnd);
    const tagEnd = source.indexOf(">", end);
    const stop = tagEnd === -1 ? source.length : tagEnd + 1;

    // Rebuild the tag, splicing in only the attribute values that changed.
    let tag = source.slice(i, stop);
    if (onAttr) {
      const byName = Object.fromEntries(attrs.map((a) => [a.name.toLowerCase(), a.value]));
      let rebuilt = "";
      let cursor = i;
      for (const attr of attrs) {
        if (attr.value === null || attr.valueStart === undefined) continue;
        const replacement = onAttr(attr.value, {
          name: attr.name.toLowerCase(),
          element: name,
          attrs: byName,
          quote: attr.quote,
        });
        if (replacement === undefined || replacement === attr.value) continue;
        rebuilt += source.slice(cursor, attr.valueStart) + replacement;
        cursor = attr.valueEnd;
      }
      if (rebuilt) tag = rebuilt + source.slice(cursor, stop);
    }
    out += tag;
    i = stop;

    if (selfClosing || VOID_ELEMENTS.has(name)) continue;

    // Raw-text elements: hand the body over whole and skip to the close tag.
    if (RAW_ELEMENTS.has(name)) {
      const closeAt = source.toLowerCase().indexOf(`</${name}`, i);
      const bodyEnd = closeAt === -1 ? source.length : closeAt;
      const body = source.slice(i, bodyEnd);
      if (onRaw) {
        const byName = Object.fromEntries(attrs.map((a) => [a.name.toLowerCase(), a.value]));
        const replacement = onRaw(body, { element: name, attrs: byName });
        out += replacement === undefined ? body : replacement;
      } else {
        out += body;
      }
      i = bodyEnd;
      continue;
    }

    stack.push(name);
  }

  return out;
}

/* --------------------------------------------------------------- entities */

const NAMED = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rarr: "→", larr: "←", darr: "↓", uarr: "↑",
  copy: "©", reg: "®", trade: "™", hellip: "…",
  mdash: "—", ndash: "–", middot: "·", bull: "•",
  laquo: "«", raquo: "»", ldquo: "“", rdquo: "”",
  lsquo: "‘", rsquo: "’", times: "×", deg: "°",
  eacute: "é", aacute: "á", iacute: "í", oacute: "ó",
  uacute: "ú", ntilde: "ñ", Ntilde: "Ñ", uuml: "ü",
  iexcl: "¡", iquest: "¿", euro: "€", check: "✓",
};

/** Decode the entities this codebase actually emits, plus numeric forms. */
export function decodeEntities(text) {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, body) => {
    if (body[0] === "#") {
      const code = body[1] === "x" || body[1] === "X"
        ? Number.parseInt(body.slice(2), 16)
        : Number.parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return NAMED[body] ?? match;
  });
}

/** The escaping the renderers use, so a translation round-trips identically. */
export const escapeText = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Attribute values additionally escape the quote they are held in. */
export const escapeAttr = (text, quote = '"') =>
  quote === "'" ? escapeText(text).replace(/'/g, "&#39;") : escapeText(text).replace(/"/g, "&quot;");

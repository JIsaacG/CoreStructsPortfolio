/**
 * The document shell every landing demo is written into.
 *
 * The three pages disagree about almost everything — palette, typeface, grid,
 * temperature — so what lives here is only what is genuinely common: the
 * escaping, the `<head>` contract (noindex, self-hosted fonts, one stylesheet),
 * and the CoreStruct furniture that frames all three (corner badge, mid-page
 * pitch, closing signature). Anything that carries a brand belongs in that
 * brand's renderer, not here.
 */

/* The CoreStruct isotype, as three flat paths. Small enough to inline, which
   is what keeps the badge from costing a request on every demo page. */
const ISOTYPE = `<path fill="#2c6fb2" d="M10 98L17 92L181 1L188 3L354 96L353 99L200 186L185 179L173 181L166 186L11 98Z"/><path fill="#3898d4" d="M188 421L188 373L190 371L320 295L320 248L318 248L188 324L188 217L198 211L202 203L202 197L358 111L361 109L361 165L233 234L233 275L361 200L361 321L189 421Z"/><path fill="#253880" d="M1 107L160 195L166 210L176 216L176 252L174 252L42 176L42 294L114 336L154 359L154 297L176 309L176 422L2 321L1 108Z"/>`;

export const escape = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** `#8b5cf6` -> `139 92 246`, the space-separated form every token uses. */
export function rgbTriple(hex) {
  const clean = hex.trim().replace("#", "");
  const n = Number.parseInt(clean, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** `**lifted**` inside a sentence. Applied after escaping, so data cannot inject. */
export const emphasise = (value) =>
  escape(value).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

/** Indent a block of markup so the generated file stays readable. */
export const indent = (block, spaces) =>
  block
    .split("\n")
    .map((line) => (line.trim() ? `${" ".repeat(spaces)}${line}` : line))
    .join("\n");

/**
 * Every landing preloads only the faces it actually sets. Keyed by the file
 * name in `assets/fonts/`, so a typo here fails the asset check rather than
 * silently shipping an unused preload.
 */
const FONT_FILES = {
  manrope: "manrope-latin.woff2",
  serif: "source-serif-4-latin.woff2",
  plex: "ibm-plex-sans-latin.woff2",
};

/**
 * @param {object} options
 * @param {string} options.title      the browser title, brand first
 * @param {string} options.description
 * @param {string} options.bundle     file name in `dist/`
 * @param {string[]} options.fonts    keys of FONT_FILES, in preload order
 * @param {string} options.themeColor the browser chrome colour
 * @param {"light"|"dark"} options.scheme
 * @param {string} [options.style]    the page's own inline custom properties
 */
export function head({ title, description, bundle, fonts, themeColor, scheme, style = "" }) {
  const preloads = fonts
    .map(
      (key) => `    <link
      rel="preload"
      href="../../assets/fonts/${FONT_FILES[key]}"
      as="font"
      type="font/woff2"
      crossorigin
    />`,
    )
    .join("\n");

  return `    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}" />
    <!-- An invented company must never turn up in a search result as a real one. -->
    <meta name="robots" content="noindex, follow" />
    <meta name="theme-color" content="${escape(themeColor)}" />
    <meta name="color-scheme" content="${escape(scheme)}" />

    <link rel="icon" href="../../favicon.ico" sizes="32x32" />
    <link rel="icon" href="../../assets/brand/isotipo.svg" type="image/svg+xml" />

${preloads}

    <link rel="stylesheet" href="../../dist/${escape(bundle)}" />
${style ? `\n${style}\n` : ""}
    <script>
      /* Hides the reveal targets before first paint, and gives up on its own if
         the module never arrives — an entrance animation must not be able to
         swallow the content it animates. */
      document.documentElement.classList.add("js");
      setTimeout(function () {
        if (!document.documentElement.dataset.revealsReady) {
          document.documentElement.classList.remove("js");
        }
      }, 2500);
    </script>`;
}

/** The corner badge. Same on all three pages, and always a link home. */
function badge() {
  return `      <a class="lp-badge" href="index.html">
        <svg class="lp-badge__mark" viewBox="0 0 362 422" aria-hidden="true" focusable="false">${ISOTYPE}</svg>
        <span class="lp-badge__tag">Demo</span>
        <span class="lp-badge__label">Sitio ficticio · CoreStruct</span>
      </a>`;
}

/**
 * The discreet mid-page pitch. One per landing, placed where the visitor has
 * seen enough of the work to want it.
 */
export function pitch({ text, cta = "Crear mi proyecto" }) {
  return `<aside class="lp-pitch" data-reveal="fade">
  <p class="lp-pitch__text">${emphasise(text)}</p>
  <a class="lp-pitch__link" href="../../index.html#contacto">
    ${escape(cta)}
    <span aria-hidden="true">&rarr;</span>
  </a>
</aside>`;
}

/**
 * The closing signature. It is the studio's, not the brand's, so it never
 * changes colour between pages — that constancy is what makes it read as a
 * signature instead of as another section.
 */
export function outro({ industry }) {
  return `      <section class="lp-outro" aria-labelledby="outro-title">
        <div class="lp-shell lp-outro__inner">
          <p class="lp-outro__mark" data-reveal="fade">
            <svg viewBox="0 0 362 422" aria-hidden="true" focusable="false">${ISOTYPE}</svg>
            Project by CoreStruct
          </p>
          <h2 class="lp-outro__title" id="outro-title" data-reveal="rise">
            ¿Te gustaría una experiencia como esta para tu empresa?
          </h2>
          <p class="lp-outro__text" data-reveal="rise">
            Esta es una demostración de las experiencias digitales que diseñamos y
            desarrollamos. La misma calidad se adapta a ${escape(industry)} — o a cualquier
            otra industria.
          </p>
          <div class="lp-outro__actions" data-reveal="rise">
            <a class="lp-outro__cta" href="../../index.html#contacto">
              Quiero algo así
              <span aria-hidden="true">&rarr;</span>
            </a>
            <a class="lp-outro__ghost" href="index.html">Ver las otras demos</a>
          </div>
          <p class="lp-outro__note" data-reveal="fade">
            Marca, cifras, testimonios y precios son ficticios y existen solo para esta demostración.
          </p>
        </div>
      </section>`;
}

/** The demonstrative WhatsApp action. Points at the page's own form, never out. */
export function floatingAction({ label, href }) {
  return `      <a class="lp-float" href="${escape(href)}" data-demo-action>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.88 9.88 0 0 0 12.04 2Zm0 1.82c2.18 0 4.23.85 5.77 2.39a8.1 8.1 0 0 1 2.39 5.77c0 4.5-3.66 8.15-8.16 8.15a8.2 8.2 0 0 1-4.16-1.14l-.3-.18-3.09.81.82-3.01-.2-.31a8.1 8.1 0 0 1-1.26-4.33c0-4.5 3.66-8.15 8.19-8.15Zm-2.5 4.36c-.19 0-.5.07-.76.35-.26.28-1 .98-1 2.38s1.02 2.76 1.17 2.95c.14.19 2 3.06 4.85 4.17 2.37.92 2.85.74 3.37.69.52-.05 1.67-.68 1.9-1.34.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.54-.33-.28-.14-1.67-.82-1.93-.92-.26-.09-.45-.14-.64.14-.19.28-.73.92-.9 1.11-.16.19-.33.21-.61.07-.28-.14-1.19-.44-2.27-1.4-.84-.75-1.4-1.67-1.57-1.95-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.52-.86-2.08-.23-.55-.46-.47-.63-.48h-.55Z"/>
        </svg>
        ${escape(label)}
      </a>`;
}

/**
 * @param {object} options
 * @param {string} options.head     already-rendered head content
 * @param {string} options.body     the page's `<main>` content
 * @param {string} options.chrome   header and menu, rendered by the brand
 * @param {string} options.script   module entry point, relative to the page
 * @param {string} [options.action] the floating action, if the page has one
 */
export function document_({ head: headMarkup, chrome, body, script, action = "" }) {
  /* The badge and the floating action are fixed to the viewport, so where they
     sit in the source is invisible — but it is not irrelevant. Loose at the top
     level they are content outside every landmark, which leaves a screen-reader
     user with two links belonging to no region. An <aside> is what they in fact
     are: supplementary to the page rather than part of it. */
  const supplementary = [`    <aside class="lp-aside" aria-label="Sobre esta demostración">`, badge(), action, `    </aside>`]
    .filter(Boolean)
    .join("\n");

  return `<!doctype html>
<html lang="es">
  <head>
${headMarkup}
  </head>

  <body>
    <a class="lp-skip" href="#contenido">Saltar al contenido</a>

${chrome}

    <main id="contenido">
${body}
    </main>

${supplementary}

    <script type="module" src="${escape(script)}"></script>
    <script type="module" src="../../src/scripts/cotizador.js"></script>
  </body>
</html>
`;
}

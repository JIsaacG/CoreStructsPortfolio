/**
 * Company-level content. Everything the page says about CoreStruct as an
 * organisation lives here, so copy and contact details are changed in one place.
 */

export const site = {
  name: "CoreStruct",
  legalName: "CoreStruct",
  url: "https://corestructhn.com",
  locale: "es",

  // Kept in step with the `<head>` of index.html by hand: the head is written
  // there rather than generated from here, because `build-content.mjs` only
  // fills the `<!-- build:… -->` regions in the body. Change one, change both.
  title: "Desarrollo web y software a medida en Honduras | CoreStruct",
  description:
    "Diseñamos y desarrollamos sitios web, plataformas y sistemas empresariales " +
    "a medida en Honduras y Latinoamérica. Cotiza tu proyecto con CoreStruct.",

  // Where the work is sold. `location` below names where the studio sits; this
  // names how far it reaches, and the two are different claims on purpose —
  // a buyer in San Pedro Sula searching "desarrollo web Honduras" needs to see
  // the country, not just the capital.
  //
  // The cities are listed one by one rather than folded into "Honduras"
  // because that is what the JSON-LD's `areaServed` turns into: a country
  // alone answers a national query, and named cities answer the local ones.
  // Add a city here only when the studio would genuinely take the work.
  areaServed: [
    "Honduras",
    "Tegucigalpa",
    "San Pedro Sula",
    "La Ceiba",
    "Choluteca",
    "Comayagua",
    "Danlí",
    "Puerto Cortés",
    "Roatán",
    "Latinoamérica",
  ],

  // The real channels. Anything left null or empty is simply not rendered, so
  // the page never shows a placeholder address — `whatsapp` is what every CTA
  // on the site, portfolio and demos alike, routes to. Nothing else has to
  // change to move the studio's number.
  contact: {
    // Full international number, digits only, no + and no spaces or dashes.
    // This one value is the destination of every quote request the site can
    // produce; were it ever unset the panel would fall back to `email`.
    whatsapp: "50492300861",

    // The inbox the quote panel copies every request to, and the first address
    // shown in the panel. Must be a mailbox the SMTP account in
    // `api/config.php` is allowed to deliver to.
    email: "contacto@corestructhn.com",

    // Any further addresses to list beneath it, e.g. a sales or support inbox.
    // ["ventas@corestructhn.com", "soporte@corestructhn.com"]
    emails: [],

    // Left unset because the WhatsApp row above already shows this exact
    // number, and a "Teléfono" row repeating it would be a second copy of one
    // fact. The number still reaches Google: it is the `telephone` of the
    // LocalBusiness node in the JSON-LD of `index.html`, where it has to match
    // the Google Business Profile digit for digit.
    phone: null,        // e.g. "+52 55 1234 5678"

    // The studio still takes work from anywhere — that is what `areaServed`
    // above says, and it says it in nine places. But a search engine cannot
    // place a business that never names a city, and "desarrollo web
    // Tegucigalpa" is a query no amount of national copy answers. So this
    // states the base and the reach in one line: where we are, and that being
    // there does not limit who we work for.
    location: "Tegucigalpa, Honduras — proyectos en todo el país y Latinoamérica",

    /**
     * The server-side endpoint that mails a copy of each quote request to
     * `email`. A browser cannot speak SMTP, so the panel POSTs the four fields
     * here and `api/contacto.php` does the delivery.
     *
     * Relative to the root of the site, and resolved against the location of
     * `cotizador-panel.js` itself — not against the page. That is what makes the one
     * value work from the portfolio, from the `en/` mirror and from inside the
     * six demo families (three different depths), and also when the whole site
     * is served from a subdirectory instead of from the root of a domain.
     *
     * An absolute URL works too, if the endpoint ever moves to another host.
     * Set it to null to turn the mail copy off and leave the panel handing the
     * request to WhatsApp alone.
     */
    quoteEndpoint: "api/contacto.php",
  },

  /**
   * The quick-quote panel — the chat-style form behind every "Hablemos" on the
   * site. `types` populates its one select; they are the portfolio's own eight
   * cards, so a request arrives already sorted into the kind of work it is.
   *
   * Both languages are kept here side by side rather than split between this
   * file and the panel's own copy table: this is the service catalogue, it
   * changes when the offer changes, and one list going stale against the other
   * is exactly what listing them together prevents. Keep them in step, and in
   * the same order — the two are read positionally by nothing, but a reader
   * comparing them is.
   */
  quote: {
    types: {
      es: [
        "Sitio corporativo o institucional",
        "Landing page de campaña",
        "Sistema empresarial a medida",
        "Portal educativo",
        "Portal gubernamental o público",
        "Carta digital / restaurante",
        "Automatización de procesos",
        "Aún no lo tengo claro",
      ],
      en: [
        "Corporate or institutional site",
        "Campaign landing page",
        "Custom business system",
        "Education portal",
        "Government or public portal",
        "Digital menu / restaurant",
        "Process automation",
        "Not sure yet",
      ],
    },
  },

  /**
   * The closing statement, animated one word at a time.
   *
   * It lives here as a sentence rather than as the markup it becomes because
   * the two languages do not split it into the same number of words. `**…**`
   * marks the half that is set in the contrasting face.
   */
  manifesto: {
    quote:
      "**",
    attribution: "CoreStruct · Principio de trabajo",
  },

  // Add entries as they exist; empty means the footer simply omits the list.
  //
  // The Google profile is here rather than treated as a social network because
  // it is the same kind of thing to a reader — a public page about the studio,
  // somewhere else — and because the footer is where somebody goes looking for
  // proof. It is also the page that collects reviews, which is the part of
  // local ranking no amount of markup substitutes for.
  //
  // The same URL appears as `sameAs` and `hasMap` in the JSON-LD of
  // `index.html`. That head is written by hand, so the two are kept in step the
  // same way the title and description are: change one, change both.
  social: [
    { label: "Reseñas en Google", href: "https://maps.app.goo.gl/1XTNuYUPWd3Z6GuEA" },
    // { label: "LinkedIn", href: "https://www.linkedin.com/company/…" },
    // { label: "Instagram", href: "https://instagram.com/…" },
  ],
};

/**
 * Primary navigation.
 *
 * An entry carries either an `id`, which must match a section id on the home
 * page, or an `href` to a page of its own. Every entry is now the first kind:
 * services used to be a hub page of its own, and is a band of the home page at
 * `#servicios` since the hub was folded into it.
 *
 * The three service pages below that hub still exist and still have to be
 * reachable, because each answers a different search and an anchor on a shared
 * URL cannot rank for three queries. The `#servicios` band links to all three,
 * which is the path the sitemap used to be the only source of.
 */
export const navigation = [
  { id: "servicios", label: "Servicios" },
  { id: "proyectos", label: "Proyectos" },
  { id: "alianzas", label: "Alianzas" },
  { id: "contacto", label: "Contacto" },
];

/**
 * Company-level content. Everything the page says about CoreStruct as an
 * organisation lives here, so copy and contact details are changed in one place.
 */

export const site = {
  name: "CoreStruct",
  legalName: "CoreStruct",
  url: "https://corestruct.com",
  locale: "es",

  // Kept in step with the `<head>` of index.html by hand: the head is written
  // there rather than generated from here, because `build-content.mjs` only
  // fills the `<!-- build:… -->` regions in the body. Change one, change both.
  title: "Desarrollo web y software a medida en Honduras | CoreStruct",
  description:
    "Diseñamos y desarrollamos sitios web, plataformas y sistemas empresariales " +
    "a medida en Honduras y Latinoamérica. Cotiza tu proyecto con CoreStruct.",

  // Where the work is sold, which is not the same as where the studio sits.
  // `location` below stays null on purpose; this is the reach the JSON-LD
  // declares through `areaServed`, and it narrows nothing.
  areaServed: ["Honduras", "Latinoamérica"],

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

    phone: null,        // e.g. "+52 55 1234 5678"

    // Deliberately unset: the studio works remotely and takes work from
    // anywhere, so naming a city would narrow the offer rather than qualify it.
    location: null,

    /**
     * The server-side endpoint that mails a copy of each quote request to
     * `email`. A browser cannot speak SMTP, so the panel POSTs the four fields
     * here and `api/contacto.php` does the delivery.
     *
     * Root-relative on purpose: the panel ships on the portfolio, on the `en/`
     * mirror and inside all six demo families, which sit at three different
     * depths. Set it to null to turn the mail copy off and leave the panel
     * handing the request to WhatsApp alone.
     */
    quoteEndpoint: "/api/contacto.php",
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
      "La tecnología debe adaptarse a tu empresa, **no tu empresa a la tecnología.**",
    attribution: "CoreStruct · Principio de trabajo",
  },

  // Add entries as they exist; empty means the footer simply omits the list.
  social: [
    // { label: "LinkedIn", href: "https://www.linkedin.com/company/…" },
    // { label: "Instagram", href: "https://instagram.com/…" },
  ],
};

/** Primary navigation. `id` must match a section id in the page. */
export const navigation = [
  { id: "proyectos", label: "Proyectos" },
  { id: "alianzas", label: "Alianzas" },
  { id: "contacto", label: "Contacto" },
];

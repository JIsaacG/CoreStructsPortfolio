/**
 * English for the CoreStruct portfolio itself — `index.html`, plus the words
 * the studio signs its demos with.
 *
 * Keys are the Spanish source text exactly as the page renders it, with runs of
 * whitespace collapsed; `tools/lib/i18n.mjs` normalises both sides before it
 * looks anything up, so a key can be written on one line here even when the
 * page wraps it over four.
 *
 * A term that is deliberately the same in both languages still gets an entry
 * mapping it to itself. That is not noise: it is the difference between "we
 * translated this and it did not change" and "we have not looked at this yet",
 * and only the first of those keeps it out of `tools/i18n-missing.txt`.
 */

export default {
  /* ------------------------------------------------------------- metadata */

  /* The title, description and social copy lead with what a buyer types, not
     with what the studio calls itself: "desarrollo web" and "software a medida"
     are the searched terms, and the country qualifies them. The English side
     swaps Honduras for Latin America — an English-speaking buyer is shopping
     for a region to nearshore to, and that is the phrase they search. */

  "Desarrollo web y software a medida en Honduras | CoreStruct":
    "Custom Web & Software Development in Latin America | CoreStruct",

  "Diseñamos y desarrollamos sitios web, plataformas y sistemas empresariales a medida en Honduras y Latinoamérica. Cotiza tu proyecto con CoreStruct.":
    "We design and build custom websites, platforms and business systems in Honduras " +
    "and Latin America. Get a quote from CoreStruct.",

  "CoreStruct — Desarrollo web y software a medida en Honduras":
    "CoreStruct — Custom web and software development in Honduras",

  "Sitios corporativos, plataformas web, sistemas empresariales y automatización a medida. Trabajamos desde Honduras para Latinoamérica.":
    "Corporate sites, web platforms, business systems and custom automation. " +
    "We work from Honduras for Latin America and beyond.",

  "CoreStruct — Desarrollo de software y experiencias digitales":
    "CoreStruct — Software development and digital experiences",

  "Estudio de tecnología y desarrollo de software. Construimos sitios corporativos, plataformas web, sistemas empresariales y automatizaciones a la medida de cada operación.":
    "A technology and software development studio. We build corporate sites, web platforms, " +
    "business systems and automation shaped around how each operation actually runs.",

  "Convertimos ideas en sistemas que funcionan: sitios corporativos, plataformas, sistemas empresariales y automatización.":
    "We turn ideas into systems that work: corporate sites, platforms, business systems and automation.",

  "Estudio de tecnología y desarrollo de software: sitios corporativos, plataformas web, sistemas empresariales, portales educativos, cartas digitales para restaurantes y automatización.":
    "A technology and software development studio: corporate sites, web platforms, business systems, " +
    "education portals, digital restaurant menus and automation.",

  "Estudio de tecnología y desarrollo de software.":
    "A technology and software development studio.",

  /* The `knowsAbout` list in the JSON-LD. */
  "Desarrollo web": "Web development",
  "Diseño web": "Web design",
  "Plataformas web": "Web platforms",
  "Sistemas empresariales": "Business systems",
  "Portales educativos": "Education portals",
  "Menús digitales para restaurantes": "Digital menus for restaurants",
  "Automatización de procesos": "Process automation",

  /* The rest of the JSON-LD: `areaServed`, the offer catalogue's own name, and
     the one service name the portfolio's cards do not already cover.
     `contactType` is schema.org vocabulary rather than prose — it maps to
     itself so that "unchanged" stays a decision on the record. */
  Honduras: "Honduras",
  Latinoamérica: "Latin America",
  Automatización: "Automation",
  "Servicios de desarrollo y diseño web": "Web development and design services",
  sales: "sales",

  /* --------------------------------------------------------------- chrome */

  "Saltar al contenido": "Skip to content",
  "CoreStruct — inicio": "CoreStruct — home",
  Principal: "Main",
  Menú: "Menu",
  "Abrir menú": "Open menu",
  "Abrir el menú": "Open menu",
  Secciones: "Sections",

  Proyectos: "Work",
  Alianzas: "Partnerships",

  /* Shared across the demos' navigation, so they live with the portfolio's own
     chrome rather than in any one site's file. */
  Empresa: "Company",
  Recursos: "Resources",
  Servicios: "Services",
  Contacto: "Contact",
  Hablemos: "Let's talk",
  "Iniciar un proyecto": "Start a project",
  Scroll: "Scroll",

  /* ----------------------------------------------------------------- hero */

  "Convertimos ideas": "We turn ideas",
  "en sistemas que": "into systems",
  "funcionan.": "that work.",

  Plataformas: "Platforms",
  Sistemas: "Systems",
  "Experiencias digitales": "Digital experiences",

  "Ver lo que podemos crear": "See what we can build",

  /* ------------------------------------------------------------ statement */

  "El punto de partida": "Where it starts",
  "Todo empieza": "It all begins",
  /* The second line is `con <em>una idea.</em>`, so it reaches the dictionary
     as the two runs either side of the emphasis. */
  con: "with",
  "una idea.": "an idea.",
  "Nosotros la convertimos en una experiencia digital que tu equipo puede operar y tus clientes entienden desde el primer momento.":
    "We turn it into a digital experience your team can run and your customers understand from the " +
    "very first moment.",

  /* ------------------------------------------------------------- projects */

  "Lo que podemos construir": "What we can build",
  "Ocho formas de resolver el mismo problema: que la tecnología acompañe la operación real de tu empresa, en lugar de imponerle una forma de trabajar.":
    "Eight ways of solving the same problem: technology that follows how your company actually " +
    "operates, instead of imposing a way of working on it.",

  Explorar: "Explore",
  "Explorar portal": "Explore the portal",

  /* Each card links to a demo, and the accessible name says so. */
  "Sitios corporativos — hablemos de tu proyecto": "Corporate sites — let's talk about your project",
  "Sitios gubernamentales — hablemos de tu proyecto":
    "Government sites — let's talk about your project",
  "Sistemas empresariales — hablemos de tu proyecto":
    "Business systems — let's talk about your project",
  "Landing pages — hablemos de tu proyecto": "Landing pages — let's talk about your project",
  "Portales educativos — hablemos de tu proyecto":
    "Education portals — let's talk about your project",
  "Restaurantes y menús — hablemos de tu proyecto":
    "Restaurants and menus — let's talk about your project",
  "Automatización — hablemos de tu proyecto": "Automation — let's talk about your project",
  "Soluciones a medida — hablemos de tu proyecto":
    "Bespoke solutions — let's talk about your project",

  /* 01 — Corporate sites */
  "Sitios corporativos": "Corporate sites",
  "Presencia institucional a medida: rápida, accesible y construida para sostener la reputación de la marca en cualquier dispositivo.":
    "A tailored institutional presence: fast, accessible, and built to carry the brand's reputation " +
    "on any device.",

  /* 02 — Government sites */
  "Sector público": "Public sector",
  "Sitios gubernamentales": "Government sites",
  "Portales institucionales con observatorio de indicadores, normativa, transparencia y participación ciudadana.":
    "Institutional portals with an indicator observatory, regulations, transparency and public " +
    "consultation.",

  /* 03 — Business systems */
  "Software a medida": "Bespoke software",
  "Expedientes, usuarios y operaciones en un sistema que se adapta a los procesos reales de la empresa.":
    "Records, users and operations in a system that adapts to how the company actually works.",

  /* 04 — Landing pages */
  Conversión: "Conversion",
  "Landing pages": "Landing pages",
  "Tres páginas construidas para tres negocios distintos, cada una enfocada en un único objetivo: que la persona correcta dé el siguiente paso.":
    "Three pages built for three different businesses, each aimed at a single outcome: getting the " +
    "right person to take the next step.",

  /* 05 — Education portals */
  Educación: "Education",
  "AUREA: un ecosistema digital que conecta admisiones, oferta académica, información institucional, calendario y servicios para toda la comunidad educativa.":
    "AUREA: a digital ecosystem connecting admissions, academic programmes, institutional " +
    "information, the calendar and services for the whole school community.",

  /* 06 — Restaurants and menus */
  Gastronomía: "Food and drink",
  "Restaurantes y menús": "Restaurants and menus",
  "Cartas digitales, catálogo de productos y pedidos en línea para restaurantes, cafeterías y marcas de bebidas.":
    "Digital menus, product catalogues and online ordering for restaurants, cafés and drinks brands.",

  /* 07 — Automation */
  Integración: "Integration",
  Automatización: "Automation",
  "Solicitudes, reglas de aprobación, documentos generados y trazabilidad: los procesos internos que hoy viven en correos y hojas de cálculo.":
    "Requests, approval rules, generated documents and an audit trail: the internal processes that " +
    "currently live in email threads and spreadsheets.",

  /* 08 — Bespoke solutions */
  Ingeniería: "Engineering",
  "Soluciones a medida": "Bespoke solutions",
  "Cuando nada estándar encaja, diseñamos el software alrededor de la operación del cliente — no al revés.":
    "When nothing off the shelf fits, we design the software around the client's operation — not " +
    "the other way round.",

  /* Words set into the card artwork itself. */
  "INGENIERÍA · TECNOLOGÍA · OPERACIÓN": "ENGINEERING · TECHNOLOGY · OPERATIONS",
  "BEBIDAS DE AUTOR": "SIGNATURE DRINKS",

  /* ------------------------------------------------------------ alliances */

  "No solo hacemos <em>páginas web.</em>": "We don't just build <em>web pages.</em>",

  "Institución educativa": "Educational institution",
  "Logotipo institucional de Virginia Sapp": "Virginia Sapp institutional logo",

  "Creamos para Virginia Sapp una <strong class=\"alliance__lift\">plataforma educativa digital que va más allá de una página web</strong>: centraliza su presencia institucional, admisiones, contenidos, recursos académicos y herramientas interactivas en una experiencia moderna, administrable y preparada para crecer junto con la institución.":
    'We built Virginia Sapp <strong class="alliance__lift">a digital education platform that goes ' +
    "well beyond a web page</strong>: it brings their institutional presence, admissions, content, " +
    "academic resources and interactive tools together in one modern experience they can administer " +
    "themselves and grow with the institution.",

  "Presencia institucional": "Institutional presence",
  Admisiones: "Admissions",
  "Contenidos y recursos": "Content and resources",
  "Herramientas interactivas": "Interactive tools",
  "Trabajamos con instituciones que necesitan una plataforma, no una página: proyectos que se mantienen, crecen y se administran desde adentro.":
    "We work with institutions that need a platform, not a page: projects that are maintained, that " +
    "grow, and that are run from the inside.",

  Alcance: "Scope",
  "Ver la plataforma": "View the platform",

  /* ------------------------------------------------------------ manifesto */

  /* Rendered one word per `<span>` so it can be animated word by word, which is
     why it is built from this single string rather than written as markup: the
     two languages do not agree on how many words the sentence takes. */
  "La tecnología debe adaptarse a tu empresa, **no tu empresa a la tecnología.**":
    "Technology should adapt to your company, **not your company to the technology.**",

  "CoreStruct · Principio de trabajo": "CoreStruct · A working principle",

  /* -------------------------------------------------------------- contact */

  "¿Tienes una idea?": "Have an idea?",
  "Nosotros podemos convertirla en una solución digital.":
    "We can turn it into a digital solution.",

  Correo: "Email",
  Teléfono: "Phone",
  Cobertura: "Coverage",
  "Servicio remoto · Latinoamérica": "Remote · Latin America",

  /* ---------------------------------------------------- the studio's mark */

  /* The studio's own name, wherever a demo signs itself. */
  CoreStruct: "CoreStruct",
  Demo: "Demo",
  "Sitio ficticio · CoreStruct": "Fictional site · CoreStruct",
  "Volver al portafolio": "Back to the portfolio",
  "Crear mi proyecto": "Start my project",
  "Hablemos de tu proyecto": "Let's talk about your project",
};

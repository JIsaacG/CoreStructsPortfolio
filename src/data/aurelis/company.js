/**
 * Aurelis Group — the company itself.
 *
 * Everything an institution says about its own identity: the legal block, the
 * offices, the client wall, the certifications, the board, the history. It is
 * separated from the page content on purpose — this is the file a real client
 * would rewrite first, and rewriting it should not require touching a layout.
 *
 * AURELIS GROUP IS INVENTED. Every figure, client, certificate and address
 * below is demonstration material for a CoreStruct portfolio piece. The badge
 * fixed to the corner of every page says so out loud, and every page is
 * noindex, so the fiction never leaks into a search result as a real firm.
 */

export const company = {
  name: "Aurelis",
  suffix: "Group",
  full: "Aurelis Group",
  descriptor: "Ingeniería · Tecnología · Operación",
  legalName: "Aurelis Group, S.A. de C.V.",
  founded: "1998",
  locale: "es",

  /** One sentence that must survive being read alone, in a search result. */
  summary:
    "Grupo de ingeniería, tecnología y operación para infraestructura crítica. " +
    "Diseñamos, construimos y operamos activos industriales, energéticos y " +
    "logísticos en doce mercados.",

  /** The four figures the hero and the footer both quote. */
  figures: [
    { value: "25", sup: "+", label: "Años de operación", note: "Constituida en 1998" },
    { value: "12", label: "Mercados", note: "Cinco oficinas permanentes" },
    { value: "350", sup: "+", label: "Proyectos ejecutados", note: "Industria, energía, infraestructura" },
    { value: "98", sup: "%", label: "Retención de clientes", note: "Contratos renovados a 5 años" },
  ],
};

/* ------------------------------------------------------------------- pages */

/**
 * Every page in the portal, keyed by the id used everywhere else.
 * `path` is relative to `demos/aurelis/`; the builder turns it into the right
 * number of `../` for whichever page is being written.
 */
export const routes = {
  home: "index.html",
  empresa: "empresa.html",
  servicios: "servicios.html",
  industrias: "industrias.html",
  productos: "productos.html",
  proyectos: "proyectos.html",
  recursos: "recursos.html",
  contacto: "contacto.html",
};

/**
 * The header. `mega` names the section whose panel opens beneath the item —
 * only two of them have one, because a mega menu on every item is a site map
 * with extra steps.
 */
export const navigation = [
  { label: "Soluciones", route: "servicios", mega: "soluciones" },
  { label: "Productos y Servicios", route: "productos", mega: "productos" },
  { label: "Industrias", route: "industrias", mega: "industrias" },
  { label: "Proyectos", route: "proyectos" },
  { label: "Empresa", route: "empresa" },
  { label: "Recursos", route: "recursos" },
];

/* ----------------------------------------------------------------- offices */

/**
 * The five permanent offices, with the coordinates the drawn map plots them at.
 * `kind` is what separates a head office from a service centre on the card.
 */
export const offices = [
  {
    id: "tegucigalpa",
    city: "Tegucigalpa",
    country: "Honduras",
    kind: "Casa matriz",
    lon: -87.2,
    lat: 14.1,
    text: "Dirección corporativa, ingeniería de proyecto y el centro de control de operaciones que cubre la región.",
    anchor: "start",
  },
  {
    id: "houston",
    city: "Houston",
    country: "Estados Unidos",
    kind: "Ingeniería y compras",
    lon: -95.4,
    lat: 29.8,
    text: "Ingeniería de detalle para energía y proceso, y la mesa de abastecimiento de equipo mayor.",
    anchor: "start",
  },
  {
    id: "cdmx",
    city: "Ciudad de México",
    country: "México",
    kind: "Oficina regional",
    lon: -99.1,
    lat: 19.4,
    text: "Operación norte: manufactura, logística y los contratos de mantenimiento de la zona del Bajío.",
    anchor: "end",
  },
  {
    id: "bogota",
    city: "Bogotá",
    country: "Colombia",
    kind: "Oficina regional",
    lon: -74.1,
    lat: 4.7,
    text: "Infraestructura y agua para el mercado andino, con taller propio de instrumentación.",
    anchor: "start",
  },
  {
    id: "madrid",
    city: "Madrid",
    country: "España",
    kind: "Centro técnico",
    lon: -3.7,
    lat: 40.4,
    text: "Ingeniería de sistemas, ciberseguridad industrial y la relación con fabricantes europeos.",
    anchor: "start",
  },
];

/* ------------------------------------------------------------- client wall */

/**
 * The client wall. Invented companies, monochrome, each with a small geometric
 * device instead of a logotype — a fake logo that tries to look like a real
 * brand is worse than one that admits it is a placeholder.
 *
 * `glyph` names a device drawn in `renderMark()`.
 */
export const clients = [
  { name: "Norvik Energía", glyph: "hex" },
  { name: "Puerto Aranda", glyph: "arc" },
  { name: "Cementos Talara", glyph: "stack" },
  { name: "Grupo Meridian", glyph: "ring" },
  { name: "Hidralsa", glyph: "wave" },
  { name: "Transandina", glyph: "chevron" },
  { name: "Acero del Norte", glyph: "bars" },
  { name: "Vega Minerals", glyph: "prism" },
  { name: "Banco Peninsular", glyph: "grid" },
  { name: "Agroindustrias del Valle", glyph: "leaf" },
];

/* --------------------------------------------------------- certifications */

export const certifications = {
  label: "Certificaciones y acreditaciones",
  title: "Lo que respalda cada contrato",
  text:
    "Las certificaciones que aparecen aquí son demostrativas. La estructura está " +
    "preparada para sustituirlas por las acreditaciones reales de la empresa, con su " +
    "número de certificado, su organismo emisor y su vigencia.",
  items: [
    { code: "ISO 9001", name: "Gestión de calidad", text: "Alcance: ingeniería, construcción y operación. Auditoría de seguimiento anual." },
    { code: "ISO 14001", name: "Gestión ambiental", text: "Aplicada a obra, talleres y las cinco sedes permanentes." },
    { code: "ISO 45001", name: "Seguridad y salud", text: "Cero incidentes con tiempo perdido en los últimos 18 meses de obra." },
    { code: "ISO 27001", name: "Seguridad de la información", text: "Cubre el centro de control de operaciones y la plataforma de telemetría." },
    { code: "IEC 62443", name: "Ciberseguridad industrial", text: "Nivel SL-2 sobre las arquitecturas de control que integramos." },
    { code: "ASME · IX", name: "Calificación de soldadura", text: "Procedimientos y soldadores calificados para recipientes a presión." },
  ],
  partners: [
    "Cámara de Industria y Comercio",
    "Consejo Empresarial de Energía",
    "Asociación de Ingenieros Consultores",
    "Red de Infraestructura Sostenible",
  ],
};

/* ------------------------------------------------------------- leadership */

export const leadership = {
  label: "Liderazgo",
  title: "Quién responde por el trabajo",
  text:
    "Un comité ejecutivo de cuatro personas, con responsabilidad directa sobre " +
    "contratos, seguridad y resultado técnico.",
  people: [
    {
      initials: "MR",
      name: "Marcela Ruiz Alvarado",
      role: "Directora General",
      text: "Veintidós años en gestión de proyectos de infraestructura. Dirige el grupo desde 2016.",
    },
    {
      initials: "JV",
      name: "Joaquín Vidal Ferrer",
      role: "Director de Operaciones",
      text: "Responsable de obra, talleres y los contratos de mantenimiento en los cinco países.",
    },
    {
      initials: "AK",
      name: "Anjali Kapoor Restrepo",
      role: "Directora Técnica",
      text: "Ingeniería de proceso y sistemas de control. Preside el comité de diseño.",
    },
    {
      initials: "DS",
      name: "Diego Sandoval Pineda",
      role: "Director Comercial",
      text: "Estructuración de contratos, alianzas industriales y relación con fabricantes.",
    },
  ],
};

/* ----------------------------------------------------------------- history */

export const history = {
  label: "Historia",
  title: "Veintiocho años de una decisión a la vez",
  milestones: [
    { year: "1998", title: "Constitución", text: "Cuatro ingenieros y un contrato de mantenimiento en una planta de alimentos." },
    { year: "2003", title: "Primer taller propio", text: "Fabricación e instrumentación en Tegucigalpa. Deja de subcontratarse la parte crítica." },
    { year: "2008", title: "Salida regional", text: "Primer contrato fuera del país: una subestación en el norte de Colombia." },
    { year: "2014", title: "Contrato de operación", text: "El grupo asume disponibilidad, no sólo entrega. Nace el centro de control." },
    { year: "2019", title: "División digital", text: "Telemetría, mantenimiento predictivo y la plataforma que hoy opera 4 800 activos." },
    { year: "2023", title: "Madrid", text: "Centro técnico europeo: sistemas de control, ciberseguridad industrial y homologaciones." },
    { year: "2026", title: "Programa 2030", text: "Plan de inversión a cinco años en capacidad de fabricación y energía propia." },
  ],
};

export const values = {
  label: "Valores",
  title: "Cuatro reglas que no se negocian en contrato",
  items: [
    { title: "La cifra antes que el adjetivo", text: "Ninguna propuesta sale sin una línea base medida y un objetivo verificable." },
    { title: "Quien diseña, opera", text: "El equipo de ingeniería acompaña la puesta en marcha. No hay entrega por encima del muro." },
    { title: "Seguridad como condición", text: "Un trabajo que no puede hacerse con seguridad no se hace. Se rediseña o se rechaza." },
    { title: "Transparencia del costo", text: "Estructura de precios abierta, con horas, equipo y contingencia declarados por separado." },
  ],
};

export const governance = {
  label: "Gobierno corporativo",
  title: "Cómo se decide",
  text:
    "La estructura de gobierno es la parte que un comprador corporativo revisa antes " +
    "de firmar. Se detalla igual que se detallaría en un memorando de información.",
  items: [
    { term: "Consejo de administración", detail: "Siete miembros, tres de ellos independientes. Se reúne trimestralmente." },
    { term: "Comité de auditoría", detail: "Presidido por un consejero independiente. Estados financieros auditados externamente desde 2009." },
    { term: "Comité de riesgo y seguridad", detail: "Revisa incidentes, casi-accidentes y planes de continuidad cada mes." },
    { term: "Código de conducta", detail: "Aplicable a personal, proveedores y socios. Canal de denuncia gestionado por un tercero." },
    { term: "Política anticorrupción", detail: "Debida diligencia obligatoria sobre contrapartes y agentes en los doce mercados." },
  ],
};

export const sustainability = {
  label: "Sostenibilidad",
  title: "Crecer responsablemente",
  text:
    "Los compromisos ambientales, sociales y de gobernanza se publican con la misma " +
    "métrica que los resultados operativos: si no se mide, no se declara.",
  pillars: [
    {
      title: "Ambiente",
      figure: "-34 %",
      text: "Intensidad de emisiones por proyecto ejecutado frente a la línea base de 2019. Meta 2030: -60 %.",
    },
    {
      title: "Personas",
      figure: "1 240",
      text: "Personas empleadas de forma directa. 38 % del personal técnico son mujeres; la meta a 2030 es 45 %.",
    },
    {
      title: "Gobernanza",
      figure: "100 %",
      text: "Proveedores críticos evaluados en cumplimiento, seguridad laboral y trazabilidad de materiales.",
    },
  ],
};

/* ----------------------------------------------------------------- contact */

export const contact = {
  email: "contacto@aurelisgroup.demo",
  phone: "+504 2200 4100",
  phoneHref: "+50422004100",
  address: "Torre Aurelis, Boulevard Morazán 1420, Tegucigalpa, Honduras",
  hours: "Lunes a viernes · 07:30 – 17:30 (GMT-6)",
  linkedin: "Aurelis Group",
  services: [
    "Ingeniería y diseño",
    "Infraestructura",
    "Operación y mantenimiento",
    "Transformación digital",
    "Consultoría estratégica",
    "Sistemas y equipamiento",
    "Otro / no estoy seguro",
  ],
};

/* ------------------------------------------------------------------ footer */

export const footer = {
  pitch:
    "Ingeniería, tecnología y operación para activos que no pueden detenerse. " +
    "Constituida en 1998, con presencia permanente en cinco países.",
  columns: [
    {
      heading: "Empresa",
      links: [
        { label: "Quiénes somos", route: "empresa" },
        { label: "Historia", route: "empresa", hash: "historia" },
        { label: "Liderazgo", route: "empresa", hash: "liderazgo" },
        { label: "Gobierno corporativo", route: "empresa", hash: "gobierno" },
        { label: "Sostenibilidad", route: "empresa", hash: "sostenibilidad" },
      ],
    },
    {
      heading: "Soluciones",
      links: [
        { label: "Todas las soluciones", route: "servicios" },
        { label: "Industrias", route: "industrias" },
        { label: "Productos", route: "productos" },
        { label: "Proyectos", route: "proyectos" },
      ],
    },
    {
      heading: "Recursos y soporte",
      links: [
        { label: "Análisis e informes", route: "recursos" },
        { label: "Contacto", route: "contacto" },
        { label: "Solicitar cotización", route: "contacto", hash: "formulario" },
        { label: "Atención a clientes", route: "contacto", hash: "canales" },
      ],
    },
  ],
  legalBlock: [
    { term: "Razón social", detail: "Aurelis Group, S.A. de C.V." },
    { term: "Registro mercantil", detail: "RTN 0801-1998-114302 · Folio 12 480" },
    { term: "Domicilio fiscal", detail: "Torre Aurelis, Boulevard Morazán 1420, Tegucigalpa" },
    { term: "Atención corporativa", detail: "+504 2200 4100 · contacto@aurelisgroup.demo" },
  ],
  legalLinks: [
    { label: "Privacidad", hash: "aviso" },
    { label: "Cookies", hash: "aviso" },
    { label: "Términos", hash: "aviso" },
    { label: "Accesibilidad", hash: "aviso" },
  ],
};

/**
 * The institution the portal belongs to — invented from scratch.
 *
 * CEDE does not exist. It is a demonstration of the kind of coordinating body a
 * national education system has: a council that holds the information, the
 * planning and the public record, without running schools itself. Nothing here
 * is taken from a real organism — not the mandate, not the structure, not the
 * codes, not the contact details. The wording is original and the fiction is
 * declared on every page (institutional bar, badge, footer).
 *
 * Everything a deployment would rebrand lives in this one file.
 */

export const institution = {
  name: "Consejo Estratégico",
  suffix: "para el Desarrollo Educativo",
  short: "CEDE",
  full: "Consejo Estratégico para el Desarrollo Educativo",
  descriptor: "Sistema Nacional de Información y Política Educativa",
  country: "Honduras",
  founded: "2021",
  summary:
    "Entidad ficticia de coordinación educativa creada para esta demostración: articula " +
    "instituciones, produce información pública y da seguimiento a la política educativa nacional.",
  /* `.example` is the TLD reserved for documentation — the canonical tags show
     the structure a real deployment needs without claiming anyone's domain. */
  origin: "https://www.cede.example",
};

/** The demonstration notice, in the three places it appears. */
export const notice = {
  bar: "Portal público · Concepto demostrativo",
  tag: "DEMO",
  short: "Entidad ficticia · no es un sitio oficial",
  long:
    "Concepto de portafolio. Entidad ficticia. Este sitio no representa a ninguna " +
    "institución gubernamental real.",
  data:
    "Las cifras presentadas en este prototipo son simulaciones creadas exclusivamente " +
    "para demostrar las capacidades de la plataforma.",
  dataShort: "Datos demostrativos",
};

/** Contact block. Every value is invented and labelled as such. */
export const contact = {
  address: "Avenida de la República 1200, Tegucigalpa, M.D.C.",
  addressNote: "Dirección demostrativa",
  phone: "+504 0000-0000",
  phoneNote: "Teléfono demostrativo",
  email: "contacto@cede.example",
  emailNote: "Correo demostrativo",
  hours: "Lunes a viernes, 8:00 a 16:00",
  info: "informacion@cede.example",
};

/* --------------------------------------------------------------- routing */

/**
 * Every page of the portal, by key.
 *
 * A route is written once here and resolved relative to whichever page is being
 * emitted, so a page three directories deep never hard-codes `../../`.
 */
export const routes = {
  home: "index.html",
  institucion: "institucion.html",
  politica: "politica-educativa.html",
  planificacion: "planificacion.html",
  datos: "datos.html",
  comparador: "datos/comparador.html",
  metodologia: "datos/metodologia.html",
  abiertos: "datos-abiertos.html",
  normativa: "normativa.html",
  resoluciones: "resoluciones.html",
  biblioteca: "biblioteca.html",
  programas: "programas.html",
  participacion: "participacion.html",
  transparencia: "transparencia.html",
  actualidad: "actualidad.html",
  contacto: "contacto.html",
  buscar: "buscar.html",
  gestion: "gestion-demo.html",
  noEncontrada: "404.html",
};

/* ------------------------------------------------------------ navigation */

/**
 * The main navigation.
 *
 * Nine sections, four of them with a mega panel. The panels are for the
 * sections a visitor *browses*; the rest are single destinations and a panel
 * would only add a click.
 */
export const navigation = [
  {
    label: "Institución",
    route: "institucion",
    mega: "institucion",
    summary: "Quiénes somos, qué hacemos y cómo se toman las decisiones.",
    columns: [
      {
        heading: "El Consejo",
        links: [
          { label: "Mandato y funciones", route: "institucion", hash: "mandato" },
          { label: "Misión y visión", route: "institucion", hash: "mision" },
          { label: "Principios", route: "institucion", hash: "principios" },
          { label: "Historia institucional", route: "institucion", hash: "historia" },
        ],
      },
      {
        heading: "Organización",
        links: [
          { label: "Estructura", route: "institucion", hash: "estructura" },
          { label: "Directorio institucional", route: "institucion", hash: "directorio" },
          { label: "Sistema educativo articulado", route: "institucion", hash: "red" },
          { label: "Contacto", route: "contacto" },
        ],
      },
    ],
  },
  {
    label: "Política Educativa",
    route: "politica",
    mega: "politica",
    summary: "El marco que orienta las decisiones del sistema educativo.",
    columns: [
      {
        heading: "Marco",
        links: [
          { label: "Qué es una política educativa", route: "politica", hash: "que-es" },
          { label: "Objetivos y principios", route: "politica", hash: "objetivos" },
          { label: "Líneas estratégicas", route: "politica", hash: "lineas" },
          { label: "Mecanismos de seguimiento", route: "politica", hash: "seguimiento" },
        ],
      },
      {
        heading: "Agenda",
        links: [
          { label: "Políticas vigentes", route: "politica", hash: "agenda" },
          { label: "En formulación", route: "politica", hash: "agenda" },
          { label: "En consulta pública", route: "participacion" },
          { label: "Documentos de política", route: "biblioteca" },
        ],
      },
    ],
  },
  { label: "Planificación", route: "planificacion" },
  {
    label: "Datos e Indicadores",
    route: "datos",
    mega: "datos",
    summary: "El estado del sistema educativo, medido y publicado.",
    feature: {
      title: "Observatorio Educativo",
      text: "Diez tableros, dieciocho departamentos y series desde 2019.",
      route: "datos",
    },
    columns: [
      {
        heading: "Tableros",
        links: [
          { label: "Panorama nacional", route: "datos", hash: "panorama" },
          { label: "Matrícula", route: "datos", hash: "matricula" },
          { label: "Cobertura y acceso", route: "datos", hash: "cobertura" },
          { label: "Permanencia", route: "datos", hash: "permanencia" },
          { label: "Docentes", route: "datos", hash: "docentes" },
        ],
      },
      {
        heading: " ",
        links: [
          { label: "Infraestructura", route: "datos", hash: "infraestructura" },
          { label: "Educación técnica", route: "datos", hash: "tecnica" },
          { label: "Inclusión", route: "datos", hash: "inclusion" },
          { label: "Financiamiento", route: "datos", hash: "financiamiento" },
          { label: "ODS 4", route: "datos", hash: "ods4" },
        ],
      },
      {
        heading: "Herramientas",
        links: [
          { label: "Comparar territorios", route: "comparador" },
          { label: "Catálogo de datos abiertos", route: "abiertos" },
          { label: "Metodología de datos", route: "metodologia" },
        ],
      },
    ],
  },
  {
    label: "Normativa",
    route: "normativa",
    mega: "normativa",
    summary: "El marco jurídico y las decisiones del Consejo, en un solo lugar.",
    columns: [
      {
        heading: "Por tipo",
        links: [
          { label: "Leyes", route: "normativa", hash: "ley" },
          { label: "Reglamentos", route: "normativa", hash: "reglamento" },
          { label: "Acuerdos", route: "normativa", hash: "acuerdo" },
        ],
      },
      {
        heading: " ",
        links: [
          { label: "Políticas", route: "normativa", hash: "politica" },
          { label: "Lineamientos", route: "normativa", hash: "lineamiento" },
          { label: "Resoluciones", route: "resoluciones" },
        ],
      },
      {
        heading: "Consulta",
        links: [
          { label: "Buscador de normativa", route: "normativa", hash: "buscador" },
          { label: "Resoluciones y acuerdos", route: "resoluciones" },
          { label: "Biblioteca digital", route: "biblioteca" },
        ],
      },
    ],
  },
  { label: "Programas", route: "programas" },
  {
    label: "Participación",
    route: "participacion",
    mega: "participacion",
    summary: "Los espacios donde la ciudadanía incide en la política educativa.",
    columns: [
      {
        heading: "Mecanismos",
        links: [
          { label: "Consultas públicas", route: "participacion", hash: "consultas" },
          { label: "Foros y mesas de diálogo", route: "participacion", hash: "foros" },
          { label: "Encuestas", route: "participacion", hash: "encuestas" },
          { label: "Audiencias", route: "participacion", hash: "audiencias" },
        ],
      },
      {
        heading: "Agenda",
        links: [
          { label: "Calendario institucional", route: "actualidad", hash: "agenda" },
          { label: "Cómo participar", route: "participacion", hash: "como" },
          { label: "Solicitudes de información", route: "transparencia", hash: "solicitudes" },
        ],
      },
    ],
  },
  { label: "Transparencia", route: "transparencia" },
  { label: "Actualidad", route: "actualidad" },
];

/* ---------------------------------------------------------------- footer */

export const footer = {
  pitch:
    "Información pública, política educativa y planificación nacional en un solo sistema. " +
    "Portal demostrativo de una entidad ficticia.",
  columns: [
    {
      heading: "Institución",
      links: [
        { label: "Mandato y funciones", route: "institucion", hash: "mandato" },
        { label: "Estructura", route: "institucion", hash: "estructura" },
        { label: "Directorio institucional", route: "institucion", hash: "directorio" },
        { label: "Contacto", route: "contacto" },
      ],
    },
    {
      heading: "Política y planificación",
      links: [
        { label: "Política educativa", route: "politica" },
        { label: "Plan Nacional 2026–2035", route: "planificacion" },
        { label: "Monitor del Plan", route: "planificacion", hash: "monitor" },
        { label: "Programas", route: "programas" },
      ],
    },
    {
      heading: "Datos",
      links: [
        { label: "Observatorio Educativo", route: "datos" },
        { label: "Comparar territorios", route: "comparador" },
        { label: "Datos abiertos", route: "abiertos" },
        { label: "Metodología", route: "metodologia" },
      ],
    },
    {
      heading: "Normativa",
      links: [
        { label: "Marco normativo", route: "normativa" },
        { label: "Resoluciones y acuerdos", route: "resoluciones" },
        { label: "Biblioteca digital", route: "biblioteca" },
      ],
    },
    {
      heading: "Participación",
      links: [
        { label: "Consultas públicas", route: "participacion", hash: "consultas" },
        { label: "Foros y mesas", route: "participacion", hash: "foros" },
        { label: "Actualidad", route: "actualidad" },
        { label: "Agenda", route: "actualidad", hash: "agenda" },
      ],
    },
    {
      heading: "Transparencia",
      links: [
        { label: "Portal de transparencia", route: "transparencia" },
        { label: "Presupuesto", route: "transparencia", hash: "presupuesto" },
        { label: "Rendición de cuentas", route: "transparencia", hash: "rendicion" },
        { label: "Solicitudes de información", route: "transparencia", hash: "solicitudes" },
      ],
    },
  ],
  /* The service links every public portal carries at the bottom. In the demo
     they resolve to the notice; in a deployment each becomes a page. */
  service: [
    { label: "Mapa del sitio", route: "buscar", hash: "mapa" },
    { label: "Política de privacidad", hash: "aviso" },
    { label: "Accesibilidad", hash: "aviso" },
    { label: "Términos de uso", hash: "aviso" },
    { label: "Datos abiertos", route: "abiertos" },
    { label: "Reportar un problema técnico", route: "contacto", hash: "formulario" },
  ],
  version: "Versión del portal 1.0.0 · demostración",
  updated: "26 de agosto de 2026",
};

/* ----------------------------------------------------------- the mandate */

export const mandate = {
  title: "Articular para avanzar.",
  lead:
    "Coordinamos capacidades institucionales para convertir información, diálogo y " +
    "planificación en mejores decisiones educativas.",
  body:
    "El Consejo no administra centros educativos ni sustituye a las instituciones que " +
    "integran el sistema. Su función es distinta y complementaria: sostener una lectura " +
    "común del estado de la educación, ordenar la conversación entre quienes deciden y " +
    "dejar constancia pública de lo acordado.\n\n" +
    "Esa función se ejerce con tres instrumentos. El primero es la información: una base " +
    "estadística única, documentada y abierta, que permite discutir sobre hechos y no sobre " +
    "impresiones. El segundo es la planificación: un plan nacional de largo plazo con metas " +
    "verificables y un tablero público de avance. El tercero es la participación: espacios " +
    "formales donde la ciudadanía, los docentes y el sector productivo inciden antes de que " +
    "una política se apruebe, no después.",
  mission:
    "Producir y articular la información, la planificación y los espacios de diálogo que el " +
    "sistema educativo necesita para tomar decisiones basadas en evidencia.",
  vision:
    "Un sistema educativo que conoce su propio estado en tiempo real, planifica a diez años " +
    "y rinde cuentas de cada meta ante la ciudadanía.",
  functions: [
    {
      index: "01",
      title: "Información educativa",
      text:
        "Consolidar, validar y publicar las estadísticas del sistema educativo nacional, con " +
        "metodología documentada y datos abiertos por defecto.",
    },
    {
      index: "02",
      title: "Planificación nacional",
      text:
        "Formular el plan educativo de largo plazo, traducirlo en metas medibles y dar " +
        "seguimiento público a su ejecución.",
    },
    {
      index: "03",
      title: "Seguimiento de políticas",
      text:
        "Evaluar la aplicación de las políticas vigentes y emitir recomendaciones técnicas a " +
        "las instituciones responsables.",
    },
    {
      index: "04",
      title: "Articulación interinstitucional",
      text:
        "Convocar a las entidades del sistema —educación pública, superior, formación " +
        "profesional y gobiernos locales— alrededor de una agenda común.",
    },
    {
      index: "05",
      title: "Participación ciudadana",
      text:
        "Organizar consultas públicas, foros y mesas técnicas, y publicar cómo cada aporte " +
        "se incorporó a la decisión final.",
    },
    {
      index: "06",
      title: "Investigación y prospectiva",
      text:
        "Producir estudios sobre los desafíos de mediano plazo del sistema y anticipar las " +
        "competencias que el país necesitará.",
    },
  ],
  principles: [
    {
      index: "01",
      title: "Evidencia antes que opinión",
      text: "Ninguna recomendación del Consejo se emite sin la base estadística que la sostiene.",
    },
    {
      index: "02",
      title: "Publicidad por defecto",
      text: "Lo que el Consejo produce es público, salvo que una norma expresa lo reserve.",
    },
    {
      index: "03",
      title: "Neutralidad institucional",
      text: "El Consejo informa y articula; no promueve programas de gobierno ni posiciones partidarias.",
    },
    {
      index: "04",
      title: "Equidad territorial",
      text: "Toda cifra nacional se publica desagregada: un promedio que oculta una brecha no informa.",
    },
    {
      index: "05",
      title: "Continuidad",
      text: "Las series estadísticas y los planes se sostienen entre administraciones.",
    },
    {
      index: "06",
      title: "Accesibilidad",
      text: "La información pública se diseña para ser usada por cualquier persona, sin excepción.",
    },
  ],
  history: [
    {
      year: "2021",
      title: "Creación del Consejo",
      text:
        "Se constituye como instancia de coordinación entre las entidades del sistema " +
        "educativo, con secretaría técnica permanente.",
    },
    {
      year: "2022",
      title: "Primer sistema de indicadores",
      text:
        "Se define el conjunto mínimo de indicadores educativos nacionales y se acuerda su " +
        "metodología de cálculo.",
    },
    {
      year: "2023",
      title: "Apertura de datos",
      text:
        "Se publica el primer catálogo de datos abiertos educativos, con series históricas y " +
        "diccionario de variables.",
    },
    {
      year: "2024",
      title: "Consultas públicas",
      text:
        "Se formaliza el mecanismo de consulta previa para toda política educativa de alcance nacional.",
    },
    {
      year: "2026",
      title: "Plan Nacional 2026–2035",
      text:
        "Se aprueba el plan de transformación educativa de largo plazo y su tablero público de seguimiento.",
    },
  ],
};

/**
 * The council's composition.
 *
 * Institutional seats, never named people: a demonstration portal that invents
 * officials invents a government. Each seat says what it contributes.
 */
export const directory = [
  {
    index: "01",
    seat: "Presidencia del Consejo",
    kind: "Órgano de dirección",
    text:
      "Convoca las sesiones, representa al Consejo ante las demás entidades del Estado y " +
      "somete a votación los acuerdos.",
  },
  {
    index: "02",
    seat: "Secretaría Técnica",
    kind: "Órgano permanente",
    text:
      "Prepara los expedientes técnicos, produce las estadísticas y sostiene el seguimiento " +
      "del plan nacional entre sesiones.",
  },
  {
    index: "03",
    seat: "Representación de educación pública",
    kind: "Sector institucional",
    text:
      "Aporta la información operativa del sistema escolar y aplica los lineamientos " +
      "acordados en el Consejo.",
  },
  {
    index: "04",
    seat: "Representación de educación superior",
    kind: "Sector institucional",
    text:
      "Vincula la política de educación media con la formación universitaria y la " +
      "investigación educativa.",
  },
  {
    index: "05",
    seat: "Representación de formación profesional",
    kind: "Sector institucional",
    text:
      "Articula la oferta técnica con las necesidades de competencias del mercado laboral.",
  },
  {
    index: "06",
    seat: "Representación académica",
    kind: "Sector consultivo",
    text:
      "Revisa metodológicamente los estudios del Consejo y aporta capacidad de investigación independiente.",
  },
  {
    index: "07",
    seat: "Representación del sector productivo",
    kind: "Sector consultivo",
    text:
      "Traslada la demanda de perfiles y competencias, y participa en la validación de la oferta técnica.",
  },
  {
    index: "08",
    seat: "Representación de sociedad civil",
    kind: "Sector consultivo",
    text:
      "Canaliza la voz de comunidades educativas, familias y organizaciones territoriales.",
  },
  {
    index: "09",
    seat: "Representación docente",
    kind: "Sector consultivo",
    text:
      "Aporta la perspectiva de la práctica en aula sobre toda política de formación y carrera docente.",
  },
];

/**
 * The system, drawn as a network rather than as an org chart.
 *
 * The point of the diagram is that no actor is above another: the council sits
 * in the middle because it convenes, not because it commands.
 */
export const network = {
  title: "El sistema educativo como una red.",
  lead:
    "Ninguna institución transforma la educación por su cuenta. El Consejo ocupa el centro " +
    "del diagrama porque convoca, no porque mande: cada nodo conserva sus competencias y " +
    "aporta una capacidad que las demás no tienen.",
  center: { label: "Consejo Estratégico", sub: "Entidad coordinadora" },
  nodes: [
    { id: "publica", label: "Educación pública", contributes: "Operación del sistema escolar y datos de centro." },
    { id: "superior", label: "Educación superior", contributes: "Formación de docentes e investigación educativa." },
    { id: "profesional", label: "Formación profesional", contributes: "Oferta técnica y certificación de competencias." },
    { id: "universidades", label: "Universidades", contributes: "Evidencia independiente y evaluación externa." },
    { id: "locales", label: "Gobiernos locales", contributes: "Infraestructura, transporte y contexto territorial." },
    { id: "docentes", label: "Docentes", contributes: "Práctica de aula y necesidades de formación." },
    { id: "productivo", label: "Sector productivo", contributes: "Demanda de competencias e inserción laboral." },
    { id: "civil", label: "Sociedad civil", contributes: "Vigilancia ciudadana y voz de las comunidades." },
    { id: "cooperacion", label: "Cooperación internacional", contributes: "Financiamiento técnico y comparación regional." },
  ],
};

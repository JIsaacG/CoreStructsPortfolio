/**
 * AUREA — the institution the portal belongs to, invented from scratch.
 *
 * AUREA does not exist. It is a demonstration of what a school that is also a
 * university needs from a website: two levels of education under one roof
 * (educación media and educación superior), four audiences with almost nothing
 * in common, and a public site that has to serve admissions, families,
 * students and staff at the same time.
 *
 * Nothing here is taken from a real institution — not the name, not the
 * emblem, not the programmes, not the figures, not the contact details. The
 * fiction is declared on every page (top bar, badge, footer) and every page is
 * `noindex`.
 *
 * Everything a real deployment would rebrand lives in this one file.
 */

export const institution = {
  name: "AUREA",
  descriptor: "Instituto & Universidad",
  full: "AUREA · Instituto & Universidad",
  legal: "Corporación Educativa AUREA",
  founded: "2001",
  city: "Tegucigalpa",
  country: "Honduras",
  summary:
    "Institución educativa ficticia creada para esta demostración: educación media y " +
    "educación superior en un mismo campus, con oferta técnica, universitaria y de " +
    "educación continua.",
  claim: "Aprende hoy. Construye lo que sigue.",
  /* `.example` is the TLD reserved for documentation — the canonical tags show
     the structure a real deployment needs without claiming a domain that
     belongs to somebody. */
  origin: "https://www.aurea.example",
};

/** The demonstration notice, in the places it appears. */
export const notice = {
  bar: "Portal demostrativo · Institución ficticia",
  tag: "DEMO",
  short: "Institución ficticia · no es un sitio oficial",
  long:
    "Concepto de portafolio. AUREA es una institución ficticia. Este sitio no representa " +
    "a ningún colegio, instituto ni universidad real.",
  data:
    "Programas, fechas, costos, becas, cifras y personas son invenciones creadas " +
    "exclusivamente para demostrar las capacidades de la plataforma. No deben leerse " +
    "como información académica, ni como oferta de matrícula, ni como criterio de " +
    "elegibilidad de ninguna institución.",
  dataShort: "Contenido demostrativo",
  /* Every simulator on the site repeats this before it shows a number. */
  simulator:
    "Simulador demostrativo. El resultado es una estimación generada por esta demo y no " +
    "constituye una oferta, una cotización ni una resolución de beca.",
};

/** Contact block. Every value is invented and labelled as such. */
export const contact = {
  campus: "Campus Central AUREA",
  address: "Boulevard del Saber 4500, Colonia Miraflores",
  addressCity: "Tegucigalpa, M.D.C., Honduras",
  addressNote: "Dirección demostrativa",
  phone: "+504 0000-0000",
  phoneNote: "Teléfono demostrativo",
  whatsapp: "+504 0000-0001",
  email: "informacion@aurea.example",
  emailNote: "Correo demostrativo",
  admissions: "admisiones@aurea.example",
  hours: "Lunes a viernes, 7:00 a 17:00 · Sábados, 8:00 a 12:00",
  /* The map is a drawn schematic of an invented campus, not a location. */
  map: { label: "Esquema del campus", note: "Ubicación demostrativa" },
};

/* --------------------------------------------------------------- routing */

/**
 * Every page of the portal, by key.
 *
 * A route is written once here and resolved relative to whichever page is
 * being emitted, so a page one directory deep never hard-codes `../`.
 */
export const routes = {
  home: "index.html",
  institucion: "institucion.html",
  oferta: "oferta-academica.html",
  admisiones: "admisiones.html",
  becas: "becas.html",
  costos: "costos.html",
  calendario: "calendario.html",
  noticias: "noticias.html",
  vida: "vida-estudiantil.html",
  campus: "campus.html",
  investigacion: "investigacion.html",
  docentes: "docentes.html",
  directorio: "directorio.html",
  biblioteca: "biblioteca.html",
  apoyo: "apoyo-estudiantil.html",
  empleabilidad: "empleabilidad.html",
  egresados: "egresados.html",
  internacional: "internacional.html",
  documentos: "documentos.html",
  faq: "preguntas-frecuentes.html",
  contacto: "contacto.html",
  buscar: "buscar.html",
  portalEstudiante: "demo/portal-estudiantil.html",
  portalPadres: "demo/portal-padres.html",
  campusVirtual: "demo/campus-virtual.html",
  noEncontrada: "404.html",
};

/* ------------------------------------------------------------ navigation */

/**
 * The top bar: the six destinations that are not for prospective students.
 *
 * A school website is visited far more often by the people already inside it
 * than by the people considering it — a parent checking a date, a student
 * opening the academic portal — and those visits are all shortcuts. Putting
 * them above the main navigation keeps them one tap away without letting them
 * compete with admissions for the middle of the page.
 */
export const quickAccess = [
  { label: "Estudiantes", route: "portalEstudiante" },
  { label: "Padres", route: "portalPadres" },
  { label: "Docentes", route: "docentes" },
  { label: "Egresados", route: "egresados" },
  { label: "Biblioteca", route: "biblioteca" },
  { label: "Portal Académico", route: "portalEstudiante", external: true },
];

/**
 * The main navigation.
 *
 * Six sections, five of them with a mega panel. The panels are for the
 * sections a visitor *browses*; Noticias is a single destination and a panel
 * would only add a click.
 */
export const navigation = [
  {
    label: "Institución",
    route: "institucion",
    mega: "institucion",
    summary: "Quiénes somos, cómo enseñamos y quién responde por ello.",
    columns: [
      {
        heading: "La institución",
        links: [
          { label: "Educación con propósito", route: "institucion", hash: "proposito" },
          { label: "Nuestra historia", route: "institucion", hash: "historia" },
          { label: "Misión, visión y valores", route: "institucion", hash: "mision" },
          { label: "Modelo educativo", route: "institucion", hash: "modelo" },
        ],
      },
      {
        heading: "Organización",
        links: [
          { label: "Autoridades", route: "institucion", hash: "autoridades" },
          { label: "Directorio institucional", route: "directorio" },
          { label: "Docentes", route: "docentes" },
          { label: "Contacto", route: "contacto" },
        ],
      },
      {
        heading: "Campus",
        links: [
          { label: "Conoce el campus", route: "campus" },
          { label: "Tour virtual", route: "campus", hash: "tour" },
          { label: "Programar una visita", route: "campus", hash: "visita" },
        ],
      },
    ],
    feature: {
      title: "25 años formando profesionales",
      text: "De un instituto de educación media a una institución con oferta universitaria completa.",
      route: "institucion",
      hash: "historia",
    },
  },
  {
    label: "Oferta Académica",
    route: "oferta",
    mega: "oferta",
    summary: "Educación media, carreras técnicas y programas universitarios.",
    columns: [
      {
        heading: "Educación Media",
        links: [
          {
            label: "Bachillerato en Ciencias y Humanidades",
            dir: "programas",
            slug: "bachillerato-ciencias-humanidades",
          },
          { label: "BTP en Informática", dir: "programas", slug: "btp-informatica" },
          { label: "BTP en Administración", dir: "programas", slug: "btp-administracion" },
        ],
      },
      {
        heading: "Educación Superior",
        links: [
          { label: "Ingeniería en Sistemas", dir: "programas", slug: "ingenieria-en-sistemas" },
          { label: "Administración de Empresas", dir: "programas", slug: "administracion-de-empresas" },
          { label: "Mercadotecnia", dir: "programas", slug: "mercadotecnia" },
          { label: "Diseño Digital", dir: "programas", slug: "diseno-digital" },
          { label: "Finanzas", dir: "programas", slug: "finanzas" },
          { label: "Psicología", dir: "programas", slug: "psicologia" },
        ],
      },
      {
        heading: "Explorar",
        links: [
          { label: "Buscador de programas", route: "oferta", hash: "buscador" },
          { label: "Costos y calculadora", route: "costos" },
          { label: "Biblioteca", route: "biblioteca" },
          { label: "Documentos y planes", route: "documentos" },
        ],
      },
    ],
    feature: {
      title: "¿No sabes cuál elegir?",
      text: "Filtra por nivel, modalidad y área de interés, y compara los programas lado a lado.",
      route: "oferta",
      hash: "buscador",
    },
  },
  {
    label: "Admisiones",
    route: "admisiones",
    mega: "admisiones",
    summary: "El proceso completo, las fechas y lo que cuesta.",
    columns: [
      {
        heading: "El proceso",
        links: [
          { label: "Educación Media", route: "admisiones", hash: "media" },
          { label: "Educación Superior", route: "admisiones", hash: "superior" },
          { label: "Requisitos y documentos", route: "admisiones", hash: "requisitos" },
          { label: "Checklist de solicitud", route: "admisiones", hash: "checklist" },
        ],
      },
      {
        heading: "Fechas y costos",
        links: [
          { label: "Fechas importantes", route: "admisiones", hash: "fechas" },
          { label: "Costos y aranceles", route: "costos" },
          { label: "Calculadora de matrícula", route: "costos", hash: "calculadora" },
          { label: "Becas y financiamiento", route: "becas" },
        ],
      },
      {
        heading: "Conócenos",
        links: [
          { label: "Programar una visita", route: "campus", hash: "visita" },
          { label: "Tour virtual", route: "campus", hash: "tour" },
          { label: "Preguntas frecuentes", route: "faq" },
        ],
      },
    ],
    feature: {
      title: "Admisiones 2027 abiertas",
      text: "La primera fecha prioritaria cierra el 30 de noviembre.",
      route: "admisiones",
      hash: "fechas",
    },
  },
  {
    label: "Vida Estudiantil",
    route: "vida",
    mega: "vida",
    summary: "Lo que ocurre entre una clase y la siguiente.",
    columns: [
      {
        heading: "Comunidad",
        links: [
          { label: "Clubes y organizaciones", route: "vida", hash: "clubes" },
          { label: "Deportes", route: "vida", hash: "deportes" },
          { label: "Arte y cultura", route: "vida", hash: "arte" },
          { label: "Voluntariado", route: "vida", hash: "voluntariado" },
        ],
      },
      {
        heading: "Acompañamiento",
        links: [
          { label: "Apoyo al estudiante", route: "apoyo" },
          { label: "Bienestar y psicología", route: "apoyo", hash: "bienestar" },
          { label: "Inclusión y accesibilidad", route: "apoyo", hash: "inclusion" },
          { label: "Tutorías", route: "apoyo", hash: "tutorias" },
        ],
      },
      {
        heading: "Agenda",
        links: [
          { label: "Calendario institucional", route: "calendario" },
          { label: "Próximos eventos", route: "calendario", hash: "proximos" },
        ],
      },
    ],
    feature: {
      title: "42 clubes y organizaciones",
      text: "Robótica, debate, fotografía, emprendimiento y lo que aún no existe.",
      route: "vida",
      hash: "clubes",
    },
  },
  {
    label: "Investigación",
    route: "investigacion",
    mega: "investigacion",
    summary: "Conocimiento que sale del aula.",
    columns: [
      {
        heading: "Investigación",
        links: [
          { label: "Centros de investigación", route: "investigacion", hash: "centros" },
          { label: "Proyectos en curso", route: "investigacion", hash: "proyectos" },
          { label: "Publicaciones", route: "investigacion", hash: "publicaciones" },
        ],
      },
      {
        heading: "Vinculación",
        links: [
          { label: "Empleabilidad", route: "empleabilidad" },
          { label: "Empresas aliadas", route: "empleabilidad", hash: "empresas" },
          { label: "Internacional", route: "internacional" },
          { label: "Red de egresados", route: "egresados" },
        ],
      },
    ],
    feature: {
      title: "Centro de Inteligencia Artificial",
      text: "Cuatro líneas de investigación y catorce estudiantes de grado involucrados.",
      route: "investigacion",
      hash: "centros",
    },
  },
  { label: "Noticias", route: "noticias" },
];

/**
 * The audience switch — “SOY…”.
 *
 * The hardest problem of an institutional site: a prospective student, a
 * current student, a parent, a teacher and an alumnus want five different
 * websites, and building five is not an option. So the homepage carries one
 * control that re-points the shortcuts, and the rest of the navigation stays
 * the same for everybody. Each audience gets the five or six destinations that
 * account for its visits — not a curated tour of the site.
 */
export const audiences = [
  {
    id: "futuro",
    label: "Futuro estudiante",
    lead: "Conoce la oferta, los requisitos y cuánto cuesta antes de decidir.",
    links: [
      { label: "Explorar programas", route: "oferta" },
      { label: "Cómo aplicar", route: "admisiones" },
      { label: "Fechas importantes", route: "admisiones", hash: "fechas" },
      { label: "Becas disponibles", route: "becas" },
      { label: "Calculadora de matrícula", route: "costos", hash: "calculadora" },
      { label: "Visitar el campus", route: "campus", hash: "visita" },
    ],
  },
  {
    id: "estudiante",
    label: "Estudiante actual",
    lead: "Tus clases, tus notas, tus pagos y tus trámites.",
    links: [
      { label: "Portal estudiantil", route: "portalEstudiante" },
      { label: "Campus virtual", route: "campusVirtual" },
      { label: "Calendario académico", route: "calendario" },
      { label: "Biblioteca digital", route: "biblioteca" },
      { label: "Apoyo al estudiante", route: "apoyo" },
      { label: "Documentos y formularios", route: "documentos" },
    ],
  },
  {
    id: "familia",
    label: "Padre de familia",
    lead: "Asistencia, calificaciones, pagos y comunicación con los docentes.",
    links: [
      { label: "Portal de padres", route: "portalPadres" },
      { label: "Calendario y actividades", route: "calendario" },
      { label: "Comunicados", route: "noticias", hash: "comunicados" },
      { label: "Costos y aranceles", route: "costos" },
      { label: "Solicitar una reunión", route: "portalPadres", hash: "reunion" },
      { label: "Contacto", route: "contacto" },
    ],
  },
  {
    id: "docente",
    label: "Docente o personal",
    lead: "Campus virtual, calendario y servicios administrativos.",
    links: [
      { label: "Campus virtual", route: "campusVirtual" },
      { label: "Calendario institucional", route: "calendario" },
      { label: "Directorio institucional", route: "directorio" },
      { label: "Biblioteca y repositorio", route: "biblioteca" },
      { label: "Investigación", route: "investigacion" },
      { label: "Documentos internos", route: "documentos" },
    ],
  },
  {
    id: "egresado",
    label: "Egresado",
    lead: "La red, la educación continua y las oportunidades laborales.",
    links: [
      { label: "Red AUREA", route: "egresados" },
      { label: "Educación continua", route: "egresados", hash: "continua" },
      { label: "Bolsa de empleo", route: "empleabilidad", hash: "bolsa" },
      { label: "Constancias y títulos", route: "documentos" },
      { label: "Eventos de egresados", route: "calendario" },
    ],
  },
];

/**
 * The bottom bar on a phone.
 *
 * Five destinations, chosen from what a phone visit is actually for: a date, a
 * programme, a deadline, an account. It is not a shrunken copy of the main
 * navigation — the full site map lives in the menu — and it is what makes the
 * portal read as an app on a phone without being one.
 */
export const mobileBar = [
  { label: "Inicio", route: "home", icon: "home" },
  { label: "Carreras", route: "oferta", icon: "cap" },
  { label: "Calendario", route: "calendario", icon: "calendar" },
  { label: "Admisiones", route: "admisiones", icon: "edit" },
  { label: "Portal", route: "portalEstudiante", icon: "user" },
];

/* ---------------------------------------------------------------- footer */

export const footer = {
  pitch:
    "Educación media y superior en un mismo campus. Del bachillerato a la licenciatura, " +
    "con formación técnica, investigación y vinculación profesional.",
  columns: [
    {
      heading: "Estudiar",
      links: [
        { label: "Educación Media", route: "oferta", hash: "media" },
        { label: "Carreras universitarias", route: "oferta", hash: "superior" },
        { label: "Carreras técnicas", route: "oferta", hash: "tecnico" },
        { label: "Educación continua", route: "egresados", hash: "continua" },
        { label: "Modalidad virtual", route: "oferta", hash: "buscador" },
      ],
    },
    {
      heading: "Admisiones",
      links: [
        { label: "Requisitos", route: "admisiones", hash: "requisitos" },
        { label: "Becas", route: "becas" },
        { label: "Costos", route: "costos" },
        { label: "Calendario de admisiones", route: "admisiones", hash: "fechas" },
        { label: "Visitas al campus", route: "campus", hash: "visita" },
      ],
    },
    {
      heading: "AUREA",
      links: [
        { label: "Quiénes somos", route: "institucion" },
        { label: "Autoridades", route: "institucion", hash: "autoridades" },
        { label: "Noticias", route: "noticias" },
        { label: "Investigación", route: "investigacion" },
        { label: "Contacto", route: "contacto" },
      ],
    },
    {
      heading: "Recursos",
      links: [
        { label: "Portal estudiantil", route: "portalEstudiante" },
        { label: "Portal de padres", route: "portalPadres" },
        { label: "Campus virtual", route: "campusVirtual" },
        { label: "Biblioteca", route: "biblioteca" },
        { label: "Documentos", route: "documentos" },
      ],
    },
  ],
  /* The social row is labelled rather than linked: an invented institution
     with live social links would be pointing at an account owned by somebody
     who never agreed to appear in a portfolio. */
  social: [
    { label: "Facebook", handle: "/aurea.edu" },
    { label: "Instagram", handle: "@aurea.edu" },
    { label: "LinkedIn", handle: "/school/aurea" },
    { label: "YouTube", handle: "/@aurea" },
    { label: "TikTok", handle: "@aurea.edu" },
  ],
  service: [
    { label: "Preguntas frecuentes", route: "faq" },
    { label: "Buscar en el portal", route: "buscar" },
    { label: "Accesibilidad", route: "apoyo", hash: "inclusion" },
    { label: "Directorio", route: "directorio" },
  ],
  updated: "7 de septiembre de 2026",
  version: "Portal AUREA · v3.2",
};

/* ----------------------------------------------------------------- facts */

/**
 * The figures on the homepage. Invented, and marked as such wherever they
 * appear — a number on an education site reads as a claim, and this one is not.
 */
export const facts = [
  { value: 25, suffix: "+", label: "años formando profesionales", note: "Desde 2001" },
  { value: 8400, suffix: "+", label: "estudiantes", note: "Media y superior" },
  { value: 92, suffix: " %", label: "empleabilidad de egresados", note: "Medición interna 2026" },
  { value: 32, suffix: "", label: "programas académicos", note: "Nueve detallados en este demo" },
  { value: 18, suffix: "", label: "laboratorios y espacios", note: "Campus Central" },
];

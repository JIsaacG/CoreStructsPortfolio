/**
 * Citizen participation: consultations, forums, surveys and hearings.
 *
 * The section exists to demonstrate a mechanism, not a form. What makes public
 * consultation credible is the loop being closed — the file, the timetable, the
 * questions, and afterwards a published report saying what each observation
 * produced. That is the structure modelled here.
 *
 * Everything is invented, and no submission is ever sent anywhere: the form
 * validates, confirms and explains that the prototype does not transmit data.
 */

export const mechanisms = [
  {
    id: "consultas",
    index: "01",
    name: "Consultas públicas",
    text:
      "Toda política educativa de alcance nacional se somete a consulta antes de aprobarse. " +
      "El expediente completo se publica al abrir el período, y al cerrarlo se publica la " +
      "respuesta razonada a cada observación recibida.",
  },
  {
    id: "foros",
    index: "02",
    name: "Foros y mesas de diálogo",
    text:
      "Espacios de trabajo con calendario fijo y acta pública, donde las instituciones del " +
      "sistema y las organizaciones territoriales preparan los expedientes técnicos.",
  },
  {
    id: "encuestas",
    index: "03",
    name: "Encuestas",
    text:
      "Consultas breves dirigidas a comunidades educativas sobre asuntos concretos, con " +
      "resultados publicados en el catálogo de datos abiertos.",
  },
  {
    id: "audiencias",
    index: "04",
    name: "Audiencias públicas",
    text:
      "Sesiones abiertas en las que una organización o una persona puede exponer directamente " +
      "ante el Consejo, con inscripción previa y registro público.",
  },
];

export const consultationStates = {
  abierta: { label: "Abierta", icon: "open", note: "Admite observaciones." },
  cerrada: { label: "Cerrada", icon: "closed", note: "El plazo terminó; el informe está publicado." },
  proxima: { label: "Próxima", icon: "clock", note: "Aún no abre el período de observaciones." },
  informe: { label: "Informe publicado", icon: "check", note: "Las respuestas razonadas están disponibles." },
};

/**
 * The consultations.
 *
 * The first is open and has a detail page with a working form; the rest give
 * the register the depth that makes the mechanism believable.
 */
export const consultations = [
  {
    slug: "lineamientos-educacion-tecnica",
    code: "CP-2026-04",
    title: "Lineamientos para el fortalecimiento de la educación técnica",
    theme: "Educación técnica",
    state: "abierta",
    opens: "2026-07-06",
    closes: "2026-09-30",
    audience: "Centros educativos, docentes, estudiantes, sector productivo y público general",
    featured: true,
    summary:
      "Propuesta de actualización de la oferta técnica de educación media: criterios de " +
      "revisión de familias profesionales, condiciones de los talleres y seguimiento de la " +
      "inserción laboral de las personas egresadas.",
    background:
      "El catálogo nacional de familias profesionales se aprobó en 2025 y previó una revisión " +
      "periódica de los perfiles de egreso. El foro técnico de julio identificó tres " +
      "dificultades: la velocidad con que envejecen los perfiles en algunas áreas, el costo de " +
      "sostener talleres equipados fuera de los centros urbanos y la ausencia de seguimiento " +
      "sistemático de la inserción laboral.\n\n" +
      "El borrador sometido a consulta propone un criterio de actualización continua, un " +
      "esquema de talleres compartidos entre centros próximos y un registro de seguimiento de " +
      "egresados a doce y veinticuatro meses.",
    schedule: [
      { date: "2026-07-06", label: "Apertura del período de observaciones", done: true },
      { date: "2026-08-06", label: "Ampliación del plazo por resolución del Consejo", done: true },
      { date: "2026-09-18", label: "Foro nacional de educación técnica", done: false },
      { date: "2026-09-30", label: "Cierre del período de observaciones", done: false },
      { date: "2026-11-15", label: "Publicación del informe de respuestas razonadas", done: false },
    ],
    questions: [
      "¿Los criterios propuestos para actualizar un perfil de egreso son suficientes y aplicables?",
      "¿Qué condiciones debería cumplir un esquema de talleres compartidos entre centros?",
      "¿Qué información sobre inserción laboral resultaría útil publicar, y con qué periodicidad?",
      "¿Hay familias profesionales que deberían incorporarse o retirarse del catálogo?",
    ],
    documents: [
      { title: "Borrador de lineamientos", code: "LIN-CEDE-2026-009", size: "740 KB", pages: 31 },
      { title: "Nota técnica de fundamentación", code: "NT-CEDE-2026-014", size: "420 KB", pages: 18 },
      { title: "Conclusiones del foro técnico de julio", code: "ACT-CEDE-2026-07", size: "260 KB", pages: 11 },
    ],
    stats: { observations: 148, organisations: 37, sessions: 4 },
  },
  {
    slug: "plan-nacional-2026-2035",
    code: "CP-2025-09",
    title: "Plan Nacional de Transformación Educativa 2026–2035",
    theme: "Política educativa",
    state: "informe",
    opens: "2025-09-15",
    closes: "2025-12-12",
    audience: "Público general, comunidades educativas e instituciones del sistema",
    summary:
      "Consulta sobre el borrador completo del plan nacional: diagnóstico, ejes, objetivos, " +
      "indicadores y metas a diez años.",
    stats: { observations: 1_284, organisations: 212, sessions: 18 },
  },
  {
    slug: "condiciones-minimas-centro-educativo",
    code: "CP-2025-06",
    title: "Reglamento de condiciones mínimas del centro educativo",
    theme: "Infraestructura",
    state: "cerrada",
    opens: "2025-05-05",
    closes: "2025-07-04",
    audience: "Direcciones de centro, gobiernos locales y organizaciones territoriales",
    summary:
      "Consulta sobre las condiciones de agua, electricidad, saneamiento, conectividad y " +
      "accesibilidad exigibles a un centro educativo.",
    stats: { observations: 612, organisations: 94, sessions: 9 },
  },
  {
    slug: "datos-abiertos-educativos",
    code: "CP-2026-01",
    title: "Lineamientos de publicación de datos abiertos educativos",
    theme: "Datos e información",
    state: "informe",
    opens: "2026-01-20",
    closes: "2026-03-06",
    audience: "Investigación, periodismo de datos, organizaciones civiles y público general",
    summary:
      "Consulta sobre formatos, licencias, metadatos y periodicidad del catálogo de datos " +
      "abiertos del sistema educativo.",
    stats: { observations: 227, organisations: 41, sessions: 3 },
  },
  {
    slug: "marco-formacion-docente",
    code: "CP-2026-07",
    title: "Marco de competencias para la formación docente",
    theme: "Formación docente",
    state: "proxima",
    opens: "2026-10-05",
    closes: "2026-12-04",
    audience: "Personal docente, universidades formadoras y centros educativos",
    summary:
      "Consulta prevista sobre la revisión del marco de competencias que orienta la formación " +
      "inicial y continua del personal docente.",
    stats: { observations: 0, organisations: 0, sessions: 0 },
  },
];

export const consultationBySlug = Object.fromEntries(consultations.map((c) => [c.slug, c]));

/** Aggregate figures for the participation header. */
export const participationTotals = {
  open: consultations.filter((c) => c.state === "abierta").length,
  observations: consultations.reduce((sum, c) => sum + c.stats.observations, 0),
  organisations: consultations.reduce((sum, c) => sum + c.stats.organisations, 0),
  sessions: consultations.reduce((sum, c) => sum + c.stats.sessions, 0),
};

/** How a submission is handled — the step-by-step the section leads with. */
export const howToParticipate = [
  { index: "01", title: "Consulte el expediente", text: "El borrador completo, su nota técnica y el cronograma se publican al abrir el período." },
  { index: "02", title: "Presente su observación", text: "A través del formulario en línea, en una mesa territorial o por escrito ante la Secretaría Técnica." },
  { index: "03", title: "Reciba constancia", text: "Toda observación queda registrada con un número de expediente que permite darle seguimiento." },
  { index: "04", title: "Lea la respuesta razonada", text: "Al cierre se publica qué se incorporó al texto final, qué no y por qué, observación por observación." },
];

/* -------------------------------------------------------------- surveys */

export const surveys = [
  { title: "Percepción de la comunidad educativa sobre conectividad", period: "Junio 2026", responses: 8_412, state: "Resultados publicados" },
  { title: "Necesidades de formación continua del personal docente", period: "Marzo 2026", responses: 12_760, state: "Resultados publicados" },
  { title: "Uso de materiales educativos digitales", period: "Octubre 2025", responses: 6_930, state: "Resultados publicados" },
];

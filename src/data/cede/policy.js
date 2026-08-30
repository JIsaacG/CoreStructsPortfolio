/**
 * The education-policy section: the framework and the live agenda.
 *
 * Written for the demonstration, deliberately explanatory. A public portal's
 * policy page fails when it assumes the reader already knows what a policy is
 * and what distinguishes it from a plan or a programme, so this one says it in
 * the first block and then shows the machinery.
 */

export const policy = {
  title: "Decidir con método, no con impulso.",
  lead:
    "Una política educativa es el marco que ordena las decisiones del sistema durante años: " +
    "qué se busca, con qué principios, por qué medios y cómo se sabrá si funcionó.",
  whatIs:
    "Una política educativa no es un programa ni un plan de gobierno. Es el acuerdo estable " +
    "que dice qué problema público se está atendiendo, qué se considera un buen resultado y " +
    "qué instrumentos se van a usar para alcanzarlo. Los planes la traducen en metas con " +
    "fecha; los programas la ejecutan en un territorio concreto.\n\n" +
    "Esa distinción tiene una consecuencia práctica: una política que cambia con cada " +
    "administración no llega a producir efectos medibles, porque los ciclos educativos son más " +
    "largos que los ciclos políticos. Por eso el Consejo formula la política con consulta " +
    "previa, la publica completa y la somete a seguimiento con indicadores acordados de " +
    "antemano.",
  objectives: [
    { index: "01", title: "Aprendizaje", text: "Que cada estudiante alcance los aprendizajes que su nivel promete, y que eso se pueda demostrar." },
    { index: "02", title: "Trayectoria", text: "Que quien entra al sistema lo recorra completo, sin salidas que dependan del territorio." },
    { index: "03", title: "Equidad", text: "Que la brecha entre territorios se reduzca de forma sostenida y verificable." },
    { index: "04", title: "Pertinencia", text: "Que la formación se corresponda con lo que la vida y el trabajo exigen hoy." },
    { index: "05", title: "Capacidad institucional", text: "Que el sistema sepa medirse, planificar y rendir cuentas de lo que hace." },
  ],
  principles: [
    { title: "Universalidad", text: "La política se dirige a todo el sistema, no a un segmento seleccionado." },
    { title: "Gradualidad", text: "Los cambios se aplican por etapas verificables, con recursos comprometidos por etapa." },
    { title: "Evidencia", text: "Toda línea de acción declara el indicador que permitirá evaluarla." },
    { title: "Participación", text: "La consulta previa es parte de la formulación, no un trámite posterior." },
    { title: "Transparencia", text: "El expediente completo de la política es público desde su borrador." },
    { title: "Continuidad", text: "La política se formula para un horizonte de diez años y se revisa, no se reemplaza." },
  ],
  lines: [
    {
      index: "01",
      title: "Aprendizajes fundamentales",
      text:
        "Evaluación periódica de los aprendizajes, materiales alineados al currículo y apoyo " +
        "focalizado a los centros con resultados más bajos.",
      indicator: "Tasa de finalización de educación básica",
    },
    {
      index: "02",
      title: "Trayectoria completa",
      text:
        "Intervención en los puntos de fuga del sistema, con especial atención a la transición " +
        "entre educación básica y media.",
      indicator: "Tasa de transición a educación media",
    },
    {
      index: "03",
      title: "Equidad territorial",
      text:
        "Focalización de la inversión en los territorios con menor cobertura y ampliación de " +
        "la oferta local donde hoy termina en noveno grado.",
      indicator: "Brecha de cobertura urbano–rural",
    },
    {
      index: "04",
      title: "Docentes",
      text:
        "Formación inicial vinculada a la práctica, ciclo de formación continua reconocido y " +
        "condiciones de ejercicio en centros de difícil acceso.",
      indicator: "Docentes con formación acreditada",
    },
    {
      index: "05",
      title: "Educación técnica",
      text:
        "Actualización continua de la oferta con el sector productivo y seguimiento de la " +
        "inserción laboral de las personas egresadas.",
      indicator: "Inserción laboral de egresados técnicos",
    },
    {
      index: "06",
      title: "Información pública",
      text:
        "Base estadística única, abierta y documentada como insumo obligatorio de toda " +
        "decisión educativa.",
      indicator: "Conjuntos de datos publicados con metodología",
    },
  ],
  monitoring:
    "El seguimiento de la política tiene tres piezas. La primera es el conjunto de indicadores " +
    "estratégicos, acordados antes de aplicar la política y publicados con su metodología. La " +
    "segunda es el informe semestral de avance, que compara lo alcanzado con lo programado y " +
    "explica las desviaciones. La tercera es la evaluación intermedia, que puede modificar " +
    "metas si la evidencia lo justifica —y que deja constancia pública de por qué.",
};

export const agendaStates = {
  vigente: { label: "Vigente", icon: "check" },
  formulacion: { label: "En formulación", icon: "edit" },
  consulta: { label: "En consulta pública", icon: "open" },
  seguimiento: { label: "En seguimiento", icon: "arrow" },
};

/**
 * The policy agenda.
 *
 * Every policy the council is responsible for, with the stage of its life it is
 * in. The point of publishing the agenda is that a citizen can see a policy
 * coming before it is decided, not after.
 */
export const agenda = [
  {
    code: "CEDE-P-001",
    title: "Política Educativa Nacional 2026–2035",
    state: "vigente",
    since: "Marzo 2026",
    text: "Marco general de la política educativa para la década, con cinco líneas estratégicas y quince indicadores.",
  },
  {
    code: "CEDE-P-002",
    title: "Política de Inclusión y Equidad Educativa",
    state: "seguimiento",
    since: "Junio 2025",
    text: "En seguimiento con informe anual; su indicador principal —la brecha urbano–rural— avanza por debajo de lo previsto.",
  },
  {
    code: "CEDE-P-003",
    title: "Política de Transformación Digital Educativa",
    state: "seguimiento",
    since: "Octubre 2025",
    text: "En seguimiento; el levantamiento de conectividad operativa es su fuente de verificación anual.",
  },
  {
    code: "CEDE-P-004",
    title: "Política Nacional de Desarrollo Docente",
    state: "vigente",
    since: "Noviembre 2024",
    text: "Vigente y con marco de competencias adoptado en febrero de 2026.",
  },
  {
    code: "LIN-CEDE-2026-009",
    title: "Lineamientos para el fortalecimiento de la educación técnica",
    state: "consulta",
    since: "Julio 2026",
    text: "En consulta pública hasta el 30 de septiembre de 2026. El expediente completo está disponible.",
  },
  {
    code: "CEDE-P-005",
    title: "Política de Primera Infancia Educativa",
    state: "formulacion",
    since: "Mayo 2026",
    text: "En formulación. La consulta pública está prevista para el primer trimestre de 2027.",
  },
  {
    code: "CEDE-P-006",
    title: "Política de Evaluación de Aprendizajes",
    state: "formulacion",
    since: "Agosto 2026",
    text: "En formulación a partir de los resultados de la evaluación nacional de 2024.",
  },
];

/* --------------------------------------------------------- citizen tasks */

/**
 * The portal organised by what someone came to do.
 *
 * Not a list of sections: a list of intentions, each pointing at the page that
 * resolves it. This is the block that turns an institutional site into a
 * service.
 */
export const tasks = [
  { want: "Conocer el estado de la educación", go: "Indicadores del sistema", route: "datos" },
  { want: "Descargar información", go: "Catálogo de datos abiertos", route: "abiertos" },
  { want: "Conocer una política", go: "Política educativa", route: "politica" },
  { want: "Encontrar una ley o un reglamento", go: "Marco normativo", route: "normativa" },
  { want: "Participar en una consulta", go: "Consultas públicas", route: "participacion" },
  { want: "Conocer las decisiones del Consejo", go: "Resoluciones y acuerdos", route: "resoluciones" },
];

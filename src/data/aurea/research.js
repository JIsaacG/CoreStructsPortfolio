/**
 * Research and innovation — “Conocimiento que sale del aula.”
 *
 * The section that separates an institution with a university from a school
 * that also grants degrees. It is modelled as three linked collections —
 * centres, projects and publications — because that is the shape research
 * actually has, and because a project that cannot name its centre and its
 * people is a press release.
 *
 * Every centre, project, figure and publication below is invented.
 */

export const centers = [
  {
    id: "cia",
    name: "Centro de Inteligencia Artificial",
    since: "2023",
    lead: "Karla Medrano",
    leadId: "karla-medrano",
    plate: "codigo",
    summary:
      "Aprendizaje automático aplicado a problemas educativos y de gestión, con énfasis " +
      "en modelos interpretables.",
    lines: [
      "Detección temprana de deserción escolar",
      "Modelos interpretables para decisiones académicas",
      "Procesamiento de lenguaje en español hondureño",
      "Equidad y sesgo en sistemas automatizados",
    ],
    facts: [
      { value: "14", label: "estudiantes de grado" },
      { value: "4", label: "líneas de investigación" },
      { value: "6", label: "publicaciones desde 2023" },
    ],
  },
  {
    id: "energia",
    name: "Laboratorio de Energía y Sostenibilidad",
    since: "2024",
    lead: "Daniel Espinoza",
    leadId: "daniel-espinoza",
    plate: "energia",
    summary:
      "Eficiencia energética en edificaciones y sistemas de medición de bajo costo para " +
      "instituciones y pequeñas empresas.",
    lines: [
      "Instrumentación de edificios existentes",
      "Modelos de consumo con datos escasos",
      "Energía solar distribuida en contexto urbano",
    ],
    facts: [
      { value: "18 %", label: "reducción medida en campus" },
      { value: "28", label: "sensores desplegados" },
      { value: "2", label: "plazas de investigación" },
    ],
  },
  {
    id: "observatorio",
    name: "Observatorio Empresarial",
    since: "2019",
    lead: "Patricia Zelaya",
    leadId: "patricia-zelaya",
    plate: "series",
    summary:
      "Diagnóstico y acompañamiento de la pequeña y mediana empresa urbana, con equipos " +
      "de estudiantes de tercer y cuarto año.",
    lines: [
      "Gestión y productividad en pymes",
      "Sucesión y gobierno en empresas familiares",
      "Formalización y acceso a financiamiento",
    ],
    facts: [
      { value: "38", label: "empresas acompañadas" },
      { value: "2", label: "informes anuales publicados" },
      { value: "7", label: "años de operación" },
    ],
  },
  {
    id: "cie",
    name: "Centro de Innovación Educativa",
    since: "2021",
    lead: "Marcela Fuentes",
    leadId: "marcela-fuentes",
    plate: "aula",
    summary:
      "Investigación sobre práctica docente, evaluación formativa y la transición de " +
      "educación media a educación superior.",
    lines: [
      "Evaluación auténtica en educación media",
      "Transición media–superior",
      "Alfabetización digital comunitaria",
    ],
    facts: [
      { value: "3", label: "programas comunitarios" },
      { value: "100", label: "familias certificadas" },
      { value: "5", label: "docentes investigadores" },
    ],
  },
];

export const projects = [
  {
    id: "energia-inteligente",
    title: "Instrumentación energética del edificio de laboratorios",
    center: "energia",
    state: "curso",
    period: "2026 – 2027",
    team: "4 estudiantes · 1 docente",
    text: "Medición continua de consumo y presencia, con modelo de recomendación operativa. Segunda fase en el edificio de aulas.",
  },
  {
    id: "desercion-temprana",
    title: "Señales tempranas de deserción en educación media",
    center: "cia",
    state: "curso",
    period: "2025 – 2027",
    team: "6 estudiantes · 2 docentes",
    text: "Modelo interpretable sobre asistencia, entregas y calificaciones parciales, diseñado para alertar al docente guía, no para clasificar al estudiante.",
  },
  {
    id: "pyme-sucesion",
    title: "Sucesión y gobierno en empresas familiares de la capital",
    center: "observatorio",
    state: "curso",
    period: "2026",
    team: "9 estudiantes · 1 docente",
    text: "Estudio de casos múltiples sobre doce empresas de segunda generación, con informe devuelto a cada participante.",
  },
  {
    id: "corpus-espanol",
    title: "Corpus de español hondureño para procesamiento de lenguaje",
    center: "cia",
    state: "curso",
    period: "2026 – 2028",
    team: "5 estudiantes · 2 docentes",
    text: "Recolección y anotación de un corpus abierto, con licencia libre y publicación en el repositorio institucional.",
  },
  {
    id: "transicion",
    title: "La transición de duodécimo grado al primer período universitario",
    center: "cie",
    state: "cerrado",
    period: "2024 – 2026",
    team: "3 docentes",
    text: "Seguimiento de tres cohortes. Sus conclusiones cambiaron el diseño de la semana de inducción y del sistema de tutoría entre pares.",
  },
  {
    id: "solar-urbano",
    title: "Viabilidad de generación solar distribuida en el campus",
    center: "energia",
    state: "previsto",
    period: "2027",
    team: "Por definir",
    text: "Estudio de prefactibilidad técnica y financiera para cubrir el 30 % de la demanda diurna del campus.",
  },
];

export const publications = [
  { year: "2026", title: "Señales tempranas de deserción en educación media", authors: "Medrano, K.; Fuentes, M.", venue: "Revista de Investigación Educativa (demostrativa)" },
  { year: "2026", title: "Medición de consumo energético en edificios instrumentados", authors: "Espinoza, D.; Núñez, A.; Ramos, K.", venue: "Congreso de Ingeniería Aplicada (demostrativo)" },
  { year: "2026", title: "Diagnóstico operativo de la pyme urbana hondureña", authors: "Zelaya, P.; Laínez, H.", venue: "Observatorio Empresarial AUREA" },
  { year: "2025", title: "Modelos interpretables para decisiones académicas", authors: "Medrano, K.; Brenes, S.", venue: "Cuadernos de Ciencia de Datos (demostrativos)" },
  { year: "2025", title: "Legibilidad de familias variables en interfaces densas", authors: "Portillo, A.", venue: "Anuario de Diseño (demostrativo)" },
  { year: "2024", title: "Protocolos de derivación en instituciones educativas", authors: "Carrillo, I.", venue: "Revista de Psicología Educativa (demostrativa)" },
];

export const researchFacts = [
  { value: "4", label: "centros de investigación" },
  { value: "31", label: "estudiantes de grado vinculados" },
  { value: "6", label: "proyectos activos" },
  { value: "18", label: "publicaciones desde 2019" },
];

export const stateLabel = { curso: "En curso", cerrado: "Concluido", previsto: "Previsto" };

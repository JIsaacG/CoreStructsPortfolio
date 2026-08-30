/**
 * The indicator catalogue.
 *
 * An indicator is not a number: it is a definition, a formula, a periodicity, a
 * set of disaggregations and a note about what it cannot tell you. That is what
 * separates a statistics portal from a dashboard, and it is why each entry here
 * carries the documentation before it carries the value — the value itself is
 * read from `statistics.js`, never written down twice.
 *
 * Every figure these indicators resolve to is invented. The definitions and the
 * formulas are written for this demonstration and are deliberately generic:
 * they describe how such an indicator is normally built, not how any particular
 * institution builds it.
 */

import { CURRENT_YEAR, metricFor, rate, series, variation } from "./statistics.js";

/** The ten boards of the Observatory, in the order they are shown. */
export const boards = [
  { id: "panorama", index: "01", name: "Panorama nacional", lead: "Las ocho cifras que resumen el estado del sistema." },
  { id: "matricula", index: "02", name: "Matrícula", lead: "Quiénes están matriculados, dónde y en qué condiciones." },
  { id: "cobertura", index: "03", name: "Cobertura y acceso", lead: "Qué parte de la población en edad escolar está dentro del sistema." },
  { id: "permanencia", index: "04", name: "Permanencia", lead: "Quién continúa, quién repite y quién abandona." },
  { id: "docentes", index: "05", name: "Docentes", lead: "El personal que sostiene el sistema educativo." },
  { id: "infraestructura", index: "06", name: "Infraestructura", lead: "Las condiciones materiales en las que se aprende." },
  { id: "tecnica", index: "07", name: "Educación técnica", lead: "La formación que conecta la educación con el empleo." },
  { id: "inclusion", index: "08", name: "Inclusión", lead: "Las brechas que el promedio nacional esconde." },
  { id: "financiamiento", index: "09", name: "Financiamiento", lead: "Cuánto se asigna, cuánto se ejecuta y en qué." },
  { id: "ods4", index: "10", name: "ODS 4", lead: "Seguimiento al Objetivo de Desarrollo Sostenible 4." },
];

/**
 * The indicators with a page of their own.
 *
 * `metric` is the key `statistics.js` answers to, so the detail page, the board
 * tile and the comparator all read the same series — there is no second copy of
 * a number anywhere in the portal.
 */
export const indicators = [
  {
    slug: "matricula-total",
    name: "Matrícula total del sistema educativo",
    board: "matricula",
    metric: "matricula",
    unit: "estudiantes",
    format: "count",
    better: "up",
    definition:
      "Número total de estudiantes registrados en centros educativos del país en los niveles " +
      "de prebásica, básica y media, en todas las modalidades y administraciones, al cierre del " +
      "período de matrícula del año lectivo.",
    formula:
      "Suma de estudiantes matriculados en prebásica, básica y media, sin duplicar registros " +
      "entre centros mediante el identificador único de estudiante.",
    periodicity: "Anual",
    coverage: "Nacional, con desagregación departamental y municipal",
    disaggregation: ["Nivel educativo", "Sexo", "Área", "Administración", "Jornada", "Modalidad", "Departamento"],
    notes:
      "La matrícula es un registro administrativo de corte: refleja a quienes se inscribieron, " +
      "no a quienes permanecieron todo el año. Para eso se usa la tasa de retención.",
    limitations:
      "No incluye la educación superior ni la formación profesional no escolarizada, que se " +
      "reportan en registros distintos.",
  },
  {
    slug: "cobertura-neta-media",
    name: "Tasa de cobertura neta en educación media",
    board: "cobertura",
    metric: "cobertura_med",
    unit: "%",
    format: "rate",
    better: "up",
    definition:
      "Proporción de la población de 15 a 17 años que está matriculada en educación media, " +
      "respecto del total de población de ese grupo de edad.",
    formula:
      "(Estudiantes de 15 a 17 años matriculados en educación media ÷ población de 15 a 17 años) × 100.",
    periodicity: "Anual",
    coverage: "Nacional y departamental",
    disaggregation: ["Sexo", "Área", "Departamento"],
    notes:
      "Es el indicador de acceso más exigente del sistema: solo cuenta a quienes están en el " +
      "nivel que corresponde a su edad. Una cobertura bruta siempre será mayor.",
    limitations:
      "Depende de la proyección de población usada como denominador; un cambio de proyección " +
      "mueve el indicador sin que se haya movido la matrícula.",
  },
  {
    slug: "cobertura-neta-prebasica",
    name: "Tasa de cobertura neta en prebásica",
    board: "cobertura",
    metric: "cobertura_pre",
    unit: "%",
    format: "rate",
    better: "up",
    definition:
      "Proporción de la población de 3 a 5 años matriculada en educación prebásica respecto " +
      "del total de población de ese grupo de edad.",
    formula: "(Matrícula de 3 a 5 años en prebásica ÷ población de 3 a 5 años) × 100.",
    periodicity: "Anual",
    coverage: "Nacional y departamental",
    disaggregation: ["Sexo", "Área", "Departamento"],
    notes:
      "La atención en la primera infancia es el punto donde la desigualdad educativa empieza " +
      "a acumularse, y por eso se sigue por separado del resto del sistema.",
    limitations:
      "No distingue entre modalidades formales y comunitarias de atención, que en varios " +
      "territorios conviven.",
  },
  {
    slug: "tasa-desercion",
    name: "Tasa de deserción intranual",
    board: "permanencia",
    metric: "desercion",
    unit: "%",
    format: "rate",
    better: "down",
    definition:
      "Proporción de estudiantes que, habiéndose matriculado al inicio del año lectivo, " +
      "abandonan el centro educativo antes de concluirlo.",
    formula:
      "(Estudiantes matriculados al inicio − estudiantes presentes al cierre − traslados " +
      "confirmados) ÷ estudiantes matriculados al inicio × 100.",
    periodicity: "Anual",
    coverage: "Nacional y departamental",
    disaggregation: ["Nivel educativo", "Sexo", "Área", "Departamento"],
    notes:
      "El traslado confirmado se descuenta: un estudiante que cambia de centro no abandonó " +
      "el sistema. Sin ese descuento la deserción aparece inflada en zonas de alta movilidad.",
    limitations:
      "Un traslado no reportado por el centro receptor se contabiliza como abandono hasta " +
      "que el cruce de registros lo corrige.",
  },
  {
    slug: "tasa-transicion-media",
    name: "Tasa de transición a educación media",
    board: "permanencia",
    metric: "transicion",
    unit: "%",
    format: "rate",
    better: "up",
    definition:
      "Proporción de estudiantes que, tras aprobar el último grado de educación básica, se " +
      "matriculan en el primer curso de educación media al año siguiente.",
    formula:
      "(Nuevos matriculados en primer curso de media en el año t ÷ aprobados del último grado " +
      "de básica en el año t−1) × 100.",
    periodicity: "Anual",
    coverage: "Nacional y departamental",
    disaggregation: ["Sexo", "Área", "Departamento"],
    notes:
      "Es el punto de fuga más grande del sistema: mide el salto entre dos niveles que muchas " +
      "veces no están en la misma comunidad.",
    limitations:
      "No captura a quienes se matriculan tras una interrupción de más de un año lectivo.",
  },
  {
    slug: "tasa-retencion",
    name: "Tasa de retención",
    board: "permanencia",
    metric: "retencion",
    unit: "%",
    format: "rate",
    better: "up",
    definition:
      "Proporción de estudiantes matriculados al inicio del año lectivo que permanecen en el " +
      "sistema educativo al cierre del mismo año.",
    formula: "(Estudiantes presentes al cierre ÷ estudiantes matriculados al inicio) × 100.",
    periodicity: "Anual",
    coverage: "Nacional y departamental",
    disaggregation: ["Nivel educativo", "Sexo", "Área", "Departamento"],
    notes: "Complementaria de la deserción; se publican juntas para que ninguna se lea sola.",
    limitations: "Comparte con la deserción la dependencia del registro de traslados.",
  },
  {
    slug: "relacion-estudiante-docente",
    name: "Relación estudiante/docente",
    board: "docentes",
    metric: "ratio",
    unit: "estudiantes por docente",
    format: "decimal",
    better: "down",
    definition:
      "Número promedio de estudiantes matriculados por cada docente en servicio en el sistema " +
      "educativo público y privado.",
    formula: "Matrícula total ÷ número de docentes en servicio.",
    periodicity: "Anual",
    coverage: "Nacional y departamental",
    disaggregation: ["Nivel educativo", "Área", "Departamento"],
    notes:
      "No es el tamaño de la clase: un docente puede atender varios grupos y un grupo puede " +
      "tener varios docentes. Se lee como indicador de dotación, no de aula.",
    limitations:
      "Un promedio nacional oculta la dispersión: el mismo valor puede describir aulas de 18 " +
      "y de 45 estudiantes en el mismo departamento.",
  },
  {
    slug: "centros-con-conectividad",
    name: "Centros educativos con conectividad",
    board: "infraestructura",
    metric: "conectividad",
    unit: "%",
    format: "rate",
    better: "up",
    definition:
      "Proporción de centros educativos que declaran contar con acceso a internet en " +
      "funcionamiento al momento del levantamiento anual.",
    formula: "(Centros con conexión a internet operativa ÷ total de centros educativos) × 100.",
    periodicity: "Anual",
    coverage: "Nacional y departamental",
    disaggregation: ["Área", "Administración", "Departamento"],
    notes:
      "Se mide la conexión operativa, no la contratada: un centro con contrato suspendido " +
      "cuenta como sin conectividad.",
    limitations:
      "No mide ancho de banda ni cobertura dentro del centro; un solo punto de acceso en la " +
      "dirección cuenta igual que una red completa.",
  },
  {
    slug: "matricula-educacion-tecnica",
    name: "Matrícula en educación técnica",
    board: "tecnica",
    metric: "tecnica",
    unit: "estudiantes",
    format: "count",
    better: "up",
    definition:
      "Estudiantes de educación media matriculados en modalidades técnicas y profesionales " +
      "que conducen a una titulación con salida laboral.",
    formula:
      "Suma de matriculados en carreras técnicas de educación media, por familia profesional.",
    periodicity: "Anual",
    coverage: "Nacional y departamental",
    disaggregation: ["Familia profesional", "Sexo", "Área", "Departamento"],
    notes:
      "Se reporta como subconjunto de la matrícula de media, no como un nivel aparte: un " +
      "estudiante técnico ya está contado en la matrícula total.",
    limitations:
      "No incluye la formación profesional no escolarizada, que se registra en otro sistema.",
  },
  {
    slug: "brecha-digital-hogares",
    name: "Brecha digital en hogares de estudiantes",
    board: "inclusion",
    metric: "brecha_digital",
    unit: "%",
    format: "rate",
    better: "down",
    definition:
      "Proporción de hogares con estudiantes matriculados que no cuentan con conexión a " +
      "internet ni dispositivo de uso educativo en el hogar.",
    formula:
      "(Hogares con estudiantes sin conexión ni dispositivo ÷ total de hogares con estudiantes) × 100.",
    periodicity: "Anual",
    coverage: "Nacional y departamental",
    disaggregation: ["Área", "Departamento", "Nivel educativo"],
    notes:
      "Se sigue junto a la conectividad de centros: un sistema puede conectar sus escuelas y " +
      "seguir teniendo una brecha en casa.",
    limitations:
      "Se construye sobre declaración del hogar en el levantamiento anual, no sobre medición técnica.",
  },
];

export const bySlug = Object.fromEntries(indicators.map((item) => [item.slug, item]));

/** The indicators shown on a given board. */
export const indicatorsOfBoard = (board) => indicators.filter((item) => item.board === board);

/**
 * Resolve an indicator to its current value, its trend and its history.
 *
 * The detail page, the board tile and the home "indicadores recientes" strip
 * all call this, so a change in the data reaches every surface at once.
 */
export function resolve(indicator, { year = CURRENT_YEAR, department = "all" } = {}) {
  const value =
    indicator.format === "rate"
      ? rate(indicator.metric, { year, department })
      : metricFor(indicator.metric, { year, department });

  const previous =
    indicator.format === "rate"
      ? rate(indicator.metric, { year: year - 1, department })
      : metricFor(indicator.metric, { year: year - 1, department });

  const change = previous ? Math.round((value - previous) * 10) / 10 : null;
  const percent = indicator.format === "count" ? variation(indicator.metric, { year, department }) : null;

  return {
    ...indicator,
    year,
    department,
    value,
    previous,
    change,
    percent,
    /* "Better" is a property of the indicator, not of the sign: a falling
       dropout rate is good news and the interface has to know that. */
    improving: change === null ? null : indicator.better === "up" ? change >= 0 : change <= 0,
    history: indicator.format === "rate"
      ? seriesOfRate(indicator.metric, department)
      : series(indicator.metric, { department }),
  };
}

const seriesOfRate = (metric, department) =>
  series(metric, { department }).map(({ year, value }) => ({ year, value: value ?? 0 }));

/* ------------------------------------------------------------------ ODS 4 */

/**
 * Sustainable Development Goal 4 follow-up.
 *
 * Status is never colour alone: every row carries a word and an icon as well,
 * because a reader who cannot separate the greens from the ambers still has to
 * be able to read the table.
 */
export const sdg4 = {
  title: "Seguimiento al Objetivo de Desarrollo Sostenible 4",
  lead:
    "Garantizar una educación inclusiva, equitativa y de calidad, y promover oportunidades de " +
    "aprendizaje durante toda la vida para todas y todos.",
  states: {
    cumplido: { label: "Cumplido", icon: "check", note: "La meta intermedia fue alcanzada." },
    curso: { label: "En curso", icon: "arrow", note: "Avanza dentro del rango previsto." },
    atencion: { label: "Requiere atención", icon: "alert", note: "El avance está por debajo de lo previsto." },
  },
  targets: [
    {
      id: "4.1",
      target: "Educación primaria y secundaria completa",
      indicator: "Tasa de finalización de educación básica",
      baseline: 71.4,
      current: 78.9,
      goal: 88.0,
      unit: "%",
      state: "curso",
    },
    {
      id: "4.2",
      target: "Desarrollo en la primera infancia",
      indicator: "Cobertura neta en prebásica",
      baseline: 43.1,
      current: 48.1,
      goal: 62.0,
      unit: "%",
      state: "atencion",
    },
    {
      id: "4.3",
      target: "Acceso a formación técnica y superior",
      indicator: "Matrícula en educación técnica de media",
      baseline: 62_400,
      current: 80_737,
      goal: 96_000,
      unit: "estudiantes",
      state: "curso",
    },
    {
      id: "4.4",
      target: "Competencias para el empleo",
      indicator: "Inserción laboral de egresados técnicos",
      baseline: 56.2,
      current: 63.6,
      goal: 72.0,
      unit: "%",
      state: "curso",
    },
    {
      id: "4.5",
      target: "Equidad y eliminación de disparidades",
      indicator: "Brecha de cobertura urbano–rural en media",
      baseline: 22.6,
      current: 17.4,
      goal: 8.0,
      unit: "puntos",
      state: "atencion",
    },
    {
      id: "4.6",
      target: "Alfabetización de jóvenes y adultos",
      indicator: "Tasa de alfabetización de 15 a 24 años",
      baseline: 94.1,
      current: 96.8,
      goal: 98.0,
      unit: "%",
      state: "curso",
    },
    {
      id: "4.a",
      target: "Entornos de aprendizaje adecuados",
      indicator: "Centros con agua, electricidad y saneamiento",
      baseline: 52.8,
      current: 64.9,
      goal: 80.0,
      unit: "%",
      state: "curso",
    },
    {
      id: "4.c",
      target: "Docentes cualificados",
      indicator: "Docentes con formación acreditada para su nivel",
      baseline: 81.3,
      current: 88.6,
      goal: 95.0,
      unit: "%",
      state: "cumplido",
    },
  ],
  note:
    "Metas, líneas base y resultados son valores demostrativos definidos para este prototipo. " +
    "No corresponden a los compromisos oficiales de ningún país.",
};

/* ------------------------------------------------------- teacher dashboard */

/** Figures the teacher board needs that are not rates over the map. */
export const teaching = {
  bySex: [
    { id: "f", name: "Mujeres", value: 0.643 },
    { id: "m", name: "Hombres", value: 0.357 },
  ],
  byLevel: [
    { id: "pre", name: "Prebásica", value: 9_180 },
    { id: "bas", name: "Básica", value: 47_960 },
    { id: "med", name: "Media", value: 21_100 },
  ],
  training: [
    { id: "acreditada", name: "Formación acreditada para el nivel", value: 88.6 },
    { id: "superior", name: "Con titulación universitaria", value: 61.2 },
    { id: "posgrado", name: "Con estudios de posgrado", value: 14.7 },
    { id: "continua", name: "En formación continua el último año", value: 46.3 },
  ],
  developmentSeries: {
    2019: 31.4, 2020: 28.9, 2021: 33.6, 2022: 38.2, 2023: 41.7, 2024: 44.1, 2025: 45.4, 2026: 46.3,
  },
};

/* --------------------------------------------------- technical education */

export const technical = {
  families: [
    { id: "agro", name: "Agropecuaria y agroindustria", students: 14_820, centres: 96 },
    { id: "industrial", name: "Industrial y manufactura", students: 13_460, centres: 78 },
    { id: "informatica", name: "Informática y desarrollo digital", students: 12_980, centres: 91 },
    { id: "salud", name: "Salud y cuidados", students: 9_640, centres: 47 },
    { id: "turismo", name: "Turismo y hostelería", students: 8_120, centres: 52 },
    { id: "administracion", name: "Administración y contaduría", students: 11_390, centres: 84 },
    { id: "construccion", name: "Construcción y obra civil", students: 6_240, centres: 38 },
    { id: "energia", name: "Energía y mantenimiento", students: 4_087, centres: 26 },
  ],
  centres: 486,
  insertion: 63.6,
  note: "Familias profesionales definidas para la demostración.",
};

/* ------------------------------------------------------- infrastructure */

export const infrastructure = [
  { metric: "electricidad", name: "Acceso a electricidad", icon: "bolt" },
  { metric: "agua", name: "Acceso a agua", icon: "drop" },
  { metric: "conectividad", name: "Conectividad a internet", icon: "signal" },
  { metric: "laboratorios", name: "Laboratorio o taller equipado", icon: "flask" },
  { metric: "bibliotecas", name: "Biblioteca o centro de recursos", icon: "book" },
  { metric: "accesibilidad", name: "Accesibilidad física", icon: "access" },
];

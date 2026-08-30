/**
 * Transparency portal and open-data catalogue.
 *
 * A transparency section is judged by whether the obligation is visible: what
 * has to be published, how often, when it was last published, and where the
 * file is. So each category here carries its own state and date rather than
 * being a list of links, and the datasets carry coverage, periodicity and
 * methodology rather than only a download button.
 *
 * Invented in full. The downloads are simulated — the prototype produces a real
 * file from the data it already holds rather than pretending to fetch one.
 */

/* ---------------------------------------------------------- transparency */

export const transparencyCategories = [
  {
    id: "marco",
    index: "01",
    name: "Marco institucional",
    text: "Norma de creación, mandato, funciones y reglamento interno del Consejo.",
    items: [
      { title: "Ley de Articulación del Sistema Educativo Nacional", updated: "2021-04-18", format: "PDF" },
      { title: "Reglamento interno de sesiones", updated: "2024-06-11", format: "PDF" },
      { title: "Mandato y funciones", updated: "2026-01-15", format: "Página" },
    ],
  },
  {
    id: "organizacion",
    index: "02",
    name: "Organización",
    text: "Estructura, composición del Consejo y responsabilidades de cada instancia.",
    items: [
      { title: "Estructura institucional", updated: "2026-02-20", format: "Página" },
      { title: "Composición del Consejo", updated: "2026-02-20", format: "Página" },
      { title: "Actas de sesión 2026", updated: "2026-08-06", format: "PDF" },
    ],
  },
  {
    id: "planes",
    index: "03",
    name: "Planes",
    text: "Plan nacional, planificación operativa anual y su seguimiento público.",
    items: [
      { title: "Plan Nacional de Transformación Educativa 2026–2035", updated: "2026-03-12", format: "PDF" },
      { title: "Plan operativo anual 2026", updated: "2026-01-30", format: "PDF" },
      { title: "Informe semestral de avance", updated: "2026-07-24", format: "PDF" },
    ],
  },
  {
    id: "presupuesto",
    index: "04",
    name: "Presupuesto",
    text: "Presupuesto asignado, ejecución trimestral y distribución territorial.",
    items: [
      { title: "Presupuesto aprobado 2026", updated: "2026-01-12", format: "PDF" },
      { title: "Ejecución presupuestaria · segundo trimestre", updated: "2026-07-15", format: "XLSX" },
      { title: "Distribución territorial de la inversión", updated: "2026-07-15", format: "CSV" },
    ],
  },
  {
    id: "informes",
    index: "05",
    name: "Informes",
    text: "Informes anuales, estadísticos y de evaluación producidos por el Consejo.",
    items: [
      { title: "Estado de la educación 2026", updated: "2026-08-12", format: "PDF" },
      { title: "Boletín estadístico · primer semestre", updated: "2026-07-18", format: "PDF" },
      { title: "Informe de conectividad de centros", updated: "2025-10-15", format: "PDF" },
    ],
  },
  {
    id: "contrataciones",
    index: "06",
    name: "Contrataciones",
    text: "Procesos de compra y contratación, con su estado y su documentación.",
    items: [
      { title: "Procesos en curso", updated: "2026-08-25", format: "Página" },
      { title: "Contratos adjudicados 2026", updated: "2026-08-01", format: "CSV" },
      { title: "Plan anual de compras", updated: "2026-01-30", format: "PDF" },
    ],
  },
  {
    id: "rendicion",
    index: "07",
    name: "Rendición de cuentas",
    text: "Informe anual de rendición y su sesión pública de presentación.",
    items: [
      { title: "Informe de rendición de cuentas 2025", updated: "2026-02-27", format: "PDF" },
      { title: "Sesión pública de rendición", updated: "2026-03-05", format: "Video" },
      { title: "Respuestas a las preguntas recibidas", updated: "2026-03-20", format: "PDF" },
    ],
  },
  {
    id: "solicitudes",
    index: "08",
    name: "Solicitudes de información",
    text: "Cómo solicitar información pública y estadísticas de respuesta.",
    items: [
      { title: "Formulario de solicitud", updated: "2026-01-15", format: "Página" },
      { title: "Estadística de solicitudes 2026", updated: "2026-08-01", format: "CSV" },
      { title: "Índice de información reservada", updated: "2026-01-15", format: "PDF" },
    ],
  },
];

/** Response statistics for the requests panel. Demonstration figures. */
export const requests = {
  received: 342,
  answered: 329,
  averageDays: 6.4,
  withinDeadline: 96.2,
  byTopic: [
    { name: "Estadísticas y series históricas", value: 128 },
    { name: "Normativa y resoluciones", value: 74 },
    { name: "Presupuesto y ejecución", value: 61 },
    { name: "Planificación y programas", value: 47 },
    { name: "Otros", value: 32 },
  ],
};

/* --------------------------------------------------------------- datasets */

export const datasetFormats = ["CSV", "XLSX", "JSON"];

/**
 * The open-data catalogue.
 *
 * `rows` and `updated` exist because a catalogue without them is a list of
 * promises. `metric` names the series in `statistics.js` that the simulated
 * download is actually built from, so a downloaded file is not a placeholder:
 * it contains the same numbers the charts drew.
 */
export const datasets = [
  {
    slug: "matricula-por-nivel",
    title: "Matrícula por nivel educativo",
    theme: "Matrícula",
    metric: "matricula",
    coverage: "Nacional y departamental · 2019–2026",
    periodicity: "Anual",
    updated: "2026-08-20",
    rows: 432,
    licence: "Datos abiertos · atribución",
    summary:
      "Estudiantes matriculados por año, nivel educativo y departamento, con desagregación por " +
      "sexo, área, administración, jornada y modalidad.",
    methodology:
      "Registro administrativo de matrícula con fecha de corte única. Los duplicados entre " +
      "centros se resuelven por identificador único de estudiante antes de la agregación.",
  },
  {
    slug: "centros-educativos",
    title: "Centros educativos",
    theme: "Infraestructura",
    metric: "centros",
    coverage: "Nacional y departamental · 2019–2026",
    periodicity: "Anual",
    updated: "2026-08-20",
    rows: 144,
    licence: "Datos abiertos · atribución",
    summary:
      "Número de centros educativos en funcionamiento por año y departamento, con su " +
      "distribución por área y administración.",
    methodology:
      "Directorio de centros con estado activo al cierre del levantamiento anual. Un centro con " +
      "varias jornadas se cuenta una sola vez.",
  },
  {
    slug: "personal-docente",
    title: "Personal docente",
    theme: "Docentes",
    metric: "docentes",
    coverage: "Nacional y departamental · 2019–2026",
    periodicity: "Anual",
    updated: "2026-08-20",
    rows: 144,
    licence: "Datos abiertos · atribución",
    summary:
      "Docentes en servicio por año y departamento, con la relación estudiante/docente derivada.",
    methodology:
      "Personal con función docente activa al corte anual. Excluye personal administrativo y " +
      "de apoyo, que se reporta por separado.",
  },
  {
    slug: "cobertura-educativa",
    title: "Indicadores de cobertura",
    theme: "Cobertura",
    metric: "cobertura_med",
    coverage: "Nacional y departamental · 2019–2026",
    periodicity: "Anual",
    updated: "2026-08-20",
    rows: 576,
    licence: "Datos abiertos · atribución",
    summary:
      "Tasas de cobertura neta por nivel y ciclo, por año y departamento.",
    methodology:
      "Matrícula en edad oficial sobre población proyectada del mismo grupo de edad. La " +
      "proyección utilizada se documenta en el manual metodológico.",
  },
  {
    slug: "permanencia-escolar",
    title: "Indicadores de permanencia",
    theme: "Permanencia",
    metric: "desercion",
    coverage: "Nacional y departamental · 2019–2026",
    periodicity: "Anual",
    updated: "2026-08-20",
    rows: 720,
    licence: "Datos abiertos · atribución",
    summary:
      "Retención, deserción intranual, repitencia, transición y sobreedad por año y departamento.",
    methodology:
      "Comparación de registros de inicio y cierre del año lectivo, con descuento de traslados " +
      "confirmados entre centros.",
  },
  {
    slug: "infraestructura-servicios",
    title: "Infraestructura y servicios del centro",
    theme: "Infraestructura",
    metric: "conectividad",
    coverage: "Nacional y departamental · 2019–2026",
    periodicity: "Anual",
    updated: "2026-08-20",
    rows: 864,
    licence: "Datos abiertos · atribución",
    summary:
      "Acceso a electricidad, agua, conectividad, laboratorios, bibliotecas y accesibilidad " +
      "física, en porcentaje de centros.",
    methodology:
      "Declaración del centro en el levantamiento anual de condiciones, con verificación " +
      "muestral posterior.",
  },
  {
    slug: "educacion-tecnica",
    title: "Educación técnica y profesional",
    theme: "Educación técnica",
    metric: "tecnica",
    coverage: "Nacional y departamental · 2019–2026",
    periodicity: "Anual",
    updated: "2026-08-20",
    rows: 288,
    licence: "Datos abiertos · atribución",
    summary:
      "Matrícula técnica por año y departamento, y su distribución por familia profesional.",
    methodology:
      "Subconjunto de la matrícula de educación media inscrita en carreras técnicas del " +
      "catálogo nacional de familias profesionales.",
  },
  {
    slug: "indicadores-territoriales",
    title: "Indicadores territoriales comparables",
    theme: "Territorio",
    metric: "matricula",
    coverage: "18 departamentos · 2019–2026",
    periodicity: "Anual",
    updated: "2026-08-20",
    rows: 2_592,
    licence: "Datos abiertos · atribución",
    summary:
      "Tabla única con todos los indicadores del sistema por departamento y año, pensada para " +
      "análisis comparativo.",
    methodology:
      "Consolidación de los conjuntos anteriores en formato largo, con una fila por " +
      "departamento, año e indicador.",
  },
];

export const datasetBySlug = Object.fromEntries(datasets.map((d) => [d.slug, d]));

/* ------------------------------------------------------------ methodology */

/** The methodology page, section by section. */
export const methodology = [
  {
    index: "01",
    id: "fuentes",
    title: "Fuentes",
    text:
      "Las series del portal se construyen sobre tres tipos de fuente: el registro " +
      "administrativo de matrícula y centros, el registro de personal docente, y las " +
      "proyecciones de población que sirven de denominador a las tasas de cobertura. Cada " +
      "indicador declara de cuál de las tres proviene.\n\n" +
      "En esta demostración las tres son simuladas. En un despliegue real, cada una " +
      "corresponde a un sistema institucional distinto, con su propio responsable y su propio " +
      "calendario de cierre.\n\n" +
      "La cartografía es la excepción: los límites de los dieciocho departamentos son reales y " +
      "provienen de geoBoundaries (gbOpen, ADM1), publicados bajo licencia CC BY 4.0. Se usan tal " +
      "cual, proyectados y simplificados para pantalla; todo lo que se pinta sobre ellos es " +
      "demostrativo.",
  },
  {
    index: "02",
    id: "validacion",
    title: "Validación",
    text:
      "Antes de publicarse, cada serie pasa por tres controles: consistencia interna (las " +
      "desagregaciones suman el total), consistencia temporal (ninguna variación anual queda " +
      "sin explicación documentada) y cruce entre registros (matrícula contra directorio de " +
      "centros, y centros contra personal docente).\n\n" +
      "Cuando un control falla, la serie no se publica: se publica la nota que explica por qué " +
      "no está.",
  },
  {
    index: "03",
    id: "periodicidad",
    title: "Periodicidad",
    text:
      "El levantamiento es anual y sigue el calendario aprobado por el Consejo: fecha de corte " +
      "única para todos los reportantes, ventana de validación cruzada y fecha única de " +
      "publicación. Los boletines semestrales no abren series nuevas: comentan las existentes.",
  },
  {
    index: "04",
    id: "desagregacion",
    title: "Desagregaciones",
    text:
      "Toda cifra nacional se publica desagregada por nivel educativo, sexo, área, " +
      "administración y departamento, y —cuando la fuente lo permite— por jornada y modalidad. " +
      "Un promedio nacional que no puede desagregarse territorialmente no informa sobre un " +
      "país con las diferencias del nuestro.",
  },
  {
    index: "05",
    id: "limitaciones",
    title: "Limitaciones",
    text:
      "Las tasas de cobertura dependen de la proyección de población usada como denominador: " +
      "un cambio de proyección mueve el indicador sin que se haya movido la matrícula. Las " +
      "tasas de permanencia dependen del registro de traslados entre centros. Los indicadores " +
      "de infraestructura se construyen sobre declaración del centro, con verificación " +
      "muestral posterior.\n\n" +
      "Estas limitaciones se publican junto a cada indicador, no en una nota al pie.",
  },
  {
    index: "06",
    id: "diccionario",
    title: "Diccionario de variables",
    text:
      "Cada conjunto de datos se publica con su diccionario: nombre de la variable, tipo, " +
      "unidad, valores admitidos y tratamiento de los datos faltantes. El diccionario forma " +
      "parte de la descarga, no de una página aparte.",
  },
];

/** The variable dictionary, as a table. */
export const dictionary = [
  { name: "anio", type: "Entero", unit: "Año", values: "2019–2026", note: "Año lectivo de referencia." },
  { name: "departamento", type: "Texto", unit: "Código", values: "18 códigos de dos letras", note: "Código territorial del portal." },
  { name: "nivel", type: "Texto", unit: "Categoría", values: "pre · bas · med", note: "Nivel educativo." },
  { name: "sexo", type: "Texto", unit: "Categoría", values: "f · m", note: "Sexo registrado en la matrícula." },
  { name: "area", type: "Texto", unit: "Categoría", values: "urbano · rural", note: "Área del centro educativo." },
  { name: "administracion", type: "Texto", unit: "Categoría", values: "publica · privada · semioficial", note: "Régimen del centro." },
  { name: "valor", type: "Entero o decimal", unit: "Según indicador", values: "≥ 0", note: "Vacío cuando el dato no está disponible; nunca cero por defecto." },
];

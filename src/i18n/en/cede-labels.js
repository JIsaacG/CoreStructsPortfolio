/**
 * English for the CEDE demo — the last of the short labels.
 *
 * Filter controls, table cells, the back office's chrome and the coded values
 * the variable dictionary documents. The coded values are the interesting case:
 * "pre · bas · med" and "publica · privada · semioficial" are what actually
 * appears inside the CSV files the portal publishes, so they are translated to
 * the codes an English-language file would carry, and the dictionary row that
 * documents them says the same thing.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/cede";

export default {
  /* ------------------------------------------------------------ the filters */

  Filtros: "Filters",
  Restablecer: "Reset",
  Vista: "View",
  "Vista previa": "Preview",
  Municipio: "Municipality",
  Ambos: "Both",
  "Urbana y rural": "Urban and rural",
  "Tabla completa": "Full table",
  "Tabla comparativa": "Comparison table",
  Herramienta: "Tool",
  "Comparar territorios.": "Compare territories.",
  "Territorio 1": "Territory 1",
  "Territorio 2": "Territory 2",
  "Territorio 3": "Territory 3",
  "Buscador global": "Site-wide search",
  Fuentes: "Sources",
  Conjuntos: "Datasets",
  Formatos: "Formats",
  Categorías: "Categories",

  /* ------------------------------------------------------ figures and units */

  "Nacional · 2026": "National · 2026",
  "Docentes en servicio": "Serving teachers",
  "Docentes cualificados": "Qualified teachers",
  "Estudiantes en centros rurales": "Students at rural schools",
  "Familias profesionales": "Vocational families",
  "Presupuesto educativo asignado": "Education budget allocated",
  "Presupuesto asignado y ejecutado": "Budget allocated and spent",
  Asignado: "Allocated",
  "vs. 2025": "vs. 2025",
  "% vs. 2025": "% vs. 2025",
  "pp vs. 2025": "pp vs. 2025",
  "476–4 mil": "476–4k",
  "18 departamentos · 2019–2026": "18 departments · 2019–2026",
  "Media: 35.2 % en 2026": "Upper secondary: 35.2 % in 2026",
  "Acceso a electricidad: 74.7 % en 2026": "Access to electricity: 74.7 % in 2026",
  "Acceso a agua: 68.2 % en 2026": "Access to water: 68.2 % in 2026",
  "Conectividad a internet: 41.4 % en 2026": "Internet connectivity: 41.4 % in 2026",

  /* ------------------------------------------------ the library, one more time */

  "Informe · Infraestructura": "Report · Infrastructure",
  "Manual · Infraestructura": "Manual · Infrastructure",
  "Conectividad en centros educativos: levantamiento nacional":
    "Connectivity in schools: the national survey",
  "Indicadores territoriales comparables": "Comparable territorial indicators",

  /* --------------------------------------------- the variable dictionary's codes */

  Entero: "Integer",
  "Entero o decimal": "Integer or decimal",
  "pre · bas · med": "pre · bas · sec",
  "f · m": "f · m",
  "urbano · rural": "urban · rural",
  "publica · privada · semioficial": "state · private · semi-official",
  "Nivel educativo.": "Education level.",

  /* ------------------------------------------------------------ back office */

  Contenido: "Content",
  "Contenido publicado": "Published content",
  "Usuarios y permisos": "Users and permissions",
  "Elementos publicados": "Items published",
  "En nueve colecciones": "Across nine collections",
  "Cuatro perfiles": "Four profiles",
  "1 abierta": "1 open",
  ST: "ST",
};

/**
 * The documentary corpus: normative framework, council decisions and library.
 *
 * Every document is invented — its title, its code, its date, its summary and
 * its file size. The codes are deliberately prefixed with the fictional
 * entity's own initials (`CEDE-…`, `ACUERDO CEDE …`) so that no reference here
 * can be mistaken for a real instrument of any state.
 *
 * The files themselves do not exist: "Descargar PDF" is wired to the download
 * simulation, which is what a prototype should do rather than ship an empty
 * PDF. A deployment points `file` at the document repository and the interface
 * does not change.
 */

/* ------------------------------------------------------------------ types */

export const documentTypes = [
  { id: "ley", name: "Ley", plural: "Leyes" },
  { id: "reglamento", name: "Reglamento", plural: "Reglamentos" },
  { id: "acuerdo", name: "Acuerdo", plural: "Acuerdos" },
  { id: "politica", name: "Política", plural: "Políticas" },
  { id: "lineamiento", name: "Lineamiento", plural: "Lineamientos" },
  { id: "resolucion", name: "Resolución", plural: "Resoluciones" },
  { id: "circular", name: "Circular", plural: "Circulares" },
];

export const themes = [
  { id: "politica", name: "Política educativa" },
  { id: "docente", name: "Formación docente" },
  { id: "tecnica", name: "Educación técnica" },
  { id: "datos", name: "Datos e información" },
  { id: "inclusion", name: "Inclusión y equidad" },
  { id: "infraestructura", name: "Infraestructura" },
  { id: "participacion", name: "Participación ciudadana" },
  { id: "evaluacion", name: "Evaluación y currículo" },
  { id: "digital", name: "Transformación digital" },
];

export const documentStates = [
  { id: "vigente", name: "Vigente" },
  { id: "revision", name: "En revisión" },
  { id: "derogada", name: "Derogada" },
];

/* -------------------------------------------------------------- normative */

/**
 * The normative library.
 *
 * Twenty-six instruments across seven types and eight themes — enough that the
 * filters, the search and the pagination are doing real work rather than
 * decorating three rows.
 */
export const normative = [
  { code: "CEDE-L-001", type: "ley", theme: "politica", title: "Ley de Articulación del Sistema Educativo Nacional", date: "2021-04-18", state: "vigente", size: "1,8 MB", pages: 64, summary: "Crea el Consejo, define su mandato de coordinación y establece el sistema nacional de información educativa como base de la política pública." },
  { code: "CEDE-L-002", type: "ley", theme: "datos", title: "Ley de Información Estadística Educativa", date: "2022-02-09", state: "vigente", size: "980 KB", pages: 38, summary: "Regula la producción, validación y publicación de las estadísticas educativas nacionales, y establece la apertura de datos como regla general." },
  { code: "CEDE-L-003", type: "ley", theme: "tecnica", title: "Ley de Formación Técnica y Profesional", date: "2023-06-27", state: "vigente", size: "1,2 MB", pages: 47, summary: "Ordena la oferta técnica de educación media, su relación con la formación profesional y el reconocimiento de competencias." },
  { code: "CEDE-RG-004", type: "reglamento", theme: "datos", title: "Reglamento del Sistema Nacional de Información Educativa", date: "2022-08-15", state: "vigente", size: "1,1 MB", pages: 52, summary: "Desarrolla la ley estadística: responsabilidades de reporte, calendario de levantamiento, validación y publicación de series." },
  { code: "CEDE-RG-005", type: "reglamento", theme: "participacion", title: "Reglamento de Consulta Pública de Políticas Educativas", date: "2024-03-11", state: "vigente", size: "720 KB", pages: 29, summary: "Establece el procedimiento de consulta previa, los plazos mínimos y la obligación de publicar cómo se consideró cada aporte." },
  { code: "CEDE-RG-006", type: "reglamento", theme: "docente", title: "Reglamento de Formación Continua Docente", date: "2024-09-02", state: "vigente", size: "860 KB", pages: 34, summary: "Define el ciclo de formación continua, su acreditación y su reconocimiento en la carrera docente." },
  { code: "CEDE-RG-007", type: "reglamento", theme: "infraestructura", title: "Reglamento de Condiciones Mínimas del Centro Educativo", date: "2025-01-23", state: "revision", size: "1,4 MB", pages: 58, summary: "Fija las condiciones de agua, electricidad, saneamiento, conectividad y accesibilidad exigibles a un centro educativo." },
  { code: "ACUERDO CEDE 014-2026", type: "acuerdo", theme: "politica", title: "Aprobación del Plan Nacional de Transformación Educativa 2026–2035", date: "2026-03-12", state: "vigente", size: "640 KB", pages: 22, summary: "Aprueba el plan nacional, sus cinco ejes, sus quince indicadores estratégicos y el tablero público de seguimiento." },
  { code: "ACUERDO CEDE 013-2026", type: "acuerdo", theme: "docente", title: "Marco de competencias para la formación docente", date: "2026-02-26", state: "vigente", size: "1,0 MB", pages: 41, summary: "Adopta el marco común de competencias que orienta la formación inicial y continua del personal docente." },
  { code: "ACUERDO CEDE 011-2026", type: "acuerdo", theme: "datos", title: "Calendario nacional de levantamiento estadístico", date: "2026-01-29", state: "vigente", size: "310 KB", pages: 12, summary: "Fija las fechas de corte, reporte y publicación de las estadísticas educativas del año lectivo." },
  { code: "ACUERDO CEDE 008-2025", type: "acuerdo", theme: "inclusion", title: "Lineamiento de accesibilidad en centros educativos", date: "2025-11-14", state: "vigente", size: "890 KB", pages: 36, summary: "Establece los ajustes razonables y las condiciones de accesibilidad que todo centro debe garantizar." },
  { code: "ACUERDO CEDE 006-2025", type: "acuerdo", theme: "tecnica", title: "Catálogo nacional de familias profesionales", date: "2025-08-07", state: "vigente", size: "1,6 MB", pages: 73, summary: "Aprueba las familias profesionales de la educación técnica de media y sus perfiles de egreso." },
  { code: "ACUERDO CEDE 003-2024", type: "acuerdo", theme: "evaluacion", title: "Sistema Nacional de Evaluación de Aprendizajes", date: "2024-05-30", state: "vigente", size: "1,3 MB", pages: 55, summary: "Crea el sistema de evaluación de aprendizajes, su periodicidad y las reglas de publicación de resultados." },
  { code: "CEDE-P-001", type: "politica", theme: "politica", title: "Política Educativa Nacional 2026–2035", date: "2026-03-12", state: "vigente", size: "2,4 MB", pages: 96, summary: "Documento marco de la política educativa: objetivos, principios, líneas estratégicas y mecanismos de seguimiento." },
  { code: "CEDE-P-002", type: "politica", theme: "inclusion", title: "Política de Inclusión y Equidad Educativa", date: "2025-06-19", state: "vigente", size: "1,9 MB", pages: 78, summary: "Orienta la acción del sistema para cerrar brechas territoriales, de género, de discapacidad y de pertenencia cultural." },
  { code: "CEDE-P-003", type: "politica", theme: "digital", title: "Política de Transformación Digital Educativa", date: "2025-10-08", state: "vigente", size: "1,5 MB", pages: 62, summary: "Define la estrategia de conectividad, dispositivos, contenidos y competencias digitales del sistema educativo." },
  { code: "CEDE-P-004", type: "politica", theme: "docente", title: "Política Nacional de Desarrollo Docente", date: "2024-11-27", state: "vigente", size: "1,7 MB", pages: 70, summary: "Articula formación inicial, inducción, formación continua y carrera profesional docente." },
  { code: "LIN-CEDE-2026-009", type: "lineamiento", theme: "tecnica", title: "Lineamientos para el fortalecimiento de la educación técnica", date: "2026-07-02", state: "revision", size: "740 KB", pages: 31, summary: "Orientaciones para actualizar la oferta técnica con el sector productivo. Actualmente en consulta pública." },
  { code: "LIN-CEDE-2026-005", type: "lineamiento", theme: "datos", title: "Lineamientos de publicación de datos abiertos educativos", date: "2026-04-16", state: "vigente", size: "520 KB", pages: 24, summary: "Formatos, licencias, metadatos y periodicidad exigibles a todo conjunto de datos publicado por el sistema." },
  { code: "LIN-CEDE-2025-012", type: "lineamiento", theme: "evaluacion", title: "Lineamientos de uso de resultados de evaluación", date: "2025-09-25", state: "vigente", size: "610 KB", pages: 27, summary: "Cómo se comunican y se usan los resultados de evaluación sin convertirlos en clasificaciones de centros." },
  { code: "LIN-CEDE-2025-004", type: "lineamiento", theme: "participacion", title: "Lineamientos de participación de comunidades educativas", date: "2025-03-20", state: "vigente", size: "480 KB", pages: 21, summary: "Mecanismos de participación de familias, estudiantes y comunidades en la vida del centro educativo." },
  { code: "LIN-CEDE-2024-008", type: "lineamiento", theme: "infraestructura", title: "Lineamientos de priorización de inversión en infraestructura", date: "2024-07-18", state: "vigente", size: "690 KB", pages: 30, summary: "Criterios técnicos y territoriales para priorizar la inversión en centros educativos." },
  { code: "CIR-CEDE-2026-021", type: "circular", theme: "datos", title: "Cierre del levantamiento estadístico 2026", date: "2026-08-14", state: "vigente", size: "180 KB", pages: 4, summary: "Recuerda a las instancias reportantes la fecha de cierre y el procedimiento de validación." },
  { code: "CIR-CEDE-2026-018", type: "circular", theme: "participacion", title: "Apertura de la consulta pública sobre educación técnica", date: "2026-07-06", state: "vigente", size: "150 KB", pages: 3, summary: "Comunica la apertura del período de consulta y los canales habilitados para participar." },
  { code: "CIR-CEDE-2025-011", type: "circular", theme: "docente", title: "Inscripción al ciclo de formación continua", date: "2025-04-09", state: "vigente", size: "210 KB", pages: 5, summary: "Instrucciones de inscripción y calendario del ciclo de formación continua docente." },
  { code: "CEDE-RG-002", type: "reglamento", theme: "politica", title: "Reglamento interno de sesiones del Consejo", date: "2021-09-30", state: "derogada", size: "430 KB", pages: 18, summary: "Primer reglamento de sesiones. Derogado por el Acuerdo CEDE 011-2024, que actualiza el régimen de convocatoria." },
];

/* ------------------------------------------------------------ resolutions */

/**
 * Council decisions.
 *
 * The register a collegiate body keeps: what was decided, when, on what and
 * what it produced. Codes are the fictional entity's own.
 */
export const resolutions = [
  { code: "RES-CEDE-2026-024", date: "2026-08-20", theme: "datos", session: "Ordinaria 08/2026", title: "Publicación de la serie estadística 2026", state: "vigente", summary: "Aprueba la publicación de la serie estadística del año lectivo 2026 y su apertura como datos abiertos." },
  { code: "RES-CEDE-2026-023", date: "2026-08-06", theme: "participacion", session: "Ordinaria 08/2026", title: "Ampliación del plazo de consulta sobre educación técnica", state: "vigente", summary: "Amplía en veinte días el período de consulta pública de los lineamientos de educación técnica." },
  { code: "RES-CEDE-2026-021", date: "2026-07-16", theme: "tecnica", session: "Ordinaria 07/2026", title: "Actualización de tres familias profesionales", state: "vigente", summary: "Incorpora perfiles de egreso actualizados en informática, energía y salud." },
  { code: "RES-CEDE-2026-019", date: "2026-06-25", theme: "evaluacion", session: "Ordinaria 06/2026", title: "Calendario de la evaluación nacional de aprendizajes", state: "vigente", summary: "Fija la aplicación muestral de noviembre y las reglas de difusión de resultados." },
  { code: "RES-CEDE-2026-016", date: "2026-05-28", theme: "inclusion", session: "Ordinaria 05/2026", title: "Focalización territorial de la inversión educativa", state: "vigente", summary: "Adopta el índice de brecha territorial como criterio de priorización presupuestaria." },
  { code: "RES-CEDE-2026-014", date: "2026-05-07", theme: "docente", session: "Extraordinaria 02/2026", title: "Reconocimiento de la formación continua en la carrera", state: "vigente", summary: "Establece la equivalencia entre ciclos de formación continua y puntaje de carrera docente." },
  { code: "RES-CEDE-2026-011", date: "2026-04-16", theme: "datos", session: "Ordinaria 04/2026", title: "Lineamientos de datos abiertos", state: "vigente", summary: "Aprueba los formatos, licencias y metadatos obligatorios del catálogo de datos abiertos." },
  { code: "RES-CEDE-2026-009", date: "2026-03-26", theme: "infraestructura", session: "Ordinaria 03/2026", title: "Levantamiento de condiciones de centros educativos", state: "vigente", summary: "Ordena el levantamiento anual de agua, electricidad, conectividad y accesibilidad." },
  { code: "RES-CEDE-2026-007", date: "2026-03-12", theme: "politica", session: "Ordinaria 03/2026", title: "Plan Nacional de Transformación Educativa 2026–2035", state: "vigente", summary: "Aprueba el plan nacional, su estructura de ejes y su tablero público de seguimiento." },
  { code: "RES-CEDE-2026-004", date: "2026-02-12", theme: "participacion", session: "Ordinaria 02/2026", title: "Calendario anual de consultas públicas", state: "vigente", summary: "Aprueba el calendario de consultas y mesas técnicas del año." },
  { code: "RES-CEDE-2025-038", date: "2025-11-14", theme: "inclusion", session: "Ordinaria 11/2025", title: "Ajustes razonables en centros educativos", state: "vigente", summary: "Adopta el lineamiento de accesibilidad y ajustes razonables para estudiantes con discapacidad." },
  { code: "RES-CEDE-2025-031", date: "2025-09-25", theme: "evaluacion", session: "Ordinaria 09/2025", title: "Uso de resultados de evaluación", state: "vigente", summary: "Prohíbe el uso de resultados de evaluación para clasificar públicamente centros educativos." },
  { code: "RES-CEDE-2025-027", date: "2025-08-07", theme: "tecnica", session: "Ordinaria 08/2025", title: "Catálogo nacional de familias profesionales", state: "vigente", summary: "Aprueba el catálogo de familias profesionales de educación técnica de media." },
  { code: "RES-CEDE-2025-019", date: "2025-06-19", theme: "inclusion", session: "Ordinaria 06/2025", title: "Política de Inclusión y Equidad Educativa", state: "vigente", summary: "Aprueba el documento de política y su plan de aplicación por territorio." },
  { code: "RES-CEDE-2024-034", date: "2024-11-27", theme: "docente", session: "Ordinaria 11/2024", title: "Política Nacional de Desarrollo Docente", state: "vigente", summary: "Aprueba la política docente y el marco de competencias asociado." },
  { code: "RES-CEDE-2024-015", date: "2024-05-30", theme: "evaluacion", session: "Ordinaria 05/2024", title: "Creación del sistema de evaluación de aprendizajes", state: "vigente", summary: "Crea el sistema nacional de evaluación y su comité técnico." },
];

/* ------------------------------------------------------------ the library */

export const libraryKinds = [
  { id: "informe", name: "Informe" },
  { id: "investigacion", name: "Investigación" },
  { id: "estudio", name: "Estudio" },
  { id: "politica", name: "Documento de política" },
  { id: "presentacion", name: "Presentación" },
  { id: "datos", name: "Datos" },
  { id: "manual", name: "Manual" },
  { id: "boletin", name: "Boletín" },
];

/**
 * The digital library.
 *
 * The publications a research-and-statistics body produces, with the pieces
 * that make one citable: a year, a kind, a subject, an extent and a summary.
 */
export const library = [
  { slug: "estado-educacion-2026", kind: "informe", theme: "politica", year: 2026, title: "Estado de la educación en Honduras 2026", pages: 148, size: "6,2 MB", date: "2026-08-12", featured: true, summary: "Informe anual del sistema educativo: matrícula, cobertura, permanencia, docentes, infraestructura y financiamiento, con lectura territorial de cada indicador." },
  { slug: "brechas-territoriales", kind: "investigacion", theme: "inclusion", year: 2026, title: "Brechas territoriales y oportunidades para ampliar el acceso educativo", pages: 86, size: "3,4 MB", date: "2026-06-30", featured: true, summary: "Analiza por qué la cobertura de educación media se detiene en determinados territorios y qué combinación de oferta, transporte y permanencia la mueve." },
  { slug: "educacion-tecnica-competencias", kind: "investigacion", theme: "tecnica", year: 2026, title: "Educación técnica y nuevas competencias para el empleo", pages: 74, size: "2,9 MB", date: "2026-05-14", featured: true, summary: "Contrasta la oferta técnica actual con la demanda de competencias declarada por el sector productivo, y propone criterios de actualización." },
  { slug: "futuro-profesion-docente", kind: "estudio", theme: "docente", year: 2026, title: "El futuro de la profesión docente", pages: 92, size: "3,8 MB", date: "2026-04-22", summary: "Estudio prospectivo sobre formación, carrera y condiciones de ejercicio docente en la próxima década." },
  { slug: "boletin-estadistico-2026", kind: "boletin", theme: "datos", year: 2026, title: "Boletín estadístico educativo · primer semestre 2026", pages: 34, size: "1,7 MB", date: "2026-07-18", summary: "Resumen semestral de los indicadores del sistema, con las series actualizadas y las notas metodológicas del período." },
  { slug: "metodologia-indicadores", kind: "manual", theme: "datos", year: 2026, title: "Manual metodológico de indicadores educativos", pages: 118, size: "4,1 MB", date: "2026-02-27", summary: "Definición, fórmula, fuente, periodicidad y limitaciones de cada indicador del sistema nacional." },
  { slug: "plan-nacional-2026-2035", kind: "politica", theme: "politica", year: 2026, title: "Plan Nacional de Transformación Educativa 2026–2035", pages: 132, size: "5,6 MB", date: "2026-03-12", summary: "Documento completo del plan: diagnóstico, ejes, objetivos, indicadores, metas y esquema de seguimiento." },
  { slug: "primera-infancia", kind: "investigacion", theme: "inclusion", year: 2025, title: "Atención educativa en la primera infancia: cobertura y calidad", pages: 68, size: "2,6 MB", date: "2025-11-06", summary: "Examina la expansión de la prebásica y la relación entre modalidad de atención y trayectoria escolar posterior." },
  { slug: "conectividad-centros", kind: "informe", theme: "infraestructura", year: 2025, title: "Conectividad en centros educativos: levantamiento nacional", pages: 52, size: "2,2 MB", date: "2025-10-15", summary: "Resultado del levantamiento anual de conectividad operativa, con el detalle por departamento y tipo de centro." },
  { slug: "transicion-basica-media", kind: "estudio", theme: "politica", year: 2025, title: "La transición de básica a media: dónde se pierde el sistema", pages: 64, size: "2,4 MB", date: "2025-08-28", summary: "Sigue una cohorte completa para identificar en qué momento y en qué territorios se produce la salida del sistema." },
  { slug: "educacion-intercultural", kind: "investigacion", theme: "inclusion", year: 2025, title: "Educación intercultural bilingüe: cobertura y pertinencia", pages: 78, size: "3,1 MB", date: "2025-06-11", summary: "Estado de la oferta bilingüe, disponibilidad de docentes hablantes y materiales en lenguas originarias." },
  { slug: "inversion-educativa", kind: "informe", theme: "politica", year: 2025, title: "Inversión educativa y su distribución territorial", pages: 58, size: "2,3 MB", date: "2025-04-30", summary: "Cómo se asigna y se ejecuta el presupuesto educativo, y qué relación guarda con las brechas de cobertura." },
  { slug: "evaluacion-aprendizajes-2024", kind: "informe", theme: "evaluacion", year: 2024, title: "Resultados de la evaluación nacional de aprendizajes 2024", pages: 96, size: "4,4 MB", date: "2024-12-10", summary: "Resultados por nivel y área curricular, con la advertencia metodológica sobre comparabilidad entre ciclos." },
  { slug: "presentacion-plan", kind: "presentacion", theme: "politica", year: 2026, title: "Presentación del Plan Nacional 2026–2035", pages: 42, size: "8,1 MB", date: "2026-03-14", summary: "Material de la sesión pública de presentación del plan: diagnóstico, ejes y metas en formato de exposición." },
  { slug: "serie-matricula-2019-2026", kind: "datos", theme: "datos", year: 2026, title: "Serie histórica de matrícula 2019–2026", pages: null, size: "1,2 MB", date: "2026-08-20", summary: "Conjunto de datos con la matrícula por año, nivel, sexo, área, administración y departamento." },
  { slug: "manual-centro-educativo", kind: "manual", theme: "infraestructura", year: 2025, title: "Manual de condiciones mínimas del centro educativo", pages: 84, size: "3,3 MB", date: "2025-01-23", summary: "Guía operativa de las condiciones de agua, electricidad, saneamiento, conectividad y accesibilidad." },
  { slug: "boletin-territorial", kind: "boletin", theme: "inclusion", year: 2025, title: "Boletín territorial · indicadores por departamento", pages: 28, size: "1,5 MB", date: "2025-12-04", summary: "Ficha comparable de los dieciocho departamentos con los indicadores clave del año." },
  { slug: "competencias-digitales", kind: "estudio", theme: "digital", year: 2024, title: "Competencias digitales de docentes y estudiantes", pages: 70, size: "2,8 MB", date: "2024-09-19", summary: "Diagnóstico de competencias digitales y su relación con la disponibilidad de conectividad y dispositivos." },
];

/* ----------------------------------------------------------------- helpers */

export const normativeByType = (type) => normative.filter((item) => item.type === type);
export const documentYears = [...new Set(normative.map((item) => item.date.slice(0, 4)))].sort().reverse();
export const libraryYears = [...new Set(library.map((item) => item.year))].sort((a, b) => b - a);

export const typeName = (id) => documentTypes.find((type) => type.id === id)?.name ?? id;
export const themeName = (id) => themes.find((theme) => theme.id === id)?.name ?? id;
export const kindName = (id) => libraryKinds.find((kind) => kind.id === id)?.name ?? id;

/** Featured publications, for the home page's document strip. */
export const featuredLibrary = library.filter((item) => item.featured);

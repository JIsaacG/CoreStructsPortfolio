/**
 * English for the CEDE demo — the digital library, the search page, contact and
 * the open data catalogue.
 *
 * The catalogue entries are the most carefully written part of the portal: each
 * dataset carries a one-line description and then a note about how it was
 * built, and the note is where the honesty lives ("a school with several
 * sessions is counted once", "duplicates between schools are resolved by unique
 * student identifier before aggregation"). Those notes are what a data user
 * actually reads, so they are translated as method statements, not as blurbs.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/cede";

export default {
  /* ------------------------------------------------------------ the library */

  "Todo lo que el Consejo publica, en un solo catálogo.":
    "Everything the Council publishes, in one catalogue.",
  "Informes, investigaciones, estudios, documentos de política, manuales, boletines, presentaciones y conjuntos de datos. Publicaciones ficticias con fines demostrativos.":
    "Reports, research, studies, policy documents, manuals, bulletins, presentations and datasets. " +
    "Fictional publications, for demonstration purposes.",
  "Análisis e investigación.": "Analysis and research.",
  "Ir a la biblioteca": "Go to the library",
  "Ninguna publicación coincide con los filtros aplicados.":
    "No publication matches the filters applied.",
  "Título o descripción": "Title or description",
  Años: "Years",
  Cuadrícula: "Grid",
  "Documento de política": "Policy document",
  Presentación: "Presentation",
  Boletín: "Bulletin",

  "Datos · Datos e información": "Data · Data and information",
  "Boletín · Datos e información": "Bulletin · Data and information",
  "Boletín · Inclusión y equidad": "Bulletin · Inclusion and equity",
  "Manual · Datos e información": "Manual · Data and information",
  "Estudio · Formación docente": "Study · Teacher training",
  "Estudio · Política educativa": "Study · Education policy",
  "Estudio · Transformación digital": "Study · Digital transformation",
  "Presentación · Política educativa": "Presentation · Education policy",
  "Documento de política · Política educativa": "Policy document · Education policy",
  "Informe · Evaluación y currículo": "Report · Assessment and curriculum",

  "Serie histórica de matrícula 2019–2026": "Historical enrolment series 2019–2026",
  "Conjunto de datos con la matrícula por año, nivel, sexo, área, administración y departamento.":
    "A dataset of enrolment by year, level, sex, area, administration and department.",
  "Boletín estadístico educativo · primer semestre 2026":
    "Education statistics bulletin · first half of 2026",
  "Resumen semestral de los indicadores del sistema, con las series actualizadas y las notas metodológicas del período.":
    "A half-yearly summary of the system's indicators, with updated series and the period's " +
    "methodological notes.",
  "Estudio prospectivo sobre formación, carrera y condiciones de ejercicio docente en la próxima década.":
    "A foresight study on teacher training, career and working conditions over the coming decade.",
  "Presentación del Plan Nacional 2026–2035": "Presentation of the National Plan 2026–2035",
  "Material de la sesión pública de presentación del plan: diagnóstico, ejes y metas en formato de exposición.":
    "Material from the public session launching the plan: diagnosis, strands and targets in slide " +
    "form.",
  "Documento completo del plan: diagnóstico, ejes, objetivos, indicadores, metas y esquema de seguimiento.":
    "The full plan: diagnosis, strands, objectives, indicators, targets and the monitoring framework.",
  "Manual metodológico de indicadores educativos":
    "Methodological manual of education indicators",
  "Definición, fórmula, fuente, periodicidad y limitaciones de cada indicador del sistema nacional.":
    "The definition, formula, source, frequency and limitations of every indicator in the national " +
    "system.",
  "Boletín territorial · indicadores por departamento":
    "Territorial bulletin · indicators by department",
  "Ficha comparable de los dieciocho departamentos con los indicadores clave del año.":
    "A comparable profile of all eighteen departments, with the year's key indicators.",
  "Atención educativa en la primera infancia: cobertura y calidad":
    "Early years education: coverage and quality",
  "Examina la expansión de la prebásica y la relación entre modalidad de atención y trayectoria escolar posterior.":
    "Examines the expansion of pre-primary and the relationship between the type of provision and " +
    "how a child fares later at school.",
  "Resultado del levantamiento anual de conectividad operativa, con el detalle por departamento y tipo de centro.":
    "The result of the annual survey of working connectivity, broken down by department and type of " +
    "school.",
  "Sigue una cohorte completa para identificar en qué momento y en qué territorios se produce la salida del sistema.":
    "Follows a complete cohort to identify when, and in which territories, students leave the system.",
  "Educación intercultural bilingüe: cobertura y pertinencia":
    "Intercultural bilingual education: coverage and fit",
  "Estado de la oferta bilingüe, disponibilidad de docentes hablantes y materiales en lenguas originarias.":
    "The state of bilingual provision, the availability of speaking teachers, and materials in " +
    "indigenous languages.",
  "Inversión educativa y su distribución territorial":
    "Education spending and how it is distributed across the country",
  "Cómo se asigna y se ejecuta el presupuesto educativo, y qué relación guarda con las brechas de cobertura.":
    "How the education budget is allocated and spent, and how that relates to gaps in coverage.",
  "Manual de condiciones mínimas del centro educativo":
    "Manual of minimum school conditions",
  "Guía operativa de las condiciones de agua, electricidad, saneamiento, conectividad y accesibilidad.":
    "An operational guide to the water, electricity, sanitation, connectivity and accessibility " +
    "requirements.",
  "Resultados de la evaluación nacional de aprendizajes 2024":
    "Results of the 2024 national learning assessment",
  "Resultados por nivel y área curricular, con la advertencia metodológica sobre comparabilidad entre ciclos.":
    "Results by level and curriculum area, with the methodological caveat about comparability " +
    "between cycles.",
  "Competencias digitales de docentes y estudiantes":
    "Digital skills among teachers and students",
  "Diagnóstico de competencias digitales y su relación con la disponibilidad de conectividad y dispositivos.":
    "An assessment of digital skills and how they relate to the availability of connectivity and " +
    "devices.",

  /* ------------------------------------------------------------- the search */

  "Buscar en el portal.": "Search the portal.",
  "Indicadores, normativa, documentos, noticias, políticas y conjuntos de datos, agrupados por tipo de resultado.":
    "Indicators, regulations, documents, news, policies and datasets, grouped by type of result.",
  "Término de búsqueda": "Search term",
  "Por ejemplo: docentes, cobertura, educación técnica":
    "For example: teachers, coverage, technical education",
  "Escriba para buscar en todo el portal.": "Type to search the whole portal.",
  "Todo el portal, en una página.": "The whole portal, on one page.",

  /* ------------------------------------------------------------ the contact */

  "Escriba al Consejo.": "Write to the Council.",
  "Consultas sobre información pública, solicitudes de audiencia y reportes técnicos del portal. Todos los datos de contacto de esta página son demostrativos.":
    "Enquiries about public information, requests for a hearing, and technical reports about the " +
    "portal. Every contact detail on this page is illustrative.",
  '<p>Datos de contacto <span class="cd-demo">Demo</span></p>':
    '<p>Contact details <span class="cd-demo">Demo</span></p>',
  "Datos de contacto <span class=\"cd-demo\">Demo</span>":
    'Contact details <span class="cd-demo">Demo</span>',
  "Avenida de la República 1200, Tegucigalpa, M.D.C. · Dirección demostrativa":
    "Avenida de la República 1200, Tegucigalpa, M.D.C. · Illustrative address",
  "+504 0000-0000 · Teléfono demostrativo": "+504 0000-0000 · Illustrative telephone",
  "contacto@cede.example · Correo demostrativo": "contacto@cede.example · Illustrative email",
  "Formulario de contacto": "Contact form",
  "¿En qué podemos ayudarle?": "How can we help?",
  "Indique un correo válido.": "Please enter a valid email address.",
  "Seleccione un asunto": "Select a subject",
  "Seleccione un asunto.": "Please select a subject.",
  "Escriba su mensaje.": "Please write your message.",
  "Solicitud de información pública": "Public information request",
  "Consulta sobre estadísticas": "Question about the statistics",
  "Solicitud de audiencia": "Request for a hearing",
  "Participación en una consulta": "Taking part in a consultation",
  "Reportar un problema técnico del portal": "Report a technical problem with the portal",
  "Mensaje registrado en la demostración.": "Message logged in the demonstration.",
  "Este prototipo no transmite ni almacena datos.":
    "This prototype transmits and stores nothing.",
  "Ninguno de estos datos corresponde a una institución real.":
    "None of these details belongs to a real institution.",
  "Otros canales": "Other channels",
  "Preguntas sobre los datos": "Questions about the data",

  /* -------------------------------------------------------- the open data */

  "Catálogo de datos educativos.": "The education data catalogue.",
  "Ocho conjuntos con su cobertura, su periodicidad, su metodología y su fecha de actualización. Las descargas de esta demostración son reales: contienen las mismas cifras que dibujan los tableros.":
    "Eight datasets with their coverage, their frequency, their methodology and the date they were " +
    "last updated. The downloads in this demonstration are real: they carry the same figures that " +
    "draw the dashboards.",

  "Estudiantes matriculados por año, nivel educativo y departamento, con desagregación por sexo, área, administración, jornada y modalidad.":
    "Enrolled students by year, education level and department, disaggregated by sex, area, " +
    "administration, session and route.",
  "Estudiantes matriculados por año, nivel educativo y departamento, con desagregación por sexo, área, administración, jornada y modalidad. Datos demostrativos: no corresponden a estadísticas oficiales.":
    "Enrolled students by year, education level and department, disaggregated by sex, area, " +
    "administration, session and route. Illustrative data: these are not official statistics.",
  "Registro administrativo de matrícula con fecha de corte única. Los duplicados entre centros se resuelven por identificador único de estudiante antes de la agregación.":
    "An administrative enrolment register with a single cut-off date. Duplicates between schools are " +
    "resolved by unique student identifier before aggregation.",

  "Número de centros educativos en funcionamiento por año y departamento, con su distribución por área y administración.":
    "The number of operating schools by year and department, with their distribution by area and " +
    "administration.",
  "Número de centros educativos en funcionamiento por año y departamento, con su distribución por área y administración. Datos demostrativos: no corresponden a estadísticas oficiales.":
    "The number of operating schools by year and department, with their distribution by area and " +
    "administration. Illustrative data: these are not official statistics.",
  "Directorio de centros con estado activo al cierre del levantamiento anual. Un centro con varias jornadas se cuenta una sola vez.":
    "A directory of schools recorded as active at the close of the annual survey. A school running " +
    "several sessions is counted once.",

  "Docentes en servicio por año y departamento, con la relación estudiante/docente derivada.":
    "Serving teachers by year and department, with the derived student–teacher ratio.",
  "Docentes en servicio por año y departamento, con la relación estudiante/docente derivada. Datos demostrativos: no corresponden a estadísticas oficiales.":
    "Serving teachers by year and department, with the derived student–teacher ratio. Illustrative " +
    "data: these are not official statistics.",
  "Personal con función docente activa al corte anual. Excluye personal administrativo y de apoyo, que se reporta por separado.":
    "Staff in an active teaching role at the annual cut-off. It excludes administrative and support " +
    "staff, who are reported separately.",

  "Indicadores de cobertura": "Coverage indicators",
  "Tasas de cobertura neta por nivel y ciclo, por año y departamento.":
    "Net coverage rates by level and cycle, by year and department.",
  "Matrícula en edad oficial sobre población proyectada del mismo grupo de edad. La proyección utilizada se documenta en el manual metodológico.":
    "Enrolment at the official age over the projected population of the same age group. The " +
    "projection used is documented in the methodological manual.",
  "Indicadores de permanencia": "Retention indicators",
  "Retención, deserción intranual, repitencia, transición y sobreedad por año y departamento.":
    "Retention, intra-year dropout, grade repetition, transition and over-age, by year and " +
    "department.",

  /* ---------------------------------------------------------- diary, tail */

  "Lectura de los principales movimientos de las series del primer semestre.":
    "A reading of the main movements in the first half-year's series.",
  "Focalización de la inversión educativa en los territorios con mayor brecha.":
    "Targeting education spending on the territories with the widest gaps.",
  "Sesión ordinaria 11/2026 del Consejo": "Council ordinary session 11/2026",
  "Orden del día: evaluación nacional de aprendizajes y calendario 2027.":
    "Agenda: the national learning assessment and the 2027 calendar.",
  "Santa Rosa de Copán, Copán": "Santa Rosa de Copán, Copán",
};

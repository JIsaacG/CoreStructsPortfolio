/**
 * English for the CEDE demo — the national plan, the network diagram, the
 * library and the filters that run across the observatory.
 *
 * Honduras's school levels have no clean English equivalents, so this file
 * fixes one mapping and uses it everywhere: prebásica is pre-primary, básica is
 * basic education (the nine-year cycle, not "primary"), media is upper
 * secondary. Translating "básica" as "primary" would be wrong by three years
 * and would make every coverage figure on the site read incorrectly.
 *
 * "Permanencia" is the other one worth stating: it is a student staying in the
 * system, which official English calls retention — the opposite face of the
 * dropout rate, and not "permanence".
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/cede";

export default {
  /* -------------------------------------------------------------- the levels */

  Prebásica: "Pre-primary",
  Básica: "Basic",
  Media: "Upper secondary",
  "Cobertura básica": "Basic coverage",
  "Cobertura en básica": "Coverage in basic education",
  "Cobertura en media": "Coverage in upper secondary",
  "Transición a media": "Transition to upper secondary",
  Deserción: "Dropout",
  Permanencia: "Retention",
  Conectividad: "Connectivity",
  "Conectividad de centros": "School connectivity",
  "Matrícula total": "Total enrolment",
  "Matrícula técnica": "Technical enrolment",
  "Matrícula en educación técnica": "Enrolment in technical education",
  "Matrícula por nivel educativo": "Enrolment by education level",
  "Centros educativos con conectividad": "Schools with connectivity",
  "Relación estudiante/docente": "Student–teacher ratio",
  "Relación estudiante/docente por departamento":
    "Student–teacher ratio by department",
  "Estudiantes por docente": "Students per teacher",
  "Estudiantes atendidos": "Students served",
  "Inversión por estudiante": "Investment per student",
  "Hogares sin conexión ni dispositivo": "Households with no connection and no device",
  "Educación intercultural bilingüe": "Intercultural bilingual education",
  "Asignado ÷ matrícula": "Allocated ÷ enrolment",
  "Indicador · Permanencia": "Indicator · Retention",

  /* ---------------------------------------------------------- the filter bar */

  Materia: "Subject",
  Sexo: "Sex",
  Mujeres: "Female",
  Hombres: "Male",
  Urbana: "Urban",
  Rural: "Rural",
  Matutina: "Morning",
  Nacional: "National",
  Territorio: "Territory",
  Registros: "Records",
  Tipos: "Types",
  Licencia: "Licence",
  Lista: "List",
  Período: "Period",
  "Línea base": "Baseline",
  "Meta 2035": "2035 target",
  "Todos los años": "All years",
  "Todos los tipos": "All types",
  "Todos los temas": "All topics",
  "Nivel educativo": "Education level",
  "Nivel educativo · Sexo · Área · Departamento":
    "Education level · Sex · Area · Department",
  "Sexo · Área · Departamento": "Sex · Area · Department",
  "Evaluación y currículo": "Assessment and curriculum",
  "Diccionario de variables": "Variable dictionary",
  Equidad: "Equity",

  "Matrícula por sexo, 2026. Datos demostrativos.":
    "Enrolment by sex, 2026. Illustrative data.",
  "Matrícula por área, 2026. Datos demostrativos.":
    "Enrolment by area, 2026. Illustrative data.",
  "Relación estudiante/docente por departamento, 2026. Datos demostrativos.":
    "Student–teacher ratio by department, 2026. Illustrative data.",
  "Matrícula total del sistema educativo, 2019–2026. Datos demostrativos.":
    "Total enrolment in the education system, 2019–2026. Illustrative data.",
  "Matrícula total del sistema educativo, 2019 a 2026":
    "Total enrolment in the education system, 2019 to 2026",

  "Proporción de estudiantes que, tras aprobar el último grado de educación básica, se matriculan en el primer curso de edu…":
    "The share of students who, having passed the final grade of basic education, enrol in the first " +
    "year of upp…",
  "Proporción de estudiantes matriculados al inicio del año lectivo que permanecen en el sistema educativo al cierre del mi…":
    "The share of students enrolled at the start of the school year who are still in the education " +
    "system at the end of it…",

  /* ------------------------------------------------------ what brings you here */

  "Conocer el estado de la educación": "Find out how education is doing",
  "Indicadores del sistema": "System indicators",
  "Descargar información": "Download information",
  "Conocer una política": "Read a policy",
  "Encontrar una ley o un reglamento": "Find an act or a regulation",
  "Participar en una consulta": "Take part in a consultation",
  "Conocer las decisiones del Consejo": "See the Council's decisions",
  "Consultas públicas abiertas": "Open public consultations",
  "Ver el plan completo": "See the full plan",

  /* --------------------------------------------------------- the network */

  "El sistema educativo como una red.": "The education system as a network.",
  "Ninguna institución transforma la educación por su cuenta. El Consejo ocupa el centro del diagrama porque convoca, no porque mande: cada nodo conserva sus competencias y aporta una capacidad que las demás no tienen.":
    "No single institution transforms education on its own. The Council sits at the centre of the " +
    "diagram because it convenes, not because it commands: every node keeps its own powers and " +
    "brings a capability the others do not have.",
  "Diagrama del sistema educativo como una red de actores":
    "Diagram of the education system as a network of actors",
  Estratégico: "Strategic",

  "Educación pública": "Public education",
  "Formación profesional": "Vocational training",
  "Cooperación internacional": "International cooperation",
  "Gobiernos locales": "Local government",
  "Sector productivo": "Employers",
  "Sociedad civil": "Civil society",

  "Operación del sistema escolar y datos de centro.":
    "Running the school system, and school-level data.",
  "Formación de docentes e investigación educativa.":
    "Teacher training and education research.",
  "Oferta técnica y certificación de competencias.":
    "Technical provision and skills certification.",
  "Evidencia independiente y evaluación externa.":
    "Independent evidence and external evaluation.",
  "Práctica de aula y necesidades de formación.":
    "Classroom practice and training needs.",
  "Demanda de competencias e inserción laboral.":
    "Skills demand and getting people into work.",
  "Vigilancia ciudadana y voz de las comunidades.":
    "Public scrutiny and the voice of communities.",
  "Financiamiento técnico y comparación regional.":
    "Technical funding and regional comparison.",

  "Educación pública. Operación del sistema escolar y datos de centro.":
    "Public education. Running the school system, and school-level data.",
  "Educación superior. Formación de docentes e investigación educativa.":
    "Higher education. Teacher training and education research.",
  "Formación profesional. Oferta técnica y certificación de competencias.":
    "Vocational training. Technical provision and skills certification.",
  "Universidades. Evidencia independiente y evaluación externa.":
    "Universities. Independent evidence and external evaluation.",
  "Docentes. Práctica de aula y necesidades de formación.":
    "Teachers. Classroom practice and training needs.",
  "Sector productivo. Demanda de competencias e inserción laboral.":
    "Employers. Skills demand and getting people into work.",
  "Sociedad civil. Vigilancia ciudadana y voz de las comunidades.":
    "Civil society. Public scrutiny and the voice of communities.",
  "Cooperación internacional. Financiamiento técnico y comparación regional.":
    "International cooperation. Technical funding and regional comparison.",

  /* ------------------------------------------------------------ the plan */

  "Diez años, cinco ejes y un compromiso verificable: cada objetivo del plan tiene una meta, un indicador y una fecha, y su avance se publica aquí mismo mientras ocurre.":
    "Ten years, five strands and a commitment you can check: every objective in the plan has a " +
    "target, an indicator and a date, and its progress is published here as it happens.",
  "Objetivos estratégicos": "Strategic objectives",
  "Requiere atención": "Needs attention",
  Cumplido: "Met",
  "Eje 01": "Strand 01",
  "Eje 05": "Strand 05",
  "6 programas": "6 programmes",

  /* ------------------------------------------------------ policies and drafts */

  "Política Educativa Nacional 2026–2035": "National Education Policy 2026–2035",
  "Política de Inclusión y Equidad Educativa": "Educational Inclusion and Equity Policy",
  "Política Nacional de Desarrollo Docente": "National Teacher Development Policy",
  "Política de Transformación Digital Educativa": "Digital Education Transformation Policy",
  "Catálogo nacional de familias profesionales": "National catalogue of vocational families",
  "Lineamientos de publicación de datos abiertos educativos":
    "Guidelines for publishing open education data",
  "Marco de competencias para la formación docente":
    "Competency framework for teacher training",
  "Reglamento de condiciones mínimas del centro educativo":
    "Regulation on minimum school conditions",
  "Foro nacional de educación técnica": "National technical education forum",
  "Cierre: 30 de septiembre de 2026": "Closes: 30 September 2026",
  Cerrada: "Closed",

  "Consulta sobre el borrador completo del plan nacional: diagnóstico, ejes, objetivos, indicadores y metas a diez años.":
    "Consultation on the full draft of the national plan: diagnosis, strands, objectives, indicators " +
    "and ten-year targets.",
  "Consulta sobre las condiciones de agua, electricidad, saneamiento, conectividad y accesibilidad exigibles a un centro educativo.":
    "Consultation on the water, electricity, sanitation, connectivity and accessibility conditions a " +
    "school must meet.",
  "Consulta sobre formatos, licencias, metadatos y periodicidad del catálogo de datos abiertos del sistema educativo.":
    "Consultation on the formats, licences, metadata and update frequency of the education system's " +
    "open data catalogue.",
  "Consulta prevista sobre la revisión del marco de competencias que orienta la formación inicial y continua del personal docente.":
    "Planned consultation on the review of the competency framework that guides initial and " +
    "continuing teacher training.",
  "Propuesta de actualización de la oferta técnica de educación media: criterios de revisión de familias profesionales, condiciones de los talleres y seguimiento de la inserción laboral de las personas egresadas.":
    "A proposal to update technical provision in upper secondary: criteria for reviewing vocational " +
    "families, the condition of workshops, and tracking graduates into employment.",

  /* ----------------------------------------------------------- the library */

  "Centro de conocimiento": "Knowledge centre",
  "Estado de la educación en Honduras 2026": "The state of education in Honduras 2026",
  "Informe anual del sistema educativo: matrícula, cobertura, permanencia, docentes, infraestructura y financiamiento, con lectura territorial de cada indicador.":
    "The annual report on the education system: enrolment, coverage, retention, teachers, " +
    "infrastructure and funding, with a territorial reading of every indicator.",
  "El futuro de la profesión docente": "The future of the teaching profession",
  "La transición de básica a media: dónde se pierde el sistema":
    "The transition from basic to upper secondary: where the system loses people",
  "Investigación · Educación técnica": "Research · Technical education",
  "Estudio prospectivo · Formación docente": "Foresight study · Teacher training",
  "Estudio de cohorte · Permanencia": "Cohort study · Retention",

  "La cobertura de educación media no se detiene por igual en todo el país: se detiene donde la oferta local termina en noveno grado. El estudio ordena los territorios por esa condición y estima el efecto de tres intervenciones posibles.":
    "Upper secondary coverage does not stall evenly across the country: it stalls where local " +
    "provision ends at ninth grade. The study ranks territories by that condition and estimates the " +
    "effect of three possible interventions.",
  "Analiza por qué la cobertura de educación media se detiene en determinados territorios y qué combinación de oferta, transporte y permanencia la mueve.":
    "Examines why upper secondary coverage stalls in particular territories, and what combination of " +
    "provision, transport and retention moves it.",
  "Contrasta las familias profesionales vigentes con la demanda declarada por el sector productivo y propone un criterio de actualización que no dependa de revisiones excepcionales.":
    "Sets the current vocational families against the demand employers report, and proposes a way of " +
    "updating them that does not depend on one-off reviews.",
  "Contrasta la oferta técnica actual con la demanda de competencias declarada por el sector productivo, y propone criterios de actualización.":
    "Sets current technical provision against the skills demand employers report, and proposes " +
    "criteria for updating it.",
  "Qué cambia en la enseñanza cuando la mitad del personal docente se renueva en una década: formación inicial, inducción, carrera y condiciones de ejercicio.":
    "What changes in teaching when half the workforce turns over in a decade: initial training, " +
    "induction, career and working conditions.",
  "Sigue una cohorte completa desde primer grado y localiza, año por año y territorio por territorio, el momento exacto en que se produce la salida.":
    "Follows a complete cohort from first grade and pinpoints, year by year and territory by " +
    "territory, the exact moment students leave.",

  /* -------------------------------------------------------------- 404, forms */

  "Esta página no existe.": "This page does not exist.",
  "Página no encontrada": "Page not found",
  "Error 404": "Error 404",
  "Ir a la biblioteca digital": "Go to the digital library",
  "Enviar mensaje": "Send message",
  Misión: "Mission",
  Visión: "Vision",
  "Información demostrativa para fines de diseño. Las cifras presupuestarias de este prototipo no corresponden a ningún presupuesto público real.":
    "Illustrative information for design purposes. The budget figures in this prototype do not " +
    "correspond to any real public budget.",

  /* Month abbreviations used on the timeline. */
  OCT: "OCT",
  "3 M": "3 M",
  "4 M": "4 M",
};

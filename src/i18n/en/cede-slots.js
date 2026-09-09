/**
 * English for the CEDE demo — the pieces the caption and chart-title rules fill
 * their placeholders with.
 *
 * The observatory writes the same handful of captions round every indicator:
 * a subject, sometimes a breakdown, sometimes a year or a span of years, and
 * "Datos demostrativos." at the end. Those shapes live in `_rules.js`; what
 * they need is the vocabulary, and this is it — the breakdown words in the
 * lower case the captions print them in, and the compound subjects that are not
 * simply one known phrase plus a known suffix.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/cede";

export default {
  /* ---------------------------------------------------- the breakdown words */

  sexo: "sex",
  área: "area",
  administración: "administration",
  jornada: "shift",
  modalidad: "mode",
  "familia profesional": "occupational family",
  "nivel educativo": "level of education",
  nivel: "level",
  "nivel educativo y año": "level of education and year",
  matrícula: "enrolment",

  /* ------------------------------------------------- the compound subjects */

  "Cobertura neta por nivel": "Net coverage by level",
  "Cobertura en media comparada": "Coverage in upper secondary compared",
  "Matrícula comparada": "Enrolment compared",
  "Matrícula, centros y docentes": "Enrolment, schools and teaching staff",
  "Retención y transición": "Retention and transition",
  "Personal docente por nivel": "Teaching staff by level",
  "Educación técnica por familia profesional":
    "Technical education by occupational family",
  "Líneas de inclusión": "Lines of inclusion",
  "Brecha digital": "The digital divide",
  "Colecciones de contenido del portal": "The portal's content collections",
  "Solicitudes de información por materia": "Information requests by subject",
  "Ver la tabla completa": "See the full table",

  /* -------------------------------------------------------- the page titles */

  "Portal de información y política educativa":
    "Portal for educational information and policy",
  "Backoffice demostrativo": "Illustrative back office",

  /* -------------------------------------------------------- the disclaimers */

  "CEDE · Sistema Nacional de Información Educativa. Las cifras presentadas en este prototipo son simulaciones creadas exclusivamente para demostrar las capacidades de la plataforma.":
    "CEDE · National Education Information System. The figures in this prototype are simulations, " +
    "created solely to demonstrate what the platform can do.",
  "Entidad ficticia · no es un sitio oficial · el envío no sale de su navegador.":
    "A fictional body · not an official site · nothing you send leaves your browser.",
  "Datos demostrativos · el prototipo no envía información.":
    "Illustrative data · the prototype sends nothing.",

  /* ------------------------------------------------- the indicator definitions */

  "Número total de estudiantes registrados en centros educativos del país en los niveles de prebásica, básica y media, en todas las modalidades y administraciones, al cierre del período de matrícula…":
    "The total number of students registered at schools in the country across pre-primary, basic and " +
    "upper secondary, in every mode and administration, at the close of the enrolment period…",
  "Proporción de estudiantes matriculados al inicio del año lectivo que permanecen en el sistema educativo al cierre del mismo año":
    "The share of students enrolled at the start of the school year who are still in the system at the " +
    "end of that year",
  "Proporción de estudiantes que, tras aprobar el último grado de educación básica, se matriculan en el primer curso de educación media al año siguiente":
    "The share of students who, having passed the last grade of basic education, enrol in the first " +
    "year of upper secondary the following year",
  "Propuesta de actualización de la oferta técnica de educación media: criterios de revisión de familias profesionales, condiciones de los talleres y seguimiento de la inserción…":
    "A proposal to update the technical offer in upper secondary: criteria for reviewing occupational " +
    "families, workshop requirements, and tracking entry into work…",

  /* ------------------------------------------------------- the reading notes */

  "Cobertura neta por nivel y departamento": "Net coverage by level and department",
  "Los cuatro paneles comparten escala, así que la distancia entre ellos es real: la cobertura de media es menos de la mitad de la de básica":
    "The four panels share a scale, so the distance between them is real: coverage in upper secondary " +
    "is less than half that in basic education",
  "La conectividad es la que más se movió y la que sigue más lejos de la meta del plan":
    "Connectivity is the one that moved most and the one still furthest from the plan's target",
};

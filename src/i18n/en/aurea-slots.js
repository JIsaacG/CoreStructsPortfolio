/**
 * English for the AUREA demo — the pieces its generated shapes fill in.
 *
 * "Matrícula" is the trap here. On CEDE it is enrolment, the number of students
 * in the system; on an AUREA programme page "Matrícula por período" is what the
 * term costs. The shape rule would happily turn it into "Enrolment by term", so
 * the phrase is listed outright: the dictionary is consulted before the rules,
 * and a scoped entry is the only thing that can hold two meanings apart.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/aurea";

export default {
  /* ------------------------------------------- the word CEDE spends elsewhere */

  "Matrícula por período": "Fee per term",

  /* --------------------------------------------------------- the page titles */

  Campus: "Campus",
  "Noticias y comunicados": "News and notices",
  "Campus virtual · demostración": "Virtual campus · demonstration",
  "Portal estudiantil · demostración": "Student portal · demonstration",
  "Portal de padres · demostración": "Parent portal · demonstration",

  /* ------------------------------------------ the document centre's audiences */

  Aspirantes: "Applicants",
  "Aspirantes de educación superior": "Higher education applicants",
  "Estudiantes de último año": "Final-year students",
  Familias: "Families",

  /* --------------------------------------------------------- the odd sentence */

  "los nueve programas": "all nine programmes",
  "Comparación de los nueve programas. Costos y cifras demostrativos.":
    "All nine programmes side by side. Costs and figures are illustrative.",
  "Campus Central AUREA. Lunes a viernes, 7:00 a 17:00 · Sábados, 8:00 a 12:00. Todos los datos de contacto son demostrativos.":
    "AUREA Central Campus. Monday to Friday, 7:00 to 17:00 · Saturdays, 8:00 to 12:00. Every contact " +
    "detail here is illustrative.",
  "Docente de Ciencias · Educación Media. Didáctica experimental con materiales de bajo costo.":
    "Science teacher · Upper Secondary. Experimental teaching with low-cost materials.",
};

/**
 * English for the CEDE demo — the methodology note behind each indicator.
 *
 * Each of the ten indicators carries a definition, a formula, a set of
 * disaggregations, a note on how to read it and a note on what it cannot tell
 * you. The last two are the point of the portal and the hardest to translate
 * without softening: "No es el tamaño de la clase" is a correction of a common
 * misreading, and it has to keep landing as one.
 *
 * The formulas are kept in the same notation the site uses — the ÷ and × signs
 * and the parenthesis — because they are read as formulas, not as sentences.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/cede";

export default {
  /* -------------------------------------------------------------- the SDG 4 */

  "Seguimiento al Objetivo de Desarrollo Sostenible 4.":
    "Tracking Sustainable Development Goal 4.",
  "Garantizar una educación inclusiva, equitativa y de calidad, y promover oportunidades de aprendizaje durante toda la vida para todas y todos.":
    "Ensure inclusive and equitable quality education and promote lifelong learning opportunities " +
    "for all.",
  "Educación primaria y secundaria completa": "Complete primary and secondary education",
  "Desarrollo en la primera infancia": "Early childhood development",
  "Acceso a formación técnica y superior": "Access to technical and higher education",
  "Competencias para el empleo": "Skills for employment",
  "Equidad y eliminación de disparidades": "Equity and eliminating disparities",
  "Alfabetización de jóvenes y adultos": "Youth and adult literacy",
  "Entornos de aprendizaje adecuados": "Adequate learning environments",
  "Seguimiento al ODS 4. Metas, líneas base y resultados demostrativos.":
    "Tracking SDG 4. Illustrative targets, baselines and results.",
  "Metas, líneas base y resultados son valores demostrativos definidos para este prototipo. No corresponden a los compromisos oficiales de ningún país.":
    "The targets, baselines and results are illustrative values set for this prototype. They do not " +
    "correspond to any country's official commitments.",
  "Distribución territorial de la inversión, 2026. Información demostrativa.":
    "Territorial distribution of spending, 2026. Illustrative information.",

  /* ------------------------------------------------------------ the compare */

  "Elija hasta tres departamentos y véalos lado a lado en once indicadores. Los tres colores se mantienen mientras la selección cambia, para que ninguna serie cambie de identidad.":
    "Pick up to three departments and see them side by side across eleven indicators. The three " +
    "colours stay put as the selection changes, so no series ever changes identity.",
  "Serie 2019–2026 de los territorios seleccionados.":
    "2019–2026 series for the selected territories.",
  "Cobertura en educación media": "Coverage in upper secondary",
  "El indicador de acceso más exigente del sistema.":
    "The system's most demanding measure of access.",
  "Comparación de cobertura en media": "Comparison of upper secondary coverage",
  "Indicadores comparados, 2026. Todas las cifras son demostrativas.":
    "Indicators compared, 2026. All figures are illustrative.",

  /* ---------------------------------------------------- coverage and scope */

  "Nacional, con desagregación departamental y municipal":
    "National, disaggregated by department and municipality",
  "estudiantes por docente": "students per teacher",
  "Área · Departamento · Nivel educativo": "Area · Department · Education level",
  "Área · Administración · Departamento": "Area · Administration · Department",
  "Nivel educativo · Área · Departamento": "Education level · Area · Department",
  "Familia profesional · Sexo · Área · Departamento":
    "Vocational family · Sex · Area · Department",
  "Nivel educativo · Sexo · Área · Administración · Jornada · Modalidad · Departamento":
    "Education level · Sex · Area · Administration · Session · Route · Department",

  /* ------------------------------------------------- the formulas and notes */

  "(Hogares con estudiantes sin conexión ni dispositivo ÷ total de hogares con estudiantes) × 100.":
    "(Households with students and no connection or device ÷ total households with students) × 100.",
  "Se sigue junto a la conectividad de centros: un sistema puede conectar sus escuelas y seguir teniendo una brecha en casa.":
    "It is tracked alongside school connectivity: a system can connect its schools and still have a " +
    "gap at home.",
  "Se construye sobre declaración del hogar en el levantamiento anual, no sobre medición técnica.":
    "It is built on what the household reports in the annual survey, not on technical measurement.",

  "(Centros con conexión a internet operativa ÷ total de centros educativos) × 100.":
    "(Schools with a working internet connection ÷ total schools) × 100.",
  "Se mide la conexión operativa, no la contratada: un centro con contrato suspendido cuenta como sin conectividad.":
    "It measures the working connection, not the contracted one: a school whose contract is " +
    "suspended counts as unconnected.",
  "No mide ancho de banda ni cobertura dentro del centro; un solo punto de acceso en la dirección cuenta igual que una red completa.":
    "It does not measure bandwidth or coverage inside the school; a single access point in the office " +
    "counts the same as a complete network.",

  "(Estudiantes de 15 a 17 años matriculados en educación media ÷ población de 15 a 17 años) × 100.":
    "(Students aged 15 to 17 enrolled in upper secondary ÷ population aged 15 to 17) × 100.",
  "Es el indicador de acceso más exigente del sistema: solo cuenta a quienes están en el nivel que corresponde a su edad. Una cobertura bruta siempre será mayor.":
    "It is the system's most demanding measure of access: it counts only those in the level " +
    "appropriate to their age. A gross coverage rate will always be higher.",
  "Depende de la proyección de población usada como denominador; un cambio de proyección mueve el indicador sin que se haya movido la matrícula.":
    "It depends on the population projection used as the denominator; changing the projection moves " +
    "the indicator without enrolment having moved at all.",

  "(Matrícula de 3 a 5 años en prebásica ÷ población de 3 a 5 años) × 100.":
    "(Enrolment of 3- to 5-year-olds in pre-primary ÷ population aged 3 to 5) × 100.",
  "La atención en la primera infancia es el punto donde la desigualdad educativa empieza a acumularse, y por eso se sigue por separado del resto del sistema.":
    "Early years provision is where educational inequality starts to accumulate, which is why it is " +
    "tracked separately from the rest of the system.",
  "No distingue entre modalidades formales y comunitarias de atención, que en varios territorios conviven.":
    "It does not distinguish between formal and community provision, which coexist in several " +
    "territories.",

  "Suma de matriculados en carreras técnicas de educación media, por familia profesional.":
    "The sum of students enrolled on technical upper secondary courses, by vocational family.",
  "Se reporta como subconjunto de la matrícula de media, no como un nivel aparte: un estudiante técnico ya está contado en la matrícula total.":
    "It is reported as a subset of upper secondary enrolment, not as a level of its own: a technical " +
    "student is already counted in total enrolment.",
  "No incluye la formación profesional no escolarizada, que se registra en otro sistema.":
    "It excludes non-school vocational training, which is recorded in a different system.",

  "Suma de estudiantes matriculados en prebásica, básica y media, sin duplicar registros entre centros mediante el identificador único de estudiante.":
    "The sum of students enrolled in pre-primary, basic and upper secondary, deduplicated across " +
    "schools using the unique student identifier.",
  "La matrícula es un registro administrativo de corte: refleja a quienes se inscribieron, no a quienes permanecieron todo el año. Para eso se usa la tasa de retención.":
    "Enrolment is an administrative snapshot: it reflects who signed up, not who stayed the whole " +
    "year. The retention rate is what measures that.",
  "No incluye la educación superior ni la formación profesional no escolarizada, que se reportan en registros distintos.":
    "It excludes higher education and non-school vocational training, which are reported in separate " +
    "registers.",

  "Matrícula total ÷ número de docentes en servicio.":
    "Total enrolment ÷ number of serving teachers.",
  "No es el tamaño de la clase: un docente puede atender varios grupos y un grupo puede tener varios docentes. Se lee como indicador de dotación, no de aula.":
    "This is not class size: one teacher may take several groups and one group may have several " +
    "teachers. Read it as a staffing measure, not a classroom one.",
  "Un promedio nacional oculta la dispersión: el mismo valor puede describir aulas de 18 y de 45 estudiantes en el mismo departamento.":
    "A national average hides the spread: the same figure can describe classes of 18 and of 45 in " +
    "the same department.",

  "(Estudiantes matriculados al inicio − estudiantes presentes al cierre − traslados confirmados) ÷ estudiantes matriculados al inicio × 100.":
    "(Students enrolled at the start − students present at the close − confirmed transfers) ÷ " +
    "students enrolled at the start × 100.",
  "El traslado confirmado se descuenta: un estudiante que cambia de centro no abandonó el sistema. Sin ese descuento la deserción aparece inflada en zonas de alta movilidad.":
    "Confirmed transfers are deducted: a student who changes school has not left the system. Without " +
    "that deduction, dropout looks inflated in areas with high mobility.",
  "Un traslado no reportado por el centro receptor se contabiliza como abandono hasta que el cruce de registros lo corrige.":
    "A transfer the receiving school has not reported counts as a dropout until the records are " +
    "matched and corrected.",

  "(Estudiantes presentes al cierre ÷ estudiantes matriculados al inicio) × 100.":
    "(Students present at the close ÷ students enrolled at the start) × 100.",
  "Complementaria de la deserción; se publican juntas para que ninguna se lea sola.":
    "The complement of dropout; the two are published together so that neither is read alone.",
  "Comparte con la deserción la dependencia del registro de traslados.":
    "Like dropout, it depends on the transfer register.",
};

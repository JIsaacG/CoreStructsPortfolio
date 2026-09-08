/**
 * The institutional narrative — history, purpose and the educational model.
 *
 * The section every school website resolves with three paragraphs under
 * “Quiénes somos”. It is treated here as a sequence instead: where the
 * institution came from, what it says it is for, how it says it teaches, and
 * what it does about that in practice. Each stage is its own content type, so
 * a timeline entry, a value and a pillar can be rendered where they belong
 * rather than all together in a wall of prose.
 *
 * Invented, like everything else in this portal.
 */

export const purpose = {
  title: "Educación con propósito.",
  lead:
    "AUREA nació como un instituto de educación media de cuarenta y dos estudiantes. " +
    "Veinticinco años después es una institución con dos niveles, nueve programas y una " +
    "sola convicción: que la educación se mide por lo que el egresado es capaz de hacer.",
  body:
    "No enseñamos para el examen. Enseñamos para el momento, dos o diez años después, en " +
    "que alguien tiene un problema delante y ninguna instrucción de qué hacer con él.\n\n" +
    "Eso obliga a una manera concreta de trabajar: grupos pequeños, docentes que ejercen " +
    "además de enseñar, proyectos que salen del aula y una evaluación que pide demostrar " +
    "antes que recordar. También obliga a algo menos visible: acompañar a quien se está " +
    "quedando atrás antes de que la calificación lo anuncie.",
  pillars: [
    { label: "Rigor", text: "Un estándar exigente, explicado desde el primer día y aplicado igual para todos." },
    { label: "Acompañamiento", text: "Nadie avanza solo. Tutoría, orientación y un docente guía por sección." },
    { label: "Práctica", text: "Laboratorio, taller, práctica profesional y proyectos con destinatario real." },
    { label: "Comunidad", text: "Clubes, deporte, arte y voluntariado como parte de la formación, no como adorno." },
  ],
};

/* --------------------------------------------------------------- timeline */

export const timeline = [
  {
    year: "2001",
    title: "Fundación",
    text:
      "Instituto AUREA abre con cuarenta y dos estudiantes de décimo grado en una casa " +
      "adaptada del barrio La Leona, con siete docentes y un solo bachillerato.",
  },
  {
    year: "2008",
    title: "Nuevo campus",
    text:
      "Traslado al Campus Central. Cuatro edificios, los primeros laboratorios propios y " +
      "la apertura del Bachillerato Técnico Profesional en Informática.",
  },
  {
    year: "2014",
    title: "Educación superior",
    text:
      "Se incorporan las primeras tres licenciaturas —Ingeniería en Sistemas, " +
      "Administración de Empresas y Psicología— y la institución pasa a llamarse AUREA " +
      "Instituto & Universidad.",
  },
  {
    year: "2020",
    title: "Campus digital",
    text:
      "El campus virtual, el portal estudiantil y el portal de padres entran en operación " +
      "en nueve semanas. Ningún estudiante pierde el año lectivo.",
  },
  {
    year: "2023",
    title: "Investigación",
    text:
      "Se crean el Centro de Inteligencia Artificial y el Observatorio Empresarial, con " +
      "plazas de investigación para estudiantes de grado.",
  },
  {
    year: "2026",
    title: "Nueva generación educativa",
    text:
      "Nueve programas, ocho mil cuatrocientos estudiantes y un nuevo Centro de " +
      "Innovación compartido por educación media y educación superior.",
  },
];

/* ------------------------------------------------------ mission and values */

export const mission = {
  mission:
    "Formar personas capaces de resolver problemas reales con conocimiento, criterio y " +
    "responsabilidad, desde la educación media hasta la formación universitaria.",
  vision:
    "Ser la institución de referencia en el país por la calidad de lo que sus egresados " +
    "son capaces de hacer, y por acompañar a cada estudiante hasta que lo demuestre.",
  values: [
    {
      name: "Rigor",
      text: "Un estándar académico exigente, explícito y aplicado con la misma vara para todos.",
    },
    {
      name: "Integridad",
      text: "Lo que decimos que evaluamos es lo que evaluamos. Lo que prometemos, lo cumplimos o lo corregimos.",
    },
    {
      name: "Cercanía",
      text: "Secciones pequeñas, docentes accesibles y una institución que conoce a sus estudiantes por su nombre.",
    },
    {
      name: "Equidad",
      text: "El talento no depende del ingreso familiar. El sistema de becas existe para que el costo tampoco decida.",
    },
    {
      name: "Curiosidad",
      text: "Preguntar es parte del método. La respuesta correcta sin la pregunta no enseña nada.",
    },
    {
      name: "Responsabilidad",
      text: "Con el estudiante, con la familia y con la comunidad en la que la institución opera.",
    },
  ],
};

/* -------------------------------------------------------- educational model */

/**
 * “Aprender haciendo” — four pillars, each with the concrete practice that
 * makes it true.
 *
 * The `experiences` are the part that matters. A pillar named “Práctica” with
 * nothing under it is a poster; the same pillar with six hundred hours of
 * workshop and a supervised placement is a curriculum.
 */
export const model = {
  title: "Aprender haciendo.",
  lead:
    "El modelo educativo de AUREA se sostiene en cuatro pilares. Ninguno es una " +
    "declaración: cada uno tiene horas, espacios y evaluación asignados.",
  pillars: [
    {
      id: "conocimiento",
      name: "Conocimiento",
      text:
        "Los fundamentos que no cambian, enseñados con la profundidad que exige quien va " +
        "a construir sobre ellos durante cuarenta años.",
      experiences: ["Tronco común sólido", "Lectura y escritura académica", "Método científico", "Pensamiento cuantitativo"],
    },
    {
      id: "practica",
      name: "Práctica",
      text:
        "Se aprende haciendo, y hacer se evalúa. Laboratorio desde el primer año, " +
        "práctica profesional obligatoria y proyectos con destinatario real.",
      experiences: ["Laboratorios", "Talleres", "Práctica profesional", "Consultoría a empresas", "Práctica supervisada"],
    },
    {
      id: "tecnologia",
      name: "Tecnología",
      text:
        "No como asignatura aparte, sino como herramienta transversal: datos, " +
        "herramientas digitales y campus virtual en las nueve carreras.",
      experiences: ["Campus virtual", "Laboratorios de cómputo", "Fabricación digital", "Analítica de datos"],
    },
    {
      id: "proposito",
      name: "Propósito",
      text:
        "Formación que se dirige a algo. Emprendimiento, voluntariado, investigación y " +
        "vinculación comunitaria como parte del plan, no como actividad extracurricular.",
      experiences: ["Emprendimiento", "Voluntariado", "Investigación", "Aprendizaje colaborativo", "Vinculación comunitaria"],
    },
  ],
};

/**
 * How the model shows up in a week.
 *
 * The pillars are abstractions; this is the schedule they produce. It is the
 * single most convincing thing an institution can publish about its pedagogy,
 * and almost none of them do.
 */
export const weekInPractice = [
  { label: "Clase magistral", share: 35, note: "Fundamentos y marco conceptual" },
  { label: "Laboratorio y taller", share: 30, note: "Trabajo con equipo y con las manos" },
  { label: "Proyecto en equipo", share: 20, note: "Con entregable y destinatario" },
  { label: "Tutoría y acompañamiento", share: 15, note: "Individual y en grupo pequeño" },
];

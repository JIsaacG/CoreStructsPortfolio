/**
 * Student life — clubs, sport, art, service, and the support services.
 *
 * The half of an institution that a prospective family judges hardest and that
 * most institutional sites relegate to a photo gallery. Here it is structured
 * data: a club is a record with a category, a meeting time and a place, so the
 * explorer can filter it and the calendar can reference it.
 *
 * The support services sit in the same file on purpose. Belonging and being
 * looked after are the same subject seen from two sides, and separating them
 * is how a site ends up with a vibrant “vida estudiantil” page and a grey
 * “servicios” page that nobody visits until they need it badly.
 *
 * Invented, all of it.
 */

/* ------------------------------------------------------------------ clubs */

export const clubCategories = [
  { id: "tecnologia", label: "Tecnología" },
  { id: "deportes", label: "Deportes" },
  { id: "arte", label: "Arte" },
  { id: "academico", label: "Académico" },
  { id: "cultura", label: "Cultura" },
  { id: "servicio", label: "Servicio" },
  { id: "emprendimiento", label: "Emprendimiento" },
];

export const clubs = [
  {
    id: "robotics-lab",
    name: "Robotics Lab",
    category: "tecnologia",
    level: "todos",
    members: 34,
    meets: "Martes y jueves, 16:00",
    place: "Centro de Innovación, zona de electrónica",
    text: "Competencia de robótica, impresión 3D y automatización. Compite en la liga nacional escolar y universitaria.",
  },
  {
    id: "developers-club",
    name: "Developers Club",
    category: "tecnologia",
    level: "superior",
    members: 51,
    meets: "Miércoles, 17:30",
    place: "Laboratorio de cómputo B",
    text: "Proyectos de software abiertos, mentoría entre pares y una maratón de programación cada período.",
  },
  {
    id: "aurea-debate",
    name: "Aurea Debate",
    category: "academico",
    level: "todos",
    members: 22,
    meets: "Jueves, 16:00",
    place: "Aula Magna",
    text: "Debate parlamentario británico. Compite en la eliminatoria nacional y en el torneo regional.",
  },
  {
    id: "photography-society",
    name: "Photography Society",
    category: "arte",
    level: "todos",
    members: 40,
    meets: "Viernes, 15:00",
    place: "Estudio audiovisual",
    text: "Salidas fotográficas, revelado digital, retrato y una exposición colectiva al cierre de cada período.",
  },
  {
    id: "entrepreneurship-hub",
    name: "Entrepreneurship Hub",
    category: "emprendimiento",
    level: "superior",
    members: 47,
    meets: "Lunes, 17:00",
    place: "Centro de Innovación, planta libre",
    text: "Del cuaderno al mercado del viernes: validación, prototipo, primeros clientes y cierre de cuentas.",
  },
  {
    id: "aurea-sports",
    name: "Aurea Sports",
    category: "deportes",
    level: "todos",
    members: 128,
    meets: "Diario, 15:30",
    place: "Centro Deportivo",
    text: "El paraguas de los equipos representativos: fútbol, baloncesto, voleibol, natación y atletismo.",
  },
  {
    id: "teatro-aurea",
    name: "Teatro AUREA",
    category: "arte",
    level: "todos",
    members: 29,
    meets: "Martes y viernes, 16:30",
    place: "Auditorio Aurea",
    text: "Dos montajes por año lectivo, con producción, escenografía y vestuario a cargo del propio elenco.",
  },
  {
    id: "orquesta",
    name: "Orquesta y Coro",
    category: "arte",
    level: "todos",
    members: 63,
    meets: "Lunes y miércoles, 16:00",
    place: "Sala de música",
    text: "Cuerdas, vientos y coro. Repertorio latinoamericano y dos conciertos abiertos al público por año.",
  },
  {
    id: "voluntariado",
    name: "Manos AUREA",
    category: "servicio",
    level: "todos",
    members: 88,
    meets: "Sábados, 8:00",
    place: "Punto de encuentro: explanada",
    text: "Alfabetización digital, apoyo escolar y jornadas comunitarias en tres centros de la ciudad.",
  },
  {
    id: "club-lectura",
    name: "Círculo de Lectura",
    category: "cultura",
    level: "todos",
    members: 26,
    meets: "Miércoles, 15:00",
    place: "Biblioteca, sala 3",
    text: "Un libro por mes, elegido por votación. Sesión abierta, sin necesidad de haber terminado la lectura.",
  },
  {
    id: "modelo-onu",
    name: "Modelo de Naciones Unidas",
    category: "academico",
    level: "todos",
    members: 35,
    meets: "Viernes, 16:00",
    place: "Aula 204",
    text: "Simulación diplomática, redacción de resoluciones y participación en tres modelos por año.",
  },
  {
    id: "danza",
    name: "Compañía de Danza",
    category: "arte",
    level: "todos",
    members: 31,
    meets: "Martes y jueves, 17:00",
    place: "Sala de danza",
    text: "Contemporáneo y folclórico. Presentaciones en el festival de fin de año y en encuentros interinstitucionales.",
  },
  {
    id: "ciencia-abierta",
    name: "Ciencia Abierta",
    category: "academico",
    level: "media",
    members: 24,
    meets: "Jueves, 15:00",
    place: "Laboratorio de Ciencias A",
    text: "Experimentos, divulgación y preparación de la Jornada Científica de educación media.",
  },
  {
    id: "ajedrez",
    name: "Club de Ajedrez",
    category: "deportes",
    level: "todos",
    members: 42,
    meets: "Lunes a viernes, 12:30",
    place: "Cafetería, ala este",
    text: "Torneo interno permanente por sistema suizo y clases abiertas para principiantes.",
  },
];

/* ----------------------------------------------------------------- sports */

export const sports = [
  { id: "futbol", name: "Fútbol", teams: "Femenino y masculino · media y superior", note: "Liga interinstitucional y torneo interclases" },
  { id: "baloncesto", name: "Baloncesto", teams: "Femenino y masculino · media y superior", note: "Copa AUREA y liga universitaria" },
  { id: "voleibol", name: "Voleibol", teams: "Femenino y masculino · media y superior", note: "Tricampeón femenino universitario" },
  { id: "natacion", name: "Natación", teams: "Mixto · por categorías de edad", note: "Festival de natación y competencia federada" },
  { id: "atletismo", name: "Atletismo", teams: "Mixto · velocidad, fondo y salto", note: "Incluye categoría adaptada desde 2027" },
];

export const sportsResults = [
  { date: "2026-08-30", event: "Copa AUREA · final voleibol femenino", result: "AUREA 3 – 1 Instituto San Marcos", tone: "win" },
  { date: "2026-08-23", event: "Liga universitaria · baloncesto masculino", result: "AUREA 68 – 74 Universidad del Valle Norte", tone: "loss" },
  { date: "2026-08-16", event: "Interclases · final de fútbol", result: "11.º B 2 (4) – 2 (3) 12.º A", tone: "win" },
  { date: "2026-08-09", event: "Encuentro de natación", result: "Segundo lugar general · 6 medallas", tone: "draw" },
];

/* -------------------------------------------------------------------- art */

export const arts = [
  { id: "musica", name: "Música", text: "Orquesta de cuerdas, coro y ensambles de viento. Dos conciertos abiertos por año." },
  { id: "teatro", name: "Teatro", text: "Dos montajes anuales con producción íntegra del elenco estudiantil." },
  { id: "danza", name: "Danza", text: "Contemporáneo y folclórico, con presentaciones dentro y fuera del campus." },
  { id: "diseno", name: "Diseño", text: "Muestra de portafolios y exposición permanente en la galería del Centro de Innovación." },
  { id: "fotografia", name: "Fotografía", text: "Salidas, revelado digital y exposición colectiva al cierre de cada período." },
];

export const culturalEvents = [
  { date: "2026-09-30", title: "Concierto de la Orquesta AUREA", place: "Auditorio" },
  { date: "2026-10-22", title: "Muestra de Portafolios · Diseño Digital", place: "Galería" },
  { date: "2026-12-11", title: "Festival de Fin de Año", place: "Explanada Central" },
];

/* ----------------------------------------------------------- volunteering */

export const service = {
  title: "Voluntariado",
  text:
    "Manos AUREA articula el trabajo comunitario de los dos niveles. Tres programas " +
    "permanentes —alfabetización digital, apoyo escolar y jornadas de infraestructura " +
    "comunitaria— con registro de horas que se reconoce en el expediente del estudiante.",
  facts: [
    { value: "88", label: "estudiantes activos" },
    { value: "3", label: "centros comunitarios" },
    { value: "100", label: "familias certificadas en 2026" },
  ],
};

/* ------------------------------------------------------- support services */

/**
 * “No tienes que hacerlo solo.”
 *
 * Eight services, each with the one thing a student in trouble actually needs
 * to know: where it is, when it is open and whether it costs anything. The
 * answer to the last question is no in all eight cases, and saying so
 * explicitly is the whole point of the field.
 */
export const supportServices = [
  {
    id: "orientacion",
    name: "Orientación académica",
    text: "Un asesor por estudiante en educación superior y un docente guía por sección en media. Revisa carga académica, avance y decisiones de itinerario.",
    where: "Coordinación de cada carrera",
    when: "Cita desde el portal estudiantil",
    cost: "Sin costo",
  },
  {
    id: "tutorias",
    name: "Tutorías",
    text: "Refuerzo en las asignaturas con mayor dificultad, impartido por estudiantes de años superiores con supervisión docente.",
    where: "Biblioteca, salas 1 y 2",
    when: "Lunes a viernes, 14:00 – 18:00",
    cost: "Sin costo",
  },
  {
    id: "bienestar",
    name: "Psicología y bienestar",
    text: "Atención individual confidencial, talleres de manejo de ansiedad y protocolo de derivación cuando el caso excede el alcance del servicio.",
    where: "Edificio de Servicios, planta baja",
    when: "Lunes a viernes, 7:30 – 16:30",
    cost: "Sin costo · hasta ocho sesiones por período",
  },
  {
    id: "inclusion",
    name: "Inclusión y accesibilidad",
    text: "Ajustes razonables, apoyo técnico, material en formatos alternativos y acompañamiento en la evaluación. Se solicita al matricularse o en cualquier momento del año.",
    where: "Bienestar Estudiantil",
    when: "Lunes a viernes, 8:00 – 16:00",
    cost: "Sin costo",
  },
  {
    id: "empleabilidad",
    name: "Empleabilidad",
    text: "Revisión de hoja de vida, simulación de entrevista, bolsa de empleo y vinculación con las empresas aliadas.",
    where: "Centro de Innovación, ala sur",
    when: "Lunes a viernes, 8:00 – 16:00",
    cost: "Sin costo",
  },
  {
    id: "becas",
    name: "Becas y apoyo financiero",
    text: "Solicitud, renovación y reprogramación. Ante una situación sobreviniente, el caso se revisa dentro del período en curso y no en la próxima convocatoria.",
    where: "Bienestar Estudiantil y Finanzas",
    when: "Lunes a viernes, 8:00 – 16:00",
    cost: "Sin costo",
  },
  {
    id: "soporte",
    name: "Soporte tecnológico",
    text: "Cuentas institucionales, campus virtual, acceso a laboratorios y préstamo de equipo para estudiantes con beca socioeconómica vigente.",
    where: "Edificio de Ingeniería, planta baja",
    when: "Lunes a viernes, 7:00 – 19:00",
    cost: "Sin costo",
  },
  {
    id: "biblioteca",
    name: "Biblioteca",
    text: "Préstamo, bases de datos, formación en búsqueda y citación, y salas de estudio reservables.",
    where: "Edificio de Biblioteca",
    when: "Lunes a viernes 7:00 – 20:00 · Sábados 8:00 – 14:00",
    cost: "Sin costo",
  },
];

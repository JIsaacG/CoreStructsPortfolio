/**
 * The gallery — thirty-two scenes of an institution that has never been
 * photographed.
 *
 * This is the piece of the portal that a prospective family looks at before
 * it reads anything, and the piece an invented institution has the hardest
 * time producing honestly. AUREA has no campus to photograph and no students
 * to portrait; stock imagery of real people would be the one dishonest element
 * on a site whose whole argument is that everything in it is declared fiction.
 *
 * So the gallery is drawn. Every entry points at a plate in
 * `tools/aurea/art.mjs`, and the plates are built from the same vocabulary —
 * ground, lattice, mass, line, figure, one accent — which is what lets thirty
 * different drawings read as one body of work rather than as a clip-art
 * folder. In a real deployment this array is a media library: swap `plate` for
 * `src` plus `alt` and nothing else in the renderer changes.
 *
 * `size` drives the mosaic. It is a composition instruction, not a property of
 * the subject: the grid is dense-packed, so the large tiles are placed where
 * the rhythm needs them rather than where the content is most important.
 *
 * `tone` is the other composition instruction, and it is the one that makes
 * the mosaic look like a gallery instead of a wall. Every plate can be drawn
 * on the deep navy or on paper; thirty-two tiles all in navy read as one
 * enormous dark rectangle, so roughly every third one is set on paper. Which
 * ones is a decision about rhythm — light tiles are spread so no two touch —
 * and not about the subject.
 */

export const galleryCategories = [
  { id: "campus", label: "Campus" },
  { id: "academico", label: "Académico" },
  { id: "deportes", label: "Deportes" },
  { id: "arte", label: "Arte y cultura" },
  { id: "comunidad", label: "Comunidad" },
  { id: "investigacion", label: "Investigación" },
];

export const gallery = [
  /* ------------------------------------------------------------- campus */
  {
    id: "explanada",
    plate: "patio",
    category: "campus",
    size: "big",
    title: "La explanada central",
    caption:
      "El punto de encuentro del campus y la sede de las ferias, el festival de fin de año y el " +
      "mercado de emprendimiento de los viernes.",
  },
  {
    id: "biblioteca-niveles",
    tone: "paper",
    plate: "biblioteca",
    category: "campus",
    size: "tall",
    title: "Biblioteca, tercer nivel",
    caption: "Doscientos cuarenta puestos de lectura repartidos en tres niveles, del trabajo en voz alta al silencio absoluto.",
  },
  {
    id: "auditorio-lleno",
    plate: "auditorio",
    category: "campus",
    size: "wide",
    title: "Auditorio Aurea",
    caption: "Cuatrocientas ochenta butacas, con lazo de inducción magnética y tres filas accesibles.",
  },
  {
    id: "areas-verdes",
    tone: "paper",
    plate: "jardin",
    category: "campus",
    size: "",
    title: "Áreas verdes",
    caption: "Cuatro mil metros cuadrados entre los edificios académicos y el centro deportivo.",
  },
  {
    id: "comedor",
    plate: "cafeteria",
    category: "campus",
    size: "wide",
    title: "Comedor y cafetería",
    caption: "Trescientos puestos techados, abiertos de 6:30 a 19:00.",
  },
  {
    id: "salas-abiertas",
    tone: "paper",
    plate: "colab",
    category: "campus",
    size: "",
    title: "Espacios colaborativos",
    caption: "Nueve salas abiertas, sin reserva y sin horario, con pizarra de pared a pared.",
  },
  {
    id: "aula-tipo",
    plate: "aula",
    category: "campus",
    size: "",
    title: "Un aula cualquiera",
    caption: "Ninguna sección de educación media supera los treinta y dos estudiantes.",
  },

  /* ----------------------------------------------------------- académico */
  {
    id: "laboratorio-ciencias",
    plate: "laboratorio",
    category: "academico",
    size: "tall",
    title: "Laboratorio de ciencias",
    caption: "Química, biología y física, con acceso libre fuera del horario de clase hasta las 20:00.",
  },
  {
    id: "laboratorio-computo",
    tone: "paper",
    plate: "computo",
    category: "academico",
    size: "wide",
    title: "Laboratorio de cómputo",
    caption: "Una estación por estudiante, y todo el software del programa libre o con licencia educativa.",
  },
  {
    id: "jornada-examenes",
    plate: "examen",
    category: "academico",
    size: "",
    title: "Semana de exámenes",
    caption: "El calendario se publica con cinco semanas de antelación y no se mueve.",
  },
  {
    id: "tutorias",
    plate: "tutoria",
    category: "academico",
    size: "wide",
    title: "Tutoría entre pares",
    caption: "Estudiantes de años superiores, con supervisión docente, de lunes a viernes de 14:00 a 18:00.",
  },
  {
    id: "microscopia",
    tone: "paper",
    plate: "microscopio",
    category: "academico",
    size: "",
    title: "Práctica de microscopía",
    caption: "Undécimo grado, en la unidad de célula vegetal.",
  },
  {
    id: "taller-codigo",
    plate: "codigo",
    category: "academico",
    size: "",
    title: "Taller de programación",
    caption: "Proyecto integrador de tercer año: el software se despliega y se defiende con métricas de uso.",
  },
  {
    id: "fabricacion",
    tone: "paper",
    plate: "taller",
    category: "academico",
    size: "",
    title: "Fabricación digital",
    caption: "Impresión 3D, corte láser y electrónica, abiertos a los dos niveles por igual.",
  },

  /* ------------------------------------------------------------ deportes */
  {
    id: "cancha-futbol",
    plate: "deporte",
    category: "deportes",
    size: "big",
    title: "Torneo interclases",
    caption: "Cuatrocientos doce estudiantes compitieron en cinco disciplinas en la edición 2026.",
  },
  {
    id: "copa-baloncesto",
    tone: "paper",
    plate: "baloncesto",
    category: "deportes",
    size: "",
    title: "Copa AUREA de baloncesto",
    caption: "Encuentro interinstitucional con seis centros invitados, en ramas femenina y masculina.",
  },
  {
    id: "piscina",
    plate: "natacion",
    category: "deportes",
    size: "wide",
    title: "Piscina semiolímpica",
    caption: "Veinticinco metros, seis carriles, y el festival de natación cada febrero.",
  },
  {
    id: "torneo-ajedrez",
    plate: "ajedrez",
    category: "deportes",
    size: "",
    title: "Torneo permanente de ajedrez",
    caption: "Sistema suizo, en la cafetería, todos los días a las 12:30.",
  },

  /* ---------------------------------------------------------------- arte */
  {
    id: "teatro-montaje",
    plate: "teatro",
    category: "arte",
    size: "tall",
    title: "Teatro AUREA",
    caption: "Dos montajes por año lectivo, con producción, escenografía y vestuario del propio elenco.",
  },
  {
    id: "orquesta",
    tone: "paper",
    plate: "musica",
    category: "arte",
    size: "wide",
    title: "Orquesta y coro",
    caption: "Repertorio latinoamericano y dos conciertos abiertos al público cada año.",
  },
  {
    id: "compania-danza",
    plate: "danza",
    category: "arte",
    size: "",
    title: "Compañía de danza",
    caption: "Contemporáneo y folclórico, dentro y fuera del campus.",
  },
  {
    id: "photography-society",
    tone: "paper",
    plate: "fotografia",
    category: "arte",
    size: "",
    title: "Photography Society",
    caption: "Salidas, revelado digital y una exposición colectiva al cierre de cada período.",
  },
  {
    id: "muestra-portafolios",
    plate: "estudio",
    category: "arte",
    size: "wide",
    title: "Muestra de portafolios",
    caption: "Revisión abierta de los portafolios de Diseño Digital, con jurado externo.",
  },

  /* ----------------------------------------------------------- comunidad */
  {
    id: "alfabetizacion",
    plate: "comunidad",
    category: "comunidad",
    size: "wide",
    title: "Alfabetización digital",
    caption: "Cien familias certificadas en 2026, en tres centros comunitarios de la ciudad.",
  },
  {
    id: "feria-carreras",
    plate: "feria",
    category: "comunidad",
    size: "big",
    title: "Feria de Carreras",
    caption: "Las nueve carreras con módulo propio, laboratorios abiertos y charlas cada hora.",
  },
  {
    id: "graduacion-2026",
    tone: "paper",
    plate: "graduacion",
    category: "comunidad",
    size: "tall",
    title: "Promoción 2026",
    caption: "Seis mil doscientos egresados desde la primera graduación, en 2004.",
  },
  {
    id: "acto-aniversario",
    plate: "ceremonia",
    category: "comunidad",
    size: "",
    title: "Aniversario institucional",
    caption: "Veinticinco años, y el mural de egresados develado en noviembre de 2026.",
  },
  {
    id: "debate-regional",
    tone: "paper",
    plate: "debate",
    category: "comunidad",
    size: "",
    title: "Aurea Debate",
    caption: "Formato parlamentario británico, con mociones entregadas quince minutos antes de cada ronda.",
  },

  /* ------------------------------------------------------- investigación */
  {
    id: "energia-campus",
    plate: "energia",
    category: "investigacion",
    size: "wide",
    title: "Instrumentación energética",
    caption: "Veintiocho sensores y un 18 % menos de consumo en tres meses de medición.",
  },
  {
    id: "robotics-lab",
    plate: "robotica",
    category: "investigacion",
    size: "",
    title: "Robotics Lab",
    caption: "Competencia de robótica y automatización, en la liga escolar y en la universitaria.",
  },
  {
    id: "observatorio",
    tone: "paper",
    plate: "series",
    category: "investigacion",
    size: "",
    title: "Observatorio Empresarial",
    caption: "Treinta y ocho empresas acompañadas por equipos de estudiantes desde 2019.",
  },
  {
    id: "movilidad",
    plate: "mapa",
    category: "investigacion",
    size: "",
    title: "Movilidad académica",
    caption: "Doce plazas por año en tres universidades socias, con reconocimiento total de créditos.",
  },
];

/** The mosaic that previews the gallery on the homepage. */
export const featuredGallery = [
  "explanada",
  "laboratorio-computo",
  "teatro-montaje",
  "cancha-futbol",
  "orquesta",
  "graduacion-2026",
  "areas-verdes",
];

export const byId = (id) => gallery.find((item) => item.id === id);
export const byCategory = (category) => gallery.filter((item) => item.category === category);

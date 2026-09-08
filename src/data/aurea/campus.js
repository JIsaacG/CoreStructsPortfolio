/**
 * The campus: spaces, the virtual tour and the visit booking.
 *
 * “Conoce dónde vas a aprender” is the hardest page to fake and the one a
 * family looks at hardest, because it is the only part of the site that
 * answers a question a brochure cannot: is this a real place. An invented
 * institution cannot photograph itself, so the tour is drawn — a plan with
 * hotspots and a plate per space — and it is honest about being drawn.
 *
 * The booking form below is a front-end demonstration. Nothing is submitted,
 * nothing is stored, and the confirmation screen says so.
 */

/* ----------------------------------------------------------------- spaces */

export const spaces = [
  {
    id: "biblioteca",
    name: "Biblioteca",
    kind: "Estudio",
    plate: "biblioteca",
    summary: "Tres niveles, 240 puestos de lectura y catorce salas de estudio en grupo.",
    detail:
      "El nivel bajo es de trabajo en voz alta y el tercero es de silencio absoluto. Las " +
      "salas grupales se reservan desde el portal en bloques de dos horas. En semanas de " +
      "examen abre de 6:30 a 22:00.",
    facts: [
      { value: "240", label: "puestos de lectura" },
      { value: "14", label: "salas grupales" },
      { value: "38 mil", label: "volúmenes" },
    ],
  },
  {
    id: "laboratorios",
    name: "Laboratorios",
    kind: "Práctica",
    plate: "laboratorio",
    summary: "Dieciocho laboratorios: ciencias, cómputo, redes, diseño, audiovisual y psicología.",
    detail:
      "Cada laboratorio tiene horario de clase y horario de acceso libre. El de redes " +
      "trabaja sobre un segmento aislado de la red del campus, y el de psicología cuenta " +
      "con cámara Gesell para observación supervisada.",
    facts: [
      { value: "18", label: "laboratorios" },
      { value: "1:1", label: "estación por estudiante" },
      { value: "20:00", label: "cierre de acceso libre" },
    ],
  },
  {
    id: "innovacion",
    name: "Centro de Innovación",
    kind: "Creación",
    plate: "taller",
    summary: "Fabricación digital, estudio audiovisual, electrónica y planta libre de trabajo.",
    detail:
      "Abierto a educación media y superior sin distinción. Impresión 3D, corte láser, " +
      "set de fotografía, cabina de audio y mesas reconfigurables. Requiere inducción de " +
      "seguridad por equipo.",
    facts: [
      { value: "600 m²", label: "de taller abierto" },
      { value: "4", label: "zonas de trabajo" },
      { value: "2026", label: "año de apertura" },
    ],
  },
  {
    id: "auditorio",
    name: "Auditorio Aurea",
    kind: "Encuentro",
    plate: "auditorio",
    summary: "480 butacas, cabina técnica y acceso universal en todos los niveles.",
    detail:
      "Sede de los actos institucionales, las reuniones de padres, el ciclo de conciertos " +
      "y las defensas públicas de proyectos de graduación. Con lazo de inducción magnética " +
      "y espacios reservados para sillas de ruedas en tres filas distintas.",
    facts: [
      { value: "480", label: "butacas" },
      { value: "3", label: "filas accesibles" },
      { value: "Sí", label: "lazo de inducción" },
    ],
  },
  {
    id: "deportivo",
    name: "Centro Deportivo",
    kind: "Movimiento",
    plate: "deporte",
    summary: "Gimnasio techado, cancha de fútbol, piscina semiolímpica y pista de atletismo.",
    detail:
      "Sede de los equipos representativos y del programa de educación física de los dos " +
      "niveles. La piscina y el gimnasio abren a la comunidad estudiantil fuera del " +
      "horario de entrenamiento.",
    facts: [
      { value: "5", label: "disciplinas federadas" },
      { value: "25 m", label: "piscina semiolímpica" },
      { value: "412", label: "estudiantes en competencia" },
    ],
  },
  {
    id: "aulas",
    name: "Aulas",
    kind: "Clase",
    plate: "aula",
    summary: "Sesenta aulas con capacidad para veinticuatro a treinta y dos estudiantes.",
    detail:
      "Ninguna sección supera los treinta y dos. Todas con proyección, conectividad y " +
      "mobiliario reconfigurable para trabajo en grupo. Doce aulas están habilitadas para " +
      "clase híbrida con cámara y micrófono de sala.",
    facts: [
      { value: "60", label: "aulas" },
      { value: "24–32", label: "estudiantes por sección" },
      { value: "12", label: "aulas híbridas" },
    ],
  },
  {
    id: "cafeteria",
    name: "Cafetería y áreas verdes",
    kind: "Encuentro",
    plate: "patio",
    summary: "Comedor techado para 300 personas y cuatro mil metros de área verde.",
    detail:
      "La explanada central es el punto de encuentro del campus y la sede de las ferias, " +
      "el festival de fin de año y el mercado de emprendimiento estudiantil de los viernes.",
    facts: [
      { value: "300", label: "puestos en comedor" },
      { value: "4,000 m²", label: "de área verde" },
      { value: "Viernes", label: "mercado estudiantil" },
    ],
  },
  {
    id: "colaborativos",
    name: "Espacios colaborativos",
    kind: "Estudio",
    plate: "colab",
    summary: "Nueve salas abiertas distribuidas entre los edificios académicos.",
    detail:
      "Mesas grandes, pizarra de pared a pared y ningún horario. Son el lugar donde de " +
      "hecho ocurre la mitad del trabajo en equipo del campus, así que se diseñaron para " +
      "eso en lugar de dejarlo a los pasillos.",
    facts: [
      { value: "9", label: "salas abiertas" },
      { value: "Sin", label: "reserva ni horario" },
      { value: "24", label: "pizarras de pared" },
    ],
  },
];

/* ------------------------------------------------------------ virtual tour */

/**
 * The tour.
 *
 * Not a 3D model and not a panorama viewer: a drawn plan of the campus with
 * eight hotspots, each opening the plate and the description of that space.
 * It loads in a few kilobytes, works with a keyboard, reads correctly to a
 * screen reader and says everything a panorama would say about an institution
 * that does not exist.
 *
 * `x` and `y` are percentages on the plan, so the hotspots follow the drawing
 * at any width instead of being positioned in pixels.
 */
export const tourStops = [
  { space: "aulas", x: 26, y: 30, label: "Edificio de aulas" },
  { space: "laboratorios", x: 56, y: 24, label: "Laboratorios" },
  { space: "biblioteca", x: 74, y: 44, label: "Biblioteca" },
  { space: "innovacion", x: 62, y: 66, label: "Centro de Innovación" },
  { space: "auditorio", x: 40, y: 56, label: "Auditorio" },
  { space: "cafeteria", x: 46, y: 78, label: "Cafetería y explanada" },
  { space: "deportivo", x: 18, y: 68, label: "Centro deportivo" },
  { space: "colaborativos", x: 84, y: 22, label: "Espacios colaborativos" },
];

/* ------------------------------------------------------------ visit booking */

export const visitOptions = {
  kinds: [
    {
      id: "media",
      label: "Educación Media",
      note: "Recorrido de 60 minutos con la coordinación de bachilleratos",
    },
    {
      id: "superior",
      label: "Universidad",
      note: "Recorrido de 90 minutos con la coordinación de la carrera de interés",
    },
    {
      id: "grupo",
      label: "Grupo o delegación",
      note: "Para centros educativos · a partir de 10 personas",
    },
  ],
  slots: ["8:30", "10:00", "11:30", "14:00", "15:30"],
  /* Saturdays are only mornings, which the form enforces rather than
     explaining in fine print nobody reads. */
  saturdaySlots: ["8:30", "10:00", "11:30"],
  sizes: [
    { id: "1", label: "1 persona" },
    { id: "2", label: "2 personas" },
    { id: "3-4", label: "3 a 4 personas" },
    { id: "5-10", label: "5 a 10 personas" },
    { id: "10+", label: "Más de 10 personas" },
  ],
};

export const visitFacts = [
  { value: "60–90 min", label: "duración del recorrido" },
  { value: "Sin costo", label: "para familias y aspirantes" },
  { value: "Lun a sáb", label: "disponibilidad" },
];

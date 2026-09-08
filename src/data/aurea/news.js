/**
 * Two publication types, deliberately kept apart.
 *
 * A news article is editorial: it has an author, a photograph, a category and
 * a reading time, and it is written to be read by someone who is not obliged
 * to. An announcement is administrative: it has a validity window, a
 * responsible office and a level of urgency, and it is written for someone who
 * *has* to read it. Merging them into a single “noticias” feed — which is what
 * most institutional sites do — buries the second kind under the first.
 *
 * Modelling both is also the clearest way to show what a CMS behind this
 * portal would hold: two content types, two editorial workflows, one homepage.
 *
 * Everything below is invented.
 */

export const newsCategories = [
  { id: "institucional", label: "Institucional" },
  { id: "estudiantes", label: "Estudiantes" },
  { id: "investigacion", label: "Investigación" },
  { id: "deportes", label: "Deportes" },
  { id: "comunidad", label: "Comunidad" },
  { id: "internacional", label: "Internacional" },
];

/* ---------------------------------------------------------------- articles */

export const articles = [
  {
    slug: "proyecto-energia-inteligente",
    date: "2026-09-02",
    category: "investigacion",
    title: "Estudiantes de Ingeniería presentan un proyecto de energía inteligente",
    summary:
      "Cuatro estudiantes de cuarto año instrumentaron el edificio de laboratorios y " +
      "redujeron un 18 % el consumo eléctrico en tres meses de medición.",
    plate: "energia",
    author: "Comunicación Institucional",
    words: 620,
    lead:
      "El proyecto empezó como una pregunta de sobremesa: por qué las luces del pasillo " +
      "del segundo piso siguen encendidas a las nueve de la noche.",
    body: [
      "El equipo —Andrea Núñez, Kevin Ramos, Melissa Ordóñez y Josué Cárcamo, todos del " +
        "Período VII de Ingeniería en Sistemas— instrumentó el edificio de laboratorios con " +
        "veintiocho sensores de consumo y presencia conectados a un concentrador propio. " +
        "El sistema no apaga nada por su cuenta: registra, modela y propone.",
      "«Lo primero que descubrimos es que el problema no era la iluminación», explica " +
        "Ordóñez. «Era el aire acondicionado de dos aulas que quedaban programadas para un " +
        "horario que se cambió hace dos años y que nadie volvió a tocar.»",
      "Tres meses de medición después, el consumo del edificio bajó un 18 % sin ninguna " +
        "obra y sin comprar equipo nuevo. El ahorro proyectado a doce meses cubre el costo " +
        "del propio sistema cuatro veces.",
      "El proyecto se presentó como trabajo del Proyecto Integrador II y fue adoptado por " +
        "la Dirección de Infraestructura, que lo extenderá al edificio de aulas durante el " +
        "primer período de 2027. El Centro de Energía y Sostenibilidad acompañará la " +
        "segunda fase con dos plazas de investigación para estudiantes de grado.",
      "«Lo que más valoramos no es el porcentaje», dice el ingeniero Daniel Espinoza, " +
        "tutor del equipo. «Es que cuatro estudiantes aprendieron a medir antes de opinar. " +
        "Eso es lo que hace la diferencia entre un ingeniero y alguien que sabe programar.»",
    ],
    featured: true,
  },
  {
    slug: "nuevo-laboratorio-innovacion",
    date: "2026-08-27",
    category: "institucional",
    title: "AUREA inaugura su nuevo laboratorio de innovación",
    summary:
      "Seiscientos metros cuadrados de taller abierto, con fabricación digital, estudio " +
      "audiovisual y espacio de trabajo para proyectos de estudiantes de los dos niveles.",
    plate: "taller",
    author: "Comunicación Institucional",
    words: 520,
    lead:
      "El nuevo Centro de Innovación abrió sus puertas el 27 de agosto, después de once " +
      "meses de obra, y es el primer espacio del campus que comparten educación media y " +
      "educación superior sin distinción de horario.",
    body: [
      "El edificio ocupa seiscientos metros cuadrados en el costado norte del campus y se " +
        "organiza en cuatro zonas: fabricación digital, con impresión 3D y corte láser; " +
        "estudio audiovisual con set de fotografía y cabina de audio; laboratorio de " +
        "electrónica; y una planta libre de trabajo con mesas reconfigurables.",
      "La regla de operación es deliberadamente simple: cualquier estudiante puede " +
        "reservar cualquier zona, sin importar su nivel ni su carrera, siempre que haya " +
        "completado la inducción de seguridad del equipo que va a usar.",
      "«Queríamos un lugar donde un chico de undécimo grado que está armando un dron se " +
        "encuentre con una estudiante de Diseño Digital que está imprimiendo un prototipo», " +
        "dice la rectora Elena Villalta. «Ese encuentro no se planifica desde una " +
        "coordinación. Se hace posible con un espacio.»",
      "El centro abre de lunes a viernes de 7:00 a 20:00 y los sábados de 8:00 a 14:00. " +
        "Las reservas se gestionan desde el portal estudiantil.",
    ],
    featured: true,
  },
  {
    slug: "equipo-debate-competencia-regional",
    date: "2026-08-19",
    category: "estudiantes",
    title: "El equipo de debate representará a la institución en la competencia regional",
    summary:
      "Aurea Debate clasificó tras ganar cuatro de cinco rondas en la eliminatoria " +
      "nacional. Competirá en noviembre con delegaciones de seis países.",
    plate: "debate",
    author: "Vida Estudiantil",
    words: 430,
    lead:
      "El club Aurea Debate ganó cuatro de cinco rondas en la eliminatoria nacional y " +
      "asegura por segundo año consecutivo un lugar en la competencia regional.",
    body: [
      "La delegación la integran seis estudiantes: cuatro de educación superior y dos de " +
        "duodécimo grado, la primera vez que el equipo mezcla los dos niveles en una " +
        "competencia oficial.",
      "«La diferencia de edad se nota en los primeros entrenamientos y deja de notarse a " +
        "la tercera semana», dice Inés Carrillo, docente asesora del club. «Un buen " +
        "argumento no tiene edad.»",
      "El formato regional es parlamentario británico, con mociones entregadas quince " +
        "minutos antes de cada ronda. El equipo entrena tres veces por semana desde junio, " +
        "con sesiones abiertas los jueves a las 16:00 en el Aula Magna.",
      "La competencia se celebrará del 12 al 15 de noviembre con delegaciones de seis " +
        "países. AUREA cubre inscripción y traslado a través del fondo de representación " +
        "estudiantil.",
    ],
    featured: true,
  },
  {
    slug: "convenio-movilidad-academica",
    date: "2026-08-11",
    category: "internacional",
    title: "Nuevo convenio de movilidad académica para las licenciaturas",
    summary:
      "Estudiantes de tercer y cuarto año podrán cursar un período completo en tres " +
      "universidades socias, con reconocimiento total de créditos.",
    plate: "mapa",
    author: "Relaciones Internacionales",
    words: 380,
    body: [
      "El convenio, firmado en agosto, habilita el intercambio de un período académico " +
        "completo para estudiantes de tercer y cuarto año de cualquiera de las seis " +
        "licenciaturas, con reconocimiento total de los créditos cursados.",
      "Las plazas son doce por año, distribuidas por concurso de expediente. El requisito " +
        "de admisión es promedio de 85, nivel de idioma acreditado cuando corresponda, y " +
        "un plan de estudios aprobado por la coordinación de carrera.",
      "AUREA cubre la matrícula en la institución de destino; el estudiante asume " +
        "traslado y estancia. El fondo de movilidad ofrece cinco apoyos parciales por año " +
        "para estudiantes con beca socioeconómica vigente.",
      "La convocatoria abre el 15 de octubre en la oficina de Relaciones Internacionales.",
    ],
  },
  {
    slug: "resultados-copa-aurea",
    date: "2026-08-04",
    category: "deportes",
    title: "La Copa AUREA cierra con récord de participación",
    summary:
      "Cuatrocientos doce estudiantes compitieron en cinco disciplinas. El equipo de " +
      "voleibol femenino se llevó el título por tercer año consecutivo.",
    plate: "deporte",
    author: "Coordinación Deportiva",
    words: 350,
    body: [
      "La edición 2026 de la Copa AUREA cerró con 412 estudiantes inscritos en fútbol, " +
        "baloncesto, voleibol, natación y atletismo: un 23 % más que el año anterior y la " +
        "participación más alta desde que se creó el torneo.",
      "El voleibol femenino de educación superior ganó su tercer título consecutivo. En " +
        "educación media, undécimo grado B se llevó el fútbol tras una final que se " +
        "resolvió en penales.",
      "La coordinación deportiva anunció que a partir de 2027 el torneo incluirá una " +
        "categoría mixta de ajedrez y una de atletismo adaptado, con acompañamiento del " +
        "área de inclusión.",
    ],
  },
  {
    slug: "voluntariado-alfabetizacion-digital",
    date: "2026-07-24",
    category: "comunidad",
    title: "Cien familias completaron el programa de alfabetización digital",
    summary:
      "Estudiantes de los dos niveles impartieron el programa durante diez sábados en " +
      "tres centros comunitarios de la ciudad.",
    plate: "comunidad",
    author: "Vinculación Comunitaria",
    words: 400,
    body: [
      "El programa, diseñado por estudiantes del BTP en Informática y coordinado por el " +
        "Centro de Innovación Educativa, cerró su tercera edición con cien familias " +
        "certificadas.",
      "Diez sesiones de sábado cubrieron uso de dispositivos, correo electrónico, " +
        "trámites en línea, banca digital básica y seguridad. Los materiales, escritos por " +
        "los propios estudiantes, quedaron publicados con licencia abierta en el " +
        "repositorio de la biblioteca.",
      "«La parte más difícil no fue enseñar», cuenta Kevin Ramos, uno de los " +
        "facilitadores. «Fue aprender a explicar sin usar palabras que la otra persona no " +
        "tiene por qué conocer. Eso me sirvió más que cualquier clase.»",
      "La cuarta edición abre inscripciones en febrero de 2027 y sumará un módulo de " +
        "identificación de fraudes digitales, a pedido de las familias participantes.",
    ],
  },
];

/* ----------------------------------------------------------- announcements */

/**
 * Announcements — the administrative feed.
 *
 * `level` drives colour and position, and there are only three because a
 * fourth would make the first three mean nothing: `urgente` interrupts,
 * `importante` is pinned, `informativo` is listed.
 */
export const announcements = [
  {
    id: "matricula-ii-2026",
    date: "2026-09-05",
    until: "2026-09-19",
    level: "importante",
    office: "Registro Académico",
    title: "Matrícula del segundo período universitario",
    text:
      "Del 5 al 19 de septiembre, según la cita asignada en el portal estudiantil. La " +
      "selección de asignaturas requiere validación previa del asesor académico. Después " +
      "del 19 aplica recargo por matrícula extemporánea.",
    audience: "superior",
  },
  {
    id: "suspension-16-sept",
    date: "2026-09-12",
    until: "2026-09-16",
    level: "urgente",
    office: "Rectoría",
    title: "Suspensión de actividades el 15 de septiembre",
    text:
      "Por feriado nacional se suspenden las clases presenciales y virtuales, y la " +
      "atención administrativa. Las entregas del campus virtual con vencimiento ese día " +
      "se reprograman automáticamente al 16 de septiembre.",
    audience: "todos",
  },
  {
    id: "calendario-examenes",
    date: "2026-09-08",
    until: "2026-10-17",
    level: "importante",
    office: "Dirección Académica",
    title: "Publicación del calendario de exámenes parciales",
    text:
      "El calendario de la semana del 13 al 17 de octubre está disponible en Documentos " +
      "y en el portal estudiantil. Las solicitudes de examen diferido se presentan hasta " +
      "cinco días hábiles antes de la fecha del examen.",
    audience: "todos",
  },
  {
    id: "horarios-actualizados",
    date: "2026-09-03",
    until: "2026-09-30",
    level: "informativo",
    office: "Registro Académico",
    title: "Actualización de horarios de la jornada nocturna",
    text:
      "Tres asignaturas de Ingeniería en Sistemas y dos de Finanzas cambiaron de aula a " +
      "partir del 8 de septiembre. El horario vigente está en el portal estudiantil; el " +
      "aula anterior mantiene señalización durante la primera semana.",
    audience: "superior",
  },
  {
    id: "becas-convocatoria",
    date: "2026-09-01",
    until: "2027-01-15",
    level: "importante",
    office: "Bienestar Estudiantil",
    title: "Convocatoria de becas 2027 abierta",
    text:
      "Las cinco modalidades de beca reciben expediente hasta el 15 de enero de 2027. El " +
      "estudio socioeconómico se agenda desde la misma solicitud y se realiza entre " +
      "octubre y enero.",
    audience: "todos",
  },
  {
    id: "biblioteca-horario",
    date: "2026-08-28",
    until: "2026-12-09",
    level: "informativo",
    office: "Biblioteca",
    title: "Horario extendido de biblioteca en semanas de examen",
    text:
      "Durante las semanas de parciales y finales, la biblioteca abre de 6:30 a 22:00 de " +
      "lunes a sábado. Las salas de estudio grupal se reservan desde el portal.",
    audience: "todos",
  },
];

export const bySlug = (slug) => articles.find((article) => article.slug === slug);
export const latest = (count = 3) =>
  [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, count);

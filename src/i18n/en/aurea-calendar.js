/**
 * English for the AUREA demo — the calendar, the library catalogue and search.
 *
 * The calendar's event rows are four fields each — date, time, place, audience
 * — and the generic span rule assembles them once every field is known. What
 * this file supplies is the vocabulary: the places on campus, the audiences,
 * and the phrases the timetable uses for "all day" and "as scheduled".
 *
 * Catalogue entries keep their Spanish titles where the work itself would be in
 * Spanish — a corpus of Honduran Spanish is not renamed — and take an English
 * title where the work is a generic textbook.
 */

/** These entries apply only to this demo's pages. */
export const scope = "demos/aurea";

export default {
  /* ------------------------------------------------------- calendar fields */

  "Todo el día": "All day",
  "Según horario": "As scheduled",
  "Toda la comunidad": "Everyone",
  "Aulas asignadas": "Assigned classrooms",
  "Aulas por sección": "Classrooms by class",
  "Aulas 201–210": "Classrooms 201–210",
  "En línea y Campus Central": "Online and Central Campus",
  "Campus cerrado": "Campus closed",
  "Laboratorios A y B": "Laboratories A and B",
  "Laboratorio C": "Laboratory C",
  "Gimnasio Central": "Central Gym",
  "Piscina Semiolímpica": "Semi-Olympic Pool",
  "Galería del Centro de Innovación": "Innovation Centre Gallery",

  "Todo el año lectivo.": "The whole school year.",
  "Veintisiete actividades entre septiembre de 2026 y julio de 2027, incluidas las fechas de admisión, que viven en un solo lugar y se muestran en los dos.":
    "Twenty-seven events between September 2026 and July 2027, including the admissions dates, which " +
    "live in one place and show up in both.",
  "Filtra por tipo de actividad y por audiencia, y exporta cualquier evento a tu propio calendario. Todas las fechas son demostrativas.":
    "Filter by type of event and by audience, and export any of them to your own calendar. All the " +
    "dates are illustrative.",
  "Tipo de actividad": "Type of event",
  "Mes anterior": "Previous month",
  "Mes siguiente": "Next month",
  "Vista del calendario": "Calendar view",
  Mes: "Month",

  /* -------------------------------------------------------------- the events */

  "Jornada de bienvenida: campus virtual, biblioteca, reglamento y asignación de tutor.":
    "A welcome day: the virtual campus, the library, the regulations and tutor allocation.",
  "Presentación del año lectivo, calendario de evaluaciones y equipo docente por sección.":
    "An introduction to the school year, the assessment calendar and the teaching team for each " +
    "class.",
  "Fase de grupos de décimo a duodécimo grado. La final se juega el 10 de octubre.":
    "Group stage, tenth to twelfth grade. The final is played on 10 October.",
  "Programa de cuerdas y coro con obras de repertorio latinoamericano. Entrada libre.":
    "A strings and choir programme of Latin American repertoire. Free entry.",
  "Exámenes parciales": "Mid-term examinations",
  "Primer parcial de educación media y evaluación de medio período en las licenciaturas.":
    "The first upper secondary mid-term, and the mid-term assessment on the degrees.",
  "Revisión abierta de los portafolios de tercer año, con jurado de profesionales invitados.":
    "An open review of third-year portfolios, judged by invited professionals.",
  "Jornada Científica de Educación Media": "Upper Secondary Science Day",
  "Presentación de los proyectos de investigación de undécimo y duodécimo grado.":
    "Presentation of eleventh- and twelfth-grade research projects.",
  "Entrega de calificaciones · Primer parcial": "Reports issued · First mid-term",
  "Atención individual con el docente guía. Cita reservable desde el portal de padres.":
    "One-to-one appointments with the form tutor. Bookable through the parent portal.",
  "Copa AUREA de Baloncesto": "AUREA Basketball Cup",
  "Encuentro interinstitucional con seis centros invitados. Ramas femenina y masculina.":
    "An inter-school meeting with six invited schools. Women's and men's divisions.",
  "Aniversario institucional · 25 años": "Founder's day · 25 years",
  "Acto conmemorativo, reconocimiento a docentes con más de una década y develación del mural de egresados.":
    "A commemorative ceremony, recognition for staff of more than a decade, and the unveiling of the " +
    "alumni mural.",
  "Foro de Empleabilidad y Feria Laboral": "Employability Forum and Careers Fair",
  "Veintidós empresas aliadas reciben hojas de vida y realizan entrevistas en sitio.":
    "Twenty-two partner employers take CVs and interview on the day.",
  "Exámenes finales del período": "End-of-term examinations",
  "Cierre del primer período universitario y del segundo parcial de educación media.":
    "The close of the first university term and of the second upper secondary mid-term.",
  "Elencos de danza, teatro y música, con muestra de los clubes y feria gastronómica.":
    "The dance, theatre and music companies, with a club showcase and a food fair.",

  /* ---------------------------------------------------------- the catalogue */

  "Buscar en el catálogo": "Search the catalogue",
  "Busca libros, artículos y recursos…": "Search books, articles and resources…",
  "Tipo de recurso": "Type of resource",
  "Ningún recurso coincide con esa búsqueda.": "Nothing matches that search.",

  "Estructuras de datos y algoritmos": "Data Structures and Algorithms",
  "Psicopatología del desarrollo": "Developmental Psychopathology",
  "Tipografía para pantalla": "Typography for Screen",
  "Cuadernos de Ciencia de Datos": "Cuadernos de Ciencia de Datos",
  "Revista de Investigación Educativa": "Revista de Investigación Educativa",
  "Corpus abierto de español hondureño": "Open corpus of Honduran Spanish",
  "Detección de deserción con modelos interpretables":
    "Dropout detection with interpretable models",
  "Sucesión en empresas familiares de la capital":
    "Succession in family businesses in the capital",
  "Ansiedad ante la evaluación en educación media":
    "Assessment anxiety in upper secondary",
  "Base de datos de normas técnicas": "Technical standards database",
  "Colección de imágenes y tipografías con licencia":
    "Licensed image and typeface collection",

  "Varios autores · 2024 · Tecnología": "Various authors · 2024 · Technology",
  "Publicación periódica · 2020 – 2026 · Tecnología":
    "Periodical · 2020 – 2026 · Technology",
  "Publicación periódica · 2018 – 2026 · Educación":
    "Periodical · 2018 – 2026 · Education",
  "Centro de Inteligencia Artificial · 2026 · Tecnología":
    "Artificial Intelligence Centre · 2026 · Technology",
  "Cohorte 2026 · 2026 · Tecnología": "2026 cohort · 2026 · Technology",
  "Licencia libre · en construcción": "Open licence · in progress",
  "Suscripción institucional · Vigente · Tecnología":
    "Institutional subscription · Current · Technology",
  "Suscripción institucional · Vigente · Multidisciplinar":
    "Institutional subscription · Current · Multidisciplinary",
  "Suscripción institucional · Vigente · Creatividad":
    "Institutional subscription · Current · Creative",

  "Además del préstamo.": "Beyond lending.",
  "Salas de estudio": "Study rooms",
  "Catorce salas grupales reservables desde el portal en bloques de dos horas.":
    "Fourteen group rooms, bookable through the portal in two-hour blocks.",
  "Formación de usuarios": "User training",
  "Talleres de búsqueda, gestión bibliográfica y citación, abiertos a los dos niveles.":
    "Workshops on searching, reference management and citation, open to both levels.",
  "En semanas de examen, de 6:30 a 22:00 de lunes a sábado.":
    "During exam weeks, 6:30 to 22:00 Monday to Saturday.",
  "Acceso de egresados": "Alumni access",
  "Catálogo y bases de datos con carné de egresado vigente, de por vida.":
    "The catalogue and the databases, with a current alumni card, for life.",

  /* ------------------------------------------------------------- the search */

  Búsqueda: "Search",
  "El buscador global cubre programas, noticias, eventos, docentes, documentos y páginas. Se abre desde cualquier página con el botón Buscar o con la tecla /.":
    "Site-wide search covers programmes, news, events, staff, documents and pages. It opens from any " +
    "page with the Search button or the / key.",
  "Abrir el buscador": "Open the search",
  "Mientras tanto": "In the meantime",
  "Los destinos más buscados.": "The most-visited destinations.",
  "Los nueve programas, con filtros por nivel, modalidad y área.":
    "All nine programmes, with filters by level, mode and subject area.",
  "El proceso, los requisitos y las fechas de 2027.":
    "The process, the requirements and the 2027 dates.",
  "Aranceles publicados, calculadora y cinco programas de beca.":
    "Published fees, a calculator, and five scholarship schemes.",
  "Eventos filtrables por categoría y audiencia.":
    "Events filterable by category and audience.",
  "Reglamentos, formularios, calendarios y planes de estudio.":
    "Regulations, forms, calendars and study plans.",
  "Qué resuelve cada oficina, y cómo contactarla.":
    "What each office handles, and how to contact it.",
};

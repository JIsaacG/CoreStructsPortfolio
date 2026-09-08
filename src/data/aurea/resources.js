/**
 * The reference layer: library, document centre, FAQ and the quick assistant.
 *
 * Four collections that behave the same way — a reader arrives knowing roughly
 * what they want and needs to narrow, not to browse — so all four are built on
 * the same pattern: a filter bar, an accent-insensitive search over a
 * pre-rendered haystack, and results that are already in the HTML before any
 * script runs. Nothing here needs a back end; everything here would come from
 * one in a real deployment.
 *
 * Invented: no document, holding, price or answer below is real.
 */

/* -------------------------------------------------------------- library */

export const libraryTypes = [
  { id: "libro", label: "Libros" },
  { id: "revista", label: "Revistas" },
  { id: "repositorio", label: "Repositorios" },
  { id: "tesis", label: "Tesis" },
  { id: "digital", label: "Recursos digitales" },
];

export const libraryFacts = [
  { value: "38 mil", label: "volúmenes en catálogo" },
  { value: "9", label: "bases de datos suscritas" },
  { value: "1,240", label: "tesis en repositorio abierto" },
  { value: "24/7", label: "acceso a la biblioteca digital" },
];

export const libraryItems = [
  { id: "l1", type: "libro", title: "Estructuras de datos y algoritmos", author: "Varios autores", year: "2024", area: "Tecnología", note: "12 ejemplares · 3 disponibles" },
  { id: "l2", type: "libro", title: "Contabilidad financiera intermedia", author: "Varios autores", year: "2023", area: "Negocios", note: "18 ejemplares · 7 disponibles" },
  { id: "l3", type: "libro", title: "Psicopatología del desarrollo", author: "Varios autores", year: "2025", area: "Salud", note: "9 ejemplares · 2 disponibles" },
  { id: "l4", type: "libro", title: "Tipografía para pantalla", author: "Varios autores", year: "2024", area: "Creatividad", note: "6 ejemplares · 4 disponibles" },
  { id: "l5", type: "revista", title: "Cuadernos de Ciencia de Datos", author: "Publicación periódica", year: "2020 – 2026", area: "Tecnología", note: "Acceso digital · texto completo" },
  { id: "l6", type: "revista", title: "Revista de Investigación Educativa", author: "Publicación periódica", year: "2018 – 2026", area: "Educación", note: "Acceso digital · texto completo" },
  { id: "l7", type: "repositorio", title: "Repositorio Institucional AUREA", author: "Institucional", year: "2014 – 2026", area: "Multidisciplinar", note: "Acceso abierto · 1,240 documentos" },
  { id: "l8", type: "repositorio", title: "Corpus abierto de español hondureño", author: "Centro de Inteligencia Artificial", year: "2026", area: "Tecnología", note: "Licencia libre · en construcción" },
  { id: "l9", type: "tesis", title: "Detección de deserción con modelos interpretables", author: "Cohorte 2026", year: "2026", area: "Tecnología", note: "Texto completo · acceso abierto" },
  { id: "l10", type: "tesis", title: "Sucesión en empresas familiares de la capital", author: "Cohorte 2025", year: "2025", area: "Negocios", note: "Texto completo · acceso abierto" },
  { id: "l11", type: "tesis", title: "Ansiedad ante la evaluación en educación media", author: "Cohorte 2026", year: "2026", area: "Salud", note: "Texto completo · acceso abierto" },
  { id: "l12", type: "digital", title: "Base de datos de normas técnicas", author: "Suscripción institucional", year: "Vigente", area: "Tecnología", note: "Acceso con cuenta institucional" },
  { id: "l13", type: "digital", title: "Hemeroteca digital latinoamericana", author: "Suscripción institucional", year: "Vigente", area: "Multidisciplinar", note: "Acceso con cuenta institucional" },
  { id: "l14", type: "digital", title: "Colección de imágenes y tipografías con licencia", author: "Suscripción institucional", year: "Vigente", area: "Creatividad", note: "Acceso con cuenta institucional" },
];

/* ------------------------------------------------------------- documents */

export const documentCategories = [
  { id: "academico", label: "Académicos" },
  { id: "admisiones", label: "Admisiones" },
  { id: "reglamentos", label: "Reglamentos" },
  { id: "calendarios", label: "Calendarios" },
  { id: "formularios", label: "Formularios" },
  { id: "padres", label: "Padres" },
  { id: "estudiantes", label: "Estudiantes" },
];

/**
 * The document centre.
 *
 * Every entry declares a format and a size so the reader knows what they are
 * about to open. The download is simulated — the demo generates a short text
 * file naming the document instead of shipping ninety invented PDFs — and the
 * interface says so before the click, not after it.
 */
export const documents = [
  { id: "d1", category: "calendarios", title: "Calendario académico 2027", format: "PDF", size: "180 KB", updated: "2026-08-20", audience: "Toda la comunidad" },
  { id: "d2", category: "reglamentos", title: "Reglamento estudiantil", format: "PDF", size: "420 KB", updated: "2026-07-01", audience: "Estudiantes y familias" },
  { id: "d3", category: "reglamentos", title: "Manual de convivencia · Educación Media", format: "PDF", size: "310 KB", updated: "2026-07-01", audience: "Educación Media" },
  { id: "d4", category: "formularios", title: "Formulario de solicitud de beca", format: "PDF", size: "95 KB", updated: "2026-09-01", audience: "Aspirantes y estudiantes" },
  { id: "d5", category: "formularios", title: "Solicitud de equivalencias", format: "PDF", size: "88 KB", updated: "2026-06-15", audience: "Aspirantes de traslado" },
  { id: "d6", category: "formularios", title: "Solicitud de constancia o certificación", format: "PDF", size: "72 KB", updated: "2026-06-15", audience: "Estudiantes y egresados" },
  { id: "d7", category: "admisiones", title: "Guía de admisiones 2027", format: "PDF", size: "1.2 MB", updated: "2026-09-01", audience: "Aspirantes" },
  { id: "d8", category: "admisiones", title: "Temario de la prueba de admisión", format: "PDF", size: "240 KB", updated: "2026-09-01", audience: "Aspirantes de educación superior" },
  { id: "d9", category: "academico", title: "Plan de estudios · Ingeniería en Sistemas", format: "PDF", size: "260 KB", updated: "2026-05-10", audience: "Aspirantes y estudiantes" },
  { id: "d10", category: "academico", title: "Plan de estudios · Administración de Empresas", format: "PDF", size: "250 KB", updated: "2026-05-10", audience: "Aspirantes y estudiantes" },
  { id: "d11", category: "academico", title: "Normas de trabajos de graduación", format: "PDF", size: "195 KB", updated: "2026-04-22", audience: "Estudiantes de último año" },
  { id: "d12", category: "padres", title: "Guía del portal de padres", format: "PDF", size: "1.6 MB", updated: "2026-08-15", audience: "Familias" },
  { id: "d13", category: "padres", title: "Aranceles y formas de pago 2027", format: "PDF", size: "140 KB", updated: "2026-09-01", audience: "Familias" },
  { id: "d14", category: "estudiantes", title: "Guía del campus virtual", format: "PDF", size: "980 KB", updated: "2026-08-15", audience: "Estudiantes" },
  { id: "d15", category: "estudiantes", title: "Manual de uso de laboratorios", format: "PDF", size: "310 KB", updated: "2026-08-01", audience: "Estudiantes" },
  { id: "d16", category: "calendarios", title: "Calendario de exámenes · Primer período", format: "PDF", size: "120 KB", updated: "2026-09-08", audience: "Toda la comunidad" },
  { id: "d17", category: "reglamentos", title: "Política de becas y apoyo financiero", format: "PDF", size: "205 KB", updated: "2026-08-30", audience: "Toda la comunidad" },
  { id: "d18", category: "reglamentos", title: "Protocolo de inclusión y ajustes razonables", format: "PDF", size: "180 KB", updated: "2026-07-20", audience: "Toda la comunidad" },
];

/* ------------------------------------------------------------------- FAQ */

export const faqAudiences = [
  { id: "admisiones", label: "Admisiones" },
  { id: "pagos", label: "Pagos y costos" },
  { id: "media", label: "Educación Media" },
  { id: "universidad", label: "Universidad" },
  { id: "becas", label: "Becas" },
  { id: "internacional", label: "Estudiantes internacionales" },
  { id: "documentos", label: "Documentación" },
];

export const faqs = [
  {
    group: "admisiones",
    q: "¿Cuándo abre el proceso de admisión?",
    a: "El 15 de septiembre de 2026 para el año lectivo 2027, en los dos niveles. La primera fecha prioritaria cierra el 30 de noviembre y es la que compite por el fondo completo de becas.",
  },
  {
    group: "admisiones",
    q: "¿Puedo aplicar a más de un programa?",
    a: "Sí. La solicitud permite un programa principal y una segunda opción. Si no hay cupo en el primero, el expediente pasa automáticamente al segundo sin volver a presentar documentación.",
  },
  {
    group: "admisiones",
    q: "¿Qué pasa si aplico después de la fecha prioritaria?",
    a: "La solicitud se recibe igual mientras haya cupo. La diferencia es el orden de resolución y la disponibilidad del fondo de becas, que se asigna primero entre las solicitudes prioritarias.",
  },
  {
    group: "admisiones",
    q: "¿La prueba de admisión se puede repetir?",
    a: "Hay dos convocatorias por proceso: el 10 y el 24 de febrero. Se puede presentar en ambas y se considera el mejor resultado.",
  },
  {
    group: "pagos",
    q: "¿Cuánto cuesta estudiar en AUREA?",
    a: "Depende del nivel y del programa. Educación media se cobra por mensualidad y educación superior por asignatura. La calculadora de matrícula da una estimación completa por período, incluidos los cargos adicionales.",
  },
  {
    group: "pagos",
    q: "¿Hay descuento por pagar de contado?",
    a: "7 % sobre el total del período si se cancela antes del inicio de clases. Es acumulable con beca y con el descuento por hermanos, hasta un tope del 80 % del arancel.",
  },
  {
    group: "pagos",
    q: "¿Qué pasa si me atraso en un pago?",
    a: "Finanzas Estudiantiles reprograma el saldo del período sin recargo una vez por año lectivo, ante una situación sobreviniente. Conviene acercarse antes del vencimiento y no después.",
  },
  {
    group: "pagos",
    q: "¿Los hermanos tienen descuento?",
    a: "10 % sobre la mensualidad del segundo hijo y 15 % del tercero, mientras los dos estén matriculados de forma simultánea.",
  },
  {
    group: "media",
    q: "¿Puedo cambiar de bachillerato después de empezar?",
    a: "Sí. El décimo grado es común a los tres bachilleratos, así que el cambio se resuelve con una solicitud en Registro antes del cierre de matrícula del segundo año.",
  },
  {
    group: "media",
    q: "¿Cuántos estudiantes hay por sección?",
    a: "Entre veinticuatro y treinta y dos. Ninguna sección de educación media supera los treinta y dos estudiantes.",
  },
  {
    group: "media",
    q: "¿La práctica profesional del BTP es obligatoria?",
    a: "Sí, es requisito de graduación en los dos bachilleratos técnicos. La coordinación gestiona la plaza y el convenio con la empresa.",
  },
  {
    group: "universidad",
    q: "¿Cuántas asignaturas se cursan por período?",
    a: "Cinco es la carga completa. Se puede cursar entre tres y seis; más de seis requiere autorización de coordinación y promedio superior a 85.",
  },
  {
    group: "universidad",
    q: "¿Se puede estudiar y trabajar?",
    a: "Sí. Cuatro de las seis licenciaturas tienen jornada nocturna y tres ofrecen modalidad virtual o semipresencial. Alrededor del 40 % de los estudiantes de tercer y cuarto año trabaja.",
  },
  {
    group: "universidad",
    q: "¿El título de la modalidad virtual es distinto?",
    a: "No. El título no distingue modalidad. Lo que cambia es la exigencia presencial de laboratorios: la modalidad virtual asiste cuatro sábados por período en las carreras que los tienen.",
  },
  {
    group: "universidad",
    q: "¿Reconocen asignaturas cursadas en otra institución?",
    a: "Registro Académico evalúa equivalencias con el programa analítico de cada asignatura. El dictamen se emite en diez días hábiles y se puede solicitar antes de matricularse.",
  },
  {
    group: "becas",
    q: "¿Se puede tener más de una beca?",
    a: "No se acumulan dos becas, pero sí una beca con los descuentos por hermanos o por convenio empresarial, hasta un tope del 80 % del arancel.",
  },
  {
    group: "becas",
    q: "¿Qué pasa si bajo el promedio requerido?",
    a: "La beca entra en período de observación por un ciclo. Si el promedio se recupera, continúa; si no, se reduce o se suspende, con acompañamiento de Bienestar Estudiantil en ambos casos.",
  },
  {
    group: "becas",
    q: "¿El simulador de becas decide si me la dan?",
    a: "No. El simulador de este sitio es una demostración: indica a qué programas podría aplicar un perfil, y no evalúa, no reserva y no compromete nada. La resolución la emite Bienestar Estudiantil tras revisar el expediente completo.",
  },
  {
    group: "internacional",
    q: "¿Puedo estudiar en AUREA siendo extranjero?",
    a: "Sí. Registro Académico verifica los estudios previos y emite el dictamen de equivalencias en diez días hábiles; con la carta de aceptación se inicia el trámite migratorio, que acompaña Relaciones Internacionales.",
  },
  {
    group: "internacional",
    q: "¿AUREA gestiona la visa de estudiante?",
    a: "Acompaña la gestión y emite la documentación de respaldo. La resolución depende de las autoridades migratorias y no de la institución.",
  },
  {
    group: "internacional",
    q: "¿Hay alojamiento para estudiantes internacionales?",
    a: "La institución no tiene residencias propias. Relaciones Internacionales mantiene un listado orientativo de alojamiento verificado en el entorno del campus y asigna un tutor durante el primer período.",
  },
  {
    group: "documentos",
    q: "¿Cómo solicito una constancia de estudios?",
    a: "Desde el portal estudiantil o con el formulario de Registro Académico. El plazo de entrega es de tres días hábiles para constancias y diez para certificaciones de calificaciones.",
  },
  {
    group: "documentos",
    q: "¿Qué documentos debo presentar para matricularme?",
    a: "Depende del nivel. Educación media pide certificado de noveno grado, partida de nacimiento e identidad del tutor; educación superior, título o constancia de egreso y certificado de calificaciones de los tres años.",
  },
  {
    group: "documentos",
    q: "¿Aceptan documentos digitales?",
    a: "Para la revisión de la solicitud, sí. Los originales se presentan en la matrícula.",
  },
];

/* --------------------------------------------------------------- assistant */

/**
 * The quick answers panel.
 *
 * Six buttons and six answers, written in advance. It is not a chatbot and the
 * interface never suggests it is one: the heading says “respuestas rápidas”,
 * every answer ends in a link to the page that holds the full version, and
 * there is no text input, because a text input is a promise of understanding
 * that a lookup table cannot keep.
 */
export const assistant = [
  {
    q: "¿Cómo aplico?",
    a: "En línea, desde la página de admisiones. Son seis pasos: explorar programas, completar la solicitud, entregar documentos, prueba y entrevista, resultado y matrícula.",
    route: "admisiones",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Educación media se cobra por mensualidad y educación superior por asignatura. La calculadora estima el período completo, con cargos adicionales y beca aplicada.",
    route: "costos",
    hash: "calculadora",
  },
  {
    q: "¿Qué carreras ofrecen?",
    a: "Tres bachilleratos de educación media y seis licenciaturas: Ingeniería en Sistemas, Administración, Mercadotecnia, Diseño Digital, Finanzas y Psicología.",
    route: "oferta",
  },
  {
    q: "¿Tienen becas?",
    a: "Cinco programas: Excelencia, Deportiva, Artística, Socioeconómica y Liderazgo, con cobertura del 25 % al 80 %. El expediente se recibe hasta el 15 de enero.",
    route: "becas",
  },
  {
    q: "¿Dónde están ubicados?",
    a: "Campus Central, Boulevard del Saber 4500, Tegucigalpa. Se puede programar una visita guiada de lunes a sábado, sin costo. La dirección es demostrativa.",
    route: "campus",
    hash: "visita",
  },
  {
    q: "¿Cuándo comienzan las clases?",
    a: "El año lectivo 2027 inicia el 5 de abril. La matrícula de primer ingreso se realiza del 10 al 20 de marzo con cita asignada.",
    route: "calendario",
  },
];

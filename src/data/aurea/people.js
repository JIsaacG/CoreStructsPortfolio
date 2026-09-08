/**
 * People — the faculty directory, the authorities and the offices.
 *
 * Three collections that a template would be tempted to merge and that behave
 * completely differently: a professor is searched for by name and by subject,
 * an authority is read once and never again, and an office is looked up when
 * something has gone wrong and the reader is already impatient. So the office
 * entries carry the two things that actually resolve that visit — what the
 * office does and how to reach it *today* — and nothing else.
 *
 * Every person here is invented. The names are common Honduran surnames
 * combined at random; any resemblance to a real academic is accidental and
 * unintended.
 */

export const facultyAreas = [
  { id: "tecnologia", label: "Tecnología e Ingeniería" },
  { id: "negocios", label: "Negocios y Finanzas" },
  { id: "creatividad", label: "Diseño y Comunicación" },
  { id: "salud", label: "Psicología y Bienestar" },
  { id: "general", label: "Formación General y Media" },
];

/* ---------------------------------------------------------------- faculty */

export const faculty = [
  {
    id: "daniel-espinoza",
    name: "Daniel Espinoza",
    title: "M.Sc. en Ingeniería de Software",
    role: "Coordinador de Ingeniería en Sistemas",
    area: "tecnologia",
    programs: ["ingenieria-en-sistemas", "btp-informatica"],
    email: "d.espinoza@aurea.example",
    office: "Edificio de Ingeniería, oficina 214",
    hours: "Martes y jueves, 14:00 – 16:00",
    education: [
      "M.Sc. en Ingeniería de Software",
      "Ingeniero en Sistemas",
      "Certificación en arquitectura de sistemas distribuidos",
    ],
    courses: ["Ingeniería de Software I y II", "Arquitectura de Software", "Proyecto Integrador II"],
    research: "Arquitecturas de servicios y observabilidad en sistemas de baja escala.",
    publications: [
      "Medición de consumo energético en edificios instrumentados (2026)",
      "Patrones de despliegue para equipos pequeños (2025)",
    ],
    bio:
      "Trabajó doce años en desarrollo antes de dar su primera clase, y sostiene que esa " +
      "es la única razón por la que sus estudiantes lo escuchan cuando habla de deuda técnica.",
  },
  {
    id: "karla-medrano",
    name: "Karla Medrano",
    title: "Ph.D. en Ciencias de la Computación",
    role: "Directora del Centro de Inteligencia Artificial",
    area: "tecnologia",
    programs: ["ingenieria-en-sistemas", "btp-informatica"],
    email: "k.medrano@aurea.example",
    office: "Centro de Innovación, ala norte",
    hours: "Lunes y miércoles, 10:00 – 12:00",
    education: [
      "Ph.D. en Ciencias de la Computación",
      "M.Sc. en Estadística Aplicada",
      "Licenciada en Matemática",
    ],
    courses: ["Aprendizaje Automático", "Ingeniería de Datos", "Seminario de Investigación"],
    research: "Aprendizaje automático aplicado a datos educativos y detección temprana de deserción.",
    publications: [
      "Señales tempranas de deserción en educación media (2026)",
      "Modelos interpretables para decisiones académicas (2025)",
      "Sesgo y equidad en sistemas de admisión automatizados (2024)",
    ],
    bio:
      "Dirige el Centro de IA desde su creación en 2023. Insiste en que sus estudiantes " +
      "escriban el informe antes que el modelo.",
  },
  {
    id: "sofia-brenes",
    name: "Sofía Brenes",
    title: "M.Sc. en Métodos Cuantitativos",
    role: "Docente e investigadora",
    area: "tecnologia",
    programs: ["ingenieria-en-sistemas", "finanzas", "psicologia", "diseno-digital"],
    email: "s.brenes@aurea.example",
    office: "Edificio Académico, oficina 118",
    hours: "Viernes, 9:00 – 12:00",
    education: ["M.Sc. en Métodos Cuantitativos", "Licenciada en Estadística"],
    courses: ["Probabilidad y Estadística", "Estadística Inferencial", "Econometría Financiera"],
    research: "Diseño experimental y análisis de datos en contextos con muestras pequeñas.",
    publications: ["Guía práctica de tamaño muestral para trabajos de grado (2025)"],
    bio:
      "Enseña estadística en cuatro carreras distintas y prepara un juego de ejemplos " +
      "propio para cada una, porque una muestra de pacientes no se explica como una de usuarios.",
  },
  {
    id: "patricia-zelaya",
    name: "Patricia Zelaya",
    title: "M.B.A.",
    role: "Decana de la Facultad de Negocios",
    area: "negocios",
    programs: ["administracion-de-empresas", "mercadotecnia", "finanzas", "btp-administracion"],
    email: "p.zelaya@aurea.example",
    office: "Edificio Administrativo, tercer nivel",
    hours: "Miércoles, 8:00 – 11:00",
    education: ["M.B.A. con especialización en estrategia", "Licenciada en Administración de Empresas"],
    courses: ["Dirección Estratégica", "Consultoría Empresarial I", "Gobierno Corporativo"],
    research: "Gestión de pequeñas y medianas empresas en economías de baja formalización.",
    publications: [
      "Diagnóstico operativo de la pyme urbana hondureña (2026)",
      "Sucesión y gobierno en empresas familiares (2024)",
    ],
    bio:
      "Fundó el Observatorio Empresarial en 2019. Sus estudiantes han acompañado a treinta " +
      "y ocho empresas de la ciudad, y las treinta y ocho recibieron el informe completo.",
  },
  {
    id: "hector-lainez",
    name: "Héctor Laínez",
    title: "M.Sc. en Finanzas",
    role: "Coordinador de Finanzas",
    area: "negocios",
    programs: ["finanzas", "administracion-de-empresas", "btp-administracion"],
    email: "h.lainez@aurea.example",
    office: "Edificio Administrativo, oficina 305",
    hours: "Martes, 15:00 – 18:00",
    education: ["M.Sc. en Finanzas", "Licenciado en Administración", "Certificación en gestión de riesgos"],
    courses: ["Valoración de Empresas", "Gestión de Riesgos", "Laboratorio de Modelado I y II"],
    research: "Valoración de empresas no cotizadas y estructuras de financiamiento para pymes.",
    publications: ["Múltiplos comparables en mercados sin profundidad (2025)"],
    bio:
      "Revisa cada modelo entregado abriendo el archivo y cambiando un supuesto en vivo. " +
      "Sus estudiantes aprenden a documentar celdas antes que a formatearlas.",
  },
  {
    id: "gabriela-suazo",
    name: "Gabriela Suazo",
    title: "M.Sc. en Comunicación Estratégica",
    role: "Coordinadora de Mercadotecnia",
    area: "creatividad",
    programs: ["mercadotecnia", "administracion-de-empresas", "diseno-digital"],
    email: "g.suazo@aurea.example",
    office: "Centro de Innovación, ala sur",
    hours: "Jueves, 13:00 – 16:00",
    education: ["M.Sc. en Comunicación Estratégica", "Licenciada en Mercadotecnia"],
    courses: ["Gestión de Marca", "Taller de Agencia I y II", "Estrategia de Medios"],
    research: "Construcción de marca en mercados locales y medición de campañas de bajo presupuesto.",
    publications: ["Atribución de campañas con presupuestos por debajo del umbral estadístico (2026)"],
    bio:
      "Dirige el taller de agencia, donde veintiséis marcas locales han sido atendidas por " +
      "equipos de estudiantes con presupuesto real y métricas acordadas por escrito.",
  },
  {
    id: "andres-portillo",
    name: "Andrés Portillo",
    title: "M.F.A. en Diseño",
    role: "Coordinador de Diseño Digital",
    area: "creatividad",
    programs: ["diseno-digital", "mercadotecnia"],
    email: "a.portillo@aurea.example",
    office: "Centro de Innovación, taller 2",
    hours: "Lunes y viernes, 14:00 – 17:00",
    education: ["M.F.A. en Diseño", "Licenciado en Diseño Gráfico"],
    courses: ["Tipografía I y II", "Sistemas de Diseño", "Dirección de Arte"],
    research: "Tipografía para pantalla y sistemas de diseño accesibles.",
    publications: ["Legibilidad de familias variables en interfaces densas (2025)"],
    bio:
      "Sostiene la crítica de taller de los viernes desde hace nueve años. Ha visto pasar " +
      "cuatrocientos portafolios y sigue empezando cada revisión por la tipografía.",
  },
  {
    id: "ines-carrillo",
    name: "Inés Carrillo",
    title: "M.Sc. en Psicología Educativa",
    role: "Coordinadora de Psicología y Bienestar Estudiantil",
    area: "salud",
    programs: ["psicologia", "bachillerato-ciencias-humanidades", "btp-administracion"],
    email: "i.carrillo@aurea.example",
    office: "Bienestar Estudiantil, planta baja",
    hours: "Lunes a viernes, 8:00 – 12:00",
    education: ["M.Sc. en Psicología Educativa", "Licenciada en Psicología", "Formación en intervención en crisis"],
    courses: ["Psicología Educativa", "Teorías y Técnicas de Entrevista", "Seminario de Casos I"],
    research: "Acompañamiento psicoeducativo en la transición de educación media a superior.",
    publications: [
      "La transición de duodécimo grado al primer período universitario (2026)",
      "Protocolos de derivación en instituciones educativas (2024)",
    ],
    bio:
      "Coordina al mismo tiempo la carrera y el servicio de bienestar, y sostiene que la " +
      "segunda función es la que mantiene honesta a la primera.",
  },
  {
    id: "marcela-fuentes",
    name: "Marcela Fuentes",
    title: "M.Sc. en Educación",
    role: "Directora de Educación Media",
    area: "general",
    programs: ["bachillerato-ciencias-humanidades", "psicologia"],
    email: "m.fuentes@aurea.example",
    office: "Edificio de Educación Media, dirección",
    hours: "Lunes a viernes, 7:00 – 10:00",
    education: ["M.Sc. en Educación", "Licenciada en Pedagogía"],
    courses: ["Metodología de la Investigación", "Proyecto de Graduación", "Orientación Vocacional"],
    research: "Evaluación formativa y proyectos de investigación en educación media.",
    publications: ["El proyecto de graduación como instrumento de evaluación auténtica (2025)"],
    bio:
      "Dirige los tres bachilleratos. Conoce por nombre a los seiscientos estudiantes de " +
      "educación media, lo cual, insiste, no es una virtud sino el trabajo.",
  },
  {
    id: "rodrigo-alvarenga",
    name: "Rodrigo Alvarenga",
    title: "Licenciado en Física",
    role: "Docente de Ciencias · Educación Media",
    area: "general",
    programs: ["bachillerato-ciencias-humanidades", "btp-informatica"],
    email: "r.alvarenga@aurea.example",
    office: "Laboratorio de Ciencias A",
    hours: "Martes y jueves, 11:00 – 13:00",
    education: ["Licenciado en Física", "Diplomado en didáctica de las ciencias"],
    courses: ["Física", "Física Aplicada", "Jornada Científica"],
    research: "Didáctica experimental con materiales de bajo costo.",
    publications: ["Cuarenta experimentos de física con material recuperado (2024)"],
    bio:
      "Organiza la Jornada Científica desde 2016. Su laboratorio funciona con equipo que " +
      "en buena parte construyeron los propios estudiantes.",
  },
  {
    id: "lucia-mejia",
    name: "Lucía Mejía",
    title: "M.A. en Literatura Hispanoamericana",
    role: "Docente de Lenguaje · Educación Media",
    area: "general",
    programs: ["bachillerato-ciencias-humanidades", "btp-administracion"],
    email: "l.mejia@aurea.example",
    office: "Edificio de Educación Media, sala de docentes",
    hours: "Miércoles, 9:00 – 12:00",
    education: ["M.A. en Literatura Hispanoamericana", "Licenciada en Letras"],
    courses: ["Español y Literatura I, II y III", "Redacción Académica"],
    research: "Escritura académica en la transición a la educación superior.",
    publications: ["Errores frecuentes de escritura en el primer período universitario (2026)"],
    bio:
      "Asesora al equipo de debate en construcción de argumento. Corrige a mano y devuelve " +
      "los trabajos en menos de una semana.",
  },
  {
    id: "oscar-benitez",
    name: "Óscar Benítez",
    title: "M.Sc. en Redes y Telecomunicaciones",
    role: "Docente e ingeniero de infraestructura",
    area: "tecnologia",
    programs: ["ingenieria-en-sistemas", "btp-informatica"],
    email: "o.benitez@aurea.example",
    office: "Edificio de Ingeniería, laboratorio de redes",
    hours: "Viernes, 14:00 – 17:00",
    education: ["M.Sc. en Redes y Telecomunicaciones", "Ingeniero en Sistemas"],
    courses: ["Redes de Computadoras", "Computación en la Nube", "Seguridad de la Información"],
    research: "Redes resilientes y continuidad de servicio en infraestructura educativa.",
    publications: ["Diseño de red para campus con conectividad intermitente (2025)"],
    bio:
      "Mantiene la red del campus y la usa como laboratorio: sus estudiantes diagnostican " +
      "incidencias reales, con supervisión y sin acceso a producción.",
  },
];

export const facultyById = (id) => faculty.find((person) => person.id === id);

/* ------------------------------------------------------------ authorities */

export const authorities = [
  {
    name: "Elena Villalta",
    title: "M.Sc. en Gestión Educativa",
    role: "Rectora",
    since: "2019",
    text: "Responsable de la conducción general de la institución y de la relación con el consejo directivo.",
  },
  {
    name: "Fernando Cáceres",
    title: "Ph.D. en Educación Superior",
    role: "Vicerrector Académico",
    since: "2021",
    text: "Conduce la política académica de las licenciaturas, la planta docente y la investigación.",
  },
  {
    name: "Marcela Fuentes",
    title: "M.Sc. en Educación",
    role: "Directora de Educación Media",
    since: "2016",
    text: "Dirige los tres bachilleratos, la planta docente de media y el acompañamiento familiar.",
  },
  {
    name: "Adriana Rivas",
    title: "Licenciada en Administración",
    role: "Directora de Admisiones",
    since: "2022",
    text: "Coordina el proceso de admisión de los dos niveles, las visitas y la orientación a familias.",
  },
  {
    name: "Julio Meraz",
    title: "M.B.A.",
    role: "Director Administrativo y Financiero",
    since: "2018",
    text: "Finanzas institucionales, becas, infraestructura y servicios del campus.",
  },
  {
    name: "Inés Carrillo",
    title: "M.Sc. en Psicología Educativa",
    role: "Directora de Bienestar Estudiantil",
    since: "2020",
    text: "Orientación, salud mental, inclusión, accesibilidad y vida estudiantil.",
  },
];

/* ---------------------------------------------------------------- offices */

/**
 * The institutional directory.
 *
 * Ordered by how often a real portal gets the visit, not by the organigram.
 * Admissions and Registro are first because that is what the search box is
 * used for; Rectoría is further down because nobody writes to a rector to ask
 * for a certificate.
 */
export const offices = [
  {
    id: "admisiones",
    name: "Admisiones",
    lead: "Adriana Rivas · Directora",
    does: "Solicitudes, requisitos, pruebas de admisión, visitas al campus y orientación a familias.",
    email: "admisiones@aurea.example",
    phone: "+504 0000-0010",
    place: "Edificio Administrativo, planta baja",
    hours: "Lunes a viernes 7:30 – 17:00 · Sábados 8:00 – 12:00",
  },
  {
    id: "registro",
    name: "Registro Académico",
    lead: "Sandra Portillo · Jefa de Registro",
    does: "Matrícula, historial académico, certificaciones, equivalencias, constancias y títulos.",
    email: "registro@aurea.example",
    phone: "+504 0000-0011",
    place: "Edificio Administrativo, planta baja",
    hours: "Lunes a viernes 8:00 – 16:00",
  },
  {
    id: "finanzas",
    name: "Finanzas Estudiantiles",
    lead: "Julio Meraz · Director",
    does: "Aranceles, planes de pago, estados de cuenta, reprogramaciones y convenios empresariales.",
    email: "finanzas@aurea.example",
    phone: "+504 0000-0012",
    place: "Edificio Administrativo, segundo nivel",
    hours: "Lunes a viernes 8:00 – 16:00",
  },
  {
    id: "bienestar",
    name: "Bienestar Estudiantil",
    lead: "Inés Carrillo · Directora",
    does: "Becas, orientación, atención psicológica, inclusión, accesibilidad y clubes.",
    email: "bienestar@aurea.example",
    phone: "+504 0000-0013",
    place: "Edificio de Servicios, planta baja",
    hours: "Lunes a viernes 7:30 – 16:30",
  },
  {
    id: "media",
    name: "Dirección de Educación Media",
    lead: "Marcela Fuentes · Directora",
    does: "Bachilleratos, docentes guía, disciplina, comunicación con familias y proyectos de graduación.",
    email: "media@aurea.example",
    phone: "+504 0000-0014",
    place: "Edificio de Educación Media",
    hours: "Lunes a viernes 7:00 – 15:00",
  },
  {
    id: "academica",
    name: "Dirección Académica · Universidad",
    lead: "Fernando Cáceres · Vicerrector",
    does: "Planes de estudio, planta docente, calendario académico y coordinaciones de carrera.",
    email: "academica@aurea.example",
    phone: "+504 0000-0015",
    place: "Edificio Académico, tercer nivel",
    hours: "Lunes a viernes 8:00 – 16:00",
  },
  {
    id: "biblioteca",
    name: "Biblioteca y Repositorio",
    lead: "Norma Andino · Jefa de Biblioteca",
    does: "Préstamo, bases de datos, repositorio institucional, salas de estudio y formación de usuarios.",
    email: "biblioteca@aurea.example",
    phone: "+504 0000-0016",
    place: "Edificio de Biblioteca",
    hours: "Lunes a viernes 7:00 – 20:00 · Sábados 8:00 – 14:00",
  },
  {
    id: "tecnologia",
    name: "Tecnología y Soporte",
    lead: "Óscar Benítez · Coordinador",
    does: "Cuentas institucionales, campus virtual, laboratorios, red del campus y soporte a usuarios.",
    email: "soporte@aurea.example",
    phone: "+504 0000-0017",
    place: "Edificio de Ingeniería, planta baja",
    hours: "Lunes a viernes 7:00 – 19:00",
  },
  {
    id: "internacional",
    name: "Relaciones Internacionales",
    lead: "Claudia Ferrera · Coordinadora",
    does: "Movilidad académica, convenios, estudiantes internacionales, visa y orientación.",
    email: "internacional@aurea.example",
    phone: "+504 0000-0018",
    place: "Edificio Académico, segundo nivel",
    hours: "Lunes a viernes 9:00 – 15:00",
  },
  {
    id: "empleabilidad",
    name: "Empleabilidad y Egresados",
    lead: "Mario Zúniga · Coordinador",
    does: "Bolsa de empleo, prácticas profesionales, empresas aliadas, red de egresados y educación continua.",
    email: "egresados@aurea.example",
    phone: "+504 0000-0019",
    place: "Centro de Innovación, ala sur",
    hours: "Lunes a viernes 8:00 – 16:00",
  },
  {
    id: "rectoria",
    name: "Rectoría",
    lead: "Elena Villalta · Rectora",
    does: "Conducción institucional, relación con el consejo directivo y representación externa.",
    email: "rectoria@aurea.example",
    phone: "+504 0000-0001",
    place: "Edificio Administrativo, tercer nivel",
    hours: "Con cita previa",
  },
  {
    id: "comunicacion",
    name: "Comunicación Institucional",
    lead: "Rebeca Núñez · Jefa de Comunicación",
    does: "Noticias, comunicados, redes sociales, prensa y solicitudes de uso de imagen institucional.",
    email: "comunicacion@aurea.example",
    phone: "+504 0000-0020",
    place: "Edificio Administrativo, segundo nivel",
    hours: "Lunes a viernes 8:00 – 16:00",
  },
];

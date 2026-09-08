/**
 * The academic catalogue — the model the whole portal turns around.
 *
 * A programme is the single content type that appears in the most places: the
 * finder, the mega menu, the homepage strip, its own page, the cost
 * calculator, the scholarship simulator, the global search and the sitemap.
 * So it is described once, here, in the shape a CMS would hold it, and every
 * renderer reads the same object. Adding a tenth programme means adding one
 * entry to this array; nothing else in the build needs to know.
 *
 * The taxonomies (`levels`, `modalities`, `areas`) are arrays rather than
 * single values on purpose. A Bachillerato Técnico Profesional genuinely *is*
 * both educación media and formación técnica, and a filter that forces it into
 * one bucket hides it from half the people looking for it.
 *
 * Everything here is invented. The plans of study are plausible rather than
 * real, and no course, credit count, cost or professor corresponds to an
 * actual institution.
 */

/* A course line. The tuple would be shorter; the object survives a CMS. */
const c = (name, credits = 4) => ({ name, credits });

/* ------------------------------------------------------------- taxonomies */

export const levels = [
  { id: "media", label: "Educación Media", short: "Media" },
  { id: "tecnico", label: "Técnico", short: "Técnico" },
  { id: "licenciatura", label: "Licenciatura", short: "Licenciatura" },
];

export const modalities = [
  { id: "presencial", label: "Presencial" },
  { id: "virtual", label: "Virtual" },
  { id: "semipresencial", label: "Semipresencial" },
];

export const areas = [
  { id: "tecnologia", label: "Tecnología" },
  { id: "negocios", label: "Negocios" },
  { id: "salud", label: "Salud" },
  { id: "creatividad", label: "Creatividad" },
  { id: "sociales", label: "Ciencias Sociales" },
];

export const labelOf = (collection, id) => collection.find((item) => item.id === id)?.label ?? id;

/* --------------------------------------------------------------- programmes */

export const programs = [
  /* ------------------------------------------------------ educación media */
  {
    slug: "bachillerato-ciencias-humanidades",
    name: "Bachillerato en Ciencias y Humanidades",
    short: "Ciencias y Humanidades",
    levels: ["media"],
    degree: "Bachiller en Ciencias y Humanidades",
    areas: ["sociales"],
    modalities: ["presencial"],
    duration: "3 años",
    durationNote: "Décimo, undécimo y duodécimo grado",
    campus: "Central",
    shift: "Matutina y vespertina",
    plate: "aula",
    tagline: "La base amplia, para quien todavía no quiere cerrar puertas.",
    summary:
      "Formación general sólida en ciencias, matemática, lenguaje y ciencias sociales, " +
      "pensada para estudiantes que continuarán a la universidad.",
    description:
      "El Bachillerato en Ciencias y Humanidades es el programa de educación media más " +
      "amplio de AUREA. No especializa: prepara. Tres años de matemática, ciencias " +
      "naturales, lenguaje, ciencias sociales e inglés, con carga creciente de " +
      "investigación y de proyectos.\n\n" +
      "Está diseñado para el estudiante de quince años que sabe que quiere seguir " +
      "estudiando pero no sabe qué. Al terminar duodécimo grado, el egresado puede " +
      "postular a cualquiera de las seis licenciaturas de AUREA sin cursos de nivelación, " +
      "y su expediente es válido para cualquier universidad del país.",
    profile: [
      "Comprende y produce textos académicos en español e inglés.",
      "Aplica el método científico en proyectos de laboratorio y de campo.",
      "Analiza problemas sociales con evidencia y no con opinión.",
      "Sostiene un proyecto de investigación de un año y lo defiende ante un jurado.",
      "Utiliza herramientas digitales de trabajo colaborativo y de análisis de datos.",
    ],
    curriculum: [
      {
        term: "Décimo grado",
        label: "Primer año",
        courses: [
          c("Matemática I", 5),
          c("Español y Literatura I", 5),
          c("Biología", 4),
          c("Historia de Honduras", 3),
          c("Inglés I", 4),
          c("Informática Aplicada", 3),
          c("Educación Física", 2),
          c("Formación Ciudadana", 2),
        ],
      },
      {
        term: "Undécimo grado",
        label: "Segundo año",
        courses: [
          c("Matemática II", 5),
          c("Español y Literatura II", 4),
          c("Química", 4),
          c("Geografía Humana", 3),
          c("Inglés II", 4),
          c("Metodología de la Investigación", 3),
          c("Arte y Expresión", 2),
          c("Educación Física", 2),
        ],
      },
      {
        term: "Duodécimo grado",
        label: "Tercer año",
        courses: [
          c("Matemática III", 5),
          c("Física", 4),
          c("Filosofía y Ética", 3),
          c("Sociología", 3),
          c("Inglés III", 4),
          c("Proyecto de Graduación", 6),
          c("Orientación Vocacional", 2),
          c("Educación Física", 2),
        ],
      },
    ],
    requirements: [
      "Certificado de noveno grado o constancia de estar cursándolo.",
      "Partida de nacimiento y copia de identidad del estudiante.",
      "Identidad de padre, madre o tutor.",
      "Dos fotografías tamaño carné.",
      "Prueba de ubicación de matemática y español.",
      "Entrevista familiar con el equipo de orientación.",
    ],
    careers: [
      "Continuación a licenciatura en cualquier área",
      "Programas universitarios en el extranjero",
      "Servicio social y voluntariado formativo",
      "Programas de nivelación técnica",
    ],
    costs: { enrollment: 6800, monthly: 3450, months: 10, kind: "mensual" },
    scholarships: ["excelencia", "socioeconomica", "deportiva", "artistica"],
    faculty: ["marcela-fuentes", "rodrigo-alvarenga", "ines-carrillo"],
    highlights: [
      { value: "24", label: "estudiantes por sección" },
      { value: "3", label: "laboratorios propios" },
      { value: "100 %", label: "continúa a educación superior" },
    ],
    faq: [
      {
        q: "¿Puedo cambiarme a un bachillerato técnico después del décimo grado?",
        a: "Sí. El décimo grado es común a los tres bachilleratos, así que el cambio se " +
          "resuelve con una solicitud en Registro antes del cierre de matrícula del " +
          "segundo año, sin cursos adicionales.",
      },
      {
        q: "¿El bachillerato incluye la preparación para la prueba de admisión universitaria?",
        a: "Duodécimo grado incluye Orientación Vocacional y un ciclo de preparación de " +
          "seis semanas. El egresado de AUREA que continúa a una licenciatura de la " +
          "institución queda exento de la prueba de admisión.",
      },
      {
        q: "¿Hay jornada vespertina?",
        a: "Sí, con el mismo plan de estudios y la misma planta docente. Los laboratorios " +
          "y el centro deportivo operan hasta las 18:30.",
      },
    ],
  },
  {
    slug: "btp-informatica",
    name: "Bachillerato Técnico Profesional en Informática",
    short: "BTP en Informática",
    levels: ["media", "tecnico"],
    degree: "Bachiller Técnico Profesional en Informática",
    areas: ["tecnologia"],
    modalities: ["presencial", "semipresencial"],
    duration: "3 años",
    durationNote: "Con práctica profesional en el tercer año",
    campus: "Central",
    shift: "Matutina",
    plate: "computo",
    tagline: "Sale de duodécimo grado sabiendo programar. No es una figura retórica.",
    summary:
      "Formación media con especialización técnica en desarrollo de software, redes y " +
      "soporte, con práctica profesional obligatoria y certificación técnica.",
    description:
      "El BTP en Informática entrega dos cosas al mismo tiempo: el título de educación " +
      "media que abre la universidad, y una competencia técnica que ya vale en el " +
      "mercado laboral. Los tres años combinan el tronco común de ciencias y humanidades " +
      "con seiscientas horas de taller.\n\n" +
      "El tercer año se cursa mitad en aula y mitad en una empresa aliada. Es una " +
      "práctica real, evaluada por un tutor de la empresa y por un docente de AUREA, y " +
      "es requisito de graduación. Un tercio de los egresados recibe oferta de la empresa " +
      "donde practicó.",
    profile: [
      "Desarrolla aplicaciones web con HTML, CSS, JavaScript y un lenguaje de servidor.",
      "Diseña y consulta bases de datos relacionales.",
      "Instala, configura y documenta redes locales pequeñas.",
      "Diagnostica y resuelve incidencias de soporte de primer y segundo nivel.",
      "Trabaja con control de versiones y en equipo sobre un repositorio compartido.",
      "Documenta su trabajo en español técnico correcto.",
    ],
    curriculum: [
      {
        term: "Décimo grado",
        label: "Primer año",
        courses: [
          c("Matemática I", 5),
          c("Español y Literatura I", 4),
          c("Inglés Técnico I", 4),
          c("Fundamentos de Programación", 6),
          c("Arquitectura de Computadoras", 4),
          c("Ofimática Avanzada", 3),
          c("Educación Física", 2),
        ],
      },
      {
        term: "Undécimo grado",
        label: "Segundo año",
        courses: [
          c("Matemática II", 5),
          c("Física Aplicada", 4),
          c("Inglés Técnico II", 4),
          c("Programación Orientada a Objetos", 6),
          c("Bases de Datos", 5),
          c("Redes y Conectividad", 5),
          c("Diseño de Interfaces", 3),
        ],
      },
      {
        term: "Duodécimo grado",
        label: "Tercer año",
        courses: [
          c("Desarrollo Web Full Stack", 6),
          c("Soporte y Mantenimiento", 4),
          c("Seguridad Informática", 4),
          c("Gestión de Proyectos de TI", 3),
          c("Emprendimiento Tecnológico", 3),
          c("Práctica Profesional", 8),
          c("Proyecto de Graduación", 5),
        ],
      },
    ],
    requirements: [
      "Certificado de noveno grado o constancia de estar cursándolo.",
      "Partida de nacimiento y copia de identidad del estudiante.",
      "Identidad de padre, madre o tutor.",
      "Prueba de ubicación de matemática y razonamiento lógico.",
      "Entrevista con la coordinación técnica.",
      "Carta de compromiso de práctica profesional firmada por el tutor.",
    ],
    careers: [
      "Desarrollador junior en empresas de software",
      "Soporte técnico y administración de sistemas",
      "Técnico de redes y conectividad",
      "Continuación a Ingeniería en Sistemas con equivalencias",
      "Trabajo independiente y desarrollo por proyecto",
    ],
    costs: { enrollment: 7400, monthly: 3950, months: 10, kind: "mensual" },
    scholarships: ["excelencia", "socioeconomica", "liderazgo"],
    faculty: ["daniel-espinoza", "karla-medrano", "rodrigo-alvarenga"],
    highlights: [
      { value: "600 h", label: "de taller técnico" },
      { value: "1 de 3", label: "recibe oferta de su práctica" },
      { value: "20", label: "empresas aliadas" },
    ],
    faq: [
      {
        q: "¿La práctica profesional es remunerada?",
        a: "Depende de la empresa. AUREA no la condiciona a que lo sea: la práctica es " +
          "formativa y su evaluación es académica. Alrededor de la mitad de las empresas " +
          "aliadas ofrece un estipendio.",
      },
      {
        q: "¿Qué equipo necesita el estudiante?",
        a: "Ninguno propio. El laboratorio tiene una estación por estudiante y acceso " +
          "fuera de horario. Quien tenga computadora portátil puede usarla; el software " +
          "del programa es libre o tiene licencia educativa.",
      },
      {
        q: "¿Cuánto se convalida si continúo a Ingeniería en Sistemas?",
        a: "Hasta cuatro asignaturas del primer año, previa evaluación de equivalencias en " +
          "Registro Académico.",
      },
    ],
  },
  {
    slug: "btp-administracion",
    name: "Bachillerato Técnico Profesional en Administración",
    short: "BTP en Administración",
    levels: ["media", "tecnico"],
    degree: "Bachiller Técnico Profesional en Administración de Empresas",
    areas: ["negocios"],
    modalities: ["presencial"],
    duration: "3 años",
    durationNote: "Con práctica profesional en el tercer año",
    campus: "Central",
    shift: "Matutina y vespertina",
    plate: "carpeta",
    tagline: "Contabilidad, gestión y trato con clientes antes de cumplir dieciocho.",
    summary:
      "Formación media con especialización en contabilidad, gestión administrativa y " +
      "servicio al cliente, con práctica profesional en empresas aliadas.",
    description:
      "El BTP en Administración forma al estudiante que va a trabajar en una oficina " +
      "antes de terminar la universidad, y al que va a montar su propio negocio en lugar " +
      "de buscar empleo. Contabilidad desde el primer año, gestión de inventarios, " +
      "planilla, atención al cliente y una unidad completa de emprendimiento.\n\n" +
      "El proyecto final no es un documento: es un negocio pequeño que el equipo opera " +
      "durante un trimestre dentro del campus, con presupuesto real, registro contable y " +
      "cierre auditado por la coordinación.",
    profile: [
      "Lleva la contabilidad básica de una pequeña empresa.",
      "Elabora planilla, controla inventarios y gestiona compras.",
      "Atiende clientes y resuelve reclamos con protocolo.",
      "Formula un plan de negocio con proyección financiera a doce meses.",
      "Maneja hoja de cálculo a nivel avanzado y sistemas de facturación.",
    ],
    curriculum: [
      {
        term: "Décimo grado",
        label: "Primer año",
        courses: [
          c("Matemática I", 5),
          c("Español y Literatura I", 4),
          c("Inglés I", 4),
          c("Contabilidad General I", 6),
          c("Introducción a la Administración", 4),
          c("Ofimática Avanzada", 3),
          c("Educación Física", 2),
        ],
      },
      {
        term: "Undécimo grado",
        label: "Segundo año",
        courses: [
          c("Matemática Financiera", 5),
          c("Contabilidad General II", 6),
          c("Inglés de Negocios", 4),
          c("Gestión de Recursos Humanos", 4),
          c("Legislación Laboral y Mercantil", 4),
          c("Servicio al Cliente", 3),
          c("Estadística Aplicada", 3),
        ],
      },
      {
        term: "Duodécimo grado",
        label: "Tercer año",
        courses: [
          c("Costos y Presupuestos", 5),
          c("Sistemas Contables Digitales", 4),
          c("Mercadeo Básico", 4),
          c("Emprendimiento", 5),
          c("Ética Profesional", 2),
          c("Práctica Profesional", 8),
          c("Proyecto de Graduación", 5),
        ],
      },
    ],
    requirements: [
      "Certificado de noveno grado o constancia de estar cursándolo.",
      "Partida de nacimiento y copia de identidad del estudiante.",
      "Identidad de padre, madre o tutor.",
      "Prueba de ubicación de matemática y comprensión lectora.",
      "Entrevista con la coordinación técnica.",
    ],
    careers: [
      "Asistente administrativo y contable",
      "Auxiliar de planilla y recursos humanos",
      "Atención al cliente y ventas",
      "Emprendimiento propio",
      "Continuación a Administración de Empresas o Finanzas con equivalencias",
    ],
    costs: { enrollment: 7100, monthly: 3750, months: 10, kind: "mensual" },
    scholarships: ["excelencia", "socioeconomica", "liderazgo"],
    faculty: ["patricia-zelaya", "hector-lainez", "ines-carrillo"],
    highlights: [
      { value: "1 trimestre", label: "operando un negocio real" },
      { value: "480 h", label: "de práctica" },
      { value: "5", label: "asignaturas convalidables" },
    ],
    faq: [
      {
        q: "¿Se necesita conocimiento previo de contabilidad?",
        a: "No. Contabilidad General I parte de cero y es la asignatura con más horas de " +
          "acompañamiento del primer año.",
      },
      {
        q: "¿El negocio del proyecto final requiere inversión de la familia?",
        a: "No. La institución asigna un capital semilla por equipo y el cierre devuelve " +
          "ese capital. Un resultado negativo no afecta la nota si el registro contable " +
          "es correcto.",
      },
    ],
  },

  /* --------------------------------------------------- educación superior */
  {
    slug: "ingenieria-en-sistemas",
    name: "Ingeniería en Sistemas",
    short: "Ing. en Sistemas",
    levels: ["licenciatura"],
    degree: "Licenciatura",
    areas: ["tecnologia"],
    modalities: ["presencial", "virtual"],
    duration: "4 años",
    durationNote: "Ocho períodos académicos",
    campus: "Central",
    shift: "Matutina, vespertina y nocturna",
    plate: "codigo",
    featured: true,
    tagline: "Software que funciona en producción, no solo en la defensa de tesis.",
    summary:
      "Formación en desarrollo de software, datos, infraestructura y gestión de " +
      "proyectos tecnológicos, con proyecto integrador en cada año.",
    description:
      "La Ingeniería en Sistemas de AUREA está construida alrededor de una idea simple: " +
      "un ingeniero se forma escribiendo software que otras personas usan. Cada año " +
      "cierra con un proyecto integrador que no se entrega en papel — se despliega, se " +
      "documenta y se defiende con métricas de uso.\n\n" +
      "Los dos primeros años cubren los fundamentos que no cambian: matemática discreta, " +
      "estructuras de datos, algoritmos, bases de datos, redes. Los dos últimos se " +
      "abren en tres itinerarios — desarrollo, datos e infraestructura — y se cursan " +
      "junto al Centro de Inteligencia Artificial, donde catorce estudiantes de grado " +
      "trabajan actualmente en proyectos con financiamiento.",
    profile: [
      "Diseña, construye y despliega aplicaciones completas, del modelo de datos a la interfaz.",
      "Modela y optimiza bases de datos relacionales y no relacionales.",
      "Diseña arquitecturas de servicios y las opera en la nube.",
      "Aplica ingeniería de datos y aprendizaje automático a problemas concretos.",
      "Dirige equipos de desarrollo y estima esfuerzo con métodos ágiles.",
      "Evalúa riesgos de seguridad y aplica controles proporcionados.",
    ],
    curriculum: [
      {
        term: "Período I",
        label: "Primer año",
        courses: [
          c("Cálculo I", 5),
          c("Álgebra Lineal", 4),
          c("Programación I", 6),
          c("Introducción a la Ingeniería", 3),
          c("Comunicación Profesional", 3),
        ],
      },
      {
        term: "Período II",
        label: "Primer año",
        courses: [
          c("Cálculo II", 5),
          c("Matemática Discreta", 4),
          c("Programación II", 6),
          c("Arquitectura de Computadoras", 4),
          c("Inglés Técnico", 3),
        ],
      },
      {
        term: "Período III",
        label: "Segundo año",
        courses: [
          c("Estructuras de Datos", 6),
          c("Bases de Datos I", 5),
          c("Probabilidad y Estadística", 4),
          c("Sistemas Operativos", 4),
          c("Proyecto Integrador I", 4),
        ],
      },
      {
        term: "Período IV",
        label: "Segundo año",
        courses: [
          c("Algoritmos y Complejidad", 5),
          c("Bases de Datos II", 5),
          c("Redes de Computadoras", 5),
          c("Ingeniería de Software I", 5),
          c("Ética y Sociedad Digital", 2),
        ],
      },
      {
        term: "Período V",
        label: "Tercer año",
        courses: [
          c("Desarrollo Web Avanzado", 6),
          c("Ingeniería de Software II", 5),
          c("Sistemas Distribuidos", 5),
          c("Seguridad de la Información", 4),
          c("Proyecto Integrador II", 4),
        ],
      },
      {
        term: "Período VI",
        label: "Tercer año",
        courses: [
          c("Ingeniería de Datos", 5),
          c("Aprendizaje Automático", 5),
          c("Computación en la Nube", 5),
          c("Gestión de Proyectos de TI", 4),
          c("Electiva de Itinerario I", 4),
        ],
      },
      {
        term: "Período VII",
        label: "Cuarto año",
        courses: [
          c("Arquitectura de Software", 5),
          c("Calidad y Pruebas", 4),
          c("Electiva de Itinerario II", 4),
          c("Emprendimiento Tecnológico", 3),
          c("Práctica Profesional", 8),
        ],
      },
      {
        term: "Período VIII",
        label: "Cuarto año",
        courses: [
          c("Proyecto de Graduación", 10),
          c("Electiva de Itinerario III", 4),
          c("Seminario de Investigación", 3),
          c("Legislación Informática", 3),
        ],
      },
    ],
    requirements: [
      "Título de educación media o constancia de egreso.",
      "Certificado de calificaciones de los tres años de bachillerato.",
      "Identidad o partida de nacimiento.",
      "Prueba de admisión: razonamiento matemático y comprensión lectora.",
      "Entrevista con la coordinación de carrera.",
      "Egresados de AUREA quedan exentos de la prueba de admisión.",
    ],
    careers: [
      "Desarrollo de software y arquitectura de sistemas",
      "Ingeniería de datos y ciencia de datos",
      "Infraestructura, nube y confiabilidad",
      "Seguridad de la información",
      "Dirección de tecnología y gestión de producto",
      "Investigación y posgrado",
    ],
    costs: { enrollment: 9800, perCourse: 2850, coursesTypical: 5, kind: "asignatura" },
    scholarships: ["excelencia", "liderazgo", "socioeconomica"],
    faculty: ["daniel-espinoza", "karla-medrano", "sofia-brenes"],
    highlights: [
      { value: "4", label: "proyectos integradores" },
      { value: "3", label: "itinerarios de especialización" },
      { value: "14", label: "estudiantes en investigación" },
    ],
    faq: [
      {
        q: "¿La modalidad virtual tiene el mismo título?",
        a: "Sí. El título no distingue modalidad. La diferencia está en los laboratorios: " +
          "la modalidad virtual asiste presencialmente cuatro sábados por período para " +
          "las prácticas de redes y de infraestructura.",
      },
      {
        q: "¿Cuántas asignaturas se cursan por período?",
        a: "Cinco es la carga completa y la que asume la calculadora de matrícula. Se " +
          "puede cursar entre tres y seis; más de seis requiere autorización de " +
          "coordinación y promedio superior a 85.",
      },
      {
        q: "¿Se puede trabajar mientras se estudia?",
        a: "La jornada nocturna existe para eso. Alrededor del 40 % de los estudiantes de " +
          "tercer y cuarto año trabaja en el área, con carga reducida de cuatro " +
          "asignaturas.",
      },
      {
        q: "¿Qué son los itinerarios?",
        a: "Tres electivas encadenadas en tercero y cuarto año: Desarrollo de Producto, " +
          "Datos e Inteligencia Artificial, o Infraestructura y Seguridad. Se elige al " +
          "cerrar el Período V y se puede cambiar una vez.",
      },
    ],
  },
  {
    slug: "administracion-de-empresas",
    name: "Administración de Empresas",
    short: "Administración",
    levels: ["licenciatura"],
    degree: "Licenciatura",
    areas: ["negocios"],
    modalities: ["presencial", "virtual", "semipresencial"],
    duration: "4 años",
    durationNote: "Ocho períodos académicos",
    campus: "Central",
    shift: "Matutina, vespertina y nocturna",
    plate: "oficina",
    featured: true,
    tagline: "Dirigir no es supervisar. Se estudia con casos, presupuestos y consecuencias.",
    summary:
      "Formación en gestión, finanzas, operaciones y estrategia, con simulación " +
      "empresarial y consultoría real a pequeñas empresas.",
    description:
      "La licenciatura forma administradores capaces de leer un estado financiero, " +
      "diseñar una operación y decidir con información incompleta, que es la única clase " +
      "de información que existe en una empresa.\n\n" +
      "Desde el quinto período los estudiantes trabajan en el Observatorio Empresarial: " +
      "equipos de tres acompañan durante un semestre a una pequeña empresa real de la " +
      "ciudad, diagnostican, proponen y miden. El informe final se entrega a la empresa, " +
      "no solo al docente.",
    profile: [
      "Interpreta estados financieros y construye proyecciones defendibles.",
      "Diseña procesos operativos y mide su desempeño.",
      "Formula estrategia a partir de análisis competitivo y de datos.",
      "Dirige equipos, negocia y gestiona conflictos.",
      "Evalúa proyectos de inversión con criterios financieros.",
    ],
    curriculum: [
      {
        term: "Período I",
        label: "Primer año",
        courses: [
          c("Introducción a la Administración", 4),
          c("Contabilidad Financiera I", 5),
          c("Matemática Aplicada", 4),
          c("Comunicación Profesional", 3),
          c("Economía General", 4),
        ],
      },
      {
        term: "Período II",
        label: "Primer año",
        courses: [
          c("Contabilidad Financiera II", 5),
          c("Microeconomía", 4),
          c("Estadística Descriptiva", 4),
          c("Comportamiento Organizacional", 4),
          c("Inglés de Negocios I", 3),
        ],
      },
      {
        term: "Período III",
        label: "Segundo año",
        courses: [
          c("Contabilidad de Costos", 5),
          c("Macroeconomía", 4),
          c("Estadística Inferencial", 4),
          c("Derecho Mercantil", 4),
          c("Gestión del Talento Humano", 4),
        ],
      },
      {
        term: "Período IV",
        label: "Segundo año",
        courses: [
          c("Finanzas Corporativas I", 5),
          c("Gestión de Operaciones", 5),
          c("Mercadeo I", 4),
          c("Sistemas de Información Gerencial", 4),
          c("Inglés de Negocios II", 3),
        ],
      },
      {
        term: "Período V",
        label: "Tercer año",
        courses: [
          c("Finanzas Corporativas II", 5),
          c("Cadena de Suministro", 4),
          c("Investigación de Mercados", 4),
          c("Consultoría Empresarial I", 5),
          c("Ética y Responsabilidad Corporativa", 3),
        ],
      },
      {
        term: "Período VI",
        label: "Tercer año",
        courses: [
          c("Dirección Estratégica", 5),
          c("Evaluación de Proyectos", 5),
          c("Analítica de Negocios", 4),
          c("Consultoría Empresarial II", 5),
          c("Electiva de Especialidad I", 4),
        ],
      },
      {
        term: "Período VII",
        label: "Cuarto año",
        courses: [
          c("Simulación Empresarial", 6),
          c("Negocios Internacionales", 4),
          c("Electiva de Especialidad II", 4),
          c("Emprendimiento", 4),
          c("Práctica Profesional", 8),
        ],
      },
      {
        term: "Período VIII",
        label: "Cuarto año",
        courses: [
          c("Proyecto de Graduación", 10),
          c("Gobierno Corporativo", 3),
          c("Electiva de Especialidad III", 4),
          c("Seminario de Integración", 3),
        ],
      },
    ],
    requirements: [
      "Título de educación media o constancia de egreso.",
      "Certificado de calificaciones de los tres años de bachillerato.",
      "Identidad o partida de nacimiento.",
      "Prueba de admisión: razonamiento cuantitativo y comprensión lectora.",
      "Entrevista con la coordinación de carrera.",
    ],
    careers: [
      "Gerencia general y de área",
      "Administración financiera",
      "Operaciones y cadena de suministro",
      "Recursos humanos",
      "Consultoría y emprendimiento",
    ],
    costs: { enrollment: 8900, perCourse: 2450, coursesTypical: 5, kind: "asignatura" },
    scholarships: ["excelencia", "liderazgo", "socioeconomica", "deportiva"],
    faculty: ["patricia-zelaya", "hector-lainez", "gabriela-suazo"],
    highlights: [
      { value: "2 semestres", label: "de consultoría real" },
      { value: "38", label: "empresas acompañadas" },
      { value: "3", label: "modalidades disponibles" },
    ],
    faq: [
      {
        q: "¿Qué diferencia hay con Finanzas?",
        a: "Administración forma para dirigir una organización completa; Finanzas " +
          "profundiza en valoración, riesgo y mercados. Comparten los primeros dos " +
          "períodos, así que el cambio antes del tercero no cuesta tiempo.",
      },
      {
        q: "¿La modalidad semipresencial cómo funciona?",
        a: "Clases en línea entre semana y una jornada presencial cada quince días, " +
          "sábados de 8:00 a 15:00. La consultoría empresarial es presencial en ambas " +
          "modalidades.",
      },
      {
        q: "¿Quién elige la empresa de la consultoría?",
        a: "El Observatorio Empresarial mantiene una cartera de empresas que solicitan " +
          "acompañamiento. El equipo escoge de esa cartera y puede proponer una propia si " +
          "cumple los criterios de tamaño y de disponibilidad.",
      },
    ],
  },
  {
    slug: "mercadotecnia",
    name: "Mercadotecnia",
    short: "Mercadotecnia",
    levels: ["licenciatura"],
    degree: "Licenciatura",
    areas: ["negocios", "creatividad"],
    modalities: ["presencial", "virtual"],
    duration: "4 años",
    durationNote: "Ocho períodos académicos",
    campus: "Central",
    shift: "Vespertina y nocturna",
    plate: "campana",
    tagline: "Marcas que la gente recuerda, medidas con números que se sostienen.",
    summary:
      "Estrategia de marca, comportamiento del consumidor, analítica digital y " +
      "producción de campañas, con clientes reales desde el tercer año.",
    description:
      "Mercadotecnia en AUREA se estudia con dos manos: la que construye la idea y la " +
      "que la mide. El programa parte del comportamiento del consumidor y de la " +
      "investigación de mercados, y solo después llega a la campaña — porque una " +
      "campaña sin diagnóstico es decoración cara.\n\n" +
      "Desde el Período V los equipos atienden clientes reales a través del taller de " +
      "agencia: una marca local, un presupuesto acotado, una métrica acordada. El " +
      "portafolio con el que el egresado sale a buscar trabajo son esos casos.",
    profile: [
      "Investiga mercados con métodos cualitativos y cuantitativos.",
      "Construye posicionamiento y arquitectura de marca.",
      "Planifica y ejecuta campañas en medios digitales y tradicionales.",
      "Mide desempeño con analítica y atribuye resultados.",
      "Dirige producción de contenido y coordina equipos creativos.",
    ],
    curriculum: [
      {
        term: "Período I",
        label: "Primer año",
        courses: [
          c("Fundamentos de Mercadotecnia", 4),
          c("Comunicación Profesional", 3),
          c("Economía General", 4),
          c("Matemática Aplicada", 4),
          c("Cultura Visual", 3),
        ],
      },
      {
        term: "Período II",
        label: "Primer año",
        courses: [
          c("Comportamiento del Consumidor", 5),
          c("Estadística Descriptiva", 4),
          c("Redacción Publicitaria", 4),
          c("Diseño para Mercadotecnia", 4),
          c("Inglés de Negocios I", 3),
        ],
      },
      {
        term: "Período III",
        label: "Segundo año",
        courses: [
          c("Investigación de Mercados I", 5),
          c("Gestión de Marca", 5),
          c("Contabilidad para Mercadotecnia", 4),
          c("Fotografía y Producción Digital", 4),
          c("Estadística Inferencial", 4),
        ],
      },
      {
        term: "Período IV",
        label: "Segundo año",
        courses: [
          c("Investigación de Mercados II", 5),
          c("Mercadotecnia Digital", 5),
          c("Canales y Distribución", 4),
          c("Producción Audiovisual", 4),
          c("Inglés de Negocios II", 3),
        ],
      },
      {
        term: "Período V",
        label: "Tercer año",
        courses: [
          c("Taller de Agencia I", 6),
          c("Analítica Digital", 5),
          c("Precio y Rentabilidad", 4),
          c("Mercadotecnia de Servicios", 4),
          c("Ética Publicitaria", 2),
        ],
      },
      {
        term: "Período VI",
        label: "Tercer año",
        courses: [
          c("Taller de Agencia II", 6),
          c("Estrategia de Medios", 5),
          c("Comercio Electrónico", 4),
          c("Relaciones Públicas", 4),
          c("Electiva de Especialidad I", 4),
        ],
      },
      {
        term: "Período VII",
        label: "Cuarto año",
        courses: [
          c("Dirección de Mercadotecnia", 5),
          c("Mercadotecnia Internacional", 4),
          c("Electiva de Especialidad II", 4),
          c("Emprendimiento de Marca", 4),
          c("Práctica Profesional", 8),
        ],
      },
      {
        term: "Período VIII",
        label: "Cuarto año",
        courses: [
          c("Proyecto de Graduación", 10),
          c("Portafolio Profesional", 4),
          c("Electiva de Especialidad III", 4),
          c("Seminario de Tendencias", 3),
        ],
      },
    ],
    requirements: [
      "Título de educación media o constancia de egreso.",
      "Certificado de calificaciones de los tres años de bachillerato.",
      "Identidad o partida de nacimiento.",
      "Prueba de admisión: comprensión lectora y razonamiento verbal.",
      "Entrevista con la coordinación de carrera.",
    ],
    careers: [
      "Estrategia y gestión de marca",
      "Mercadotecnia digital y analítica",
      "Investigación de mercados",
      "Dirección creativa y producción de contenido",
      "Comercio electrónico",
    ],
    costs: { enrollment: 8600, perCourse: 2380, coursesTypical: 5, kind: "asignatura" },
    scholarships: ["excelencia", "artistica", "liderazgo", "socioeconomica"],
    faculty: ["gabriela-suazo", "andres-portillo", "patricia-zelaya"],
    highlights: [
      { value: "2 años", label: "de taller de agencia" },
      { value: "26", label: "marcas atendidas" },
      { value: "1", label: "portafolio al graduarse" },
    ],
    faq: [
      {
        q: "¿Se necesita saber diseñar?",
        a: "No al entrar. Diseño para Mercadotecnia y Fotografía y Producción Digital " +
          "cubren la parte de producción. La dirección creativa es una competencia del " +
          "programa; la ejecución gráfica avanzada es de Diseño Digital.",
      },
      {
        q: "¿Los clientes del taller de agencia pagan?",
        a: "Aportan un presupuesto de producción, no honorarios. El taller es formativo y " +
          "el criterio de selección de clientes es que el caso enseñe algo.",
      },
    ],
  },
  {
    slug: "diseno-digital",
    name: "Diseño Digital",
    short: "Diseño Digital",
    levels: ["licenciatura"],
    degree: "Licenciatura",
    areas: ["creatividad", "tecnologia"],
    modalities: ["presencial", "semipresencial"],
    duration: "4 años",
    durationNote: "Ocho períodos académicos",
    campus: "Central",
    shift: "Matutina y vespertina",
    plate: "estudio",
    featured: true,
    tagline: "Diseño que se usa: producto, interfaz, movimiento y marca.",
    summary:
      "Diseño de producto digital, identidad, tipografía, movimiento y desarrollo " +
      "front-end, con crítica de taller semanal y portafolio evaluado cada año.",
    description:
      "Diseño Digital forma diseñadores que entienden el medio en el que trabajan. Se " +
      "estudia tipografía y color con el rigor de una escuela de diseño, y se estudia " +
      "HTML, CSS y accesibilidad con el rigor de una carrera técnica, porque un diseño " +
      "que no se puede construir no es un diseño: es una imagen.\n\n" +
      "El taller es el centro del programa. Cada semana hay crítica abierta, y cada año " +
      "cierra con una revisión de portafolio ante un jurado que incluye profesionales " +
      "externos. El egresado sale con veinte piezas defendidas, no con un diploma.",
    profile: [
      "Diseña interfaces y sistemas de diseño coherentes y accesibles.",
      "Construye identidad visual completa y la documenta.",
      "Domina tipografía, composición y color con criterio profesional.",
      "Produce animación e imagen en movimiento para medios digitales.",
      "Implementa sus diseños en HTML, CSS y componentes.",
      "Investiga usuarios y evalúa usabilidad con métodos establecidos.",
    ],
    curriculum: [
      {
        term: "Período I",
        label: "Primer año",
        courses: [
          c("Fundamentos del Diseño", 5),
          c("Dibujo y Representación", 4),
          c("Historia del Diseño", 3),
          c("Tipografía I", 5),
          c("Herramientas Digitales", 3),
        ],
      },
      {
        term: "Período II",
        label: "Primer año",
        courses: [
          c("Color y Composición", 5),
          c("Tipografía II", 5),
          c("Fotografía", 4),
          c("Introducción al Código", 4),
          c("Comunicación Profesional", 3),
        ],
      },
      {
        term: "Período III",
        label: "Segundo año",
        courses: [
          c("Identidad de Marca", 6),
          c("Diseño de Interfaces I", 6),
          c("Maquetación Web", 5),
          c("Ilustración Digital", 4),
          c("Teoría de la Imagen", 3),
        ],
      },
      {
        term: "Período IV",
        label: "Segundo año",
        courses: [
          c("Diseño de Interfaces II", 6),
          c("Sistemas de Diseño", 5),
          c("Investigación de Usuarios", 4),
          c("Animación Digital", 5),
          c("Accesibilidad Digital", 4),
        ],
      },
      {
        term: "Período V",
        label: "Tercer año",
        courses: [
          c("Taller de Producto I", 6),
          c("Diseño Editorial", 5),
          c("Front-End para Diseñadores", 5),
          c("Prototipado Avanzado", 4),
          c("Ética del Diseño", 2),
        ],
      },
      {
        term: "Período VI",
        label: "Tercer año",
        courses: [
          c("Taller de Producto II", 6),
          c("Motion Graphics", 5),
          c("Diseño de Servicios", 4),
          c("Gestión de Proyectos Creativos", 4),
          c("Electiva de Especialidad I", 4),
        ],
      },
      {
        term: "Período VII",
        label: "Cuarto año",
        courses: [
          c("Dirección de Arte", 5),
          c("Portafolio Profesional", 5),
          c("Electiva de Especialidad II", 4),
          c("Emprendimiento Creativo", 3),
          c("Práctica Profesional", 8),
        ],
      },
      {
        term: "Período VIII",
        label: "Cuarto año",
        courses: [
          c("Proyecto de Graduación", 10),
          c("Seminario de Diseño Contemporáneo", 3),
          c("Electiva de Especialidad III", 4),
          c("Exposición y Defensa", 3),
        ],
      },
    ],
    requirements: [
      "Título de educación media o constancia de egreso.",
      "Certificado de calificaciones de los tres años de bachillerato.",
      "Identidad o partida de nacimiento.",
      "Portafolio de ingreso: seis piezas propias, de cualquier técnica.",
      "Entrevista de portafolio con la coordinación de carrera.",
    ],
    careers: [
      "Diseño de producto digital y de interfaces",
      "Dirección de arte e identidad de marca",
      "Diseño editorial y publicaciones",
      "Motion graphics y audiovisual",
      "Front-end y sistemas de diseño",
      "Estudio propio",
    ],
    costs: { enrollment: 9200, perCourse: 2620, coursesTypical: 5, kind: "asignatura" },
    scholarships: ["artistica", "excelencia", "socioeconomica"],
    faculty: ["andres-portillo", "sofia-brenes", "gabriela-suazo"],
    highlights: [
      { value: "20", label: "piezas en el portafolio final" },
      { value: "Semanal", label: "crítica de taller" },
      { value: "4", label: "revisiones con jurado externo" },
    ],
    faq: [
      {
        q: "¿El portafolio de ingreso tiene que ser digital?",
        a: "No. Se aceptan dibujos, fotografía, artesanía, música visualizada o " +
          "cualquier cosa que muestre criterio. Lo que se evalúa es la mirada, no el " +
          "manejo de software.",
      },
      {
        q: "¿Se necesita computadora propia?",
        a: "Recomendable desde el tercer período. El campus tiene dos laboratorios de " +
          "diseño con acceso extendido hasta las 20:00, suficientes para los dos primeros " +
          "años.",
      },
      {
        q: "¿Cuánto código se estudia?",
        a: "Tres asignaturas obligatorias: Introducción al Código, Maquetación Web y " +
          "Front-End para Diseñadores. Suficiente para construir y para conversar de " +
          "igual a igual con un equipo de desarrollo.",
      },
    ],
  },
  {
    slug: "finanzas",
    name: "Finanzas",
    short: "Finanzas",
    levels: ["licenciatura"],
    degree: "Licenciatura",
    areas: ["negocios"],
    modalities: ["presencial", "virtual", "semipresencial"],
    duration: "4 años",
    durationNote: "Ocho períodos académicos",
    campus: "Central",
    shift: "Vespertina y nocturna",
    plate: "series",
    tagline: "Valorar, financiar y decidir bajo incertidumbre, con la hoja abierta.",
    summary:
      "Valoración, riesgo, mercados de capital y finanzas corporativas, con laboratorio " +
      "de modelado financiero desde el segundo año.",
    description:
      "Finanzas es la carrera más cuantitativa del área de negocios de AUREA. Se " +
      "construyen modelos, no se comentan: cada asignatura del itinerario financiero se " +
      "evalúa con un archivo que tiene que correr, cuadrar y resistir un cambio de " +
      "supuestos en vivo.\n\n" +
      "El laboratorio de modelado abre en el Período III y acompaña el resto de la " +
      "carrera. En cuarto año, los estudiantes gestionan una cartera simulada con " +
      "reglas de mandato, comité de inversión y reporte trimestral al claustro.",
    profile: [
      "Construye modelos financieros auditables y los somete a análisis de sensibilidad.",
      "Valora empresas y proyectos con múltiples metodologías.",
      "Mide y gestiona riesgo de mercado, crédito y liquidez.",
      "Estructura financiamiento y evalúa alternativas de capital.",
      "Interpreta el entorno macroeconómico y su efecto sobre las decisiones.",
    ],
    curriculum: [
      {
        term: "Período I",
        label: "Primer año",
        courses: [
          c("Contabilidad Financiera I", 5),
          c("Matemática Aplicada", 5),
          c("Economía General", 4),
          c("Introducción a las Finanzas", 4),
          c("Comunicación Profesional", 3),
        ],
      },
      {
        term: "Período II",
        label: "Primer año",
        courses: [
          c("Contabilidad Financiera II", 5),
          c("Matemática Financiera", 5),
          c("Microeconomía", 4),
          c("Estadística Descriptiva", 4),
          c("Inglés de Negocios I", 3),
        ],
      },
      {
        term: "Período III",
        label: "Segundo año",
        courses: [
          c("Finanzas Corporativas I", 5),
          c("Laboratorio de Modelado I", 5),
          c("Macroeconomía", 4),
          c("Estadística Inferencial", 4),
          c("Derecho Financiero", 3),
        ],
      },
      {
        term: "Período IV",
        label: "Segundo año",
        courses: [
          c("Finanzas Corporativas II", 5),
          c("Laboratorio de Modelado II", 5),
          c("Mercados de Capital", 5),
          c("Contabilidad de Costos", 4),
          c("Inglés de Negocios II", 3),
        ],
      },
      {
        term: "Período V",
        label: "Tercer año",
        courses: [
          c("Valoración de Empresas", 6),
          c("Gestión de Riesgos", 5),
          c("Econometría Financiera", 5),
          c("Instrumentos Derivados", 4),
          c("Ética Financiera", 2),
        ],
      },
      {
        term: "Período VI",
        label: "Tercer año",
        courses: [
          c("Banca y Sistema Financiero", 5),
          c("Evaluación de Proyectos", 5),
          c("Finanzas Internacionales", 4),
          c("Analítica Financiera", 4),
          c("Electiva de Especialidad I", 4),
        ],
      },
      {
        term: "Período VII",
        label: "Cuarto año",
        courses: [
          c("Gestión de Carteras", 6),
          c("Fusiones y Adquisiciones", 4),
          c("Electiva de Especialidad II", 4),
          c("Finanzas Personales y Educación Financiera", 3),
          c("Práctica Profesional", 8),
        ],
      },
      {
        term: "Período VIII",
        label: "Cuarto año",
        courses: [
          c("Proyecto de Graduación", 10),
          c("Comité de Inversión", 4),
          c("Electiva de Especialidad III", 4),
          c("Seminario de Coyuntura", 3),
        ],
      },
    ],
    requirements: [
      "Título de educación media o constancia de egreso.",
      "Certificado de calificaciones de los tres años de bachillerato.",
      "Identidad o partida de nacimiento.",
      "Prueba de admisión con énfasis en razonamiento cuantitativo.",
      "Entrevista con la coordinación de carrera.",
    ],
    careers: [
      "Análisis financiero y valoración",
      "Banca y servicios financieros",
      "Gestión de riesgos",
      "Tesorería corporativa",
      "Evaluación de proyectos de inversión",
    ],
    costs: { enrollment: 8900, perCourse: 2520, coursesTypical: 5, kind: "asignatura" },
    scholarships: ["excelencia", "socioeconomica", "liderazgo"],
    faculty: ["hector-lainez", "patricia-zelaya", "sofia-brenes"],
    highlights: [
      { value: "6", label: "asignaturas de laboratorio" },
      { value: "1", label: "cartera simulada gestionada" },
      { value: "3", label: "modalidades disponibles" },
    ],
    faq: [
      {
        q: "¿Cuánta matemática se necesita al entrar?",
        a: "La del bachillerato, bien aprendida. El programa parte de ahí y sube rápido: " +
          "Matemática Aplicada y Matemática Financiera del primer año son la nivelación.",
      },
      {
        q: "¿El laboratorio usa software con licencia?",
        a: "Hoja de cálculo y Python. Ambos disponibles en el laboratorio y ambos con " +
          "versión gratuita para el estudiante.",
      },
    ],
  },
  {
    slug: "psicologia",
    name: "Psicología",
    short: "Psicología",
    levels: ["licenciatura"],
    degree: "Licenciatura",
    areas: ["salud", "sociales"],
    modalities: ["presencial"],
    duration: "4 años",
    durationNote: "Ocho períodos académicos y práctica supervisada",
    campus: "Central",
    shift: "Matutina y vespertina",
    plate: "circulo",
    tagline: "Escuchar es una técnica. Se aprende, se supervisa y se evalúa.",
    summary:
      "Formación en psicología clínica, educativa y organizacional, con práctica " +
      "supervisada desde el tercer año y énfasis en ética profesional.",
    description:
      "La licenciatura en Psicología de AUREA se organiza en tres itinerarios — " +
      "clínica, educativa y organizacional — sobre un tronco común de dos años que " +
      "cubre procesos psicológicos básicos, desarrollo, evaluación y metodología de " +
      "investigación.\n\n" +
      "La práctica supervisada empieza en el Período V y es lo que distingue al " +
      "programa: doscientas horas por año en centros conveniados, con supervisión " +
      "semanal individual y grupal. La ética no es una asignatura al final; es un " +
      "criterio de evaluación en cada práctica.",
    profile: [
      "Evalúa mediante entrevista, observación e instrumentos estandarizados.",
      "Diseña e implementa intervenciones en contextos clínicos, educativos u organizacionales.",
      "Conduce investigación con diseño metodológico y análisis de datos correctos.",
      "Reconoce los límites de su competencia y deriva cuando corresponde.",
      "Aplica el código deontológico de la profesión en decisiones concretas.",
    ],
    curriculum: [
      {
        term: "Período I",
        label: "Primer año",
        courses: [
          c("Introducción a la Psicología", 4),
          c("Bases Biológicas del Comportamiento", 5),
          c("Historia y Sistemas Psicológicos", 3),
          c("Comunicación Profesional", 3),
          c("Estadística Descriptiva", 4),
        ],
      },
      {
        term: "Período II",
        label: "Primer año",
        courses: [
          c("Procesos Psicológicos Básicos", 5),
          c("Psicología del Desarrollo I", 5),
          c("Neuropsicología", 4),
          c("Metodología de la Investigación", 4),
          c("Antropología Social", 3),
        ],
      },
      {
        term: "Período III",
        label: "Segundo año",
        courses: [
          c("Psicología del Desarrollo II", 5),
          c("Personalidad", 5),
          c("Psicopatología I", 5),
          c("Estadística Inferencial", 4),
          c("Psicología Social", 4),
        ],
      },
      {
        term: "Período IV",
        label: "Segundo año",
        courses: [
          c("Psicopatología II", 5),
          c("Evaluación Psicológica I", 5),
          c("Teorías y Técnicas de Entrevista", 5),
          c("Psicología Educativa", 4),
          c("Ética Profesional", 3),
        ],
      },
      {
        term: "Período V",
        label: "Tercer año",
        courses: [
          c("Evaluación Psicológica II", 5),
          c("Psicoterapia I", 5),
          c("Psicología Organizacional", 4),
          c("Práctica Supervisada I", 6),
          c("Seminario de Casos I", 3),
        ],
      },
      {
        term: "Período VI",
        label: "Tercer año",
        courses: [
          c("Psicoterapia II", 5),
          c("Psicología Comunitaria", 4),
          c("Intervención en Crisis", 4),
          c("Práctica Supervisada II", 6),
          c("Electiva de Itinerario I", 4),
        ],
      },
      {
        term: "Período VII",
        label: "Cuarto año",
        courses: [
          c("Práctica Supervisada III", 8),
          c("Diseño de Programas de Intervención", 5),
          c("Electiva de Itinerario II", 4),
          c("Seminario de Casos II", 3),
          c("Psicofarmacología Básica", 3),
        ],
      },
      {
        term: "Período VIII",
        label: "Cuarto año",
        courses: [
          c("Proyecto de Graduación", 10),
          c("Práctica Supervisada IV", 8),
          c("Electiva de Itinerario III", 4),
          c("Deontología y Marco Legal", 3),
        ],
      },
    ],
    requirements: [
      "Título de educación media o constancia de egreso.",
      "Certificado de calificaciones de los tres años de bachillerato.",
      "Identidad o partida de nacimiento.",
      "Prueba de admisión: comprensión lectora y razonamiento verbal.",
      "Entrevista con el claustro de la carrera.",
      "Carta de motivación de una página.",
    ],
    careers: [
      "Psicología clínica en consulta o institución",
      "Psicología educativa y orientación",
      "Psicología organizacional y gestión de personas",
      "Intervención comunitaria y programas sociales",
      "Investigación y posgrado",
    ],
    costs: { enrollment: 8700, perCourse: 2480, coursesTypical: 5, kind: "asignatura" },
    scholarships: ["excelencia", "socioeconomica", "liderazgo"],
    faculty: ["ines-carrillo", "marcela-fuentes", "sofia-brenes"],
    highlights: [
      { value: "800 h", label: "de práctica supervisada" },
      { value: "3", label: "itinerarios" },
      { value: "11", label: "centros conveniados" },
    ],
    faq: [
      {
        q: "¿Cuándo se elige el itinerario?",
        a: "Al cerrar el Período V, con el acompañamiento del tutor de práctica. Las tres " +
          "electivas de itinerario se cursan en tercero y cuarto año.",
      },
      {
        q: "¿La práctica supervisada es compatible con un trabajo?",
        a: "Con dificultad. La práctica ocupa dos jornadas semanales en horario de la " +
          "institución conveniada, casi siempre matutino. La coordinación acompaña casos " +
          "particulares, pero conviene planificarlo desde el segundo año.",
      },
      {
        q: "¿Hay modalidad virtual?",
        a: "No. La formación en entrevista, evaluación y supervisión de casos exige " +
          "presencia, y el programa prefiere no ofrecer una versión que no podría " +
          "sostener con la misma calidad.",
      },
    ],
  },
];

/* ------------------------------------------------------------- selectors */

export const byLevel = (level) => programs.filter((program) => program.levels.includes(level));
export const bySlug = (slug) => programs.find((program) => program.slug === slug);
export const featured = () => programs.filter((program) => program.featured);

/** Total credits of a plan — computed, never written twice. */
export const totalCredits = (program) =>
  program.curriculum.reduce(
    (sum, term) => sum + term.courses.reduce((termSum, course) => termSum + course.credits, 0),
    0,
  );

export const totalCourses = (program) =>
  program.curriculum.reduce((sum, term) => sum + term.courses.length, 0);

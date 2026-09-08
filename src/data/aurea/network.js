/**
 * The outward-facing half: employability, alumni and international.
 *
 * Three audiences that share one thing — none of them is on campus. The
 * employer wants to know what the graduate can do, the alumnus wants to know
 * what the institution still offers them, and the international applicant
 * wants to know whether any of this is possible from where they are. Each gets
 * its own collection rather than a paragraph on a shared page.
 *
 * Invented, including every company name: the “empresas aliadas” below are
 * fictional so that no real employer appears to endorse a demonstration.
 */

/* --------------------------------------------------------- employability */

export const employability = {
  title: "De la universidad al mundo profesional.",
  lead:
    "El acompañamiento no empieza en el último período. Empieza en el tercer año, con " +
    "la práctica profesional, y sigue después de la graduación.",
  facts: [
    { value: "92 %", label: "empleabilidad a doce meses", note: "Medición interna 2026" },
    { value: "68 %", label: "trabaja en el área de su carrera", note: "Encuesta de egresados 2026" },
    { value: "1 de 3", label: "recibe oferta de su práctica", note: "Cohortes 2024 – 2026" },
    { value: "22", label: "empresas en la feria laboral", note: "Edición noviembre 2026" },
  ],
  services: [
    {
      name: "Bolsa de empleo",
      text: "Publicaciones verificadas por la coordinación, con filtro por carrera y por nivel de experiencia. Abierta a estudiantes de último año y egresados.",
    },
    {
      name: "Prácticas profesionales",
      text: "Obligatorias en las seis licenciaturas y en los dos bachilleratos técnicos. La coordinación gestiona la plaza, el convenio y la evaluación conjunta con la empresa.",
    },
    {
      name: "Orientación profesional",
      text: "Revisión de hoja de vida, perfil profesional en línea y simulación de entrevista con retroalimentación grabada.",
    },
    {
      name: "Ferias laborales",
      text: "Dos por año lectivo. Las empresas reciben hojas de vida y realizan entrevistas en sitio el mismo día.",
    },
  ],
  partners: [
    { name: "Meridian Software", sector: "Tecnología", note: "Prácticas y contratación directa" },
    { name: "Grupo Corvalán", sector: "Retail y distribución", note: "Prácticas administrativas y financieras" },
    { name: "Banco Altamira", sector: "Servicios financieros", note: "Programa de trainees" },
    { name: "Estudio Norvik", sector: "Diseño y comunicación", note: "Prácticas creativas" },
    { name: "Clínica Sanare", sector: "Salud", note: "Práctica supervisada de psicología" },
    { name: "Loma Verde Agroindustria", sector: "Agroindustria", note: "Prácticas de operaciones" },
    { name: "Textiles Bahía", sector: "Manufactura", note: "Prácticas de administración y calidad" },
    { name: "Consultora Aldea", sector: "Consultoría", note: "Proyectos con el Observatorio Empresarial" },
  ],
};

/* ------------------------------------------------------------------ alumni */

export const alumni = {
  title: "Red AUREA",
  lead:
    "Seis mil doscientos egresados desde 2004. La red no es una lista de correo: es " +
    "acceso a la biblioteca, descuento en educación continua, bolsa de empleo y un " +
    "directorio que se usa.",
  facts: [
    { value: "6,200", label: "egresados" },
    { value: "22", label: "años de graduaciones" },
    { value: "14", label: "países donde residen" },
  ],
  benefits: [
    { name: "Biblioteca y bases de datos", text: "Acceso vitalicio al catálogo físico y a las bases de datos digitales." },
    { name: "Educación continua", text: "40 % de descuento en diplomados y cursos cortos de la institución." },
    { name: "Bolsa de empleo", text: "Acceso permanente a las publicaciones verificadas y al servicio de orientación." },
    { name: "Directorio profesional", text: "Contacto entre egresados por carrera, sector y ciudad, con consentimiento explícito." },
    { name: "Eventos", text: "Encuentro anual de egresados, charlas de actualización y regreso a casa por promoción." },
    { name: "Uso del campus", text: "Biblioteca, centro deportivo y espacios de trabajo con carné de egresado vigente." },
  ],
  stories: [
    {
      name: "Andrea Núñez",
      program: "Ingeniería en Sistemas",
      year: "2022",
      now: "Ingeniera de plataforma en una empresa de software regional",
      quote:
        "Salí sabiendo desplegar, monitorear y explicar por qué. Los tres proyectos " +
        "integradores valieron más que cualquier certificación que saqué después.",
    },
    {
      name: "Josué Cárcamo",
      program: "Administración de Empresas",
      year: "2019",
      now: "Fundador de una distribuidora con dieciocho empleados",
      quote:
        "El Observatorio me puso frente a doce empresas antes de graduarme. Aprendí más " +
        "de los errores de otros que de los casos del libro.",
    },
    {
      name: "Melissa Ordóñez",
      program: "Diseño Digital",
      year: "2023",
      now: "Diseñadora de producto en un estudio independiente",
      quote:
        "Llegué a la primera entrevista con veinte piezas defendidas ante jurado. No " +
        "tuve que explicar qué sabía hacer: se veía.",
    },
  ],
  continuing: [
    { name: "Diplomado en Analítica de Negocios", duration: "4 meses", mode: "Semipresencial" },
    { name: "Diplomado en Desarrollo Web Full Stack", duration: "6 meses", mode: "Virtual" },
    { name: "Curso de Gestión de Proyectos", duration: "8 semanas", mode: "Virtual" },
    { name: "Diplomado en Intervención Psicoeducativa", duration: "5 meses", mode: "Presencial" },
    { name: "Curso de Diseño de Sistemas de Diseño", duration: "10 semanas", mode: "Virtual" },
  ],
};

/* ----------------------------------------------------------- international */

export const international = {
  title: "AUREA fuera de AUREA.",
  lead:
    "Movilidad para los estudiantes de la casa, admisión para quienes vienen de fuera y " +
    "convenios que hacen posibles las dos cosas.",
  facts: [
    { value: "12", label: "plazas de movilidad por año" },
    { value: "3", label: "universidades socias" },
    { value: "9", label: "estudiantes internacionales" },
  ],
  mobility: [
    {
      name: "Intercambio académico",
      text: "Un período completo en una universidad socia, con reconocimiento total de créditos. Doce plazas por año, por concurso de expediente.",
      requirements: ["Promedio de 85 o superior", "Tercer o cuarto año", "Plan de estudios aprobado por coordinación", "Idioma acreditado cuando corresponda"],
    },
    {
      name: "Estancia corta de investigación",
      text: "Cuatro a ocho semanas en un centro socio, vinculada a un proyecto activo de investigación.",
      requirements: ["Vinculación a un centro de AUREA", "Aval del investigador responsable", "Proyecto en curso"],
    },
    {
      name: "Programas de verano",
      text: "Cursos intensivos de tres a cinco semanas en universidades socias, con crédito reconocido como electiva.",
      requirements: ["Cualquier año de la licenciatura", "Promedio de 80 o superior"],
    },
  ],
  incoming: [
    { step: "01", title: "Verificación de estudios", text: "Registro Académico revisa el expediente y emite el dictamen de equivalencias en diez días hábiles." },
    { step: "02", title: "Solicitud de admisión", text: "El mismo formulario que el ingreso regular, con la documentación apostillada o legalizada." },
    { step: "03", title: "Carta de aceptación", text: "Se emite una vez completado el expediente y sirve como respaldo para el trámite migratorio." },
    { step: "04", title: "Trámite migratorio", text: "Relaciones Internacionales acompaña la gestión ante las autoridades correspondientes. La resolución no depende de la institución." },
    { step: "05", title: "Inducción y acompañamiento", text: "Alojamiento orientado, tutor asignado y acompañamiento durante el primer período." },
  ],
  agreements: [
    { name: "Universidad del Río Bravo", country: "México", scope: "Intercambio semestral · Ingeniería y Negocios" },
    { name: "Instituto Politécnico Andino", country: "Colombia", scope: "Intercambio semestral y estancias de investigación" },
    { name: "Escola Superior de Sintra", country: "Portugal", scope: "Programas de verano · Diseño y Mercadotecnia" },
  ],
};

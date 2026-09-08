/**
 * The three private products, as demonstrations.
 *
 * A public site sells the institution; these three sell the platform. They are
 * the answer to the question a director asks after seeing the homepage — “and
 * do you also build the part our students actually log into?” — so they are
 * built as interfaces rather than as screenshots: real markup, real tabs, real
 * keyboard behaviour, with invented data in them.
 *
 * No back end and no authentication. Every screen is generated at build time
 * from the objects below and carries a banner saying what it is. Nothing here
 * is a real student, a real grade or a real balance.
 */

/* ----------------------------------------------------------- student portal */

export const student = {
  name: "Andrea",
  fullName: "Andrea Núñez Bonilla",
  id: "20260418",
  program: "Ingeniería en Sistemas",
  term: "Período II · 2026",
  year: "Tercer año",
  advisor: "Daniel Espinoza",
  greeting: "Buenos días",
  nextClass: {
    course: "Programación II",
    time: "10:00 – 11:40",
    room: "Laboratorio de cómputo B",
    teacher: "Daniel Espinoza",
    in: "en 35 minutos",
  },
  courses: [
    { code: "IS-204", name: "Programación II", teacher: "Daniel Espinoza", schedule: "Lun · Mié · Vie 10:00", progress: 62, grade: 91 },
    { code: "IS-206", name: "Bases de Datos I", teacher: "Karla Medrano", schedule: "Mar · Jue 8:00", progress: 58, grade: 88 },
    { code: "MA-201", name: "Probabilidad y Estadística", teacher: "Sofía Brenes", schedule: "Mar · Jue 14:00", progress: 55, grade: 84 },
    { code: "IS-208", name: "Sistemas Operativos", teacher: "Óscar Benítez", schedule: "Lun · Mié 16:00", progress: 60, grade: 86 },
    { code: "GE-110", name: "Inglés Técnico", teacher: "Lucía Mejía", schedule: "Vie 14:00", progress: 71, grade: 94 },
  ],
  grades: [
    { course: "Programación II", item: "Parcial I", score: 94, max: 100, date: "2026-09-04" },
    { course: "Inglés Técnico", item: "Presentación oral", score: 96, max: 100, date: "2026-09-03" },
    { course: "Bases de Datos I", item: "Laboratorio 3", score: 88, max: 100, date: "2026-09-02" },
    { course: "Probabilidad y Estadística", item: "Tarea 4", score: 79, max: 100, date: "2026-08-30" },
  ],
  pending: [
    { course: "Bases de Datos I", task: "Modelo entidad-relación del proyecto", due: "2026-09-09", state: "proxima" },
    { course: "Sistemas Operativos", task: "Informe de planificación de procesos", due: "2026-09-11", state: "proxima" },
    { course: "Programación II", task: "Proyecto integrador · entrega 2", due: "2026-09-15", state: "abierta" },
  ],
  account: {
    balance: 6125,
    status: "Al día",
    nextDue: "2026-09-25",
    nextAmount: 6125,
    plan: "Pago mensual sin recargo",
    scholarship: "Beca Excelencia · 60 %",
    history: [
      { date: "2026-08-25", concept: "Mensualidad agosto", amount: 6125, state: "pagado" },
      { date: "2026-07-25", concept: "Mensualidad julio", amount: 6125, state: "pagado" },
      { date: "2026-07-02", concept: "Matrícula Período II", amount: 9800, state: "pagado" },
    ],
  },
  documents: [
    { name: "Constancia de estudios", state: "Listo para descargar", date: "2026-09-01" },
    { name: "Historial académico", state: "Listo para descargar", date: "2026-08-15" },
    { name: "Certificación de calificaciones", state: "En proceso · 6 días hábiles", date: "2026-09-03" },
  ],
  events: [
    { date: "2026-09-18", title: "Feria de Carreras 2027", place: "Explanada Central" },
    { date: "2026-10-03", title: "Semana de Innovación", place: "Centro de Innovación" },
    { date: "2026-10-13", title: "Exámenes parciales", place: "Aulas asignadas" },
  ],
  shortcuts: [
    { label: "Campus virtual", note: "Cursos, materiales y entregas" },
    { label: "Biblioteca digital", note: "Bases de datos y repositorio" },
    { label: "Reservar sala de estudio", note: "Bloques de dos horas" },
    { label: "Solicitar constancia", note: "Tres días hábiles" },
    { label: "Agendar tutoría", note: "Lunes a viernes, 14:00 – 18:00" },
    { label: "Soporte tecnológico", note: "Cuenta, acceso y laboratorios" },
  ],
};

/* ------------------------------------------------------------ parent portal */

export const parent = {
  guardian: "Sra. Martínez",
  child: {
    name: "Daniel Martínez",
    grade: "10.º grado · sección B",
    program: "Bachillerato en Ciencias y Humanidades",
    guide: "Lucía Mejía",
    id: "M-10B-14",
  },
  attendance: {
    rate: 96,
    present: 48,
    absences: 2,
    late: 1,
    period: "Del 5 de agosto al 5 de septiembre",
    detail: [
      { date: "2026-08-19", state: "ausencia", note: "Justificada · cita médica" },
      { date: "2026-08-27", state: "tardanza", note: "12 minutos" },
      { date: "2026-09-02", state: "ausencia", note: "Justificada · enfermedad" },
    ],
  },
  grades: [
    { subject: "Matemática I", teacher: "Rodrigo Alvarenga", partial: 88, average: 86 },
    { subject: "Español y Literatura I", teacher: "Lucía Mejía", partial: 92, average: 90 },
    { subject: "Biología", teacher: "Rodrigo Alvarenga", partial: 84, average: 85 },
    { subject: "Historia de Honduras", teacher: "Inés Carrillo", partial: 90, average: 89 },
    { subject: "Inglés I", teacher: "Lucía Mejía", partial: 79, average: 82 },
    { subject: "Informática Aplicada", teacher: "Daniel Espinoza", partial: 95, average: 93 },
  ],
  homework: [
    { subject: "Matemática I", task: "Ejercicios de funciones · páginas 44 a 46", due: "2026-09-09", state: "pendiente" },
    { subject: "Biología", task: "Informe de laboratorio: célula vegetal", due: "2026-09-10", state: "pendiente" },
    { subject: "Español y Literatura I", task: "Ensayo argumentativo · borrador", due: "2026-09-12", state: "pendiente" },
    { subject: "Inglés I", task: "Unidad 3 · ejercicios en línea", due: "2026-09-07", state: "entregado" },
  ],
  account: {
    balance: 3450,
    status: "Al día",
    nextDue: "2026-09-25",
    nextAmount: 3450,
    plan: "Diez cuotas · sin recargo",
    scholarship: "Sin beca",
    history: [
      { date: "2026-08-25", concept: "Mensualidad agosto", amount: 3450, state: "pagado" },
      { date: "2026-07-25", concept: "Mensualidad julio", amount: 3450, state: "pagado" },
      { date: "2026-06-20", concept: "Matrícula 2026", amount: 6800, state: "pagado" },
    ],
  },
  notices: [
    { date: "2026-09-05", title: "Entrega de calificaciones del primer parcial", text: "6 de noviembre, de 14:00 a 18:00, con cita reservable desde este portal." },
    { date: "2026-09-02", title: "Salida pedagógica al Centro de Innovación", text: "Requiere autorización firmada. Disponible en la sección de documentos." },
    { date: "2026-08-28", title: "Campaña de vacunación escolar", text: "12 de septiembre, jornada matutina. Presentar carné de vacunación." },
  ],
  teachers: [
    { name: "Lucía Mejía", role: "Docente guía · Español e Inglés", email: "l.mejia@aurea.example", hours: "Miércoles, 9:00 – 12:00" },
    { name: "Rodrigo Alvarenga", role: "Matemática y Ciencias", email: "r.alvarenga@aurea.example", hours: "Martes y jueves, 11:00 – 13:00" },
    { name: "Inés Carrillo", role: "Ciencias Sociales y orientación", email: "i.carrillo@aurea.example", hours: "Lunes a viernes, 8:00 – 12:00" },
  ],
  meetingSlots: [
    { date: "2026-09-16", time: "14:30", teacher: "Lucía Mejía" },
    { date: "2026-09-17", time: "15:00", teacher: "Rodrigo Alvarenga" },
    { date: "2026-09-18", time: "16:00", teacher: "Inés Carrillo" },
    { date: "2026-09-19", time: "14:00", teacher: "Lucía Mejía" },
  ],
};

/* ------------------------------------------------------------ virtual campus */

/**
 * AUREA Virtual — a preview, and only a preview.
 *
 * The brief is explicit that this must not turn into a learning management
 * system, and it is right: an LMS is six months of work and would tell a
 * prospective client nothing that this screen does not. So it shows the six
 * surfaces a course has and stops there, with a line saying what the real
 * integration would replace.
 */
export const virtualCampus = {
  student: "Andrea Núñez",
  term: "Período II · 2026",
  courses: [
    { code: "IS-204", name: "Programación II", teacher: "Daniel Espinoza", unread: 3, progress: 62 },
    { code: "IS-206", name: "Bases de Datos I", teacher: "Karla Medrano", unread: 1, progress: 58 },
    { code: "MA-201", name: "Probabilidad y Estadística", teacher: "Sofía Brenes", unread: 0, progress: 55 },
    { code: "IS-208", name: "Sistemas Operativos", teacher: "Óscar Benítez", unread: 5, progress: 60 },
  ],
  surfaces: [
    { name: "Mis cursos", text: "Cada asignatura con su programa, su docente y su avance." },
    { name: "Tareas pendientes", text: "Entregas con fecha, estado y retroalimentación del docente." },
    { name: "Materiales", text: "Lecturas, presentaciones y recursos, organizados por unidad." },
    { name: "Videoclases", text: "Grabaciones de sesión con marcadores por tema." },
    { name: "Evaluaciones", text: "Cuestionarios, exámenes en línea y rúbricas publicadas de antemano." },
    { name: "Foros", text: "Discusión por unidad, con moderación docente y respuesta entre pares." },
  ],
  activity: [
    { course: "Sistemas Operativos", text: "Nuevo material: planificación de procesos (PDF)", when: "hace 2 horas" },
    { course: "Programación II", text: "Retroalimentación publicada en Proyecto integrador · entrega 1", when: "hace 5 horas" },
    { course: "Bases de Datos I", text: "Nueva discusión en el foro de la unidad 3", when: "ayer" },
    { course: "Sistemas Operativos", text: "Videoclase disponible: memoria virtual", when: "ayer" },
  ],
};

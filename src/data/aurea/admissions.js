/**
 * Admissions — the process, the dates, the money and the paperwork.
 *
 * This is the section a school website exists for, and the one most of them
 * get wrong: the process is described in a paragraph, the dates live in a PDF
 * and the cost is a phone call. Here the three are content types, so the same
 * date renders in the admissions timeline, the institutional calendar and the
 * homepage strip without being written three times.
 *
 * Two of the pieces below drive interfaces rather than text — `checklist`
 * feeds the progress tracker and `scholarships` feeds the simulator. Both are
 * front-end only. Nothing is submitted anywhere and nothing is stored beyond
 * the reader’s own browser.
 */

/* ------------------------------------------------------------ the process */

/**
 * The two tracks.
 *
 * Educación media and educación superior share the shape of the process and
 * almost nothing else: who applies, what is evaluated and what the family has
 * to bring are different, and merging them into one list of six steps would
 * make both of them vague.
 */
export const tracks = [
  {
    id: "media",
    label: "Educación Media",
    audience: "Para estudiantes que terminan noveno grado",
    lead:
      "El ingreso a décimo grado se resuelve entre septiembre y febrero. La familia " +
      "participa en dos momentos: la entrevista y la matrícula.",
    steps: [
      {
        number: "01",
        title: "Explora los bachilleratos",
        text: "Tres opciones: Ciencias y Humanidades, BTP en Informática y BTP en Administración. El décimo grado es común, así que la decisión no es irreversible.",
      },
      {
        number: "02",
        title: "Completa la solicitud",
        text: "En línea, con los datos del estudiante y de la familia. Toma unos quince minutos y se puede guardar a medio camino.",
      },
      {
        number: "03",
        title: "Entrega la documentación",
        text: "Certificado de noveno grado, partida de nacimiento, identidad del tutor y dos fotografías. Se admite copia digital para la revisión y original en la matrícula.",
      },
      {
        number: "04",
        title: "Prueba de ubicación y entrevista",
        text: "Una prueba de matemática y español —que ubica, no descarta— y una entrevista familiar con el equipo de orientación.",
      },
      {
        number: "05",
        title: "Resultado de admisión",
        text: "Se comunica por correo y queda disponible en el portal de la solicitud. Incluye la resolución de beca si se solicitó.",
      },
      {
        number: "06",
        title: "Matrícula",
        text: "Pago de matrícula, entrega de originales, asignación de sección y entrega del carné. La primera semana de clases empieza con inducción.",
      },
    ],
  },
  {
    id: "superior",
    label: "Educación Superior",
    audience: "Para egresados de educación media",
    lead:
      "El ingreso a una licenciatura se resuelve en cuatro a seis semanas. El egresado " +
      "de AUREA queda exento de la prueba de admisión.",
    steps: [
      {
        number: "01",
        title: "Explora los programas",
        text: "Seis licenciaturas. Cada una publica plan de estudios, perfil de egreso, costos y campo laboral antes de que preguntes.",
      },
      {
        number: "02",
        title: "Completa la solicitud",
        text: "En línea. Diseño Digital pide además seis piezas de portafolio; Psicología, una carta de motivación de una página.",
      },
      {
        number: "03",
        title: "Entrega la documentación",
        text: "Título o constancia de egreso, certificado de calificaciones de los tres años e identidad. Registro valida en un plazo de cinco días hábiles.",
      },
      {
        number: "04",
        title: "Prueba de admisión y entrevista",
        text: "Razonamiento y comprensión lectora, con el énfasis que pide cada carrera. La entrevista es con la coordinación del programa.",
      },
      {
        number: "05",
        title: "Resultado de admisión",
        text: "Carta de admisión con el itinerario sugerido del primer período y la resolución de beca, si se solicitó.",
      },
      {
        number: "06",
        title: "Matrícula",
        text: "Selección de asignaturas con el asesor académico, pago de matrícula y activación del correo institucional y del campus virtual.",
      },
    ],
  },
];

/** Documents, split by who has to produce them. */
export const documents = {
  media: [
    { label: "Certificado de noveno grado", note: "Original o constancia de estar cursándolo" },
    { label: "Partida de nacimiento", note: "Copia legible" },
    { label: "Identidad del estudiante", note: "Si ya la tiene" },
    { label: "Identidad de padre, madre o tutor", note: "Copia" },
    { label: "Dos fotografías tamaño carné", note: "Fondo blanco" },
    { label: "Constancia de conducta", note: "Del centro de procedencia" },
  ],
  superior: [
    { label: "Título de educación media", note: "O constancia de egreso" },
    { label: "Certificado de calificaciones", note: "Los tres años de bachillerato" },
    { label: "Identidad o partida de nacimiento", note: "Copia legible" },
    { label: "Dos fotografías tamaño carné", note: "Fondo blanco" },
    { label: "Portafolio de ingreso", note: "Solo Diseño Digital · seis piezas" },
    { label: "Carta de motivación", note: "Solo Psicología · una página" },
  ],
};

/* ---------------------------------------------------------------- dates */

/**
 * The admissions calendar.
 *
 * Every entry also appears in the institutional calendar under the
 * `admisiones` category — `calendar.js` imports this array rather than
 * repeating it, so a date changed here changes everywhere.
 */
export const keyDates = [
  {
    date: "2026-09-15",
    title: "Inicio de admisiones",
    text: "Abre la solicitud en línea para educación media y superior.",
    state: "abierta",
  },
  {
    date: "2026-11-30",
    title: "Primera fecha prioritaria",
    text: "Las solicitudes recibidas hasta esta fecha se resuelven primero y compiten por el fondo completo de becas.",
    state: "proxima",
  },
  {
    date: "2027-01-15",
    title: "Cierre de solicitud de becas",
    text: "Última fecha para presentar el expediente socioeconómico y las cartas de respaldo.",
    state: "proxima",
  },
  {
    date: "2027-02-10",
    title: "Prueba de admisión",
    text: "Jornada única, presencial, en el Campus Central. Segunda convocatoria el 24 de febrero.",
    state: "proxima",
  },
  {
    date: "2027-02-28",
    title: "Resultados de admisión",
    text: "Publicación en el portal de la solicitud y envío por correo, con resolución de beca incluida.",
    state: "proxima",
  },
  {
    date: "2027-03-10",
    title: "Matrícula de primer ingreso",
    text: "Del 10 al 20 de marzo, con cita asignada. Las clases inician el 5 de abril.",
    state: "proxima",
  },
];

/* ------------------------------------------------------------- checklist */

/**
 * The application tracker.
 *
 * A front-end demonstration of the one screen a real admissions portal needs:
 * where am I, what is missing, how much is left. The state lives in
 * `localStorage` under a single key, so a reader who ticks four boxes and
 * comes back tomorrow finds them ticked — and a reader with storage disabled
 * gets a tracker that still works for the session.
 *
 * `done` is the state the demo *starts* in, so the progress bar is not at zero
 * the first time anyone sees it.
 */
export const checklist = [
  { id: "cuenta", label: "Crear cuenta", note: "Correo y contraseña", done: true },
  { id: "personal", label: "Información personal", note: "Datos del estudiante y de la familia", done: true },
  { id: "programa", label: "Elegir programa", note: "Nivel, carrera y modalidad", done: false },
  { id: "documentos", label: "Cargar documentos", note: "Identidad, certificados y fotografías", done: false },
  { id: "historial", label: "Historial académico", note: "Calificaciones del centro de procedencia", done: false },
  { id: "beca", label: "Solicitud de beca", note: "Opcional · expediente socioeconómico", done: false },
  { id: "entrevista", label: "Agendar entrevista", note: "Presencial o por videollamada", done: false },
  { id: "enviar", label: "Enviar solicitud", note: "Revisión final y envío", done: false },
];

/* ------------------------------------------------------------ scholarships */

/**
 * The five scholarship programmes.
 *
 * `criteria` is what the simulator reads. It is deliberately coarse — a
 * threshold on a grade average, a flag on extracurricular activity, a level of
 * declared financial need — because the simulator must never look like a
 * resolution. It reports which programmes a profile could *apply* to, and the
 * copy around it says so in as many words.
 */
export const scholarships = [
  {
    id: "excelencia",
    name: "Beca Excelencia",
    benefit: "Hasta 60 % de la mensualidad",
    benefitShort: "60 %",
    summary: "Para el expediente académico sobresaliente, en media y en superior.",
    requirements: [
      "Promedio general de 90 o superior en el último año cursado.",
      "Sin asignaturas reprobadas en el expediente.",
      "Carta de recomendación de un docente.",
      "Mantener promedio de 88 durante la vigencia.",
    ],
    deadline: "2027-01-15",
    renewable: "Anual, sujeta a promedio",
    criteria: { grade: 90 },
    quota: "40 becas por año",
  },
  {
    id: "deportiva",
    name: "Beca Deportiva",
    benefit: "Hasta 50 % de la mensualidad",
    benefitShort: "50 %",
    summary: "Para quien compite en representación de la institución.",
    requirements: [
      "Promedio general de 75 o superior.",
      "Prueba técnica con el cuerpo de entrenadores.",
      "Compromiso de entrenamiento y competencia durante el año lectivo.",
      "Historial deportivo federado o escolar comprobable.",
    ],
    deadline: "2027-01-15",
    renewable: "Anual, sujeta a participación",
    criteria: { grade: 75, activity: "deporte" },
    quota: "25 becas por año",
  },
  {
    id: "artistica",
    name: "Beca Artística",
    benefit: "Hasta 50 % de la mensualidad",
    benefitShort: "50 %",
    summary: "Para música, teatro, danza, artes visuales y producción audiovisual.",
    requirements: [
      "Promedio general de 75 o superior.",
      "Audición o portafolio, según la disciplina.",
      "Participación en los elencos y muestras institucionales.",
      "Carta de un maestro o director de la disciplina.",
    ],
    deadline: "2027-01-15",
    renewable: "Anual, sujeta a participación",
    criteria: { grade: 75, activity: "arte" },
    quota: "20 becas por año",
  },
  {
    id: "socioeconomica",
    name: "Beca Socioeconómica",
    benefit: "Del 25 % al 80 % de la mensualidad",
    benefitShort: "25–80 %",
    summary: "Para familias cuya situación económica pone en riesgo la continuidad del estudiante.",
    requirements: [
      "Promedio general de 70 o superior.",
      "Estudio socioeconómico realizado por Bienestar Estudiantil.",
      "Documentación de ingresos del grupo familiar.",
      "Entrevista domiciliaria.",
    ],
    deadline: "2027-01-15",
    renewable: "Anual, con revisión del estudio",
    criteria: { grade: 70, need: ["media", "alta"] },
    quota: "Fondo anual, sin cupo fijo",
  },
  {
    id: "liderazgo",
    name: "Beca Liderazgo",
    benefit: "Hasta 40 % de la mensualidad",
    benefitShort: "40 %",
    summary: "Para quien ya sostiene un proyecto: un club, una organización, una iniciativa comunitaria.",
    requirements: [
      "Promedio general de 80 o superior.",
      "Evidencia de un proyecto propio sostenido al menos un año.",
      "Dos cartas de respaldo.",
      "Participación en el consejo estudiantil o en un club durante la vigencia.",
    ],
    deadline: "2027-01-15",
    renewable: "Anual, sujeta a participación",
    criteria: { grade: 80, activity: ["liderazgo", "voluntariado"] },
    quota: "30 becas por año",
  },
];

/** The options the simulator offers. Ids match the `criteria` above. */
export const simulatorOptions = {
  activities: [
    { id: "ninguna", label: "Ninguna por ahora" },
    { id: "deporte", label: "Deporte de competencia" },
    { id: "arte", label: "Arte, música o teatro" },
    { id: "liderazgo", label: "Liderazgo estudiantil" },
    { id: "voluntariado", label: "Voluntariado o servicio comunitario" },
  ],
  needs: [
    { id: "baja", label: "No requiero apoyo económico" },
    { id: "media", label: "Requiero apoyo parcial" },
    { id: "alta", label: "Requiero apoyo significativo" },
  ],
};

/* ---------------------------------------------------------------- costs */

/**
 * What the calculator adds on top of the programme.
 *
 * Programme-specific figures live with the programme in `programs.js`; these
 * are the institution-wide ones. Splitting them that way is what lets the
 * calculator price nine programmes without a table of nine totals that would
 * be wrong the first time a fee changed.
 */
export const fees = {
  registration: 850,
  registrationLabel: "Cuota de admisión",
  registrationNote: "Se paga una sola vez, con la solicitud",
  extras: [
    { id: "laboratorio", label: "Laboratorio y talleres", amount: 1450, note: "Por período · solo programas con laboratorio" },
    { id: "tecnologia", label: "Servicios tecnológicos", amount: 780, note: "Por período · campus virtual, correo y biblioteca digital" },
    { id: "seguro", label: "Seguro estudiantil", amount: 620, note: "Anual" },
    { id: "graduacion", label: "Derechos de graduación", amount: 4200, note: "Último período" },
  ],
  /* Payment plans, as discount or surcharge on the period total. */
  plans: [
    { id: "contado", label: "Pago de contado", modifier: -0.07, note: "7 % de descuento sobre el período" },
    { id: "mensual", label: "Pago mensual", modifier: 0, note: "Sin recargo" },
    { id: "diferido", label: "Diferido a 6 cuotas", modifier: 0.04, note: "4 % de recargo administrativo" },
  ],
  /* Scholarship brackets the calculator offers. Coarse on purpose. */
  discounts: [
    { id: "ninguna", label: "Sin beca", rate: 0 },
    { id: "25", label: "Beca del 25 %", rate: 0.25 },
    { id: "40", label: "Beca del 40 %", rate: 0.4 },
    { id: "50", label: "Beca del 50 %", rate: 0.5 },
    { id: "60", label: "Beca del 60 %", rate: 0.6 },
  ],
};

/**
 * Financing, in the plainest words the institution can manage.
 *
 * A family that cannot pay in one go needs to know the alternative exists
 * before it needs to know the interest rate.
 */
export const financing = [
  {
    title: "Plan mensual sin recargo",
    text: "Diez cuotas iguales para educación media, cinco por período para educación superior. Es el plan por defecto y no cuesta más que pagar de contado por partes.",
  },
  {
    title: "Descuento por pago anticipado",
    text: "7 % sobre el total del período si se cancela antes del inicio de clases.",
  },
  {
    title: "Descuento por hermanos",
    text: "10 % sobre la mensualidad del segundo hijo y 15 % del tercero, acumulable con beca hasta un tope del 80 %.",
  },
  {
    title: "Convenio empresarial",
    text: "Empresas aliadas con convenio vigente obtienen 12 % para sus colaboradores y familiares directos.",
  },
  {
    title: "Reprogramación de pagos",
    text: "Ante una situación sobreviniente, Finanzas Estudiantiles reprograma el saldo del período sin recargo, una vez por año lectivo.",
  },
];
